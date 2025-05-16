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
    changedLines: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  };
};
