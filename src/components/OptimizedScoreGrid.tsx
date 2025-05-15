
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CircleHelp } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Score type for grid
interface ScoreCategory {
  score: number;
  explanation: string;
}

interface ScoresGridProps {
  scores: {
    overall: number;
    categories: {
      maintainability: ScoreCategory;
      performance: ScoreCategory;
      readability: ScoreCategory;
      security: ScoreCategory;
      testCoverage: ScoreCategory;
    }
  }
}

// Circle score bar (very minimal)
const ScoreCircle = ({ value, color }: { value: number; color: string }) => (
  <svg width="54" height="54" viewBox="0 0 54 54" className="mr-3">
    <circle cx="27" cy="27" r="25" fill="none" stroke="#232337" strokeWidth="4" />
    <circle
      cx="27" cy="27" r="25"
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeDasharray={2 * Math.PI * 25}
      strokeDashoffset={2 * Math.PI * 25 * (1 - value / 10)}
      style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)" }}
    />
    <text x="50%" y="54%" textAnchor="middle" dy=".3em" fontSize="13" fill={color} fontWeight="bold">{value.toFixed(1)}</text>
  </svg>
);

const scoreMeta = {
  maintainability: { color: "#a78bfa", name: "Maintainability" },
  performance: { color: "#34d399", name: "Performance" },
  readability: { color: "#60a5fa", name: "Readability" },
  security: { color: "#fbbf24", name: "Security" },
  testCoverage: { color: "#c084fc", name: "Test Coverage" }
};

const OptimizedScoreGrid: React.FC<ScoresGridProps> = ({ scores }) => (
  <Card className="border shadow bg-[#21212b]/90">
    <CardContent className="py-7 px-6">
      <div className="mb-5 flex flex-col items-center">
        <span className="text-sm text-muted-foreground flex items-center gap-1 mb-1">Overall Score
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp size={13} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                Calculated from all category scores.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <div className="text-4xl font-semibold text-primary">{scores.overall.toFixed(1)}<span className="text-base text-muted-foreground">/10</span></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(scores.categories).map(([key, val]) => {
          // @ts-ignore typescript cannot infer meta here
          const meta = scoreMeta[key];
          return (
            <div key={key} className="flex flex-col items-center border rounded-xl p-5 bg-[#25253e]/70">
              <ScoreCircle value={val.score} color={meta.color} />
              <div className="text-xs font-semibold mb-1">{meta.name}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs text-muted-foreground cursor-help max-w-[120px] line-clamp-2">{val.explanation}</div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{val.explanation}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )
        })}
      </div>
    </CardContent>
  </Card>
);

export default OptimizedScoreGrid;
