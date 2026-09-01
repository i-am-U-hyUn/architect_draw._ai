import React, { useState } from 'react';
import { MainTab } from '../types';
import { 
  Search, 
  Settings, 
  Bell, 
  Share2, 
  UploadCloud, 
  Check, 
  ExternalLink,
  Layers,
  Sparkles,
  User,
  Shield,
  Download
} from 'lucide-react';

interface TopNavBarProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenExport: () => void;
  onOpenDeploy: () => void;
  onOpenSettings: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenExport,
  onOpenDeploy,
  onOpenSettings
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Deployment Success', desc: 'Auth Service v2.4.0 deployed to us-east-1', time: '10m ago', unread: true },
    { id: '2', title: 'Schema Updated', desc: 'User DB indexed 3 new foreign keys', time: '1h ago', unread: true },
    { id: '3', title: 'High Throughput Alert', desc: 'API Gateway exceeded 4,500 req/s', time: '3h ago', unread: false }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-[#0e0e0e] text-[#e2e2e2] border-b border-[#222222] flex justify-between items-center px-6 md:px-8 h-16 shrink-0 z-40 relative select-none">
      {/* Brand & Main Navigation Tabs */}
      <div className="flex items-center gap-6 md:gap-8 h-full">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#181818] border border-[#2a2a2a] flex items-center justify-center text-[#c5a368] shadow-sm group-hover:border-[#c5a368] group-hover:bg-[#c5a368]/10 transition-colors">
            <span className="material-symbols-outlined text-[20px] text-[#c5a368]">account_tree</span>
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-[#f5f5f5] font-serif-brand">
            Architectural Logic
          </span>
        </div>

        <nav className="hidden md:flex h-full items-center gap-1 font-medium text-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`h-full flex items-center px-3.5 pt-0.5 border-b-2 transition-all cursor-pointer font-semibold ${
              activeTab === 'dashboard'
                ? 'border-[#c5a368] text-[#ffffff]'
                : 'border-transparent text-[#8e8e8e] hover:text-[#c5a368]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`h-full flex items-center px-3.5 pt-0.5 border-b-2 transition-all cursor-pointer font-semibold ${
              activeTab === 'projects'
                ? 'border-[#c5a368] text-[#ffffff]'
                : 'border-transparent text-[#8e8e8e] hover:text-[#c5a368]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`h-full flex items-center px-3.5 pt-0.5 border-b-2 transition-all cursor-pointer font-semibold ${
              activeTab === 'templates'
                ? 'border-[#c5a368] text-[#ffffff]'
                : 'border-transparent text-[#8e8e8e] hover:text-[#c5a368]'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('archive')}
            className={`h-full flex items-center px-3.5 pt-0.5 border-b-2 transition-all cursor-pointer font-semibold ${
              activeTab === 'archive'
                ? 'border-[#c5a368] text-[#ffffff]'
                : 'border-transparent text-[#8e8e8e] hover:text-[#c5a368]'
            }`}
          >
            Archive
          </button>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777777] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-3 py-1.5 rounded-lg border border-[#2a2a2a] bg-[#161616] focus:bg-[#1a1a1a] focus:border-[#c5a368] focus:ring-2 focus:ring-[#c5a368]/20 transition-all text-xs font-medium w-44 md:w-56 text-[#f0f0f0] outline-none placeholder-[#777777]"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 text-[#a0a0a0]">
          <button 
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 hover:text-[#c5a368] hover:bg-[#1c1c1c] rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              className="p-2 hover:text-[#c5a368] hover:bg-[#1c1c1c] rounded-full transition-colors cursor-pointer relative"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#c5a368] rounded-full ring-2 ring-[#0e0e0e]"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#141414] rounded-xl shadow-2xl border border-[#2a2a2a] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#222222]">
                  <span className="font-semibold text-xs text-[#c5a368] uppercase tracking-wider">System Events</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      className="text-[11px] text-[#c5a368] hover:underline font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="divide-y divide-[#222222] max-h-64 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className={`py-2.5 px-2 rounded flex gap-2.5 items-start ${item.unread ? 'bg-[#1a1a1a]' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.unread ? 'bg-[#c5a368]' : 'bg-[#444444]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#f0f0f0] leading-snug">{item.title}</p>
                        <p className="text-[11px] text-[#999999] truncate">{item.desc}</p>
                        <span className="text-[10px] text-[#666666] mt-0.5 block">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export & Deploy Buttons */}
        <button
          onClick={onOpenExport}
          className="px-3.5 py-1.5 border border-[#333333] rounded-lg text-xs font-semibold text-[#e2e2e2] hover:bg-[#1c1c1c] hover:border-[#c5a368] hover:text-[#c5a368] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          Export
        </button>

        <button
          onClick={onOpenDeploy}
          className="px-3.5 py-1.5 bg-[#c5a368] text-[#0a0a0a] rounded-lg text-xs font-bold hover:bg-[#d4b57e] hover:shadow-lg hover:shadow-[#c5a368]/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
          Deploy
        </button>

        {/* User Avatar */}
        <div className="relative ml-1">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#333333] cursor-pointer hover:ring-2 hover:ring-[#c5a368]/60 transition-all block"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
              alt="User profile"
              className="w-full h-full object-cover"
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#141414] rounded-xl shadow-2xl border border-[#2a2a2a] p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-[#222222]">
                <p className="font-semibold text-xs text-[#f0f0f0]">Sarah Chen</p>
                <p className="text-[11px] text-[#888888]">Principal Architect</p>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-[#c5a368]/15 text-[#c5a368] border border-[#c5a368]/30 text-[10px] font-bold rounded">
                  Enterprise Org
                </span>
              </div>
              <div className="py-1">
                <button 
                  onClick={() => { setActiveTab('dashboard'); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#bbbbbb] hover:bg-[#1f1f1f] hover:text-[#c5a368] rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">account_tree</span>
                  Current Workspace
                </button>
                <button 
                  onClick={() => { onOpenSettings(); setShowProfileMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#bbbbbb] hover:bg-[#1f1f1f] hover:text-[#c5a368] rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Workspace Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
