import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

// POST: Mark absent for active employees who have no punch-in record and no approved leave
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['hr', 'admin']);
    if (!auth.success) return auth.response;

    const { supabase } = auth;
    const body = await req.json().catch(() => ({}));

    // Target date (defaults to today)
    const targetDate = body.date || new Date().toISOString().split('T')[0];

    // 1. Fetch all active employees (excluding HR/Admin if desired, or all active staff)
    const { data: activeEmployees, error: empErr } = await supabase
      .from('profiles')
      .select('id, full_name, email, employee_id')
      .eq('is_active', true)
      .eq('role', 'employee');

    if (empErr) {
      return NextResponse.json({ success: false, error: empErr.message }, { status: 500 });
    }

    if (!activeEmployees || activeEmployees.length === 0) {
      return NextResponse.json({ success: true, message: 'No active employees found', markedCount: 0 });
    }

    // 2. Fetch existing attendance records for target date
    const { data: existingRecords } = await supabase
      .from('attendance_records')
      .select('user_id')
      .eq('work_date', targetDate);

    const attendedUserIds = new Set((existingRecords || []).map((r) => r.user_id));

    // 3. Fetch approved leaves for target date
    const { data: approvedLeaves } = await supabase
      .from('leave_requests')
      .select('user_id')
      .eq('status', 'approved')
      .lte('start_date', targetDate)
      .gte('end_date', targetDate);

    const onLeaveUserIds = new Set((approvedLeaves || []).map((l) => l.user_id));

    // 4. Identify absent employees (No attendance record AND not on approved leave)
    const absentEmployees = activeEmployees.filter(
      (emp) => !attendedUserIds.has(emp.id) && !onLeaveUserIds.has(emp.id)
    );

    if (absentEmployees.length === 0) {
      return NextResponse.json({
        success: true,
        message: `All employees accounted for on ${targetDate}`,
        markedCount: 0,
      });
    }

    // 5. Bulk insert absent records
    const absentPayload = absentEmployees.map((emp) => ({
      user_id: emp.id,
      work_date: targetDate,
      check_in_time: null,
      check_out_time: null,
      working_minutes: 0,
      status: 'absent',
      notes: 'System Auto-Marked Absent (No Punch-In)',
    }));

    const { error: insertErr } = await supabase
      .from('attendance_records')
      .insert(absentPayload)
      .select('id, user_id, work_date, status');

    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully marked ${absentEmployees.length} employee(s) as ABSENT for ${targetDate}`,
      targetDate,
      markedCount: absentEmployees.length,
      absentEmployees: absentEmployees.map((e) => ({
        id: e.id,
        name: e.full_name,
        employee_id: e.employee_id,
      })),
    });
  } catch (error: unknown) {
    console.error('Mark Absent Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
