import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { CheckCircle2, XCircle, Clock, Eye, FileText, User, Calendar, Coins } from 'lucide-react';
import { useApprovals, useApprovalMutation } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function ManualApprovalPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { data, isLoading } = useApprovals(activeTab === 'all' ? undefined : activeTab);
  const tasks = data?.items || [];
  const approveMutation = useApprovalMutation(selectedTask?.id);
  const handleDecision = async (status: 'approved' | 'rejected') => {
    try {
      await approveMutation.mutateAsync({ status });
      toast.success(`Task ${status} successfully`);
      setSelectedTask(null);
    } catch (e) {
      toast.error('Failed to process task');
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-600">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>;
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
            <Card className="shadow-soft">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-900/20">
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Request Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}><TableCell colSpan={6} className="h-16 animate-pulse bg-muted/10" /></TableRow>
                      ))
                    ) : tasks.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No tasks found in this queue.</TableCell></TableRow>
                    ) : tasks.map((task) => (
                      <TableRow key={task.id} className="hover:bg-slate-50/50 dark:hover:bg-accent/5 transition-colors">
                        <TableCell className="text-sm">{task.date}</TableCell>
                        <TableCell className="font-medium">{task.memberName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{task.type.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-indigo-600">{task.amount > 0 ? `${task.amount} XP` : '-'}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-right">
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
        <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Review Request</SheetTitle>
              <SheetDescription>Review evidence and approve or reject this member request.</SheetDescription>
            </SheetHeader>
            {selectedTask && (
              <div className="py-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 flex items-center gap-3 bg-indigo-50/50 border-indigo-100">
                    <User className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-indigo-600">Member</div>
                      <div className="text-sm font-semibold">{selectedTask.memberName}</div>
                    </div>
                  </Card>
                  <Card className="p-4 flex items-center gap-3 bg-amber-50/50 border-amber-100">
                    <Coins className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-600">Value</div>
                      <div className="text-sm font-semibold">{selectedTask.amount} XP</div>
                    </div>
                  </Card>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4" /> Proof of Claim</h4>
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800&auto=format&fit=crop" alt="Receipt Proof" className="object-cover w-full h-full opacity-50 grayscale" />
                    <div className="absolute flex flex-col items-center text-muted-foreground">
                      <Clock className="h-8 w-8 mb-2" />
                      <span className="text-xs">Proof image (Placeholder)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-lg border">
                    {selectedTask.description || "The member submitted this claim for a purchase at Coffee Lab. Standard validation required."}
                  </p>
                </div>
              </div>
            )}
            <SheetFooter className="gap-2">
              <Button variant="outline" className="flex-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleDecision('rejected')}>
                <XCircle className="mr-2 h-4 w-4" /> Reject Claim
              </Button>
              <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleDecision('approved')}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Claim
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}