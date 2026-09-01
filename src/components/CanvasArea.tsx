import React, { useState, useRef, useEffect } from 'react';
import { ArchNode, ArchConnection, CanvasTool } from '../types';
import { NodeCard } from './NodeCard';
import { InspectorPanel } from './InspectorPanel';

interface CanvasAreaProps {
  nodes: ArchNode[];
  connections: ArchConnection[];
  selectedNodeId: string | null;
  onSelectNode: (node: ArchNode | null) => void;
  onUpdateNode: (node: ArchNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (node: ArchNode) => void;
  onAddConnection: (fromId: string, toId: string) => void;
  onDeleteConnection: (connId: string) => void;
  onOpenAddNodeModal: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  nodes,
  connections,
  selectedNodeId,
  onSelectNode,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onAddConnection,
  onDeleteConnection,
  onOpenAddNodeModal,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<CanvasTool>('select');

  // Dragging state for nodes
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartMouse, setDragStartMouse] = useState({ x: 0, y: 0 });
  const [dragStartNodePos, setDragStartNodePos] = useState({ x: 0, y: 0 });

  // Canvas Panning state
  const [isPanningCanvas, setIsPanningCanvas] = useState(false);
  const [panStartMouse, setPanStartMouse] = useState({ x: 0, y: 0 });

  // Connection creation in-flight
  const [connectingFrom, setConnectingFrom] = useState<{ nodeId: string; handle: string; x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 2.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleZoomReset = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Node Drag Handlers
  const handleStartDrag = (e: React.MouseEvent, node: ArchNode) => {
    if (activeTool === 'pan') return;
    e.stopPropagation();
    setDraggingNodeId(node.id);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
    setDragStartNodePos({ x: node.x, y: node.y });
  };

  // Connect Handle Start
  const handleStartConnect = (e: React.MouseEvent, node: ArchNode, handle: 'left' | 'right' | 'top' | 'bottom') => {
    e.stopPropagation();
    const nodeWidth = node.width || 210;
    const nodeHeight = 120; // Approximate card height
    const startX = handle === 'right' ? node.x + nodeWidth : node.x;
    const startY = node.y + nodeHeight / 2;

    setConnectingFrom({
      nodeId: node.id,
      handle,
      x: startX,
      y: startY
    });
  };

  // Canvas Mouse Down (Panning or Deselect)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // If middle click, spacebar, or pan tool is active -> Pan
    if (e.button === 1 || activeTool === 'pan' || e.altKey) {
      setIsPanningCanvas(true);
      setPanStartMouse({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    // Otherwise deselect node
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectNode(null);
      if (connectingFrom) setConnectingFrom(null);
    }
  };

  // Canvas Mouse Move (Dragging node, panning canvas, or drawing connection preview)
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const curX = (e.clientX - rect.left - panOffset.x) / zoom;
      const curY = (e.clientY - rect.top - panOffset.y) / zoom;
      setMousePos({ x: curX, y: curY });
    }

    // Panning canvas
    if (isPanningCanvas) {
      setPanOffset({
        x: e.clientX - panStartMouse.x,
        y: e.clientY - panStartMouse.y
      });
      return;
    }

    // Dragging active node
    if (draggingNodeId) {
      const deltaX = (e.clientX - dragStartMouse.x) / zoom;
      const deltaY = (e.clientY - dragStartMouse.y) / zoom;
      const targetNode = nodes.find((n) => n.id === draggingNodeId);
      if (targetNode) {
        onUpdateNode({
          ...targetNode,
          x: Math.round(dragStartNodePos.x + deltaX),
          y: Math.round(dragStartNodePos.y + deltaY)
        });
      }
    }
  };

  // Canvas Mouse Up
  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (isPanningCanvas) setIsPanningCanvas(false);
    if (draggingNodeId) setDraggingNodeId(null);

