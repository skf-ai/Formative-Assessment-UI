import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from './ui/alert';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Info
} from 'lucide-react';
import { ModuleTooltip } from './module-tooltip';

import type { Assessment } from '../types';

interface AssessmentResultsProps {
  assessments: Assessment[];
  onDownload: (assessment: Assessment) => void;
}

export function AssessmentResults({ 
  assessments, 
  onDownload 
}: AssessmentResultsProps) {
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Simulate processing for items that are in processing state
    const processingAssessments = assessments.filter(a => a.status === 'processing');
    
    processingAssessments.forEach(assessment => {
      if (!processingItems.has(assessment.id)) {
        setProcessingItems(prev => new Set([...prev, assessment.id]));
        
        // Simulate processing completion after 10-15 seconds
        const processingTime = 10000 + Math.random() * 5000;
        setTimeout(() => {
          setProcessingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(assessment.id);
            return newSet;
          });
          
          // Update assessment status (this would normally come from a parent component)
          assessment.status = 'completed';
          assessment.progress = 100;
          assessment.completedAt = new Date();
          assessment.downloadUrl = `/downloads/${assessment.id}.${assessment.outputFormat.toLowerCase()}`;
        }, processingTime);
      }
    });
  }, [assessments, processingItems]);

  const getStatusBadge = (assessment: Assessment) => {
    switch (assessment.status) {
      case 'processing':
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="text-red-600 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <Alert className="m-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          The processing of assessments is simulated. In a real application, this would be handled by a backend service.
        </AlertDescription>
      </Alert>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Name</TableHead>
              <TableHead>Batch Code</TableHead>
              <TableHead>Assessment Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Output</TableHead>
              <TableHead>Consolidated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-3">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No assessments created yet.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">
                    {assessment.batchName}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <Badge variant="outline" className="font-mono">
                      {assessment.batchCode}
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.assessmentName}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <ModuleTooltip 
                      courseName={assessment.courseName}
                      selectedModules={assessment.selectedModules}
                    >
                      <div className="space-y-1 cursor-help">
                        <div className="font-medium text-sm">{assessment.courseName}</div>
                        <div className="text-xs text-muted-foreground">
                          {assessment.selectedModules.length} modules
                        </div>
                      </div>
                    </ModuleTooltip>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {assessment.questionFormat}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      Level {assessment.difficultyLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>{assessment.outputFormat}</TableCell>
                  <TableCell>
                    <Badge variant={assessment.consolidatedOutput ? "default" : "outline"}>
                      {assessment.consolidatedOutput ? "Zip" : "Separate"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(assessment)}</TableCell>
                  <TableCell>
                    {assessment.status === 'processing' ? (
                      <div className="flex items-center space-x-2">
                        <Progress value={assessment.progress} className="w-20" />
                        <span className="text-xs text-muted-foreground">
                          {assessment.progress}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {assessment.status === 'completed' ? '100%' : 'Failed'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(assessment.createdAt)}
                  </TableCell>
                  <TableCell>
                    {assessment.status === 'completed' && assessment.downloadUrl ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDownload(assessment)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    ) : assessment.status === 'processing' ? (
                      <Button size="sm" variant="ghost" disabled>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" disabled>
                        Unavailable
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}