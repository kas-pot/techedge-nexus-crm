import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gift, Copy, Plus, Search, Calendar, RefreshCcw } from 'lucide-react';
import { useGiftCards, useGiftCardGeneration } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function GiftCardsPage() {
  const { data, isLoading } = useGiftCards();
  const generateMutation = useGiftCardGeneration();
  const [search, setSearch] = useState('');
  const [genCount, setGenCount] = useState(10);
  const [genValue, setGenValue] = useState(500000);
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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Serial copied to clipboard");
  };
  const giftCards = (data?.items || []).filter(gc => gc.serial.includes(search));
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gift Card Central</h1>
            <p className="text-muted-foreground">Generate and track enterprise-grade digital value cards.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><RefreshCcw className="mr-2 h-4 w-4" /> Batch Report</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Quick Redeem</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 shadow-soft h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-600" /> Card Generator</CardTitle>
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
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" defaultValue="2025-12-31" />
              </div>
              <Button className="w-full bg-indigo-600 h-11" onClick={handleGenerate} disabled={generateMutation.isPending}>
                {generateMutation.isPending ? "Generating..." : "Generate Batch"}
              </Button>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/10 p-4 border-t rounded-b-xl">
              <p className="text-xs text-muted-foreground">
                <Gift className="inline h-3 w-3 mr-1" /> Generated cards will be active immediately.
              </p>
            </CardFooter>
          </Card>
          <Card className="lg:col-span-2 shadow-soft">
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
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Initial Value</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="h-24 animate-pulse bg-muted/10" /></TableRow>
                  ) : (
                    giftCards.map((gc) => (
                      <TableRow key={gc.id}>
                        <TableCell className="font-mono text-xs flex items-center gap-2">
                          {gc.serial}
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(gc.serial)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TableCell>
                        <TableCell>Rp {gc.value.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">Rp {gc.balance.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={gc.status === 'active' ? 'default' : 'secondary'} className={gc.status === 'active' ? 'bg-emerald-600' : ''}>
                            {gc.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}