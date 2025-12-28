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
import { EarnPointsPage } from '@/pages/loyalty/EarnPointsPage';
import { PlaceholderPage } from '@/components/ui/placeholder-page';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  { path: "/", element: <DashboardPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/insights", element: <PlaceholderPage title="Member Insights" category="Overview" /> },
  { path: "/members", element: <MemberListPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/tiers", element: <PlaceholderPage title="Membership Tiers" category="Member Management" /> },
  { path: "/leaderboards", element: <PlaceholderPage title="Leaderboards" category="Member Management" /> },
  { path: "/interests", element: <PlaceholderPage title="Interests" category="Member Management" /> },
  { path: "/manual-approval", element: <PlaceholderPage title="Manual Approval" category="Member Management" /> },
  { path: "/loyalty/earn-points", element: <EarnPointsPage />, errorElement: <RouteErrorBoundary /> },
  { path: "/loyalty/burn-rules", element: <PlaceholderPage title="Burn Rules" category="Loyalty Engine" /> },
  { path: "/loyalty/vouchers", element: <PlaceholderPage title="Vouchers" category="Loyalty Engine" /> },
  { path: "/loyalty/external-vouchers", element: <PlaceholderPage title="External Vouchers" category="Loyalty Engine" /> },
  { path: "/loyalty/gift-cards", element: <PlaceholderPage title="Gift Cards" category="Loyalty Engine" /> },
  { path: "/loyalty/badges", element: <PlaceholderPage title="Badges" category="Loyalty Engine" /> },
  { path: "/loyalty/tags", element: <PlaceholderPage title="Master Tags" category="Loyalty Engine" /> },
  { path: "/missions/onboarding", element: <PlaceholderPage title="Onboarding Missions" category="Missions" /> },
  { path: "/missions/general", element: <PlaceholderPage title="General Missions" category="Missions" /> },
  { path: "/missions/tier", element: <PlaceholderPage title="Tier Missions" category="Missions" /> },
  { path: "/ops/venues", element: <PlaceholderPage title="Venues" category="Rewards & Ops" /> },
  { path: "/ops/outlets", element: <PlaceholderPage title="Outlets" category="Rewards & Ops" /> },
  { path: "/ops/maps", element: <PlaceholderPage title="Isometric Maps" category="Rewards & Ops" /> },
  { path: "/marketing/events", element: <PlaceholderPage title="Events" category="Marketing" /> },
  { path: "/marketing/activities", element: <PlaceholderPage title="Activities" category="Marketing" /> },
  { path: "/marketing/tickets", element: <PlaceholderPage title="Tickets" category="Marketing" /> },
  { path: "/marketing/push", element: <PlaceholderPage title="Push Notifications" category="Marketing" /> },
  { path: "/marketing/email", element: <PlaceholderPage title="Email Campaigns" category="Marketing" /> },
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