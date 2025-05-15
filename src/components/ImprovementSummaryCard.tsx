
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';
// Backend integration: markdown summary can be fetched from API
const ImprovementSummaryCard: React.FC<{ summary: string }> = ({ summary }) => (
  <Card className="shadow border border-border max-w-3xl mx-auto rounded-2xl bg-[#21212f]/80">
    <CardContent className="py-6 px-6 max-h-[330px] overflow-auto animate-fade-in">
      <div className="font-bold text-lg mb-4">Improvement Summary</div>
      <div className="prose prose-sm dark:prose-invert prose-headings:mb-2 prose-p:my-2">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </CardContent>
  </Card>
);

export default ImprovementSummaryCard;
