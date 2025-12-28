import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation, Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Bell, Search, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandPalette } from "@/components/CommandPalette";
type AppLayoutProps = {
  children: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const formatBreadcrumb = (segment: string) => {
    return segment
      .charAt(0).toUpperCase() + segment.slice(1)
      .replace(/-/g, ' ');
  };
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <CommandPalette />
      <SidebarInset className={`bg-slate-50/30 dark:bg-background ${className || ""}`}>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 bg-white/70 dark:bg-card/70 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 hover:bg-slate-100 dark:hover:bg-slate-800" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="hidden md:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="font-bold text-indigo-600">Nexus CRM</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.map((segment, index) => {
                  const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathSegments.length - 1;
                  const label = formatBreadcrumb(segment);
                  return (
                    <React.Fragment key={url}>
                      <BreadcrumbSeparator className="opacity-40" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-bold text-foreground">{label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={url} className="hover:text-foreground transition-colors">{label}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="hidden lg:flex items-center gap-4 bg-slate-100/50 hover:bg-slate-200/50 border-none rounded-full h-9 px-4 text-muted-foreground font-medium transition-all"
              onClick={() => {
                const e = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
                document.dispatchEvent(e);
              }}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="text-xs">Omnisearch...</span>
              </div>
              <kbd className="bg-white px-1.5 py-0.5 rounded border text-[10px] font-bold shadow-sm">⌘K</kbd>
            </Button>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900" />
            </Button>
            <Separator orientation="vertical" className="h-6 opacity-30" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 px-2 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                  <Avatar className="h-7 w-7 border border-slate-200 dark:border-slate-700">
                    <AvatarFallback className="bg-indigo-600 text-[10px] text-white font-bold uppercase">JD</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-xs font-bold">Jane Doe</span>
                    <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">Super Admin</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl shadow-xl border-slate-200 dark:border-slate-800">
                <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/system" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" /> Profile Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/system" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" /> Global Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/system/faq" className="flex items-center cursor-pointer">
                    <HelpCircle className="mr-2 h-4 w-4" /> Documentation
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive font-semibold">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden">
          {container ? (
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 ${contentClassName || ""}`}>
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}