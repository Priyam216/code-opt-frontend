
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CodeEditor from './CodeEditor';
import MetricsDashboard from './MetricsDashboard';
import { toast } from "@/components/ui/sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CodeAnalysisResults from './CodeAnalysisResults';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CodeOptimizer = () => {
  const [originalCode, setOriginalCode] = useState(`function fibonacci(n) {
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
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate API call to optimize code
    setTimeout(() => {
      setIsOptimizing(false);
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
      setShowAnalysisResults(true);
      toast.success("Code analysis completed!");
    }, 2000);
  };

  const handleCopyOptimized = () => {
    toast.success("Optimized code copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[500px]">
        <div className="flex-1 h-full">
          <CodeEditor
            title="Original Code"
            code={originalCode}
            editable={true}
            onCodeChange={setOriginalCode}
          />
        </div>
        <div className="flex-1 h-full">
          <CodeEditor
            title="Optimized Code"
            code={optimizedCode}
            diffLines={[1, 2, 3, 4, 5, 6, 7, 8]}
            diffType="added"
            onCopy={handleCopyOptimized}
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="lg" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !originalCode}
                className="px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Code"}
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
          disabled={isOptimizing || !originalCode}
          className="px-8 transition-all duration-300"
        >
          {isOptimizing ? "Optimizing..." : "Run Optimization"}
        </Button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <MetricsDashboard />
      </div>

      <Dialog open={showAnalysisResults} onOpenChange={setShowAnalysisResults}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <CodeAnalysisResults results={analysisResults} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeOptimizer;
