export type NodeStatus = 'active' | 'standby' | 'syncing' | 'error' | 'healthy';

export type NodeType = 
  | 'gateway' 
  | 'auth' 
  | 'database' 
  | 'cache' 
  | 'service' 
  | 'queue' 
  | 'frontend' 
  | 'serverless'
  | 'storage'
  | 'custom';

export interface SubProcess {
  id: string;
  name: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'debug' | 'auth' | 'success' | 'warn' | 'error';
  text: string;
}

export interface TechnicalDetails {
  service: string;
  type?: string;
  protocol?: string;
  port?: number | string;
  instances?: number;
  timeoutMs?: number;
  retries?: number;
  cpu?: string;
  memory?: string;
  env?: string;
  healthEndpoint?: string;
  throughput?: string;
  latency?: string;
}

export interface ArchNode {
  id: string;
  title: string;
  subtitle?: string;
  type: NodeType;
  icon: string;
  x: number;
  y: number;
  width?: number;
  status?: NodeStatus;
  customTag?: string;
  progressPercent?: number;
  properties: {
    label: string;
    value: string | number;
    highlight?: boolean;
  }[];
  subProcesses?: SubProcess[];
  logs?: LogEntry[];
  technicalDetails?: TechnicalDetails;
  notes?: string;
}

export interface ArchConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  style?: 'solid' | 'dashed' | 'pulse';
  color?: string;
  label?: string;
  animated?: boolean;
}

export interface ArchTemplate {
  id: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Pipelines' | 'User Journeys' | 'Architecture' | 'Retail';
  tags: string[];
  isFeatured?: boolean;
  imageUrl?: string;
  nodes: ArchNode[];
  connections: ArchConnection[];
}

export interface ProjectAuthor {
  name: string;
  avatar: string;
  role?: string;
}

export interface ArchProjectVersion {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  updatedAt: string;
  timeAgo: string;
  icon: string;
  authors: ProjectAuthor[];
  nodes: ArchNode[];
  connections: ArchConnection[];
}

export type MainTab = 'dashboard' | 'projects' | 'templates' | 'archive';
export type SidebarTab = 'layers' | 'assets' | 'flows' | 'history' | 'settings';
export type CanvasTool = 'pan' | 'select' | 'connect' | 'add';
