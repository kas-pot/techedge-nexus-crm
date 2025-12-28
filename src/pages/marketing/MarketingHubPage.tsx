import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { MonitorPlay, Newspaper, Ticket, Video, Plus, Search, Calendar, Eye, Share2 } from 'lucide-react';
import { useAds, useTickets, useNews } from '@/lib/api-hooks';
interface MarketingHubPageProps {
  defaultTab?: string;
}
export function MarketingHubPage({ defaultTab = 'ads' }: MarketingHubPageProps) {
  const { data: adsData, isLoading: loadingAds } = useAds();
  const { data: ticketsData, isLoading: loadingTickets } = useTickets();
  const { data: newsData, isLoading: loadingNews } = useNews();
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing Channels</h1>
            <p className="text-muted-foreground">Manage auxiliary engagement tools: Ads, News, and Event Ticketing.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Asset
          </Button>
        </div>
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="ads" className="px-8">Ads Management</TabsTrigger>
            <TabsTrigger value="tickets" className="px-8">Ticketing</TabsTrigger>
            <TabsTrigger value="news" className="px-8">News & Promo</TabsTrigger>
            <TabsTrigger value="videos" className="px-8">Video Promos</TabsTrigger>
          </TabsList>
          <TabsContent value="ads">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingAds ? (
                [1,2,3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted/20" />)
              ) : (
                adsData?.items.map((ad) => (
                  <Card key={ad.id} className="overflow-hidden group border-border hover:shadow-soft transition-all">
                    <div className="aspect-[16/9] relative overflow-hidden bg-slate-100">
                      <img src={ad.imageUrl} alt={ad.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Badge className="bg-black/60 backdrop-blur-md border-none">{ad.placement}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{ad.name}</CardTitle>
                      <CardDescription className="flex gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase">{ad.targetTier}</Badge>
                        <Badge variant="outline" className="text-[10px] uppercase">{ad.targetCategory}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center pt-0">
                      <Badge className={ad.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'}>{ad.status}</Badge>
                      <Button variant="ghost" size="sm">Edit Campaign</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="tickets">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl">Ticket Ledger</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search code..." className="pl-8 h-9" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Ticket Code</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingTickets ? (
                      <TableRow><TableCell colSpan={6} className="h-24 animate-pulse bg-muted/10" /></TableRow>
                    ) : (
                      ticketsData?.items.map((tk) => (
                        <TableRow key={tk.id}>
                          <TableCell className="font-medium">{tk.eventName}</TableCell>
                          <TableCell>{tk.memberName}</TableCell>
                          <TableCell className="font-mono text-xs">{tk.ticketCode}</TableCell>
                          <TableCell>{new Date(tk.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={tk.status === 'valid' ? 'default' : 'secondary'} className={tk.status === 'valid' ? 'bg-indigo-600' : ''}>
                              {tk.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="news">
            <div className="space-y-4">
              {loadingNews ? (
                [1,2].map(i => <Card key={i} className="h-32 animate-pulse" />)
              ) : (
                newsData?.items.map((news) => (
                  <Card key={news.id} className="hover:bg-slate-50/50 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between p-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-amber-600 border-amber-200">{news.category}</Badge>
                          <span className="text-xs text-muted-foreground">{news.publishDate}</span>
                        </div>
                        <CardTitle className="text-lg">{news.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{news.content}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={news.status === 'published' ? 'bg-emerald-600' : 'bg-slate-400'}>{news.status}</Badge>
                        <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden border-none shadow-soft">
                  <div className="aspect-video relative bg-slate-900 flex items-center justify-center group cursor-pointer">
                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?q=80&w=400&auto=format&fit=crop`} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <MonitorPlay className="h-6 w-6" />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm line-clamp-1">Brand Campaign Spot {i}</p>
                    <p className="text-xs text-muted-foreground">Uploaded 2 days ago • 1.2k views</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}