import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, CartesianGrid, XAxis, YAxis, Bar, Line, ComposedChart, LineChart } from 'recharts';
import { MOCK_DASHBOARD_STATS, WEATHER_PRESETS } from '@shared/mock-data';
import { Users, TrendingUp, Award, DollarSign, Zap, CreditCard, ChevronRight, Download, Sun, CloudRain, Cloud, Droplets, ArrowRight, History, Ticket, Send, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWeatherSettings, useEntities } from '@/lib/api-hooks';
import { formatDistanceToNow } from 'date-fns';
const stats = [
  { label: 'Total Members', value: '10,050', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Total Revenue (IDR)', value: '6.8B', change: '+15%', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Active Campaigns', value: '24', change: '+2', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Redemptions', value: '2,842', change: '+18%', icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];
const WeatherIcons = { sunny: Sun, rainy: CloudRain, cloudy: Cloud, humid: Droplets };
const WeatherColors = { sunny: "from-amber-400 to-orange-600", rainy: "from-indigo-500 to-blue-700", cloudy: "from-slate-400 to-slate-600", humid: "from-emerald-400 to-teal-600" };
export function HomePage() {
  const [activeRange, setActiveRange] = useState('12M');
  const [pulse, setPulse] = useState(false);
  const [recIndex, setRecIndex] = useState(0);
  const { data: weather } = useWeatherSettings();
  const { data: logsData } = useEntities<any>('activity-logs', '/api/activity-logs', {}, 8);
  const currentPreset = weather ? WEATHER_PRESETS[weather.activeCondition] : WEATHER_PRESETS.sunny;
  const WeatherIcon = weather ? WeatherIcons[weather.activeCondition] : Sun;
  useEffect(() => {
    const recInterval = setInterval(() => setRecIndex(prev => (prev + 1) % currentPreset.tips.length), 5000);
    const pulseInterval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
    }, 12000);
    return () => { clearInterval(recInterval); clearInterval(pulseInterval); };
  }, [currentPreset.tips.length]);
  const chartData = useMemo(() => {
    if (activeRange === '3M') return MOCK_DASHBOARD_STATS.insights.slice(-3);
    if (activeRange === '6M') return MOCK_DASHBOARD_STATS.insights.slice(-6);
    return MOCK_DASHBOARD_STATS.insights;
  }, [activeRange]);
  return (
    <AppLayout container>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Executive Command</h1>
            <p className="text-indigo-600 text-lg font-semibold tracking-tight">Ecosystem Intelligence Hub</p>
          </motion.div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-11 shadow-sm rounded-xl"><Download className="mr-2 h-4 w-4" /> Export Audit</Button>
            <div className="flex items-center gap-2 px-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold h-11 border border-indigo-100">
              <div className={cn("h-2 w-2 rounded-full bg-indigo-600", pulse && "animate-ping")} />
              Live Sync
            </div>
          </div>
        </div>
        {weather?.isEnabled && (
          <div className={cn("relative overflow-hidden rounded-[2.5rem] p-10 text-white shadow-2xl bg-gradient-to-r", weather ? WeatherColors[weather.activeCondition] : WeatherColors.sunny)}>
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <div className="bg-white/20 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white/30">
                  <WeatherIcon className="h-14 w-14 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-[0.2em] opacity-70">{weather.locationName}</span>
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter">{currentPreset.condition}</h2>
                </div>
              </div>
              <div className="flex-1 max-w-xl bg-black/10 backdrop-blur-md rounded-[2rem] p-8 border border-white/10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-4">
                  <Zap className="h-3 w-3" /> System Recommendation
                </div>
                <p className="text-2xl font-bold leading-tight">{currentPreset.tips[recIndex]}</p>
              </div>
            </div>
            <div className="absolute top-[-50px] right-[-50px] h-96 w-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} className="hover:shadow-glow transition-all duration-500 border-none shadow-soft overflow-hidden group relative rounded-[2rem]">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</CardTitle>
                <div className={cn("p-3 rounded-2xl", s.bg)}><s.icon className={cn("h-5 w-5", s.color)} /></div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black tracking-tighter">{s.value}</div>
                <div className="text-[10px] mt-3 flex items-center gap-2 font-bold text-emerald-600">
                  <TrendingUp className="h-3 w-3" /> {s.change} <span className="text-muted-foreground">cycle variance</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-12">
          <Card className="lg:col-span-8 shadow-soft border-none rounded-[2.5rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 p-8 border-b">
              <div>
                <CardTitle className="text-xl font-bold">Transaction Velocity</CardTitle>
                <CardDescription className="font-medium text-xs">Real-time revenue monitoring</CardDescription>
              </div>
              <div className="flex gap-1 bg-white p-1 rounded-xl border">
                {['6M', '12M'].map(r => (
                  <button key={r} onClick={() => setActiveRange(r)} className={cn("px-4 py-2 text-[10px] font-black rounded-lg transition-all", activeRange === r ? "bg-indigo-600 text-white" : "text-muted-foreground")}>{r}</button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pt-10 h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} tickFormatter={(v) => `${(v/1000000).toFixed(0)}M`} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} />
                  <Bar yAxisId="left" dataKey="transactions" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={35} name="Volume" />
                  <Line yAxisId="right" type="monotone" dataKey="revenueIdr" stroke="#F59E0B" strokeWidth={5} dot={{r: 6, fill: '#F59E0B', strokeWidth: 3, stroke: '#fff'}} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="lg:col-span-4 space-y-8">
            <Card className="shadow-soft border-none rounded-[2.5rem] h-full overflow-hidden flex flex-col">
              <CardHeader className="bg-slate-50/50 p-8 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2"><History className="h-5 w-5 text-indigo-600" /> Activity Log</CardTitle>
                  <CardDescription className="text-xs font-medium">Real-time system events</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar max-h-[500px]">
                <div className="divide-y divide-slate-100">
                  {(logsData?.items ?? []).map((log: any) => (
                    <div key={log.id} className="p-6 flex items-start gap-4 hover:bg-slate-50/50 transition-colors group">
                      <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                        log.action === 'Created' ? 'bg-indigo-50 text-indigo-600' :
                        log.action === 'Redeemed' ? 'bg-amber-50 text-amber-600' :
                        log.action === 'Sent' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                      )}>
                        {log.entityType === 'voucher' ? <Ticket className="h-5 w-5" /> :
                         log.entityType === 'campaign' ? <Send className="h-5 w-5" /> :
                         log.entityType === 'approval' ? <ShieldCheck className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{log.action} {log.entityType}</p>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                          <span className="text-indigo-600">{log.userName}</span>
                          <span className="opacity-30">•</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-6 border-t bg-slate-50/30">
                <Button variant="ghost" className="w-full font-bold text-xs" asChild><Link to="/system">Audit Trail Configuration <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}