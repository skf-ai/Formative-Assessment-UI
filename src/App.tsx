import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { FormPage } from './pages/FormPage';
import { ResultsPage } from './pages/ResultsPage';
import { getAssessments, getUser } from './services/api';
import type { Assessment, User, PagedAssessments } from './types';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import './styles/globals.css';

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
      toast.error("Failed to fetch assessments.");
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
        toast.error("Failed to fetch initial data.");
      }
    };
    fetchInitialData();
  }, [fetchAssessments]);

  const handleAssessmentCreated = (newAssessment: Assessment) => {
    // After creating, refresh the first page to see the new assessment
    fetchAssessments(1);
    setCurrentView('results');
    toast.success("Assessment created successfully!");
  }

  const handleDownload = (assessment: Assessment) => {
    if (assessment.downloadUrl) {
      window.open(assessment.downloadUrl, '_blank');
      toast.success("Downloading assessment...");
    } else {
      toast.error('Download not available.');
    }
  };

  const handleNavigateToLanding = () => setCurrentView('landing');

  const commonProps = {
    user,
    onNavigateToLanding: handleNavigateToLanding,
  };

  return (
    <>
      <Toaster position="top-right" closeButton />
      {currentView === 'landing' && (
        <LandingPage 
          {...commonProps}
          assessments={pagedAssessments?.assessments || []}
          onNavigateToFormativeAssessment={() => setCurrentView('form')}
          onNavigateToJobStatus={() => setCurrentView('results')}
          onDownload={handleDownload}
        />
      )}
      {currentView === 'results' && (
        <ResultsPage
          {...commonProps}
          pagedAssessments={pagedAssessments}
          onNavigateToForm={() => setCurrentView('form')}
          onDownload={handleDownload}
          onPageChange={fetchAssessments}
          isLoading={isLoading}
        />
      )}
      {currentView === 'form' && (
        <FormPage
          {...commonProps}
          onAssessmentCreated={handleAssessmentCreated}
          existingAssessments={pagedAssessments?.assessments || []}
          onNavigateToResults={() => setCurrentView('results')}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}