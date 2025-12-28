import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Tag, Palette, Hash, Filter, MoreVertical, PieChart } from 'lucide-react';
import { useInterests } from '@/lib/api-hooks';
export function InterestsPage() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useInterests();
  const interests = data?.items || [];
  const filtered = interests.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AppLayout container>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Interest Tags</h1>
            <p className="text-muted-foreground">Manage and categorize member preferences for better personalization.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create New Tag
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="md:col-span-1 shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Tag Builder</CardTitle>
              <CardDescription>Quick create an interest tag</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tagName">Tag Name</Label>
                <Input id="tagName" placeholder="e.g., Hiking" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagCat">Category</Label>
                <Input id="tagCat" placeholder="Lifestyle" />
              </div>
              <div className="space-y-2">
                <Label>Color Identity</Label>
                <div className="flex gap-2">
                  {['#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#EC4899'].map(c => (
                    <div key={c} className="h-6 w-6 rounded-full cursor-pointer border-2 border-transparent hover:border-slate-300" style={{ backgroundColor: c }} />
                  ))}
                  <div className="h-6 w-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer">
                    <Plus className="h-3 w-3 text-slate-400" />
                  </div>
                </div>
              </div>
              <Button className="w-full">Create Tag</Button>
            </CardContent>
          </Card>
          <div className="md:col-span-3 space-y-6">
            <Card className="shadow-soft">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search tags or categories..." 
                      className="pl-9" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><PieChart className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map(i => <Badge key={i} className="h-8 w-20 animate-pulse bg-muted/20" />)
                  ) : filtered.length === 0 ? (
                    <div className="w-full text-center py-10 text-muted-foreground">No tags found.</div>
                  ) : (
                    filtered.map((interest) => (
                      <div key={interest.id} className="group relative">
                        <Badge 
                          style={{ backgroundColor: `${interest.color}15`, color: interest.color, borderColor: `${interest.color}30` }}
                          className="px-4 py-2 text-sm font-semibold border-2 hover:brightness-95 cursor-default flex items-center gap-2"
                        >
                          <Hash className="h-3.5 w-3.5" />
                          {interest.name}
                          <span className="ml-1 opacity-60 text-xs font-mono">({interest.count})</span>
                        </Badge>
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" className="h-5 w-5 rounded-full shadow-lg">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{interests.length}</div>
                      <div className="text-xs text-indigo-700/70 dark:text-indigo-300">Total Unique Interests</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-100 dark:bg-amber-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Palette className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">8</div>
                      <div className="text-xs text-amber-700/70 dark:text-amber-300">Interest Categories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}