
/**
 * API service for code analysis and optimization
 * This file contains mock API endpoints that can be replaced with real backend calls
 */

// Types for API responses
export interface AnalysisResult {
  categories: AnalysisCategory[];
  detectedLanguage: LanguageInfo;
  workflow?: WorkflowData;
  scores?: ScoreData;
  functionalityAnalysis?: string;
}

export interface LanguageInfo {
  name: string;
  confidence: number;
  color: string;
}

// IMPORTANT: This interface has been updated to match the backend response format
export interface WorkflowData {
  // The existing interface properties for backwards compatibility
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  optimizableSteps?: string[] | OptimizableStep[];
  
  // New properties to match the backend response format
  steps?: {
    id: string;
    label: string;
  }[];
  dependencies?: {
    from: string;
    to: string;
  }[];
  optimizable_steps?: {
    id: string;
    reason: string;
  }[];
}

export interface OptimizableStep {
  id: string;
  reason: string;
}

export interface WorkflowNode {
  id: string;
  label: string;
  type: string;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ScoreData {
  overall: number;
  categories: {
    maintainability: ScoreCategory;
    performance: ScoreCategory;
    readability: ScoreCategory;
    security: ScoreCategory;
    testCoverage: ScoreCategory;
  };
}

export interface ScoreCategory {
  score: number;
  explanation: string;
}

export interface AnalysisCategory {
  name: string;
  hasIssues: boolean;
  issues: AnalysisIssue[];
}

export interface AnalysisIssue {
  title: string;
  location: string;
  reason: string;
  suggestion: string;
}

export interface DetailedChange {
  issue: string;
  improvement: string;
  location: string;
  metric: string;
}

export interface OptimizationResult {
  optimizedCode: string;
  metrics: {
    executionTime: {
      value: number;
      label: string;
      improvement: boolean;
    };
    memoryUsage: {
      value: number;
      label: string;
      improvement: boolean;
    };
    codeComplexity: {
      value: number;
      label: string;
      improvement: boolean;
    };
  };
  changedLines: number[];
  // Add new properties from the backend response
  optimized_code_flowchart?: WorkflowData;
  detailed_changes?: DetailedChange[];
  improvement_summary?: string;
  improvement_percentages?: {
    execution_time: number;
    memory_usage: number;
    code_complexity: number;
  };
}

const BACKEND_URL = "http://127.0.0.1:5000"; // Replace with your actual backend URL

/**
 * Analyze code using the backend service
 * @param code The code to analyze
 * @returns Analysis results
 */
export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
  console.log('Analyzing code:', code);

