// File: src/api/services.ts
// Centralized API service with auth-protected endpoints and re-exported types

// Import types from shared definitions
import type { AnalysisResult, OptimizationResult, ScoreData } from '@/types/api';

// Re-export types for convenience
export type { AnalysisResult, OptimizationResult, ScoreData };

// Backend URL from Vite env
const BACKEND_URL = import.meta.env.VITE_API_URL as string;


const handleApiError = async (response: Response) => {
  if (response.status === 401) {
    // Handle authentication error
    console.error('Authentication required. Please log in.');
    throw new Error('Authentication required. Please log in.');
  }
  
  if (!response.ok) {
    let errorMessage = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }
};


/**
 * Analyze code using the backend service
 */
export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
  try {
    // First try the comprehensive analysis endpoint
    const analysisResponse = await fetch(`${BACKEND_URL}/api/analysis_result`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    await handleApiError(analysisResponse);
    const analysisData = await analysisResponse.json();
    
    // Get detailed analysis with issues from the separate analyze endpoint
    let categoriesWithIssues: any[] = [];
    try {
      const detailedResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (detailedResponse.ok) {
        const detailedData = await detailedResponse.json();
        console.log('Detailed analysis data:', detailedData);
        
        // Transform the detailed analysis data
        if (detailedData.analysis) {
          categoriesWithIssues = Object.entries(detailedData.analysis).map(([key, value]: [string, any]) => ({
            name: value.name || key,
            hasIssues: Array.isArray(value.issues) && value.issues.length > 0,
            issues: value.issues || []
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to get detailed analysis:', error);
    }

    // Debug logging
    console.log('Analysis response:', analysisData);
    console.log('Categories with issues:', categoriesWithIssues);

    return {
      categories: categoriesWithIssues,
      detectedLanguage: {
        name: analysisData.language || 'unknown',
        confidence: 1.0,
        color: analysisData.language === 'r' ? '#1984c8' : '#ccc',
      },
      workflow: {
        steps: analysisData.flowchart?.steps || [],
        dependencies: analysisData.flowchart?.dependencies || [],
        optimizable_steps: analysisData.flowchart?.optimizable_steps || [],
      },
      scores: {
        overall: analysisData.scores?.overall_score || 0,
        categories: {
          maintainability: {
            score: analysisData.scores?.scores?.maintainability?.score || 0,
            explanation: analysisData.scores?.scores?.maintainability?.explanation || 'No data available',
          },
          performance: {
            score: analysisData.scores?.scores?.performance_efficiency?.score || 0,
            explanation: analysisData.scores?.scores?.performance_efficiency?.explanation || 'No data available',
          },
          readability: {
            score: analysisData.scores?.scores?.readability?.score || 0,
            explanation: analysisData.scores?.scores?.readability?.explanation || 'No data available',
          },
          security: {
            score: analysisData.scores?.scores?.security_vulnerability?.score || 0,
            explanation: analysisData.scores?.scores?.security_vulnerability?.explanation || 'No data available',
          },
          testCoverage: {
            score: analysisData.scores?.scores?.test_coverage?.score || 0,
            explanation: analysisData.scores?.scores?.test_coverage?.explanation || 'No data available',
          },
        },
      },
      functionalityAnalysis: analysisData.functionality_analysis || null,
    };
  } catch (error) {
    console.error('Analysis API Error:', error);
    throw error;
  }
};


/**
 * Optimize code using the backend service
 */
export const optimizeCode = async (code: string): Promise<OptimizationResult> => {
  const response = await fetch(`${BACKEND_URL}/api/optimize`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    throw new Error(`Failed to optimize code: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    optimizedCode: data.optimized_code,
    metrics: {
      executionTime: {
        value: data.improvement_percentages.execution_time,
        label: '% faster',
        improvement: data.improvement_percentages.execution_time > 0,
      },
      memoryUsage: {
        value: data.improvement_percentages.memory_usage,
        label: '% reduction',
        improvement: data.improvement_percentages.memory_usage > 0,
      },
      codeComplexity: {
        value: data.improvement_percentages.code_complexity,
        label: '% simpler',
        improvement: data.improvement_percentages.code_complexity > 0,
      },
    },
    changedLines: data.changed_lines ?? [],
    optimized_code_flowchart: data.optimized_code_flowchart,
    detailed_changes: data.detailed_changes ?? [],
    improvement_summary: data.improvement_summary ?? '',
    improvement_percentages: data.improvement_percentages,
  };
};

/**
 * Generate documentation for code
 */
export const documentCode = async (
  code: string
): Promise<{ original_code: string; documented_code: string }> => {
  const response = await fetch(`${BACKEND_URL}/api/document`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || `Failed to generate documentation: ${response.status}`);
  }
  return response.json();
};

/**
 * Convert code between languages
 */
export const convertCode = async (
  code: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{ original_code: string; converted_code: string; source_language: string; target_language: string; conversion_notes: string }> => {
  const response = await fetch(`${BACKEND_URL}/api/convert`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, source_language: sourceLanguage, target_language: targetLanguage }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || `Failed to convert code: ${response.status}`);
  }

  return response.json();
};