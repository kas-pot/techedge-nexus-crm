import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { CheckCircle2, XCircle, Clock, Eye, FileText, User, Coins } from 'lucide-react';
import { useApprovals, useApprovalMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function ManualApprovalPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { data, isLoading } = useApprovals(activeTab === 'all' ? undefined : activeTab);
  const mutations = useApprovalMutations();
  const tasks = data?.items || [];
  const handleDecision = async (status: 'approved' | 'rejected') => {
    if (!selectedTask) return;
    try {
      await mutations.update.mutateAsync({ id: selectedTask.id, status });
      toast.success(`Request ${status} successfully`);
      setSelectedTask(null);
    } catch (e) {
      toast.error('Failed to process request');
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-600">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline" className="text-amber-600 border-amber-200">Pending</Badge>;
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Approvals</h1>
          <p className="text-muted-foreground">Process member point claims, tier upgrades, and redemptions.</p>
        </div>
        <Tabs defaultValue="pending" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="pending" className="px-8">Pending Queue</TabsTrigger>
            <TabsTrigger value="approved" className="px-8">History</TabsTrigger>
            <TabsTrigger value="rejected" className="px-8">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <Card className="shadow-soft border-none">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="pl-6">Submission Date</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}><TableCell colSpan={6} className="h-16 animate-pulse" /></TableRow>
                      ))
                    ) : tasks.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">Queue is empty.</TableCell></TableRow>
                    ) : tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="pl-6">{task.date}</TableCell>
                        <TableCell className="font-medium">{task.memberName}</TableCell>
                        <TableCell><Badge variant="outline" className="capitalize">{task.type.replace('_', ' ')}</Badge></TableCell>
                        <TableCell className="font-bold text-indigo-600">{task.amount} XP</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                            <Eye className="mr-2 h-4 w-4" /> Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Sheet open={!!selectedTask} onOpenChange={(o) => !o && setSelectedTask(null)}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Request Review</SheetTitle>
              <SheetDescription>Verify proof for {selectedTask?.memberName}.</SheetDescription>
            </SheetHeader>
            {selectedTask && (
              <div className="py-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <User className="h-4 w-4 text-indigo-600 mb-2" />
                    <div className="text-[10px] uppercase font-bold text-indigo-600">Member</div>
                    <div className="text-sm font-bold">{selectedTask.memberName}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <Coins className="h-4 w-4 text-amber-600 mb-2" />
                    <div className="text-[10px] uppercase font-bold text-amber-600">Value</div>
                    <div className="text-sm font-bold">{selectedTask.amount} XP</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4" /> Proof Document</h4>
                  <div className="aspect-video rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-dashed">
                    <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800" alt="Proof" className="opacity-50 grayscale" />
                    <div className="absolute text-muted-foreground flex flex-col items-center">
                      <Clock className="h-8 w-8 mb-2" />
                      <span className="text-xs">Receipt Image</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground p-4 bg-slate-50 rounded-lg border italic">
                  "{selectedTask.description || "Manual validation required for this claim."}"
                </p>
              </div>
            )}
            <SheetFooter className="gap-2">
              <Button 
                variant="outline" 
                className="flex-1 text-destructive" 
                onClick={() => handleDecision('rejected')}
                disabled={mutations.update.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button 
                className="flex-1 bg-indigo-600" 
                onClick={() => handleDecision('approved')}
                disabled={mutations.update.isPending}
              >
                {mutations.update.isPending ? "Processing..." : <><CheckCircle2 className="mr-2 h-4 w-4" /> Approve</>}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}