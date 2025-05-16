
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

  try {
    // Perform the API call to your backend
    const response = await fetch(`${BACKEND_URL}/api/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to optimize code: ${response.status} - ${response.statusText}`);
    }

    // Parse the response JSON
    const data = await response.json();

    // Map the backend response to your frontend types
    return {
      optimizedCode: data.optimized_code,
      metrics: {
        executionTime: {
          value: data.improvement_percentages.execution_time,
          label: "% faster",
          improvement: data.improvement_percentages.execution_time > 0,
        },
        memoryUsage: {
          value: data.improvement_percentages.memory_usage,
          label: "% reduction",
          improvement: data.improvement_percentages.memory_usage > 0,
        },
        codeComplexity: {
          value: data.improvement_percentages.code_complexity,
          label: "% simpler",
          improvement: data.improvement_percentages.code_complexity > 0,
        }
      },
      changedLines: data.changed_lines ?? [],
      optimized_code_flowchart: {
        steps: data.optimized_code_flowchart.steps ?? [],
        dependencies: data.optimized_code_flowchart.dependencies ?? []
      },
      detailed_changes: data.detailed_changes ?? [],
      improvement_summary: data.improvement_summary ?? "",
      improvement_percentages: {
        execution_time: data.improvement_percentages.execution_time,
        memory_usage: data.improvement_percentages.memory_usage,
        code_complexity: data.improvement_percentages.code_complexity
      }
    };
  } catch (error) {
    console.error("Error optimizing code:", error);
    throw error;
  }
};

