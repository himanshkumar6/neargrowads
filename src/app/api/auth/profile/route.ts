import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().trim().email('Invalid email address').optional(),
  phone: z.string().trim().optional(),
  bio: z.string().trim().optional(),
  address: z.string().trim().optional(),
  emergencyContact: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
});

// GET: Fetch authenticated user profile
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, departments(code, name)')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('GET Profile Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update complete user profile details and password
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await req.json().catch(() => null);
    const parseResult = updateProfileSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstErr = parseResult.error.issues[0]?.message || 'Invalid parameters';
      return NextResponse.json({ success: false, error: firstErr }, { status: 400 });
    }

    const { fullName, email, phone, bio, address, emergencyContact, avatarUrl, newPassword } = parseResult.data;

    // Prepare profile update object
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (fullName !== undefined) updatePayload.full_name = fullName;
    if (phone !== undefined) updatePayload.phone = phone;
    if (bio !== undefined) updatePayload.bio = bio;
    if (address !== undefined) updatePayload.address = address;
    if (emergencyContact !== undefined) updatePayload.emergency_contact = emergencyContact;
    if (avatarUrl !== undefined) updatePayload.avatar_url = avatarUrl;
    if (email !== undefined) updatePayload.email = email;

    // Update profiles table
    const { error: updateErr } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // Update Email or Password via Supabase Auth if provided
    const authUpdatePayload: { email?: string; password?: string } = {};
    if (email && email !== user.email) authUpdatePayload.email = email;
    if (newPassword) authUpdatePayload.password = newPassword;

    if (Object.keys(authUpdatePayload).length > 0) {
      const { error: authUpdateErr } = await supabase.auth.updateUser(authUpdatePayload);
      if (authUpdateErr) {
        return NextResponse.json({ success: false, error: authUpdateErr.message }, { status: 500 });
      }
    }

    // Fetch updated profile with department details
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('*, departments(code, name)')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    console.error('PUT Profile Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
