import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Voucher, Partner } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit, Calendar, Tag, ShieldCheck, History, TrendingUp, Users, Download, ExternalLink } from 'lucide-react';
export function VoucherDetailPage() {
  const { id } = useParams();
  const { data: voucher, isLoading } = useQuery({
    queryKey: ['vouchers', id],
    queryFn: () => api<Voucher>(`/api/vouchers/${id}`)
  });
  const { data: partner } = useQuery({
    queryKey: ['partners', voucher?.sourcePartnerId],
    queryFn: () => api<Partner>(`/api/partners/${voucher?.sourcePartnerId}`),
    enabled: !!voucher?.sourcePartnerId
  });
  if (isLoading) return <AppLayout container><div className="space-y-4"><Skeleton className="h-12 w-1/3" /><Skeleton className="h-96 w-full" /></div></AppLayout>;
  if (!voucher) return <AppLayout container>Voucher not found</AppLayout>;
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/loyalty/vouchers"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{voucher.title}</h1>
                <Badge className={voucher.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}>{voucher.status}</Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Tag className="h-3.5 w-3.5" /> ID: {voucher.id} • Reward Code: {voucher.code}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Usage Stats</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Edit className="mr-2 h-4 w-4" /> Edit Details
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: 'Redemption Rate', value: '—', icon: TrendingUp, color: 'text-indigo-600' },
            { label: 'Total Issued', value: '—', icon: Tag, color: 'text-blue-600' },
            { label: 'Active Holders', value: '—', icon: Users, color: 'text-emerald-600' },
            { label: 'Burn Velocity', value: '—', icon: ShieldCheck, color: 'text-amber-600' },
          ].map((stat, i) => (
            <Card key={i} className="shadow-soft border-none">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-soft border-none overflow-hidden bg-slate-50/50">
              <CardHeader className="bg-white border-b">
                <CardTitle>Configuration Summary</CardTitle>
                <CardDescription>Reward value and restriction parameters.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x divide-y">
                  <div className="p-6 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Discount Value</span>
                    <div className="text-2xl font-black text-indigo-600">
                      {voucher.discountType === 'percentage' ? `${voucher.value}%` : `Rp ${voucher.value.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="p-6 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Expiry Schedule</span>
                    <div className="text-sm font-semibold">{new Date(voucher.expiryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div className="p-6 space-y-1 col-span-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Terms of Service</span>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      This reward is valid for a single transaction at authorized participating outlets. Cannot be combined with other active promotions. Minimum spend requirements may apply based on tier status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-none">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Audit Trail</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {[
                    { event: 'Voucher Synchronized', user: 'Partner Engine', date: voucher.syncDate || '2024-06-12 10:42' },
                    { event: 'Initial Configuration', user: 'System Admin', date: '2024-06-12 09:15' },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 relative">
                      {i !== 1 && <div className="absolute left-[15px] top-8 bottom-[-24px] w-[2px] bg-slate-100" />}
                      <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border shrink-0 z-10">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold">{log.event}</p>
                          <span className="text-xs text-muted-foreground">{log.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">By {log.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-none shadow-xl overflow-hidden relative group">
              <div className="absolute top-[-10px] right-[-10px] h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-white/90">
                  Nexus Card Preview
                  <ShieldCheck className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-4xl font-black tracking-tighter">
                  {voucher.discountType === 'percentage' ? `${voucher.value}% OFF` : `Rp ${voucher.value.toLocaleString()}`}
                </div>
                <div className="pt-8 border-t border-white/20">
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-1">Security Code</div>
                  <div className="text-lg font-mono tracking-widest">{voucher.code}</div>
                </div>
              </CardContent>
              <div className="px-6 py-4 bg-black/20 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span>Valid Until {new Date(voucher.expiryDate).toLocaleDateString()}</span>
                <ExternalLink className="h-3 w-3" />
              </div>
            </Card>
            {voucher.isExternal && partner && (
              <Card className="shadow-soft border-none">
                <CardHeader>
                  <CardTitle className="text-sm">Partner Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                      {partner.name.substring(0, 1)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{partner.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{partner.type} Ecosystem</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Agreement Level</span>
                      <span className="font-bold text-indigo-600">{partner.agreementLevel}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Sync Status</span>
                      <Badge className="bg-emerald-600 text-[9px] h-4">Connected</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-9 text-xs">View Partner Portal</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}