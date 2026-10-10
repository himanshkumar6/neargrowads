import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(['hr', 'admin']);
    if (!auth.success) return auth.response;

    const { supabase } = auth;
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get('user_id');
    const monthStr = searchParams.get('month') || new Date().toISOString().slice(0, 7); // e.g. "2026-08"

    if (!userId) {
      return NextResponse.json({ success: false, error: 'user_id query parameter is required' }, { status: 400 });
    }

    const [year, month] = monthStr.split('-').map(Number);
    const startDate = `${monthStr}-01`;
    const lastDayNum = new Date(year, month, 0).getDate();
    const endDate = `${monthStr}-${String(lastDayNum).padStart(2, '0')}`;

    // 1. Fetch employee profile
    const { data: employee, error: empErr } = await supabase
      .from('profiles')
      .select('id, full_name, email, employee_id, department_id, departments(code, name)')
      .eq('id', userId)
      .single();

    if (empErr || !employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // 2. Fetch attendance records for the month
    const { data: attendanceRecords } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .gte('work_date', startDate)
      .lte('work_date', endDate);

    // 3. Fetch approved leave requests for the month
    const { data: approvedLeaves } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .lte('start_date', endDate)
      .gte('end_date', startDate);

    // Map records by date
    const attendanceMap = new Map();
    (attendanceRecords || []).forEach((rec) => {
      attendanceMap.set(rec.work_date, rec);
    });

    const calendarDays = [];
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    for (let day = 1; day <= lastDayNum; day++) {
      const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(year, month - 1, day);
      const isWeekend = dateObj.getDay() === 0; // Only Sunday is the off-day / Weekend (Saturdays are Working Days)

      const record = attendanceMap.get(dateStr);
      const isOnLeave = (approvedLeaves || []).some(
        (l) => l.start_date <= dateStr && l.end_date >= dateStr
      );

      let status = 'empty'; // default
      if (record) {
        status = record.status; // 'present', 'late', 'absent', etc.
      } else if (isOnLeave) {
        status = 'on_leave';
      }

      if (status === 'present' || status === 'late') presentCount++;
      if (status === 'absent') absentCount++;
      if (status === 'on_leave') leaveCount++;

      calendarDays.push({
        day,
        date: dateStr,
        dayOfWeek: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        isWeekend,
        status,
        checkIn: record?.check_in_time ? new Date(record.check_in_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : null,
        checkOut: record?.check_out_time ? new Date(record.check_out_time).toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) : null,
        location: record?.location_check_in?.address || null,
        notes: record?.notes || null,
      });
    }

    return NextResponse.json({
      success: true,
      month: monthStr,
      employee,
      summary: {
        totalDays: lastDayNum,
        presentDays: presentCount,
        absentDays: absentCount,
        leaveDays: leaveCount,
      },
      calendarDays,
    });
  } catch (error: unknown) {
    console.error('Calendar API Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
