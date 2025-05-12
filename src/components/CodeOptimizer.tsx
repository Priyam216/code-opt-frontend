
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Search, Zap } from "lucide-react";
import CodeEditor from './CodeEditor';
import MetricsDashboard from './MetricsDashboard';
import { toast } from "@/components/ui/sonner";
import CodeAnalysisResults from './CodeAnalysisResults';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const CodeOptimizer = () => {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i));
}`);
  
  const [optimizedCode, setOptimizedCode] = useState(`function fibonacci(n) {
  const memo = new Array(n + 1).fill(0);
  memo[0] = 0;
  memo[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    memo[i] = memo[i-1] + memo[i-2];
  }
  
  return memo[n];
}

for (let i = 0; i < 10; i++) {
  console.log(fibonacci(i));
}`);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<"analysis" | "optimization" | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Create an array of line numbers that have optimizations
  const diffLines = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Example lines with changes

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate API call to optimize code
    setTimeout(() => {
      setIsOptimizing(false);
      setActiveView("optimization");
      toast.success("Code optimized successfully!");
    }, 2000);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate API call to analyze code
    setTimeout(() => {
      // Mock analysis results
      setAnalysisResults({
        categories: [
          {
            name: "CPU Utilization",
            hasIssues: true,
            issues: [
              {
                title: "Recursive function call causing high CPU usage",
                location: "Lines 1-4",
                reason: "Recursive Fibonacci implementation has exponential time complexity O(2^n)",
                suggestion: "Use dynamic programming or memoization to reduce time complexity to O(n)"
              }
            ]
          },
          {
            name: "Memory Usage",
            hasIssues: true,
            issues: [
              {
                title: "Inefficient memory allocation",
                location: "Lines 1-4",
                reason: "Each recursive call allocates new stack frames, leading to potential stack overflow",
                suggestion: "Implement an iterative solution with constant memory usage"
              }
            ]
          },
          {
            name: "Error Handling",
            hasIssues: false,
            issues: []
          },
          {
            name: "Data Throughput",
            hasIssues: false,
            issues: []
          },
          {
            name: "Model Execution Time",
            hasIssues: true,
            issues: [
              {
                title: "Slow execution for larger inputs",
                location: "Lines 1-4",
                reason: "Exponential growth in execution time as input increases",
                suggestion: "Implement bottom-up dynamic programming approach"
              }
            ]
          },
          {
            name: "Query Optimization",
            hasIssues: false,
            issues: []
          },
          {
            name: "Reporting and Visualization Latency",
            hasIssues: false,
            issues: []
          },
          {
            name: "Scalability",
            hasIssues: true,
            issues: [
              {
                title: "Poor scaling with input size",
                location: "Lines 1-4",
                reason: "Performance degrades exponentially with input size",
                suggestion: "Implement an O(n) solution using iteration and memoization"
              }
            ]
          }
        ]
      });
      
      setIsAnalyzing(false);
      setActiveView("analysis");
      toast.success("Code analysis completed!");
    }, 2000);
  };

  const handleCopyOptimized = () => {
    navigator.clipboard.writeText(optimizedCode);
    toast.success("Optimized code copied to clipboard!");
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
              <div className="h-[400px] animate-fade-in">
                <CodeEditor
                  title="Optimized Code"
                  code={optimizedCode}
                  editable={false}
                  diffLines={diffLines}
                  diffType="added"
                  onCopy={handleCopyOptimized}
                  language="javascript"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <MetricsDashboard />
      </div>
    </div>
  );
};

export default CodeOptimizer;
