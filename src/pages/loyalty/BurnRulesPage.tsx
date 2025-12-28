import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Save, Plus, Trash2, Zap, Calculator, Flame } from 'lucide-react';
import { MOCK_CATEGORIES } from '@shared/mock-data';
import { toast } from 'sonner';
export function BurnRulesPage() {
  const [globalRate, setGlobalRate] = useState(100);
  const [rows, setRows] = useState([
    { id: '1', category: 'F&B Dining', rate: 80, active: true },
    { id: '2', category: 'Entertainment', rate: 120, active: true },
  ]);
  const handleSave = () => {
    toast.success("Redemption rules updated!");
  };
  return (
    <AppLayout container>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href="/"><ArrowLeft className="h-4 w-4" /></a>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Burn Rules Engine</h1>
              <p className="text-muted-foreground">Configure point-to-value conversion for rewards and redemptions.</p>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Deploy Rules
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-orange-500" /> Global Rate</CardTitle>
              <CardDescription>Base points required for $1 (or equivalent currency) value.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center py-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
                <div className="text-5xl font-bold text-indigo-600">{globalRate}</div>
                <div className="text-xs uppercase font-bold text-muted-foreground mt-2">Points = $1.00</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <Label>Adjustment</Label>
                  <span>{globalRate} XP</span>
                </div>
                <Slider value={[globalRate]} onValueChange={v => setGlobalRate(v[0])} max={500} min={10} step={10} />
              </div>
              <div className="p-4 rounded-xl bg-amber-50 text-amber-700 text-xs border border-amber-100">
                <Zap className="h-4 w-4 mb-2" />
                Higher rates make points less valuable to the member, while lower rates increase "burn" velocity.
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Special Redemption Multipliers</CardTitle>
                  <CardDescription>Override global rates for specific categories.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setRows([...rows, { id: Math.random().toString(), category: '', rate: 100, active: true }])}>
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
                    <div key={row.id} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 font-medium">{row.category || 'Select Category...'}</div>
                      <div className="col-span-4">
                        <Input type="number" defaultValue={row.rate} className="h-9" />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => setRows(rows.filter(r => r.id !== row.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-slate-900 text-white border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> Burn Simulator</CardTitle>
                <CardDescription className="text-slate-400">Estimate redemption costs for typical member transactions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Transaction Value ($)</Label>
                    <Input className="bg-slate-800 border-slate-700" placeholder="50.00" type="number" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Cost</div>
                    <div className="text-3xl font-bold text-indigo-400">5,000 XP</div>
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