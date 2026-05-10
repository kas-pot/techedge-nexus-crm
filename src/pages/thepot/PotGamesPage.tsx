import { useState } from 'react';
import { Gamepad2, Trash2, Eye, RefreshCw, Trophy, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { usePotGames, usePotGameDetail, usePotGameMutations } from '@/lib/api-hooks';
import type { ThePotGame } from '@shared/types';

function formatDuration(start?: string, end?: string) {
    if (!start || !end) return '—';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
}

function GameDetailDialog({ gameId, open, onClose }: { gameId: number | null; open: boolean; onClose: () => void }) {
    const { data, isLoading } = usePotGameDetail(open ? gameId : null);
    const game = data as any;

    return (
        <Dialog open={open} onOpenChange={o => !o && onClose()}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Game #{gameId} — Details</DialogTitle>
                </DialogHeader>
                {isLoading ? (
                    <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                ) : game ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><span className="text-muted-foreground">Gestart:</span> <span>{game.started_at ? new Date(game.started_at).toLocaleString('nl-NL') : '—'}</span></div>
                            <div><span className="text-muted-foreground">Beëindigd:</span> <span>{game.ended_at ? new Date(game.ended_at).toLocaleString('nl-NL') : '—'}</span></div>
                            <div><span className="text-muted-foreground">Duur:</span> <span>{formatDuration(game.started_at, game.ended_at)}</span></div>
                            <div><span className="text-muted-foreground">Winnaar:</span> <span className="font-semibold">{game.winner_team_name ?? '—'}</span></div>
                            <div><span className="text-muted-foreground">Aangemaakt door:</span> <span>{game.user_first_name} {game.user_last_name} ({game.user_email})</span></div>
                            <div><span className="text-muted-foreground">Ronde 4:</span> <Badge variant={game.round4_played ? 'default' : 'secondary'}>{game.round4_played ? 'Gespeeld' : 'Niet gespeeld'}</Badge></div>
                            <div><span className="text-muted-foreground">Challenge gebruikt:</span> <Badge variant={game.challenge_used ? 'default' : 'secondary'}>{game.challenge_used ? 'Ja' : 'Nee'}</Badge></div>
                            <div><span className="text-muted-foreground">Public ID:</span> <span className="font-mono text-xs">{game.public_id ?? '—'}</span></div>
                        </div>

                        {game.teams?.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4" /> Teams ({game.teams.length})</h3>
                                <div className="rounded-md border divide-y">
                                    {game.teams.map((t: any, i: number) => (
                                        <div key={i} className="px-3 py-2 text-sm flex items-center justify-between">
                                            <span className="font-medium">{t.name ?? `Team ${i + 1}`}</span>
                                            {game.winner_team_name === t.name && <Badge>Winnaar</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {game.rounds?.length > 0 && (
                            <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Clock className="h-4 w-4" /> Rondes ({game.rounds.length})</h3>
                                <div className="rounded-md border divide-y">
                                    {game.rounds.map((r: any, i: number) => (
                                        <div key={i} className="px-3 py-2 text-sm flex items-center justify-between">
                                            <span>Ronde {r.round_number ?? i + 1}</span>
                                            <span className="text-muted-foreground text-xs">{r.status ?? ''}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : <p className="text-muted-foreground">Geen data gevonden.</p>}
            </DialogContent>
        </Dialog>
    );
}

export function PotGamesPage() {
    const [page] = useState(1);
    const [detailId, setDetailId] = useState<number | null>(null);

    const { data, isLoading, refetch } = usePotGames(page);
    const { remove } = usePotGameMutations();

    const games: ThePotGame[] = (data as any)?.items ?? [];
    const total: number = (data as any)?.total ?? 0;

    async function handleDelete(id: number) {
        try {
            await remove.mutateAsync(id);
            toast.success('Game verwijderd');
        } catch {
            toast.error('Verwijderen mislukt');
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Gamepad2 className="h-6 w-6 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">The Pot — Games</h1>
                        <p className="text-sm text-muted-foreground">Overzicht van alle gespeelde games</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Vernieuwen
                </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Totaal games</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{total}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Afgerond</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{games.filter(g => !!g.ended_at).length}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1"><CardTitle className="text-xs text-muted-foreground">Met winnaar</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{games.filter(g => !!g.winner_team_name).length}</p></CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Aangemaakt door</TableHead>
                                <TableHead>Gestart</TableHead>
                                <TableHead>Duur</TableHead>
                                <TableHead>Rondes</TableHead>
                                <TableHead>Winnaar</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Acties</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <TableRow key={i}>
                                        {Array.from({ length: 8 }).map((__, j) => (
                                            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                                        ))}
                                    </TableRow>
                                ))
                                : games.map(game => (
                                    <TableRow key={game.id}>
                                        <TableCell className="font-mono text-xs">{game.id}</TableCell>
                                        <TableCell className="text-sm">
                                            {game.user_first_name
                                                ? `${game.user_first_name} ${game.user_last_name}`
                                                : <span className="text-muted-foreground italic">onbekend</span>}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {game.started_at ? new Date(game.started_at).toLocaleString('nl-NL') : '—'}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {formatDuration(game.started_at, game.ended_at)}
                                        </TableCell>
                                        <TableCell>{(game as any).round_count ?? '—'}</TableCell>
                                        <TableCell>
                                            {game.winner_team_name
                                                ? <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-yellow-500" />{game.winner_team_name}</span>
                                                : <span className="text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={game.ended_at ? 'default' : 'secondary'}>
                                                {game.ended_at ? 'Afgerond' : 'Bezig'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => setDetailId(game.id)} title="Details bekijken">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Verwijderen">
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Game #{game.id} verwijderen?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Dit verwijdert de game permanent uit de database. Dit kan niet ongedaan worden gemaakt.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(game.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                Verwijderen
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <GameDetailDialog
                gameId={detailId}
                open={detailId != null}
                onClose={() => setDetailId(null)}
            />
        </div>
    );
}
