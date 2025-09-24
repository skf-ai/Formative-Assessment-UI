
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FileText, ArrowRight, Loader2, Clock } from 'lucide-react';
import type { Assessment } from '../types';

interface AssessmentOverviewProps {
  assessments: Assessment[];
  isLoading: boolean;
  onViewAllClick: () => void;
  onCreateNewClick: () => void;
}

export const AssessmentOverview: React.FC<AssessmentOverviewProps> = ({
  assessments,
  isLoading,
  onViewAllClick,
  onCreateNewClick,
}) => {
  const getStatusBadge = (status: 'processing' | 'completed' | 'failed') => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-200">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-600 border-red-200">Failed</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>A quick look at your most recent assessment activities.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onViewAllClick}>
          View All
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
            <p className="ml-3 text-muted-foreground">Loading assessments...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No assessments yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new formative assessment.
            </p>
            <Button className="mt-4" onClick={onCreateNewClick}>
              Create Assessment
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment Name</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.assessmentName}</TableCell>
                  <TableCell>{assessment.courseName}</TableCell>
                  <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
