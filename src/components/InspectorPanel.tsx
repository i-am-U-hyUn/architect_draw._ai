import React, { useState, useEffect } from 'react';
import { ArchNode, SubProcess, LogEntry } from '../types';

interface InspectorPanelProps {
  node: ArchNode;
  onClose: () => void;
  onUpdateNode: (updated: ArchNode) => void;
  onDeleteNode: (id: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  node,
  onClose,
  onUpdateNode,
  onDeleteNode
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'performance'>('overview');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(node.title);
  const [subtitleInput, setSubtitleInput] = useState(node.subtitle || '');
  const [isStreamingLogs, setIsStreamingLogs] = useState(true);
  const [newStepText, setNewStepText] = useState('');
  const [showAddStep, setShowAddStep] = useState(false);

  // Sync inputs when selected node changes
  useEffect(() => {
    setTitleInput(node.title);
    setSubtitleInput(node.subtitle || '');
  }, [node.id]);

  // Simulated live log generator
  useEffect(() => {
    if (!isStreamingLogs) return;
    const interval = setInterval(() => {
      const randomIds = ['usr_892x', 'usr_441a', 'usr_902k', 'usr_109p'];
      const randomId = randomIds[Math.floor(Math.random() * randomIds.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: timeStr,
        level: Math.random() > 0.3 ? 'info' : 'success',
        text: `[${timeStr}] AUTH: Validated JWT token for ${randomId} (${(Math.random() * 10 + 2).toFixed(1)}ms)`
      };

      const currentLogs = node.logs || [];
      const updatedLogs = [...currentLogs.slice(-10), newLog];
      onUpdateNode({ ...node, logs: updatedLogs });
    }, 4500);

    return () => clearInterval(interval);
  }, [node, isStreamingLogs]);

  const handleSaveHeader = () => {
    onUpdateNode({
      ...node,
      title: titleInput,
      subtitle: subtitleInput
    });
    setIsEditingTitle(false);
  };

  const handleAddSubProcess = () => {
    if (!newStepText.trim()) return;
    const newStep: SubProcess = {
      id: Math.random().toString(36).substring(7),
      name: newStepText.trim(),
      status: 'pending'
    };
    const updated = [...(node.subProcesses || []), newStep];
    onUpdateNode({ ...node, subProcesses: updated });
    setNewStepText('');
    setShowAddStep(false);
  };

  const toggleSubProcessStatus = (stepId: string) => {
    const updated = (node.subProcesses || []).map((s) => {
      if (s.id !== stepId) return s;
      const nextStatus: SubProcess['status'] = 
        s.status === 'completed' ? 'in_progress' : 
        s.status === 'in_progress' ? 'pending' : 'completed';
      return { ...s, status: nextStatus };
    });
    onUpdateNode({ ...node, subProcesses: updated });
  };

  const handleUpdateTechnicalField = (field: string, value: any) => {
    const updatedTech = {
      ...(node.technicalDetails || { service: 'Custom Service' }),
      [field]: value
    };
    onUpdateNode({ ...node, technicalDetails: updatedTech });
  };

  const technical = node.technicalDetails || {
    service: node.title,
    type: 'Middleware',
    timeoutMs: 5000,
    retries: 3,
    instances: 3,
    protocol: 'OAuth 2.0',
    port: 8443,
    cpu: '1.2 Core',
    memory: '1024 MB',
    env: 'production-us-east',
    healthEndpoint: '/health',
    throughput: '1,240 req/s',
    latency: '14.2ms'
  };

  return (
    <aside className="w-[380px] lg:w-[420px] bg-[#0e0e0e] border-l border-[#222222] h-full flex flex-col shrink-0 z-40 overflow-hidden shadow-2xl animate-in slide-in-from-right duration-200 select-none">
      {/* Panel Header */}
      <div className="p-5 pb-3 bg-[#121212] border-b border-[#222222]">
        <div className="flex justify-between items-start gap-2">
          <div className="flex gap-3 items-start flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1c1812] border border-[#c5a368]/40 text-[#c5a368] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {node.icon || 'lock'}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex flex-col gap-1.5 mb-1">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="px-2 py-1 bg-[#1a1a1a] border border-[#c5a368] rounded text-sm font-bold text-[#f5f5f5] outline-none"
                    placeholder="Node Title"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={subtitleInput}
                    onChange={(e) => setSubtitleInput(e.target.value)}
                    className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333333] rounded text-xs text-[#a0a0a0] outline-none"
                    placeholder="Node Description"
                  />
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={handleSaveHeader}
                      className="px-2.5 py-0.5 bg-[#c5a368] text-[#0a0a0a] rounded text-xs font-bold hover:bg-[#d4b57e]"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="px-2 py-0.5 text-xs text-[#888888] hover:text-[#f0f0f0]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingTitle(true)}
                  className="cursor-pointer group/title"
                  title="Click to rename"
                >
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-bold text-base text-[#f5f5f5] leading-tight truncate group-hover/title:text-[#c5a368] font-serif-brand">
                      {node.title}
                    </h2>
                    <span className="material-symbols-outlined text-[14px] text-[#777777] opacity-0 group-hover/title:opacity-100">
                      edit
                    </span>
                  </div>
                  <p className="text-xs text-[#888888] mt-0.5 line-clamp-2 leading-relaxed">
                    {node.subtitle || 'Validates incoming tokens against the identity provider.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#777777] hover:text-[#c5a368] p-1.5 rounded-full hover:bg-[#1a1a1a] transition-colors cursor-pointer shrink-0"
            title="Close Inspector"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222222] mt-4 -mb-3 px-1 gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'text-[#c5a368] border-[#c5a368]'
                : 'text-[#777777] border-transparent hover:text-[#e2e2e2]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'technical'
                ? 'text-[#c5a368] border-[#c5a368]'
                : 'text-[#777777] border-transparent hover:text-[#e2e2e2]'
            }`}
          >
            Technical Details
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'performance'
                ? 'text-[#c5a368] border-[#c5a368]'
                : 'text-[#777777] border-transparent hover:text-[#e2e2e2]'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 bg-[#0e0e0e]">
        {activeTab === 'overview' && (
          <>
            {/* Meta Data Section (Level 2 card) */}
            <div className="bg-[#141414] rounded-lg p-3.5 border border-[#242424] shadow-md">
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2">
                <div>
                  <span className="text-[#777777] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Service
                  </span>
                  <span className="text-xs font-semibold text-[#f0f0f0] block truncate">
                    {technical.service}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Type
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#1e1a12] text-[#c5a368] border border-[#c5a368]/30 font-bold text-[10px]">
                    {technical.type || 'Middleware'}
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Timeout
                  </span>
                  <span className="font-mono text-xs font-medium text-[#e2e2e2]">
                    {technical.timeoutMs || 5000}ms
                  </span>
                </div>
                <div>
                  <span className="text-[#777777] block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Retries
                  </span>
                  <span className="font-mono text-xs font-medium text-[#e2e2e2]">
                    {technical.retries || 3}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-processes / Mini-Flow */}
            <div>
              <div className="flex justify-between items-center mb-2.5">
                <h3 className="font-bold text-xs text-[#c5a368] uppercase tracking-wider font-serif-brand">
                  Sub-processes
                </h3>
                <button
                  onClick={() => setShowAddStep(!showAddStep)}
                  className="text-[11px] text-[#c5a368] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  Add Step
                </button>
              </div>

              {showAddStep && (
                <div className="mb-3 p-2 bg-[#161616] rounded border border-[#333333] flex gap-2">
                  <input
                    type="text"
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    placeholder="Step name (e.g. Verify Scope)"
                    className="flex-1 text-xs px-2 py-1 bg-[#111111] border border-[#333333] text-[#f0f0f0] rounded outline-none"
                  />
                  <button
                    onClick={handleAddSubProcess}
                    className="px-2.5 py-1 bg-[#c5a368] text-[#0a0a0a] text-xs font-bold rounded hover:bg-[#d4b57e]"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-2 border-l-2 border-[#262626] ml-2 pl-3 relative">
                {(node.subProcesses && node.subProcesses.length > 0 ? node.subProcesses : [
                  { id: '1', name: 'Extract Token Header', status: 'completed' },
                  { id: '2', name: 'Validate JWT Signature', status: 'in_progress' },
                  { id: '3', name: 'Hydrate User Context', status: 'pending' }
                ]).map((step) => {
                  const isCompleted = step.status === 'completed';
                  const isInProgress = step.status === 'in_progress';

                  return (
                    <div 
                      key={step.id} 
                      className="flex items-center gap-2 relative group/step cursor-pointer"
                      onClick={() => toggleSubProcessStatus(step.id)}
                      title="Click to toggle status"
                    >
                      {/* Timeline Pip */}
                      <div
                        className={`w-2.5 h-2.5 rounded-full -ml-[17px] ring-4 ring-[#0e0e0e] transition-colors shrink-0 ${
                          isCompleted
                            ? 'bg-[#c5a368]'
                            : isInProgress
                            ? 'bg-[#c5a368] ring-[#c5a368]/30'
                            : 'bg-[#333333]'
                        }`}
                      />

                      {/* Step Pill */}
                      {isInProgress ? (
                        <div className="bg-[#1e1a12] px-3 py-1.5 rounded border border-[#c5a368]/60 text-[#c5a368] text-xs font-bold flex-1 flex justify-between items-center shadow-md">
                          <span>{step.name}</span>
                          <span className="material-symbols-outlined text-[16px] animate-spin text-[#c5a368]">
                            sync
                          </span>
                        </div>
                      ) : (
                        <div className={`bg-[#141414] px-3 py-1.5 rounded border border-[#242424] text-xs flex-1 flex justify-between items-center ${
                          isCompleted ? 'text-[#e2e2e2] font-medium' : 'text-[#666666]'
                        }`}>
                          <span>{step.name}</span>
                          {isCompleted && (
                            <span className="material-symbols-outlined text-[16px] text-[#c5a368]">
                              check
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Logs Snippet */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-[#c5a368] uppercase tracking-wider font-serif-brand">
                    Live Logs
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a368] animate-ping" />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsStreamingLogs(!isStreamingLogs)}
                    className="text-[10px] font-semibold text-[#c5a368] hover:underline cursor-pointer"
                  >
                    {isStreamingLogs ? 'Pause' : 'Resume'}
                  </button>
                  <button 
                    onClick={() => onUpdateNode({ ...node, logs: [] })}
                    className="text-[10px] font-semibold text-[#777777] hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Box */}
              <div className="bg-[#080808] rounded-lg p-3 overflow-hidden border border-[#222222] shadow-inner font-mono text-[11px] leading-relaxed text-[#c0c0c0] min-h-[110px] max-h-[160px] overflow-y-auto">
                {node.logs && node.logs.length > 0 ? (
                  node.logs.map((log) => {
                    let levelColor = 'text-[#c5a368]';
                    if (log.level === 'auth') levelColor = 'text-[#d4b57e]';
                    if (log.level === 'success') levelColor = 'text-emerald-400';
                    if (log.level === 'warn') levelColor = 'text-amber-300';
                    if (log.level === 'error') levelColor = 'text-rose-400';

                    return (
                      <div key={log.id} className="whitespace-pre-wrap mb-1 last:mb-0">
                        <span className={levelColor}>[{log.timestamp}]</span> {log.text.replace(/\[\d+:\d+:\d+\]\s*/, '')}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[#555555] italic">No new telemetry events recorded.</div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'technical' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#141414] rounded-lg p-4 border border-[#242424] shadow-md flex flex-col gap-3">
              <h4 className="font-bold text-xs text-[#f0f0f0] uppercase font-serif-brand">Network & Runtime</h4>
              
              <div>
                <label className="text-[11px] font-semibold text-[#888888] block mb-1">Protocol</label>
                <input
                  type="text"
                  value={technical.protocol || 'OAuth 2.0 / REST'}
                  onChange={(e) => handleUpdateTechnicalField('protocol', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-[#333333] rounded font-mono bg-[#0c0c0c] text-[#e2e2e2] focus:border-[#c5a368] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#888888] block mb-1">Port</label>
                  <input
                    type="number"
                    value={technical.port || 8443}
                    onChange={(e) => handleUpdateTechnicalField('port', Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-[#333333] rounded font-mono bg-[#0c0c0c] text-[#e2e2e2] focus:border-[#c5a368] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#888888] block mb-1">Replicas / Instances</label>
                  <input
                    type="number"
                    value={technical.instances || 3}
                    onChange={(e) => handleUpdateTechnicalField('instances', Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-[#333333] rounded font-mono bg-[#0c0c0c] text-[#e2e2e2] focus:border-[#c5a368] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#888888] block mb-1">Health Check Path</label>
                <input
                  type="text"
                  value={technical.healthEndpoint || '/healthz'}
                  onChange={(e) => handleUpdateTechnicalField('healthEndpoint', e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-[#333333] rounded font-mono bg-[#0c0c0c] text-[#e2e2e2] focus:border-[#c5a368] outline-none"
                />
              </div>
            </div>

            <div className="bg-[#141414] rounded-lg p-4 border border-[#242424] shadow-md flex flex-col gap-3">
              <h4 className="font-bold text-xs text-[#f0f0f0] uppercase font-serif-brand">Compute Allocations</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#888888] block mb-1">CPU Request</label>
                  <input
                    type="text"
                    value={technical.cpu || '1.2 Core'}
                    onChange={(e) => handleUpdateTechnicalField('cpu', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-[#333333] rounded font-mono bg-[#0c0c0c] text-[#e2e2e2] focus:border-[#c5a368] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#888888] block mb-1">Memory Limit</label>
                  <input
                    type="text"
                    value={technical.memory || '1024 MB'}
                    onChange={(e) => handleUpdateTechnicalField('memory', e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-[#333333] rounded font-mono bg-[#0c0c0c] text-[#e2e2e2] focus:border-[#c5a368] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#141414] p-3.5 rounded-lg border border-[#242424] shadow-md">
                <span className="text-[10px] font-bold text-[#888888] uppercase">Avg Latency (p95)</span>
                <p className="text-xl font-bold text-[#c5a368] font-mono mt-1">{technical.latency || '14.2ms'}</p>
                <span className="text-[10px] text-emerald-400 font-medium">↓ 1.4ms from baseline</span>
              </div>
              <div className="bg-[#141414] p-3.5 rounded-lg border border-[#242424] shadow-md">
                <span className="text-[10px] font-bold text-[#888888] uppercase">Peak Throughput</span>
                <p className="text-xl font-bold text-[#f0f0f0] font-mono mt-1">{technical.throughput || '1,240 req/s'}</p>
                <span className="text-[10px] text-[#888888] font-medium">Load factor 62%</span>
              </div>
            </div>

            <div className="bg-[#141414] p-4 rounded-lg border border-[#242424] shadow-md">
              <span className="text-xs font-bold text-[#f0f0f0] block mb-2 font-serif-brand">Cluster Uptime & Health</span>
              <div className="flex items-center justify-between text-xs text-[#a0a0a0] mb-1 font-mono">
                <span>SLO Target: 99.9%</span>
                <span className="font-bold text-[#c5a368]">99.99%</span>
              </div>
              <div className="w-full bg-[#222222] h-2 rounded-full overflow-hidden">
                <div className="bg-[#c5a368] h-full w-[99.9%]" />
              </div>
            </div>
          </div>
        )}

        {/* Delete Node Action */}
        <div className="mt-auto pt-3 border-t border-[#222222] flex justify-between items-center">
          <span className="text-[11px] text-[#777777] font-mono">ID: {node.id}</span>
          <button
            onClick={() => onDeleteNode(node.id)}
            className="px-3 py-1.5 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 rounded-md font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Delete Node
          </button>
        </div>
      </div>
    </aside>
  );
};
