
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CircleArrowDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { OptimizationResult } from '@/lib/api';
import CodeEditor from './CodeEditor';
import FlowchartVisualization from './FlowchartVisualization';
import MetricsDashboard from './MetricsDashboard';
import DetailedChanges from './DetailedChanges';
import OptimizationImprovementSummary from './OptimizationImprovementSummary';

interface OptimizationResultsProps {
  optimizationResults: OptimizationResult | null;
  handleCopyOptimized: () => void;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({ 
  optimizationResults,
  handleCopyOptimized 
}) => {
  const [openSections, setOpenSections] = useState({
    workflow: true,
    metrics: true,
    changes: true,
    summary: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!optimizationResults) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Optimized Code */}
      <div className="h-[400px]">
        <CodeEditor
          title="Optimized Code"
          code={optimizationResults.optimizedCode}
          editable={false}
          diffLines={optimizationResults.changedLines || []}
          diffType="added"
          onCopy={handleCopyOptimized}
          language="javascript"
        />
      </div>
      
      {/* Flow Chart Visualization */}
      {optimizationResults.optimized_code_flowchart && (
        <Collapsible 
          open={openSections.workflow} 
          onOpenChange={() => toggleSection('workflow')} 
          className="w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Code Flow Visualization</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <CircleArrowDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    openSections.workflow ? 'rotate-180' : ''
                  }`} 
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-300">
            <FlowchartVisualization 
              workflow={optimizationResults.optimized_code_flowchart} 
            />
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {/* Performance Metrics */}
      <Collapsible 
        open={openSections.metrics} 
        onOpenChange={() => toggleSection('metrics')} 
        className="w-full"
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Performance Metrics</h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
              <CircleArrowDown 
                className={`h-5 w-5 transition-transform duration-200 ${
                  openSections.metrics ? 'rotate-180' : ''
                }`} 
              />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="transition-all duration-300">
          <MetricsDashboard 
            executionTime={{
              value: optimizationResults.improvement_percentages?.execution_time || 
                     optimizationResults.metrics.executionTime.value,
              label: "faster",
              improvement: true
            }}
            memoryUsage={{
              value: optimizationResults.improvement_percentages?.memory_usage || 
                     optimizationResults.metrics.memoryUsage.value,
              label: "less memory",
              improvement: true
            }}
            codeComplexity={{
              value: optimizationResults.improvement_percentages?.code_complexity || 
                     optimizationResults.metrics.codeComplexity.value,
              label: "complexity reduction",
              improvement: true
            }}
          />
        </CollapsibleContent>
      </Collapsible>
      
      {/* Detailed Changes */}
      {optimizationResults.detailed_changes && (
        <Collapsible 
          open={openSections.changes} 
          onOpenChange={() => toggleSection('changes')} 
          className="w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Detailed Changes</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <CircleArrowDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    openSections.changes ? 'rotate-180' : ''
                  }`} 
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-300">
            <DetailedChanges changes={optimizationResults.detailed_changes} />
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {/* Improvement Summary */}
      {optimizationResults.improvement_summary && (
        <Collapsible 
          open={openSections.summary} 
          onOpenChange={() => toggleSection('summary')} 
          className="w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Improvement Summary</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <CircleArrowDown 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    openSections.summary ? 'rotate-180' : ''
                  }`} 
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="transition-all duration-300">
            <OptimizationImprovementSummary content={optimizationResults.improvement_summary} />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default OptimizationResults;
