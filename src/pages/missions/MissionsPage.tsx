import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Target, Coins, Star, Trophy, ArrowRight, Plus, ChevronRight, Zap } from 'lucide-react';
import { useMissions } from '@/lib/api-hooks';
export function MissionsPage() {
  const [activeType, setActiveType] = useState('onboarding');
  const { data, isLoading } = useMissions(activeType);
  const missions = data?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mission Builder</h1>
            <p className="text-muted-foreground">Gamify the member experience with targeted tasks and rewards.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> New Mission
          </Button>
        </div>
        <Tabs defaultValue="onboarding" onValueChange={setActiveType} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted/50">
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tier">Tier Specific</TabsTrigger>
          </TabsList>
          <TabsContent value={activeType} className="mt-0">
            <div className="grid gap-4">
              {isLoading ? (
                [1, 2, 3].map(i => <Card key={i} className="h-24 animate-pulse bg-muted/20" />)
              ) : missions.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No active missions</h3>
                  <p className="text-muted-foreground">Start by creating a new mission for this category.</p>
                </Card>
              ) : (
                missions.map((mission) => (
                  <Card key={mission.id} className="group hover:border-indigo-200 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-center p-6 gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          <Zap className="h-7 w-7" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{mission.title}</h3>
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100">
                              <Coins className="h-3 w-3 mr-1" /> {mission.pointsReward} Points
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Complete this task to earn immediate points and unlock progress.</p>
                        </div>
                        <div className="flex items-center gap-8 px-4 border-l">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Active</span>
                            <Switch checked={mission.status === 'active'} />
                          </div>
                          <Button variant="ghost" size="icon" className="group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <Card className="bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Trophy className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle>Mission Performance</CardTitle>
              <CardDescription className="text-slate-400">Total rewards distributed this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">1,250,000 <span className="text-xl font-normal text-slate-400">XP</span></div>
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <TrendingUp className="h-4 w-4" /> +24% from last month
              </div>
            </CardContent>
          </Card>
          <Card className="bg-indigo-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Star className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription className="text-indigo-200">Average member mission engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">42%</div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-4">
                <div className="bg-white h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}