  try {
    // Perform the API call
    const response = await fetch(`${BACKEND_URL}/api/analysis_result`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to analyze code: ${response.status} - ${response.statusText}`);
    }

    // Parse the response JSON
    const data = await response.json();

    // Map the backend response to your frontend types
    return {
      detectedLanguage: {
        name: data.language || "Unknown",
        confidence: 1.0, // Since confidence is not provided by the backend, we assume 100%
        color: data.language === "r" ? "#1984c8" : "#ccc", // Set color based on language
      },
      workflow: {
        steps: data.flowchart.steps,
        dependencies: data.flowchart.dependencies,
        optimizable_steps: data.flowchart.optimizable_steps
      },
      scores: {
        overall: data.scores.overall_score,
        categories: {
          maintainability: {
            score: data.scores.scores.maintainability.score,
            explanation: data.scores.scores.maintainability.explanation,
          },
          performance: {
            score: data.scores.scores.performance_efficiency.score,
            explanation: data.scores.scores.performance_efficiency.explanation,
          },
          readability: {
            score: data.scores.scores.readability.score,
            explanation: data.scores.scores.readability.explanation,
          },
          security: {
            score: data.scores.scores.security_vulnerability.score,
            explanation: data.scores.scores.security_vulnerability.explanation,
          },
          testCoverage: {
            score: data.scores.scores.test_coverage.score,
            explanation: data.scores.scores.test_coverage.explanation,
          }
        }
      },
      functionalityAnalysis: data.functionality_analysis,
      categories: [
        {
          name: "Maintainability",
          hasIssues: data.scores.scores.maintainability.score < 7,
          issues: [
            {
              title: "Lack of Comments",
              location: "Entire Code",
              reason: "The function is self-contained and simple, but lacks comments for complex logic.",
              suggestion: "Add detailed comments to improve understanding."
            }
          ]
        },
        {
          name: "Performance Efficiency",
          hasIssues: data.scores.scores.performance_efficiency.score < 7,
          issues: [
            {
              title: "Loop-based Calculation",
              location: "Loop Section",
              reason: "The code uses a loop instead of R's built-in `prod()` function.",
              suggestion: "Consider replacing the loop with `prod()` for better efficiency."
            }
          ]
        },
        {
          name: "Readability",
          hasIssues: data.scores.scores.readability.score < 7,
          issues: []
        },
        {
          name: "Security Vulnerability",
          hasIssues: false,
          issues: []
        },
        {
          name: "Test Coverage",
          hasIssues: data.scores.scores.test_coverage.score < 5,
          issues: [
            {
              title: "Lack of Test Cases",
              location: "Function Usage",
              reason: "Only a single print statement is available for testing.",
              suggestion: "Implement unit tests to ensure correctness."
            }
          ]
        }
      ]
    };
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw error;
  }
};

/**
 * Optimize code using the backend service
 * @param code The code to optimize
 * @returns Optimized code and performance metrics
 */
export const optimizeCode = async (code: string): Promise<OptimizationResult> => {
  console.log('Optimizing code:', code);
  
  // TODO: Replace with your real backend endpoint
  // const response = await fetch('https://example.com/api/optimize', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ code }),
  // });
  
  // if (!response.ok) {
  //   throw new Error('Failed to optimize code');
  // }
  
  // return await response.json();
  
  // Mock response for development
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
  
  // Updated mock response to include the new fields
  return {
    optimizedCode: `function fibonacci(n) {
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
}`,
    metrics: {
      executionTime: {
        value: 42,
        label: "% faster",
        improvement: true
      },
      memoryUsage: {
        value: 28,
        label: "% reduction",
        improvement: true
      },
      codeComplexity: {
        value: 15,
        label: "% simpler",
        improvement: true
      }
    },
    changedLines: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    // New mock data matching the backend response format
    improvement_percentages: {
      execution_time: 42,
      memory_usage: 28,
      code_complexity: 15
    },
    optimized_code_flowchart: {
      steps: [
        { id: "1", label: "Define fibonacci function" },
        { id: "2", label: "Initialize memoization array" },
        { id: "3", label: "Set base cases (0 and 1)" },
        { id: "4", label: "Start loop from 2 to n" },
        { id: "5", label: "Calculate fibonacci(i) using previous values" },
        { id: "6", label: "Return final result" },
        { id: "7", label: "Loop from 0 to 9" },
        { id: "8", label: "Print fibonacci value for each number" }
      ],
      dependencies: [
        { from: "1", to: "2" },
        { from: "2", to: "3" },
        { from: "3", to: "4" },
        { from: "4", to: "5" },
        { from: "5", to: "4" },
        { from: "4", to: "6" },
        { from: "6", to: "7" },
        { from: "7", to: "8" },
        { from: "8", to: "7" }
      ]
    },
    detailed_changes: [
      {
        improvement: "Use memoization to store previously calculated values",
        issue: "Inefficient recursive calculation with duplicate work",
        location: "fibonacci function implementation",
        metric: "CPU Utilization"
      },
      {
        improvement: "Use an iterative approach with an array to store values",
        issue: "Excessive stack usage in recursive implementation",
        location: "fibonacci function implementation",
        metric: "Memory Usage"
      },
      {
        improvement: "Implement bottom-up approach to avoid recursive call overhead",
        issue: "Exponential time complexity O(2^n) in recursive solution",
        location: "fibonacci function implementation",
        metric: "Scalability"
      },
      {
        improvement: "Pre-allocate the array with the right size using fill(0)",
        issue: "Inefficient memory allocation",
        location: "fibonacci function implementation",
        metric: "Memory Usage"
      }
    ],
    improvement_summary: "# Fibonacci Function Optimization Report\n\n## Performance Improvements\n\n| Metric | Original | Optimized | Improvement |\n|--------|----------|-----------|-------------|\n| Execution Time | 100.0 | 58.0 | 42.0% |\n| Memory Usage | 100.0 | 72.0 | 28.0% |\n| Code Complexity | 3.0 | 2.55 | 15.0% |\n\n## 1. Summary of Optimizations\n\nThe Fibonacci implementation has been optimized to address several key issues:\n\n1. Replaced recursive calculation with an iterative, memoization-based approach\n2. Eliminated redundant calculations by storing and reusing previously computed values\n3. Reduced stack usage by using an array-based solution\n4. Improved time complexity from O(2^n) to O(n)\n\nThese optimizations significantly improve performance and scalability while maintaining the same functionality.\n\n## 2. Key Improvements by Metric\n\n### CPU Utilization\n- **Improvement**: Eliminated redundant calculations by using memoization\n- **Impact**: Reduced CPU usage from exponential to linear\n\n### Memory Usage\n- **Improvement**: Replaced stack-heavy recursion with a single array\n- **Impact**: Linear and predictable memory usage instead of exponential growth\n\n### Scalability\n- **Improvement**: Changed algorithm from O(2^n) to O(n) time complexity\n- **Impact**: Can now efficiently calculate much larger Fibonacci numbers\n\n## 3. Before/After Code Examples\n\n### Fibonacci Calculation\n\nBefore:\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\n```\n\nAfter:\n```javascript\nfunction fibonacci(n) {\n  const memo = new Array(n + 1).fill(0);\n  memo[0] = 0;\n  memo[1] = 1;\n  \n  for (let i = 2; i <= n; i++) {\n    memo[i] = memo[i-1] + memo[i-2];\n  }\n  \n  return memo[n];\n}\n```\n\n## 4. Expected Performance Improvements\n\n- **CPU Usage**: 42% reduction in processing time\n- **Memory Usage**: 28% reduction in memory consumption\n- **Calculation Speed**: Can now calculate fibonacci(100) instantly instead of taking years\n- **Scalability**: Linear scaling instead of exponential\n\n## 5. Recommendations for Further Optimizations\n\n1. **Space Optimization**: For very large calculations, implement a space-optimized version that only keeps the last two values instead of the whole array\n   ```javascript\n   function fibonacci(n) {\n     if (n <= 1) return n;\n     let a = 0, b = 1;\n     for (let i = 2; i <= n; i++) {\n       let temp = a + b;\n       a = b;\n       b = temp;\n     }\n     return b;\n   }\n   ```\n\n2. **BigInt Support**: For extremely large Fibonacci numbers, use BigInt to prevent integer overflow\n\n3. **Constant-time Formula**: For approximate values of large Fibonacci numbers, consider using Binet's formula\n   ```javascript\n   function fibonacciApprox(n) {\n     const phi = (1 + Math.sqrt(5)) / 2;\n     return Math.round(Math.pow(phi, n) / Math.sqrt(5));\n   }\n   ```\n\nThese further optimizations can provide additional performance benefits depending on specific use cases."
  };
};
