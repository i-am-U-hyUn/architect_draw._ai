import React from 'react';
import { ArchNode } from '../types';

interface LayersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: ArchNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: ArchNode) => void;
  onDeleteNode: (id: string) => void;
}

export const LayersDrawer: React.FC<LayersDrawerProps> = ({
  isOpen,
  onClose,
  nodes,
  selectedNodeId,
  onSelectNode,
  onDeleteNode
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-72 bg-[#121212] border-r border-[#262626] z-30 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 select-none">
      {/* Header */}
      <div className="p-4 border-b border-[#222222] flex justify-between items-center bg-[#161616]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c5a368] text-[20px]">layers</span>
          <h3 className="font-bold text-xs text-[#f5f5f5] uppercase tracking-wider font-serif-brand">
            Architecture Layers
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#202020]"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Nodes List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 bg-[#0e0e0e]">
        <span className="text-[10px] font-bold text-[#777777] uppercase tracking-wider px-2 mb-1">
          Canvas Elements ({nodes.length})
        </span>

        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;

          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`p-2.5 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1c1812] border-[#c5a368] text-[#f5f5f5] shadow-md'
                  : 'bg-[#141414] border-[#242424] text-[#a0a0a0] hover:bg-[#1a1a1a] hover:border-[#c5a368]/60 hover:text-[#f0f0f0]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-[#c5a368] shrink-0">
                  {node.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate leading-tight font-serif-brand">{node.title}</p>
                  <span className="text-[10px] text-[#777777] font-mono capitalize">{node.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNode(node.id);
                  }}
                  className="text-[#777777] hover:text-[#ef4444] p-1 rounded hover:bg-[#202020]"
                  title="Remove layer"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
