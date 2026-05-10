import React, { useState, useMemo } from 'react';
import {
    Gamepad2, Trash2, RefreshCw, Trophy, Clock, Users,
    ChevronRight, Search, X, Shield, CalendarDays, Hash,
    AlertCircle, CheckCircle2, Timer, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { usePotGames, usePotGameDetail, usePotGameMutations, usePotUsers } from '@/lib/api-hooks';
import type { ThePotGame } from '@shared/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(startIso?: string, endIso?: string): string {
    if (!startIso || !endIso) return '—';
    const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
    if (ms < 0) return '—';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function formatDurationMs(ms: number | null | undefined): string {
    if (ms == null || ms < 0) return '—';
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function formatDateTime(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('nl-NL', { dateStyle: 'medium', timeStyle: 'short' });
}

// ─── Info row helper ──────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, mono, highlight }: {
    icon?: React.ReactNode;
    label: string;
    value: string;
    mono?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className="space-y-0.5">
            <dt className="text-[11px] uppercase font-semibold text-muted-foreground flex items-center gap-1">
                {icon}{label}
            </dt>
            <dd className={`text-sm font-medium ${highlight ? 'text-yellow-600 dark:text-yellow-400' : ''} ${mono ? 'font-mono text-xs' : ''}`}>
                {value}
            </dd>
        </div>
    );
}

// ─── Game Detail Sheet ────────────────────────────────────────────────────────

