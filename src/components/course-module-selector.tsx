import React, { useState } from 'react';
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

// Mock data - in a real app, this would come from an API
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

export function CourseModuleSelector({
  selectedCourse,
  selectedModules,
  onCourseChange,
  onModulesChange
}: CourseModuleSelectorProps) {
  const [moduleSelectOpen, setModuleSelectOpen] = useState(false);
  
  const availableModules = selectedCourse ? modulesByCourse[selectedCourse] || [] : [];
  const unselectedModules = availableModules.filter(module => !selectedModules.includes(module));

  const handleCourseChange = (courseId: string) => {
    onCourseChange(courseId);
    // Clear selected modules when course changes
    onModulesChange([]);
  };

  const handleModuleSelect = (module: string) => {
    if (!selectedModules.includes(module)) {
      onModulesChange([...selectedModules, module]);
    }
    setModuleSelectOpen(false);
  };

  const handleModuleRemove = (moduleToRemove: string) => {
    onModulesChange(selectedModules.filter(module => module !== moduleToRemove));
  };

  return (
    <div className="space-y-6">
      {/* Course Selection */}
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

      {/* Module Selection */}
      {selectedCourse && (
        <div className="space-y-3">
          <Label>
            Course Modules <span className="text-destructive">*</span>
          </Label>
          
          {/* Selected Modules */}
          {selectedModules.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedModules.map((module) => (
                <Badge
                  key={module}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {module}
                  <button
                    type="button"
                    onClick={() => handleModuleRemove(module)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Module Selector */}
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
}