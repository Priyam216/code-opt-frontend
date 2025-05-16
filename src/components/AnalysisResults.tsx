
import React from 'react';
import { AnalysisResult } from '@/lib/api';
import CodeAnalysisResults from './CodeAnalysisResults';

interface AnalysisResultsProps {
  analysisResults: AnalysisResult | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisResults }) => {
  if (!analysisResults) {
    return null;
  }
  
  return (
    <CodeAnalysisResults results={analysisResults} className="p-2" />
  );
};

export default AnalysisResults;
