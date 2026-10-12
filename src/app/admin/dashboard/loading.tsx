import BrandedLoaderView from "@/components/BrandedLoaderView";

/**
 * Admin Dashboard Loading Boundary:
 * Displays the NearGrow Ads branded loading screen while dashboard metrics and inquiry charts load.
 */
export default function DashboardLoading() {
  return <BrandedLoaderView isServerFallback statusText="Loading CMS Dashboard..." />;
}
