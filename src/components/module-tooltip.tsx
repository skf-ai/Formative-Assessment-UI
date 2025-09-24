import React from 'react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ModuleTooltipProps {
  courseName: string;
  selectedModules: string[];
  children: React.ReactNode;
}

export function ModuleTooltip({ courseName, selectedModules, children }: ModuleTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-sm">
          <div className="space-y-3">
            <div>
              <p className="font-medium text-sm">{courseName}</p>
              <p className="text-xs text-muted-foreground">
                {selectedModules.length} modules selected
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Selected Modules:</p>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {selectedModules.map((module, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs px-2 py-1"
                  >
                    {module}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}