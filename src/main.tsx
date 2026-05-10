import '@/lib/errorReporter';
import { enableMapSet } from "immer";
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, ScrollRestoration } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
// Pages
import { lazy, Suspense } from 'react';
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const MemberListPage = lazy(() => import('@/pages/members/MemberListPage').then(m => ({ default: m.MemberListPage })));
const TiersPage = lazy(() => import('@/pages/members/TiersPage').then(m => ({ default: m.TiersPage })));
const LeaderboardsPage = lazy(() => import('@/pages/members/LeaderboardsPage').then(m => ({ default: m.LeaderboardsPage })));
const InterestsPage = lazy(() => import('@/pages/members/InterestsPage').then(m => ({ default: m.InterestsPage })));
const ManualApprovalPage = lazy(() => import('@/pages/members/ManualApprovalPage').then(m => ({ default: m.ManualApprovalPage })));
const EarnPointsPage = lazy(() => import('@/pages/loyalty/EarnPointsPage').then(m => ({ default: m.EarnPointsPage })));
const BurnRulesPage = lazy(() => import('@/pages/loyalty/BurnRulesPage').then(m => ({ default: m.BurnRulesPage })));
const VouchersPage = lazy(() => import('@/pages/loyalty/VouchersPage').then(m => ({ default: m.VouchersPage })));
const ExternalVouchersPage = lazy(() => import('@/pages/loyalty/ExternalVouchersPage').then(m => ({ default: m.ExternalVouchersPage })));
const PushNotificationsPage = lazy(() => import('@/pages/marketing/PushNotificationsPage').then(m => ({ default: m.PushNotificationsPage })));
const VoucherDetailPage = lazy(() => import('@/pages/loyalty/VoucherDetailPage').then(m => ({ default: m.VoucherDetailPage })));
const BadgesPage = lazy(() => import('@/pages/loyalty/BadgesPage').then(m => ({ default: m.BadgesPage })));
const VenuesPage = lazy(() => import('@/pages/ops/VenuesPage').then(m => ({ default: m.VenuesPage })));
const OutletsPage = lazy(() => import('@/pages/ops/OutletsPage').then(m => ({ default: m.OutletsPage })));
const MapsPage = lazy(() => import('@/pages/ops/MapsPage').then(m => ({ default: m.MapsPage })));
const CampaignsPage = lazy(() => import('@/pages/marketing/CampaignsPage').then(m => ({ default: m.CampaignsPage })));
const EventsPage = lazy(() => import('@/pages/marketing/EventsPage').then(m => ({ default: m.EventsPage })));
const MissionsPage = lazy(() => import('@/pages/missions/MissionsPage').then(m => ({ default: m.MissionsPage })));
const MemberInsightsPage = lazy(() => import('@/pages/insights/MemberInsightsPage').then(m => ({ default: m.MemberInsightsPage })));
const PartnershipsPage = lazy(() => import('@/pages/partnerships/PartnershipsPage').then(m => ({ default: m.PartnershipsPage })));
const SettingsPage = lazy(() => import('@/pages/system/SettingsPage').then(m => ({ default: m.SettingsPage })));
const MarketingHubPage = lazy(() => import('@/pages/marketing/MarketingHubPage').then(m => ({ default: m.MarketingHubPage })));
const GiftCardsPage = lazy(() => import('@/pages/loyalty/GiftCardsPage').then(m => ({ default: m.GiftCardsPage })));
const HelpFAQPage = lazy(() => import('@/pages/system/HelpFAQPage').then(m => ({ default: m.HelpFAQPage })));
const PotUsersPage = lazy(() => import('@/pages/thepot/PotUsersPage').then(m => ({ default: m.PotUsersPage })));
const PotGamesPage = lazy(() => import('@/pages/thepot/PotGamesPage').then(m => ({ default: m.PotGamesPage })));
const PotChallengesPage = lazy(() => import('@/pages/thepot/PotChallengesPage').then(m => ({ default: m.PotChallengesPage })));
import { TooltipProvider } from '@/components/ui/tooltip';

enableMapSet();

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
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading app...</div></div>}>
        <ScrollRestoration />
        <HomePage />
      </Suspense>
    ),
    errorElement: <RouteErrorBoundary />
  },
  { path: "/insights", element: <Suspense fallback={<div>Loading...</div>}><MemberInsightsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/members", element: <Suspense fallback={<div>Loading...</div>}><MemberListPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/tiers", element: <Suspense fallback={<div>Loading...</div>}><TiersPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/leaderboards", element: <Suspense fallback={<div>Loading...</div>}><LeaderboardsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/interests", element: <Suspense fallback={<div>Loading...</div>}><InterestsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/manual-approval", element: <Suspense fallback={<div>Loading...</div>}><ManualApprovalPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/earn-points", element: <Suspense fallback={<div>Loading...</div>}><EarnPointsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/burn-rules", element: <Suspense fallback={<div>Loading...</div>}><BurnRulesPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/vouchers", element: <Suspense fallback={<div>Loading...</div>}><VouchersPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/vouchers/:id", element: <Suspense fallback={<div>Loading...</div>}><VoucherDetailPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/external-vouchers", element: <Suspense fallback={<div>Loading...</div>}><ExternalVouchersPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/gift-cards", element: <Suspense fallback={<div>Loading...</div>}><GiftCardsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/badges", element: <Suspense fallback={<div>Loading...</div>}><BadgesPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/tags", element: <Suspense fallback={<div>Loading...</div>}><InterestsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/missions", element: <Suspense fallback={<div>Loading...</div>}><MissionsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/missions/:tab", element: <Suspense fallback={<div>Loading...</div>}><MissionsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/venues", element: <Suspense fallback={<div>Loading...</div>}><VenuesPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/outlets", element: <Suspense fallback={<div>Loading...</div>}><OutletsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/ops/maps", element: <Suspense fallback={<div>Loading...</div>}><MapsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/events", element: <Suspense fallback={<div>Loading...</div>}><EventsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/activities", element: <Suspense fallback={<div>Loading...</div>}><MarketingHubPage defaultTab="news" /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/tickets", element: <Suspense fallback={<div>Loading...</div>}><MarketingHubPage defaultTab="tickets" /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/push", element: <Suspense fallback={<div>Loading...</div>}><PushNotificationsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/email", element: <Suspense fallback={<div>Loading...</div>}><CampaignsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/videos", element: <Suspense fallback={<div>Loading...</div>}><MarketingHubPage defaultTab="videos" /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/ads", element: <Suspense fallback={<div>Loading...</div>}><MarketingHubPage defaultTab="ads" /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/marketing/news", element: <Suspense fallback={<div>Loading...</div>}><MarketingHubPage defaultTab="news" /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/partnerships/list", element: <Suspense fallback={<div>Loading...</div>}><PartnershipsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/partnerships/banks", element: <Suspense fallback={<div>Loading...</div>}><PartnershipsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/system", element: <Suspense fallback={<div>Loading...</div>}><SettingsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/system/:tab", element: <Suspense fallback={<div>Loading...</div>}><SettingsPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/system/faq", element: <Suspense fallback={<div>Loading...</div>}><HelpFAQPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/thepot/users", element: <Suspense fallback={<div>Loading...</div>}><PotUsersPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/thepot/games", element: <Suspense fallback={<div>Loading...</div>}><PotGamesPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
  { path: "/thepot/challenges", element: <Suspense fallback={<div>Loading...</div>}><PotChallengesPage /></Suspense>, errorElement: <RouteErrorBoundary /> },
]);
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={0}>
      <ErrorBoundary>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading app...</div></div>}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
)