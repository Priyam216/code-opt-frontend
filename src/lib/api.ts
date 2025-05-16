export interface AnalysisResult {
  vulnerabilities: Array<{
    name: string;
    severity: string;
    description: string;
    location: string;
  }>;
  performanceBottlenecks: Array<{
    name: string;
    location: string;
    recommendation: string;
  }>;
  codeQualityIssues: Array<{
    name: string;
    location: string;
    description: string;
  }>;
  complexityScore: number;
  duplicationPercentage: number;
  workflow: {
    steps: { id: string; label: string }[];
    dependencies: { from: string; to: string }[];
  };
}

export async function analyzeCode(code: string): Promise<AnalysisResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export interface OptimizationResult {
  optimizedCode: string;
  changedLines: number[];
  metrics: {
    executionTime: { value: number };
    memoryUsage: { value: number };
    codeComplexity: { value: number };
  };
  // Add the new properties to match the backend response
  optimized_code_flowchart?: {
    steps: { id: string; label: string }[];
    dependencies: { from: string; to: string }[];
  };
  detailed_changes?: Array<{
    issue: string;
    improvement: string;
    location: string;
    metric: string;
  }>;
  improvement_summary?: string;
  improvement_percentages?: {
    execution_time: number;
    memory_usage: number;
    code_complexity: number;
  };
}

export async function optimizeCode(code: string): Promise<OptimizationResult> {
  const response = await fetch('/api/optimize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
