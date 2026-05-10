import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Megaphone, Mail, Bell, MessageSquare, Send, BarChart3, Clock, LayoutGrid, List, Plus, Search, ArrowRight, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCampaigns, useCampaignMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
const channelIcons: Record<string, any> = {
  push: Bell,
  email: Mail,
  sms: MessageSquare,
  ads: Megaphone,
};
const channelColors: Record<string, string> = {
  push: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  email: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sms: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ads: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};
export function CampaignsPage() {
  const [activeChannel, setActiveChannel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isCreating, setIsCreating] = useState(false);
  const [previewCampaign, setPreviewCampaign] = useState<any>(null);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { data, isLoading } = useCampaigns(activeChannel === 'all' ? undefined : activeChannel);
  const mutations = useCampaignMutations();
  const campaigns = data?.items || [];

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  function sortIcon(key: string) {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }
  const sortedCampaigns = sortKey
    ? [...campaigns].sort((a: any, b: any) => {
        const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
        if (av === bv) return 0;
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      })
    : campaigns;
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      channel: (fd.get('channel') as any) || 'push',
      startDate: fd.get('startDate') as string,
      endDate: fd.get('endDate') as string,
      status: 'scheduled' as const,
      reach: 0,
      openRate: 0,
      ctr: 0
    };
    try {
      await mutations.create.mutateAsync(payload);
      setIsCreating(false);
      toast.success("Campaign scheduled successfully");
    } catch (err) {
      toast.error("Failed to create campaign");
    }
  };
  const simulateSend = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Sending test notification...',
      success: 'Test preview sent to Admin device!',
      error: 'Failed to send preview'
    });
    setPreviewCampaign(null);
  };
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing Command Center</h1>
            <p className="text-muted-foreground">Orchestrate and monitor multi-channel engagement campaigns.</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-muted p-1 rounded-lg mr-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-indigo-100" onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Campaign
            </Button>
          </div>
        </div>
        <Tabs defaultValue="all" onValueChange={setActiveChannel} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TabsList className="bg-muted/50 p-1 w-full md:w-auto">
              <TabsTrigger value="all" className="px-8">All Channels</TabsTrigger>
              <TabsTrigger value="push" className="px-8">Push</TabsTrigger>
              <TabsTrigger value="email" className="px-8">Email</TabsTrigger>
              <TabsTrigger value="sms" className="px-8">SMS</TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search campaigns..."
                className="w-full bg-white border border-input rounded-md py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <TabsContent value={activeChannel} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted/20" />)}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                  const Icon = channelIcons[campaign.channel] || Megaphone;
                  const statusColors = {
                    scheduled: "bg-amber-100 text-amber-700 border-amber-200",
                    running: "bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse",
                    completed: "bg-slate-100 text-slate-700 border-slate-200",
                  };
                  return (
                    <Card key={campaign.id} className="group hover:shadow-soft transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-lg ${channelColors[campaign.channel]}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className={`${statusColors[campaign.status]} capitalize`}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl line-clamp-1">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A'} - {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Delivery Reach</span>
                            <span className="text-foreground">{campaign.reach?.toLocaleString() ?? '0'} users</span>
                          </div>
                          <Progress value={campaign.reach ? 84 : 0} className="h-1.5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Open Rate</span>
                            <div className="text-lg font-bold">{(campaign.openRate ?? 0).toFixed(1)}%</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">CTR</span>
                            <div className="text-lg font-bold text-indigo-600">{(campaign.ctr ?? 0).toFixed(1)}%</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/10 py-3 gap-2">
                        <Button variant="ghost" className="flex-1 text-xs font-semibold justify-between group-hover:text-indigo-600">
                          Report <BarChart3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                          {campaign.channel === 'push' ? <Link to="/marketing/push"><ArrowRight className="h-3.5 w-3.5" /></Link> : <button onClick={() => setPreviewCampaign(campaign)}><Send className="h-3.5 w-3.5" /></button>}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-none shadow-soft">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50/50">
                        <TableHead className="pl-6 font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('name')}>Campaign Name{sortIcon('name')}</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('channel')}>Channel{sortIcon('channel')}</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('startDate')}>Schedule{sortIcon('startDate')}</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('reach')}>Reach{sortIcon('reach')}</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('openRate')}>Open Rate{sortIcon('openRate')}</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('ctr')}>CTR{sortIcon('ctr')}</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('status')}>Status{sortIcon('status')}</TableHead>
                        <TableHead className="text-right pr-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedCampaigns.map((c) => (
                        <TableRow key={c.id} className="cursor-pointer hover:bg-indigo-50/30" onClick={() => setEditingCampaign(c)}>
                          <TableCell className="pl-6 font-bold">{c.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${channelColors[c.channel]} border-none capitalize`}>
                              {c.channel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium">{c.reach?.toLocaleString() ?? '0'}</TableCell>
                          <TableCell className="font-medium">{(c.openRate ?? 0).toFixed(1)}%</TableCell>
                          <TableCell className="font-bold text-indigo-600">{(c.ctr ?? 0).toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge variant={c.status === 'running' ? 'default' : 'secondary'} className={c.status === 'running' ? 'bg-emerald-600' : ''}>
                              {c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-1">
                              {c.channel === 'push' ? <Button variant="ghost" size="icon" asChild onClick={e => e.stopPropagation()}><Link to="/marketing/push"><ArrowRight className="h-4 w-4" /></Link></Button> : <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setPreviewCampaign(c); }}><Send className="h-4 w-4" /></Button>}
                              <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setEditingCampaign(c); }}><Edit className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        {/* Create Campaign Workflow */}
        <Sheet open={isCreating} onOpenChange={setIsCreating}>
          <SheetContent className="sm:max-w-xl">
            <form onSubmit={handleCreate}>
              <SheetHeader>
                <SheetTitle>Schedule New Campaign</SheetTitle>
                <SheetDescription>Configure message parameters and delivery timeline.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label>Campaign Internal Name</Label>
                  <Input name="name" placeholder="e.g., Summer Points Festival 2024" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Delivery Channel</Label>
                    <select name="channel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="push">Push Notification</option>
                      <option value="email">Email Blast</option>
                      <option value="sms">SMS Marketing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Segment</Label>
                    <Badge variant="outline" className="h-10 w-full flex justify-between font-normal px-3 border-dashed">All Active Members <Search className="h-3 w-3" /></Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input name="endDate" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Write your message here..." />
                </div>
              </div>
              <SheetFooter>
                <Button variant="ghost" type="button" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">Schedule Launch</Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
        {/* Edit Campaign Sheet */}
        <Sheet open={!!editingCampaign} onOpenChange={o => !o && setEditingCampaign(null)}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Campaign bewerken</SheetTitle>
              <SheetDescription>Wijzig de instellingen van "{editingCampaign?.name}"</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label>Campagne naam</Label>
                <Input defaultValue={editingCampaign?.name} onChange={e => setEditingCampaign((c: any) => ({ ...c, name: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Startdatum</Label>
                  <Input type="date" defaultValue={editingCampaign?.startDate?.slice(0, 10)} onChange={e => setEditingCampaign((c: any) => ({ ...c, startDate: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Einddatum</Label>
                  <Input type="date" defaultValue={editingCampaign?.endDate?.slice(0, 10)} onChange={e => setEditingCampaign((c: any) => ({ ...c, endDate: e.target.value }))} />
                </div>
              </div>
            </div>
            <SheetFooter>
              <Button variant="ghost" onClick={() => setEditingCampaign(null)}>Annuleren</Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={async () => {
                try {
                  await mutations.update.mutateAsync(editingCampaign);
                  setEditingCampaign(null);
                  toast.success('Campaign bijgewerkt');
                } catch { toast.error('Bijwerken mislukt'); }
              }}>Opslaan</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {/* Preview Dialog */}
        <Dialog open={!!previewCampaign} onOpenChange={(o) => !o && setPreviewCampaign(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Send Test Preview</DialogTitle>
              <DialogDescription>Validate the layout of "{previewCampaign?.name}" on administrative devices.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="aspect-[4/3] rounded-2xl bg-slate-900 flex items-center justify-center p-6 text-center border-4 border-slate-800">
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 mx-auto flex items-center justify-center">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white font-bold text-sm">TechEdge Nexus</div>
                  <div className="text-slate-400 text-xs">This is how your message will appear as a push notification to users.</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setPreviewCampaign(null)}>Cancel</Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={simulateSend}>Send Test Now</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}