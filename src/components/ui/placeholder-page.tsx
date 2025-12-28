import React from 'react';
import { Construction } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <AppLayout container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="p-6 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
          <Construction className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground max-w-md">
          This module is currently under development. Our team is working hard to bring you the best CRM experience.
        </p>
      </div>
    </AppLayout>
  );
}