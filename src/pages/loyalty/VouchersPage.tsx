import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Calendar, TrendingUp, Plus, Tag, ArrowRight } from 'lucide-react';
import { useVouchers } from '@/lib/api-hooks';
export function VouchersPage() {
  const { data, isLoading } = useVouchers();
  const vouchers = data?.items || [];
  const renderVoucherCard = (voucher: any) => (
    <Card key={voucher.id} className="group relative border-2 border-dashed hover:border-indigo-400 transition-all duration-300 bg-card overflow-hidden">
      <div className="absolute top-0 bottom-0 left-[-8px] w-4 bg-background border-r-2 border-dashed border-border rounded-full flex flex-col justify-around py-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />)}
      </div>
      <div className="absolute top-0 bottom-0 right-[-8px] w-4 bg-background border-l-2 border-dashed border-border rounded-full flex flex-col justify-around py-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />)}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={voucher.status === 'active' ? 'default' : 'secondary'} className={voucher.status === 'active' ? 'bg-indigo-600' : ''}>
            {voucher.status.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">
            <Tag className="h-3 w-3" /> {voucher.code}
          </div>
        </div>
        <CardTitle className="text-xl mt-4">{voucher.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <div className="text-3xl font-bold flex items-baseline gap-1">
            {voucher.discountType === 'percentage' ? `${voucher.value}%` : `Rp ${voucher.value.toLocaleString()}`}
            <span className="text-xs font-normal opacity-80">Discount Value</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Expires {new Date(voucher.expiryDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <TrendingUp className="h-4 w-4" /> 1.2k Used
          </div>
        </div>
        <Button variant="outline" className="w-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          View Analytics <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Voucher Management</h1>
            <p className="text-muted-foreground">Design, track, and distribute high-impact reward vouchers.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create Voucher
          </Button>
        </div>
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1">
            <TabsTrigger value="active" className="px-6">Active</TabsTrigger>
            <TabsTrigger value="scheduled" className="px-6">Scheduled</TabsTrigger>
            <TabsTrigger value="expired" className="px-6">Expired</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.filter(v => v.status === 'active').map(renderVoucherCard)}
              {vouchers.filter(v => v.status === 'active').length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                  No active vouchers found.
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="scheduled" className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            Currently no scheduled voucher campaigns.
          </TabsContent>
          <TabsContent value="expired" className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            View historical voucher performance analytics in the Reporting module.
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}