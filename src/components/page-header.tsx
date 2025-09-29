import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, children }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-background">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
                {description && (
                  <p className="text-muted-foreground mt-1 max-w-2xl hidden sm:block">{description}</p>
                )}
              </div>
            </div>
          </div>
          {children && (
            <div className="flex items-center space-x-2 flex-shrink-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}