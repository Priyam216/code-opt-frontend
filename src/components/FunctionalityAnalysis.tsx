
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FunctionalityAnalysisProps {
  content: string;
}

const FunctionalityAnalysis: React.FC<FunctionalityAnalysisProps> = ({ content }) => {
  // Split the content by markdown headers to create sections
  const sections = content
    .split(/(?=^#+\s+.*$)/m)
    .filter(section => section.trim() !== '');
  
  // Function to extract the header title from a section
  const getHeaderTitle = (section: string): string => {
    const headerMatch = section.match(/^#+\s+(.*?)$/m);
    return headerMatch ? headerMatch[1] : 'Overview';
  };
  
  // Function to format the content with basic markdown-like styling
  const formatContent = (text: string): React.ReactNode => {
    // Remove the header from the beginning of the section
    const content = text.replace(/^#+\s+.*?$/m, '').trim();
    
    // Split by paragraphs and format each
    return content.split(/\n{2,}/g).map((paragraph, idx) => {
      // Format code blocks
      if (paragraph.match(/^```[\s\S]*?```$/m)) {
        const code = paragraph.replace(/^```(\w+)?\n([\s\S]*?)```$/m, '$2');
        return (
          <pre key={idx} className="bg-secondary/20 p-4 rounded-md my-4 overflow-x-auto">
            <code className="text-sm text-primary">{code}</code>
          </pre>
        );
      }
      
      // Format bullet points
      if (paragraph.match(/^\s*[-*]\s+/m)) {
        const items = paragraph
          .split(/\n/)
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/^\s*[-*]\s+/, ''));
        
        return (
          <ul key={idx} className="list-disc pl-5 my-3 space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-sm">{item}</li>
            ))}
          </ul>
        );
      }
      
      // Format numbered lists
      if (paragraph.match(/^\s*\d+\.\s+/m)) {
        const items = paragraph
          .split(/\n/)
          .filter(line => line.trim() !== '')
          .map(line => line.replace(/^\s*\d+\.\s+/, ''));
        
        return (
          <ol key={idx} className="list-decimal pl-5 my-3 space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-sm">{item}</li>
            ))}
          </ol>
        );
      }
      
      // Format bold text
      let formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Format italic text
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      // Format inline code
      formatted = formatted.replace(/`(.*?)`/g, '<code>$1</code>');
      
      // Secondary headers
      if (formatted.match(/^#+\s+/)) {
        const level = (formatted.match(/^(#+)/) || ['#'])[0].length;
        const text = formatted.replace(/^#+\s+/, '');
        return (
          <div key={idx} 
            className={`font-semibold my-3 ${
              level === 2 ? 'text-lg' : 
              level === 3 ? 'text-base' : 
              'text-sm'
            }`}>
            {text}
          </div>
        );
      }
      
      return (
        <p key={idx} 
           className="my-3 text-sm leading-relaxed" 
           dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <Card className="border border-border">
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section, index) => {
            const title = getHeaderTitle(section);
            return (
              <AccordionItem key={index} value={`section-${index}`} className="border-b border-border">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  {title}
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 px-1 text-sm">
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mb-2 prose-p:my-2">
                    {formatContent(section)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FunctionalityAnalysis;
