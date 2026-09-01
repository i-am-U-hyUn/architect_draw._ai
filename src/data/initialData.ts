import { ArchNode, ArchConnection, ArchTemplate, ArchProjectVersion } from '../types';

export const initialNodes: ArchNode[] = [
  {
    id: 'node-api-gateway',
    title: 'API Gateway',
    subtitle: 'Traffic Ingress',
    type: 'gateway',
    icon: 'router',
    x: 120,
    y: 130,
    width: 210,
    status: 'active',
    properties: [
      { label: 'Port', value: '8080' },
      { label: 'Rate Limit', value: '5000 req/s' }
    ],
    technicalDetails: {
      service: 'Kong Gateway v3.4',
      type: 'Ingress Controller',
      protocol: 'HTTPS / HTTP2',
      port: 8080,
      instances: 4,
      timeoutMs: 3000,
      retries: 2,
      cpu: '0.4 Core',
      memory: '512 MB',
      env: 'production-us-east',
      healthEndpoint: '/healthz',
      throughput: '4,820 req/s',
      latency: '2.4ms'
    },
    subProcesses: [
      { id: 'p1', name: 'TLS Termination & SSL Handshake', status: 'completed' },
      { id: 'p2', name: 'WAF Rule Check & IP Geoblocking', status: 'completed' },
      { id: 'p3', name: 'Path Routing & Header Forwarding', status: 'completed' }
    ],
    logs: [
      { id: 'l1', timestamp: '14:31:58', level: 'info', text: 'GET /api/v1/auth/token [200 OK] 2.1ms' },
      { id: 'l2', timestamp: '14:32:00', level: 'debug', text: 'TLS Session Resumed with Client' },
      { id: 'l3', timestamp: '14:32:01', level: 'info', text: 'Route matched -> upstream: auth-service:8443' }
    ]
  },
  {
    id: 'node-auth-service',
    title: 'Auth Service',
    subtitle: 'User Authentication',
    type: 'auth',
    icon: 'lock',
    x: 430,
    y: 260,
    width: 240,
    status: 'active',
    properties: [
      { label: 'Protocol', value: 'OAuth2' },
      { label: 'Instances', value: '3' }
    ],
    technicalDetails: {
      service: 'Auth0 Integration',
      type: 'Middleware',
      protocol: 'OAuth 2.0 / OIDC',
      port: 8443,
      instances: 3,
      timeoutMs: 5000,
      retries: 3,
      cpu: '1.2 Core',
      memory: '1024 MB',
      env: 'production-us-east',
      healthEndpoint: '/api/v1/health',
      throughput: '1,240 req/s',
      latency: '14.2ms'
    },
    subProcesses: [
      { id: 'p1', name: 'Extract Token Header', status: 'completed' },
      { id: 'p2', name: 'Validate JWT Signature', status: 'in_progress' },
      { id: 'p3', name: 'Hydrate User Context', status: 'pending' }
    ],
    logs: [
      { id: 'l1', timestamp: '14:32:01', level: 'info', text: 'INFO: Receiving req from /api/v1/data' },
      { id: 'l2', timestamp: '14:32:01', level: 'debug', text: 'DEBUG: Bearer token extracted' },
      { id: 'l3', timestamp: '14:32:02', level: 'auth', text: 'AUTH: Validating against JWKS endpoint...' },
      { id: 'l4', timestamp: '14:32:02', level: 'success', text: 'SUCCESS: Token valid. UserID: usr_892x' }
    ]
  },
  {
    id: 'node-user-db',
    title: 'User DB',
    subtitle: 'Relational Store',
    type: 'database',
    icon: 'database',
    x: 840,
    y: 150,
    width: 210,
    status: 'active',
    progressPercent: 45,
    properties: [
      { label: 'Type', value: 'PostgreSQL' },
      { label: 'Connections', value: '84/200' }
    ],
    technicalDetails: {
      service: 'AWS Aurora PostgreSQL',
      type: 'Primary Cluster',
      protocol: 'TCP / SSL',
      port: 5432,
      instances: 2,
      timeoutMs: 10000,
      retries: 1,
      cpu: '2.8 Core',
      memory: '8192 MB',
      env: 'prod-db-cluster-01',
      healthEndpoint: 'SELECT 1;',
      throughput: '920 ops/s',
      latency: '3.8ms'
    },
    subProcesses: [
      { id: 'p1', name: 'Connection Pool Lease', status: 'completed' },
      { id: 'p2', name: 'Query Execution (Indexed Lookup)', status: 'completed' },
      { id: 'p3', name: 'WAL Replication to Standby Replica', status: 'completed' }
    ],
    logs: [
      { id: 'l1', timestamp: '14:32:02', level: 'info', text: 'QUERY [3.1ms] SELECT * FROM users WHERE id = $1' },
      { id: 'l2', timestamp: '14:32:03', level: 'debug', text: 'Buffer cache hit ratio: 99.4%' },
      { id: 'l3', timestamp: '14:32:04', level: 'success', text: 'Replica lag: 0.12ms' }
    ]
  },
  {
    id: 'node-session-cache',
    title: 'Session Cache',
    subtitle: 'In-Memory Store',
    type: 'cache',
    icon: 'memory',
    x: 840,
    y: 410,
    width: 210,
    status: 'standby',
    properties: [
      { label: 'Status', value: 'Standby' },
      { label: 'Cluster', value: 'Redis 7.2' }
    ],
    technicalDetails: {
      service: 'Redis Elasticache Cluster',
      type: 'Distributed Cache',
      protocol: 'RESP3',
      port: 6379,
      instances: 3,
      timeoutMs: 1500,
      retries: 3,
      cpu: '0.2 Core',
      memory: '2048 MB',
      env: 'prod-cache-mesh',
      healthEndpoint: 'PING',
      throughput: '12,500 ops/s',
      latency: '0.8ms'
    },
    subProcesses: [
      { id: 'p1', name: 'Cluster Shard Key Hash', status: 'completed' },
      { id: 'p2', name: 'Key TTL Verification & Fetch', status: 'completed' }
    ],
    logs: [
      { id: 'l1', timestamp: '14:31:45', level: 'debug', text: 'GET session:usr_892x -> HIT (TTL 1720s)' },
      { id: 'l2', timestamp: '14:32:01', level: 'info', text: 'Memory fragmentation ratio: 1.04' }
    ]
  }
];

