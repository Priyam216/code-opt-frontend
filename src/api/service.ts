// // File: src/api/services.ts
// // Centralized API service with auth-protected endpoints and re-exported types

// // Import types from shared definitions
// import type { AnalysisResult, OptimizationResult, ScoreData } from '@/types/api';

// // Re-export types for convenience
// export type { AnalysisResult, OptimizationResult, ScoreData };

// // Backend URL from Vite env
// const BACKEND_URL = import.meta.env.VITE_API_URL as string;


// const handleApiError = async (response: Response) => {
//   if (response.status === 401) {
//     // Handle authentication error
//     console.error('Authentication required. Please log in.');
//     throw new Error('Authentication required. Please log in.');
//   }
  
//   if (!response.ok) {
//     let errorMessage = `API Error ${response.status}: ${response.statusText}`;
//     try {
//       const errorData = await response.json();
//       errorMessage = errorData.message || errorMessage;
//     } catch {
//       // If response is not JSON, use default message
//     }
//     throw new Error(errorMessage);
//   }
// };


// /**
//  * Analyze code using the backend service
//  */
// export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
//   try {
//     // First try the comprehensive analysis endpoint
//     const analysisResponse = await fetch(`${BACKEND_URL}/api/analysis_result`, {
//       method: 'POST',
//       credentials: 'include',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ code }),
//     });

//     await handleApiError(analysisResponse);
//     const analysisData = await analysisResponse.json();
    
//     // Get detailed analysis with issues from the separate analyze endpoint
//     let categoriesWithIssues: any[] = [];
//     try {
//       const detailedResponse = await fetch(`${BACKEND_URL}/api/analyze`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ code }),
//       });

//       if (detailedResponse.ok) {
//         const detailedData = await detailedResponse.json();
//         console.log('Detailed analysis data:', detailedData);
        
//         // Transform the detailed analysis data
//         if (detailedData.analysis) {
//           categoriesWithIssues = Object.entries(detailedData.analysis).map(([key, value]: [string, any]) => ({
//             name: value.name || key,
//             hasIssues: Array.isArray(value.issues) && value.issues.length > 0,
//             issues: value.issues || []
//           }));
//         }
//       }
//     } catch (error) {
//       console.warn('Failed to get detailed analysis:', error);
//     }

//     // Debug logging
//     console.log('Analysis response:', analysisData);
//     console.log('Categories with issues:', categoriesWithIssues);

//     return {
//       categories: categoriesWithIssues,
//       detectedLanguage: {
//         name: analysisData.language || 'unknown',
//         confidence: 1.0,
//         color: analysisData.language === 'r' ? '#1984c8' : '#ccc',
//       },
//       workflow: {
//         steps: analysisData.flowchart?.steps || [],
//         dependencies: analysisData.flowchart?.dependencies || [],
//         optimizable_steps: analysisData.flowchart?.optimizable_steps || [],
//       },
//       scores: {
//         overall: analysisData.scores?.overall_score || 0,
//         categories: {
//           maintainability: {
//             score: analysisData.scores?.scores?.maintainability?.score || 0,
//             explanation: analysisData.scores?.scores?.maintainability?.explanation || 'No data available',
//           },
//           performance: {
//             score: analysisData.scores?.scores?.performance_efficiency?.score || 0,
//             explanation: analysisData.scores?.scores?.performance_efficiency?.explanation || 'No data available',
//           },
//           readability: {
//             score: analysisData.scores?.scores?.readability?.score || 0,
//             explanation: analysisData.scores?.scores?.readability?.explanation || 'No data available',
//           },
//           security: {
//             score: analysisData.scores?.scores?.security_vulnerability?.score || 0,
//             explanation: analysisData.scores?.scores?.security_vulnerability?.explanation || 'No data available',
//           },
//           testCoverage: {
//             score: analysisData.scores?.scores?.test_coverage?.score || 0,
//             explanation: analysisData.scores?.scores?.test_coverage?.explanation || 'No data available',
//           },
//         },
//       },
//       functionalityAnalysis: analysisData.functionality_analysis || null,
//     };
//   } catch (error) {
//     console.error('Analysis API Error:', error);
//     throw error;
//   }
// };


