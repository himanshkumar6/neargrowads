import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap (sitemap.xml, sitemap.xsl, sitemap)
     * - robots (robots.txt, robots)
     * - llms (llms.txt, llms)
     * - static file extensions (svg, png, jpg, jpeg, gif, webp, ico, xml, xsl, txt, webmanifest)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.*|robots.*|llms.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|xml|xsl|txt|webmanifest)$).*)',
  ],
}
