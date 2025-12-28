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
    const interval = setInterval(() => {
      setPulse(true);
      if (pulseTimeoutRef.current) clearTimeout(pulseTimeoutRef.current);
      pulseTimeoutRef.current = setTimeout(() => {
        setPulse(false);
      }, 2000);
    }, 15000);
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
            <Button variant="outline" className="h-11 shadow-sm"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 shadow-md transition-all">Live Insights</Button>
          </div>
        </div>
        {/* Weather Intelligence Widget */}
        {weather?.isEnabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "relative overflow-hidden rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r",
              weather ? WeatherColors[weather.activeCondition] : WeatherColors.sunny
            )}
          >
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/30">
                  <WeatherIcon className="h-10 w-10 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold uppercase tracking-widest opacity-80">{weather.locationName}</span>
                    <Badge className="bg-white/20 text-white border-none text-[10px] font-bold">REAL-TIME</Badge>
                  </div>
                  <h2 className="text-3xl font-black">{currentPreset.condition}</h2>
                </div>
              </div>
              <div className="flex-1 max-w-md bg-black/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-tighter opacity-60 mb-2">
                  <Zap className="h-3 w-3" /> Operational Recommendation
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={recIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-lg font-semibold leading-tight"
                  >
                    {currentPreset.tips[recIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border-white/10 text-white h-12" asChild>
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
                "hover:shadow-glow transition-all duration-300 border-none shadow-soft overflow-hidden group relative",
                pulse && "ring-2 ring-indigo-500/20"
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</CardTitle>
                  <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", s.bg)}>
                    <s.icon className={cn("h-4 w-4", s.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tracking-tighter">{s.value}</div>
                  <p className="text-[10px] mt-1 flex items-center gap-1 font-bold">
                    <span className="text-emerald-600">{s.change}</span>
                    <span className="text-muted-foreground uppercase">vs prev cycle</span>
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
          <Card className="lg:col-span-8 shadow-soft border-none overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b">
              <div>
                <CardTitle className="text-lg">Volume & Revenue Dynamics</CardTitle>
                <CardDescription>Full 12-month performance and transaction contrasting</CardDescription>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border shadow-sm">
                {['3M', '6M', '12M'].map(r => (
                  <button
                    key={r}
                    onClick={() => setActiveRange(r)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-black rounded-md transition-all",
                      activeRange === r ? "bg-indigo-600 text-white shadow-md" : "text-muted-foreground hover:bg-slate-100"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 10}} tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  <Bar yAxisId="left" dataKey="transactions" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={32} name="Count" />
                  <Line yAxisId="right" type="monotone" dataKey="revenueIdr" stroke="#F59E0B" strokeWidth={4} dot={{ r: 4 }} name="Revenue (IDR)" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-soft border-none bg-indigo-600 text-white overflow-hidden group">
              <CardHeader className="pb-2">
                <CardTitle className="text-white/80 text-xs font-black uppercase tracking-widest">Command shortcuts</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-2">
                {[
                  { label: 'Issue Voucher', to: '/loyalty/vouchers', icon: Zap },
                  { label: 'Mint Gift Card', to: '/loyalty/gift-cards', icon: CreditCard },
                  { label: 'Push Campaign', to: '/marketing/push', icon: TrendingUp },
                ].map(action => (
                  <Button key={action.label} variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-white/5 text-white h-12" asChild>
                    <Link to={action.to}>
                      <span className="flex items-center gap-2 font-bold"><action.icon className="h-4 w-4" /> {action.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-soft border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Tier Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={MOCK_DASHBOARD_STATS.totalMembers} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                      {MOCK_DASHBOARD_STATS.totalMembers.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="lg:col-span-12 shadow-soft border-none">
            <CardHeader className="border-b bg-slate-50/30">
              <CardTitle className="text-lg">Points Circulation Pulse</CardTitle>
              <CardDescription>Daily earning and burning activity logs</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_DASHBOARD_STATS.pointsLog}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="earned" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="burnt" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}