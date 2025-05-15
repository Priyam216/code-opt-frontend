
import React, { Suspense } from 'react';
import CodeEditor from './CodeEditor';
import OptimizedFlowchart from './OptimizedFlowchart';
import ImprovementsCard from './ImprovementsCard';
import OptimizedScoreGrid from './OptimizedScoreGrid';
import OptimizedChangesList from './OptimizedChangesList';
import ImprovementSummaryCard from './ImprovementSummaryCard';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from "@/components/ui/sonner";
import { ChevronDown } from 'lucide-react';
// Add comments where real backend data or hooks should be used

interface OptimizationResultsPanelProps {
  optimizedCode: string;
  optimizationResults: any;
  // scores, changes, and summary would come from backend
}

// Main Optimization Results Panel inspired by linear.ai
const OptimizationResultsPanel: React.FC<OptimizationResultsPanelProps> = ({
  optimizedCode,
  optimizationResults,
}) => {
  // Demo: Replace these in real usage with backend data
  const workflow = optimizationResults?.workflow ?? {
    steps: [
      { id: "1", label: "Start Optimization" },
      { id: "2", label: "Apply Vectorization" },
      { id: "3", label: "Return Optimized Result" }
    ],
    dependencies: [
      { from: "1", to: "2" },
      { from: "2", to: "3" }
    ],
    optimizable_steps: [
      { id: "2", reason: "Can further parallelize this operation" }
    ]
  };

  const improvementMetrics = optimizationResults?.metrics ?? {
    executionTime: { value: 33, label: "% faster", improvement: true },
    memoryUsage: { value: 17, label: "% less", improvement: true },
    codeComplexity: { value: 41, label: "% simpler", improvement: true }
  };

  const scoreDemo = {
    overall: 8.7,
    categories: {
      maintainability: { score: 9.5, explanation: "Refactored for modularity and comments improved." },
      performance: { score: 9.2, explanation: "Vectorization led to major speedup." },
      readability: { score: 8.7, explanation: "Cleaner control flow and naming." },
      security: { score: 9.8, explanation: "Input validation added." },
      testCoverage: { score: 8.1, explanation: "Comprehensive testing of edge cases." }
    }
  };

  const changes = [
    {
      category: "Performance",
      issue: "Inefficient for-loop",
      suggestion: "Replaced loop with vectorized array operation.",
      location: "Lines 3-18",
      metric: "Execution Time"
    },
    {
      category: "Maintainability",
      issue: "No input validation",
      suggestion: "Added input checks for proper type and range.",
      location: "Lines 1-2",
      metric: "Security"
    }
  ];

  const improvementSummary = `
**Key Improvements:**  
- Applied vectorization for speed.
- Reduced memory footprint via in-place operations.
- Added input validation for robustness.

\`\`\`js
// Example optimized core
function fastOptimize(arr) {
  if (!Array.isArray(arr)) throw new Error("Input must be array");
  return arr.map(x => x * 2); // demo
}
\`\`\`
`;

  // Optimization: Lazy load heavy sections (flowchart, summary)
  return (
    <div className="flex flex-col gap-8">
      {/* -------- 1️⃣ Optimized Code Display -------- */}
      <Card className="shadow-lg border border-border dark:bg-[#22222a]/80">
        <CardContent className="py-6 px-4">
          <div className="mb-3 flex justify-between items-center">
            <h2 className="font-bold text-lg">Optimized Code</h2>
            {/* Copy Code */}
            <button
              className="bg-primary text-white py-1.5 px-4 rounded-md hover:bg-primary/80 transition-all text-xs"
              onClick={() => {
                navigator.clipboard.writeText(optimizedCode);
                toast.success("Optimized code copied!");
              }}>
              Copy Code
            </button>
          </div>
          <CodeEditor
            title=""
            code={optimizedCode}
            editable={false}
            language="javascript"
            className="h-[340px] rounded-lg border"
          />
        </CardContent>
      </Card>

      {/* -------- 2️⃣ Flowchart Visualization -------- */}
      <Suspense fallback={<div className="text-center py-4">Loading flowchart…</div>}>
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer flex items-center gap-2 text-base font-semibold mb-1">
              <span>Optimized Code Flowchart</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* Real backend: pass optimizationResults.workflow here */}
            <OptimizedFlowchart data={workflow} />
          </CollapsibleContent>
        </Collapsible>
      </Suspense>

      {/* -------- 3️⃣ Improvement Percentages -------- */}
      <ImprovementsCard metrics={improvementMetrics} />

      {/* -------- 4️⃣ Scores Grid -------- */}
      <OptimizedScoreGrid scores={scoreDemo} />

      {/* -------- 5️⃣ Detailed Changes -------- */}
      <OptimizedChangesList changes={changes} />

      {/* -------- 6️⃣ Improvement Summary -------- */}
      <Suspense fallback={<div>Loading summary…</div>}>
        <ImprovementSummaryCard summary={improvementSummary} />
      </Suspense>
    </div>
  );
};

export default OptimizationResultsPanel;
