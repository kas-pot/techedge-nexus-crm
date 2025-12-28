import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
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
  {
    path: "/",
    element: <DashboardPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/members",
    element: <MemberListPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/loyalty/earn-points",
    element: <EarnPointsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/insights",
    element: <PlaceholderPage title="Member Insights" />,
  },
  {
    path: "/tiers",
    element: <PlaceholderPage title="Membership Tiers" />,
  },
  {
    path: "/leaderboards",
    element: <PlaceholderPage title="Leaderboards" />,
  },
  {
    path: "/loyalty/burn-rules",
    element: <PlaceholderPage title="Burn Rules" />,
  },
  {
    path: "/loyalty/rewards",
    element: <PlaceholderPage title="Rewards Catalog" />,
  },
  {
    path: "/ops/venues",
    element: <PlaceholderPage title="Venue Management" />,
  },
  {
    path: "/marketing/campaigns",
    element: <PlaceholderPage title="Marketing Campaigns" />,
  },
  {
    path: "/settings",
    element: <PlaceholderPage title="System Settings" />,
  }
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