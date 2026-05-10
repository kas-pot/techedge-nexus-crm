import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, TrendingUp, Star, ArrowRight, Share2, Database } from 'lucide-react';
export function EventsPage() {
  return (
    <AppLayout container>
      <div className="space-y-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Events</h1>
            <p className="text-muted-foreground">Manage workshops, store openings, and elite member experiences.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Past Events</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Add New Event</Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">RSVP Velocity</CardTitle>
                <CardDescription>Daily response rates across all active events</CardDescription>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Database className="h-8 w-8 opacity-30" />
                <p className="text-sm">Geen data beschikbaar</p>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">—</div>
                <p className="text-xs text-muted-foreground mt-1">Geen data beschikbaar</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average RSVP Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">—</div>
                <p className="text-xs text-muted-foreground mt-1">Geen data beschikbaar</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Upcoming Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-none shadow-soft">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1505373877841-8d25f7d46678' : i === 2 ? '1540575861-517eaaade144' : '1511578314322-379afb476865'}?q=80&w=800&auto=format&fit=crop`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    alt="Event"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <Badge className="bg-white text-indigo-600 border-none hover:bg-white/90">Exclusive</Badge>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-white text-center min-w-[50px] border border-white/30">
                      <div className="text-xs font-bold uppercase">Jun</div>
                      <div className="text-xl font-bold leading-none">{12 + i * 4}</div>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-indigo-600 transition-colors">
                    {i === 1 ? 'Spring Collection Showcase' : i === 2 ? 'VIP Coffee Tasting Workshop' : 'Nexus Grand Store Opening'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                    {i === 1 ? 'Sedayu Mall A - Atrium' : i === 2 ? 'Coffee Lab - Venue 1' : 'Nexus Tower - Ground'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    Join us for an exclusive afternoon exploring the latest trends and networking with fellow elite members.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(u => (
                        <div key={u} className="h-7 w-7 rounded-full border-2 border-background bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(64 + u + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">+42 attending</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                  <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">Manage RSVP</Button>
                  <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}