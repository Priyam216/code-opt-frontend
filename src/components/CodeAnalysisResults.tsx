
import React from 'react';
import { AlertTriangle } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Issue {
  title: string;
  location: string;
  reason: string;
  suggestion: string;
}

interface AnalysisCategory {
  name: string;
  hasIssues: boolean;
  issues: Issue[];
}

interface CodeAnalysisResultsProps {
  results: {
    categories: AnalysisCategory[];
  } | null;
}

const CodeAnalysisResults: React.FC<CodeAnalysisResultsProps> = ({ results }) => {
  if (!results) {
    return <div className="p-4">No analysis results available</div>;
  }

  const { categories } = results;
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Code Analysis Results</h2>
        <p className="text-muted-foreground">
          We've analyzed your code and identified potential optimization opportunities.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <Card 
            key={index} 
            className={`border ${category.hasIssues ? 'border-amber-700/30 bg-amber-950/10' : 'border-border'} transition-all duration-300`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {category.hasIssues && (
                    <AlertTriangle size={16} className="text-amber-500" />
                  )}
                  {category.name}
                </CardTitle>
                {category.hasIssues && (
                  <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">
                    {category.issues.length} {category.issues.length === 1 ? 'issue' : 'issues'}
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                {category.hasIssues 
                  ? `${category.issues.length} optimization ${category.issues.length === 1 ? 'opportunity' : 'opportunities'} found`
                  : 'No optimization opportunities found'}
              </CardDescription>
            </CardHeader>
            {category.hasIssues && (
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.issues.map((issue, issueIndex) => (
                    <AccordionItem key={issueIndex} value={`issue-${issueIndex}`}>
                      <AccordionTrigger className="text-sm">{issue.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="font-medium text-xs text-muted-foreground mb-1">CODE LOCATION</div>
                            <div className="bg-secondary/50 px-3 py-1 rounded-sm">{issue.location}</div>
                          </div>
                          <div>
                            <div className="font-medium text-xs text-muted-foreground mb-1">REASON</div>
                            <p>{issue.reason}</p>
                          </div>
                          <div>
                            <div className="font-medium text-xs text-muted-foreground mb-1">SUGGESTION</div>
                            <p className="text-primary">{issue.suggestion}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CodeAnalysisResults;
