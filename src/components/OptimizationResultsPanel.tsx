
import React, { Suspense } from 'react';
import CodeEditor from './CodeEditor';
// Reuse the analysis results flowchart for optimization visual
import FlowchartVisualization, { WorkflowData } from './FlowchartVisualization';
import ImprovementsCard from './ImprovementsCard'; // for improvement percentages
import OptimizedScoreGrid from './OptimizedScoreGrid';
import DetailedChangesList from './DetailedChangesList';
import ImprovementSummaryBlock from './ImprovementSummaryBlock';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from "@/components/ui/sonner";
import { ChevronDown } from 'lucide-react';

/**
 * OptimizationResultsPanel
 * Integrates all post-optimization visualizations using backend-ready hooks/data.
 * Backend endpoints should provide structure for props:
 * - optimized_code: string
 * - optimized_code_flowchart: WorkflowData
 * - improvement_percentages: { code_complexity, execution_time, memory_usage }
 * - optimized_code_scores: scores structure
 * - detailed_changes: array
 * - improvement_summary: markdown string
 */
interface OptimizationResultsPanelProps {
  optimizedCode: string;
  optimizationResults: any; // see backend JSON example in instructions
}

const OptimizationResultsPanel: React.FC<OptimizationResultsPanelProps> = ({
  optimizedCode,
  optimizationResults,
}) => {
  // --- BACKEND INTEGRATION POINTS ---
  // All fields below should come from backend; demo fallback provided for logic/testing.
  const flowchartData: WorkflowData = optimizationResults?.optimized_code_flowchart;

  const improvementPercentages = optimizationResults?.improvement_percentages ?? {
    code_complexity: 0,
    execution_time: 0,
    memory_usage: 0
  };

  const codeScores = optimizationResults?.optimized_code_scores ?? {
    overall_score: 0,
    scores: {}
  };

  const detailedChanges = optimizationResults?.detailed_changes ?? [];

  const summary = optimizationResults?.improvement_summary ?? '';

  // --- UI/RENDER ---
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

      {/* -------- 2️⃣ Flowchart Visualization (same as analysis results) -------- */}
      <Suspense fallback={<div className="text-center py-4">Loading flowchart…</div>}>
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <div className="cursor-pointer flex items-center gap-2 text-base font-semibold mb-1">
              <span>Optimized Code Flowchart</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* Backend integration: Pass optimizationResults.optimized_code_flowchart directly */}
            {flowchartData && (
              <FlowchartVisualization workflow={flowchartData} />
            )}
          </CollapsibleContent>
        </Collapsible>
      </Suspense>

      {/* -------- 3️⃣ Improvement Percentages -------- */}
      <ImprovementsCard metrics={{
        codeComplexity: {
          value: improvementPercentages.code_complexity,
          label: "% complexity change",
          improvement: improvementPercentages.code_complexity < 0,
        },
        executionTime: {
          value: improvementPercentages.execution_time,
          label: "% faster",
          improvement: improvementPercentages.execution_time > 0,
        },
        memoryUsage: {
          value: improvementPercentages.memory_usage,
          label: "% less",
          improvement: improvementPercentages.memory_usage > 0,
        },
      }} />

      {/* -------- 4️⃣ Scores Grid -------- */}
      {codeScores && (
        <OptimizedScoreGrid
          scores={{
            overall: codeScores.overall_score,
            categories: {
              maintainability: codeScores.scores.maintainability ?? { score: 0, explanation: "" },
              performance: codeScores.scores.performance_efficiency ?? { score: 0, explanation: "" },
              readability: codeScores.scores.readability ?? { score: 0, explanation: "" },
              security: codeScores.scores.security_vulnerability ?? { score: 0, explanation: "" },
              testCoverage: codeScores.scores.test_coverage ?? { score: 0, explanation: "" },
            }
          }}
        />
      )}

      {/* -------- 5️⃣ Detailed Changes -------- */}
      <DetailedChangesList changes={detailedChanges} />

      {/* -------- 6️⃣ Improvement Summary (markdown styled like FunctionalityAnalysis) -------- */}
      <Suspense fallback={<div>Loading summary…</div>}>
        <ImprovementSummaryBlock summary={summary} />
      </Suspense>
    </div>
  );
};

export default OptimizationResultsPanel;
