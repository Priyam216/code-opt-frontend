
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CodeEditor from './CodeEditor';

interface FunctionalityAnalysisProps {
  content: string;
}

const FunctionalityAnalysis = ({ content }: FunctionalityAnalysisProps) => {
  if (!content) return null;
  
  return (
    <Card className="overflow-hidden border border-border bg-card/50 transition-all duration-300 hover:shadow-md">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium">Functionality Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] animate-fade-in">
          <CodeEditor
            code={content}
            language="markdown"
            editable={false}
            title=""
            className="h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionalityAnalysis;
