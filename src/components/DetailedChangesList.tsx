
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
/**
 * Detailed Changes List
 * Mirrors 'Optimization Opportunities' style from Analysis Results.
 * Expected backend prop: Array<{ issue, improvement, location, metric }>
 */
interface ChangeItem {
  issue: string;
  improvement: string;
  location: string;
  metric: string;
}
interface DetailedChangesListProps {
  changes: ChangeItem[];
}

const iconMap: Record<string, React.ReactNode> = {
  CPU: <span role="img" aria-label="CPU">⚡</span>,
  Memory: <span role="img" aria-label="Memory">💾</span>,
  Scalability: <span role="img" aria-label="Scalability">📈</span>,
  Security: <span role="img" aria-label="Security">🛡️</span>,
  vectorization: <span role="img" aria-label="Vectorization">🏎️</span>,
  default: <span role="img" aria-label="Improvement">🔧</span>,
};

const DetailedChangesList: React.FC<DetailedChangesListProps> = ({ changes }) => {
  if (!changes?.length) return null;

  return (
    <Card className="border mt-2 shadow bg-[#22223b]/80">
      <CardContent className="py-4 px-6">
        <div className="font-semibold text-base mb-3">Detailed Changes</div>
        <div className="divide-y divide-border">
          {changes.map((item, i) => {
            const met = (item.metric || "").toLowerCase();
            let icon = iconMap.default;
            if (met.includes("cpu")) icon = iconMap.CPU;
            else if (met.includes("mem")) icon = iconMap.Memory;
            else if (met.includes("scalab")) icon = iconMap.Scalability;
            else if (met.includes("secur")) icon = iconMap.Security;
            else if (met.includes("vector")) icon = iconMap.vectorization;
            return (
              <div
                key={i}
                className="py-3 grid gap-2 grid-cols-1 md:grid-cols-5 items-center hover:bg-white/5 transition-all rounded-lg"
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-xl mr-2">{icon}</span>
                  <span className="font-medium">{item.issue}</span>
                </div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {item.improvement}
                </div>
                <div className="col-span-1 text-xs text-primary/70">{item.metric}</div>
                <div className="col-span-1 text-xs">{item.location}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedChangesList;
