import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, Search, Edit, UserX, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { usePotUsers, usePotUserMutations, usePotStats } from '@/lib/api-hooks';
import type { ThePotUser } from '@shared/types';

const editSchema = z.object({
    first_name: z.string().min(1, 'Verplicht'),
    last_name: z.string().min(1, 'Verplicht'),
    email: z.string().email('Ongeldig e-mailadres'),
    birth_date: z.string().optional(),
    gender: z.string().optional(),
    user_role: z.enum(['admin', 'user']),
    is_active: z.number(),
});

type EditForm = z.infer<typeof editSchema>;

export function PotUsersPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [editUser, setEditUser] = useState<ThePotUser | null>(null);
    const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    const { data, isLoading, refetch } = usePotUsers(debouncedSearch || undefined);
    const { data: stats } = usePotStats();
    const { update, deactivate } = usePotUserMutations();

    const form = useForm<EditForm>({
        resolver: zodResolver(editSchema),
        defaultValues: { first_name: '', last_name: '', email: '', user_role: 'user', is_active: 1 },
    });

    function handleSearchChange(value: string) {
        setSearch(value);
        if (searchTimer) clearTimeout(searchTimer);
        setSearchTimer(setTimeout(() => setDebouncedSearch(value), 400));
    }

    function openEdit(user: ThePotUser) {
        setEditUser(user);
        form.reset({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            birth_date: user.birth_date ?? '',
            gender: user.gender ?? '',
            user_role: (user.user_role as 'admin' | 'user') || 'user',
            is_active: user.is_active,
        });
    }

    async function onSave(values: EditForm) {
        if (!editUser) return;
        try {
            await update.mutateAsync({ id: editUser.id, ...values });
            toast.success('Gebruiker bijgewerkt');
            setEditUser(null);
        } catch {
            toast.error('Bijwerken mislukt');
        }
    }

    async function handleToggleActive(user: ThePotUser) {
        if (user.is_active) {
            try {
                await deactivate.mutateAsync(user.id);
                toast.success(`${user.first_name} gedeactiveerd`);
            } catch {
                toast.error('Deactiveren mislukt');
            }
        } else {
            try {
                await update.mutateAsync({ id: user.id, ...user, is_active: 1 });
                toast.success(`${user.first_name} geactiveerd`);
            } catch {
                toast.error('Activeren mislukt');
            }
        }
    }

    const users: ThePotUser[] = (data as any)?.items ?? [];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">The Pot — Gebruikers</h1>
                        <p className="text-sm text-muted-foreground">Beheer app-gebruikers rechtstreeks vanuit de D1-database</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Vernieuwen
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Totaal gebruikers', value: stats?.users ?? '…' },
                    { label: 'Games gespeeld', value: stats?.games ?? '…' },
                    { label: 'Challenges', value: stats?.challenges ?? '…' },
                    { label: 'Sub-challenges', value: stats?.subChallenges ?? '…' },
                ].map(s => (
                    <Card key={s.label}>
                        <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">{s.label}</CardTitle></CardHeader>
                        <CardContent><p className="text-2xl font-bold">{s.value}</p></CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Zoek op naam of e-mail…"
                        value={search}
                        onChange={e => handleSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                    <span className="text-sm text-muted-foreground ml-auto">
                        {(data as any)?.total ?? 0} gebruikers
                    </span>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Naam</TableHead>
                                <TableHead>E-mail</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Geverif.</TableHead>
                                <TableHead>Aangemeld</TableHead>
                                <TableHead className="text-right">Acties</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 8 }).map((__, j) => (
                                            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                : users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-mono text-xs">{user.id}</TableCell>
                                        <TableCell className="font-medium">{user.first_name} {user.last_name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.user_role === 'admin' ? 'default' : 'secondary'}>
                                                {user.user_role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                                {user.is_active ? 'Actief' : 'Inactief'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.is_email_verified ? 'default' : 'outline'}>
                                                {user.is_email_verified ? 'Ja' : 'Nee'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString('nl-NL')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openEdit(user)} title="Bewerken">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleActive(user)}
                                                    title={user.is_active ? 'Deactiveren' : 'Activeren'}
                                                >
                                                    {user.is_active ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-green-500" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={!!editUser} onOpenChange={open => !open && setEditUser(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Gebruiker bewerken — #{editUser?.id}</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="first_name" render={({ field }) => (
                                    <FormItem><FormLabel>Voornaam</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="last_name" render={({ field }) => (
                                    <FormItem><FormLabel>Achternaam</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="birth_date" render={({ field }) => (
                                    <FormItem><FormLabel>Geboortedatum</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem><FormLabel>Geslacht</FormLabel>
                                        <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Kies…" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="male">Man</SelectItem>
                                                <SelectItem value="female">Vrouw</SelectItem>
                                                <SelectItem value="other">Anders</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="user_role" render={({ field }) => (
                                    <FormItem><FormLabel>Rol</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">user</SelectItem>
                                                <SelectItem value="admin">admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="is_active" render={({ field }) => (
                                    <FormItem><FormLabel>Status</FormLabel>
                                        <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">Actief</SelectItem>
                                                <SelectItem value="0">Inactief</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditUser(null)}>Annuleren</Button>
                                <Button type="submit" disabled={update.isPending}>
                                    {update.isPending ? 'Opslaan…' : 'Opslaan'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
