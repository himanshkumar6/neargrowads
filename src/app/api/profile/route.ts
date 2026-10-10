import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

export async function GET() {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(id, name, code)
    `)
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    return NextResponse.json(
      { success: false, error: 'Profile not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    profile,
  });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const body = await req.json();

  // Strict Sanitization: Allow self-updating ONLY these fields
  const allowedUpdates: Record<string, unknown> = {};
  if (body.phone !== undefined) allowedUpdates.phone = body.phone;
  if (body.bio !== undefined) allowedUpdates.bio = body.bio;
  if (body.address !== undefined) allowedUpdates.address = body.address;
  if (body.emergency_contact !== undefined) allowedUpdates.emergency_contact = body.emergency_contact;
  if (body.avatar_url !== undefined) allowedUpdates.avatar_url = body.avatar_url;

  if (Object.keys(allowedUpdates).length === 0) {
    return NextResponse.json(
      { success: false, error: 'No valid self-editable fields provided' },
      { status: 400 }
    );
  }

  const { data: updatedProfile, error } = await supabase
    .from('profiles')
    .update(allowedUpdates)
    .eq('id', user.id)
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
    message: 'Profile updated successfully',
    profile: updatedProfile,
  });
}
