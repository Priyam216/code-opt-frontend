
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LanguageInfo } from '@/lib/api';

interface LanguageBadgeProps {
  language: LanguageInfo;
}

// Map of language names to their respective colors
const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  CSharp: '#178600',
  CPlusPlus: '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Scala: '#c22d40',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  PowerShell: '#012456',
  R: '#198CE7',
  Dart: '#00B4AB',
  // Add more languages as needed
};

const LanguageBadge = ({ language }: LanguageBadgeProps) => {
  if (!language) return null;
  
  const { name, confidence } = language;
  const color = languageColors[name] || '#9E76E8'; // Default to purple if language not found

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className="flex items-center gap-2 px-3 py-1.5 font-mono transition-all duration-300 animate-fade-in" 
            style={{ 
              backgroundColor: `${color}20`, 
              color: color,
              borderColor: `${color}40`,
              borderWidth: '1px'
            }}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="font-medium">{name}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-popover border-border animate-fade-in">
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
