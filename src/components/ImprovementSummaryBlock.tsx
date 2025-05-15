
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

/**
 * ImprovementSummaryBlock
 * Renders markdown summary with smooth scroll and stylish block.
 * Accepts summary from backend (markdown string).
 */
const ImprovementSummaryBlock: React.FC<{ summary: string }> = ({ summary }) => (
  <Card className="shadow border border-border max-w-3xl mx-auto rounded-2xl bg-[#21212f]/80">
    <CardContent className="py-6 px-6 max-h-[340px] overflow-y-auto animate-fade-in">
      <div className="font-bold text-lg mb-4">Improvement Summary</div>
      <div className="prose prose-sm dark:prose-invert prose-headings:mb-2 prose-p:my-2">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </CardContent>
  </Card>
);

export default ImprovementSummaryBlock;
