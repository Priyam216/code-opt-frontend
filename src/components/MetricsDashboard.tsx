
import React from 'react';
import MetricsCard from './MetricsCard';

interface MetricData {
  value: number;
  label?: string;
  improvement?: boolean;
}

interface MetricsDashboardProps {
  executionTime: MetricData;
  memoryUsage: MetricData;
  codeComplexity: MetricData;
}

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  executionTime,
  memoryUsage,
  codeComplexity
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricsCard 
        title="Execution Time" 
        value={executionTime.value} 
        label={executionTime.label} 
        improvement={executionTime.improvement}
      />
      <MetricsCard 
        title="Memory Usage" 
        value={memoryUsage.value} 
        label={memoryUsage.label}
        improvement={memoryUsage.improvement}
      />
      <MetricsCard 
        title="Code Complexity" 
        value={codeComplexity.value} 
        label={codeComplexity.label}
        improvement={codeComplexity.improvement}
      />
    </div>
  );
};

export default MetricsDashboard;
