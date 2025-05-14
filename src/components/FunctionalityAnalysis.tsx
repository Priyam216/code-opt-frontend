
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FunctionalityAnalysisProps {
  content: string;
}

const FunctionalityAnalysis = ({ content }: FunctionalityAnalysisProps) => {
  if (!content) return null;
  
  // Process markdown content
  const sections = content.split('\n## ').map((section, index) => {
    if (index === 0) {
      // Handle the first section which includes the main title
      const titleMatch = section.match(/^# (.*?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1] : 'Analysis';
      const contentWithoutTitle = section.replace(/^# .*?\n/, '');
      return { title, content: contentWithoutTitle };
    } else {
      // Handle subsequent sections
      const titleMatch = section.match(/^(.*?)(?:\n|$)/);
      const title = titleMatch ? titleMatch[1] : 'Section';
      const content = section.replace(/^.*?\n/, '');
      return { title, content };
    }
  });
  
  return (
    <Card className="overflow-hidden border border-border bg-card/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium">Functionality Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4 overflow-auto max-h-[600px]">
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              {index === 0 ? (
                <h2 className="text-xl font-semibold text-primary">{section.title}</h2>
              ) : (
                <h3 className="text-lg font-medium text-foreground">{section.title}</h3>
              )}
              {section.content.split('\n\n').map((paragraph, pidx) => (
                <div key={`p-${pidx}`} className="space-y-2">
                  {paragraph.split('\n').map((line, lidx) => {
                    // Check if this is a list item
                    if (line.match(/^[*-] /)) {
                      return (
                        <div key={`l-${lidx}`} className="flex items-start">
                          <span className="mr-2 text-primary">•</span>
                          <p className="text-sm text-muted-foreground">{line.replace(/^[*-] /, '')}</p>
                        </div>
                      );
                    }
                    // Check if this is a code block
                    else if (line.match(/^```/)) {
                      return null; // Skip code block markers
                    }
                    // Check if this is a heading
                    else if (line.match(/^###+ /)) {
                      const level = line.match(/^(#+) /)[1].length;
                      const text = line.replace(/^#+\s+/, '');
                      return (
                        <h4 key={`h-${lidx}`} className={`text-${level === 3 ? 'md' : 'sm'} font-medium mt-2`}>
                          {text}
                        </h4>
                      );
                    }
                    // Regular paragraph text
                    else {
                      return <p key={`l-${lidx}`} className="text-sm text-muted-foreground">{line}</p>;
                    }
                  })}
                </div>
              ))}
              {index < sections.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionalityAnalysis;
