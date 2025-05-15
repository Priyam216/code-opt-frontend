
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Zap, Shield } from "lucide-react";
// Icons for each metric/category
const iconMap: Record<string, any> = {
  Performance: Zap,
  Security: Shield
}
interface ChangeItem {
  category: string;
  issue: string;
  suggestion: string;
  location: string;
  metric: string;
}
const OptimizedChangesList: React.FC<{ changes: ChangeItem[] }> = ({ changes }) => (
  <Card className="border mt-2 shadow bg-[#22223b]/80">
    <CardContent className="py-4 px-6">
      <div className="font-semibold text-base mb-3">Detailed Changes</div>
      <div className="space-y-3">
        {changes.map((c, i) => {
          const Icon = iconMap[c.category] || Zap;
          return (
            <Collapsible key={i} defaultOpen={i === 0}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <Icon className="w-5 h-5 text-green-400" />
                  <span className="flex-1 font-medium">{c.issue}</span>
                  <span className="text-xs text-primary/80">{c.metric}</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="ml-8 mt-1 mb-4 text-sm space-y-1">
                  <div><span className="text-muted-foreground">Location:</span> {c.location}</div>
                  <div><span className="text-muted-foreground">Suggestion:</span> {c.suggestion}</div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

export default OptimizedChangesList;
