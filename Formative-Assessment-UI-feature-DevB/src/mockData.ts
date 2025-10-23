import type { Course } from './types';

export const mockCourse: Course = {
  name: 'Introduction to Modern Web Development',
  modules: [
    { id: 'module-1', name: 'Module 1: The Basics of HTML & CSS' },
    { id: 'module-2', name: 'Module 2: JavaScript Fundamentals' },
    { id: 'module-3', name: 'Module 3: Introduction to React' },
    { id: 'module-4', name: 'Module 4: Advanced State Management' },
    { id: 'module-5', name: 'Module 5: Backend Integration' },
  ],
};
