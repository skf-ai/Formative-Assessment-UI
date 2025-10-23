import React, { useState, useMemo, useCallback, memo } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface CourseModuleSelectorProps {
  selectedCourse: string;
  selectedModules: string[];
  onCourseChange: (course: string) => void;
  onModulesChange: (modules: string[]) => void;
}

const courses = [
  { id: 'cs101', name: 'Introduction to Computer Science' },
  { id: 'math201', name: 'Calculus II' },
  { id: 'phys101', name: 'Physics Fundamentals' },
  { id: 'eng102', name: 'Technical Writing' },
  { id: 'bus301', name: 'Business Analytics' },
];

const modulesByCourse: Record<string, string[]> = {
  'cs101': [
    'Programming Basics',
    'Data Structures',
    'Algorithms Introduction',
    'Object-Oriented Programming',
    'Database Concepts',
    'Web Development Basics'
  ],
  'math201': [
    'Limits and Continuity',
    'Derivatives',
    'Integration Techniques',
    'Applications of Integration',
    'Sequences and Series',
    'Differential Equations'
  ],
  'phys101': [
    'Mechanics',
    'Thermodynamics',
    'Waves and Sound',
    'Electricity and Magnetism',
    'Optics',
    'Modern Physics'
  ],
  'eng102': [
    'Writing Process',
    'Research Methods',
    'Documentation Standards',
    'Technical Reports',
    'Presentations',
    'Professional Communication'
  ],
  'bus301': [
    'Data Analysis Fundamentals',
    'Statistical Methods',
    'Business Intelligence',
    'Predictive Analytics',
    'Dashboard Design',
    'Decision Making'
  ]
};

// Memoized: Only re-render badge when its data changes
const ModuleBadge = memo<{ module: string; onRemove: (module: string) => void }>(
  ({ module, onRemove }) => (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 px-3 py-1"
    >
      {module}
      <button
        type="button"
        onClick={() => onRemove(module)}
        className="ml-1 hover:text-destructive"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
);

ModuleBadge.displayName = 'ModuleBadge';

// Memoized: Prevent unnecessary re-renders
export const CourseModuleSelector = memo<CourseModuleSelectorProps>(({
  selectedCourse,
  selectedModules,
  onCourseChange,
  onModulesChange
}) => {
  const [moduleSelectOpen, setModuleSelectOpen] = useState(false);
  
  // Memoized: Only recalculate when dependencies change
  const availableModules = useMemo(
    () => selectedCourse ? modulesByCourse[selectedCourse] || [] : [],
    [selectedCourse]
  );

  // Memoized: Only recalculate when dependencies change
  const unselectedModules = useMemo(
    () => availableModules.filter(module => !selectedModules.includes(module)),
    [availableModules, selectedModules]
  );

  // Memoized: Prevent function recreation
  const handleCourseChange = useCallback((courseId: string) => {
    onCourseChange(courseId);
    onModulesChange([]);
  }, [onCourseChange, onModulesChange]);

  // Memoized: Prevent function recreation
  const handleModuleSelect = useCallback((module: string) => {
    if (!selectedModules.includes(module)) {
      onModulesChange([...selectedModules, module]);
    }
    setModuleSelectOpen(false);
  }, [selectedModules, onModulesChange]);

  // Memoized: Prevent function recreation
  const handleModuleRemove = useCallback((moduleToRemove: string) => {
    onModulesChange(selectedModules.filter(module => module !== moduleToRemove));
  }, [selectedModules, onModulesChange]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>
          Course Name <span className="text-destructive">*</span>
        </Label>
        <Select
          value={selectedCourse}
          onValueChange={handleCourseChange}
          required
        >
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCourse && (
        <div className="space-y-3">
          <Label>
            Course Modules <span className="text-destructive">*</span>
          </Label>
          
          {selectedModules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {/* Optimized: Using memoized badge component */}
              {selectedModules.map((module) => (
                <ModuleBadge
                  key={module}
                  module={module}
                  onRemove={handleModuleRemove}
                />
              ))}
            </div>
          )}

          <Select
            open={moduleSelectOpen}
            onOpenChange={setModuleSelectOpen}
            onValueChange={handleModuleSelect}
            value=""
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Add modules..." />
            </SelectTrigger>
            <SelectContent>
              {unselectedModules.length > 0 ? (
                unselectedModules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {module}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  {selectedModules.length === availableModules.length 
                    ? 'All modules selected' 
                    : 'No modules available'
                  }
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <p className="text-sm text-muted-foreground">
            Selected {selectedModules.length} of {availableModules.length} available modules
          </p>
        </div>
      )}
    </div>
  );
});

CourseModuleSelector.displayName = 'CourseModuleSelector';
