import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Building2, Plus, MoreHorizontal, Store, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useVenues, useOutlets, useVenueMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function VenuesPage() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const { data, isLoading } = useVenues();
  const { data: outletsData } = useOutlets();
  const { create, update, remove } = useVenueMutations();
  const venues = data?.items || [];
  const filteredVenues = venues.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.location.toLowerCase().includes(search.toLowerCase())
  );
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      location: fd.get('location') as string,
      type: fd.get('type') as any,
      isActive: true,
      pointClaimEligible: true
    };
    try {
      if (editingVenue) {
        await update.mutateAsync({ id: editingVenue.id, ...payload });
        toast.success("Venue updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Venue created");
      }
      setIsDialogOpen(false);
      setEditingVenue(null);
    } catch (e) {
      toast.error("Operation failed");
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Venues</h1>
            <p className="text-muted-foreground">Manage mall locations and corporate office sites.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Venue
          </Button>
        </div>
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by name or location..."
            className="pl-9 bg-secondary border-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="overflow-hidden"><Skeleton className="aspect-video w-full" /></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => {
              const venueOutlets = outletsData?.items.filter(o => o.venueId === venue.id) || [];
              return (
                <Card key={venue.id} className="group overflow-hidden hover:shadow-soft transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/photo-1567449303078-577ad68f4381?q=80&w=800&auto=format&fit=crop`}
                      alt={venue.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="glass-dark text-white border-white/20">{venue.type}</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{venue.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingVenue(venue); setIsDialogOpen(true); }}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => remove.mutate(venue.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" /> {venue.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Store className="h-4 w-4 text-amber-500" /> <span className="font-medium text-foreground">{venueOutlets.length}</span> Outlets</div>
                      <div className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-blue-500" /> <span className="font-medium text-foreground">4</span> Floors</div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t bg-slate-50/50">
                    <Button variant="ghost" className="w-full text-xs font-semibold justify-between group-hover:text-indigo-600">
                      View Management Details <Plus className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        <Dialog open={isDialogOpen} onOpenChange={(o) => { setIsDialogOpen(o); if(!o) setEditingVenue(null); }}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingVenue ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
                <DialogDescription>Define a physical location for your commercial portfolio.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Venue Name</label>
                  <Input name="name" defaultValue={editingVenue?.name} required placeholder="Nexus Central Mall" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Location</label>
                  <Input name="location" defaultValue={editingVenue?.location} required placeholder="Jakarta CBD, Area 4" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Venue Type</label>
                  <Select name="type" defaultValue={editingVenue?.type || "Mall"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mall">Mall</SelectItem>
                      <SelectItem value="Office">Office Tower</SelectItem>
                      <SelectItem value="Residential">Residential Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600" disabled={create.isPending || update.isPending}>
                  {editingVenue ? 'Save Changes' : 'Create Venue'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}