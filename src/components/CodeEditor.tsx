
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CodeEditorProps {
  title: string;
  code: string;
  editable?: boolean;
  diffLines?: number[];
  diffType?: 'added' | 'removed' | 'highlight';
  onCodeChange?: (code: string) => void;
  onCopy?: () => void;
  className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  title,
  code,
  editable = false,
  diffLines = [],
  diffType,
  onCodeChange,
  onCopy,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onCodeChange) {
      onCodeChange(e.target.value);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    if (onCopy) {
      onCopy();
    }
  };

  // Create an array of code lines with line numbers
  const codeLines = code.split('\n');
  
  return (
    <div className={`flex flex-col h-full bg-editor-bg rounded-md border border-border shadow-md ${className}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            className="h-8 w-8 hover:bg-muted/50"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative flex-grow overflow-hidden">
        <div className="absolute inset-0 flex h-full">
          <div className="flex-none py-2 px-2 text-right text-xs text-muted-foreground bg-editor-bg border-r border-border w-[40px]">
            {codeLines.map((_, i) => (
              <div key={`line-${i}`} className="h-6">{i + 1}</div>
            ))}
          </div>
          <div className="flex-grow overflow-auto">
            {editable ? (
              <textarea
                value={code}
                onChange={handleChange}
                className="font-mono text-sm w-full h-full bg-editor-bg text-foreground p-2 resize-none outline-none"
                spellCheck={false}
              />
            ) : (
              <pre className="font-mono text-sm p-0 m-0 h-full">
                <code>
                  {codeLines.map((line, i) => (
                    <div
                      key={`code-${i}`}
                      className={`code-line h-6 ${diffLines.includes(i) ? `diff-${diffType}` : ''}`}
                    >
                      {line || ' '}
                    </div>
                  ))}
                </code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
