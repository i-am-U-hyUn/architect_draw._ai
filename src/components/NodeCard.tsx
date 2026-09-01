import React, { useState } from 'react';
import { ArchNode } from '../types';

interface NodeCardProps {
  node: ArchNode;
  isSelected: boolean;
  onSelect: (node: ArchNode) => void;
  onStartDrag: (e: React.MouseEvent, node: ArchNode) => void;
  onStartConnect: (e: React.MouseEvent, node: ArchNode, handle: 'left' | 'right' | 'top' | 'bottom') => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (node: ArchNode) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onStartDrag,
  onStartConnect,
  onDeleteNode,
  onDuplicateNode
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusBadge = () => {
    switch (node.status) {
      case 'active':
        return (
          <span className="bg-[#1e1a12] text-[#c5a368] border border-[#c5a368]/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Active
          </span>
        );
      case 'standby':
        return (
          <span className="bg-[#1c1c1c] text-[#888888] border border-[#2e2e2e] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Standby
          </span>
        );
      case 'syncing':
        return (
          <span className="bg-[#1e1a12] text-[#c5a368] border border-[#c5a368]/40 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a368] animate-ping" />
            Syncing
          </span>
        );
      case 'error':
        return (
          <span className="bg-[#2a1313] text-[#ef4444] border border-[#ef4444]/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
            Degraded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`node-${node.id}`}
      style={{
        transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
        width: node.width || 210,
        zIndex: isSelected ? 30 : 10
      }}
      onMouseDown={(e) => {
        // Only trigger drag if not clicking context menu or handle
        if ((e.target as HTMLElement).closest('.no-drag')) return;
        onStartDrag(e, node);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
      className={`absolute select-none bg-[#141414] rounded-lg transition-all duration-150 cursor-grab active:cursor-grabbing ${
        isSelected
          ? 'border-2 border-[#c5a368] ring-4 ring-[#c5a368]/20 shadow-2xl gold-glow'
          : 'border border-[#262626] hover:border-[#c5a368]/70 shadow-lg hover:shadow-xl'
      } p-3.5 flex flex-col gap-2.5 group`}
    >
      {/* Connection Handles (Pins) on 4 sides */}
      <button
        type="button"
        title="Connect Output"
        className="no-drag absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#141414] border-2 border-[#c5a368] rounded-full opacity-0 group-hover:opacity-100 hover:scale-125 transition-all shadow-md z-30 cursor-crosshair flex items-center justify-center"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(e, node, 'right');
        }}
      >
        <span className="w-1.5 h-1.5 bg-[#c5a368] rounded-full" />
      </button>

      <button
        type="button"
        title="Connect Input"
        className="no-drag absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#141414] border-2 border-[#c5a368] rounded-full opacity-0 group-hover:opacity-100 hover:scale-125 transition-all shadow-md z-30 cursor-crosshair flex items-center justify-center"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnect(e, node, 'left');
        }}
      >
        <span className="w-1.5 h-1.5 bg-[#c5a368] rounded-full" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#222222] pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-[#c5a368] text-[20px] shrink-0">
            {node.icon || 'router'}
          </span>
          <div className="min-w-0">
            <span className="font-semibold text-xs text-[#f5f5f5] block truncate font-serif-brand tracking-tight">
              {node.title}
            </span>
          </div>
        </div>

        {/* 3-dots Context Menu */}
        <div className="relative no-drag">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-[#777777] hover:text-[#c5a368] p-0.5 rounded hover:bg-[#202020] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>

          {showMenu && (
            <div 
              className="absolute right-0 top-6 w-36 bg-[#181818] rounded-lg shadow-2xl border border-[#2a2a2a] py-1 z-50 animate-in fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onSelect(node);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#e2e2e2] hover:bg-[#222222] hover:text-[#c5a368] flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">tune</span>
                Inspect
              </button>
              <button
                onClick={() => {
                  onDuplicateNode(node);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#e2e2e2] hover:bg-[#222222] hover:text-[#c5a368] flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                Duplicate
              </button>
              <div className="border-t border-[#262626] my-1" />
              <button
                onClick={() => {
                  onDeleteNode(node.id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 flex items-center gap-2 cursor-pointer font-medium"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Delete Node
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Properties Table & Metrics */}
      <div className="flex flex-col gap-1.5 font-mono text-[12px]">
        {node.properties && node.properties.map((prop, idx) => (
          <div key={idx} className="flex justify-between items-center text-[#aaaaaa]">
            <span className="text-[#777777] text-[11px]">{prop.label}</span>
            <span className="font-medium text-[#e2e2e2] text-[11px]">{prop.value}</span>
          </div>
        ))}

        {/* Progress Bar (like DB capacity) */}
        {node.progressPercent !== undefined && (
          <div className="w-full bg-[#222222] rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-[#c5a368] h-1.5 rounded-full transition-all"
              style={{ width: `${node.progressPercent}%` }}
            />
          </div>
        )}

        {/* Status Chip if standby or active */}
        {node.status && (
          <div className="flex justify-end items-center mt-1">
            {getStatusBadge()}
          </div>
        )}
      </div>
    </div>
  );
};
