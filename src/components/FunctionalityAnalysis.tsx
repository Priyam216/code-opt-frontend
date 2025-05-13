
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FunctionalityAnalysisProps {
  content: string;
}

const FunctionalityAnalysis = ({ content }: FunctionalityAnalysisProps) => {
  if (!content) return null;
  
  return (
    <Card className="overflow-hidden border border-border bg-card/50">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium">Functionality Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4 prose prose-sm prose-invert max-w-none">
        <div className="h-[300px] overflow-auto">
          <ReactMarkdown
            className="markdown-content"
            remarkPlugins={[remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunctionalityAnalysis;
