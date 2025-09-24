import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Header } from '../components/header';
import { PageHeader } from '../components/page-header';
import { CourseModuleSelector } from '../components/course-module-selector';
import { AssessmentResults } from '../components/assessment-results';
import { FileText, RotateCcw, List, Home } from 'lucide-react';
import { createAssessment } from '../services/api';
import type { Assessment, FormData, User } from '../types';

interface FormPageProps {
  onAssessmentCreated: (assessment: Assessment) => void;
  existingAssessments: Assessment[];
  onNavigateToLanding: () => void;
  onNavigateToResults: () => void;
  user: User | null;
  onDownload: (assessment: Assessment) => void;
}

const initialFormData: FormData = {
  name: '',
  batchName: '',
  testCase: '',
  questionFormat: '',
  questionTone: '',
  difficultyLevel: [5],
  outputFormat: '',
  language: '',
  courseName: '',
  selectedModules: [],
  consolidatedOutput: false,
};

export function FormPage({
  onAssessmentCreated,
  existingAssessments,
  onNavigateToLanding,
  onNavigateToResults,
  user,
  onDownload,
}: FormPageProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newAssessment = await createAssessment(formData, existingAssessments);
      onAssessmentCreated(newAssessment);
      resetForm();
    } catch (error) {
      console.error("Failed to create assessment:", error);
      // Here you could show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header sectionName="Assessment Center" user={user} onNavigateToLanding={onNavigateToLanding} />
      
      <PageHeader
        title="Create Formative Assessment"
        description="Use the form below to create a formative assessment for a course by selecting modules from your course content."
        icon={FileText}
      >
        <Button variant="outline" size="sm" onClick={onNavigateToLanding}>
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
        <Button variant="outline" size="sm" onClick={onNavigateToResults}>
          <List className="h-4 w-4 mr-2" />
          View Submissions
        </Button>
        <Button variant="outline" size="sm" onClick={resetForm}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Form
        </Button>
      </PageHeader>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Assessment Name <span className="text-destructive">*</span></Label>
                        <Input id="name" placeholder="Enter assessment name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="testcase">Test Case <span className="text-destructive">*</span></Label>
                        <Input id="testcase" placeholder="Enter a descriptive case name" value={formData.testCase} onChange={(e) => handleInputChange('testCase', e.target.value)} required />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Assessment Configuration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Assessment Configuration</h3>
                    <div className="space-y-2 mb-6">
                      <Label htmlFor="batchName">Batch Name <span className="text-destructive">*</span></Label>
                      <Input id="batchName" placeholder="e.g., Spring2024_Module1" value={formData.batchName} onChange={(e) => handleInputChange('batchName', e.target.value)} required className="max-w-md" />
                      <p className="text-sm text-muted-foreground">Choose a descriptive name to identify this assessment batch.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Question Format <span className="text-destructive">*</span></Label>
                        <Select value={formData.questionFormat} onValueChange={(value) => handleInputChange('questionFormat', value)} required>
                          <SelectTrigger><SelectValue placeholder="Select question format" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MultipleChoice">Multiple Choice</SelectItem>
                            <SelectItem value="FillInTheBlanks">Fill in the Blanks</SelectItem>
                            <SelectItem value="MatchTheFollowing">Match the Following</SelectItem>
                            <SelectItem value="TrueFalse">True/False</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Question Tone <span className="text-destructive">*</span></Label>
                        <Select value={formData.questionTone} onValueChange={(value) => handleInputChange('questionTone', value)} required>
                          <SelectTrigger><SelectValue placeholder="Select question tone" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="conversational">Conversational</SelectItem>
                            <SelectItem value="direct">Direct</SelectItem>
                            <SelectItem value="indirect">Indirect</SelectItem>
                            <SelectItem value="scenario">Scenario</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Course and Module Selection */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Course and Module Selection</h3>
                    <CourseModuleSelector
                      selectedCourse={formData.courseName}
                      selectedModules={formData.selectedModules}
                      onCourseChange={(course) => handleInputChange('courseName', course)}
                      onModulesChange={(modules) => handleInputChange('selectedModules', modules)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Output Settings */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Output Settings</h3>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>Difficulty Level <span className="text-destructive">*</span></Label>
                        <div className="px-2 max-w-md">
                          <Slider value={formData.difficultyLevel} onValueChange={(value) => handleInputChange('difficultyLevel', value)} max={10} min={1} step={1} />
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>Easy (1)</span>
                            <span className="font-medium">Level: {formData.difficultyLevel[0]}</span>
                            <span>Hard (10)</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Output Format <span className="text-destructive">*</span></Label>
                          <Select value={formData.outputFormat} onValueChange={(value) => handleInputChange('outputFormat', value)} required>
                            <SelectTrigger><SelectValue placeholder="Select output format" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GIFT">GIFT</SelectItem>
                              <SelectItem value="CSV">CSV</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Language</Label>
                          <div className="flex items-center space-x-2">
                            <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                              <SelectTrigger className="flex-1"><SelectValue placeholder="Select language" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Portuguese">Portuguese</SelectItem>
                              </SelectContent>
                            </Select>
                            {formData.language && (
                              <Button type="button" variant="outline" size="sm" onClick={() => handleInputChange('language', '')} className="whitespace-nowrap">Clear</Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="consolidatedOutput">Output Delivery</Label>
                        <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                          <Switch id="consolidatedOutput" checked={formData.consolidatedOutput} onCheckedChange={(checked) => handleInputChange('consolidatedOutput', checked)} />
                          <div className="space-y-1">
                            <Label htmlFor="consolidatedOutput" className="cursor-pointer">Consolidated Output (Zip File)</Label>
                            <p className="text-sm text-muted-foreground">
                              {formData.consolidatedOutput ? 'All assessment files will be packaged in a single zip file' : 'Assessment files will be provided separately'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" size="lg" onClick={onNavigateToLanding} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" size="lg" className="min-w-[160px]" disabled={isSubmitting}>
                      {isSubmitting ? 'Creating...' : <><FileText className="h-4 w-4 mr-2" /> Create Assessment</>}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-center mb-8">Existing Assessments</h2>
            <AssessmentResults assessments={existingAssessments} onDownload={onDownload} />
          </div>
        </div>
      </div>
    </div>
  );
}