    // If we were connecting and released on a node
    if (connectingFrom) {
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      const targetCard = elementUnder?.closest('[id^="node-"]');
      if (targetCard) {
        const targetId = targetCard.id.replace('node-', '');
        if (targetId && targetId !== connectingFrom.nodeId) {
          onAddConnection(connectingFrom.nodeId, targetId);
        }
      }
      setConnectingFrom(null);
    }
  };

  // Calculate connection SVG bezier paths
  const renderConnections = () => {
    return connections.map((conn) => {
      const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
      const toNode = nodes.find((n) => n.id === conn.toNodeId);
      if (!fromNode || !toNode) return null;

      const fromW = fromNode.width || 210;
      const toW = toNode.width || 210;

      // Source point (right of fromNode)
      const x1 = fromNode.x + fromW;
      const y1 = fromNode.y + 55;

      // Target point (left of toNode)
      const x2 = toNode.x;
      const y2 = toNode.y + 55;

      // Smooth horizontal bezier curve
      const dx = Math.abs(x2 - x1) * 0.55;
      const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      const isDashed = conn.style === 'dashed' || conn.animated;

      return (
        <g key={conn.id} className="group/conn cursor-pointer">
          {/* Invisible thick stroke for easy click/hover */}
          <path
            d={pathData}
            fill="none"
            stroke="transparent"
            strokeWidth={14}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteConnection(conn.id);
            }}
          />
          {/* Visual path matching mockup */}
          <path
            d={pathData}
            fill="none"
            stroke={conn.style === 'pulse' ? '#c5a368' : '#2e2e2e'}
            strokeWidth={conn.style === 'pulse' ? 2.5 : 2}
            strokeDasharray={isDashed ? '5 5' : undefined}
            className={`transition-colors group-hover/conn:stroke-[#c5a368] ${
              conn.animated ? 'animate-pulse' : ''
            }`}
          />
          {/* Connection endpoint pip */}
          <circle cx={x2} cy={y2} r={3.5} fill="#c5a368" />
        </g>
      );
    });
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="flex-1 flex overflow-hidden relative select-none bg-[#0a0a0a]">
      {/* Canvas Viewport */}
      <main
        ref={containerRef}
        id="canvas-container"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={(e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (e.deltaY < 0) handleZoomIn();
            else handleZoomOut();
          }
        }}
        className={`flex-1 relative dot-grid overflow-hidden bg-[#0a0a0a] ${
          activeTool === 'pan' || isPanningCanvas ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* Floating Canvas Toolbar (Top Center) */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#141414] popover-shadow rounded-full px-3 py-1.5 flex items-center gap-1 border border-[#2a2a2a] z-30 shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTool('pan')}
            title="Pan Tool (Hand)"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              activeTool === 'pan'
                ? 'bg-[#c5a368]/20 text-[#c5a368] font-bold'
                : 'text-[#8e8e8e] hover:text-[#f0f0f0] hover:bg-[#1f1f1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">pan_tool</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('select')}
            title="Select Tool (Arrow)"
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              activeTool === 'select'
                ? 'bg-[#c5a368]/20 text-[#c5a368] font-bold'
                : 'text-[#8e8e8e] hover:text-[#f0f0f0] hover:bg-[#1f1f1f]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">arrow_selector_tool</span>
          </button>

          <div className="w-px h-4 bg-[#2e2e2e] mx-1" />

          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-[#8e8e8e] hover:text-[#f0f0f0] hover:bg-[#1f1f1f] rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">undo</span>
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-[#8e8e8e] hover:text-[#f0f0f0] hover:bg-[#1f1f1f] rounded-full transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">redo</span>
          </button>

          <div className="w-px h-4 bg-[#2e2e2e] mx-1" />

          <button
            type="button"
            onClick={onOpenAddNodeModal}
            title="Add Node"
            className="p-1.5 text-[#c5a368] hover:bg-[#c5a368]/20 rounded-full transition-colors cursor-pointer flex items-center gap-1 font-semibold text-xs px-2.5"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add</span>
          </button>
        </div>

        {/* Scaled / Panned Transform Layer */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '3200px',
            height: '2400px',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        >
          {/* SVG Connection Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
            {renderConnections()}

            {/* In-flight connection preview while dragging handle */}
            {connectingFrom && (
              <path
                d={`M ${connectingFrom.x} ${connectingFrom.y} C ${connectingFrom.x + 80} ${connectingFrom.y}, ${mousePos.x - 80} ${mousePos.y}, ${mousePos.x} ${mousePos.y}`}
                fill="none"
                stroke="#c5a368"
                strokeWidth={2}
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Flowchart Nodes */}
          {nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onSelect={onSelectNode}
              onStartDrag={handleStartDrag}
              onStartConnect={handleStartConnect}
              onDeleteNode={onDeleteNode}
              onDuplicateNode={onDuplicateNode}
            />
          ))}
        </div>

        {/* Zoom Controls Widget (Bottom Right) */}
        <div className="absolute bottom-6 right-6 bg-[#141414] popover-shadow rounded-lg border border-[#2a2a2a] flex flex-col overflow-hidden z-30 shadow-2xl">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2.5 text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors border-b border-[#222222] flex justify-center items-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>

          <button
            onClick={handleZoomReset}
            title="Reset Zoom"
            className="py-1 px-2.5 text-center font-mono text-[11px] font-semibold text-[#c5a368] bg-[#181818] border-b border-[#222222] hover:bg-[#222222] cursor-pointer"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2.5 text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#1e1e1e] transition-colors flex justify-center items-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
        </div>

        {/* MiniMap Widget (Bottom Left) */}
        <div className="absolute bottom-6 left-6 w-48 h-32 bg-[#141414] popover-shadow rounded-lg border border-[#2a2a2a] z-30 overflow-hidden hidden lg:block shadow-2xl">
          <div className="w-full h-full relative bg-[#0e0e0e] p-2">
            <span className="absolute top-1 left-2 text-[9px] font-mono text-[#888888] uppercase tracking-wider font-bold">
              Minimap
            </span>
            {/* Miniature Node Dots */}
            {nodes.map((n) => {
              const miniX = (n.x / 1400) * 160;
              const miniY = (n.y / 1000) * 90;
              return (
                <div
                  key={n.id}
                  style={{
                    left: `${Math.max(4, Math.min(150, miniX))}px`,
                    top: `${Math.max(14, Math.min(85, miniY))}px`,
                    width: '14px',
                    height: '9px'
                  }}
                  className={`absolute rounded-xs transition-colors ${
                    n.id === selectedNodeId
                      ? 'bg-[#c5a368] ring-1 ring-white shadow-sm'
                      : 'bg-[#333333]'
                  }`}
                />
              );
            })}

            {/* Viewport Indicator */}
            <div
              style={{
                left: `${Math.max(0, -panOffset.x / 20)}px`,
                top: `${Math.max(0, -panOffset.y / 20)}px`,
                width: `${Math.min(130, 80 / zoom)}px`,
                height: `${Math.min(80, 50 / zoom)}px`
              }}
              className="absolute border border-[#c5a368]/70 bg-[#c5a368]/10 rounded-xs pointer-events-none"
            />
          </div>
        </div>
      </main>

      {/* Slide-over Node Inspector on the Right */}
      {selectedNode && (
        <InspectorPanel
          node={selectedNode}
          onClose={() => onSelectNode(null)}
          onUpdateNode={onUpdateNode}
          onDeleteNode={(id) => {
            onDeleteNode(id);
            onSelectNode(null);
          }}
        />
      )}
    </div>
  );
};
