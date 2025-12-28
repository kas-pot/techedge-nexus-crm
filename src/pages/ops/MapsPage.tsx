import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Maximize2, MousePointer2, Layers, Plus, Store } from 'lucide-react';
import { useVenues } from '@/lib/api-hooks';
export function MapsPage() {
  const { data: venuesData } = useVenues();
  const venues = venuesData?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Isometric Maps</h1>
            <p className="text-muted-foreground">Manage digital floorplans and interactive point-of-interests.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Layers className="mr-2 h-4 w-4" /> Upload New Map
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card className="overflow-hidden border-2 shadow-soft h-[600px] relative">
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <Badge className="bg-white/80 backdrop-blur-md text-indigo-700 border-indigo-100">Floor 1 - Ground</Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-md">Active: 42 POIs</Badge>
              </div>
              <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
                <Button size="icon" variant="secondary" className="bg-white shadow-lg"><Maximize2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="secondary" className="bg-white shadow-lg"><MousePointer2 className="h-4 w-4" /></Button>
              </div>
              <div className="w-full h-full bg-slate-100 relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1544450173-8c879d93558a?q=80&w=2000&auto=format&fit=crop" 
                  alt="Isometric Floorplan" 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000" 
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <Map className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-medium">Map Canvas Viewport</p>
                </div>
                {/* Simulated POIs */}
                <div className="absolute top-[30%] left-[40%] animate-pulse cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-glow"><MapPin className="h-3.5 w-3.5" /></div>
                </div>
                <div className="absolute top-[50%] left-[60%] animate-pulse cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg"><Store className="h-3.5 w-3.5" /></div>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-soft h-full">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-sm">POI Marker List</CardTitle>
                <CardDescription>Interactive points on current floor</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-[450px] overflow-y-auto">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <Store className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">Store {100 + i}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Point of Sale</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-indigo-600 text-xs">Edit</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 border-t">
                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Marker
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}