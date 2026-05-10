import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, UserPlus, Edit, Trash2, MoreVertical, UserX, UserCheck, RefreshCw, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { usePotUsers, usePotUserMutations, usePotStats } from '@/lib/api-hooks';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ThePotUser } from '@shared/types';

const userSchema = z.object({
  first_name: z.string().min(1, 'Verplicht'),
  last_name: z.string().min(1, 'Verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  user_role: z.enum(['admin', 'user']),
  is_active: z.number(),
});

const createSchema = z.object({
  first_name: z.string().min(1, 'Verplicht'),
  last_name: z.string().min(1, 'Verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  user_role: z.enum(['admin', 'user']),
});

type UserForm = z.infer<typeof userSchema>;
type CreateForm = z.infer<typeof createSchema>;

export function MemberListPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<ThePotUser | null>(null);

  const { data, isLoading, refetch } = usePotUsers(debouncedSearch || undefined);
  const { data: stats } = usePotStats();
  const { create, update, deactivate } = usePotUserMutations();

  const editForm = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { first_name: '', last_name: '', email: '', user_role: 'user', is_active: 1 },
  });
  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: { first_name: '', last_name: '', email: '', user_role: 'user' },
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => setDebouncedSearch(value), 400));
  }

  function openEdit(user: ThePotUser) {
    setEditingUser(user);
    editForm.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      birth_date: user.birth_date ?? '',
      gender: user.gender ?? '',
      user_role: (user.user_role as 'admin' | 'user') || 'user',
      is_active: user.is_active,
    });
  }

  async function handleUpdate(values: UserForm) {
    if (!editingUser) return;
    try {
      await update.mutateAsync({ id: editingUser.id, ...values });
      setEditingUser(null);
      toast.success('Gebruiker bijgewerkt');
    } catch {
      toast.error('Bijwerken mislukt');
    }
  }

  async function handleCreate(values: CreateForm) {
    try {
      await create.mutateAsync({ ...values, is_active: 1 });
      setIsAdding(false);
      createForm.reset();
      toast.success('Gebruiker aangemaakt');
    } catch (err: any) {
      toast.error(err?.message ?? 'Aanmaken mislukt');
    }
  }

  async function handleToggleActive(user: ThePotUser) {
    try {
      if (user.is_active) {
        await deactivate.mutateAsync(user.id);
        toast.success(`${user.first_name} gedeactiveerd`);
      } else {
        await update.mutateAsync({ id: user.id, ...user, is_active: 1 });
        toast.success(`${user.first_name} geactiveerd`);
      }
    } catch {
      toast.error('Status wijzigen mislukt');
    }
  }

  const users: ThePotUser[] = (data as any)?.items ?? [];
  const total: number = (data as any)?.total ?? 0;

  return (
    <AppLayout container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <div className="text-muted-foreground flex items-center gap-2 mt-1">
              Live data uit{' '}
              <Badge variant="secondary" className="font-bold">thepot-development-db</Badge>
              {' '}&mdash; {total} gebruikers
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="shadow-sm" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" /> Vernieuwen
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAdding(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Gebruiker toevoegen
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Totaal', value: stats?.users ?? '...' },
            { label: 'Geverifieerd', value: users.filter(u => u.is_email_verified).length },
            { label: 'Actief', value: users.filter(u => u.is_active).length },
            { label: 'Admins', value: users.filter(u => u.user_role === 'admin').length },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-none shadow-soft overflow-hidden flex flex-col h-[600px]">
          <CardHeader className="pb-4 bg-slate-50/50 border-b">
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Zoek op naam of e-mail..."
                  className="pl-9 h-11 bg-white"
                  value={search}
                  onChange={e => handleSearchChange(e.target.value)}
                />
              </div>
              <span className="ml-auto text-sm text-muted-foreground">{total} resultaten</span>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="pl-6 font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">ID</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Gebruiker</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Rol</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Geverif.</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Status</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Aangemeld</TableHead>
                    <TableHead className="pr-6 text-right font-bold uppercase text-[10px] tracking-widest text-muted-foreground h-12">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}><TableCell colSpan={7} className="h-16 animate-pulse bg-muted/20" /></TableRow>
                      ))
                    : users.map(user => (
                        <TableRow key={user.id} className="group hover:bg-indigo-50/30 transition-colors border-b">
                          <TableCell className="pl-6 font-mono text-[11px] text-muted-foreground">{user.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm">{user.first_name} {user.last_name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.user_role === 'admin' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                              {user.user_role === 'admin' && <Shield className="h-3 w-3" />}
                              {user.user_role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className={`h-2 w-2 rounded-full ${user.is_email_verified ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                              <span className="text-xs">{user.is_email_verified ? 'Ja' : 'Nee'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-400'}`} />
                              <span className="text-sm">{user.is_active ? 'Actief' : 'Inactief'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString('nl-NL')}
                          </TableCell>
                          <TableCell className="pr-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuItem onClick={() => openEdit(user)}>
                                  <Edit className="mr-2 h-4 w-4" /> Bewerken
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                  {user.is_active
                                    ? <><UserX className="mr-2 h-4 w-4 text-destructive" /> Deactiveren</>
                                    : <><UserCheck className="mr-2 h-4 w-4 text-green-600" /> Activeren</>}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive" onSelect={e => e.preventDefault()}>
                                      <Trash2 className="mr-2 h-4 w-4" /> Deactiveren (definitief)
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Gebruiker deactiveren?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {user.first_name} {user.last_name} wordt gedeactiveerd. Ze kunnen niet meer inloggen in de app.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                      <AlertDialogAction className="bg-destructive" onClick={() => deactivate.mutate(user.id)}>
                                        Bevestigen
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  {users.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center text-muted-foreground">
                        Geen gebruikers gevonden.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Edit Sheet */}
        <Sheet open={!!editingUser} onOpenChange={o => !o && setEditingUser(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Gebruiker bewerken</SheetTitle>
              <SheetDescription>
                Wijzig de gegevens van {editingUser?.first_name} {editingUser?.last_name} (ID: {editingUser?.id})
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-5 py-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Voornaam</Label>
                  <Input {...editForm.register('first_name')} />
                  {editForm.formState.errors.first_name && (
                    <p className="text-xs text-destructive">{editForm.formState.errors.first_name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Achternaam</Label>
                  <Input {...editForm.register('last_name')} />
                  {editForm.formState.errors.last_name && (
                    <p className="text-xs text-destructive">{editForm.formState.errors.last_name.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" {...editForm.register('email')} />
                {editForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{editForm.formState.errors.email.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Geboortedatum</Label>
                  <Input type="date" {...editForm.register('birth_date')} />
                </div>
                <div className="space-y-2">
                  <Label>Geslacht</Label>
                  <Select value={editForm.watch('gender') ?? ''} onValueChange={v => editForm.setValue('gender', v)}>
                    <SelectTrigger><SelectValue placeholder="Kies..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Man</SelectItem>
                      <SelectItem value="female">Vrouw</SelectItem>
                      <SelectItem value="other">Anders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select value={editForm.watch('user_role')} onValueChange={v => editForm.setValue('user_role', v as 'admin' | 'user')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={String(editForm.watch('is_active'))} onValueChange={v => editForm.setValue('is_active', Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Actief</SelectItem>
                      <SelectItem value="0">Inactief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter className="pt-6">
                <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>Annuleren</Button>
                <Button type="submit" className="bg-indigo-600" disabled={update.isPending}>
                  {update.isPending ? 'Opslaan...' : 'Opslaan'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>

        {/* Create Dialog */}
        <Dialog open={isAdding} onOpenChange={o => { if (!o) { setIsAdding(false); createForm.reset(); } }}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={createForm.handleSubmit(handleCreate)}>
              <DialogHeader>
                <DialogTitle>Gebruiker aanmaken</DialogTitle>
                <DialogDescription>Voeg een nieuwe gebruiker toe aan de The Pot database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Voornaam</Label>
                    <Input {...createForm.register('first_name')} />
                    {createForm.formState.errors.first_name && (
                      <p className="text-xs text-destructive">{createForm.formState.errors.first_name.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label>Achternaam</Label>
                    <Input {...createForm.register('last_name')} />
                    {createForm.formState.errors.last_name && (
                      <p className="text-xs text-destructive">{createForm.formState.errors.last_name.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>E-mailadres</Label>
                  <Input type="email" {...createForm.register('email')} />
                  {createForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{createForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label>Rol</Label>
                  <Select value={createForm.watch('user_role')} onValueChange={v => createForm.setValue('user_role', v as 'admin' | 'user')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" type="button" onClick={() => { setIsAdding(false); createForm.reset(); }}>Annuleren</Button>
                <Button className="bg-indigo-600 px-8" type="submit" disabled={create.isPending}>
                  {create.isPending ? 'Aanmaken...' : 'Aanmaken'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
