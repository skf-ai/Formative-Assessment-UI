export interface Assessment {
  id: string;
  batchName: string;
  batchCode: string;
  assessmentName: string;
  questionFormat: string;
  difficultyLevel: number;
  outputFormat: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  consolidatedOutput: boolean;
  courseName: string;
  selectedModules: string[];
}


export interface Course {
  name: string;
  modules: {
    id: string;
    name: string;
  }[];
}

export interface FormData {
  name: string;
  batchName: string;
  testCase: string;
  questionFormat: string;
  questionTone: string;
  difficultyLevel: number[];
  outputFormat: string;
  language: string;
  courseName: string;
  selectedModules: string[];
  consolidatedOutput: boolean;
}

export interface User {
  name: string;
  email: string;
}

export interface PagedAssessments {
  assessments: Assessment[];
  currentPage: number;
  totalPages: number;
  totalAssessments: number;
}