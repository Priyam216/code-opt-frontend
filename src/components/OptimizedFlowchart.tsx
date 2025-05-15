import React, { useMemo, useRef } from 'react';
import {
  MiniMap,
  Controls,
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Download, Expand } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

// Props type
export interface OptimizedFlowchartProps {
  data: {
    steps: { id: string; label: string; }[];
    dependencies: { from: string; to: string; }[];
    optimizable_steps?: { id: string; reason: string; }[];
  };
}
// Utility for demo to create loop detection (shows dashed lines on cycles)
function detectLoops(edges: any[]) {
  const adj: Record<string, string[]> = {};
  edges.forEach(e => {
    if (!adj[e.source]) adj[e.source] = [];
    adj[e.source].push(e.target);
  });
  const visited = new Set();
  const path = new Set();

  const hasCycle = (node: string): boolean => {
    if (path.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    path.add(node);
    const children = adj[node] || [];
    for (let c of children) {
      if (hasCycle(c)) return true;
    }
    path.delete(node);
    return false;
  };
  return Object.keys(adj).some(n => hasCycle(n));
}

// Node styles
const nodeStyle = {
  borderRadius: 12,
  padding: 0,
  fontWeight: 500,
  fontSize: 15,
  boxShadow: '0 2px 8px rgba(60,66,130,0.07)'
};

const optBg = 'bg-green-900/40 border-green-400 ring-green-500';

const OptimizedFlowchart: React.FC<OptimizedFlowchartProps> = ({ data }) => {
  // Memoize nodes/edges for performance
  const nodes = useMemo(() => {
    return data.steps.map(step => {
      const opt = (data.optimizable_steps || []).find(s => s.id === step.id);
      return {
        id: step.id,
        data: { label: step.label, reason: opt ? opt.reason : null },
        // Randomly place nodes (could be improved for production)
        position: { x: Math.random() * 100, y: Math.random() * 250 },
        style: {
          ...nodeStyle,
          border: opt ? '2.5px solid #4ade80' : '1px solid #363946',
          background: opt ? 'rgba(16,185,129,.09)' : '#232337',
          color: "white",
        },
        className: opt ? optBg : "",
        // FIX: Use Position enum instead of string
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }
    });
  }, [data]);

  const edges = useMemo(() => {
    return data.dependencies.map(dep => {
      // Detect if this dependency creates a loop for preview (dashed line)
      const isLoop = dep.from === dep.to; // Simple, for demo
      return {
        id: `${dep.from}-${dep.to}`,
        source: dep.from,
        target: dep.to,
        animated: true,
        style: {
          stroke: isLoop ? '#fb953b' : '#4ade80',
          strokeDasharray: isLoop ? '7,3' : undefined,
          strokeWidth: 2.5,
        },
        markerEnd: { type: MarkerType.ArrowClosed, color: isLoop ? '#fb953b' : '#4ade80' }
      }
    });
  }, [data]);

  // Loop detection for UX note or dashed styling
  const hasLoops = useMemo(() => detectLoops(edges), [edges]);

  // Export as PNG function: customize for SVG if needed
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const download = async () => {
    // [Backend Integration] - Use backend for large SVG rendering if necessary
    if (!reactFlowWrapper.current) return;
    const svg = reactFlowWrapper.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "optimized_flowchart.svg";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fullscreen mode
  const handleFullscreen = () => {
    if (!reactFlowWrapper.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      reactFlowWrapper.current.requestFullscreen();
    }
  };

  // Comments for backend integration: Replace static props/data with <useQuery> or custom hooks to fetch runtime flowchart

  return (
    <Card className="border mt-2 mb-6 overflow-hidden bg-card/90 shadow">
      <CardContent className="p-0">
        <div className="relative">
          {/* Controls overlay */}
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm" onClick={download} className="h-8 px-2">
                    <Download size={16} className="mr-1" />
                    <span className="text-xs">Download</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="text-xs">Download as SVG</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="sm" onClick={handleFullscreen} className="h-8 px-2">
                    <Expand size={16} className="mr-1" />
                    <span className="text-xs">Fullscreen</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="text-xs">Expand flowchart</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div
            ref={reactFlowWrapper}
            style={{ height: 330, width: '100%', background: "transparent" }}
            className="bg-editor-bg rounded"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              proOptions={{ hideAttribution: true }}
              panOnScroll={true}
              className="dark"
              minZoom={0.4}
              maxZoom={1.6}
            >
              <MiniMap zoomable pannable nodeColor={() => '#06d6a0'} maskColor="#232337d9" />
              <Controls />
              <Background color="#232337" gap={18} />
            </ReactFlow>
          </div>
          {hasLoops && <div className="absolute bottom-2 left-5 text-xs text-orange-400">Loop detected (shown as dashed arrow)</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedFlowchart;
