import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users2, Landmark, Plus, Mail, Globe, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { usePartners } from '@/lib/api-hooks';
export function PartnershipsPage() {
  const { data, isLoading } = usePartners();
  const partners = data?.items || [];
  const renderPartnerCard = (partner: any) => (
    <Card key={partner.id} className="group hover:shadow-soft transition-all duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
          {partner.type === 'bank' ? <Landmark className="h-7 w-7" /> : <Users2 className="h-7 w-7" />}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{partner.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-[10px] h-5">{partner.type.toUpperCase()}</Badge>
            <Badge className={partner.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}>{partner.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 dark:border-slate-800">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Agreement</div>
            <div className="text-sm font-semibold flex items-center gap-1.5 text-indigo-600">
              <ShieldCheck className="h-3.5 w-3.5" /> {partner.agreementLevel}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-[10px] uppercase font-bold text-muted-foreground">Joined</div>
            <div className="text-sm font-semibold flex items-center gap-1.5 justify-end">
              <Calendar className="h-3.5 w-3.5" /> {new Date(partner.joinedDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 h-9">
            <Mail className="mr-2 h-3.5 w-3.5" /> Contact
          </Button>
          <Button variant="outline" size="sm" className="h-9 w-9 p-0">
            <Globe className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Partnership Hub</h1>
            <p className="text-muted-foreground">Manage ecosystem collaborations, bank integrations, and retail partners.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> New Partnership
          </Button>
        </div>
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="px-8">All Partners</TabsTrigger>
            <TabsTrigger value="bank" className="px-8 flex items-center gap-2"><Landmark className="h-3.5 w-3.5" /> Banks</TabsTrigger>
            <TabsTrigger value="retail" className="px-8">Retail</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-64 animate-pulse bg-muted/10" />)
              ) : partners.map(renderPartnerCard)}
            </div>
          </TabsContent>
          <TabsContent value="bank" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.filter(p => p.type === 'bank').map(renderPartnerCard)}
            </div>
          </TabsContent>
          <TabsContent value="retail" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.filter(p => p.type === 'retail').map(renderPartnerCard)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}