export const initialConnections: ArchConnection[] = [
  {
    id: 'conn-1',
    fromNodeId: 'node-api-gateway',
    toNodeId: 'node-auth-service',
    style: 'solid'
  },
  {
    id: 'conn-2',
    fromNodeId: 'node-auth-service',
    toNodeId: 'node-user-db',
    style: 'solid'
  },
  {
    id: 'conn-3',
    fromNodeId: 'node-auth-service',
    toNodeId: 'node-session-cache',
    style: 'dashed',
    animated: true
  }
];

export const initialTemplates: ArchTemplate[] = [
  {
    id: 'template-multi-region',
    title: 'Global Multi-Region Cloud Infrastructure',
    description: 'A resilient, highly available architecture spanning three geographical regions with automated failover, load balancing, and distributed databases.',
    category: 'Infrastructure',
    tags: ['Infrastructure', 'AWS', 'High Availability'],
    isFeatured: true,
    nodes: [
      {
        id: 'mr-r53',
        title: 'Route 53 Global DNS',
        type: 'gateway',
        icon: 'public',
        x: 100,
        y: 200,
        properties: [{ label: 'Routing', value: 'Latency-Based' }],
        status: 'active'
      },
      {
        id: 'mr-alb-us',
        title: 'ALB (US-East)',
        type: 'gateway',
        icon: 'router',
        x: 380,
        y: 100,
        properties: [{ label: 'Port', value: '443' }],
        status: 'active'
      },
      {
        id: 'mr-alb-eu',
        title: 'ALB (EU-Central)',
        type: 'gateway',
        icon: 'router',
        x: 380,
        y: 320,
        properties: [{ label: 'Port', value: '443' }],
        status: 'active'
      },
      {
        id: 'mr-ecs-us',
        title: 'ECS Cluster US',
        type: 'service',
        icon: 'grid_view',
        x: 680,
        y: 100,
        properties: [{ label: 'Instances', value: '12' }],
        status: 'active'
      },
      {
        id: 'mr-ecs-eu',
        title: 'ECS Cluster EU',
        type: 'service',
        icon: 'grid_view',
        x: 680,
        y: 320,
        properties: [{ label: 'Instances', value: '8' }],
        status: 'active'
      },
      {
        id: 'mr-aurora',
        title: 'Aurora Global DB',
        type: 'database',
        icon: 'database',
        x: 980,
        y: 210,
        properties: [{ label: 'Replication', value: '< 1s Lag' }],
        status: 'active'
      }
    ],
    connections: [
      { id: 'c1', fromNodeId: 'mr-r53', toNodeId: 'mr-alb-us', style: 'solid' },
      { id: 'c2', fromNodeId: 'mr-r53', toNodeId: 'mr-alb-eu', style: 'solid' },
      { id: 'c3', fromNodeId: 'mr-alb-us', toNodeId: 'mr-ecs-us', style: 'solid' },
      { id: 'c4', fromNodeId: 'mr-alb-eu', toNodeId: 'mr-ecs-eu', style: 'solid' },
      { id: 'c5', fromNodeId: 'mr-ecs-us', toNodeId: 'mr-aurora', style: 'solid' },
      { id: 'c6', fromNodeId: 'mr-ecs-eu', toNodeId: 'mr-aurora', style: 'dashed' }
    ]
  },
  {
    id: 'template-cicd',
    title: 'Standard CI/CD Pipeline',
    description: 'Complete deployment lifecycle from commit to production with integrated testing and security scanning gates.',
    category: 'Pipelines',
    tags: ['DevOps', 'Jenkins', 'Kubernetes'],
    nodes: [
      {
        id: 'ci-git',
        title: 'Git Repository',
        type: 'frontend',
        icon: 'code',
        x: 100,
        y: 200,
        properties: [{ label: 'Branch', value: 'main / tag' }],
        status: 'active'
      },
      {
        id: 'ci-build',
        title: 'Build & Unit Test',
        type: 'service',
        icon: 'build',
        x: 360,
        y: 200,
        properties: [{ label: 'Duration', value: '3m 12s' }],
        status: 'active'
      },
      {
        id: 'ci-sec',
        title: 'Security & SonarQube',
        type: 'auth',
        icon: 'verified_user',
        x: 620,
        y: 200,
        properties: [{ label: 'Quality Gate', value: 'Passed' }],
        status: 'active'
      },
      {
        id: 'ci-deploy',
        title: 'K8s ArgoCD Deploy',
        type: 'service',
        icon: 'rocket_launch',
        x: 880,
        y: 200,
        properties: [{ label: 'Sync State', value: 'Synced' }],
        status: 'active'
      }
    ],
    connections: [
      { id: 'c1', fromNodeId: 'ci-git', toNodeId: 'ci-build', style: 'solid' },
      { id: 'c2', fromNodeId: 'ci-build', toNodeId: 'ci-sec', style: 'solid' },
      { id: 'c3', fromNodeId: 'ci-sec', toNodeId: 'ci-deploy', style: 'solid' }
    ]
  },
  {
    id: 'template-ecommerce',
    title: 'E-Commerce Checkout Flow',
    description: 'Mapping the user journey from cart review through payment gateways to final order confirmation and fulfillment.',
    category: 'User Journeys',
    tags: ['User Journey', 'Retail', 'Stripe'],
    nodes: [
      {
        id: 'ec-cart',
        title: 'Cart Review',
        type: 'frontend',
        icon: 'shopping_cart',
        x: 100,
        y: 180,
        properties: [{ label: 'Step', value: '1 of 4' }],
        status: 'active'
      },
      {
        id: 'ec-pay',
        title: 'Stripe Gateway',
        type: 'auth',
        icon: 'credit_card',
        x: 360,
        y: 180,
        properties: [{ label: 'Protocol', value: '3D Secure' }],
        status: 'active'
      },
      {
        id: 'ec-inventory',
        title: 'Inventory Lock',
        type: 'database',
        icon: 'inventory_2',
        x: 620,
        y: 100,
        properties: [{ label: 'TTL', value: '15 mins' }],
        status: 'active'
      },
      {
        id: 'ec-order',
        title: 'Order Dispatch Queue',
        type: 'queue',
        icon: 'account_tree',
        x: 620,
        y: 280,
        properties: [{ label: 'Topic', value: 'orders.new' }],
        status: 'active'
      },
      {
        id: 'ec-notif',
        title: 'Receipt & Tracking Mail',
        type: 'service',
        icon: 'mail',
        x: 880,
        y: 280,
        properties: [{ label: 'Provider', value: 'SendGrid' }],
        status: 'active'
      }
    ],
    connections: [
      { id: 'c1', fromNodeId: 'ec-cart', toNodeId: 'ec-pay', style: 'solid' },
      { id: 'c2', fromNodeId: 'ec-pay', toNodeId: 'ec-inventory', style: 'solid' },
      { id: 'c3', fromNodeId: 'ec-pay', toNodeId: 'ec-order', style: 'solid' },
      { id: 'c4', fromNodeId: 'ec-order', toNodeId: 'ec-notif', style: 'dashed' }
    ]
  },
  {
    id: 'template-microservices',
    title: 'Microservices Mesh',
    description: 'A containerized microservices setup utilizing a service mesh for communication, telemetry, and security policies.',
    category: 'Architecture',
    tags: ['Architecture', 'Kubernetes', 'Istio'],
    nodes: [
      {
        id: 'ms-ingress',
        title: 'Envoy Gateway',
        type: 'gateway',
        icon: 'router',
        x: 100,
        y: 220,
        properties: [{ label: 'Port', value: '443' }],
        status: 'active'
      },
      {
        id: 'ms-user',
        title: 'User Microservice',
        type: 'service',
        icon: 'person',
        x: 400,
        y: 100,
        properties: [{ label: 'mTLS', value: 'Strict' }],
        status: 'active'
      },
      {
        id: 'ms-catalog',
        title: 'Catalog Microservice',
        type: 'service',
        icon: 'store',
        x: 400,
        y: 240,
        properties: [{ label: 'Pods', value: '6' }],
        status: 'active'
      },
      {
        id: 'ms-billing',
        title: 'Billing Microservice',
        type: 'service',
        icon: 'receipt_long',
        x: 400,
        y: 380,
        properties: [{ label: 'PCI DSS', value: 'Tier 1' }],
        status: 'active'
      },
      {
        id: 'ms-kafka',
        title: 'Kafka Event Bus',
        type: 'queue',
        icon: 'hub',
        x: 740,
        y: 240,
        properties: [{ label: 'Brokers', value: '5' }],
        status: 'active'
      }
    ],
    connections: [
      { id: 'c1', fromNodeId: 'ms-ingress', toNodeId: 'ms-user', style: 'solid' },
      { id: 'c2', fromNodeId: 'ms-ingress', toNodeId: 'ms-catalog', style: 'solid' },
      { id: 'c3', fromNodeId: 'ms-ingress', toNodeId: 'ms-billing', style: 'solid' },
      { id: 'c4', fromNodeId: 'ms-user', toNodeId: 'ms-kafka', style: 'dashed' },
      { id: 'c5', fromNodeId: 'ms-catalog', toNodeId: 'ms-kafka', style: 'dashed' },
      { id: 'c6', fromNodeId: 'ms-billing', toNodeId: 'ms-kafka', style: 'dashed' }
    ]
  }
];

