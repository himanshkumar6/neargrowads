import BrandedLoaderView from "@/components/BrandedLoaderView";

/**
 * Admin Server-Rendered Loading Boundary:
 * Displays the NearGrow Ads branded loading screen during nested admin layout transitions,
 * initial CMS loads, or data fetching across admin routes.
 */
export default function AdminLoading() {
  return <BrandedLoaderView isServerFallback statusText="Loading CMS..." />;
}
