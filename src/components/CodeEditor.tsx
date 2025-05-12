
import React, { useRef, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
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
  language?: string;
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
  language = "javascript",
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    
    // Apply decorations for diff lines if needed
    if (diffLines.length > 0 && diffType) {
      const decorations = diffLines.map(lineIndex => ({
        range: new monaco.Range(lineIndex + 1, 1, lineIndex + 1, 1),
        options: {
          isWholeLine: true,
          className: `diff-${diffType}`,
          linesDecorationsClassName: `diff-${diffType}-gutter`,
        }
      }));
      
      editor.createDecorationsCollection(decorations);
    }
    
    // Handle read-only state
    if (!editable) {
      editor.updateOptions({ readOnly: true });
    }
  };

  const handleChange = (value: string | undefined) => {
    if (onCodeChange && value !== undefined) {
      onCodeChange(value);
    }
  };

  const handleCopy = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard.writeText(code);
      if (onCopy) {
        onCopy();
      }
    }
  };
  
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
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={code}
          value={code}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13,
            lineNumbers: "on",
            folding: true,
            suggest: { showMethods: true },
            wordWrap: "on",
            theme: "vs-dark",
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
          }}
          className="monaco-editor-container"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
