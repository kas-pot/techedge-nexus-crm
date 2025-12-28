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
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Bell, Plus, Search, Send, BarChart3, Trash2, Smartphone, Users, Clock, Edit } from 'lucide-react';
import { usePushCampaigns, usePushCampaignMutations } from '@/lib/api-hooks';
import { PUSH_ANALYTICS_DATA } from '@shared/mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
const pushSchema = z.object({
  name: z.string().min(3, "Campaign name required"),
  messageTitle: z.string().min(3, "Title required"),
  messageBody: z.string().min(5, "Body required"),
  targetSegment: z.enum(['All Members', 'Gold Tier', 'Silver Tier', 'Bronze Tier']),
  scheduledFor: z.string().min(1, "Schedule date required"),
});
type PushFormData = z.infer<typeof pushSchema>;
export function PushNotificationsPage() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data, isLoading } = usePushCampaigns();
  const mutations = usePushCampaignMutations();
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<PushFormData>({
    resolver: zodResolver(pushSchema),
    defaultValues: {
      targetSegment: 'All Members',
      scheduledFor: new Date().toISOString().slice(0, 16)
    }
  });
  const previewTitle = watch('messageTitle');
  const previewBody = watch('messageBody');
  const filteredCampaigns = useMemo(() => {
    return (data?.items ?? []).filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.messageTitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [data?.items, search]);
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
      toast.success("Push notification scheduled successfully!");
    } catch (e) {
      toast.error("Failed to schedule notification.");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await mutations.remove.mutateAsync(id);
      toast.success("Campaign deleted");
    } catch (e) {
      toast.error("Delete failed");
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-10 animate-fade-in">
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
              <CardTitle className="text-lg font-bold">Open Rate Performance</CardTitle>
              <CardDescription>30-day historical engagement trends.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PUSH_ANALYTICS_DATA}>
                  <defs>
                    <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="openRate" stroke="#4F46E5" fillOpacity={1} fill="url(#colorOpen)" strokeWidth={3} name="Open Rate %" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-none bg-indigo-600 text-white rounded-[2rem] overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black opacity-60 tracking-[0.2em]">Avg Open Rate</span>
                <div className="text-4xl font-black">28.4%</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black opacity-60 tracking-[0.2em]">Total Sent (30d)</span>
                <div className="text-4xl font-black">42.5k</div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <TrendingUp className="h-4 w-4" /> +12% improvement vs last month
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="shadow-soft border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Campaign Ledger</CardTitle>
              <CardDescription>Comprehensive history of mobile engagement.</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search campaigns..." 
                className="pl-9 h-11 bg-white border-none shadow-sm rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="pl-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Campaign / Message</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Segment</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">Metrics</TableHead>
                  <TableHead className="text-right pr-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [1,2,3].map(i => (
                    <TableRow key={i}><TableCell colSpan={5} className="h-16 animate-pulse bg-muted/10" /></TableRow>
                  ))
                ) : filteredCampaigns.map((c) => (
                  <TableRow key={c.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <Bell className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{c.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">{c.messageTitle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.status === 'sent' ? 'default' : 'secondary'} className={c.status === 'sent' ? 'bg-indigo-600' : ''}>
                        {c.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-indigo-100 text-indigo-700 bg-indigo-50/50">
                        {c.targetSegment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="text-xs flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="font-bold">{(c.reach ?? 0).toLocaleString()}</span>
                        </div>
                        {c.status === 'sent' && (
                          <div className="text-[10px] flex items-center gap-2 font-bold text-indigo-600">
                            <Send className="h-2.5 w-2.5" />
                            {c.openRate}% Open
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Sheet open={isComposerOpen} onOpenChange={setIsComposerOpen}>
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle className="text-2xl font-black tracking-tight">Notification Composer</SheetTitle>
                <SheetDescription>Draft and schedule high-impact mobile push alerts.</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Campaign Internal Name</Label>
                    <Input {...register('name')} placeholder="e.g., Summer Points Festival" />
                    {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Message Title</Label>
                    <Input {...register('messageTitle')} placeholder="What users see first..." />
                    {errors.messageTitle && <p className="text-xs text-destructive font-medium">{errors.messageTitle.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Message Body</Label>
                    <Textarea {...register('messageBody')} placeholder="Compelling notification content..." className="min-h-[100px]" />
                    {errors.messageBody && <p className="text-xs text-destructive font-medium">{errors.messageBody.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-bold">Target Segment</Label>
                      <Select onValueChange={(v) => setValue('targetSegment', v as any)} defaultValue="All Members">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Members">All Members</SelectItem>
                          <SelectItem value="Gold Tier">Gold Tier</SelectItem>
                          <SelectItem value="Silver Tier">Silver Tier</SelectItem>
                          <SelectItem value="Bronze Tier">Bronze Tier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">Schedule For</Label>
                      <Input type="datetime-local" {...register('scheduledFor')} />
                      {errors.scheduledFor && <p className="text-xs text-destructive font-medium">{errors.scheduledFor.message}</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-3xl p-6 border flex flex-col items-center">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-6">Live Mobile Preview</Label>
                  <div className="relative w-full aspect-[9/19] bg-slate-900 rounded-[2.5rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden p-4">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-6 w-24 bg-slate-800 rounded-full" />
                    <div className="mt-12 space-y-3">
                      <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20 animate-slide-up">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">N</div>
                          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Nexus CRM �� Just Now</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-slate-900 line-clamp-1">{previewTitle || "New Notification"}</div>
                          <div className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{previewBody || "Draft your message in the composer to see how it appears on user devices."}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                    <Smartphone className="h-3 w-3" /> Standard iOS/Android Preview
                  </div>
                </div>
              </div>
              <SheetFooter className="pt-6 border-t">
                <Button variant="ghost" type="button" onClick={() => setIsComposerOpen(false)} className="h-12 px-8 rounded-xl">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-10 rounded-xl font-bold" disabled={mutations.create.isPending}>
                  {mutations.create.isPending ? "Scheduling..." : <><Clock className="mr-2 h-4 w-4" /> Schedule Notification</>}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}