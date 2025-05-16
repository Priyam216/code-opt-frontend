
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: number;
  label?: string;
  improvement?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  label = 'improvement',
  improvement = true
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <div className={`flex items-center ${improvement ? 'text-green-500' : 'text-red-500'}`}>
              {improvement ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              <span className="font-semibold">{value}%</span>
            </div>
          </div>
          <Progress 
            value={value} 
            max={100}
            className={`h-2 ${improvement ? 'bg-green-200' : 'bg-red-200'}`}
            indicatorClassName={improvement ? 'bg-green-500' : 'bg-red-500'}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {value}% {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
