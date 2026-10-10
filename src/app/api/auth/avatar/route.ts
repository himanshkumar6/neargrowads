import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

// Admin Service Role client that BYPASSES RLS for storage & profile updates
function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase Service Role Key');
  }
  return createAdminClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Request
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ success: false, error: 'No file data received' }, { status: 400 });
    }

    const file = formData.get('avatar') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'Please select an image file to upload' }, { status: 400 });
    }

    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image size must be under 5MB' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload to Supabase Storage using Admin Client (Bypasses RLS Violations)
    const adminSupabase = getAdminSupabase();

    const { data: uploadData, error: uploadError } = await adminSupabase.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError);
      return NextResponse.json(
        { success: false, error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 4. Get Public URL
    const { data: publicUrlData } = adminSupabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlData.publicUrl;

    // 5. Update avatar_url in profiles table using Admin Client
    const { error: profileErr } = await adminSupabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileErr) {
      console.error('Profile DB Update Error:', profileErr);
      return NextResponse.json(
        { success: false, error: `Profile update failed: ${profileErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Avatar uploaded and profile updated successfully',
      avatarUrl: publicUrl,
    });
  } catch (error: unknown) {
    console.error('Avatar Upload Exception:', error);
    const message = error instanceof Error ? error.message : 'Internal server error during upload';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
