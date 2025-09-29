import type { Assessment, Course, FormData, PagedAssessments, User } from '../types';
import { mockCourse } from '../mockData';

let assessments: Assessment[] = [];

const mockUser: User = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@skf.com',
};

/**
 * Simulates fetching user data from an API.
 */
export const getUser = async (): Promise<User> => {
  // In a real app, you would make a fetch request to your user endpoint
  // const response = await fetch('/api/user');
  // if (!response.ok) throw new Error('Failed to fetch user');
  // return await response.json();
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockUser;
};


/**
 * Simulates fetching course data from an API.
 */
export const getCourse = async (): Promise<Course> => {
  // const response = await fetch('/api/course');
  // if (!response.ok) throw new Error('Failed to fetch course');
  // return await response.json();
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCourse;
};

/**
 * Simulates fetching assessments with pagination.
 */
export const getAssessments = async (page: number = 1, limit: number = 10): Promise<PagedAssessments> => {
  // const response = await fetch(`/api/assessments?page=${page}&limit=${limit}`);
  // if (!response.ok) throw new Error('Failed to fetch assessments');
  // return await response.json();

  await new Promise(resolve => setTimeout(resolve, 500));
  
  const start = (page - 1) * limit;
  const end = page * limit;
  const paginatedAssessments = assessments.slice(start, end);
  const totalPages = Math.ceil(assessments.length / limit);


  return {
    assessments: paginatedAssessments,
    currentPage: page,
    totalPages,
    totalAssessments: assessments.length,
  };
};

/**
 * Generates a unique batch code. In a real app, this would likely be done on the backend.
 */
const generateBatchCode = (batchName: string, existingAssessments: Assessment[]): string => {
  const baseCode = batchName
    .replace(/\s+/g, '')
    .toUpperCase()
    .substring(0, 8);
  
  const timestamp = Date.now().toString().slice(-4);
  let batchCode = `${baseCode}_${timestamp}`;
  
  // Ensure uniqueness
  let counter = 1;
  while (existingAssessments.some(assessment => assessment.batchCode === batchCode)) {
    batchCode = `${baseCode}_${timestamp}_${counter}`;
    counter++;
  }
  
  return batchCode;
};

/**
 * Simulates creating a new assessment and storing it.
 */
export const createAssessment = async (formData: FormData, existingAssessments: Assessment[]): Promise<Assessment> => {
  // const response = await fetch('/api/assessments', { 
  //   method: 'POST', 
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(formData) 
  // });
  // if (!response.ok) throw new Error('Failed to create assessment');
  // return await response.json();

  await new Promise(resolve => setTimeout(resolve, 1000));

  const newAssessment: Assessment = {
    id: Date.now().toString(),
    batchName: formData.batchName,
    batchCode: generateBatchCode(formData.batchName, existingAssessments),
    assessmentName: formData.name,
    questionFormat: formData.questionFormat,
    difficultyLevel: formData.difficultyLevel[0],
    outputFormat: formData.outputFormat,
    status: 'processing',
    progress: Math.floor(Math.random() * 30) + 10, // Start with some initial progress
    createdAt: new Date(),
    consolidatedOutput: formData.consolidatedOutput,
    courseName: formData.courseName,
    selectedModules: formData.selectedModules,
    // Simulate a download URL that would be provided by the backend
    downloadUrl: `https://example.com/downloads/${Date.now().toString()}.zip`
  };

  assessments.unshift(newAssessment);

  return newAssessment;
};