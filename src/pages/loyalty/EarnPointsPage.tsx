import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { MOCK_CATEGORIES } from '@shared/mock-data';
import { toast } from 'sonner';
interface RuleRow {
  id: string;
  category: string;
  points: number;
  amount: number;
  reserveRate: string;
}
export function EarnPointsPage() {
  const [ruleType, setRuleType] = useState('category');
  const [rows, setRows] = useState<RuleRow[]>([
    { id: '1', category: 'Fashion & Accessories', points: 1, amount: 10, reserveRate: '10%' },
    { id: '2', category: 'F&B Dining', points: 2, amount: 10, reserveRate: '20%' },
  ]);
  const addRow = () => {
    setRows([...rows, { id: Math.random().toString(), category: '', points: 1, amount: 10, reserveRate: '10%' }]);
  };
  const removeRow = (id: string) => {
    setRows(rows.filter(r => r.id !== id));
  };
  const handleSave = () => {
    toast.success("Rules saved successfully!");
  };
  return (
    <AppLayout container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <a href="/"><ArrowLeft className="h-4 w-4" /></a>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Specific Rule</h1>
              <p className="text-muted-foreground">Configure how members earn points based on their spending.</p>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Configuration Basis</CardTitle>
            <CardDescription>Select whether to apply rules based on venue or category.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue={ruleType} onValueChange={setRuleType} className="flex gap-8">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="venue" id="venue" />
                <Label htmlFor="venue" className="font-medium cursor-pointer">By Venue</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="category" id="category" />
                <Label htmlFor="category" className="font-medium cursor-pointer">By Category</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Rule Definitions</CardTitle>
              <CardDescription>Define the point multipliers for each selection.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" /> Add Row
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 px-2 text-xs font-semibold text-muted-foreground uppercase">
                <div className="col-span-4">Category / Venue</div>
                <div className="col-span-2">Get Points</div>
                <div className="col-span-3">Spent Amount ($)</div>
                <div className="col-span-2">Reserve Rate</div>
                <div className="col-span-1"></div>
              </div>
              <Separator />
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-12 gap-4 items-center animate-slide-up">
                  <div className="col-span-4">
                    <Select defaultValue={row.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input type="number" defaultValue={row.points} />
                  </div>
                  <div className="col-span-3">
                    <Input type="number" defaultValue={row.amount} />
                  </div>
                  <div className="col-span-2">
                    <Input defaultValue={row.reserveRate} readOnly className="bg-slate-50" />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)} className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {rows.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  No rules defined. Click "Add Row" to start.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}