function GameDetailSheet({ gameId, open, onClose, onDelete }: {
    gameId: number | null;
    open: boolean;
    onClose: () => void;
    onDelete: (id: number) => void;
}) {
    const { data, isLoading } = usePotGameDetail(open ? gameId : null);
    const game = data as any;

    return (
        <Sheet open={open} onOpenChange={o => !o && onClose()}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto" side="right">
                <SheetHeader className="pb-4 border-b">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <SheetTitle className="flex items-center gap-2 text-lg">
                                <Gamepad2 className="h-5 w-5 text-indigo-500" />
                                Game #{gameId}
                            </SheetTitle>
                            {!isLoading && game && (
                                <SheetDescription className="mt-1">
                                    {game.ended_at
                                        ? `Afgerond op ${formatDateTime(game.ended_at)}`
                                        : 'Bezig…'}
                                </SheetDescription>
                            )}
                        </div>
                        {gameId && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4 mr-1.5" /> Verwijderen
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Game #{gameId} verwijderen?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Dit verwijdert de game permanent. Dit kan niet ongedaan worden gemaakt.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => { onDelete(gameId!); onClose(); }}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Verwijderen
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </SheetHeader>

                {isLoading ? (
                    <div className="space-y-3 pt-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-7 w-full rounded-md" />
                        ))}
                    </div>
                ) : !game ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
                        <AlertCircle className="h-10 w-10 opacity-30" />
                        <p>Geen gegevens gevonden.</p>
                    </div>
                ) : (
                    <div className="space-y-6 pt-5">

                        {/* ── Overview ─────────────────────────────────── */}
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Overzicht</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                <InfoRow icon={<CalendarDays className="h-3.5 w-3.5" />} label="Gestart" value={formatDateTime(game.started_at)} />
                                <InfoRow icon={<CalendarDays className="h-3.5 w-3.5" />} label="Beëindigd" value={formatDateTime(game.ended_at)} />
                                <InfoRow icon={<Timer className="h-3.5 w-3.5" />} label="Totale duur" value={formatDuration(game.started_at, game.ended_at)} />
                                <InfoRow icon={<Trophy className="h-3.5 w-3.5 text-yellow-500" />} label="Winnaar" value={game.winner_team_name ?? '—'} highlight={!!game.winner_team_name} />
                                <InfoRow icon={<Users className="h-3.5 w-3.5" />} label="Aangemaakt door"
                                    value={game.user_first_name ? `${game.user_first_name} ${game.user_last_name}` : (game.user_email ?? '—')} />
                                <InfoRow icon={<Hash className="h-3.5 w-3.5" />} label="Public ID" value={game.public_id ?? '—'} mono />
                                <div className="flex items-center justify-between col-span-2 py-1.5 px-3 rounded-lg bg-muted/40">
                                    <span className="text-muted-foreground text-xs font-medium">Ronde 4 gespeeld</span>
                                    <Badge variant={game.round4_played ? 'default' : 'secondary'} className="text-xs">
                                        {game.round4_played ? 'Ja' : 'Nee'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between col-span-2 py-1.5 px-3 rounded-lg bg-muted/40">
                                    <span className="text-muted-foreground text-xs font-medium">Challenge gebruikt</span>
                                    <Badge variant={game.challenge_used ? 'default' : 'secondary'} className="text-xs">
                                        {game.challenge_used ? 'Ja' : 'Nee'}
                                    </Badge>
                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* ── Teams ────────────────────────────────────── */}
                        {game.teams?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                    <Shield className="h-3.5 w-3.5" /> Teams ({game.teams.length})
                                </h3>
                                <div className="space-y-3">
                                    {game.teams.map((team: any, i: number) => {
                                        const isWinner = game.winner_team_name && game.winner_team_name === team.name;
                                        return (
                                            <div key={team.id ?? i} className={`rounded-xl border p-3 space-y-2 ${isWinner ? 'border-yellow-400/50 bg-yellow-50/5' : 'bg-muted/20'}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-sm flex items-center gap-2">
                                                        {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                                                        {team.name ?? `Team ${i + 1}`}
                                                    </span>
                                                    {isWinner && <Badge className="bg-yellow-500/15 text-yellow-700 border-yellow-400/40 text-[10px]">Winnaar</Badge>}
                                                </div>

                                                {(team.score != null || team.total_score != null) && (
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Star className="h-3 w-3" /> Score: <span className="font-medium text-foreground">{team.score ?? team.total_score}</span>
                                                    </div>
                                                )}

                                                {/* Spelers per team */}
                                                {team.players?.length > 0 ? (
                                                    <div className="pt-1">
                                                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1.5">Spelers</p>
                                                        <div className="space-y-1">
                                                            {team.players.map((p: any, pi: number) => (
                                                                <div key={p.user_id ?? pi} className="flex items-center gap-2 text-xs bg-background rounded-lg px-2 py-1.5 border">
                                                                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                                                        {(p.first_name?.[0] ?? '?').toUpperCase()}
                                                                    </div>
                                                                    <span className="font-medium">{p.first_name} {p.last_name}</span>
                                                                    {p.email && <span className="text-muted-foreground ml-auto truncate max-w-[140px]">{p.email}</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-muted-foreground italic">Geen spelergegevens beschikbaar</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {game.teams?.length > 0 && game.rounds?.length > 0 && <Separator />}

                        {/* ── Rounds ───────────────────────────────────── */}
                        {game.rounds?.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5" /> Rondes ({game.rounds.length})
                                </h3>
                                <div className="rounded-xl border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/30 hover:bg-muted/30">
                                                <TableHead className="text-xs h-8 py-0">#</TableHead>
                                                <TableHead className="text-xs h-8 py-0">Winnaar</TableHead>
                                                <TableHead className="text-xs h-8 py-0">Duur</TableHead>
                                                <TableHead className="text-xs h-8 py-0">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {game.rounds.map((r: any, i: number) => (
                                                <TableRow key={r.id ?? i} className="text-sm">
                                                    <TableCell className="font-semibold py-2 text-xs">
                                                        Ronde {r.round_number ?? i + 1}
                                                    </TableCell>
                                                    <TableCell className="py-2">
                                                        {r.winner_team_name
                                                            ? <span className="flex items-center gap-1 text-xs"><Trophy className="h-3 w-3 text-yellow-500" />{r.winner_team_name}</span>
                                                            : <span className="text-muted-foreground text-xs">—</span>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground py-2">
                                                        {r.duration_ms != null
                                                            ? formatDurationMs(r.duration_ms)
                                                            : formatDuration(r.started_at, r.ended_at)
                                                        }
                                                    </TableCell>
                                                    <TableCell className="py-2">
                                                        {r.status
                                                            ? <Badge variant={r.status === 'finished' || r.status === 'completed' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1.5">
                                                                {r.status}
                                                            </Badge>
                                                            : <span className="text-muted-foreground text-xs">—</span>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </section>
                        )}

                        {!game.teams?.length && !game.rounds?.length && (
                            <div className="text-center text-sm text-muted-foreground py-8">
                                Geen team- of rondegegevens beschikbaar voor dit game.
                            </div>
                        )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: {
    label: string;
    value: number;
    icon: React.ReactNode;
    accent?: 'amber' | 'emerald' | 'yellow';
}) {
    const accentClasses: Record<string, string> = {
        amber: 'bg-amber-50 dark:bg-amber-900/10',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/10',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/10',
    };
    return (
        <Card className={accent ? accentClasses[accent] : ''}>
            <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs text-muted-foreground flex items-center gap-1.5">
                    {icon}{label}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <p className="text-3xl font-bold tracking-tight">{value}</p>
            </CardContent>
        </Card>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function PotGamesPage() {
    const [page, setPage] = useState(1);
    const [detailId, setDetailId] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [userSearch, setUserSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'finished'>('all');

    const { data, isLoading, refetch } = usePotGames(page, selectedUserId);
    const { data: usersData } = usePotUsers(undefined, 1);
    const { remove } = usePotGameMutations();

    const allGames: ThePotGame[] = (data as any)?.items ?? [];
    const total: number = (data as any)?.total ?? 0;

    const games = useMemo(() => {
        if (statusFilter === 'active') return allGames.filter(g => !g.ended_at);
        if (statusFilter === 'finished') return allGames.filter(g => !!g.ended_at);
        return allGames;
    }, [allGames, statusFilter]);

    const allUsers: any[] = (usersData as any)?.items ?? [];
    const filteredUsers = useMemo(() => {
        if (!userSearch.trim() || selectedUserId) return [];
        const q = userSearch.toLowerCase();
        return allUsers.filter(u =>
            `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(q)
        ).slice(0, 8);
    }, [allUsers, userSearch, selectedUserId]);

    const selectedUser = allUsers.find(u => u.id === selectedUserId);

    async function handleDelete(id: number) {
        try {
            await remove.mutateAsync(id);
            toast.success(`Game #${id} verwijderd`);
            if (detailId === id) setDetailId(null);
        } catch {
            toast.error('Verwijderen mislukt');
        }
    }

    const finishedCount = allGames.filter(g => !!g.ended_at).length;
    const activeCount = allGames.filter(g => !g.ended_at).length;
    const withWinnerCount = allGames.filter(g => !!g.winner_team_name).length;

    return (
        <div className="p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">The Pot — Games</h1>
                        <p className="text-sm text-muted-foreground">
                            {total} game{total !== 1 ? 's' : ''}
                            {selectedUser && <span className="text-indigo-500 font-medium"> · {selectedUser.first_name} {selectedUser.last_name}</span>}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Vernieuwen
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Totaal games" value={total} icon={<Gamepad2 className="h-4 w-4 text-indigo-500" />} />
                <StatCard label="Bezig" value={activeCount} icon={<Timer className="h-4 w-4 text-amber-500" />} accent="amber" />
                <StatCard label="Afgerond" value={finishedCount} icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />} accent="emerald" />
                <StatCard label="Met winnaar" value={withWinnerCount} icon={<Trophy className="h-4 w-4 text-yellow-500" />} accent="yellow" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[240px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Filter op speler…"
                        className="pl-9 pr-8"
                        value={userSearch}
                        onChange={e => { setUserSearch(e.target.value); setSelectedUserId(null); setPage(1); }}
                    />
                    {userSearch && (
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => { setUserSearch(''); setSelectedUserId(null); }}>
                            <X className="h-4 w-4" />
                        </button>
                    )}
                    {filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border bg-popover shadow-lg overflow-hidden">
                            {filteredUsers.map(u => (
                                <button key={u.id}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center gap-2"
                                    onClick={() => { setSelectedUserId(u.id); setUserSearch(`${u.first_name} ${u.last_name}`); setPage(1); }}
                                >
                                    <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {(u.first_name?.[0] ?? '?').toUpperCase()}
                                    </div>
                                    <div>
                                        <span className="font-medium">{u.first_name} {u.last_name}</span>
                                        <span className="text-muted-foreground ml-2 text-xs">{u.email}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Select value={statusFilter} onValueChange={(v: any) => { setStatusFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Alle statussen</SelectItem>
                        <SelectItem value="active">Bezig</SelectItem>
                        <SelectItem value="finished">Afgerond</SelectItem>
                    </SelectContent>
                </Select>

                {selectedUserId && (
                    <Button variant="secondary" size="sm" onClick={() => { setSelectedUserId(null); setUserSearch(''); setPage(1); }}>
                        <X className="h-3.5 w-3.5 mr-1.5" /> Filter wissen
                    </Button>
                )}
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">ID</TableHead>
                                <TableHead>Speler</TableHead>
                                <TableHead>Gestart</TableHead>
                                <TableHead>Duur</TableHead>
                                <TableHead className="text-center">Rondes</TableHead>
                                <TableHead className="text-center">Teams</TableHead>
                                <TableHead>Winnaar</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right w-24">Acties</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 9 }).map((__, j) => (
                                            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : games.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                                        <Gamepad2 className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">Geen games gevonden</p>
                                        {(selectedUserId || statusFilter !== 'all') && (
                                            <p className="text-xs mt-1">Pas de filters aan om meer te zien</p>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                games.map(game => (
                                    <TableRow
                                        key={game.id}
                                        className="cursor-pointer hover:bg-muted/40 transition-colors"
                                        onClick={() => setDetailId(game.id)}
                                    >
                                        <TableCell className="font-mono text-xs text-muted-foreground">#{game.id}</TableCell>
                                        <TableCell>
                                            {game.user_first_name ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                                                        {game.user_first_name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{game.user_first_name} {game.user_last_name}</p>
                                                        {game.user_email && <p className="text-[11px] text-muted-foreground mt-0.5">{game.user_email}</p>}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic text-xs">onbekend</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {game.started_at ? formatDateTime(game.started_at) : '—'}
                                        </TableCell>
                                        <TableCell className="text-xs font-medium">
                                            {formatDuration(game.started_at, game.ended_at)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="text-[11px] font-mono">
                                                {(game as any).round_count ?? '—'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="text-[11px] font-mono">
                                                {game.team_count ?? '—'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {game.winner_team_name ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                                                    <Trophy className="h-3 w-3 text-yellow-500 shrink-0" />
                                                    {game.winner_team_name}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={game.ended_at ? 'default' : 'secondary'} className="text-[11px]">
                                                {game.ended_at ? 'Afgerond' : 'Bezig'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost" size="icon" className="h-8 w-8"
                                                    onClick={() => setDetailId(game.id)}
                                                    title="Details bekijken"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/60 hover:text-destructive" title="Verwijderen">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Game #{game.id} verwijderen?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Dit verwijdert de game permanent. Dit kan niet ongedaan worden gemaakt.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(game.id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Verwijderen
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {total > 50 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Pagina {page} · {total} totaal</span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Vorige</Button>
                        <Button variant="outline" size="sm" disabled={page * 50 >= total} onClick={() => setPage(p => p + 1)}>Volgende</Button>
                    </div>
                </div>
            )}

            {/* Detail Sheet */}
            <GameDetailSheet
                gameId={detailId}
                open={detailId != null}
                onClose={() => setDetailId(null)}
                onDelete={handleDelete}
            />
        </div>
    );
}

