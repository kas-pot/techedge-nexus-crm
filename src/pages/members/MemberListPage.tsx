import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_MEMBERS } from '@shared/mock-data';
import { Search, Filter, MoreVertical, Download } from 'lucide-react';
export function MemberListPage() {
  return (
    <AppLayout container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Member Management</h1>
            <p className="text-muted-foreground">View and manage your organization's members.</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by name, ID or email..." className="pl-8" />
                </div>
                <Button variant="ghost" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="px-3 py-1">Total: 5,050</Badge>
                <Badge variant="outline" className="px-3 py-1 text-emerald-600 bg-emerald-50">Active: 4,892</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Member Name</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MEMBERS.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-mono text-xs">{member.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{member.name}</span>
                          <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            member.tier === 'Gold' ? "bg-amber-100 text-amber-700" :
                            member.tier === 'Silver' ? "bg-slate-100 text-slate-700" :
                            "bg-orange-100 text-orange-700"
                          }
                        >
                          {member.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.points.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          {member.status}
                        </div>
                      </TableCell>
                      <TableCell>{member.joinedDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">Showing 1-25 of 5,050 members</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}