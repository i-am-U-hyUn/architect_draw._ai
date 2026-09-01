import React, { useState, useEffect } from 'react';
import { 
  ArchNode, 
  ArchConnection, 
  ArchTemplate, 
  ArchProjectVersion, 
  MainTab, 
  SidebarTab 
} from './types';
import { 
  initialNodes, 
  initialConnections, 
  initialTemplates, 
  initialProjects 
} from './data/initialData';
import { TopNavBar } from './components/TopNavBar';
import { SideNavBar } from './components/SideNavBar';
import { CanvasArea } from './components/CanvasArea';
import { TemplatesView } from './components/TemplatesView';
import { ProjectsArchiveView } from './components/ProjectsArchiveView';
import { AddNodeModal } from './components/AddNodeModal';
import { ExportDeployModals } from './components/ExportDeployModals';
import { LayersDrawer } from './components/LayersDrawer';
import { AssetsDrawer } from './components/AssetsDrawer';
import { HelpFeedbackModals } from './components/HelpFeedbackModals';

export default function App() {
  // Main Navigation & Active View
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('flows');

  // Architecture Diagram State
  const [nodes, setNodes] = useState<ArchNode[]>(initialNodes);
  const [connections, setConnections] = useState<ArchConnection[]>(initialConnections);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-auth-service');

  // Templates & Archive data
  const [templates, setTemplates] = useState<ArchTemplate[]>(initialTemplates);
  const [projects, setProjects] = useState<ArchProjectVersion[]>(initialProjects);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Undo / Redo History Stack
  const [history, setHistory] = useState<{ nodes: ArchNode[]; connections: ArchConnection[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Modals & Drawers State
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Push state to undo history
  const pushHistory = (newNodes: ArchNode[], newConnections: ArchConnection[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, { nodes: newNodes, connections: newConnections }];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevEntry = history[historyIndex - 1];
      setNodes(prevEntry.nodes);
      setConnections(prevEntry.connections);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextEntry = history[historyIndex + 1];
      setNodes(nextEntry.nodes);
      setConnections(nextEntry.connections);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Escape, Add Node)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
      } else if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
        setIsAddNodeOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Sidebar Tab Handlers
  const handleSidebarTabSelect = (tab: SidebarTab) => {
    setActiveSidebarTab(tab);
    if (tab === 'history') {
      setActiveTab('archive');
    } else if (tab === 'flows') {
      setActiveTab('dashboard');
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  // Node Mutations
  const handleSelectNode = (node: ArchNode | null) => {
    setSelectedNodeId(node ? node.id : null);
  };

  const handleUpdateNode = (updatedNode: ArchNode) => {
    const nextNodes = nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n));
    setNodes(nextNodes);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    const nextConns = connections.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId);
    setNodes(nextNodes);
    setConnections(nextConns);
    pushHistory(nextNodes, nextConns);
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  };

  const handleDuplicateNode = (node: ArchNode) => {
    const newId = `node-${Math.random().toString(36).substring(7)}`;
    const duplicated: ArchNode = {
      ...node,
      id: newId,
      title: `${node.title} (Copy)`,
      x: node.x + 40,
      y: node.y + 40
    };
    const nextNodes = [...nodes, duplicated];
    setNodes(nextNodes);
    pushHistory(nextNodes, connections);
    setSelectedNodeId(newId);
  };

  const handleAddNode = (newNodeData: Partial<ArchNode>) => {
    const newId = `node-${Math.random().toString(36).substring(7)}`;
    const created: ArchNode = {
      id: newId,
      title: newNodeData.title || 'New Node',
      subtitle: newNodeData.subtitle || 'Custom Service',
      type: newNodeData.type || 'service',
      icon: newNodeData.icon || 'grid_view',
      x: 380 + Math.floor(Math.random() * 80),
      y: 200 + Math.floor(Math.random() * 80),
      status: newNodeData.status || 'active',
      properties: newNodeData.properties || [{ label: 'Status', value: 'Active' }],
      subProcesses: newNodeData.subProcesses || [
        { id: '1', name: 'Initialize Cluster', status: 'completed' }
      ],
      logs: newNodeData.logs || [
        { id: '1', timestamp: new Date().toTimeString().split(' ')[0], level: 'info', text: 'Node initialized.' }
      ]
    };
    const nextNodes = [...nodes, created];
    setNodes(nextNodes);
    pushHistory(nextNodes, connections);
    setSelectedNodeId(newId);
  };

  // Connection Mutations
  const handleAddConnection = (fromId: string, toId: string) => {
    const existing = connections.find((c) => c.fromNodeId === fromId && c.toNodeId === toId);
    if (existing) return;

    const newConn: ArchConnection = {
      id: `conn-${Math.random().toString(36).substring(7)}`,
      fromNodeId: fromId,
      toNodeId: toId,
      style: 'solid'
    };
    const nextConns = [...connections, newConn];
    setConnections(nextConns);
    pushHistory(nodes, nextConns);
  };

  const handleDeleteConnection = (connId: string) => {
    const nextConns = connections.filter((c) => c.id !== connId);
    setConnections(nextConns);
    pushHistory(nodes, nextConns);
  };

  // Template / Project Loading
  const handleLoadTemplate = (template: ArchTemplate) => {
    setNodes(template.nodes);
    setConnections(template.connections);
    setSelectedNodeId(template.nodes[0]?.id || null);
    pushHistory(template.nodes, template.connections);
    setActiveTab('dashboard');
  };

  const handleStartBlankCanvas = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNodeId(null);
    pushHistory([], []);
    setActiveTab('dashboard');
  };

  const handleLoadProjectVersion = (project: ArchProjectVersion) => {
    setNodes(project.nodes);
    setConnections(project.connections);
    setSelectedNodeId(project.nodes[0]?.id || null);
    pushHistory(project.nodes, project.connections);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0a0a] font-['Plus_Jakarta_Sans'] text-[#e2e2e2]">
      {/* Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenDeploy={() => setIsDeployOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side Navigation Bar */}
        <SideNavBar
          activeSidebarTab={activeSidebarTab}
          setActiveSidebarTab={handleSidebarTabSelect}
          onOpenAddNode={() => setIsAddNodeOpen(true)}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          nodeCount={nodes.length}
        />

        {/* Dynamic Main Workspace Content */}
        {activeTab === 'dashboard' && (
          <CanvasArea
            nodes={nodes}
            connections={connections}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onDuplicateNode={handleDuplicateNode}
            onAddConnection={handleAddConnection}
            onDeleteConnection={handleDeleteConnection}
            onOpenAddNodeModal={() => setIsAddNodeOpen(true)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesView
            templates={templates}
            onSelectTemplate={handleLoadTemplate}
            onStartBlankCanvas={handleStartBlankCanvas}
          />
        )}

        {(activeTab === 'projects' || activeTab === 'archive') && (
          <ProjectsArchiveView
            projects={projects}
            onLoadProject={handleLoadProjectVersion}
          />
        )}

        {/* Layers Drawer (when activeSidebarTab === 'layers') */}
        <LayersDrawer
          isOpen={activeSidebarTab === 'layers'}
          onClose={() => setActiveSidebarTab('flows')}
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={(node) => {
            handleSelectNode(node);
            setActiveSidebarTab('flows');
          }}
          onDeleteNode={handleDeleteNode}
        />

        {/* Assets Drawer (when activeSidebarTab === 'assets') */}
        <AssetsDrawer
          isOpen={activeSidebarTab === 'assets'}
          onClose={() => setActiveSidebarTab('flows')}
          onQuickAddNode={(nodeData) => {
            handleAddNode(nodeData);
            setActiveSidebarTab('flows');
          }}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddNodeModal
        isOpen={isAddNodeOpen}
        onClose={() => setIsAddNodeOpen(false)}
        onAddNode={handleAddNode}
      />

      <ExportDeployModals
        isExportOpen={isExportOpen}
        isDeployOpen={isDeployOpen}
        onCloseExport={() => setIsExportOpen(false)}
        onCloseDeploy={() => setIsDeployOpen(false)}
        nodes={nodes}
        connections={connections}
      />

      <HelpFeedbackModals
        isHelpOpen={isHelpOpen}
        isFeedbackOpen={isFeedbackOpen}
        isSettingsOpen={isSettingsOpen}
        onCloseHelp={() => setIsHelpOpen(false)}
        onCloseFeedback={() => setIsFeedbackOpen(false)}
        onCloseSettings={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
