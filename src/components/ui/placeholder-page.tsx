import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
interface PlaceholderPageProps {
  title: string;
  category?: string;
  description?: string;
}
export function PlaceholderPage({ title, category, description }: PlaceholderPageProps) {
  const navigate = useNavigate();
  return (
    <AppLayout container>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-scale-in">
        <div className="p-8 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 floating">
          <Construction className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          {category && (
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600/80 dark:text-indigo-400/80 bg-indigo-50 dark:bg-indigo-900/10 px-3 py-1 rounded-full">
              {category}
            </span>
          )}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {description || `The ${title} module is currently under active development. This core component of the ${category || 'TechEdge Nexus'} suite will be available in the next phase.`}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate('/')}>
            Return Dashboard
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}