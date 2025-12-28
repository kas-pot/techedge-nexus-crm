import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis, Bar, Line, ComposedChart, LineChart } from 'recharts';
import { MOCK_DASHBOARD_STATS } from '@shared/mock-data';
import { Users, TrendingUp, Award, DollarSign } from 'lucide-react';
const stats = [
  { label: 'Total Members', value: '10,050', change: '+12%', icon: Users, color: 'text-blue-600' },
  { label: 'Total Revenue (IDR)', value: '6.8B', change: '+15%', icon: DollarSign, color: 'text-indigo-600' },
  { label: 'Active Campaigns', value: '24', change: '+2', icon: TrendingUp, color: 'text-amber-600' },
  { label: 'Redemptions', value: '2,842', change: '+18%', icon: Award, color: 'text-emerald-600' },
];
const formatIDR = (val: number) => {
  if (val >= 1000000000) return `${(val / 1000000000).toFixed(1)}B`;
  if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
  return val.toLocaleString();
};
export function DashboardPage() {
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
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">{s.change}</span> from last month
                </p>
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
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MOCK_DASHBOARD_STATS.insights}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" tick={{fontSize: 11}} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis yAxisId="left" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={formatIDR} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'revenueIdr' ? `Rp ${Number(value).toLocaleString()}` : value, 
                        name === 'revenueIdr' ? 'Revenue (IDR)' : 'Transactions'
                      ]}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Bar yAxisId="left" dataKey="transactions" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Transactions" />
                    <Line yAxisId="right" type="monotone" dataKey="revenueIdr" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', r: 4 }} name="Revenue IDR" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-4 shadow-soft">
            <CardHeader>
              <CardTitle>Points Circulation Log</CardTitle>
              <CardDescription>Earning vs Redemption activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_DASHBOARD_STATS.pointsLog}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" />
                    <YAxis tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="earned" stroke="#4F46E5" strokeWidth={2} name="Earned" dot={{r: 3}} />
                    <Line type="monotone" dataKey="burnt" stroke="#F59E0B" strokeWidth={2} name="Redeemed" dot={{r: 3}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3 shadow-soft">
            <CardHeader>
              <CardTitle>Member Tiers</CardTitle>
              <CardDescription>Membership level distribution</CardDescription>
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
        </div>
      </div>
    </AppLayout>
  );
}