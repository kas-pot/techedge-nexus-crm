import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Download, UserPlus, Mail, Edit, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMembers, useMemberMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
const memberSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  tier: z.string(),
  status: z.enum(['Active', 'Inactive']),
});
export function MemberListPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const { data, isLoading } = useMembers();
  const { create, update, remove } = useMemberMutations();
  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: '', email: '', tier: 'Bronze', status: 'Active' as const }
  });
  React.useEffect(() => {
    if (editingMember) {
      form.reset({
        name: editingMember.name,
        email: editingMember.email,
        tier: editingMember.tier,
        status: editingMember.status,
      });
    }
  }, [editingMember, form]);
  const filteredMembers = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [data?.items, search]);
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      tier: fd.get('tier') as string,
      points: 0,
      status: 'Active' as const,
      joinedDate: new Date().toLocaleDateString()
    };
    try {
      await create.mutateAsync(payload);
      setIsAdding(false);
      toast.success("Member registered successfully");
    } catch (err) {
      toast.error("Registration failed");
    }
  };
  const handleUpdate = async (values: z.infer<typeof memberSchema>) => {
    if (!editingMember?.id) return;
    try {
      await update.mutateAsync({ id: editingMember.id, ...values });
      setEditingMember(null);
      toast.success("Member profile updated");
    } catch (e) {
      toast.error("Update failed");
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Registry</h1>
            <div className="text-muted-foreground flex items-center gap-2 mt-1">
              Manage and audit the <Badge variant="secondary" className="font-bold">{filteredMembers.length}</Badge> members in your active view.
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAdding(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </div>
        <Card className="border-none shadow-soft overflow-hidden flex flex-col h-[700px]">
          <CardHeader className="pb-4 bg-slate-50/50 border-b">
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by name, ID or email..."
                  className="pl-9 h-11 bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="pl-6 font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">ID</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Profile</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Tier</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Points</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Status</TableHead>
                    <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={6} className="h-16 animate-pulse" /></TableRow>
                    ))
                  ) : filteredMembers.map((member) => (
                    <TableRow key={member.id} className="group hover:bg-indigo-50/30 transition-colors border-b">
                      <TableCell className="pl-6 font-mono text-[11px]">{member.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={member.tier === 'Gold' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}>{member.tier}</Badge>
                      </TableCell>
                      <TableCell className="font-bold">{member.points.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span className="text-sm">{member.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setEditingMember(member)}><Edit className="mr-2 h-4 w-4" /> Edit Profile</DropdownMenuItem>
                            <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Remove Account
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                                  <AlertDialogDescription>This action will permanently remove {member.name} from the CRM database.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive" onClick={() => remove.mutate(member.id)}>Confirm Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredMembers.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                        No members found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <Sheet open={!!editingMember} onOpenChange={(o) => !o && setEditingMember(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Edit Member Profile</SheetTitle>
              <SheetDescription>Update personal details and tier status for {editingMember?.name}.</SheetDescription>
            </SheetHeader>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-bold">Full Name</label>
                <Input {...form.register('name')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Email</label>
                <Input {...form.register('email')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Tier</label>
                  <Select value={form.watch('tier')} onValueChange={(v) => form.setValue('tier', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Status</label>
                  <Select value={form.watch('status')} onValueChange={(v: any) => form.setValue('status', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter className="pt-8">
                <Button variant="outline" type="button" onClick={() => setEditingMember(null)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600" disabled={update.isPending}>
                  {update.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Register Member</DialogTitle>
                <DialogDescription>Manually add a member to the TechEdge Nexus ecosystem.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Full Name</label>
                  <Input name="name" required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Email Address</label>
                  <Input name="email" type="email" required />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button className="bg-indigo-600 px-8" type="submit" disabled={create.isPending}>
                  {create.isPending ? "Registering..." : "Create Member"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}