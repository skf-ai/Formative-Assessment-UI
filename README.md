# LMS Formative Assessment UI

## Project Overview

This project is a UI for managing LMS (Learning Management System) formative assessments. It allows users to create new assessments, view existing ones, and track their progress. The application is built with React and uses a component library for a modern and responsive design.

## Setup

To set up and run the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd "LMS Formative Assessment UI"
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

4.  **Build for production:**
    ```bash
    npm run build
    ```

## Application Workflow

The application follows a simple workflow:

1.  **Landing Page:** The entry point of the application, displaying a welcome message, action cards for different functionalities (e.g., creating formative assessments), and a section for recent assessment batches.
2.  **Create Assessment Page:** A form where users can configure and create new formative assessments. This page also displays a list of existing assessments.
3.  **Results Page:** Displays a paginated list of all assessment batches, allowing users to monitor their progress and download completed files.

## API Endpoints (Simulated)

The frontend interacts with a simulated backend API defined in `src/services/api.ts`. This file contains functions that mimic API calls for fetching user data, course data, assessments, and creating new assessments. For backend developers, these functions outline the expected API contracts.

### 1. `getUser()`

*   **Purpose:** Fetches the current user's information.
*   **Request:** `GET /api/user` (simulated)
*   **Response:** `User` object
    ```typescript
    interface User {
      name: string;
      email: string;
    }
    ```

### 2. `getCourse()`

*   **Purpose:** Fetches course details, including modules.
*   **Request:** `GET /api/course` (simulated)
*   **Response:** `Course` object
    ```typescript
    interface Course {
      name: string;
      modules: {
        id: string;
        name: string;
      }[];
    }
    ```

### 3. `getAssessments(page: number = 1, limit: number = 10)`

*   **Purpose:** Fetches a paginated list of assessment batches.
*   **Request:** `GET /api/assessments?page=<page_number>&limit=<limit_per_page>` (simulated)
*   **Response:** `PagedAssessments` object
    ```typescript
    interface PagedAssessments {
      assessments: Assessment[];
      currentPage: number;
      totalPages: number;
      totalAssessments: number;
    }

    interface Assessment {
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
    ```

### 4. `createAssessment(formData: FormData, existingAssessments: Assessment[])`

*   **Purpose:** Creates a new assessment batch.
*   **Request:** `POST /api/assessments` (simulated) with `FormData` in the request body.
*   **Response:** The newly created `Assessment` object.
    ```typescript
    interface FormData {
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
    ```

## Frontend-Backend Connection

Currently, the application uses in-memory mock data for all API calls. To connect to a real backend, you need to modify the `src/services/api.ts` file.

For each API function (`getUser`, `getCourse`, `getAssessments`, `createAssessment`):

1.  **Uncomment the `fetch` calls:** Replace the simulated delays and mock data returns with actual `fetch` requests to your backend endpoints.
2.  **Adjust URLs:** Update the URLs in the `fetch` calls to point to your backend API endpoints (e.g., `/api/user`, `/api/course`, `/api/assessments`).
3.  **Handle Authentication (if applicable):** If your backend requires authentication, you will need to add headers (e.g., `Authorization` token) to your `fetch` requests.
4.  **Error Handling:** Enhance the error handling to gracefully manage network issues or API errors.

**Example for `getAssessments`:**

```typescript
export const getAssessments = async (page: number = 1, limit: number = 10): Promise<PagedAssessments> => {
  const response = await fetch(`/api/assessments?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch assessments: ${response.statusText}`);
  }
  return await response.json();
};
```

By following these guidelines, backend developers can easily understand the expected API contracts, and frontend developers can seamlessly integrate with a real backend.