import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { FormPage } from './pages/FormPage';
import { ResultsPage } from './pages/ResultsPage';
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
      <LandingPage 
        {...commonProps}
        assessments={pagedAssessments?.assessments || []}
        onNavigateToFormativeAssessment={() => setCurrentView('form')}
        onNavigateToJobStatus={() => setCurrentView('results')}
        onDownload={handleDownload}
      />
    );
  }

  if (currentView === 'results') {
    return (
      <ResultsPage
        {...commonProps}
        pagedAssessments={pagedAssessments}
        onNavigateToForm={() => setCurrentView('form')}
        onDownload={handleDownload}
        onPageChange={fetchAssessments}
        isLoading={isLoading}
      />
    );
  }

  return (
    <FormPage
      {...commonProps}
      onAssessmentCreated={handleAssessmentCreated}
      existingAssessments={pagedAssessments?.assessments || []}
      onNavigateToResults={() => setCurrentView('results')}
      onDownload={handleDownload}
    />
  );
}