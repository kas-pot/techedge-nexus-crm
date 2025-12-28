import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_MEMBERS } from '@shared/mock-data';
import { Search, Filter, MoreVertical, Download, UserPlus, Mail, ShieldAlert, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
export function MemberListPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [search, setSearch] = useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const filteredMembers = MOCK_MEMBERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AppLayout container>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Registry</h1>
            <p className="text-muted-foreground">Manage and audit the 5,050 members in your ecosystem.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100">
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </div>
        <Card className="border-none shadow-soft overflow-hidden">
          <CardHeader className="pb-4 bg-slate-50/50 dark:bg-card/50 border-b">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, ID or email..." 
                    className="pl-9 h-11 bg-white dark:bg-slate-900 border-none shadow-inner focus-visible:ring-indigo-500" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 bg-white dark:bg-slate-900 border-none shadow-sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white dark:bg-slate-700 shadow-sm"><List className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><LayoutGrid className="h-4 w-4" /></Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 border-none shadow-sm px-4">Bulk Actions <ChevronRight className="ml-2 h-4 w-4 rotate-90" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Email Blast</DropdownMenuItem>
                    <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" /> Upgrade Tiers</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive"><ShieldAlert className="mr-2 h-4 w-4" /> Suspend Accounts</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30 dark:bg-slate-900/10 hover:bg-transparent">
                  <TableHead className="pl-6 w-32 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">ID</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Profile</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Tier Status</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Points Balance</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Account Status</TableHead>
                  <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent border-b-slate-50 dark:border-b-slate-900">
                      <TableCell className="pl-6"><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredMembers.map((member) => (
                  <TableRow key={member.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors border-b-slate-50 dark:border-b-slate-900">
                    <TableCell className="pl-6 font-mono text-[11px] font-bold text-muted-foreground/80">{member.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col py-1">
                        <span className="font-bold text-sm text-foreground">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          member.tier === 'Gold' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none px-3 font-bold" :
                          member.tier === 'Silver' ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none px-3 font-bold" :
                          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-none px-3 font-bold"
                        }
                      >
                        {member.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold tabular-nums">
                      {member.points.toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal">XP</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                        <span className="text-sm font-medium">{member.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredMembers.length === 0 && !isLoading && (
              <div className="py-20 text-center space-y-3">
                <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-bold text-lg">No members found</h3>
                <p className="text-muted-foreground">Adjust your filters or try a different search term.</p>
              </div>
            )}
            <div className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-900/20 border-t">
              <p className="text-sm text-muted-foreground font-medium">
                Showing <span className="text-foreground font-bold">{filteredMembers.length}</span> of 5,050 records
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-none shadow-sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-none shadow-sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}