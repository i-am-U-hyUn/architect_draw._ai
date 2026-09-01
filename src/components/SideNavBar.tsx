import React from 'react';
import { SidebarTab } from '../types';

interface SideNavBarProps {
  activeSidebarTab: SidebarTab;
  setActiveSidebarTab: (tab: SidebarTab) => void;
  onOpenAddNode: () => void;
  onOpenHelp: () => void;
  onOpenFeedback: () => void;
  nodeCount: number;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  activeSidebarTab,
  setActiveSidebarTab,
  onOpenAddNode,
  onOpenHelp,
  onOpenFeedback,
  nodeCount
}) => {
  const navItems: { id: SidebarTab; label: string; icon: string; badge?: string | number }[] = [
    { id: 'layers', label: 'Layers', icon: 'layers', badge: nodeCount },
    { id: 'assets', label: 'Assets', icon: 'grid_view' },
    { id: 'flows', label: 'Flows', icon: 'account_tree' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'settings', label: 'Settings', icon: 'tune' },
  ];

  return (
    <aside className="hidden md:flex flex-col h-full w-[280px] lg:w-[300px] bg-[#0e0e0e] text-[#e2e2e2] py-5 px-3 border-r border-[#222222] shrink-0 z-30 select-none">
      {/* Project Identity Header */}
      <div className="flex items-center gap-3 px-2 mb-5">
        <div className="w-10 h-10 bg-[#1a1712] border border-[#c5a368]/40 text-[#c5a368] rounded-lg flex items-center justify-center shrink-0 shadow-md">
          <span className="material-symbols-outlined text-[24px] text-[#c5a368]">architecture</span>
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-base text-[#f5f5f5] leading-tight truncate font-serif-brand">
            System Architecture
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#c5a368] animate-pulse"></span>
            <p className="text-[11px] text-[#888888] font-medium font-mono">v2.4.0-alpha</p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onOpenAddNode}
        className="w-full bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 mb-4 shadow-md hover:shadow-lg hover:shadow-[#c5a368]/20 transition-all cursor-pointer active:scale-[0.98]"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Add Node
      </button>

      {/* Main Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-0.5">
        {navItems.map((item) => {
          const isActive = activeSidebarTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSidebarTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1e1a14] border border-[#c5a368]/50 text-[#c5a368] font-bold shadow-sm'
                  : 'text-[#8e8e8e] hover:bg-[#161616] hover:text-[#f0f0f0] border border-transparent font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <span 
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#c5a368]' : ''}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-semibold ${
                  isActive ? 'bg-[#c5a368]/20 text-[#c5a368]' : 'bg-[#1f1f1f] text-[#888888]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Section */}
      <div className="mt-auto border-t border-[#222222] pt-3 flex flex-col gap-1">
        <button
          onClick={onOpenHelp}
          className="w-full text-[#888888] hover:bg-[#161616] hover:text-[#c5a368] transition-all rounded-lg flex items-center gap-3 px-3 py-2 text-xs font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Help & Docs
        </button>
        <button
          onClick={onOpenFeedback}
          className="w-full text-[#888888] hover:bg-[#161616] hover:text-[#c5a368] transition-all rounded-lg flex items-center gap-3 px-3 py-2 text-xs font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          Feedback
        </button>
      </div>
    </aside>
  );
};
