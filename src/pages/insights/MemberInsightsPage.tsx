import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, TrendingDown, Target, Zap, Database } from 'lucide-react';
export function MemberInsightsPage() {
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Behavioral Insights</h1>
          <p className="text-muted-foreground">Deep-dive analysis of participation, retention, and interests.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Retention Rate', value: '—', icon: Users },
            { label: 'Churn Probability', value: '—', icon: TrendingDown },
            { label: 'Avg LTV', value: '—', icon: Target },
            { label: 'Engagement Score', value: '—', icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Geen data beschikbaar</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 shadow-soft">
            <CardHeader>
              <CardTitle>Growth & Acquisition</CardTitle>
              <CardDescription>Contrast between active base and new member signups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Database className="h-8 w-8 opacity-30" />
                <p className="text-sm">Geen data beschikbaar</p>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-4 shadow-soft">
            <CardHeader>
              <CardTitle>Interest Segmentation</CardTitle>
              <CardDescription>Member affinity by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Database className="h-8 w-8 opacity-30" />
                <p className="text-sm">Geen data beschikbaar</p>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-12 shadow-soft">
            <CardHeader>
              <CardTitle>Top Spending Categories (IDR Volume)</CardTitle>
              <CardDescription>Where members are burning and earning most points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Database className="h-8 w-8 opacity-30" />
                <p className="text-sm">Geen data beschikbaar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}