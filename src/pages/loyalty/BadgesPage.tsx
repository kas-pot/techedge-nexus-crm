import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge as UI_Badge } from '@/components/ui/badge';
import { Plus, Settings, Users, Star, Award, TrendingUp, Search } from 'lucide-react';
import { useBadges } from '@/lib/api-hooks';
import { Input } from '@/components/ui/input';
export function BadgesPage() {
  const { data, isLoading } = useBadges();
  const badges = data?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-10 animate-fade-in py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Badges & Achievements</h1>
            <p className="text-muted-foreground">Define visual markers of elite participation and loyalty.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create Badge
          </Button>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search badges by name or requirement..." className="pl-9" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-64 animate-pulse bg-muted/10" />)
          ) : badges.map((badge) => (
            <Card key={badge.id} className="group hover:shadow-soft transition-all duration-300 border-slate-200">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white dark:border-slate-800 transition-transform group-hover:scale-110" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>
                  <Award className="h-10 w-10" />
                </div>
                <CardTitle className="text-xl font-bold">{badge.name}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">{badge.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-y border-slate-50 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Requirement</span>
                    <span className="text-sm font-semibold">{badge.requirementPoints > 0 ? `${badge.requirementPoints} XP` : 'Legacy'}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Earned By</span>
                    <span className="text-sm font-semibold flex items-center gap-1 justify-end">
                      <Users className="h-3 w-3 text-indigo-600" /> {badge.earnedCount} members
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Rarity Rank</span>
                    <span className="text-indigo-600">Top 12%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t bg-slate-50/50 dark:bg-slate-900/10 py-3">
                <Button variant="ghost" className="w-full text-xs font-semibold justify-between group-hover:text-indigo-600">
                  Badge Configuration
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}