import React, { useState } from 'react';
import { ArchNode, ArchConnection } from '../types';

interface ExportDeployModalsProps {
  isExportOpen: boolean;
  isDeployOpen: boolean;
  onCloseExport: () => void;
  onCloseDeploy: () => void;
  nodes: ArchNode[];
  connections: ArchConnection[];
}

export const ExportDeployModals: React.FC<ExportDeployModalsProps> = ({
  isExportOpen,
  isDeployOpen,
  onCloseExport,
  onCloseDeploy,
  nodes,
  connections
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'svg' | 'terraform' | 'docker'>('json');
  const [copied, setCopied] = useState(false);

  // Deploy simulation state
  const [deployStep, setDeployStep] = useState<number>(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployCompleted, setDeployCompleted] = useState(false);

  // Generate exported JSON representation
  const architectureJSON = JSON.stringify(
    {
      app: 'FluxFlow Architectural Logic',
      version: '2.4.0-alpha',
      exportedAt: new Date().toISOString(),
      nodes: nodes.map((n) => ({
        id: n.id,
        title: n.title,
        type: n.type,
        status: n.status,
        position: { x: n.x, y: n.y },
        properties: n.properties,
        technical: n.technicalDetails
      })),
      connections
    },
    null,
    2
  );

  const terraformSnippet = `# FluxFlow Generated Terraform HCL
module "architecture_stack" {
  source = "./modules/cloud-mesh"
  environment = "production"

  nodes = [
${nodes.map((n) => `    { name = "${n.title}", type = "${n.type}", replicas = ${n.technicalDetails?.instances || 1} }`).join(',\n')}
  ]

  routes = [
${connections.map((c) => `    { source = "${c.fromNodeId}", target = "${c.toNodeId}" }`).join(',\n')}
  ]
}`;

  const dockerComposeSnippet = `version: '3.8'
services:
${nodes
  .map(
    (n) => `  ${n.id}:
    image: ${n.title.toLowerCase().replace(/\s+/g, '-')}:latest
    environment:
      - NODE_ENV=production
    ports:
      - "${n.technicalDetails?.port || 8080}:${n.technicalDetails?.port || 8080}"`
  )
  .join('\n\n')}`;

  const getExportText = () => {
    switch (exportFormat) {
      case 'json':
        return architectureJSON;
      case 'terraform':
        return terraformSnippet;
      case 'docker':
        return dockerComposeSnippet;
      case 'svg':
        return `<!-- SVG Diagram Export (${nodes.length} nodes, ${connections.length} connections) -->\n<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">\n  <!-- Exported from Architectural Logic -->\n</svg>`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getExportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `architecture-${exportFormat}.${exportFormat === 'json' ? 'json' : exportFormat === 'svg' ? 'svg' : 'tf'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startDeploymentSimulation = () => {
    setIsDeploying(true);
    setDeployStep(1);
    setDeployLogs(['[00:01] Initializing Cloud Infrastructure pipeline...']);

    setTimeout(() => {
      setDeployStep(2);
      setDeployLogs((prev) => [...prev, '[00:02] Provisioning Kong API Gateway & Ingress controller...']);
    }, 1200);

    setTimeout(() => {
      setDeployStep(3);
      setDeployLogs((prev) => [...prev, '[00:04] Mounting Auth0 Service & Validating JWT JWKS keys...']);
    }, 2400);

    setTimeout(() => {
      setDeployStep(4);
      setDeployLogs((prev) => [...prev, '[00:06] Synchronizing Aurora DB schemas & Redis cache clusters...']);
    }, 3600);

    setTimeout(() => {
      setDeployStep(5);
      setIsDeploying(false);
      setDeployCompleted(true);
      setDeployLogs((prev) => [
        ...prev,
        '[00:08] Health check 200 OK across all 4 zones.',
        '🚀 Stack successfully deployed to Production (us-east-1).'
      ]);
    }, 4800);
  };

  return (
    <>
      {/* Export Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
          <div className="bg-[#121212] rounded-xl max-w-xl w-full p-6 shadow-2xl border border-[#262626] flex flex-col max-h-[85vh] animate-in zoom-in-95 popover-shadow">
            <div className="flex justify-between items-center pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c5a368] text-[22px]">download</span>
                <h3 className="font-bold text-base text-[#f5f5f5] font-serif-brand tracking-wide">
                  Export Architecture
                </h3>
              </div>
              <button
                onClick={onCloseExport}
                className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#1a1a1a]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Format Selection Tabs */}
            <div className="flex gap-2 py-3 border-b border-[#222222]">
              {(['json', 'terraform', 'docker', 'svg'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    exportFormat === fmt
                      ? 'bg-[#c5a368] text-[#0a0a0a]'
                      : 'bg-[#181818] border border-[#262626] text-[#888888] hover:text-[#e2e2e2] hover:bg-[#202020]'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Code Box */}
            <div className="my-4 bg-[#080808] rounded-lg p-3.5 font-mono text-[11px] leading-relaxed text-[#c5a368] overflow-auto max-h-64 border border-[#222222] shadow-inner">
              <pre className="text-[#d4b57e]">{getExportText()}</pre>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#222222]">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 border border-[#333333] rounded-lg text-xs font-semibold text-[#e2e2e2] hover:bg-[#1a1a1a] hover:border-[#c5a368]/40 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-[#c5a368]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-1.5 bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deploy Simulation Modal */}
      {isDeployOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
          <div className="bg-[#121212] rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#262626] flex flex-col animate-in zoom-in-95 popover-shadow">
            <div className="flex justify-between items-center pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c5a368] text-[22px]">rocket_launch</span>
                <h3 className="font-bold text-base text-[#f5f5f5] font-serif-brand tracking-wide">
                  Deploy System Architecture
                </h3>
              </div>
              <button
                onClick={onCloseDeploy}
                className="text-[#777777] hover:text-[#c5a368] p-1 rounded-full hover:bg-[#1a1a1a]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#888888] my-3 leading-relaxed">
              Target Cluster: <span className="font-mono font-bold text-[#c5a368]">prod-us-east-mesh.internal</span> ({nodes.length} services, {connections.length} active routes).
            </p>

            {/* Pipeline Step Progress */}
            <div className="space-y-2 mb-4">
              {[
                { step: 1, label: 'Validate Architecture & Security Mesh' },
                { step: 2, label: 'Synthesize Kubernetes & Terraform Manifests' },
                { step: 3, label: 'Zero-Downtime Blue/Green Rollout' },
                { step: 4, label: 'Run Automated Ingress Health Probes' }
              ].map((item) => {
                const isPast = deployStep > item.step;
                const isCurrent = deployStep === item.step;

                return (
                  <div key={item.step} className="flex items-center gap-2.5 text-xs">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isPast
                          ? 'bg-[#c5a368] text-[#0a0a0a]'
                          : isCurrent
                          ? 'bg-[#c5a368] text-[#0a0a0a] animate-pulse ring-2 ring-[#c5a368]/30'
                          : 'bg-[#1e1e1e] text-[#666666]'
                      }`}
                    >
                      {isPast ? '✓' : item.step}
                    </div>
                    <span className={isPast ? 'text-[#e2e2e2] font-medium' : isCurrent ? 'text-[#c5a368] font-bold' : 'text-[#666666]'}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Output */}
            {deployLogs.length > 0 && (
              <div className="bg-[#080808] rounded-lg p-3 font-mono text-[11px] text-[#c0c0c0] mb-4 max-h-36 overflow-y-auto border border-[#222222]">
                {deployLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-relaxed text-[#c5a368]">{log}</div>
                ))}
              </div>
            )}

            {/* Deploy Trigger Button */}
            <div className="flex justify-end gap-2 pt-2 border-t border-[#222222]">
              <button
                onClick={onCloseDeploy}
                className="px-3.5 py-1.5 border border-[#333333] rounded-lg text-xs font-semibold text-[#888888] hover:bg-[#1a1a1a] hover:text-[#e2e2e2]"
              >
                Close
              </button>

              {!deployCompleted ? (
                <button
                  onClick={startDeploymentSimulation}
                  disabled={isDeploying}
                  className="px-4 py-1.5 bg-[#c5a368] hover:bg-[#d4b57e] text-[#0a0a0a] rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  {isDeploying ? 'Deploying...' : 'Start Live Deployment'}
                </button>
              ) : (
                <div className="px-4 py-1.5 bg-[#1c1812] border border-[#c5a368]/60 text-[#c5a368] rounded-lg text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Live in Production
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
