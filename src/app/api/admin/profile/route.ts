import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

// GET: Fetch all employee profiles for HR Admin Directory
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(['hr', 'admin']);
    if (!auth.success) return auth.response;

    const { supabase } = auth;
    const { searchParams } = new URL(req.url);

    const departmentId = searchParams.get('department_id');
    const roleFilter = searchParams.get('role');

    let query = supabase
      .from('profiles')
      .select('*, departments(code, name)')
      .order('full_name', { ascending: true });

    if (departmentId) {
      query = query.eq('department_id', departmentId);
    }

    if (roleFilter) {
      query = query.eq('role', roleFilter);
    }

    const { data: initialProfiles, error } = await query;
    let profiles = initialProfiles;

    // Fallback: If join on departments fails, fetch basic profiles
    if (error) {
      console.warn('GET Admin Profiles Join Warning, executing fallback query:', error.message);
      let fallbackQuery = supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (departmentId) fallbackQuery = fallbackQuery.eq('department_id', departmentId);
      if (roleFilter) fallbackQuery = fallbackQuery.eq('role', roleFilter);

      const fallbackRes = await fallbackQuery;
      if (fallbackRes.error) {
        console.error('GET Admin Profiles Fallback Error:', fallbackRes.error);
        return NextResponse.json({ success: false, error: fallbackRes.error.message }, { status: 500 });
      }
      profiles = fallbackRes.data;
    }

    return NextResponse.json({
      success: true,
      count: profiles?.length || 0,
      profiles: profiles || [],
    });
  } catch (error: unknown) {
    console.error('Admin Profiles Route Exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
