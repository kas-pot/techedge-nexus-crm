import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, TrendingUp, Award, CreditCard, Database } from 'lucide-react';
import { useStats } from '@/lib/api-hooks';

export function DashboardPage() {
  const { data: statsData } = useStats();

  const stats = [
    { label: 'Total Members', value: statsData ? statsData.totalMembers.toLocaleString() : '—', icon: Users, color: 'text-blue-600' },
    { label: 'Total Campaigns', value: statsData ? statsData.totalCampaigns.toLocaleString() : '—', icon: TrendingUp, color: 'text-amber-600' },
    { label: 'Approval Tasks', value: statsData ? statsData.totalApprovals.toLocaleString() : '—', icon: Award, color: 'text-emerald-600' },
    { label: 'Gift Cards Issued', value: statsData ? statsData.totalGiftCards.toLocaleString() : '—', icon: CreditCard, color: 'text-indigo-600' },
  ];

  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground">Real-time performance metrics of your loyalty ecosystem.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="hover:shadow-soft transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">Geen data beschikbaar</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-7 shadow-soft">
            <CardHeader>
              <CardTitle>Member Transactions vs Total Volume (IDR)</CardTitle>
              <CardDescription>12-month historical performance cycle</CardDescription>
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
              <CardTitle>Points Circulation Log</CardTitle>
              <CardDescription>Earning vs Redemption activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Database className="h-8 w-8 opacity-30" />
                <p className="text-sm">Geen data beschikbaar</p>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 shadow-soft">
            <CardHeader>
              <CardTitle>Member Tiers</CardTitle>
              <CardDescription>Membership level distribution</CardDescription>
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