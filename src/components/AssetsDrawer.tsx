import React from 'react';
import { ArchNode } from '../types';

interface AssetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onQuickAddNode: (template: Partial<ArchNode>) => void;
}

const ASSET_LIBRARY = [
  { title: 'Kong Ingress', icon: 'router', type: 'gateway', desc: 'API Traffic Gateway' },
  { title: 'Auth0 / Okta', icon: 'lock', type: 'auth', desc: 'Identity Provider' },
  { title: 'PostgreSQL RDS', icon: 'database', type: 'database', desc: 'ACID Relational DB' },
  { title: 'Redis Cache', icon: 'memory', type: 'cache', desc: 'Sub-millisecond KV' },
  { title: 'Kafka Stream', icon: 'hub', type: 'queue', desc: 'Event Backbone' },
  { title: 'AWS Lambda', icon: 'bolt', type: 'serverless', desc: 'FaaS Compute' },
  { title: 'S3 Storage', icon: 'folder_zip', type: 'storage', desc: 'Blob Store' },
  { title: 'Cloudflare CDN', icon: 'public', type: 'gateway', desc: 'Edge Caching & WAF' }
];

export const AssetsDrawer: React.FC<AssetsDrawerProps> = ({
  isOpen,
  onClose,
  onQuickAddNode
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-[#121212] border-r border-[#262626] z-30 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 select-none">
      {/* Header */}
      <div className="p-4 border-b border-[#222222] flex justify-between items-center bg-[#161616]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c5a368] text-[20px]">grid_view</span>
          <h3 className="font-bold text-xs text-[#f5f5f5] uppercase tracking-wider font-serif-brand">
            Asset Catalog
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#202020]"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div className="p-3 text-[11px] text-[#888888] bg-[#101010] border-b border-[#1c1c1c]">
        Click any cloud component to place it into your architecture canvas.
      </div>

      {/* Grid of assets */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2.5 bg-[#0e0e0e]">
        {ASSET_LIBRARY.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              onQuickAddNode({
                title: item.title,
                subtitle: item.desc,
                icon: item.icon,
                type: item.type as any,
                status: 'active',
                properties: [{ label: 'Status', value: 'Ready' }]
              });
            }}
            className="p-3 bg-[#141414] hover:bg-[#1c1812] rounded-lg border border-[#242424] hover:border-[#c5a368] hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1c1812] border border-[#c5a368]/30 text-[#c5a368] group-hover:bg-[#c5a368] group-hover:text-[#0a0a0a] flex items-center justify-center mb-2 transition-colors">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            </div>
            <span className="font-bold text-xs text-[#f0f0f0] group-hover:text-[#c5a368] line-clamp-1 font-serif-brand">
              {item.title}
            </span>
            <span className="text-[10px] text-[#777777] mt-0.5 line-clamp-1">{item.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
