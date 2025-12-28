import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Pages
import { HomePage } from '@/pages/HomePage';
import { MemberListPage } from '@/pages/members/MemberListPage';
import { TiersPage } from '@/pages/members/TiersPage';
import { LeaderboardsPage } from '@/pages/members/LeaderboardsPage';
import { InterestsPage } from '@/pages/members/InterestsPage';
import { ManualApprovalPage } from '@/pages/members/ManualApprovalPage';
import { EarnPointsPage } from '@/pages/loyalty/EarnPointsPage';
import { BurnRulesPage } from '@/pages/loyalty/BurnRulesPage';
import { VouchersPage } from '@/pages/loyalty/VouchersPage';
import { ExternalVouchersPage } from '@/pages/loyalty/ExternalVouchersPage';
import { PushNotificationsPage } from '@/pages/marketing/PushNotificationsPage';
import { VoucherDetailPage } from '@/pages/loyalty/VoucherDetailPage';
import { BadgesPage } from '@/pages/loyalty/BadgesPage';
import { VenuesPage } from '@/pages/ops/VenuesPage';
import { OutletsPage } from '@/pages/ops/OutletsPage';
import { MapsPage } from '@/pages/ops/MapsPage';
import { CampaignsPage } from '@/pages/marketing/CampaignsPage';
import { EventsPage } from '@/pages/marketing/EventsPage';
import { MissionsPage } from '@/pages/missions/MissionsPage';
import { MemberInsightsPage } from '@/pages/insights/MemberInsightsPage';
import { PartnershipsPage } from '@/pages/partnerships/PartnershipsPage';
import { SettingsPage } from '@/pages/system/SettingsPage';
import { MarketingHubPage } from '@/pages/marketing/MarketingHubPage';
import { GiftCardsPage } from '@/pages/loyalty/GiftCardsPage';
import { HelpFAQPage } from '@/pages/system/HelpFAQPage';
import { TooltipProvider } from '@/components/ui/tooltip';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <HomePage />
      </>
    ),
    errorElement: <RouteErrorBoundary />
  },
  { path: "/insights", element: <MemberInsightsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/members", element: <MemberListPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/tiers", element: <TiersPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/leaderboards", element: <LeaderboardsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/interests", element: <InterestsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/manual-approval", element: <ManualApprovalPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/earn-points", element: <EarnPointsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/burn-rules", element: <BurnRulesPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/vouchers", element: <VouchersPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/vouchers/:id", element: <VoucherDetailPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/external-vouchers", element: <ExternalVouchersPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/gift-cards", element: <GiftCardsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/badges", element: <BadgesPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/tags", element: <InterestsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/missions", element: <MissionsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/missions/:tab", element: <MissionsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/venues", element: <VenuesPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/outlets", element: <OutletsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/maps", element: <MapsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/events", element: <EventsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/activities", element: <MarketingHubPage defaultTab="news" />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/tickets", element: <MarketingHubPage defaultTab="tickets" />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/push", element: <PushNotificationsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/email", element: <CampaignsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/videos", element: <MarketingHubPage defaultTab="videos" />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/ads", element: <MarketingHubPage defaultTab="ads" />, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/news", element: <MarketingHubPage defaultTab="news" />, errorElement: <RouteErrorBoundary /> },
  { path: "/partnerships/list", element: <PartnershipsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/partnerships/banks", element: <PartnershipsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/system", element: <SettingsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/system/:tab", element: <SettingsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/system/faq", element: <HelpFAQPage />, errorElement: <RouteErrorBoundary /> },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={0}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)