// /**
//  * Optimize code using the backend service
//  */
// export const optimizeCode = async (code: string): Promise<OptimizationResult> => {
//   const response = await fetch(`${BACKEND_URL}/api/optimize`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ code }),
//   });

//   if (!response.ok) {
//     throw new Error(`Failed to optimize code: ${response.status} ${response.statusText}`);
//   }

//   const data = await response.json();
//   return {
//     optimizedCode: data.optimized_code,
//     metrics: {
//       executionTime: {
//         value: data.improvement_percentages.execution_time,
//         label: '% faster',
//         improvement: data.improvement_percentages.execution_time > 0,
//       },
//       memoryUsage: {
//         value: data.improvement_percentages.memory_usage,
//         label: '% reduction',
//         improvement: data.improvement_percentages.memory_usage > 0,
//       },
//       codeComplexity: {
//         value: data.improvement_percentages.code_complexity,
//         label: '% simpler',
//         improvement: data.improvement_percentages.code_complexity > 0,
//       },
//     },
//     changedLines: data.changed_lines ?? [],
//     optimized_code_flowchart: data.optimized_code_flowchart,
//     detailed_changes: data.detailed_changes ?? [],
//     improvement_summary: data.improvement_summary ?? '',
//     improvement_percentages: data.improvement_percentages,
//   };
// };

// /**
//  * Generate documentation for code
//  */
// export const documentCode = async (
//   code: string
// ): Promise<{ original_code: string; documented_code: string }> => {
//   const response = await fetch(`${BACKEND_URL}/api/document`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ code }),
//   });
//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(err.message || `Failed to generate documentation: ${response.status}`);
//   }
//   return response.json();
// };

// /**
//  * Convert code between languages
//  */
// export const convertCode = async (
//   code: string,
//   sourceLanguage: string,
//   targetLanguage: string
// ): Promise<{ original_code: string; converted_code: string; source_language: string; target_language: string; conversion_notes: string }> => {
//   const response = await fetch(`${BACKEND_URL}/api/convert`, {
//     method: 'POST',
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ code, source_language: sourceLanguage, target_language: targetLanguage }),
//   });

//   if (!response.ok) {
//     const err = await response.json();
//     throw new Error(err.message || `Failed to convert code: ${response.status}`);
//   }

//   return response.json();
// };



// File: src/api/services.ts
// Centralized API service with auth-protected endpoints, timeout handling, and retry logic

// Import types from shared definitions
import type { AnalysisResult, OptimizationResult, ScoreData } from '@/types/api';

// Re-export types for convenience
export type { AnalysisResult, OptimizationResult, ScoreData };

// Backend URL from Vite env
const BACKEND_URL = import.meta.env.VITE_API_URL as string;

// API Configuration
const API_CONFIG = {
  timeout: 300000, // 5 minutes for long-running operations like optimization
  retries: 3,
  retryDelay: 2000, // 2 seconds between retries
  shortTimeout: 30000, // 30 seconds for quick operations
};

// Enhanced error handler with better error messages
const handleApiError = async (response: Response) => {
  if (response.status === 401) {
    console.error('Authentication required. Please log in.');
    throw new Error('Authentication required. Please log in.');
  }
  
  if (response.status === 504) {
    throw new Error('Server timeout. The operation is taking longer than expected. Please try again.');
  }
  
  if (response.status === 503) {
    throw new Error('Service temporarily unavailable. Please try again in a few moments.');
  }
  
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait a moment before trying again.');
  }
  
  if (!response.ok) {
    let errorMessage = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use default message
      if (response.status >= 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (response.status >= 400) {
        errorMessage = 'Request error. Please check your input and try again.';
      }
    }
    throw new Error(errorMessage);
  }
};

// Enhanced fetch with timeout and abort controller
const fetchWithTimeout = async (
  url: string, 
  options: RequestInit, 
  timeout = API_CONFIG.timeout
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout / 1000} seconds. Please try again.`);
      }
      
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
    
    throw error;
  }
};

// Retry wrapper for API calls with exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = API_CONFIG.retries,
  operationName = 'API call'
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying ${operationName}... Attempt ${attempt + 1}/${maxRetries + 1}`);
      }
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on authentication errors or client errors (4xx except 408, 429)
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('400') ||
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('404') ||
        error.message.includes('422')
      )) {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: wait longer between each retry
      const delay = API_CONFIG.retryDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Enhance error message for final failure
  const enhancedError = new Error(
    `${operationName} failed after ${maxRetries + 1} attempts. ${lastError.message}`
  );
  throw enhancedError;
};

