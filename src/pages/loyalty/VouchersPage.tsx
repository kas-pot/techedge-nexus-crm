import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Calendar, TrendingUp, Plus, Tag, ArrowRight } from 'lucide-react';
import { useVouchers, useVoucherMutations } from '@/lib/api-hooks';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function VouchersPage() {
  const { data, isLoading } = useVouchers();
  const { create } = useVoucherMutations();
  const vouchers = data?.items || [];
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active' as const,
  });

  const handleCreate = async () => {
    if (!form.title.trim() || !form.code.trim()) { toast.error('Title and code are required'); return; }
    try {
      await create.mutateAsync(form);
      setIsCreating(false);
      setForm({ title: '', code: '', discountType: 'percentage', value: 10, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'active' });
      toast.success('Voucher created');
    } catch {
      toast.error('Failed to create voucher');
    }
  };

  const renderVoucherCard = (voucher: any) => (
    <Card key={voucher.id} className="group relative border-2 border-dashed hover:border-indigo-400 transition-all duration-300 bg-card overflow-hidden hover:shadow-glow">
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
        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md group-hover:scale-[1.02] transition-transform">
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
          <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
            <TrendingUp className="h-4 w-4" /> —
          </div>
        </div>
        <Button variant="outline" className="w-full group-hover:bg-indigo-600 group-hover:text-white transition-colors" asChild>
          <Link to={`/loyalty/vouchers/${voucher.id}`}>
            View Analytics <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
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
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Voucher
          </Button>
        </div>
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-900 p-1">
            <TabsTrigger value="active" className="px-6">Active ({vouchers.filter(v => v.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="scheduled" className="px-6">Scheduled ({vouchers.filter(v => v.status === 'scheduled').length})</TabsTrigger>
            <TabsTrigger value="expired" className="px-6">Expired ({vouchers.filter(v => v.status === 'expired').length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-64 animate-pulse bg-muted/10" />)
              ) : (
                vouchers.filter(v => v.status === 'active').map(renderVoucherCard)
              )}
              {vouchers.filter(v => v.status === 'active').length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                  No active vouchers. Click "Create Voucher" to add one.
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="scheduled" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => <Card key={i} className="h-64 animate-pulse bg-muted/10" />)
              ) : (
                vouchers.filter(v => v.status === 'scheduled').map(renderVoucherCard)
              )}
              {vouchers.filter(v => v.status === 'scheduled').length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                  No scheduled voucher campaigns.
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="expired" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => <Card key={i} className="h-64 animate-pulse bg-muted/10" />)
              ) : (
                vouchers.filter(v => v.status === 'expired').map(renderVoucherCard)
              )}
              {vouchers.filter(v => v.status === 'expired').length === 0 && !isLoading && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                  No expired vouchers found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Voucher</DialogTitle>
            <DialogDescription>Define a new reward voucher for your members.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Voucher Title *</Label>
              <Input placeholder="e.g., Summer Sale 20% Off" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Redemption Code *</Label>
              <Input placeholder="e.g., SUMMER20" value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Discount Type</Label>
                <Select value={form.discountType} onValueChange={(v: any) => setForm(f => ({ ...f, discountType: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed (IDR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Value</Label>
                <Input type="number" min={0} value={form.value} onChange={(e) => setForm(f => ({ ...f, value: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Expiry Date</Label>
              <Input type="date" value={form.expiryDate} onChange={(e) => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreate} disabled={create.isPending}>
              {create.isPending ? 'Creating...' : 'Create Voucher'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
