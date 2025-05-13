
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Download, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WorkflowData } from '@/lib/api';

interface FlowchartVisualizationProps {
  workflow: WorkflowData;
}

// Custom node styling based on type
const getNodeStyle = (type: string, isOptimizable: boolean) => {
  const baseStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    width: 180,
  };

  // Add color styling based on node type
  let typeStyle = {};
  switch (type) {
    case 'entry':
      typeStyle = { background: 'rgba(66, 153, 225, 0.15)', border: '1.5px solid #4299E1' };
      break;
    case 'conditional':
      typeStyle = { background: 'rgba(159, 122, 234, 0.15)', border: '1.5px solid #9F7AEA' };
      break;
    case 'function':
      typeStyle = { background: 'rgba(72, 187, 120, 0.15)', border: '1.5px solid #48BB78' };
      break;
    case 'operation':
      typeStyle = { background: 'rgba(237, 137, 54, 0.15)', border: '1.5px solid #ED8936' };
      break;
    case 'return':
      typeStyle = { background: 'rgba(237, 100, 166, 0.15)', border: '1.5px solid #ED64A6' };
      break;
    default:
      typeStyle = { background: 'rgba(113, 128, 150, 0.15)', border: '1.5px solid #718096' };
  }
  
  // Add optimizable styling if needed
  const optimizableStyle = isOptimizable
    ? { boxShadow: '0 0 0 2px rgba(245, 101, 101, 0.5)', borderColor: 'rgb(245, 101, 101)' }
    : {};

  return { ...baseStyle, ...typeStyle, ...optimizableStyle };
};

// Custom node component with tooltip for optimizable steps
const CustomNode = ({ data, isConnectable }: { data: any, isConnectable: boolean }) => {
  const nodeContent = (
    <div style={getNodeStyle(data.type, data.isOptimizable)} className="animate-fade-in">
      <div style={{ fontWeight: 600 }}>{data.label}</div>
      <div style={{ fontSize: '10px', opacity: 0.8 }}>{data.type}</div>
    </div>
  );

  if (data.isOptimizable) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{nodeContent}</TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">This step can be optimized</p>
            {data.optimizationReason && (
              <p className="text-xs font-medium text-amber-400 mt-1">{data.optimizationReason}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return nodeContent;
};

const nodeTypes: NodeTypes = {
  custom: CustomNode
};

const FlowchartControls = () => {
  const { fitView, getScreenshot } = useReactFlow();
  
  const onDownload = useCallback(() => {
    // Using ReactFlow's getScreenshot API to download the flowchart
    getScreenshot().then((dataUrl) => {
      const a = document.createElement('a');
      a.setAttribute('download', 'flowchart.png');
      a.setAttribute('href', dataUrl);
      a.click();
    });
  }, [getScreenshot]);

  const onFullscreen = useCallback(() => {
    // Find the ReactFlow container and request fullscreen
    const flowContainer = document.querySelector('.react-flow');
    if (flowContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        flowContainer.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
  }, []);

  return (
    <Panel position="top-right">
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onDownload} className="h-8 px-2">
          <Download size={16} className="mr-1" />
          <span className="text-xs">Export</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={onFullscreen} className="h-8 px-2">
          <Maximize2 size={16} className="mr-1" />
          <span className="text-xs">Fullscreen</span>
        </Button>
      </div>
    </Panel>
  );
};

const WorkflowChart = ({ workflow }: FlowchartVisualizationProps) => {
  const { nodes: rawNodes, edges: rawEdges, optimizableSteps } = workflow;

  // Convert API data to ReactFlow nodes and edges
  const nodes: Node[] = rawNodes.map(node => {
    const isOptimizable = optimizableSteps.includes(node.id);
    
    return {
      id: node.id,
      type: 'custom',
      position: { x: node.position?.x || 0, y: node.position?.y || 0 },
      data: { 
        ...node,
        isOptimizable,
        optimizationReason: isOptimizable ? "Can be optimized for better performance" : null
      }
    };
  });

  // Assign positions if not provided (simple top-to-bottom layout)
  if (!nodes.some(node => node.position.x !== 0 && node.position.y !== 0)) {
    nodes.forEach((node, index) => {
      node.position = { x: 100 + (index % 3) * 250, y: 100 + Math.floor(index / 3) * 100 };
    });
  }

  // Convert edges
  const edges: Edge[] = rawEdges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: optimizableSteps.includes(edge.source) || optimizableSteps.includes(edge.target),
    style: { stroke: '#555' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: '#555',
    },
    type: 'smoothstep',
  }));

  return (
    <div style={{ height: 400 }}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
      >
        <FlowchartControls />
        <Background color="#444" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data?.isOptimizable) return '#F56565';
            switch (node.data?.type) {
              case 'entry': return '#4299E1';
              case 'conditional': return '#9F7AEA';
              case 'function': return '#48BB78';
              case 'operation': return '#ED8936';
              case 'return': return '#ED64A6';
              default: return '#718096';
            }
          }} 
          maskColor="rgba(0, 0, 0, 0.2)"
        />
      </ReactFlow>
    </div>
  );
};

// Wrap with provider to ensure all React Flow hooks work
const FlowchartVisualization = ({ workflow }: FlowchartVisualizationProps) => {
  if (!workflow) return null;
  
  return (
    <Card className="mb-6 overflow-hidden border border-border bg-card/50">
      <CardContent className="p-0">
        <ReactFlowProvider>
          <WorkflowChart workflow={workflow} />
        </ReactFlowProvider>
      </CardContent>
    </Card>
  );
};

export default FlowchartVisualization;
