import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Gift, Copy, Plus, Search, RefreshCcw, Landmark } from 'lucide-react';
import { useGiftCards, useGiftCardBatch, useGiftCardMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function GiftCardsPage() {
  const { data, isLoading } = useGiftCards();
  const generateMutation = useGiftCardBatch();
  const { update: updateMutation } = useGiftCardMutations();
  const [search, setSearch] = useState('');
  const [genCount, setGenCount] = useState(10);
  const [genValue, setGenValue] = useState(500000);
  const [redeemSerial, setRedeemSerial] = useState('');
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);
  const [foundCard, setFoundCard] = useState<any>(null);
  const handleGenerate = async () => {
    try {
      await generateMutation.mutateAsync({
        count: genCount,
        value: genValue,
        expiryDate: '2025-12-31'
      });
      toast.success(`${genCount} Gift Cards successfully generated`);
    } catch (e) {
      toast.error("Failed to generate gift cards");
    }
  };
  const handleCheckSerial = () => {
    const card = data?.items.find(c => c.serial === redeemSerial);
    if (card) {
      setFoundCard(card);
    } else {
      toast.error("Gift card serial not found");
      setFoundCard(null);
    }
  };
  const handleRedeem = async () => {
    if (!foundCard) return;
    try {
      await updateMutation.mutateAsync({ 
        id: foundCard.id, 
        balance: 0, 
        status: 'redeemed' 
      });
      toast.success("Redemption successful!");
      setIsRedeemOpen(false);
      setFoundCard(null);
      setRedeemSerial('');
    } catch (e) {
      toast.error("Redemption failed");
    }
  };
  const giftCards = (data?.items || []).filter(gc => gc.serial.includes(search));
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto py-8 md:py-12 space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gift Card Central</h1>
            <p className="text-muted-foreground">Generate and track enterprise-grade digital value cards.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><RefreshCcw className="mr-2 h-4 w-4" /> Batch Report</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsRedeemOpen(true)}>Quick Redeem</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-soft h-fit border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600"><Plus className="h-5 w-5" /> Card Generator</CardTitle>
              <CardDescription>Mint a new batch of gift cards for distribution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Quantity to Mint</Label>
                <Input type="number" value={genCount} onChange={(e) => setGenCount(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Value per Card (IDR)</Label>
                <Input type="number" value={genValue} onChange={(e) => setGenValue(Number(e.target.value))} />
              </div>
              <Button className="w-full bg-indigo-600 h-11" onClick={handleGenerate} disabled={generateMutation.isPending}>
                {generateMutation.isPending ? "Generating..." : "Generate Batch"}
              </Button>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2 shadow-soft border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <CardTitle>Management Ledger</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search serial..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead className="pl-6">Serial Number</TableHead>
                    <TableHead>Value (IDR)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="h-12 animate-pulse" /></TableRow>
                  ) : giftCards.map((gc) => (
                    <TableRow key={gc.id}>
                      <TableCell className="pl-6 font-mono text-xs">{gc.serial}</TableCell>
                      <TableCell>Rp {gc.value.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={gc.status === 'active' ? 'default' : 'secondary'} className={gc.status === 'active' ? 'bg-emerald-600' : ''}>
                          {gc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="sm">History</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Dialog open={isRedeemOpen} onOpenChange={setIsRedeemOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Quick Redemption</DialogTitle>
              <DialogDescription>Validate and redeem customer gift cards in real-time.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="NXS-XXXXXXXX" 
                  value={redeemSerial} 
                  onChange={(e) => setRedeemSerial(e.target.value.toUpperCase())}
                  className="h-12 text-lg font-mono"
                />
                <Button onClick={handleCheckSerial} className="h-12 px-6">Check</Button>
              </div>
              {foundCard && (
                <div className="p-4 rounded-xl bg-slate-50 border border-indigo-100 space-y-3 animate-slide-up">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Current Balance</span>
                    <Badge className="bg-emerald-600">Rp {foundCard.balance.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Status</span>
                    <span className="text-sm font-medium">{foundCard.status}</span>
                  </div>
                  <Separator />
                  <Button 
                    className="w-full bg-indigo-600 h-11" 
                    onClick={handleRedeem}
                    disabled={foundCard.status !== 'active' || updateMutation.isPending}
                  >
                    Redeem Full Value
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}