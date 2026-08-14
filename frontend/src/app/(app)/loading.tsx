import PageLoader from '@/components/PageLoader';

// Next.js route-segment loading UI — shown while a page under (app) is being
// loaded (e.g. first navigation to a route's chunk). Pages also show their own
// PageLoader while fetching data client-side; this covers the moment before that.
export default function AppLoading() {
  return <PageLoader />;
}
