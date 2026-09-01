import React, { useState } from 'react';
import { ArchNode, NodeType } from '../types';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (newNode: Partial<ArchNode>) => void;
}

interface NodePreset {
  title: string;
  subtitle: string;
  type: NodeType;
  icon: string;
  properties: { label: string; value: string | number }[];
  category: string;
}

const PRESETS: NodePreset[] = [
  {
    title: 'API Gateway',
    subtitle: 'Traffic Router & WAF',
    type: 'gateway',
    icon: 'router',
    properties: [{ label: 'Port', value: '8080' }, { label: 'Active', value: 'Yes' }],
    category: 'Ingress & Network'
  },
  {
    title: 'Auth Service',
    subtitle: 'OAuth2 & Token Validator',
    type: 'auth',
    icon: 'lock',
    properties: [{ label: 'Protocol', value: 'OAuth2' }, { label: 'Instances', value: 3 }],
    category: 'Security & Auth'
  },
  {
    title: 'User DB',
    subtitle: 'Primary Relational Store',
    type: 'database',
    icon: 'database',
    properties: [{ label: 'Type', value: 'PostgreSQL' }],
    category: 'Databases'
  },
  {
    title: 'Session Cache',
    subtitle: 'Redis In-Memory Tier',
    type: 'cache',
    icon: 'memory',
    properties: [{ label: 'Cluster', value: 'Redis 7.2' }],
    category: 'Caching'
  },
  {
    title: 'Payment Worker',
    subtitle: 'Stripe & Webhook Processor',
    type: 'service',
    icon: 'credit_card',
    properties: [{ label: 'Queue', value: 'SQS FIFO' }],
    category: 'Compute & Services'
  },
  {
    title: 'Kafka Event Bus',
    subtitle: 'Pub/Sub Streaming Broker',
    type: 'queue',
    icon: 'hub',
    properties: [{ label: 'Partitions', value: 16 }],
    category: 'Queues & Messaging'
  },
  {
    title: 'Lambda Serverless',
    subtitle: 'Event-Driven Microtask',
    type: 'serverless',
    icon: 'bolt',
    properties: [{ label: 'Memory', value: '512 MB' }],
    category: 'Compute & Services'
  },
  {
    title: 'Object Storage (S3)',
    subtitle: 'Static Assets & Buckets',
    type: 'storage',
    icon: 'folder_zip',
    properties: [{ label: 'Tier', value: 'Standard' }],
    category: 'Databases'
  }
];

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  onClose,
  onAddNode
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState<NodeType>('service');
  const [customIcon, setCustomIcon] = useState('grid_view');

  if (!isOpen) return null;

  const categories = ['All', 'Ingress & Network', 'Compute & Services', 'Databases', 'Caching', 'Security & Auth', 'Queues & Messaging'];

  const filteredPresets = PRESETS.filter((p) => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  const handleSelectPreset = (preset: NodePreset) => {
    onAddNode({
      title: preset.title,
      subtitle: preset.subtitle,
      type: preset.type,
      icon: preset.icon,
      status: 'active',
      properties: preset.properties,
      subProcesses: [
        { id: '1', name: 'Initialize Runtime Container', status: 'completed' },
        { id: '2', name: 'Verify Network Handshake', status: 'in_progress' }
      ],
      logs: [
        { id: '1', timestamp: new Date().toTimeString().split(' ')[0], level: 'info', text: `Node ${preset.title} provisioned successfully.` }
      ]
    });
    onClose();
  };

  const handleAddCustom = () => {
    if (!customTitle.trim()) return;
    onAddNode({
      title: customTitle.trim(),
      subtitle: 'Custom Architecture Node',
      type: customType,
      icon: customIcon,
      status: 'active',
      properties: [{ label: 'Custom', value: 'Active' }]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-[#121212] rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-[#262626] flex flex-col max-h-[85vh] animate-in zoom-in-95 popover-shadow">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#222222]">
          <div>
            <h2 className="font-bold text-lg text-[#f5f5f5] font-serif-brand tracking-wide">
              Add Node to Architecture
            </h2>
            <p className="text-xs text-[#888888]">
              Choose from standardized cloud blocks or define a custom service.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#777777] hover:text-[#c5a368] hover:bg-[#1a1a1a]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-1.5 overflow-x-auto py-3 border-b border-[#222222]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#c5a368] text-[#0a0a0a] font-bold'
                  : 'bg-[#181818] border border-[#262626] text-[#888888] hover:text-[#e2e2e2] hover:bg-[#202020]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="p-3.5 bg-[#161616] hover:bg-[#1c1812] rounded-lg border border-[#262626] hover:border-[#c5a368] hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#1c1812] border border-[#c5a368]/30 text-[#c5a368] group-hover:bg-[#c5a368] group-hover:text-[#0a0a0a] flex items-center justify-center shrink-0 transition-colors shadow-xs">
                <span className="material-symbols-outlined text-[22px]">{preset.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs text-[#f0f0f0] group-hover:text-[#c5a368] truncate font-serif-brand">
                  {preset.title}
                </h4>
                <p className="text-[11px] text-[#888888] truncate">{preset.subtitle}</p>
              </div>
              <span className="material-symbols-outlined text-[16px] text-[#444444] group-hover:text-[#c5a368]">
                add_circle
              </span>
            </div>
          ))}
        </div>

        {/* Custom Node Creator Footer */}
        <div className="pt-3 border-t border-[#222222] flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Or type custom node name..."
              className="px-3 py-1.5 bg-[#161616] border border-[#333333] text-[#e2e2e2] rounded-lg text-xs w-full focus:bg-[#1a1a1a] focus:border-[#c5a368] outline-none"
            />
          </div>
          <button
            onClick={handleAddCustom}
            disabled={!customTitle.trim()}
            className="w-full sm:w-auto px-4 py-1.5 bg-[#c5a368] hover:bg-[#d4b57e] disabled:opacity-40 text-[#0a0a0a] rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Create Custom Node
          </button>
        </div>
      </div>
    </div>
  );
};
