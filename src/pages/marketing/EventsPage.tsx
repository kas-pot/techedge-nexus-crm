import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, TrendingUp, Share2, Database, Ticket } from 'lucide-react';
import { useTickets } from '@/lib/api-hooks';

export function EventsPage() {
  const { data: ticketsData, isLoading } = useTickets();

  // Group tickets by event name to build an "events" view
  const eventMap = (ticketsData?.items ?? []).reduce((acc, tk) => {
    if (!acc[tk.eventName]) acc[tk.eventName] = { name: tk.eventName, tickets: [] as typeof ticketsData.items };
    acc[tk.eventName].tickets.push(tk);
    return acc;
  }, {} as Record<string, { name: string; tickets: NonNullable<typeof ticketsData>['items'] }>);
  const events = Object.values(eventMap);

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
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isLoading ? '—' : events.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{isLoading ? 'Laden...' : 'evenementen gevonden'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isLoading ? '—' : (ticketsData?.items.length ?? 0)}</div>
                <p className="text-xs text-muted-foreground mt-1">{isLoading ? 'Laden...' : 'tickets uitgegeven'}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Upcoming Experiences</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <Card key={i} className="h-72 animate-pulse bg-muted/10" />)}
            </div>
          ) : events.length === 0 ? (
            <Card className="py-16">
              <CardContent className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Ticket className="h-10 w-10 opacity-30" />
                <p className="font-medium">Geen evenementen gevonden</p>
                <p className="text-sm">Voeg tickets toe om evenementen te zien.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const validTickets = event.tickets.filter(t => t.status === 'valid');
                const usedTickets = event.tickets.filter(t => t.status === 'used');
                const issueDate = event.tickets[0]?.issueDate ?? '';
                return (
                  <Card key={event.name} className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-none shadow-soft">
                    <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
                      <Ticket className="h-16 w-16 text-white/30" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <Badge className="bg-white text-indigo-600 border-none hover:bg-white/90">Exclusive</Badge>
                        {issueDate && (
                          <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-white text-center min-w-[50px] border border-white/30">
                            <div className="text-xs font-bold uppercase">{new Date(issueDate).toLocaleString('nl-NL', { month: 'short' })}</div>
                            <div className="text-xl font-bold leading-none">{new Date(issueDate).getDate()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-indigo-600 transition-colors line-clamp-1">{event.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-indigo-500" />
                        {event.tickets.length} tickets · {validTickets.length} geldig · {usedTickets.length} gebruikt
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 flex gap-2">
                      <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">Manage RSVP</Button>
                      <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}