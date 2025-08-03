import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Square, 
  Circle, 
  Pause,
  Mail,
  FileText,
  Phone,
  BarChart3,
  CheckCircle,
  GitBranch,
  RotateCcw,
  Clock,
  Users,
  User,
  GraduationCap,
  UserCheck,
  Settings,
  ZoomIn,
  ZoomOut,
  Grid,
  Undo,
  Trash2,
  Copy,
  TestTube,
  Save,
  Monitor,
  Filter,
  Download,
  Eye,
  Zap,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'action' | 'decision' | 'user' | 'timer' | 'condition';
  title: string;
  x: number;
  y: number;
  properties: {
    name?: string;
    assignedTo?: string;
    timeout?: string;
    priority?: 'low' | 'medium' | 'high';
    conditions?: string[];
    notifications?: string[];
  };
}

interface WorkflowConnection {
  from: string;
  to: string;
  condition?: string;
}

interface WorkflowInstance {
  id: string;
  currentStep: string;
  duration: string;
  status: 'active' | 'paused' | 'failed' | 'completed' | 'overdue';
}

const WorkflowDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { 
      id: 'start-1', 
      type: 'start', 
      title: 'Start', 
      x: 100, 
      y: 50,
      properties: { name: 'Start' }
    },
    { 
      id: 'review-1', 
      type: 'action', 
      title: 'Review Application', 
      x: 100, 
      y: 150,
      properties: { 
        name: 'Review Application',
        assignedTo: 'Academic Committee',
        timeout: '3 business days',
        priority: 'high'
      }
    },
    { 
      id: 'decision-1', 
      type: 'decision', 
      title: 'Decision', 
      x: 100, 
      y: 250,
      properties: { 
        name: 'Approval Decision',
        conditions: ['application.gpa >= 3.5', 'application.documents >= 5']
      }
    },
    { 
      id: 'approved-1', 
      type: 'action', 
      title: 'Send Approval', 
      x: 250, 
      y: 350,
      properties: { 
        name: 'Send Approval Email',
        assignedTo: 'System',
        notifications: ['Email applicant', 'Notify coordinator']
      }
    },
    { 
      id: 'rejected-1', 
      type: 'action', 
      title: 'Send Rejection', 
      x: 50, 
      y: 350,
      properties: { 
        name: 'Send Rejection Notice',
        assignedTo: 'System',
        notifications: ['Email applicant']
      }
    },
    { 
      id: 'end-1', 
      type: 'end', 
      title: 'End', 
      x: 150, 
      y: 450,
      properties: { name: 'End' }
    }
  ]);

  const [connections] = useState<WorkflowConnection[]>([
    { from: 'start-1', to: 'review-1' },
    { from: 'review-1', to: 'decision-1' },
    { from: 'decision-1', to: 'approved-1', condition: 'Approved' },
    { from: 'decision-1', to: 'rejected-1', condition: 'Rejected' },
    { from: 'approved-1', to: 'end-1' },
    { from: 'rejected-1', to: 'end-1' }
  ]);

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [draggedNodeType, setDraggedNodeType] = useState<string | null>(null);
  const [workflowInstances] = useState<WorkflowInstance[]>([
    { id: 'WF-2024-001', currentStep: 'Review Application', duration: '2.1 hrs', status: 'active' },
    { id: 'WF-2024-002', currentStep: 'Send Invitation', duration: '0.5 hrs', status: 'active' },
    { id: 'WF-2024-003', currentStep: 'Decision Pending', duration: '4.2 hrs', status: 'overdue' },
    { id: 'WF-2024-004', currentStep: 'Interview Scheduling', duration: '1.8 hrs', status: 'active' }
  ]);

  const nodeTypes = [
    { type: 'start', icon: Play, title: 'Start', color: 'bg-green-500' },
    { type: 'end', icon: Square, title: 'End', color: 'bg-red-500' },
    { type: 'pause', icon: Pause, title: 'Pause', color: 'bg-yellow-500' }
  ];

  const actionNodes = [
    { type: 'email', icon: Mail, title: 'Send Email', color: 'bg-blue-500' },
    { type: 'document', icon: FileText, title: 'Create Doc', color: 'bg-purple-500' },
    { type: 'notify', icon: Phone, title: 'Notify', color: 'bg-orange-500' },
    { type: 'generate', icon: BarChart3, title: 'Generate', color: 'bg-indigo-500' },
    { type: 'approve', icon: CheckCircle, title: 'Approve', color: 'bg-green-500' }
  ];

  const logicNodes = [
    { type: 'decision', icon: GitBranch, title: 'Decision', color: 'bg-yellow-500' },
    { type: 'loop', icon: RotateCcw, title: 'Loop', color: 'bg-pink-500' },
    { type: 'timer', icon: Clock, title: 'Timer', color: 'bg-gray-500' },
    { type: 'condition', icon: Zap, title: 'Condition', color: 'bg-cyan-500' }
  ];

  const userNodes = [
    { type: 'student', icon: GraduationCap, title: 'Student', color: 'bg-blue-600' },
    { type: 'professor', icon: User, title: 'Professor', color: 'bg-green-600' },
    { type: 'admin', icon: UserCheck, title: 'Admin', color: 'bg-purple-600' },
    { type: 'external', icon: Users, title: 'External', color: 'bg-gray-600' }
  ];

  const handleDragStart = useCallback((nodeType: string) => {
    setDraggedNodeType(nodeType);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (draggedNodeType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode: WorkflowNode = {
        id: `${draggedNodeType}-${Date.now()}`,
        type: draggedNodeType as any,
        title: draggedNodeType,
        x,
        y,
        properties: { name: draggedNodeType }
      };
      
      setNodes(prev => [...prev, newNode]);
      setDraggedNodeType(null);
    }
  }, [draggedNodeType]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const getNodeIcon = (type: string) => {
    const allNodes = [...nodeTypes, ...actionNodes, ...logicNodes, ...userNodes];
    const nodeConfig = allNodes.find(n => n.type === type);
    return nodeConfig ? nodeConfig.icon : Circle;
  };

  const getNodeColor = (type: string) => {
    const allNodes = [...nodeTypes, ...actionNodes, ...logicNodes, ...userNodes];
    const nodeConfig = allNodes.find(n => n.type === type);
    return nodeConfig ? nodeConfig.color : 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
      case 'paused':
        return <Pause className="h-3 w-3 fill-yellow-500 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-3 w-3 fill-red-500 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 fill-blue-500 text-blue-500" />;
      case 'overdue':
        return <Circle className="h-3 w-3 fill-red-500 text-red-500" />;
      default:
        return <Circle className="h-3 w-3 fill-gray-500 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      paused: 'secondary',
      failed: 'destructive',
      completed: 'default',
      overdue: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} className="text-xs">
        {status}
      </Badge>
    );
  };

  const removeNode = (nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workflow Designer</h1>
            <p className="text-gray-600">Design and configure automated workflows</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Tools
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button variant="outline" size="sm">
              <TestTube className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Monitor className="h-4 w-4 mr-2" />
              Monitor
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Component Library */}
        <div className="w-80 bg-white border-r p-4 overflow-y-auto">
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="space-y-6">
              {/* Start/End Nodes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Circle className="h-4 w-4" />
                    Start/End Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {nodeTypes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.type}
                          className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(node.type)}
                        >
                          <div className={`p-1 rounded ${node.color}`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm">{node.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Action Nodes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Action Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {actionNodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.type}
                          className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(node.type)}
                        >
                          <div className={`p-1 rounded ${node.color}`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm">{node.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Logic Nodes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Logic Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {logicNodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.type}
                          className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(node.type)}
                        >
                          <div className={`p-1 rounded ${node.color}`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm">{node.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* User Nodes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    User Nodes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userNodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <div
                          key={node.type}
                          className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(node.type)}
                        >
                          <div className={`p-1 rounded ${node.color}`}>
                            <Icon className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-sm">{node.title}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Clear All
                  </Button>
                </CardContent>
              </Card>

              {/* Workflow Properties */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Workflow Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs">Name:</Label>
                    <div className="text-sm mt-1">Student Application Review Process</div>
                  </div>
                  <div>
                    <Label className="text-xs">Category:</Label>
                    <div className="text-sm mt-1">Academic Processing</div>
                  </div>
                  <div>
                    <Label className="text-xs">Owner:</Label>
                    <div className="text-sm mt-1">Dr. Sarah Wilson</div>
                  </div>
                  <div>
                    <Label className="text-xs">Avg Duration:</Label>
                    <div className="text-sm mt-1">2.5 hours</div>
                  </div>
                  <div>
                    <Label className="text-xs">Success Rate:</Label>
                    <div className="text-sm mt-1">94%</div>
                  </div>
                  <div className="flex gap-1 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                    <Button variant="outline" size="sm" className="flex-1">Clone</Button>
                    <Button variant="outline" size="sm" className="flex-1">Test</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-4">
              {selectedNode ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Node Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Selected: {selectedNode.title}</Label>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Node Properties:</Label>
                        <div className="text-xs mt-1 space-y-1">
                          <div>• Name: {selectedNode.properties.name}</div>
                          <div>• Type: {selectedNode.type}</div>
                          {selectedNode.properties.assignedTo && (
                            <div>• Assigned To: {selectedNode.properties.assignedTo}</div>
                          )}
                          {selectedNode.properties.timeout && (
                            <div>• Timeout: {selectedNode.properties.timeout}</div>
                          )}
                          {selectedNode.properties.priority && (
                            <div>• Priority: {selectedNode.properties.priority}</div>
                          )}
                        </div>
                      </div>

                      {selectedNode.properties.conditions && (
                        <div>
                          <Label className="text-xs">Conditions:</Label>
                          <div className="text-xs mt-1 space-y-1">
                            {selectedNode.properties.conditions.map((condition, index) => (
                              <div key={index}>IF {condition} THEN approved</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedNode.properties.notifications && (
                        <div>
                          <Label className="text-xs">Notifications:</Label>
                          <div className="text-xs mt-1 space-y-1">
                            {selectedNode.properties.notifications.map((notification, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {notification}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">Update</Button>
                      <Button variant="outline" size="sm" className="flex-1">Test</Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => removeNode(selectedNode.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-gray-500 text-sm">
                  Select a node to view properties
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-white border-b p-2 flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ZoomIn className="h-4 w-4 mr-1" />
              Zoom In
            </Button>
            <Button variant="outline" size="sm">
              <ZoomOut className="h-4 w-4 mr-1" />
              Zoom Out
            </Button>
            <Button variant="outline" size="sm">
              <Grid className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button variant="outline" size="sm">
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
          </div>

          {/* Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 bg-gray-100 relative overflow-auto"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Grid Background */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Workflow Nodes */}
            {nodes.map((node) => {
              const Icon = getNodeIcon(node.type);
              const colorClass = getNodeColor(node.type);
              
              return (
                <div
                  key={node.id}
                  className={`absolute p-3 bg-white border-2 rounded-lg cursor-pointer hover:shadow-lg transition-shadow ${
                    selectedNode?.id === node.id ? 'border-blue-500' : 'border-gray-300'
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded ${colorClass}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{node.title}</div>
                      {node.properties.assignedTo && (
                        <div className="text-xs text-gray-500">{node.properties.assignedTo}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Connection Points */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
              );
            })}

            {/* Connection Lines (simplified visualization) */}
            <svg className="absolute inset-0 pointer-events-none">
              {connections.map((connection, index) => {
                const fromNode = nodes.find(n => n.id === connection.from);
                const toNode = nodes.find(n => n.id === connection.to);
                
                if (!fromNode || !toNode) return null;
                
                const fromX = fromNode.x + 75; // Approximate center
                const fromY = fromNode.y + 60; // Bottom of node
                const toX = toNode.x + 75;
                const toY = toNode.y + 10; // Top of node
                
                return (
                  <g key={index}>
                    <line
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke="#6b7280"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                    {connection.condition && (
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2}
                        fill="#374151"
                        fontSize="12"
                        textAnchor="middle"
                        className="bg-white"
                      >
                        {connection.condition}
                      </text>
                    )}
                  </g>
                );
              })}
              
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#6b7280"
                  />
                </marker>
              </defs>
            </svg>
          </div>

          {/* Real-time Monitoring Panel */}
          <Card className="m-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Real-time Process Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                  <span className="text-sm">Active Instances: 24</span>
                </div>
                <div className="flex items-center gap-2">
                  <Pause className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">Paused: 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 fill-red-500 text-red-500" />
                  <span className="text-sm">Failed: 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 fill-blue-500 text-blue-500" />
                  <span className="text-sm">Done: 156</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Instance ID</th>
                      <th className="text-left p-2">Current Step</th>
                      <th className="text-left p-2">Duration</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflowInstances.map((instance) => (
                      <tr key={instance.id} className="border-b">
                        <td className="p-2">{instance.id}</td>
                        <td className="p-2">{instance.currentStep}</td>
                        <td className="p-2">{instance.duration}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(instance.status)}
                            {getStatusBadge(instance.status)}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t p-2 text-sm text-gray-600">
        Workflow: Student Application Review • Version: 1.3 • Last Modified: Today
      </div>
    </div>
  );
};

export default WorkflowDesigner;