/**
 * Analyze code using the backend service
 */
export const analyzeCode = async (code: string): Promise<AnalysisResult> => {
  return withRetry(async () => {
    try {
      // First try the comprehensive analysis endpoint with shorter timeout
      const analysisResponse = await fetchWithTimeout(`${BACKEND_URL}/api/analysis_result`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      }, API_CONFIG.shortTimeout);

      await handleApiError(analysisResponse);
      const analysisData = await analysisResponse.json();
      
      // Get detailed analysis with issues from the separate analyze endpoint
      let categoriesWithIssues: any[] = [];
      try {
        const detailedResponse = await fetchWithTimeout(`${BACKEND_URL}/api/analyze`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        }, API_CONFIG.shortTimeout);

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
        // Don't throw here, continue with basic analysis
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
  }, API_CONFIG.retries, 'Code analysis');
};

/**
 * Optimize code using the backend service - Enhanced with timeout and retry
 */
export const optimizeCode = async (code: string): Promise<OptimizationResult> => {
  return withRetry(async () => {
    // Use longer timeout for optimization as it's a heavy operation
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/optimize`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }, API_CONFIG.timeout); // Full 5-minute timeout

    await handleApiError(response);
    const data = await response.json();
    
    return {
      optimizedCode: data.optimized_code,
      metrics: {
        executionTime: {
          value: data.improvement_percentages?.execution_time || 0,
          label: '% faster',
          improvement: (data.improvement_percentages?.execution_time || 0) > 0,
        },
        memoryUsage: {
          value: data.improvement_percentages?.memory_usage || 0,
          label: '% reduction',  
          improvement: (data.improvement_percentages?.memory_usage || 0) > 0,
        },
        codeComplexity: {
          value: data.improvement_percentages?.code_complexity || 0,
          label: '% simpler',
          improvement: (data.improvement_percentages?.code_complexity || 0) > 0,
        },
      },
      changedLines: data.changed_lines ?? [],
      optimized_code_flowchart: data.optimized_code_flowchart || null,
      detailed_changes: data.detailed_changes ?? [],
      improvement_summary: data.improvement_summary ?? '',
      improvement_percentages: data.improvement_percentages || {},
    };
  }, API_CONFIG.retries, 'Code optimization');
};

/**
 * Generate documentation for code - Enhanced
 */
export const documentCode = async (
  code: string
): Promise<{ original_code: string; documented_code: string }> => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/document`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    }, API_CONFIG.timeout); // Documentation can also take time
    
    await handleApiError(response);
    const data = await response.json();
    
    return {
      original_code: data.original_code || code,
      documented_code: data.documented_code || '',
    };
  }, API_CONFIG.retries, 'Code documentation');
};

/**
 * Convert code between languages - Enhanced
 */
export const convertCode = async (
  code: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{ 
  original_code: string; 
  converted_code: string; 
  source_language: string; 
  target_language: string; 
  conversion_notes: string 
}> => {
  return withRetry(async () => {
    const response = await fetchWithTimeout(`${BACKEND_URL}/api/convert`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code, 
        source_language: sourceLanguage, 
        target_language: targetLanguage 
      }),
    }, API_CONFIG.timeout); // Conversion can take time for complex code

    await handleApiError(response);
    const data = await response.json();
    
    return {
      original_code: data.original_code || code,
      converted_code: data.converted_code || '',
      source_language: data.source_language || sourceLanguage,
      target_language: data.target_language || targetLanguage,
      conversion_notes: data.conversion_notes || '',
    };
  }, API_CONFIG.retries, 'Code conversion');
};

// Helper function to check if backend is reachable
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetchWithTimeout(`${BACKEND_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    }, 5000); // 5 second timeout for health check
    
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Export configuration for use in components if needed
export { API_CONFIG };