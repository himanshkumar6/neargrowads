import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET: Auto-Mark absent for active employees who have no punch-in record and no approved leave
// Triggered by Vercel Cron at 10 PM IST (Mon-Fri)
export async function GET(req: NextRequest) {
  try {
    // 1. Secure the endpoint using CRON_SECRET (Murphy's Law: Secrets can be undefined, always check)
    const authHeader = req.headers.get('authorization') || '';
    const cronSecret = process.env.CRON_SECRET || '';
    const expectedAuth = `Bearer ${cronSecret}`;
    
    if (cronSecret && authHeader !== expectedAuth) {
      console.warn("Murphy's Law: Unauthorized cron attempt blocked.");
      return NextResponse.json({ success: false, error: 'Unauthorized Cron Request' }, { status: 401 });
    }

    // Murphy's Law: Environment variables might randomly drop or be misconfigured. Never trust they exist.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Murphy's Law Triggered: Missing Supabase Environment Variables!");
      return NextResponse.json({ success: false, error: 'Database configuration missing' }, { status: 500 });
    }

    // Initialize Supabase with Service Role Key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 2. Determine target date (Murphy's Law: Timezone logic can break, use try/catch)
    let istTime: Date;
    let targetDate: string;
    
    try {
      const now = new Date();
      istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      targetDate = istTime.toISOString().split('T')[0];
    } catch (dateErr) {
      console.error("Murphy's Law Triggered: Date calculation failed", dateErr);
      return NextResponse.json({ success: false, error: 'Date calculation error' }, { status: 500 });
    }

    // Check if weekend (Sunday is 0, Saturday is 6). 
    if (istTime.getDay() === 0 || istTime.getDay() === 6) {
      return NextResponse.json({ success: true, message: 'Weekend (Saturday/Sunday). No absences marked automatically.', markedCount: 0 });
    }

    // 3. Fetch all active employees (Murphy's Law: Network requests fail, handled by global catch)
    const { data: activeEmployees, error: empErr } = await supabase
      .from('profiles')
      .select('id, full_name, email, employee_id')
      .eq('is_active', true)
      .eq('role', 'employee');

    if (empErr) {
      console.error("Murphy's Law Triggered: Failed to fetch profiles", empErr);
      return NextResponse.json({ success: false, error: empErr.message }, { status: 500 });
    }

    // Murphy's Law: Data might be null instead of an empty array.
    const safeActiveEmployees = activeEmployees || [];
    if (safeActiveEmployees.length === 0) {
      return NextResponse.json({ success: true, message: 'No active employees found', markedCount: 0 });
    }

    // 4. Fetch existing attendance records for target date
    const { data: existingRecords, error: attErr } = await supabase
      .from('attendance_records')
      .select('user_id')
      .eq('work_date', targetDate);

    if (attErr) console.warn("Murphy's Law: Error fetching existing records", attErr);
    
    // Murphy's Law: Protect map functions with fallback arrays
    const safeExistingRecords = existingRecords || [];
    const attendedUserIds = new Set(
      safeExistingRecords
        .map((r: { user_id?: string | null }) => r.user_id)
        .filter((id): id is string => Boolean(id))
    );

    // 5. Fetch approved leaves for target date
    const { data: approvedLeaves, error: leaveErr } = await supabase
      .from('leave_requests')
      .select('user_id')
      .eq('status', 'approved')
      .lte('start_date', targetDate)
      .gte('end_date', targetDate);

    if (leaveErr) console.warn("Murphy's Law: Error fetching leaves", leaveErr);
    
    const safeApprovedLeaves = approvedLeaves || [];
    const onLeaveUserIds = new Set(
      safeApprovedLeaves
        .map((l: { user_id?: string | null }) => l.user_id)
        .filter((id): id is string => Boolean(id))
    );

    // 6. Identify absent employees 
    const absentEmployees = safeActiveEmployees.filter(
      (emp: { id?: string | null }) => emp?.id && !attendedUserIds.has(emp.id) && !onLeaveUserIds.has(emp.id)
    );

    if (absentEmployees.length === 0) {
      return NextResponse.json({
        success: true,
        message: `All employees accounted for on ${targetDate}`,
        markedCount: 0,
      });
    }

    // 7. Bulk insert absent records (Murphy's Law: Ensure no undefined fields are passed to DB)
    const absentPayload = absentEmployees.map((emp: { id: string }) => ({
      user_id: emp.id,
      work_date: targetDate,
      check_in_time: null,
      check_out_time: null,
      working_minutes: 0,
      status: 'absent',
      notes: 'System Auto-Marked Absent (No Punch-In by 10 PM)',
    }));

    // Murphy's Law: Double-check payload length before firing an insert
    if (absentPayload.length > 0) {
      const { error: insertErr } = await supabase
        .from('attendance_records')
        .insert(absentPayload);

      if (insertErr) {
        console.error("Murphy's Law Triggered: Bulk insert failed", insertErr);
        return NextResponse.json({ success: false, error: insertErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Automated Cron: Successfully marked ${absentEmployees.length} employee(s) as ABSENT for ${targetDate}`,
      targetDate,
      markedCount: absentEmployees.length
    });
    
  } catch (error: unknown) {
    // Murphy's Law: The ultimate fallback catch block
    console.error('Auto Mark Absent Fatal Error (Murphy):', error);
    const message = error instanceof Error ? error.message : 'Catastrophic internal server error';
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 500 });
  }
}
