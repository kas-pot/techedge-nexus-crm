import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Map, MapPin, Maximize2, MousePointer2, Layers, Plus, Store, Coffee, ShoppingBag, Utensils } from 'lucide-react';
import { useVenues } from '@/lib/api-hooks';
import { cn } from '@/lib/utils';
const MapLegend = () => (
  <Card className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl p-4 w-48 rounded-2xl">
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Map Legend</h4>
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <div className="h-3 w-3 rounded-full bg-indigo-600" />
        <span className="font-medium">Retail Stores</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="h-3 w-3 rounded-full bg-amber-500" />
        <span className="font-medium">F&B Dining</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="h-3 w-3 rounded-full bg-emerald-500" />
        <span className="font-medium">Concierge</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="h-3 w-3 rounded-full bg-rose-500" />
        <span className="font-medium">Restricted Area</span>
      </div>
    </div>
  </Card>
);
export function MapsPage() {
  const { data: venuesData } = useVenues();
  const venues = venuesData?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Isometric Maps & POIs</h1>
            <p className="text-muted-foreground font-medium">Orchestrate digital floorplans and interactive retail positioning.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 px-6 rounded-xl"><Layers className="mr-2 h-4 w-4" /> Management Layers</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-md rounded-xl"><Plus className="mr-2 h-4 w-4" /> Upload Architecture</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card className="overflow-hidden border shadow-soft h-[650px] relative rounded-3xl group">
              <div className="absolute top-6 left-6 z-10 flex gap-3">
                <Badge className="bg-indigo-600 text-white border-none px-4 py-1.5 shadow-lg font-bold">Floor 1: Main Atrium</Badge>
                <Badge variant="outline" className="bg-white/80 backdrop-blur-md border-slate-200 text-indigo-700 font-bold px-4 py-1.5">Operational: — Active POIs</Badge>
              </div>
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 hover:bg-white rounded-xl"><Maximize2 className="h-5 w-5" /></Button>
                <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-md shadow-xl border border-slate-200 hover:bg-white rounded-xl"><MousePointer2 className="h-5 w-5" /></Button>
              </div>
              <MapLegend />
              <div className="w-full h-full bg-[#f8fafc] relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1544450173-8c879d93558a?q=80&w=2000&auto=format&fit=crop"
                  alt="Isometric Floorplan"
                  className="w-full h-full object-cover opacity-80 mix-blend-multiply transition-all duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50/20 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-20">
                  <Map className="h-24 w-24 mx-auto text-indigo-300 mb-6" />
                  <p className="text-indigo-900 font-black tracking-widest uppercase text-xl">Architectural Canvas</p>
                </div>
                {/* Animated POI Markers */}
                <div className="absolute top-[35%] left-[45%] animate-bounce cursor-pointer z-10">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-primary ring-4 ring-white"><Store className="h-4 w-4" /></div>
                </div>
                <div className="absolute top-[55%] left-[65%] animate-bounce cursor-pointer z-10 delay-150">
                  <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white"><Utensils className="h-4 w-4" /></div>
                </div>
                <div className="absolute top-[25%] left-[25%] animate-bounce cursor-pointer z-10 delay-300">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white"><Coffee className="h-4 w-4" /></div>
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-soft h-full border-none flex flex-col rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 pb-6">
                <CardTitle className="text-lg">Floor POI Directory</CardTitle>
                <CardDescription>Live status of digital interaction points</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-hidden">
                <div className="divide-y max-h-[480px] overflow-y-auto custom-scrollbar">
                  {[
                    { id: '101', name: 'ZARA Premium', type: 'Retail', status: 'Open', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { id: '102', name: 'Starbucks Reserve', type: 'F&B', status: 'Open', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { id: '103', name: 'Kitchenette', type: 'F&B', status: 'Closed', icon: Utensils, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { id: '104', name: 'H&M Global', type: 'Retail', status: 'Open', icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { id: '105', name: 'Nexus VIP Lounge', type: 'Service', status: 'Coming Soon', icon: MapPin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { id: '106', name: 'ATM Hub East', type: 'Service', status: 'Open', icon: MapPin, color: 'text-slate-600', bg: 'bg-slate-100' },
                  ].map((poi, i) => (
                    <div key={poi.id} className="p-5 flex items-center justify-between hover:bg-indigo-50/50 transition-colors cursor-pointer group/item">
                      <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover/item:scale-110", poi.bg, poi.color)}>
                          <poi.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground group-hover/item:text-indigo-600 transition-colors">{poi.name}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Room {poi.id} • {poi.type}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[9px] uppercase font-bold border-none px-2",
                        poi.status === 'Open' ? "bg-emerald-100 text-emerald-700" :
                        poi.status === 'Closed' ? "bg-rose-100 text-rose-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {poi.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 border-t bg-slate-50/50">
                <Button className="w-full h-11 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-100 shadow-sm font-bold rounded-xl">
                  <Plus className="mr-2 h-4 w-4" /> Add Interactive POI
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}