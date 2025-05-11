
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CodeEditor from './CodeEditor';
import MetricsDashboard from './MetricsDashboard';
import { toast } from "@/components/ui/sonner";

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

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate API call to optimize code
    setTimeout(() => {
      setIsOptimizing(false);
      toast.success("Code optimized successfully!");
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

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleOptimize} 
          disabled={isOptimizing || !originalCode}
          className="px-8"
        >
          {isOptimizing ? "Optimizing..." : "Run Optimization"}
        </Button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
        <MetricsDashboard />
      </div>
    </div>
  );
};

export default CodeOptimizer;
