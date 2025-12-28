import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, Search, Plus, Mail, Phone, MapPin, Settings, MessageSquare } from 'lucide-react';
import { useFaq } from '@/lib/api-hooks';
export function HelpFAQPage() {
  const { data, isLoading } = useFaq();
  const [search, setSearch] = useState('');
  const faqs = (data?.items || []).filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AppLayout container>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help Center & FAQ</h1>
            <p className="text-muted-foreground">Manage administrative support content and knowledge base items.</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Add FAQ Item
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Card className="shadow-soft">
              <CardHeader className="pb-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle className="text-lg">FAQ Content Manager</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search questions..." className="pl-8 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="space-y-4 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="h-12 bg-muted rounded-lg" />)}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border-b-slate-100 last:border-0">
                        <AccordionTrigger className="hover:no-underline hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                          <div className="flex items-center gap-3 text-left">
                            <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">{faq.category}</Badge>
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 py-3 text-muted-foreground leading-relaxed">
                          {faq.answer}
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            <Button variant="ghost" size="sm" className="h-8">Edit Content</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-destructive">Remove</Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-sm">Contact Information</CardTitle>
                <CardDescription>Details displayed in Member App help section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  <div className="text-sm font-medium">support@nexus-crm.com</div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <Phone className="h-4 w-4 text-amber-600" />
                  <div className="text-sm font-medium">+62 (21) 5098-2122</div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <div className="text-sm font-medium">Nexus Tower, Level 42</div>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Settings className="mr-2 h-4 w-4" /> Edit Details
                </Button>
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-indigo-600 text-white border-none">
              <CardHeader>
                <CardTitle className="text-sm">Live Support Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs opacity-80">Active Queries</span>
                  <Badge className="bg-white/20 text-white border-none">12 New</Badge>
                </div>
                <div className="text-3xl font-bold">4.2m</div>
                <div className="text-xs opacity-70">Average Response Time</div>
                <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 border-none text-white shadow-none">
                  <MessageSquare className="mr-2 h-4 w-4" /> View Chat Queue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}