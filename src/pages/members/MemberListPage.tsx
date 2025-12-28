import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MoreVertical, Download, UserPlus, Mail, ShieldAlert, ChevronRight, Edit, Trash2, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useMembers, useMemberMutations } from '@/lib/api-hooks';
import { toast } from 'sonner';
export function MemberListPage() {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { data, isLoading } = useMembers();
  const { create, update, remove } = useMemberMutations();
  const members = data?.items || [];
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );
  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      tier: fd.get('tier') as string,
      points: 0,
      status: 'Active' as const,
      joinedDate: new Date().toLocaleDateString()
    };
    try {
      await create.mutateAsync(data);
      setIsAdding(false);
      toast.success("Member registered successfully");
    } catch (err) {
      toast.error("Registration failed");
    }
  };
  const handleInlineTierChange = async (id: string, newTier: string) => {
    try {
      await update.mutateAsync({ id, tier: newTier });
      toast.success("Tier updated");
    } catch (e) {
      toast.error("Failed to update tier");
    }
  };
  return (
    <AppLayout container>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Member Registry</h1>
            <p className="text-muted-foreground">Manage and audit the 5,050 members in your ecosystem.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" onClick={() => setIsAdding(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </div>
        <Card className="border-none shadow-soft overflow-hidden">
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
              <Button variant="outline" size="icon" className="h-11 w-11"><Filter className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/30">
                  <TableHead className="pl-6 w-32 font-bold uppercase text-[10px] tracking-widest text-muted-foreground">ID</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Profile</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Tier Status</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Points</TableHead>
                  <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6} className="h-16 animate-pulse" /></TableRow>
                  ))
                ) : filteredMembers.map((member) => (
                  <TableRow key={member.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <TableCell className="pl-6 font-mono text-[11px] font-bold text-muted-foreground/80">{member.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col py-1">
                        <span className="font-bold text-sm">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={member.tier} onValueChange={(v) => handleInlineTierChange(member.id, v)}>
                        <SelectTrigger className="h-8 w-32 border-none bg-transparent hover:bg-slate-100 p-0 pl-2">
                          <SelectValue>
                            <Badge className={
                              member.tier === 'Gold' ? "bg-amber-100 text-amber-700" :
                              member.tier === 'Silver' ? "bg-slate-200 text-slate-700" : "bg-orange-100 text-orange-700"
                            }>
                              {member.tier}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Bronze">Bronze</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-bold">{member.points.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500 shadow-glow' : 'bg-slate-400'}`} />
                        <span className="text-sm font-medium">{member.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Profile</DropdownMenuItem>
                          <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Send Invite</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => remove.mutate(member.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Remove Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleAddMember}>
              <DialogHeader>
                <DialogTitle>Member Registration</DialogTitle>
                <DialogDescription>Add a new individual to the Nexus CRM ecosystem.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Full Name</label>
                  <Input name="name" placeholder="Johnathan Doe" required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Email Address</label>
                  <Input name="email" type="email" placeholder="john@enterprise.com" required />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Initial Tier</label>
                  <Select name="tier" defaultValue="Bronze">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bronze">Bronze (Entry Level)</SelectItem>
                      <SelectItem value="Silver">Silver (Mid-Tier)</SelectItem>
                      <SelectItem value="Gold">Gold (Premium)</SelectItem>
                    </SelectContent>
                  </Select>
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