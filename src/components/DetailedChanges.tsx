
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface DetailedChange {
  issue: string;
  improvement: string;
  location: string;
  metric: string;
}

interface DetailedChangesProps {
  changes: DetailedChange[];
}

const DetailedChanges: React.FC<DetailedChangesProps> = ({ changes }) => {
  // Group changes by metric
  const groupedChanges = changes.reduce<Record<string, DetailedChange[]>>((acc, change) => {
    if (!acc[change.metric]) {
      acc[change.metric] = [];
    }
    acc[change.metric].push(change);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {Object.entries(groupedChanges).map(([metric, metricChanges], index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2 text-left">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {metric}
                    </Badge>
                    <span className="text-sm font-medium">
                      {metricChanges.length} {metricChanges.length === 1 ? 'issue' : 'issues'} found
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Issue</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Improvement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metricChanges.map((change, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{change.issue}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{change.location}</TableCell>
                          <TableCell>{change.improvement}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedChanges;
