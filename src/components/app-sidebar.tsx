import React from "react";
import { 
  LayoutDashboard, Users, Trophy, Coins, Gift, 
  Store, Building2, Megaphone, Calendar, 
  Bell, Settings, ShieldCheck, ChevronRight,
  TrendingUp, Star, UserPlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const navGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, url: "/" },
      { title: "Member Insights", icon: TrendingUp, url: "/insights" },
    ]
  },
  {
    label: "Member Management",
    items: [
      { title: "Member List", icon: Users, url: "/members" },
      { title: "Membership Tiers", icon: ShieldCheck, url: "/tiers" },
      { title: "Leaderboards", icon: Trophy, url: "/leaderboards" },
      { title: "Interests", icon: Star, url: "/interests" },
    ]
  },
  {
    label: "Loyalty Engine",
    items: [
      { 
        title: "Point Rules", 
        icon: Coins, 
        url: "/loyalty/earn-points",
        sub: [
          { title: "Earn Points", url: "/loyalty/earn-points" },
          { title: "Burn Rules", url: "/loyalty/burn-rules" },
        ]
      },
      { title: "Rewards Catalog", icon: Gift, url: "/loyalty/rewards" },
      { title: "Vouchers", icon: Star, url: "/loyalty/vouchers" },
    ]
  },
  {
    label: "Operations Hub",
    items: [
      { title: "Venues", icon: Building2, url: "/ops/venues" },
      { title: "Outlets", icon: Store, url: "/ops/outlets" },
      { title: "Tenants", icon: UserPlus, url: "/ops/tenants" },
    ]
  },
  {
    label: "Marketing",
    items: [
      { title: "Campaigns", icon: Megaphone, url: "/marketing/campaigns" },
      { title: "Events", icon: Calendar, url: "/marketing/events" },
      { title: "Push Notifications", icon: Bell, url: "/marketing/push" },
    ]
  },
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, url: "/settings" },
    ]
  }
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
            Nexus <span className="text-indigo-600">CRM</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                if (item.sub) {
                  return (
                    <Collapsible key={item.title} defaultOpen={isActive || location.pathname.startsWith(item.url)} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.sub.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={location.pathname === subItem.url}>
                                  <Link to={subItem.url}>{subItem.title}</Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
            JD
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
            <span className="text-sm font-medium leading-none">Jane Doe</span>
            <span className="text-xs text-muted-foreground truncate">Admin Portal</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}