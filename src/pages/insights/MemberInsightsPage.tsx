import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, Cell } from 'recharts';
import { Users, TrendingDown, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
const growthData = [
  { date: 'Jan', active: 2000, new: 400 },
  { date: 'Feb', active: 2300, new: 500 },
  { date: 'Mar', active: 2200, new: 300 },
  { date: 'Apr', active: 2800, new: 700 },
  { date: 'May', active: 3100, new: 800 },
  { date: 'Jun', active: 3400, new: 900 },
];
const interestData = [
  { subject: 'Dining', A: 120, B: 110, fullMark: 150 },
  { subject: 'Fashion', A: 98, B: 130, fullMark: 150 },
  { subject: 'Tech', A: 86, B: 130, fullMark: 150 },
  { subject: 'Health', A: 99, B: 100, fullMark: 150 },
  { subject: 'Travel', A: 85, B: 90, fullMark: 150 },
  { subject: 'Home', A: 65, B: 85, fullMark: 150 },
];
const categoryRank = [
  { name: 'Fashion', value: 4500, color: '#4F46E5' },
  { name: 'F&B', value: 3800, color: '#818CF8' },
  { name: 'Beauty', value: 3100, color: '#C7D2FE' },
  { name: 'Electronics', value: 2400, color: '#F59E0B' },
  { name: 'Home', value: 1800, color: '#FCD34D' },
];
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
            { label: 'Retention Rate', value: '94.2%', change: '+2.1%', up: true, icon: Users },
            { label: 'Churn Probability', value: '4.8%', change: '-0.5%', up: false, icon: TrendingDown },
            { label: 'Avg LTV', value: 'Rp 4.2M', change: '+12%', up: true, icon: Target },
            { label: 'Engagement Score', value: '78/100', change: '+5', up: true, icon: Zap },
          ].map((stat, i) => (
            <Card key={i} className="shadow-soft">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4">
                  {stat.up ? <ArrowUpRight className="h-3 w-3 text-emerald-600" /> : <ArrowDownRight className="h-3 w-3 text-rose-600" />}
                  <span className={`text-xs font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>{stat.change}</span>
                  <span className="text-xs text-muted-foreground ml-1">vs prev period</span>
                </div>
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
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="new" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-4 shadow-soft">
            <CardHeader>
              <CardTitle>Interest Segmentation</CardTitle>
              <CardDescription>Member affinity by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={interestData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} hide />
                    <Radar name="Male" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.5} />
                    <Radar name="Female" dataKey="B" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.5} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-12 shadow-soft">
            <CardHeader>
              <CardTitle>Top Spending Categories (IDR Volume)</CardTitle>
              <CardDescription>Where members are burning and earning most points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryRank} layout="vertical" margin={{ left: 40, right: 40 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                      {categoryRank.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}