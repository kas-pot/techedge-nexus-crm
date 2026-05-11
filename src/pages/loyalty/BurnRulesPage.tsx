import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Plus, Trash2, Zap, Calculator, Flame, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useSystemSettings, useSettingsMutation } from '@/lib/api-hooks';
export function BurnRulesPage() {
  const [globalRate, setGlobalRate] = useState(100);
  const [rows, setRows] = useState<{ id: string; category: string; rate: number; active: boolean }[]>([]);
  const [simValue, setSimValue] = useState(50);
  const { data: settings } = useSystemSettings();
  const settingsMutation = useSettingsMutation();

  useEffect(() => {
    if (settings) {
      const burnRules = (settings as any).burnRules;
      if (burnRules?.globalRate) setGlobalRate(burnRules.globalRate);
      if (Array.isArray(burnRules?.overrides)) setRows(burnRules.overrides);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await settingsMutation.mutateAsync({ burnRules: { globalRate, overrides: rows } } as any);
      toast.success('Redemption rules updated and deployed!');
    } catch {
      toast.error('Failed to save rules');
    }
  };
  const pointsRequired = Math.round(globalRate * simValue);
  return (
    <AppLayout container>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Burn Rules Engine</h1>
              <p className="text-muted-foreground">Configure point-to-value conversion for rewards and redemptions.</p>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" onClick={handleSave} disabled={settingsMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> {settingsMutation.isPending ? 'Saving...' : 'Deploy Rules'}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-soft border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" /> Global Rate</CardTitle>
              <CardDescription>Base points required for $1 (or equivalent currency) value.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div className="text-6xl font-black text-indigo-600 tracking-tighter">{globalRate}</div>
                <div className="text-xs uppercase font-bold text-muted-foreground mt-2 tracking-widest">Points = $1.00 USD</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <Label className="text-muted-foreground">Threshold Adjustment</Label>
                  <span className="text-indigo-600">{globalRate} XP</span>
                </div>
                <Slider
                  value={[globalRate]}
                  onValueChange={v => setGlobalRate(v[0])}
                  max={500}
                  min={10}
                  step={10}
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase px-1">
                  <span>Generous</span>
                  <span>Restrictive</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 text-xs border border-amber-100 dark:border-amber-900/30 flex gap-3">
                <Info className="h-4 w-4 shrink-0" />
                <p>
                  A rate of <strong>{globalRate} XP</strong> means members need to spend roughly ${Math.ceil(globalRate / 10)} (at 10 XP/$) to earn back $1 in value.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Special Redemption Overrides</CardTitle>
                  <CardDescription>Customize conversion rates for specific categories.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setRows([...rows, { id: Math.random().toString(), category: '', rate: 100, active: true }])}>
                  <Plus className="h-4 w-4 mr-2" /> Add Override
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted-foreground uppercase px-2">
                    <div className="col-span-6">Category</div>
                    <div className="col-span-4">Specific Rate (XP/$1)</div>
                    <div className="col-span-2 text-right">Action</div>
                  </div>
                  <Separator />
                  {rows.map((row) => (
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-center animate-slide-up">
                      <div className="col-span-6 font-semibold text-sm">{row.category || 'New Override Rule'}</div>
                      <div className="col-span-4">
                        <Input type="number" defaultValue={row.rate} className="h-10 bg-slate-50 border-none shadow-inner" />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="icon" className="text-destructive h-9 w-9 hover:bg-destructive/10" onClick={() => setRows(rows.filter(r => r.id !== row.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {rows.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground italic">No category overrides active.</div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-slate-900 text-white border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calculator className="h-24 w-24" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-400"><Calculator className="h-5 w-5" /> Redemption Simulator</CardTitle>
                <CardDescription className="text-slate-400">Calculate liabilities for typical member rewards.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    <Label className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Reward Value ($)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                      <Input className="bg-slate-800 border-slate-700 h-12 pl-8 text-xl font-bold" value={simValue} onChange={(e) => setSimValue(Number(e.target.value))} type="number" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Points Required</div>
                    <div className="text-4xl font-black text-indigo-400">{pointsRequired.toLocaleString()} <span className="text-sm font-medium opacity-50">XP</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}