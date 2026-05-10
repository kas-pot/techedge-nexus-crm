import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Puzzle, Plus, Edit, Trash2, ChevronDown, ChevronRight, RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { usePotChallenges, usePotSubChallenges, usePotChallengeMutations, usePotSubChallengeMutations } from '@/lib/api-hooks';
import type { ThePotChallenge, ThePotSubChallenge } from '@shared/types';

const challengeSchema = z.object({ name: z.string().min(1, 'Verplicht'), is_active: z.number() });
const subSchema = z.object({ name: z.string().min(1, 'Verplicht') });
type ChallengeForm = z.infer<typeof challengeSchema>;
type SubForm = z.infer<typeof subSchema>;

function SubChallengePanel({ challenge }: { challenge: ThePotChallenge }) {
    const { data, isLoading } = usePotSubChallenges(challenge.challenge_id);
    const mutations = usePotSubChallengeMutations(challenge.challenge_id);
    const [editSub, setEditSub] = useState<ThePotSubChallenge | null>(null);
    const [showAdd, setShowAdd] = useState(false);

    const form = useForm<SubForm>({ resolver: zodResolver(subSchema), defaultValues: { name: '' } });
    const editForm = useForm<SubForm>({ resolver: zodResolver(subSchema), defaultValues: { name: '' } });

    const subs: ThePotSubChallenge[] = (data as any)?.items ?? [];

    async function handleAdd(values: SubForm) {
        try {
            await mutations.create.mutateAsync(values);
            toast.success('Sub-challenge aangemaakt');
            form.reset();
            setShowAdd(false);
        } catch {
            toast.error('Aanmaken mislukt');
        }
    }

    async function handleEdit(values: SubForm) {
        if (!editSub) return;
        try {
            await mutations.update.mutateAsync({ id: editSub.id, name: values.name });
            toast.success('Sub-challenge bijgewerkt');
            setEditSub(null);
        } catch {
            toast.error('Bijwerken mislukt');
        }
    }

    async function handleDelete(id: number, isDefault: number) {
        if (isDefault) { toast.error('Standaard sub-challenges kunnen niet worden verwijderd'); return; }
        try {
            await mutations.remove.mutateAsync(id);
            toast.success('Sub-challenge verwijderd');
        } catch {
            toast.error('Verwijderen mislukt');
        }
    }

    function openEditSub(sub: ThePotSubChallenge) {
        setEditSub(sub);
        editForm.reset({ name: sub.name });
    }

    return (
        <div className="mt-3 ml-4 border-l-2 border-muted pl-4 space-y-2">
            {isLoading
                ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                : subs.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 text-sm">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {sub.is_default === 1 && <Shield className="h-3 w-3 text-muted-foreground flex-shrink-0" title="Standaard" />}
                            <span className="truncate">{sub.name}</span>
                        </div>
                        <div className="flex gap-1 ml-2">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditSub(sub)}>
                                <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                disabled={sub.is_default === 1}
                                onClick={() => handleDelete(sub.id, sub.is_default)}
                            >
                                <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                    </div>
                ))}

            {showAdd ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAdd)} className="flex gap-2">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Input placeholder="Naam sub-challenge…" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" size="sm" disabled={mutations.create.isPending}>Toevoegen</Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setShowAdd(false)}>Annuleren</Button>
                    </form>
                </Form>
            ) : (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowAdd(true)}>
                    <Plus className="h-3 w-3 mr-1" /> Sub-challenge toevoegen
                </Button>
            )}

            {/* Edit sub dialog */}
            <Dialog open={!!editSub} onOpenChange={o => !o && setEditSub(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Sub-challenge bewerken</DialogTitle></DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                            <FormField control={editForm.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Naam</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditSub(null)}>Annuleren</Button>
                                <Button type="submit" disabled={mutations.update.isPending}>Opslaan</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ChallengeRow({ challenge, onEdit, onDelete }: {
    challenge: ThePotChallenge;
    onEdit: (c: ThePotChallenge) => void;
    onDelete: (c: ThePotChallenge) => void;
}) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpanded(e => !e)}>
                    {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{challenge.name}</span>
                        {challenge.is_default === 1 && <Badge variant="secondary">Standaard</Badge>}
                        <Badge variant={challenge.is_active ? 'default' : 'outline'}>
                            {challenge.is_active ? 'Actief' : 'Inactief'}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                            {challenge.sub_challenge_count ?? 0} sub-challenges
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">ID: {challenge.challenge_id}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(challenge)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={challenge.is_default === 1} title={challenge.is_default ? 'Standaard challenges kunnen niet worden verwijderd' : 'Verwijderen'}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>"{challenge.name}" verwijderen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Dit verwijdert de challenge en alle bijbehorende sub-challenges permanent.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(challenge)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Verwijderen
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            {expanded && <SubChallengePanel challenge={challenge} />}
        </div>
    );
}

