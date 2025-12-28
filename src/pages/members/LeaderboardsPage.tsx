import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Star, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useLeaderboards } from '@/lib/api-hooks';
export function LeaderboardsPage() {
  const { data, isLoading } = useLeaderboards();
  const leaderboards = data?.items || [];
  const renderPodium = (entries: any[]) => {
    const top3 = [...entries].sort((a, b) => a.rank - b.rank).slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]]; // 2nd, 1st, 3rd
    return (
      <div className="flex items-end justify-center gap-4 py-12 px-4 bg-slate-50/50 dark:bg-slate-900/10 rounded-3xl mb-8">
        {podiumOrder.map((entry, idx) => {
          if (!entry) return null;
          const isFirst = entry.rank === 1;
          const height = isFirst ? 'h-56' : entry.rank === 2 ? 'h-44' : 'h-36';
          const color = isFirst ? 'bg-amber-400' : entry.rank === 2 ? 'bg-slate-300' : 'bg-orange-300';
          return (
            <div key={entry.rank} className="flex flex-col items-center gap-4 w-32 animate-slide-up">
              <div className="relative">
                <Avatar className={`h-16 w-16 border-4 border-white dark:border-slate-800 shadow-xl ${isFirst ? 'scale-125' : ''}`}>
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{entry.memberName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${color}`}>
                  {entry.rank}
                </div>
              </div>
              <div className={`w-full ${height} ${color} rounded-t-2xl shadow-soft flex flex-col items-center justify-center p-4 text-center`}>
                <div className="font-bold text-slate-800 line-clamp-1">{entry.memberName}</div>
                <div className="text-sm font-medium text-slate-700">{entry.points.toLocaleString()} XP</div>
                {isFirst && <Trophy className="mt-2 h-6 w-6 text-amber-700 animate-bounce" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
            <p className="text-muted-foreground">Recognizing our top performing community members.</p>
          </div>
        </div>
        <Tabs defaultValue="weekly" className="space-y-8">
          <TabsList className="bg-muted/50 p-1 w-full max-w-md">
            <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
            <TabsTrigger value="all-time" className="flex-1">All-Time</TabsTrigger>
          </TabsList>
          {['weekly', 'monthly', 'all-time'].map((period) => (
            <TabsContent key={period} value={period} className="mt-0">
              {isLoading ? (
                <div className="h-96 animate-pulse bg-muted/20 rounded-xl" />
              ) : (
                <div className="space-y-6">
                  {leaderboards.find(l => l.period === period) ? (
                    <>
                      {renderPodium(leaderboards.find(l => l.period === period)!.entries)}
                      <Card className="shadow-soft">
                        <CardHeader>
                          <CardTitle>Global Rankings</CardTitle>
                          <CardDescription>Members currently competing for top spots.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-20 text-center">Rank</TableHead>
                                <TableHead>Member</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total XP</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {leaderboards.find(l => l.period === period)!.entries.map((entry) => (
                                <TableRow key={entry.rank}>
                                  <TableCell className="text-center">
                                    {entry.rank <= 3 ? (
                                      <Medal className={`h-5 w-5 mx-auto ${entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-slate-400' : 'text-orange-400'}`} />
                                    ) : (
                                      <span className="font-mono font-medium">{entry.rank}</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-[10px]">{entry.memberName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium">{entry.memberName}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {entry.change === 'up' ? (
                                      <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100"><ArrowUpRight className="h-3 w-3 mr-1" /> Rising</Badge>
                                    ) : entry.change === 'down' ? (
                                      <Badge variant="outline" className="text-rose-600 bg-rose-50 border-rose-100"><ArrowDownRight className="h-3 w-3 mr-1" /> Falling</Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-slate-500 bg-slate-50 border-slate-100"><Minus className="h-3 w-3 mr-1" /> Steady</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right font-bold text-indigo-600">
                                    {entry.points.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl text-muted-foreground">
                      No leaderboard data for this period yet.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}