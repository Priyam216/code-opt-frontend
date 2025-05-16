
import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CodeEditorProps {
  code: string;
  language?: string;
  title?: string;
  editable?: boolean;
  diffLines?: number[];
  diffType?: 'added' | 'removed' | 'highlight';
  className?: string;
  onCodeChange?: (value: string) => void;
  onCopy?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'javascript',
  title = 'Code Editor',
  editable = false,
  diffLines = [],
  diffType = 'added',
  className = '',
  onCodeChange,
  onCopy
}) => {
  const editorRef = useRef<any>(null);
  
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    if (diffLines.length > 0) {
      const model = editor.getModel();
      const decorations = diffLines.map((lineNumber) => ({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: `diff-${diffType}`,
          linesDecorationsClassName: `diff-${diffType}-gutter`,
        }
      }));
      
      editor.createDecorationsCollection(decorations);
    }
  };
  
  const handleCopyClick = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(code);
    }
  };
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="py-3 px-4 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {!editable && (
          <Button 
            onClick={handleCopyClick} 
            size="sm" 
            variant="ghost"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="text-xs">Copy</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 h-[calc(100%-40px)]">
        <Editor
          height="100%"
          language={language}
          value={code}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            readOnly: !editable,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            automaticLayout: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            }
          }}
          onChange={value => onCodeChange && onCodeChange(value || '')}
          onMount={handleEditorDidMount}
          className="monaco-editor-container"
        />
      </CardContent>
    </Card>
  );
};

export default CodeEditor;
