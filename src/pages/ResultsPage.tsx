import React from 'react';
import { Button } from '../components/ui/button';
import { Header } from '../components/header';
import { PageHeader } from '../components/page-header';
import { AssessmentResults } from '../components/assessment-results';
import { Badge } from '../components/ui/badge';
import { FileText, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PagedAssessments, User, Assessment } from '../types';

interface ResultsPageProps {
  pagedAssessments: PagedAssessments | null;
  onNavigateToLanding: () => void;
  onNavigateToForm: () => void;
  onDownload: (assessment: Assessment) => void;
  user: User | null;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function ResultsPage({
  pagedAssessments,
  onNavigateToLanding,
  onNavigateToForm,
  onDownload,
  user,
  onPageChange,
  isLoading,
}: ResultsPageProps) {
  const { assessments, currentPage, totalPages, totalAssessments } = pagedAssessments || {};

  const handlePrevPage = () => {
    if (currentPage && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage && totalPages && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header sectionName="Assessment Center" user={user} onNavigateToLanding={onNavigateToLanding} />

      <PageHeader
        title="Assessment Batches"
        description="Monitor your assessment generation progress and download completed files."
      >
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm font-medium">{totalAssessments || 0} Batches</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={onNavigateToLanding}>
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button variant="default" size="sm" onClick={onNavigateToForm}>
          <FileText className="h-4 w-4 mr-2" />
          Create New Assessment
        </Button>
      </PageHeader>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">Loading...</div>
          ) : (
            <AssessmentResults
              assessments={assessments || []}
              onDownload={onDownload}
            />
          )}

          {pagedAssessments && pagedAssessments.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