export const initialProjects: ArchProjectVersion[] = [
  {
    id: 'proj-checkout',
    title: 'Checkout Flow Redesign',
    description: 'Updated payment gateway integration, 3D secure fallback, and webhook retry handling.',
    version: 'v3.1.4',
    category: 'E-Commerce',
    updatedAt: '2026-08-31T15:45:00Z',
    timeAgo: '2 hrs ago',
    icon: 'account_tree',
    authors: [
      { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
      { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' }
    ],
    nodes: initialTemplates[2].nodes,
    connections: initialTemplates[2].connections
  },
  {
    id: 'proj-user-auth',
    title: 'User Auth Schema',
    description: 'Database schema and token signature validation for the new OAuth2 & passkey implementation.',
    version: 'v2.0.1',
    category: 'Security',
    updatedAt: '2026-08-30T10:00:00Z',
    timeAgo: 'Yesterday',
    icon: 'database',
    authors: [
      { name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' }
    ],
    nodes: initialNodes,
    connections: initialConnections
  },
  {
    id: 'proj-notification',
    title: 'Notification Microservice',
    description: 'Architecture diagram for push notification queue, SMS fallback, and batch email dispatch.',
    version: 'v1.5.0',
    category: 'Internal Tools',
    updatedAt: '2026-08-12T14:30:00Z',
    timeAgo: 'Oct 12, 2023',
    icon: 'api',
    authors: [
      { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces' },
      { name: 'Marcus Brody', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces' }
    ],
    nodes: initialTemplates[1].nodes,
    connections: initialTemplates[1].connections
  },
  {
    id: 'proj-onboarding',
    title: 'Onboarding Logic',
    description: 'Decision tree for user cohort segmentation, guided product tours, and analytics tracking.',
    version: 'v4.2.0',
    category: 'Marketing',
    updatedAt: '2026-07-28T09:15:00Z',
    timeAgo: 'Sep 28, 2023',
    icon: 'route',
    authors: [
      { name: 'Jessica Taylor', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces' }
    ],
    nodes: initialTemplates[3].nodes,
    connections: initialTemplates[3].connections
  }
];
