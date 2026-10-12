import BrandedLoaderView from "@/components/BrandedLoaderView";

/**
 * Root Server-Rendered Loading Boundary:
 * Displays the NearGrow Ads branded loading screen on direct visits, initial document streaming,
 * or full-page browser refreshes before hydration completes.
 */
export default function RootLoading() {
  return <BrandedLoaderView isServerFallback statusText="Loading NearGrow Ads..." />;
}
