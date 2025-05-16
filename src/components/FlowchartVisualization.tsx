
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowchartData {
  steps: { id: string; label: string; }[];
  dependencies: { from: string; to: string; }[];
}

interface FlowchartVisualizationProps {
  workflow: FlowchartData;
}

const FlowchartVisualization: React.FC<FlowchartVisualizationProps> = ({ workflow }) => {
  // Process the workflow data into ReactFlow nodes and edges
  const nodes: Node[] = workflow.steps.map((step) => ({
    id: step.id,
    data: { label: step.label },
    position: { x: 0, y: 0 }, // Positions will be calculated by dagre layout
    type: 'default',
  }));

  const edges: Edge[] = workflow.dependencies.map((dep, index) => ({
    id: `e${dep.from}-${dep.to}`,
    source: dep.from,
    target: dep.to,
    type: 'smoothstep',
  }));

  // Automatically layout the nodes in a vertical flow diagram
  const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
    const nodeWidth = 172;
    const nodeHeight = 36;
    const gapBetweenLevels = 50;
    
    // Calculate node levels based on dependencies (simple approach)
    const nodeLevels: Record<string, number> = {};
    const calculateLevels = (nodeId: string, level = 0) => {
      if (nodeLevels[nodeId] === undefined || level > nodeLevels[nodeId]) {
        nodeLevels[nodeId] = level;
      }
      
      // Find all nodes that depend on this node
      const targetNodes = edges.filter(e => e.source === nodeId).map(e => e.target);
      targetNodes.forEach(target => calculateLevels(target, level + 1));
    };
    
    // Find root nodes (nodes with no incoming edges)
    const nodeIds = new Set(nodes.map(n => n.id));
    const targetsIds = new Set(edges.map(e => e.target));
    const rootNodes = Array.from(nodeIds).filter(id => !targetsIds.has(id));
    
    // Calculate levels starting from all root nodes
    rootNodes.forEach(rootId => calculateLevels(rootId));
    
    // Group nodes by level
    const nodesByLevel: Record<number, string[]> = {};
    Object.entries(nodeLevels).forEach(([nodeId, level]) => {
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(nodeId);
    });
    
    // Position nodes based on their level
    const positionedNodes = nodes.map(node => {
      const level = nodeLevels[node.id] || 0;
      const nodesInLevel = nodesByLevel[level]?.length || 1;
      const nodeIndex = nodesByLevel[level]?.indexOf(node.id) || 0;
      
      // Calculate position based on level and index within level
      const x = (nodeIndex - (nodesInLevel - 1) / 2) * (nodeWidth + 20);
      const y = level * (nodeHeight + gapBetweenLevels);
      
      return {
        ...node,
        position: { x, y },
      };
    });
    
    return { nodes: positionedNodes, edges };
  };
  
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);

  return (
    <Card>
      <CardContent className="p-4">
        <div style={{ height: 500 }} className="w-full">
          <ReactFlow
            nodes={layoutedNodes}
            edges={layoutedEdges}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowchartVisualization;
