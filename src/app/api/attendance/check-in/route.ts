import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-guard';

// Reverse Geocode GPS coordinates with Ultra-Fast 600ms Timeout Guard
async function getAddressFromCoords(lat: number, lng: number): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'NearGrowEMS/1.0' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const addr = data.address;
      if (addr) {
        const parts = [
          addr.suburb || addr.neighbourhood || addr.road,
          addr.city || addr.town || addr.village || addr.county,
          addr.state,
          addr.country,
        ].filter(Boolean);
        if (parts.length > 0) return parts.join(', ');
      }
      if (data.display_name) return data.display_name;
    }
  } catch {
    clearTimeout(timeoutId);
  }
  return null;
}

// Fallback: Secure HTTPS IP Geolocation Lookup with Ultra-Fast 500ms Timeout
async function getAddressFromIP(ip: string): Promise<string | null> {
  if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return 'Local Network (Dev)';
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 500);

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.city || data.region) {
        return `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.replace(/^,\s*|,\s*$/g, '');
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }
  return null;
}

// Haversine Spherical Distance Math (Returns distance in meters)
function calculateDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.success) return auth.response;

  const { supabase, user } = auth;
  const body = await req.json().catch(() => ({}));

  // 1. Verify Active Profile Status (Murphy's Law: Prevent deactivated staff check-in)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active')
    .eq('id', user.id)
    .maybeSingle();

  if (profile && profile.is_active === false) {
    return NextResponse.json(
      { success: false, error: 'Your account has been deactivated by HR' },
      { status: 403 }
    );
  }

  // 2. Strict Coordinate Parsing & Validation
  const rawLat = body.latitude ?? body.lat ?? body.location?.lat;
  const rawLng = body.longitude ?? body.lng ?? body.location?.lng;

  const validLat = typeof rawLat === 'number' && !isNaN(rawLat) && rawLat >= -90 && rawLat <= 90
    ? rawLat
    : (typeof rawLat === 'string' && !isNaN(Number(rawLat)) ? Number(rawLat) : null);

  const validLng = typeof rawLng === 'number' && !isNaN(rawLng) && rawLng >= -180 && rawLng <= 180
    ? rawLng
    : (typeof rawLng === 'string' && !isNaN(Number(rawLng)) ? Number(rawLng) : null);

  const notes = body.notes;

  // Extract Client IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '127.0.0.1';

  // Calculate local YYYY-MM-DD date string in Asia/Kolkata timezone (prevents UTC midnight shift bug)
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  // 3. Check if an attendance record already exists for today
  const { data: existingRecord } = await supabase
    .from('attendance_records')
    .select('id, check_in_time, check_out_time, status')
    .eq('user_id', user.id)
    .eq('work_date', todayStr)
    .maybeSingle();

  if (existingRecord) {
    return NextResponse.json(
      {
        success: false,
        error: 'You have already checked in for today',
        record: existingRecord,
      },
      { status: 409 }
    );
  }

  // 4. Resolve Location & Calculate 200m Office Geofencing Radius Distance
  const officeLat = Number(process.env.OFFICE_LAT) || 28.6190; // NearGrow HQ Latitude (Pillar no. 781, Bhagwati Garden, Dwarka Mor, Delhi)
  const officeLng = Number(process.env.OFFICE_LNG) || 77.0325; // NearGrow HQ Longitude (Pillar no. 781, Bhagwati Garden, Dwarka Mor, Delhi)
  const allowedRadiusMeters = Number(process.env.OFFICE_RADIUS_METERS) || 200;

  let resolvedAddress: string | null = null;
  let distanceFromOfficeMeters: number | null = null;
  let isInOfficeRadius = false;
  let workMode = 'remote';

  if (validLat !== null && validLng !== null) {
    resolvedAddress = await getAddressFromCoords(validLat, validLng);
    distanceFromOfficeMeters = calculateDistanceInMeters(validLat, validLng, officeLat, officeLng);
    
    if (distanceFromOfficeMeters <= allowedRadiusMeters) {
      isInOfficeRadius = true;
      workMode = 'office';
    } else {
      workMode = 'remote';
    }
  }

  if (!resolvedAddress) {
    resolvedAddress = await getAddressFromIP(clientIp);
  }

  // Format intelligent human-readable location tag
  let formattedLocationTag = '';
  if (validLat !== null && validLng !== null && distanceFromOfficeMeters !== null) {
    if (isInOfficeRadius) {
      formattedLocationTag = `🏢 OFFICE PUNCH (${distanceFromOfficeMeters}m from NearGrow HQ${resolvedAddress ? ` - ${resolvedAddress}` : ''})`;
    } else {
      const kmDistance = (distanceFromOfficeMeters / 1000).toFixed(1);
      formattedLocationTag = `🌐 REMOTE PUNCH (${kmDistance} km from Office${resolvedAddress ? ` - ${resolvedAddress}` : ''})`;
    }
  } else {
    formattedLocationTag = `🌐 REMOTE WEB / IP (${resolvedAddress || 'Office Network'})`;
  }

  const locationJson = {
    lat: validLat,
    lng: validLng,
    ip: clientIp,
    address: formattedLocationTag,
    raw_address: resolvedAddress,
    work_mode: workMode,
    distance_from_office_meters: distanceFromOfficeMeters,
    is_in_office_radius: isInOfficeRadius,
    timestamp: new Date().toISOString(),
  };

  // 5. Create Check-In Record in Supabase (Concurrency & Unique Constraint Guard)
  const { data: newRecord, error } = await supabase
    .from('attendance_records')
    .insert({
      user_id: user.id,
      work_date: todayStr,
      check_in_time: new Date().toISOString(),
      status: 'present',
      location_check_in: locationJson,
      notes: notes || null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Check-in insert error:', error);

    // Murphy's Law Race Condition Handling: Postgres Unique Constraint Violation (Code 23505)
    if (error.code === '23505' || error.message?.includes('duplicate key')) {
      const { data: raceRecord } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user.id)
        .eq('work_date', todayStr)
        .maybeSingle();

      return NextResponse.json(
        {
          success: false,
          error: 'You have already checked in for today',
          record: raceRecord || existingRecord || { user_id: user.id, work_date: todayStr, status: 'present' },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Checked in successfully with IP & location address tracking',
    record: newRecord,
  });
}
