
import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  MarkerType,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Download, Expand } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FlowchartData, WorkflowData } from '@/lib/api';

interface FlowchartVisualizationProps {
  flowchart?: FlowchartData;
  workflow?: WorkflowData; // Legacy support
}

// Custom node styling
const getNodeStyle = (isOptimizable: boolean) => {
  const baseStyle = {
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '12px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    width: 180,
    background: 'rgba(66, 153, 225, 0.15)',
    border: '1.5px solid #4299E1',
  };
  
  // Add optimizable styling if needed
  const optimizableStyle = isOptimizable
    ? { border: '1.5px solid rgb(245, 101, 101)', background: 'rgba(245, 101, 101, 0.15)' }
    : {};

  return { ...baseStyle, ...optimizableStyle };
};

// Custom node component with tooltip for optimizable steps
const CustomNode = ({ data, isConnectable }: { data: any, isConnectable: boolean }) => {
  const nodeContent = (
    <div style={getNodeStyle(data.isOptimizable)}>
      <div style={{ fontWeight: 600 }}>{data.label}</div>
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
  const { fitView } = useReactFlow();
  
  const onDownload = useCallback(() => {
    // This is a placeholder - in a real implementation, you'd use react-flow's 
    // getScreenshot() or another method to download the flowchart
    alert("Download functionality would be implemented here");
  }, []);

  const onFullscreen = useCallback(() => {
    // This is a placeholder for fullscreen functionality
    alert("Fullscreen functionality would be implemented here");
  }, []);

  return (
    <Panel position="top-right">
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={onDownload} className="h-8 px-2">
          <Download size={16} className="mr-1" />
          <span className="text-xs">Export</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={onFullscreen} className="h-8 px-2">
          <Expand size={16} className="mr-1" />
          <span className="text-xs">Fullscreen</span>
        </Button>
      </div>
    </Panel>
  );
};

// Helper function to convert new flowchart data to ReactFlow format
const convertFlowchartToReactFlow = (flowchart: FlowchartData): { nodes: Node[], edges: Edge[] } => {
  // Create a map of optimizable steps for quick lookup
  const optimizableStepsMap = new Map(
    flowchart.optimizable_steps.map(step => [step.id, step.reason])
  );
  
  // Convert nodes
  const nodes: Node[] = flowchart.steps.map((step, index) => {
    const isOptimizable = optimizableStepsMap.has(step.id);
    const row = Math.floor(index / 3);
    const col = index % 3;
    
    return {
      id: step.id,
      type: 'custom',
      position: { x: 100 + col * 250, y: 100 + row * 100 },
      data: {
        label: step.label,
        isOptimizable,
        optimizationReason: optimizableStepsMap.get(step.id) || null,
      },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    };
  });
  
  // Convert edges
  const edges: Edge[] = flowchart.dependencies.map((dep, index) => ({
    id: `edge-${dep.from}-${dep.to}`,
    source: dep.from,
    target: dep.to,
    animated: optimizableStepsMap.has(dep.from) || optimizableStepsMap.has(dep.to),
    style: { stroke: '#555' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  }));
  
  return { nodes, edges };
};

// Helper function to convert legacy workflow data to ReactFlow format (for backward compatibility)
const convertWorkflowToReactFlow = (workflow: WorkflowData): { nodes: Node[], edges: Edge[] } => {
  // Create a set of optimizable steps for quick lookup
  const optimizableSteps = new Set(workflow.optimizableSteps);
  
  // Convert nodes
  const nodes: Node[] = workflow.nodes.map(node => {
    const isOptimizable = optimizableSteps.has(node.id);
    
    return {
      id: node.id,
      type: 'custom',
      position: { x: 0, y: 0 }, // Positions should come from API or be calculated
      data: { 
        ...node,
        isOptimizable,
        optimizationReason: isOptimizable ? "Can be optimized for better performance" : null
      }
    };
  });

  // Assign positions if not provided (simple top-to-bottom layout)
  nodes.forEach((node, index) => {
    node.position = { x: 100 + (index % 3) * 250, y: 100 + Math.floor(index / 3) * 100 };
  });

  // Convert edges
  const edges: Edge[] = workflow.edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: optimizableSteps.has(edge.source) || optimizableSteps.has(edge.target),
    style: { stroke: '#555' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    }
  }));
  
  return { nodes, edges };
};

const WorkflowChart = ({ flowchart, workflow }: FlowchartVisualizationProps) => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  
  // Process new format if available, otherwise fall back to legacy format
  if (flowchart) {
    const reactFlowData = convertFlowchartToReactFlow(flowchart);
    nodes = reactFlowData.nodes;
    edges = reactFlowData.edges;
  } else if (workflow) {
    const reactFlowData = convertWorkflowToReactFlow(workflow);
    nodes = reactFlowData.nodes;
    edges = reactFlowData.edges;
  }

  return (
    <div style={{ height: 400 }}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <FlowchartControls />
        <Background color="#444" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.data?.isOptimizable) return '#F56565';
            return '#4299E1';
          }} 
          maskColor="rgba(0, 0, 0, 0.2)"
        />
      </ReactFlow>
    </div>
  );
};

// Wrap with provider to ensure all React Flow hooks work
const FlowchartVisualization = ({ flowchart, workflow }: FlowchartVisualizationProps) => {
  if (!flowchart && !workflow) return null;
  
  return (
    <Card className="mb-6 overflow-hidden border border-border bg-card/50">
      <CardContent className="p-0">
        <ReactFlowProvider>
          <WorkflowChart flowchart={flowchart} workflow={workflow} />
        </ReactFlowProvider>
      </CardContent>
    </Card>
  );
};

export default FlowchartVisualization;
