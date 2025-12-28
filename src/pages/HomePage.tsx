import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Bar, Line, ComposedChart, LineChart } from 'recharts';
import { MOCK_DASHBOARD_STATS, WEATHER_PRESETS } from '@shared/mock-data';
import { Users, TrendingUp, Award, DollarSign, Zap, CreditCard, ChevronRight, Download, Sun, CloudRain, Cloud, Droplets, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWeatherSettings } from '@/lib/api-hooks';
const stats = [
  { label: 'Total Members', value: '10,050', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Total Revenue (IDR)', value: '6.8B', change: '+15%', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Active Campaigns', value: '24', change: '+2', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Redemptions', value: '2,842', change: '+18%', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];
const WeatherIcons = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
  humid: Droplets,
};
const WeatherColors = {
  sunny: "from-amber-400 to-orange-600",
  rainy: "from-indigo-500 to-blue-700",
  cloudy: "from-slate-400 to-slate-600",
  humid: "from-emerald-400 to-teal-600",
};
export function HomePage() {
  const [activeRange, setActiveRange] = useState('12M');
  const [pulse, setPulse] = useState(false);
  const [recIndex, setRecIndex] = useState(0);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: weather } = useWeatherSettings();
  const currentPreset = weather ? WEATHER_PRESETS[weather.activeCondition] : WEATHER_PRESETS.sunny;
  const WeatherIcon = weather ? WeatherIcons[weather.activeCondition] : Sun;
  useEffect(() => {
    // Stat pulse animation effect for data refresh visualization
    const interval = setInterval(() => {
      setPulse(true);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = setTimeout(() => {
        setPulse(false);
      }, 2000);
    }, 15000);
    // Weather recommendation rotation
    const recInterval = setInterval(() => {
      setRecIndex(prev => (prev + 1) % currentPreset.tips.length);
    }, 5000);
    return () => {
      clearInterval(interval);
      clearInterval(recInterval);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
    };
  }, [currentPreset.tips.length]);
  const chartData = useMemo(() => {
    if (activeRange === '3M') return MOCK_DASHBOARD_STATS.insights.slice(-3);
    if (activeRange === '6M') return MOCK_DASHBOARD_STATS.insights.slice(-6);
    return MOCK_DASHBOARD_STATS.insights;
  }, [activeRange]);
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Executive Dashboard</h1>
            <p className="text-indigo-600 text-lg font-semibold tracking-tight">Nexus Intelligence Hub • PIK Enterprise Operations</p>
          </motion.div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-11 shadow-sm rounded-xl"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-md transition-all rounded-xl font-bold">Live Insights</Button>
          </div>
        </div>
        {/* Weather Intelligence Widget */}
        {weather?.isEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl bg-gradient-to-r",
              weather ? WeatherColors[weather.activeCondition] : WeatherColors.sunny
            )}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="bg-white/20 backdrop-blur-md rounded-3xl p-5 shadow-lg border border-white/30">
                  <WeatherIcon className="h-12 w-12 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-black uppercase tracking-[0.2em] opacity-80">{weather.locationName}</span>
                    <Badge className="bg-white/20 text-white border-none text-[10px] font-black px-3 h-5">REAL-TIME</Badge>
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter">{currentPreset.condition}</h2>
                </div>
              </div>
              <div className="flex-1 max-w-lg bg-black/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">
                  <Zap className="h-3 w-3" /> Operational Intelligence
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={recIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl font-bold leading-tight"
                  >
                    {currentPreset.tips[recIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border-white/10 text-white h-14 rounded-2xl font-bold px-6" asChild>
                <Link to="/system/weather">
                  Adjust Rules <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="absolute top-[-20px] right-[-20px] h-64 w-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={cn(
                "hover:shadow-glow transition-all duration-500 border-none shadow-soft overflow-hidden group relative rounded-[1.5rem]",
                pulse && "ring-4 ring-indigo-500/10"
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">{s.label}</CardTitle>
                  <div className={cn("p-2.5 rounded-2xl transition-transform group-hover:scale-110", s.bg)}>
                    <s.icon className={cn("h-4 w-4", s.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black tracking-tighter">{s.value}</div>
                  <p className="text-[10px] mt-2 flex items-center gap-1 font-bold">
                    <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{s.change}</span>
                    <span className="text-muted-foreground uppercase tracking-tighter ml-1">growth vs cycle</span>
                  </p>
                </CardContent>
                <AnimatePresence>
                  {pulse && (
                    <motion.div
                      className="absolute inset-0 bg-indigo-500/5 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-8 shadow-soft border-none overflow-hidden rounded-[2rem]">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b p-6">
              <div>
                <CardTitle className="text-lg font-bold">Volume & Revenue Dynamics</CardTitle>
                <CardDescription className="font-medium text-xs">Full 12-month transaction contrasting</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border shadow-sm">
                {['3M', '6M', '12M'].map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-black rounded-lg transition-all",
                      activeRange === r ? "bg-indigo-600 text-white shadow-md" : "text-muted-foreground hover:bg-slate-100"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-8 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Bar yAxisId="left" dataKey="transactions" fill="#4F46E5" radius={[8, 8, 0, 0]} barSize={28} name="Transaction Count" />
                  <Line yAxisId="right" type="monotone" dataKey="revenueIdr" stroke="#F59E0B" strokeWidth={4} dot={{ r: 5, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} name="Revenue (IDR)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-soft border-none bg-indigo-600 text-white overflow-hidden group rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">Command shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-4">
                {[
                  { label: 'Issue Voucher', to: '/loyalty/vouchers', icon: Zap },
                  { label: 'Mint Gift Card', to: '/loyalty/gift-cards', icon: CreditCard },
                  { label: 'Push Campaign', to: '/marketing/push', icon: TrendingUp },
                ].map(action => (
                  <Button key={action.label} variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/5 text-white h-14 rounded-2xl font-bold" asChild>
                    <Link to={action.to}>
                      <span className="flex items-center gap-3"><action.icon className="h-5 w-5 opacity-80" /> {action.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-soft border-none rounded-[2rem]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MOCK_DASHBOARD_STATS.totalMembers} cx="50%" cy="50%" innerRadius={65} outerRadius={85} dataKey="value" paddingAngle={8}>
                      {MOCK_DASHBOARD_STATS.totalMembers.map((entry, index) => <Cell key={index} fill={entry.fill} stroke="none" />)}
                    </Pie>
                    <Tooltip cursor={{ fill: 'transparent' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="lg:col-span-12 shadow-soft border-none rounded-[2rem]">
            <CardHeader className="border-b bg-slate-50/30 p-6">
              <CardTitle className="text-lg font-bold">Points Circulation Pulse</CardTitle>
              <CardDescription className="text-xs font-medium">Daily activity logging of earn vs burn cycles</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_DASHBOARD_STATS.pointsLog}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.08} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Line type="monotone" dataKey="earned" stroke="#4F46E5" strokeWidth={4} dot={{ r: 4, fill: '#4F46E5' }} />
                  <Line type="monotone" dataKey="burnt" stroke="#F59E0B" strokeWidth={4} dot={{ r: 4, fill: '#F59E0B' }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}