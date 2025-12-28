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
import { Target, Coins, Star, Trophy, ArrowRight, Plus, ChevronRight, Zap, TrendingUp, Gift, MessageSquare, ExternalLink } from 'lucide-react';
import { useMissions, useVouchers, useMissionMutation } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function MissionsPage() {
  const [activeType, setActiveType] = useState('onboarding');
  const [editingMission, setEditingMission] = useState<any>(null);
  const { data, isLoading } = useMissions(activeType);
  const { data: vouchersData } = useVouchers();
  const missions = data?.items || [];
  const mutation = useMissionMutation();
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = Object.fromEntries(formData.entries());
    try {
      await mutation.mutateAsync({
        ...payload,
        type: activeType,
        status: 'active',
        pointsReward: Number(payload.pointsReward || 0),
      } as any);
      setEditingMission(null);
      toast.success('Mission created successfully');
    } catch (err) {
      toast.error('Failed to create mission');
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
                [1, 2, 3].map(i => <Card key={i} className="h-24 animate-pulse bg-muted/20" />)
              ) : missions.length === 0 ? (
                <Card className="border-dashed flex flex-col items-center justify-center py-20 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No active missions</h3>
                  <p className="text-muted-foreground">Start by creating a new mission for this category.</p>
                </Card>
              ) : (
                missions.map((mission) => (
                  <Card key={mission.id} className="group hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => setEditingMission(mission)}>
                    <CardContent className="p-0">
                      <div className="flex items-center p-6 gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          {mission.type === 'referral' ? <MessageSquare className="h-7 w-7" /> : <Zap className="h-7 w-7" />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{mission.title}</h3>
                            <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-100">
                              {mission.rewardType === 'voucher' ? <Gift className="h-3 w-3 mr-1" /> : <Coins className="h-3 w-3 mr-1" />}
                              {mission.pointsReward > 0 ? `${mission.pointsReward} Points` : 'Voucher Reward'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{mission.instructions || 'No specific instructions provided.'}</p>
                        </div>
                        <div className="flex items-center gap-8 px-4 border-l">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Status</span>
                            <Badge variant={mission.status === 'active' ? 'default' : 'secondary'} className={mission.status === 'active' ? 'bg-emerald-600' : ''}>
                              {mission.status}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="icon" className="group-hover:bg-indigo-50 group-hover:text-indigo-600">
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
                  <Input id="title" name="title" placeholder="e.g., Welcome New Members" defaultValue={editingMission?.title} required />
                </div>
                <div className="space-y-4">
                  <Label>Reward Type</Label>
                  <RadioGroup defaultValue={editingMission?.rewardType || "none"} name="rewardType" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="none" id="r1" className="peer sr-only" />
                      <Label htmlFor="r1" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Target className="mb-3 h-6 w-6" />
                        No Reward
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="points" id="r2" className="peer sr-only" />
                      <Label htmlFor="r2" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Coins className="mb-3 h-6 w-6" />
                        Bonus Points
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="voucher" id="r3" className="peer sr-only" />
                      <Label htmlFor="r3" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Gift className="mb-3 h-6 w-6" />
                        Voucher
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pointsReward">Points Value</Label>
                    <Input id="pointsReward" name="pointsReward" type="number" defaultValue={editingMission?.pointsReward} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rewardValue">Selected Voucher</Label>
                    <Select name="rewardValue" defaultValue={editingMission?.rewardValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Voucher" />
                      </SelectTrigger>
                      <SelectContent>
                        {vouchersData?.items.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">How to Play (Instructions)</Label>
                  <Textarea id="instructions" name="instructions" placeholder="Enter step-by-step instructions..." maxLength={1000} className="min-h-[100px]" defaultValue={editingMission?.instructions} />
                  <p className="text-[10px] text-muted-foreground text-right">Max 1000 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea id="terms" name="terms" placeholder="Legal requirements and limitations..." className="min-h-[80px]" defaultValue={editingMission?.terms} />
                </div>
                {activeType === 'referral' && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="referralMessage">Referral Code Message</Label>
                      <Textarea id="referralMessage" name="referralMessage" placeholder="Invite text for the member to share..." defaultValue={editingMission?.referralMessage} />
                    </div>
                    <Button type="button" variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" /> Preview Message Mockup
                    </Button>
                  </div>
                )}
              </div>
              <SheetFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={() => setEditingMission(null)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : 'Save Mission'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}