import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { CheckCircle2, XCircle, Eye, FileText, User, Coins, Cpu, ShieldAlert, Sparkles, Building2, Calendar } from 'lucide-react';
import { useApprovals, useApprovalMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
export function ManualApprovalPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [reviewTab, setReviewTab] = useState('ocr');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const { data, isLoading } = useApprovals(activeTab === 'all' ? undefined : activeTab);
  const mutations = useApprovalMutations();
  const tasks = data?.items || [];

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }
  function sortIcon(key: string) {
    if (sortKey !== key) return ' ⇅';
    return sortDir === 'asc' ? ' ↑' : ' ↓';
  }
  const sortedTasks = sortKey
    ? [...tasks].sort((a: any, b: any) => {
      const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
      if (av === bv) return 0;
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    })
    : tasks;
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
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Approvals</h1>
            <p className="text-muted-foreground font-medium">Process claims and upgrades with AI-driven validation support.</p>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 px-4 py-1.5 h-10 border border-indigo-100 rounded-xl font-bold">
            <Cpu className="mr-2 h-4 w-4" /> OCR Precision: High
          </Badge>
        </div>
        <Tabs defaultValue="pending" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="pending" className="px-10 rounded-lg">Queue</TabsTrigger>
            <TabsTrigger value="approved" className="px-10 rounded-lg">Archive</TabsTrigger>
            <TabsTrigger value="rejected" className="px-10 rounded-lg">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <Card className="shadow-soft border-none rounded-[2rem] overflow-hidden">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="pl-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('date')}>Submit Date{sortIcon('date')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('memberName')}>Member{sortIcon('memberName')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('type')}>Type{sortIcon('type')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort('amount')}>Value{sortIcon('amount')}</TableHead>
                      <TableHead className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">OCR Status</TableHead>
                      <TableHead className="text-right pr-8 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Review</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      [1, 2, 3].map(i => <TableRow key={i}><TableCell colSpan={6} className="h-16 animate-pulse bg-muted/10" /></TableRow>)
                    ) : tasks.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="h-64 text-center text-muted-foreground font-medium">No pending requests in this sector.</TableCell></TableRow>
                    ) : sortedTasks.map((task) => (
                      <TableRow key={task.id} className="group hover:bg-indigo-50/30 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                        <TableCell className="pl-8 font-medium text-xs text-muted-foreground">{task.date}</TableCell>
                        <TableCell className="font-bold text-sm">{task.memberName}</TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize text-[10px] font-black tracking-tighter">{task.type.replace('_', ' ')}</Badge></TableCell>
                        <TableCell className="font-black text-indigo-600">{task.amount} XP</TableCell>
                        <TableCell>
                          {task.ocrResult ? (
                            <Badge className={cn("text-[9px] font-black uppercase px-2", task.ocrResult.confidenceScore > 0.8 ? "bg-emerald-500" : "bg-amber-500")}>
                              {task.ocrResult.confidenceScore > 0.8 ? "Verified" : "Manual Required"}
                            </Badge>
                          ) : <span className="text-[10px] text-muted-foreground italic">N/A</span>}
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button variant="ghost" size="sm" className="rounded-xl h-9 hover:bg-indigo-600 hover:text-white" onClick={() => setSelectedTask(task)}>
                            <Eye className="mr-2 h-4 w-4" /> Audit
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
          <SheetContent className="sm:max-w-2xl overflow-y-auto">
            <SheetHeader className="pb-6 border-b">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI-Assisted Audit</span>
              </div>
              <SheetTitle className="text-3xl font-black tracking-tighter">Review Request</SheetTitle>
              <SheetDescription className="font-medium">Validating {selectedTask?.memberName}'s {selectedTask?.type.replace('_', ' ')} claim.</SheetDescription>
            </SheetHeader>
            <div className="py-8 space-y-8">
              <Tabs value={reviewTab} onValueChange={setReviewTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-slate-100 p-1 rounded-2xl">
                  <TabsTrigger value="ocr" className="rounded-xl font-bold">AI OCR Extraction</TabsTrigger>
                  <TabsTrigger value="proof" className="rounded-xl font-bold">Raw Proof Image</TabsTrigger>
                </TabsList>
                <TabsContent value="ocr" className="mt-6 space-y-6">
                  {selectedTask?.ocrResult ? (
                    <div className="space-y-6">
                      <div className={cn(
                        "p-6 rounded-[2rem] border flex items-center justify-between",
                        selectedTask.ocrResult.confidenceScore > 0.8 ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-100"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", selectedTask.ocrResult.confidenceScore > 0.8 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                            {selectedTask.ocrResult.confidenceScore > 0.8 ? <CheckCircle2 className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold">Confidence Score: {(selectedTask.ocrResult.confidenceScore * 100).toFixed(0)}%</div>
                            <div className="text-xs text-muted-foreground font-medium">{selectedTask.ocrResult.confidenceScore > 0.8 ? "AI high probability match detected." : "Possible data mismatch found."}</div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <OCRField label="Venue Merchant" claimed={selectedTask.description || 'Sedayu Mall'} extracted={selectedTask.ocrResult.mallName} icon={Building2} />
                        <OCRField label="Claimed Amount" claimed={`${selectedTask.amount} XP`} extracted={`${selectedTask.ocrResult.totalAmount} XP`} icon={Coins} />
                        <OCRField label="Transaction Date" claimed={selectedTask.date} extracted={selectedTask.ocrResult.receiptDate} icon={Calendar} />
                        <OCRField label="Receipt Reference" claimed="N/A" extracted={selectedTask.ocrResult.receiptId} icon={FileText} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-center">
                      <ShieldAlert className="h-10 w-10 text-slate-300 mb-2" />
                      <p className="text-sm font-bold text-slate-500">OCR Extraction Unavailable</p>
                      <p className="text-xs text-muted-foreground">This request type requires manual image inspection.</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="proof" className="mt-6">
                  <div className="aspect-video rounded-[2rem] bg-slate-900 overflow-hidden relative border-4 border-slate-100 shadow-xl group">
                    <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800" alt="Receipt Proof" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" className="bg-white/10 backdrop-blur-md border-white/20 text-white font-bold hover:bg-white/20">Expand High-Res Proof</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="p-6 rounded-[2rem] bg-slate-50 border space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><User className="h-3 w-3" /> Member Memo</div>
                <p className="text-sm font-medium italic text-slate-600">"{selectedTask?.description || "Submitting receipt for purchase at Sedayu Mall North Wing."}"</p>
              </div>
            </div>
            <SheetFooter className="gap-3 mt-4 -mx-6 px-6 pt-6 border-t bg-slate-50/50 pb-6">
              <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold text-destructive hover:bg-rose-50 border-none shadow-sm" onClick={() => handleDecision('rejected')} disabled={mutations.update.isPending}>
                <XCircle className="mr-2 h-5 w-5" /> Reject Claim
              </Button>
              <Button className="flex-1 h-14 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100" onClick={() => handleDecision('approved')} disabled={mutations.update.isPending}>
                {mutations.update.isPending ? "Processing..." : <><CheckCircle2 className="mr-2 h-5 w-5" /> Approve Request</>}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </AppLayout>
  );
}
function OCRField({ label, claimed, extracted, icon: Icon }: any) {
  const isMatch = claimed.toLowerCase().includes(extracted.toString().toLowerCase()) || extracted.toString().toLowerCase().includes(claimed.toLowerCase());
  return (
    <div className="p-4 rounded-2xl border bg-white space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold text-muted-foreground">Claimed:</span>
          <span className="text-[11px] font-bold">{claimed}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-dashed">
          <span className="text-[10px] font-bold text-indigo-600">Extracted:</span>
          <span className={cn("text-xs font-black", isMatch ? "text-emerald-600" : "text-amber-600 underline decoration-wavy")}>{extracted}</span>
        </div>
      </div>
    </div>
  );
}