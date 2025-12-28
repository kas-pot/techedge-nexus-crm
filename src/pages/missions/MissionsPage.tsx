import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Target, Coins, Star, Trophy, Plus, ChevronRight, Zap, Gift, MessageSquare, ExternalLink } from 'lucide-react';
import { useMissions, useVouchers, useMissionMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function MissionsPage() {
  const [activeType, setActiveType] = useState('onboarding');
  const [editingMission, setEditingMission] = useState<any>(null);
  const { data, isLoading } = useMissions(activeType);
  const { data: vouchersData } = useVouchers();
  const mutations = useMissionMutations();
  const missions = data?.items || [];
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    const data = {
      ...payload,
      type: activeType,
      pointsReward: Number(payload.pointsReward || 0),
      status: editingMission?.status || 'active',
    };
    try {
      if (editingMission?.id) {
        await mutations.update.mutateAsync({ id: editingMission.id, ...data } as any);
        toast.success('Mission updated');
      } else {
        await mutations.create.mutateAsync(data as any);
        toast.success('Mission created');
      }
      setEditingMission(null);
    } catch (err) {
      toast.error('Operation failed');
    }
  };
  const toggleStatus = async (mission: any) => {
    try {
      const nextStatus = mission.status === 'active' ? 'inactive' : 'active';
      await mutations.update.mutateAsync({ id: mission.id, status: nextStatus });
      toast.success(`Mission marked ${nextStatus}`);
    } catch (e) {
      toast.error('Failed to toggle status');
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mission Builder</h1>
            <p className="text-muted-foreground">Gamify the member experience with targeted tasks and rewards.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setEditingMission({})}>
            <Plus className="mr-2 h-4 w-4" /> New Mission
          </Button>
        </div>
        <Tabs defaultValue="onboarding" onValueChange={setActiveType} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg bg-muted/50">
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tier">Tier Specific</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
          </TabsList>
          <TabsContent value={activeType} className="mt-0">
            <div className="grid gap-4">
              {isLoading ? (
                [1, 2].map(i => <Card key={i} className="h-24 animate-pulse" />)
              ) : missions.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center py-20 text-center">
                  <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="font-semibold text-lg">No active missions</h3>
                  <p className="text-muted-foreground">Start by creating a new mission for this category.</p>
                </Card>
              ) : (
                missions.map((mission) => (
                  <Card key={mission.id} className="group hover:border-indigo-200 transition-colors">
                    <CardContent className="p-0">
                      <div className="flex items-center p-6 gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          {mission.type === 'referral' ? <MessageSquare className="h-7 w-7" /> : <Zap className="h-7 w-7" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{mission.title}</h3>
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                              {mission.pointsReward > 0 ? `${mission.pointsReward} XP` : 'Reward Item'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{mission.instructions}</p>
                        </div>
                        <div className="flex items-center gap-6 px-4 border-l">
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Status</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={mission.status === 'active' ? 'default' : 'secondary'}>{mission.status}</Badge>
                              <Switch 
                                checked={mission.status === 'active'} 
                                onCheckedChange={() => toggleStatus(mission)}
                                disabled={mutations.update.isPending}
                              />
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setEditingMission(mission)}>
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        <Sheet open={!!editingMission} onOpenChange={(open) => !open && setEditingMission(null)}>
          <SheetContent className="sm:max-w-xl overflow-y-auto">
            <form onSubmit={handleSave}>
              <SheetHeader>
                <SheetTitle>{editingMission?.id ? 'Edit Mission' : 'Create New Mission'}</SheetTitle>
                <SheetDescription>Configure the rules, rewards, and messaging for this campaign.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Mission Title</Label>
                  <Input id="title" name="title" defaultValue={editingMission?.title} required />
                </div>
                <div className="space-y-4">
                  <Label>Reward Basis</Label>
                  <RadioGroup defaultValue={editingMission?.rewardType || "none"} name="rewardType" className="grid grid-cols-3 gap-4">
                    {['none', 'points', 'voucher'].map((t) => (
                      <div key={t}>
                        <RadioGroupItem value={t} id={`rt-${t}`} className="peer sr-only" />
                        <Label htmlFor={`rt-${t}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <span className="capitalize text-xs font-bold">{t}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Points Value</Label>
                    <Input name="pointsReward" type="number" defaultValue={editingMission?.pointsReward} />
                  </div>
                  <div className="space-y-2">
                    <Label>Selected Voucher</Label>
                    <Select name="rewardValue" defaultValue={editingMission?.rewardValue}>
                      <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                      <SelectContent>
                        {vouchersData?.items.map(v => <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>How to Play (Instructions)</Label>
                  <Textarea name="instructions" defaultValue={editingMission?.instructions} className="min-h-[100px]" />
                </div>
              </div>
              <SheetFooter>
                <Button type="button" variant="ghost" onClick={() => setEditingMission(null)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600" disabled={mutations.create.isPending || mutations.update.isPending}>
                  {editingMission?.id ? 'Save Changes' : 'Create Mission'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}