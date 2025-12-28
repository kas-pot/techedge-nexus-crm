import React from "react";
import {
  LayoutDashboard, Users, Trophy, Coins, Gift,
  Store, Building2, Megaphone, Calendar,
  Bell, Settings, ShieldCheck, ChevronRight,
  TrendingUp, Star, Map, Ticket,
  Mail, Video, MonitorPlay, Newspaper, Languages,
  Palette, Smartphone, Fingerprint, ScanEye,
  ShieldAlert, BookOpen, HelpCircle, Wifi, Users2, Landmark, CheckSquare, CloudSun,
  Image as ImageIcon, UserCheck, Cpu, Layout
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
      { title: "Manual Approval", icon: CheckSquare, url: "/manual-approval" },
    ]
  },
  {
    label: "Loyalty Engine",
    items: [
      { title: "Earn Points", icon: Coins, url: "/loyalty/earn-points" },
      { title: "Burn Rules", icon: TrendingUp, url: "/loyalty/burn-rules" },
      { title: "Vouchers", icon: Ticket, url: "/loyalty/vouchers" },
      { title: "External Vouchers", icon: Star, url: "/loyalty/external-vouchers" },
      { title: "Gift Cards", icon: Gift, url: "/loyalty/gift-cards" },
      { title: "Badges", icon: ShieldCheck, url: "/loyalty/badges" },
      { title: "Master Tags", icon: Star, url: "/loyalty/tags" },
    ]
  },
  {
    label: "Missions",
    items: [
      {
        title: "Mission Builder",
        icon: Star,
        url: "/missions",
        sub: [
          { title: "Onboarding", url: "/missions/onboarding" },
          { title: "General", url: "/missions/general" },
          { title: "Tier Missions", url: "/missions/tier" },
        ]
      }
    ]
  },
  {
    label: "Rewards & Ops",
    items: [
      { title: "Venues", icon: Building2, url: "/ops/venues" },
      { title: "Outlets", icon: Store, url: "/ops/outlets" },
      { title: "Isometric Maps", icon: Map, url: "/ops/maps" },
    ]
  },
  {
    label: "Marketing",
    items: [
      { title: "Campaigns", icon: Megaphone, url: "/marketing/push" },
      { title: "Events", icon: Calendar, url: "/marketing/events" },
      { title: "Activities", icon: Newspaper, url: "/marketing/activities" },
      { title: "Tickets", icon: Ticket, url: "/marketing/tickets" },
      { title: "Email Campaigns", icon: Mail, url: "/marketing/email" },
      { title: "Video Promotions", icon: Video, url: "/marketing/videos" },
      { title: "Ads Management", icon: MonitorPlay, url: "/marketing/ads" },
      { title: "News & Promo", icon: Newspaper, url: "/marketing/news" },
    ]
  },
  {
    label: "Partnerships",
    items: [
      { title: "Partnership List", icon: Users2, url: "/partnerships/list" },
      { title: "Bank Partnerships", icon: Landmark, url: "/partnerships/banks" },
    ]
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        icon: Settings,
        url: "/system",
        sub: [
          { title: "Global Config", url: "/system/appearance" },
          { title: "Weather Config", url: "/system/weather" },
          { title: "Theme Presets", url: "/system/appearance" },
          { title: "Languages", url: "/system/localization" },
          { title: "Splash Screen", url: "/system/splash" },
          { title: "Hero Banners", url: "/system/banner" },
          { title: "Contact Info", url: "/system/contact" },
          { title: "Sedayu SSO", url: "/system/security" },
          { title: "OCR/AI Config", url: "/system/advanced" },
          { title: "Privacy Policy", url: "/system/privacy" },
          { title: "Terms & Conditions", url: "/system/terms" },
          { title: "Wifi Password", url: "/system/wifi" },
          { title: "FAQ", url: "/system/faq" },
        ]
      }
    ]
  }
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">N</div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden whitespace-nowrap">Nexus <span className="text-indigo-600">CRM</span></span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = location.pathname === item.url || (item.sub && item.sub.some(s => location.pathname === s.url));
                if (item.sub) {
                  return (
                    <Collapsible key={item.title} defaultOpen={isActive} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
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
                    <SidebarMenuButton asChild isActive={location.pathname === item.url} tooltip={item.title}>
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
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">JD</div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
            <span className="text-sm font-medium leading-none">Jane Doe</span>
            <span className="text-xs text-muted-foreground truncate">Admin Portal</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}