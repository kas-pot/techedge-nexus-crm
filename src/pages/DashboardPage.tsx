import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { MOCK_DASHBOARD_STATS } from '@shared/mock-data';
import { Users, TrendingUp, Award, Wallet } from 'lucide-react';
const stats = [
  { label: 'Total Members', value: '5,050', change: '+12%', icon: Users, color: 'text-blue-600' },
  { label: 'Points Issued', value: '1.2M', change: '+5%', icon: Wallet, color: 'text-indigo-600' },
  { label: 'Active Campaigns', value: '24', change: '+2', icon: TrendingUp, color: 'text-amber-600' },
  { label: 'Redemptions', value: '842', change: '+18%', icon: Award, color: 'text-emerald-600' },
];
export function DashboardPage() {
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground">Real-time performance metrics of your loyalty ecosystem.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">{s.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Active Members Activity</CardTitle>
              <CardDescription>Monthly growth of active vs new members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_DASHBOARD_STATS.activeMembers}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Active Users" />
                    <Bar dataKey="new" fill="#818CF8" radius={[4, 4, 0, 0]} name="New Signups" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Member Tiers</CardTitle>
              <CardDescription>Distribution of membership levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_DASHBOARD_STATS.totalMembers}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {MOCK_DASHBOARD_STATS.totalMembers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle>Points Circulation Log</CardTitle>
              <CardDescription>Earned vs Burnt points over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_DASHBOARD_STATS.pointsLog}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="earned" stroke="#4F46E5" strokeWidth={2} name="Earned Points" />
                    <Line type="monotone" dataKey="burnt" stroke="#F59E0B" strokeWidth={2} name="Redeemed Points" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}