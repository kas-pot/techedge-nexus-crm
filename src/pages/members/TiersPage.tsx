import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShieldCheck, Trophy, Star, ArrowRight, Settings2 } from 'lucide-react';
import { useTiers } from '@/lib/api-hooks';
const tierIcons: Record<string, any> = {
  "Bronze": Star,
  "Silver": Trophy,
  "Gold": ShieldCheck
};
export function TiersPage() {
  const { data, isLoading } = useTiers();
  const tiers = data?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Membership Tiers</h1>
            <p className="text-muted-foreground">Configure thresholds and elite benefits for each progression level.</p>
          </div>
          <Button variant="outline"><Settings2 className="mr-2 h-4 w-4" /> Global Rules</Button>
        </div>
        <div className="relative pt-12 pb-8">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full" />
          <div className="relative flex justify-between">
            {tiers.map((tier, idx) => {
              const Icon = tierIcons[tier.name] || Star;
              return (
                <div key={tier.id} className="flex flex-col items-center gap-3 relative z-10">
                  <div 
                    className="h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg floating"
                    style={{ backgroundColor: tier.color, animationDelay: `${idx * 0.2}s` }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{tier.name}</div>
                    <div className="text-xs text-muted-foreground font-medium">{tier.minPoints.toLocaleString()} Points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            [1, 2, 3].map(i => <Card key={i} className="h-96 animate-pulse" />)
          ) : tiers.map((tier) => {
            const Icon = tierIcons[tier.name] || Star;
            return (
              <Card key={tier.id} className="group relative hover:shadow-glow transition-all duration-500 overflow-hidden border-t-4" style={{ borderTopColor: tier.color }}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-900 border" style={{ color: tier.color }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">{tier.name}</CardTitle>
                  <CardDescription className="text-indigo-600 font-medium">Starts from {tier.minPoints.toLocaleString()} XP</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unlocked Benefits</div>
                    {tier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full group-hover:bg-slate-50 dark:group-hover:bg-slate-900">
                      Configure Benefits <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}