export function PotChallengesPage() {
    const { data, isLoading, refetch } = usePotChallenges();
    const { create, update, remove } = usePotChallengeMutations();
    const [editChallenge, setEditChallenge] = useState<ThePotChallenge | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    const challenges: ThePotChallenge[] = (data as any)?.items ?? [];

    const createForm = useForm<ChallengeForm>({ resolver: zodResolver(challengeSchema), defaultValues: { name: '', is_active: 0 } });
    const editForm = useForm<ChallengeForm>({ resolver: zodResolver(challengeSchema), defaultValues: { name: '', is_active: 0 } });

    async function handleCreate(values: ChallengeForm) {
        try {
            await create.mutateAsync({ name: values.name });
            toast.success('Challenge aangemaakt');
            createForm.reset();
            setShowCreate(false);
        } catch {
            toast.error('Aanmaken mislukt');
        }
    }

    async function handleEdit(values: ChallengeForm) {
        if (!editChallenge) return;
        try {
            await update.mutateAsync({ id: editChallenge.id, name: values.name, is_active: values.is_active });
            toast.success('Challenge bijgewerkt');
            setEditChallenge(null);
        } catch {
            toast.error('Bijwerken mislukt');
        }
    }

    async function handleDelete(challenge: ThePotChallenge) {
        if (challenge.is_default) { toast.error('Standaard challenges kunnen niet worden verwijderd'); return; }
        try {
            await remove.mutateAsync(challenge.id);
            toast.success('Challenge verwijderd');
        } catch {
            toast.error('Verwijderen mislukt');
        }
    }

    function openEdit(challenge: ThePotChallenge) {
        setEditChallenge(challenge);
        editForm.reset({ name: challenge.name, is_active: challenge.is_active });
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Puzzle className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">The Pot — Challenges</h1>
                        <p className="text-sm text-muted-foreground">Beheer challenge-sets en sub-challenges voor het party game</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Vernieuwen
                    </Button>
                    <Button size="sm" onClick={() => setShowCreate(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Nieuwe challenge
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Challenges</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{challenges.length}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Actief</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{challenges.filter(c => c.is_active).length}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Sub-challenges totaal</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{challenges.reduce((s, c) => s + (c.sub_challenge_count ?? 0), 0)}</p></CardContent>
                </Card>
            </div>

            <div className="space-y-3">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
                    : challenges.map(challenge => (
                        <ChallengeRow
                            key={challenge.id}
                            challenge={challenge}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
            </div>

            {/* Create dialog */}
            <Dialog open={showCreate} onOpenChange={o => { if (!o) { setShowCreate(false); createForm.reset(); } }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Nieuwe challenge aanmaken</DialogTitle></DialogHeader>
                    <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                            <FormField control={createForm.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Naam</FormLabel><FormControl><Input placeholder="bijv. 18+ Uitdagingen" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Annuleren</Button>
                                <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Aanmaken…' : 'Aanmaken'}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit dialog */}
            <Dialog open={!!editChallenge} onOpenChange={o => !o && setEditChallenge(null)}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Challenge bewerken</DialogTitle></DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEdit)} className="space-y-4">
                            <FormField control={editForm.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Naam</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={editForm.control} name="is_active" render={({ field }) => (
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
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setEditChallenge(null)}>Annuleren</Button>
                                <Button type="submit" disabled={update.isPending}>Opslaan</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
