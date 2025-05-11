
import React from 'react';
import MetricsCard from './MetricsCard';

const MetricsDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricsCard 
        title="Execution Time" 
        value={42} 
        label="% faster"
        description="Time required to execute the code"
        tooltipText="Lower execution time means your code runs more efficiently, saving computational resources."
        improvement={true}
      />
      <MetricsCard 
        title="Memory Usage" 
        value={28} 
        label="% reduction"
        description="Memory consumed during execution"
        tooltipText="Reduced memory usage means your application requires fewer resources to run."
        color="bg-blue-500"
        improvement={true}
      />
      <MetricsCard 
        title="Code Complexity" 
        value={15} 
        label="% simpler"
        description="Cyclomatic complexity score"
        tooltipText="Lower complexity scores indicate code that is easier to understand, test, and maintain."
        color="bg-purple-500"
        improvement={true}
      />
    </div>
  );
};

export default MetricsDashboard;
