import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Utensils, ShoppingBag, Coffee, Smartphone, MoreVertical, Store, Home, Edit } from 'lucide-react';
import { useOutlets, useVenues, useOutletMutations } from '@/lib/api-hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
const categoryIcons: Record<string, any> = {
  "F&B Dining": Utensils,
  "Fashion & Accessories": ShoppingBag,
  "Electronics": Smartphone,
  "Home & Living": Home,
  "Cosmetics & Beauty": Coffee,
};
export function OutletsPage() {
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState('all');
  const [editingOutlet, setEditingOutlet] = useState<any>(null);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { data: venuesData } = useVenues();
  const { data: outletsData, isLoading } = useOutlets();
  const mutations = useOutletMutations();

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  function sortIcon(key: string) {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }
  const filteredOutlets = (outletsData?.items || []).filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(search.toLowerCase()) || 
                         o.tenantName.toLowerCase().includes(search.toLowerCase());
    const matchesVenue = venueFilter === 'all' || o.venueId === venueFilter;
    return matchesSearch && matchesVenue;
  });
  const sortedOutlets = sortKey
    ? [...filteredOutlets].sort((a: any, b: any) => {
        const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
        if (av === bv) return 0;
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      })
    : filteredOutlets;
  return (
    <AppLayout container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Outlets & Tenants</h1>
            <p className="text-muted-foreground">Detailed directory of all commercial units across the portfolio.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">Register Outlet</Button>
        </div>
        <Card className="shadow-soft border-border">
          <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-card/50">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search stores or tenants..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select value={venueFilter} onValueChange={setVenueFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Venues" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    {venuesData?.items.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-900/20">
                  <TableHead className="w-[250px] cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('name')}>Store Name{sortIcon('name')}</TableHead>
                  <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('floor')}>Venue / Floor{sortIcon('floor')}</TableHead>
                  <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('category')}>Category{sortIcon('category')}</TableHead>
                  <TableHead className="cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('tenantName')}>Tenant Owner{sortIcon('tenantName')}</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5} className="h-16 animate-pulse bg-muted/20" /></TableRow>
                  ))
                ) : sortedOutlets.map((outlet) => {
                  const venue = venuesData?.items.find(v => v.id === outlet.venueId);
                  const Icon = categoryIcons[outlet.category] || Store;
                  return (
                    <TableRow key={outlet.id} className="hover:bg-slate-50 dark:hover:bg-accent/10 transition-colors cursor-pointer" onClick={() => setEditingOutlet(outlet)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm">{outlet.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">{outlet.id}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{venue?.name || 'Unknown Venue'}</span>
                          <span className="text-xs text-muted-foreground">Floor: {outlet.floor}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-xs py-0 h-6">
                          {outlet.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{outlet.tenantName}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setEditingOutlet(outlet); }}><Edit className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Edit Outlet Dialog */}
        <Dialog open={!!editingOutlet} onOpenChange={o => !o && setEditingOutlet(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Outlet bewerken</DialogTitle>
              <DialogDescription>Wijzig de gegevens van "{editingOutlet?.name}"</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Naam</Label>
                <Input defaultValue={editingOutlet?.name} onChange={e => setEditingOutlet((o: any) => ({ ...o, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tenant</Label>
                <Input defaultValue={editingOutlet?.tenantName} onChange={e => setEditingOutlet((o: any) => ({ ...o, tenantName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Verdieping</Label>
                <Input defaultValue={editingOutlet?.floor} onChange={e => setEditingOutlet((o: any) => ({ ...o, floor: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditingOutlet(null)}>Annuleren</Button>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={async () => {
                try {
                  await mutations.update.mutateAsync(editingOutlet);
                  setEditingOutlet(null);
                  toast.success('Outlet bijgewerkt');
                } catch { toast.error('Bijwerken mislukt'); }
              }}>Opslaan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}