import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, CartesianGrid, XAxis, YAxis, Bar, Line, ComposedChart, LineChart } from 'recharts';
import { MOCK_DASHBOARD_STATS } from '@shared/mock-data';
import { Users, TrendingUp, Award, DollarSign, Zap, Gift, CreditCard, ChevronRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const stats = [
  { label: 'Total Members', value: '5,050', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Total Revenue (IDR)', value: '3.4B', change: '+15%', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Active Campaigns', value: '24', change: '+2', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Redemptions', value: '842', change: '+18%', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};
export function HomePage() {
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Executive Dashboard</h1>
            <p className="text-muted-foreground text-lg">Nexus CRM System Intelligence & Real-time Analytics</p>
          </motion.div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-11 shadow-sm border-slate-200">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-indigo-100">
              Generate Insights
            </Button>
          </div>
        </div>
        {/* Top KPI Cards */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={item}>
              <Card className="hover:shadow-glow transition-all duration-300 border-none shadow-soft overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{s.label}</CardTitle>
                  <div className={`p-2 rounded-xl ${s.bg} transition-transform group-hover:scale-110`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tighter">{s.value}</div>
                  <p className="text-xs mt-1 flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">{s.change}</span>
                    <span className="text-muted-foreground">vs. last month</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Chart */}
          <Card className="lg:col-span-8 shadow-soft border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 dark:bg-card/50 border-b">
              <div>
                <CardTitle className="text-lg">Volume & Revenue Dynamics</CardTitle>
                <CardDescription>Contrast between transaction frequency and gross revenue (IDR)</CardDescription>
              </div>
              <SelectRange />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MOCK_DASHBOARD_STATS.insights}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar yAxisId="left" dataKey="transactions" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Transactions" barSize={40} />
                    <Line yAxisId="right" type="monotone" dataKey="revenueIdr" stroke="#F59E0B" strokeWidth={4} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} name="Revenue IDR" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          {/* Quick Actions & Tiers */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-soft border-none bg-indigo-600 text-white overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-white/90 text-sm font-bold uppercase tracking-widest">Quick Operations</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/10 text-white h-12" asChild>
                  <Link to="/loyalty/vouchers">
                    <span className="flex items-center gap-2"><Zap className="h-4 w-4" /> Issue Voucher</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/10 text-white h-12" asChild>
                  <Link to="/loyalty/gift-cards">
                    <span className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Mint Gift Card</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/10 text-white h-12" asChild>
                  <Link to="/marketing/push">
                    <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Blast Campaign</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-none">
              <CardHeader>
                <CardTitle className="text-lg">Tier Distribution</CardTitle>
                <CardDescription>Current membership breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_DASHBOARD_STATS.totalMembers}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {MOCK_DASHBOARD_STATS.totalMembers.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {MOCK_DASHBOARD_STATS.totalMembers.map((m) => (
                    <div key={m.name} className="text-center">
                      <div className="text-sm font-bold">{m.value}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">{m.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Secondary Line Chart */}
          <Card className="lg:col-span-12 shadow-soft border-none">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg">Points Circulation Pulse</CardTitle>
                <CardDescription>Earned vs. Redeemed points over the last week</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">Earned: 45k</Badge>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100">Burnt: 28k</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_DASHBOARD_STATS.pointsLog}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                    <Line type="monotone" dataKey="earned" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} name="Earned Points" />
                    <Line type="monotone" dataKey="burnt" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} name="Redeemed Points" />
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
function DownloadIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
function SelectRange() {
  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
      {['7D', '30D', '90D', '1Y'].map((r) => (
        <button key={r} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${r === '30D' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-muted-foreground hover:text-foreground'}`}>
          {r}
        </button>
      ))}
    </div>
  );
}