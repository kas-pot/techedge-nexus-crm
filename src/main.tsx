import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Pages
import { DashboardPage } from '@/pages/DashboardPage';
import { MemberListPage } from '@/pages/members/MemberListPage';
import { TiersPage } from '@/pages/members/TiersPage';
import { LeaderboardsPage } from '@/pages/members/LeaderboardsPage';
import { InterestsPage } from '@/pages/members/InterestsPage';
import { EarnPointsPage } from '@/pages/loyalty/EarnPointsPage';
import { VouchersPage } from '@/pages/loyalty/VouchersPage';
import { VenuesPage } from '@/pages/ops/VenuesPage';
import { OutletsPage } from '@/pages/ops/OutletsPage';
import { CampaignsPage } from '@/pages/marketing/CampaignsPage';
import { EventsPage } from '@/pages/marketing/EventsPage';
import { MissionsPage } from '@/pages/missions/MissionsPage';
import { MemberInsightsPage } from '@/pages/insights/MemberInsightsPage';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  { path: "/", element: <DashboardPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/insights", element: <MemberInsightsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/members", element: <MemberListPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/tiers", element: <TiersPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/leaderboards", element: <LeaderboardsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/interests", element: <InterestsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/manual-approval", element: <PlaceholderPage title="Manual Approval" category="Member Management" /> },
  { path: "/loyalty/earn-points", element: <EarnPointsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/burn-rules", element: <PlaceholderPage title="Burn Rules" category="Loyalty Engine" /> },
  { path: "/loyalty/vouchers", element: <VouchersPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/external-vouchers", element: <PlaceholderPage title="External Vouchers" category="Loyalty Engine" /> },
  { path: "/loyalty/gift-cards", element: <PlaceholderPage title="Gift Cards" category="Loyalty Engine" /> },
  { path: "/loyalty/badges", element: <PlaceholderPage title="Badges" category="Loyalty Engine" /> },
  { path: "/loyalty/tags", element: <PlaceholderPage title="Master Tags" category="Loyalty Engine" /> },
  // Missions Unified Routing
  { path: "/missions", element: <MissionsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/missions/onboarding", element: <MissionsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/missions/general", element: <MissionsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/missions/tier", element: <MissionsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/venues", element: <VenuesPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/outlets", element: <OutletsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/maps", element: <PlaceholderPage title="Isometric Maps" category="Rewards & Ops" /> },
  // Marketing & Communications
  { path: "/marketing/events", element: <EventsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/activities", element: <PlaceholderPage title="Activities" category="Marketing" /> },
  { path: "/marketing/tickets", element: <PlaceholderPage title="Tickets" category="Marketing" /> },
  { path: "/marketing/push", element: <CampaignsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/email", element: <CampaignsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/videos", element: <PlaceholderPage title="Video Promotions" category="Marketing" /> },
  { path: "/marketing/ads", element: <PlaceholderPage title="Ads Management" category="Marketing" /> },
  { path: "/marketing/news", element: <PlaceholderPage title="News & Promo" category="Marketing" /> },
  { path: "/partnerships/list", element: <PlaceholderPage title="Partnership List" category="Partnerships" /> },
  { path: "/partnerships/banks", element: <PlaceholderPage title="Bank Partnerships" category="Partnerships" /> },
  { path: "/system/themes", element: <PlaceholderPage title="Themes" category="System" /> },
  { path: "/system/languages", element: <PlaceholderPage title="Languages" category="System" /> },
  { path: "/system/splash", element: <PlaceholderPage title="Splash Screen" category="System" /> },
  { path: "/system/sso", element: <PlaceholderPage title="SSO Config" category="System" /> },
  { path: "/system/ai", element: <PlaceholderPage title="OCR/AI" category="System" /> },
  { path: "/system/privacy", element: <PlaceholderPage title="Privacy Policy" category="System" /> },
  { path: "/system/wifi", element: <PlaceholderPage title="Wifi Password" category="System" /> },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)