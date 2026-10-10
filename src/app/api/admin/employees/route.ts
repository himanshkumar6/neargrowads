import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';
import { createAdminClient } from '@/lib/supabase/admin';

// DELETE: Delete selected employee profiles and auth accounts
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(['hr', 'admin']);
    if (!auth.success) return auth.response;

    const { user } = auth;
    const body = await req.json().catch(() => ({}));
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Employee IDs array required for deletion' }, { status: 400 });
    }

    // Prevent HR Admin from self-deleting their own active account
    const filteredIds = ids.filter((id: string) => id !== user.id);

    if (filteredIds.length === 0) {
      return NextResponse.json({ success: false, error: 'Cannot delete your own active HR account' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // 1. Cascade clean dependent attendance and leave records
    await adminSupabase.from('attendance_records').delete().in('user_id', filteredIds);
    await adminSupabase.from('leave_requests').delete().in('user_id', filteredIds);

    // 2. Delete profiles from public.profiles table
    const { error: profileError } = await adminSupabase
      .from('profiles')
      .delete()
      .in('id', filteredIds);

    if (profileError) {
      console.error('Delete Profiles Error:', profileError);
      return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
    }

    // 3. Purge auth user accounts using admin client
    for (const id of filteredIds) {
      try {
        await adminSupabase.auth.admin.deleteUser(id);
      } catch (err) {
        console.warn(`Auth delete warning for user ${id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${filteredIds.length} employee profile(s).`,
      deletedCount: filteredIds.length,
    });
  } catch (error: unknown) {
    console.error('DELETE Admin Employees Exception:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH: Reset password for selected employee
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(['hr', 'admin']);
    if (!auth.success) return auth.response;

    const body = await req.json().catch(() => ({}));
    const { employeeId, newPassword } = body;

    if (!employeeId || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Employee ID and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      employeeId,
      {
        password: newPassword,
        email_confirm: true,
      }
    );

    if (updateError) {
      console.error('Reset password error:', updateError);
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Employee password reset successfully.',
    });
  } catch (error: unknown) {
    console.error('PATCH Admin Employees Exception:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
