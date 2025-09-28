import React, { useState, useEffect, useCallback, Suspense } from 'react';
//import { LandingPage } from './pages/LandingPage';
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
//import { FormPage } from './pages/FormPage';
const FormPage = React.lazy(() => import('./pages/FormPage'));
//import { ResultsPage } from './pages/ResultsPage';
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
import { getAssessments, getUser } from './services/api';
import type { Assessment, User, PagedAssessments } from './types';

type View = 'landing' | 'form' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [pagedAssessments, setPagedAssessments] = useState<PagedAssessments | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchAssessments = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    try {
      const data = await getAssessments(page);
      setPagedAssessments(data);
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
      // Optionally, show an error to the user
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userData] = await Promise.all([
          getUser(),
          fetchAssessments(1)
        ]);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, [fetchAssessments]);

  const handleAssessmentCreated = (newAssessment: Assessment) => {
    // After creating, refresh the first page to see the new assessment
    fetchAssessments(1);
    setCurrentView('results');
  }

  const handleDownload = (assessment: Assessment) => {
    if (assessment.downloadUrl) {
      window.open(assessment.downloadUrl, '_blank');
    } else {
      alert('Download not available.');
    }
  };

  const handleNavigateToLanding = () => setCurrentView('landing');

  const commonProps = {
    user,
    onNavigateToLanding: handleNavigateToLanding,
  };

  if (currentView === 'landing') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPage 
          {...commonProps}
          assessments={pagedAssessments?.assessments || []}
          onNavigateToFormativeAssessment={() => setCurrentView('form')}
          onNavigateToJobStatus={() => setCurrentView('results')}
          onDownload={handleDownload}
        />
      </Suspense>
    );
  }

  if (currentView === 'results') {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ResultsPage
          {...commonProps}
          pagedAssessments={pagedAssessments}
          onNavigateToForm={() => setCurrentView('form')}
          onDownload={handleDownload}
          onPageChange={fetchAssessments}
          isLoading={isLoading}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPage
        {...commonProps}
        onAssessmentCreated={handleAssessmentCreated}
        existingAssessments={pagedAssessments?.assessments || []}
        onNavigateToResults={() => setCurrentView('results')}
        onDownload={handleDownload}
      />
    </Suspense>
  );
}