import React, { memo } from 'react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ModuleTooltipProps {
  courseName: string;
  selectedModules: string[];
  children: React.ReactNode;
}

// Memoized badge component for individual modules
const ModuleBadge = memo<{ module: string; index: number }>(({ module }) => (
  <Badge variant="secondary" className="text-xs px-2 py-1">
    {module}
  </Badge>
));

ModuleBadge.displayName = 'ModuleBadge';

// Memoized main component
export const ModuleTooltip = memo<ModuleTooltipProps>(
  ({ courseName, selectedModules, children }) => {
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
                    <ModuleBadge key={index} module={module} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

ModuleTooltip.displayName = 'ModuleTooltip';
