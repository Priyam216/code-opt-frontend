
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface OptimizationImprovementSummaryProps {
  content: string;
}

const OptimizationImprovementSummary: React.FC<OptimizationImprovementSummaryProps> = ({ content }) => {
  return (
    <Card>
      <CardContent className="pt-6 prose prose-invert max-w-none">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default OptimizationImprovementSummary;
