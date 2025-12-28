import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Ticket, ExternalLink, RefreshCw, Filter, Search, MoreVertical, Trash2, Eye, Download } from 'lucide-react';
import { useVouchers, usePartners, usePartnerSync, useVoucherMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
export function ExternalVouchersPage() {
  const [search, setSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showSyncDialog, setShowSyncDialog] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState('');
  const { data, isLoading } = useVouchers();
  const { data: partnersData } = usePartners();
  const syncMutation = usePartnerSync();
  const { remove: deleteMutation } = useVoucherMutations();
  const externalVouchers = (data?.items || []).filter(v => v.isExternal && v.title.toLowerCase().includes(search.toLowerCase()));
  const partners = partnersData?.items || [];
  const handleSync = async () => {
    if (!selectedPartner) return;
    setIsSyncing(true);
    setSyncProgress(10);
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setSyncProgress(prev => (prev < 90 ? prev + 20 : prev));
      }, 400);
      await syncMutation.mutateAsync({ partnerId: selectedPartner, count: 5 });
      clearInterval(interval);
      setSyncProgress(100);
      setTimeout(() => {
        setIsSyncing(false);
        setShowSyncDialog(false);
        toast.success("Rewards synchronized successfully from partner.");
      }, 500);
    } catch (e) {
      setIsSyncing(false);
      toast.error("Synchronization failed.");
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">External Voucher Hub</h1>
            <p className="text-muted-foreground">Manage and audit rewards sourced from banks and retail partners.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Audit</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowSyncDialog(true)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Import from Partners
            </Button>
          </div>
        </div>
        <Card className="shadow-soft border-none">
          <CardHeader className="border-b bg-slate-50/50 dark:bg-card/50">
            <div className="flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search external rewards..." 
                  className="pl-9 h-11"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-11 w-11"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30">
                  <TableHead className="pl-6">Voucher Name</TableHead>
                  <TableHead>Partner Source</TableHead>
                  <TableHead>Redemption Code</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Sync Date</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6} className="h-16 animate-pulse bg-muted/10" /></TableRow>
                  ))
                ) : externalVouchers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Ticket className="h-12 w-12 mb-4 opacity-20" />
                        <p className="font-medium text-lg">No external vouchers synced</p>
                        <p className="text-sm">Click 'Import from Partners' to begin.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  externalVouchers.map((v) => (
                    <TableRow key={v.id} className="group hover:bg-indigo-50/30 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                            <Ticket className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-sm">{v.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-bold border-none">
                          {partners.find(p => p.id === v.sourcePartnerId)?.name || 'Sync Partner'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{v.code}</TableCell>
                      <TableCell className="font-bold">
                        {v.discountType === 'percentage' ? `${v.value}%` : `Rp ${v.value.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {v.syncDate ? new Date(v.syncDate).toLocaleDateString() : 'Manual'}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/loyalty/vouchers/${v.id}`}><Eye className="h-4 w-4" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(v.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={showSyncDialog} onOpenChange={setShowSyncDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Partner Reward Import</DialogTitle>
              <DialogDescription>Select a partner ecosystem to synchronize available rewards into Nexus CRM.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Select Partner</label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner} disabled={isSyncing}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Bank or Retailer" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.type.toUpperCase()})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isSyncing && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Synchronizing Secure Feed...</span>
                    <span>{syncProgress}%</span>
                  </div>
                  <Progress value={syncProgress} className="h-2" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowSyncDialog(false)} disabled={isSyncing}>Cancel</Button>
              <Button className="bg-indigo-600 h-11 px-8" onClick={handleSync} disabled={isSyncing || !selectedPartner}>
                {isSyncing ? "Syncing..." : "Start Import"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}