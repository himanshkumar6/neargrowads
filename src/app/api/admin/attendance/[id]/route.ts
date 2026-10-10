import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['hr', 'admin']);
    if (!auth.success) return auth.response;

    const { supabase } = auth;
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { status, notes, check_in_time, check_out_time } = body;

    const allowedStatuses = ['present', 'absent', 'late', 'half_day', 'on_leave'];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;
    if (check_in_time !== undefined) updatePayload.check_in_time = check_in_time;
    if (check_out_time !== undefined) updatePayload.check_out_time = check_out_time;

    const { data: updatedRecord, error } = await supabase
      .from('attendance_records')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record updated successfully by HR Admin',
      record: updatedRecord,
    });
  } catch (error: unknown) {
    console.error('Update Attendance Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
