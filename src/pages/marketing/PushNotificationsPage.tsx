import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Bell, Plus, Search, Send, BarChart3, Trash2, Smartphone, Users, Clock, Edit, TrendingUp, Image as ImageIcon, Gift, Clock4, MessageSquareText, ChevronRight, Database } from 'lucide-react';
import { usePushCampaigns, usePushCampaignMutations } from '@/lib/api-hooks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
const pushSchema = z.object({
  name: z.string().min(3, "Campaign name required"),
  category: z.string(),
  messageTitle: z.string().min(3, "Title required"),
  messageBody: z.string().min(5, "Body required"),
  imageUrl: z.string().optional(),
  targetingType: z.enum(['Global Broadcast', 'Segmented']),
  targetSegment: z.enum(['All Members', 'Gold Tier', 'Silver Tier', 'Bronze Tier', 'Mission Completers']),
  triggerType: z.enum(['Manual', 'Event-Based', 'Scheduled']),
  scheduledFor: z.string().min(1, "Schedule date required"),
});
type PushFormData = z.infer<typeof pushSchema>;
const TEMPLATES = [
  { category: 'Birthday', title: 'Happy Birthday {name}! 🎂', body: 'Enjoy a special reward on your special day. Open to claim 500 XP bonus.' },
  { category: 'Mission', title: 'New Mission: {mission_name} 🕵️', body: 'A new challenge awaits. Complete it to unlock exclusive rewards.' },
  { category: 'Approval', title: 'Points Claim Approved! ✅', body: 'Your receipt from {venue} has been verified. {points} XP added to your account.' },
  { category: 'Congrats', title: 'Level Up! 🛡️', body: 'Congratulations! You have reached {tier} status. Explore your new benefits.' },
];
export function PushNotificationsPage() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [editingPush, setEditingPush] = useState<any>(null);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { data, isLoading } = usePushCampaigns();
  const mutations = usePushCampaignMutations();

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  function sortIcon(key: string) {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<PushFormData>({
    resolver: zodResolver(pushSchema),
    defaultValues: {
      category: 'General',
      targetingType: 'Global Broadcast',
      targetSegment: 'All Members',
      triggerType: 'Scheduled',
      scheduledFor: new Date().toISOString().slice(0, 16)
    }
  });
  const previewTitle = watch('messageTitle');
  const previewBody = watch('messageBody');
  const previewImage = watch('imageUrl');
  const targetType = watch('targetingType');
  const filteredCampaigns = useMemo(() => {
    let items = (data?.items ?? []);
    if (activeTab !== 'all') {
      items = items.filter(c => {
        if (activeTab === 'transactional') return ['Points', 'Approval', 'Reminder'].includes(c.category);
        if (activeTab === 'engagement') return ['Mission', 'Event', 'Announcement'].includes(c.category);
        if (activeTab === 'personal') return ['Birthday', 'Congrats'].includes(c.category);
        return true;
      });
    }
    items = items.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.messageTitle.toLowerCase().includes(search.toLowerCase())
    );
    if (sortKey) {
      items = [...items].sort((a: any, b: any) => {
        const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
        if (av === bv) return 0;
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }
    return items;
  }, [data?.items, search, activeTab, sortKey, sortDir]);
  const onSubmit = async (values: PushFormData) => {
    try {
      await mutations.create.mutateAsync({
        ...values,
        channel: 'push',
        status: 'scheduled',
        startDate: values.scheduledFor.split('T')[0],
        endDate: values.scheduledFor.split('T')[0],
        reach: 0,
        openRate: 0,
        ctr: 0
      } as any);
      setIsComposerOpen(false);
      reset();
      toast.success("Push notification successfully masterminded!");
    } catch (e) {
      toast.error("Deployment failed.");
    }
  };
  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setValue('category', tpl.category);
    setValue('messageTitle', tpl.title);
    setValue('messageBody', tpl.body);
    toast.info(`Applied ${tpl.category} template`);
  };
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">Push Mastery</h1>
            <p className="text-muted-foreground font-medium">Enterprise engagement command center for mobile notifications.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-2xl shadow-lg font-bold" onClick={() => setIsComposerOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Message
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 shadow-soft border-none overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-lg font-bold">Engagement Pulse</CardTitle>
              <CardDescription>30-day mobile interaction trends.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
              <Database className="h-8 w-8 opacity-30" />
              <p className="text-sm">Geen data beschikbaar</p>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-none bg-indigo-600 text-white rounded-[2rem] overflow-hidden flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Executive View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black opacity-60 tracking-[0.2em]">Master Open Rate</span>
                <div className="text-4xl font-black">—</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black opacity-60 tracking-[0.2em]">Total Sent (Cycle)</span>
                <div className="text-4xl font-black">—</div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs text-white/60">Geen data beschikbaar</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <TabsList className="bg-muted/50 p-1 w-full md:w-auto rounded-xl">
              <TabsTrigger value="all" className="px-8 rounded-lg">All</TabsTrigger>
              <TabsTrigger value="transactional" className="px-8 rounded-lg">Transactional</TabsTrigger>
              <TabsTrigger value="engagement" className="px-8 rounded-lg">Engagement</TabsTrigger>
              <TabsTrigger value="personal" className="px-8 rounded-lg">Personal</TabsTrigger>
            </TabsList>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search command log..."
                className="pl-9 h-11 bg-white border-none shadow-sm rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <TabsContent value={activeTab} className="mt-0">
            <Card className="shadow-soft border-none rounded-[2rem] overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow>
                      <TableHead className="pl-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('messageTitle')}>Notification{sortIcon('messageTitle')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('category')}>Category{sortIcon('category')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('targetingType')}>Targeting{sortIcon('targetingType')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('triggerType')}>Trigger{sortIcon('triggerType')}</TableHead>
                      <TableHead className="text-right pr-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [1, 2, 3].map(i => (
                        <TableRow key={i}><TableCell colSpan={5} className="h-16 animate-pulse bg-muted/10" /></TableRow>
                      ))
                    ) : filteredCampaigns.map((c) => (
                      <TableRow key={c.id} className="group hover:bg-indigo-50/30 transition-colors cursor-pointer" onClick={() => setEditingPush(c)}>
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                              <Bell className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm line-clamp-1">{c.messageTitle}</div>
                              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{c.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-indigo-100 text-indigo-700 bg-indigo-50/50">
                            {c.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">{c.targetingType}</span>
                            <span className="text-[10px] text-muted-foreground">{c.targetSegment}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px] font-black">
                            {c.triggerType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={e => { e.stopPropagation(); setEditingPush(c); }}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={e => e.stopPropagation()}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Edit Push Campaign Sheet */}
        <Sheet open={!!editingPush} onOpenChange={o => !o && setEditingPush(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Push Notification bewerken</SheetTitle>
              <SheetDescription>Wijzig de gegevens van "{editingPush?.name}"</SheetDescription>
            </SheetHeader>
            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label>Naam</Label>
                <Input defaultValue={editingPush?.name} onChange={e => setEditingPush((c: any) => ({ ...c, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Titel</Label>
                <Input defaultValue={editingPush?.messageTitle} onChange={e => setEditingPush((c: any) => ({ ...c, messageTitle: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Bericht</Label>
                <Textarea defaultValue={editingPush?.messageBody} onChange={e => setEditingPush((c: any) => ({ ...c, messageBody: e.target.value }))} rows={3} />
              </div>
            </div>
            <SheetFooter>
              <Button variant="ghost" onClick={() => setEditingPush(null)}>Annuleren</Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={async () => {
                try {
                  await mutations.update.mutateAsync(editingPush);
                  setEditingPush(null);
                  toast.success('Notification bijgewerkt');
                } catch { toast.error('Bijwerken mislukt'); }
              }}>Opslaan</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        <Sheet open={isComposerOpen} onOpenChange={setIsComposerOpen}>
          <SheetContent className="sm:max-w-4xl overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle className="text-3xl font-black tracking-tighter">Command Composer</SheetTitle>
                <SheetDescription>Architect targeted engagement alerts with rich media support.</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-8">
                <div className="lg:col-span-7 space-y-8">
                  {/* Template Selection */}
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Grouped Templates</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {TEMPLATES.map((tpl) => (
                        <Card
                          key={tpl.category}
                          className="cursor-pointer hover:border-indigo-500 transition-all border-dashed"
                          onClick={() => applyTemplate(tpl)}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                {tpl.category === 'Birthday' ? <Gift className="h-4 w-4" /> : <MessageSquareText className="h-4 w-4" />}
                              </div>
                              <span className="text-xs font-bold">{tpl.category}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Campaign Identifier</Label>
                      <Input {...register('name')} placeholder="Internal reference name" className="h-11" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-bold">Category</Label>
                        <Select onValueChange={(v) => setValue('category', v as any)} defaultValue="General">
                          <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Announcement">Announcement</SelectItem>
                            <SelectItem value="Birthday">Birthday</SelectItem>
                            <SelectItem value="Mission">Mission</SelectItem>
                            <SelectItem value="Approval">Approval</SelectItem>
                            <SelectItem value="Congrats">Congrats</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">Trigger Logic</Label>
                        <Select onValueChange={(v) => setValue('triggerType', v as any)} defaultValue="Scheduled">
                          <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Event-Based">Event-Based</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Notification Title</Label>
                      <Input {...register('messageTitle')} placeholder="Appears in bold..." className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Message Content</Label>
                      <Textarea {...register('messageBody')} placeholder="Notification body text..." className="min-h-[100px]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Rich Media Image URL (Optional)</Label>
                      <div className="flex gap-2">
                        <Input {...register('imageUrl')} placeholder="https://unsplash.com/..." className="h-11" />
                        <Button variant="outline" size="icon" className="h-11 w-11"><ImageIcon className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="font-bold">Targeting Strategy</Label>
                          <p className="text-xs text-muted-foreground">Global broadcast vs Segmented targeting</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black uppercase text-muted-foreground">Broadcast</span>
                          <Switch
                            checked={targetType === 'Segmented'}
                            onCheckedChange={(checked) => setValue('targetingType', checked ? 'Segmented' : 'Global Broadcast')}
                          />
                          <span className="text-[10px] font-black uppercase text-indigo-600">Segmented</span>
                        </div>
                      </div>
                      {targetType === 'Segmented' && (
                        <div className="grid grid-cols-2 gap-4 animate-slide-up">
                          <div className="space-y-2">
                            <Label className="font-bold text-xs">Target Segment</Label>
                            <Select onValueChange={(v) => setValue('targetSegment', v as any)} defaultValue="All Members">
                              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="All Members">All Members</SelectItem>
                                <SelectItem value="Gold Tier">Gold Tier</SelectItem>
                                <SelectItem value="Silver Tier">Silver Tier</SelectItem>
                                <SelectItem value="Bronze Tier">Bronze Tier</SelectItem>
                                <SelectItem value="Mission Completers">Mission Completers</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="font-bold text-xs">Execution Time</Label>
                            <Input type="datetime-local" {...register('scheduledFor')} className="h-10" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="sticky top-0 w-full flex flex-col items-center">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-6">Master Rich Preview</Label>
                    <div className="relative w-full max-w-[280px] aspect-[9/19] bg-slate-900 rounded-[3rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden p-3">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 bg-slate-800 rounded-full z-20" />
                      {/* iOS Style Notification */}
                      <div className="mt-14 space-y-3">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/20 animate-slide-up">
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="h-5 w-5 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">N</div>
                                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">TechEdge Nexus</span>
                              </div>
                              <span className="text-[9px] text-slate-500 font-bold">NOW</span>
                            </div>
                            <div className="space-y-1">
                              <div className="text-[13px] font-bold text-slate-900 line-clamp-1">{previewTitle || "Rich Notification"}</div>
                              <div className="text-[11px] text-slate-600 line-clamp-2 leading-tight">{previewBody || "Detailed content appears here with rich media support."}</div>
                            </div>
                          </div>
                          {previewImage && (
                            <div className="aspect-video w-full bg-slate-100 border-t border-slate-100">
                              <img src={previewImage} alt="Rich Media" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="grid grid-cols-2 divide-x border-t border-slate-100">
                            <div className="p-2.5 text-[10px] font-bold text-indigo-600 text-center uppercase tracking-widest">View Details</div>
                            <div className="p-2.5 text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">Dismiss</div>
                          </div>
                        </div>
                      </div>
                      {/* Phone UI Background Details */}
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                        <Smartphone className="h-3 w-3" /> Rich iOS 17 Preview System
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500">
                        <Clock4 className="h-3 w-3" /> Delivery latency: &lt; 2s
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SheetFooter className="pt-8 border-t bg-slate-50/50 -mx-6 px-6 pb-6">
                <Button variant="ghost" type="button" onClick={() => setIsComposerOpen(false)} className="h-12 px-8 rounded-xl font-bold">Discard</Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button" className="h-12 px-6 rounded-xl font-bold">Save Draft</Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-10 rounded-xl font-bold shadow-lg shadow-indigo-200">
                    Deploy Mastery Launch
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}