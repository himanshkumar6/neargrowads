import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Requires HR or Admin permissions
  const auth = await requireAuth(['hr', 'admin']);
  if (!auth.success) return auth.response;

  const { id: targetUserId } = await params;
  const { supabase } = auth;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  if (body.employee_id !== undefined) updates.employee_id = body.employee_id;
  if (body.department_id !== undefined) updates.department_id = body.department_id;
  if (body.joining_date !== undefined) updates.joining_date = body.joining_date;
  if (body.role !== undefined) {
    if (!['employee', 'hr', 'admin'].includes(body.role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Allowed values: employee, hr, admin' },
        { status: 400 }
      );
    }
    updates.role = body.role;
  }
  if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { success: false, error: 'No administrative update fields provided' },
      { status: 400 }
    );
  }

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', targetUserId)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Employee profile updated by HR',
    profile: updatedProfile,
  });
}
