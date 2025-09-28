import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Header } from '../components/header';
import { AssessmentResults } from '../components/assessment-results';
import type { Assessment, User } from '../types';
import { BookOpen, GraduationCap, Factory, HardDrive, ArrowRight, List } from 'lucide-react';

interface LandingPageProps {
  assessments: Assessment[];
  onNavigateToFormativeAssessment: () => void;
  onNavigateToJobStatus: () => void;
  onDownload: (assessment: Assessment) => void;
  onNavigateToLanding: () => void;
  user: User | null;
}

const actionCards = [
  {
    id: 'formative',
    emoji: '📙',
    title: 'Create Formative Assessments',
    description: 'Create a request for Formative Assessment Generation',
    icon: BookOpen,
    action: 'formative'
  },
  {
    id: 'summative',
    emoji: '📚',
    title: 'Create Summative Assessment',
    description: 'Create a request for Summative Assessment Creation',
    icon: GraduationCap,
    action: 'summative'
  },
  {
    id: 'textbook',
    emoji: '🏭',
    title: 'Build a Text Book',
    description: 'Build a Text Book Based on a Custom Structure for a course (Advanced)',
    icon: Factory,
    action: 'textbook'
  },
  {
    id: 'embed',
    emoji: '💽',
    title: 'Embed Course Material',
    description: 'Embed Course Material in a Vector Database so that they can be referenced when needed by AI models.',
    icon: HardDrive,
    action: 'embed'
  }
];

export default function LandingPage({ 
  assessments, 
  onNavigateToFormativeAssessment, 
  onNavigateToJobStatus,
  onDownload, 
  onNavigateToLanding,
  user
}: LandingPageProps) {
  const handleActionClick = (action: string) => {
    if (action === 'formative') {
      onNavigateToFormativeAssessment();
    } else {
      // For now, show coming soon for other actions
      alert(`${action} functionality coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header sectionName="Siddhanta AI Tools" user={user} onNavigateToLanding={onNavigateToLanding} />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="text-center space-y-6 py-12">
            {/* Logo */}
            <div className="flex justify-center mb-8" onClick={onNavigateToLanding} style={{ cursor: 'pointer' }}>
              <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg">
                <span className="text-white font-bold text-3xl">SA</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground" onClick={onNavigateToLanding} style={{ cursor: 'pointer' }}>
                Welcome to Siddhanta AI Tools
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                This is a set of AI powered tools that allows scholars and operators to create content for courses in a seamless and scaleable manner
              </p>
            </div>
            
            <div className="pt-8 space-y-6">
              <h2 className="text-2xl font-semibold text-foreground">
                What would you like to do today?
              </h2>
              
              {/* View Submissions Button */}
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={onNavigateToJobStatus}
                  className="flex items-center space-x-2 hover:border-primary hover:text-primary"
                >
                  <List className="h-4 w-4" />
                  <span>View Submissions</span>
                  {assessments.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {assessments.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCards.map((card) => (
              <Card 
                key={card.id} 
                className="hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer group"
                onClick={() => handleActionClick(card.action)}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl flex-shrink-0">
                        {card.emoji}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:border-primary group-hover:text-primary"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          handleActionClick(card.action);
                        }}
                      >
                        <card.icon className="h-4 w-4 mr-2" />
                        Get Started
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Assessment Results Section */}
          {assessments.length > 0 && (
            <div className="space-y-6">
              <div className="border-t border-border pt-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Recent Assessment Batches
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Your recent assessment generation requests and downloads
                  </p>
                </div>
                
                <AssessmentResults 
                  assessments={assessments}
                  onDownload={onDownload}
                />
              </div>
            </div>
          )}

          {/* Quick Stats or Getting Started Tips */}
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <h3 className="text-lg font-semibold mb-4">Getting Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <p className="text-muted-foreground">Choose your tool from the options above</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <p className="text-muted-foreground">Configure your requirements and preferences</p>
              </div>
              <div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <p className="text-muted-foreground">Let AI generate and download your content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}