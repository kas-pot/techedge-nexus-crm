import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Building2, Plus, MoreHorizontal, Store } from 'lucide-react';
import { useVenues, useOutlets } from '@/lib/api-hooks';
export function VenuesPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useVenues();
  const { data: outletsData } = useOutlets();
  const venues = data?.items || [];
  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    v.location.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Venues</h1>
            <p className="text-muted-foreground">Manage mall locations and corporate office sites.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
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
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
                <CardContent><Skeleton className="h-4 w-full" /></CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => {
              const venueOutlets = outletsData?.items.filter(o => o.venueId === venue.id) || [];
              return (
                <Card key={venue.id} className="group overflow-hidden hover:shadow-soft transition-all duration-300 border-border bg-card">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-1567449303078-577ad68f4381?q=80&w=800&auto=format&fit=crop`} 
                      alt={venue.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="glass-dark text-white border-white/20">
                        {venue.type}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{venue.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                      {venue.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Store className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-foreground">{venueOutlets.length}</span> Outlets
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-foreground">4</span> Floors
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t bg-slate-50/50 dark:bg-slate-900/10">
                    <Button variant="ghost" className="w-full text-xs font-semibold justify-between group-hover:text-indigo-600">
                      View Management Details
                      <Plus className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}