import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Megaphone, Mail, Bell, MessageSquare, Send, BarChart3, Clock, CheckCircle2 } from 'lucide-react';
import { useCampaigns } from '@/lib/api-hooks';
const channelIcons: Record<string, any> = {
  push: Bell,
  email: Mail,
  sms: MessageSquare,
};
const channelColors: Record<string, string> = {
  push: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  email: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  sms: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};
export function CampaignsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { data, isLoading } = useCampaigns(activeTab === 'all' ? undefined : activeTab);
  const campaigns = data?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketing Command Center</h1>
            <p className="text-muted-foreground">Orchestrate and monitor multi-channel engagement campaigns.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-indigo-200">
            <Megaphone className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="all" className="px-8">All Channels</TabsTrigger>
            <TabsTrigger value="push" className="px-8">Push</TabsTrigger>
            <TabsTrigger value="email" className="px-8">Email</TabsTrigger>
            <TabsTrigger value="sms" className="px-8">SMS</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted/20" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                  const Icon = channelIcons[campaign.channel] || Megaphone;
                  const statusColors = {
                    scheduled: "bg-amber-100 text-amber-700 border-amber-200",
                    running: "bg-emerald-100 text-emerald-700 border-emerald-200 animate-pulse",
                    completed: "bg-slate-100 text-slate-700 border-slate-200",
                  };
                  return (
                    <Card key={campaign.id} className="group hover:shadow-soft transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className={`p-2 rounded-lg ${channelColors[campaign.channel]}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className={`${statusColors[campaign.status]} capitalize`}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl line-clamp-1">{campaign.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Delivery Reach</span>
                            <span className="text-foreground">84%</span>
                          </div>
                          <Progress value={84} className="h-1.5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Open Rate</span>
                            <div className="text-lg font-bold">12.4%</div>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">CTR</span>
                            <div className="text-lg font-bold text-indigo-600">3.8%</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-slate-50/50 dark:bg-slate-900/10 py-3">
                        <Button variant="ghost" className="w-full text-xs font-semibold justify-between group-hover:text-indigo-600">
                          Performance Report
                          <BarChart3 className="h-3.5 w-3.5" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}