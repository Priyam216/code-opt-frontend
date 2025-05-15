
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ArrowDown } from 'lucide-react';

// Visual card for improvement percentages for Code Complexity, Execution Time, Memory Usage
const metricMeta = {
  executionTime: {
    color: "bg-green-500",
    text: "Execution Time",
    tooltip: "The optimized code runs faster, reducing wait times and resource consumption."
  },
  memoryUsage: {
    color: "bg-blue-500",
    text: "Memory Usage",
    tooltip: "Reduced memory footprint allows larger inputs and better scalability."
  },
  codeComplexity: {
    color: "bg-purple-500",
    text: "Code Complexity",
    tooltip: "Simpler code is easier to maintain and less error-prone."
  }
};

interface ImprovementsCardProps {
  metrics: { executionTime: any, memoryUsage: any, codeComplexity: any }
}

const ImprovementsCard: React.FC<ImprovementsCardProps> = ({ metrics }) => (
  <Card className="shadow border border-border dark:bg-[#23223a]/80">
    <CardContent className="px-6 py-5">
      <div className="flex flex-col gap-6 md:flex-row md:gap-10 justify-between">
        {Object.entries(metrics).map(([key, val]) => {
          // @ts-ignore safe for three metrics only
          const meta = metricMeta[key];
          return (
            <TooltipProvider key={key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full flex flex-col gap-2 cursor-pointer">
                    <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">{meta.text}</span>
                    <span className="flex items-center text-2xl font-bold text-white gap-1">
                      <ArrowDown className="w-4 h-4 text-green-300 mr-0.5" />
                      {val.value}<span className="text-sm pl-1">{val.label}</span>
                    </span>
                    <Progress value={val.value} className={`h-2 ${meta.color}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-xs">{meta.tooltip}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

export default ImprovementsCard;
