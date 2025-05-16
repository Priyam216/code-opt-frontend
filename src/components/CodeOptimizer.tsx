
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Zap } from "lucide-react";
import CodeEditor from './CodeEditor';
import MetricsDashboard from './MetricsDashboard';
import { toast } from "@/components/ui/sonner";
import CodeAnalysisResults from './CodeAnalysisResults';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { analyzeCode, optimizeCode, AnalysisResult, OptimizationResult } from '@/lib/api';
import { CircleArrowDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DetailedChanges from './DetailedChanges';
import OptimizationImprovementSummary from './OptimizationImprovementSummary';
import FlowchartVisualization from './FlowchartVisualization';

const CodeOptimizer = () => {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i));
}`);
  
  const [optimizedCode, setOptimizedCode] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<"analysis" | "optimization" | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult | null>(null);
  const [openSections, setOpenSections] = useState({
    workflow: true,
    metrics: true,
    changes: true,
    summary: true
  });

  const handleOptimize = async () => {
    try {
      setIsOptimizing(true);
      
      // Call the API to optimize the code
      const results = await optimizeCode(code);
      
      setOptimizedCode(results.optimizedCode);
      setOptimizationResults(results);
      setActiveView("optimization");
      
      toast.success("Code optimized successfully!");
    } catch (error) {
      console.error("Optimization failed:", error);
      toast.error("Failed to optimize code. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      
      // Call the API to analyze the code
      const results = await analyzeCode(code);
      
      setAnalysisResults(results);
      setActiveView("analysis");
      
      toast.success("Code analysis completed!");
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Failed to analyze code. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyOptimized = () => {
    navigator.clipboard.writeText(optimizedCode);
    toast.success("Optimized code copied to clipboard!");
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Full-size VS Code-like Editor */}
      <div className="h-[500px] w-full">
        <CodeEditor
          title="Code Editor"
          code={code}
          editable={true}
          onCodeChange={setCode}
          className="h-full"
          language="javascript"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !code}
                className="px-8 transition-all duration-300 min-w-[180px]"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Analyze Code
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-popover border-border">
              <p className="text-sm">Analyze the current code for optimization opportunities</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button 
          size="lg" 
          onClick={handleOptimize} 
          disabled={isOptimizing || !code}
          className="px-8 transition-all duration-300 min-w-[180px]"
        >
          {isOptimizing ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              Optimizing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Run Optimization
            </span>
          )}
        </Button>
      </div>

      {/* Toggle Switch for Results */}
      {activeView && (
        <div className="mt-2 animate-fade-in">
          <div className="border-b border-border">
            <ToggleGroup 
              type="single" 
              value={activeView} 
              onValueChange={(value) => {
                if (value) setActiveView(value as "analysis" | "optimization");
              }}
              className="justify-start w-full"
            >
              <ToggleGroupItem 
                value="analysis" 
                className={`px-6 py-3 rounded-none transition-all border-b-2 ${activeView === 'analysis' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground'}`}
              >
                Analysis Results
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="optimization" 
                className={`px-6 py-3 rounded-none transition-all border-b-2 ${activeView === 'optimization' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground'}`}
              >
                Optimization Results
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Results Content */}
          <div className="mt-6">
            {activeView === "analysis" ? (
              <CodeAnalysisResults results={analysisResults} className="p-2" />
            ) : (
              <div className="flex flex-col gap-6 animate-fade-in">
                {/* Optimized Code */}
                <div className="h-[400px]">
                  <CodeEditor
                    title="Optimized Code"
                    code={optimizationResults?.optimizedCode || optimizedCode}
                    editable={false}
                    diffLines={optimizationResults?.changedLines || []}
                    diffType="added"
                    onCopy={handleCopyOptimized}
                    language="javascript"
                  />
                </div>
                
                {/* Flow Chart Visualization - Now uses the same component as analysis results */}
                {optimizationResults?.optimized_code_flowchart && (
                  <Collapsible open={openSections.workflow} onOpenChange={() => toggleSection('workflow')} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Code Flow Visualization</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.workflow ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="transition-all duration-300">
                      {/* Use the FlowchartVisualization component from analysis results */}
                      <FlowchartVisualization workflow={optimizationResults.optimized_code_flowchart} />
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                {/* Performance Metrics */}
                {optimizationResults?.metrics && (
                  <Collapsible open={openSections.metrics} onOpenChange={() => toggleSection('metrics')} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Performance Metrics</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.metrics ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="transition-all duration-300">
                      <MetricsDashboard 
                        executionTime={{
                          value: optimizationResults.improvement_percentages?.execution_time || 0,
                          label: "faster",
                          improvement: true
                        }}
                        memoryUsage={{
                          value: optimizationResults.improvement_percentages?.memory_usage || 0,
                          label: "less memory",
                          improvement: true
                        }}
                        codeComplexity={{
                          value: optimizationResults.improvement_percentages?.code_complexity || 0,
                          label: "complexity reduction",
                          improvement: true
                        }}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                {/* Detailed Changes - Now using the same styling as optimization opportunities in analysis */}
                {optimizationResults?.detailed_changes && (
                  <Collapsible open={openSections.changes} onOpenChange={() => toggleSection('changes')} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Detailed Changes</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.changes ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="transition-all duration-300">
                      <DetailedChanges changes={optimizationResults.detailed_changes} />
                    </CollapsibleContent>
                  </Collapsible>
                )}
                
                {/* Improvement Summary - Now using the same styling as functionality analysis */}
                {optimizationResults?.improvement_summary && (
                  <Collapsible open={openSections.summary} onOpenChange={() => toggleSection('summary')} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Improvement Summary</h3>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                          <CircleArrowDown className={`h-5 w-5 transition-transform duration-200 ${openSections.summary ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="transition-all duration-300">
                      <OptimizationImprovementSummary content={optimizationResults.improvement_summary} />
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeOptimizer;
