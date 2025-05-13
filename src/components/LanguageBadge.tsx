
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LanguageInfo } from '@/lib/api';

interface LanguageBadgeProps {
  language: LanguageInfo;
}

const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  if (!language) return null;
  
  const { name, confidence, color } = language;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className="flex items-center gap-2 px-2 py-1 font-mono" 
            style={{ 
              backgroundColor: `${color}20`, 
              color: color,
              borderColor: `${color}40`,
              borderWidth: '1px'
            }}
          >
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            />
            {name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="text-xs">
            <p>Detected Language: {name}</p>
            <p>Confidence: {(confidence * 100).toFixed(1)}%</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LanguageBadge;
