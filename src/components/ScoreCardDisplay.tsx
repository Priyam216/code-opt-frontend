import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { CircleHelp } from 'lucide-react';

interface ScoreCardDisplayProps {
  scores: ScoreData;
}

const ScoreCard = ({ 
  title, 
  score, 
  explanation, 
  color 
}: { 
  title: string; 
  score: number; 
  explanation: string;
  color: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="py-2 px-4 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge 
                variant="secondary" 
                className="font-mono font-bold text-xs"
                style={{ backgroundColor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}
              >
                {score.toFixed(1)}/10
              </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Progress
                value={score * 10} 
                className="h-1.5 mt-2"
                style={{ 
                  backgroundColor: `rgba(${color}, 0.2)`,
                }}
                // Using css classes for styling the indicator
                indicatorClassName={`bg-[rgb(${color})]`}
              />
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ScoreCardDisplay = ({ scores }: ScoreCardDisplayProps) => {
  if (!scores) return null;

  // Handle both old and new data structures
  const overall = scores.overall_score || 0;
  const categories = scores.scores || {
    maintainability: { score: 0, explanation: "" },
    performance_efficiency: { score: 0, explanation: "" },
    readability: { score: 0, explanation: "" },
    security_vulnerability: { score: 0, explanation: "" },
    test_coverage: { score: 0, explanation: "" }
  };

  // Map category keys to display names
  const categoryDisplayNames: Record<string, string> = {
    maintainability: "Maintainability",
    performance_efficiency: "Performance",
    readability: "Readability",
    security_vulnerability: "Security",
    test_coverage: "Test Coverage",
    performance: "Performance", // For backward compatibility
    security: "Security", // For backward compatibility
    testCoverage: "Test Coverage" // For backward compatibility
  };

  // Color mappings (RGB values)
  const colors = {
    overall: "59, 130, 246",
    maintainability: "99, 102, 241",
    performance_efficiency: "236, 72, 153",
    performance: "236, 72, 153", // For backward compatibility
    readability: "16, 185, 129",
    security_vulnerability: "245, 158, 11",
    security: "245, 158, 11", // For backward compatibility
    test_coverage: "124, 58, 237",
    testCoverage: "124, 58, 237" // For backward compatibility
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-6">
        <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
          <span>Overall Code Quality</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp size={14} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Calculated based on all category scores with weighted importance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-4xl font-bold mb-2">{overall.toFixed(1)}<span className="text-base text-muted-foreground">/10</span></div>
        <Progress 
          value={overall * 10} 
          className="h-2 w-48"
          style={{ backgroundColor: `rgba(${colors.overall}, 0.2)` }}
          // Using css classes for styling the indicator
          indicatorClassName={`bg-[rgb(${colors.overall})]`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(categories).map(([key, category]) => {
          // Skip if not a valid category or missing data
          if (!categoryDisplayNames[key] || !category.score) return null;
          
          return (
            <ScoreCard 
              key={key}
              title={categoryDisplayNames[key]} 
              score={category.score} 
              explanation={category.explanation}
              color={colors[key as keyof typeof colors] || colors.overall}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ScoreCardDisplay;
