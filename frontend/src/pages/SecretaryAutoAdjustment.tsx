import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  RotateCcw, 
  BarChart3, 
  History, 
  AlertTriangle, 
  Play, 
  Pause, 
  Square, 
  Mail, 
  Lock, 
  Unlock,
  TrendingUp,
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';

interface AdjustmentRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Warning' | 'Disabled';
  parameters: Record<string, any>;
}

interface AdjustmentProcess {
  status: 'Running' | 'Paused' | 'Stopped' | 'Completed';
  progress: number;
  startTime: string;
  eta: string;
  studentsAffected: number;
  labsModified: number;
  conflictsResolved: number;
  newConflicts: number;
  overallSatisfaction: number;
  efficiencyGain: number;
  fairnessScore: number;
}

interface LabChange {
  labName: string;
  before: number;
  after: number;
  change: number;
  status: 'improved' | 'minor' | 'nochange' | 'review';
}

interface AdjustmentHistory {
  id: string;
  dateTime: string;
  trigger: string;
  changes: number;
  success: number;
  duration: string;
}

interface Notification {
  type: 'students' | 'faculty' | 'labs';
  count: number;
  details: string[];
}

const SecretaryAutoAdjustment: React.FC = () => {
  const [adjustmentRules, setAdjustmentRules] = useState<AdjustmentRule[]>([
    {
      id: '1',
      name: 'Capacity Balancing',
      description: 'Max deviation: ±3 students',
      enabled: true,
      priority: 'High',
      status: 'Active',
      parameters: { maxDeviation: 3, priority: 'High' }
    },
    {
      id: '2',
      name: 'Preference Optimization',
      description: 'Weight: 85%, Min satisfaction: 75%',
      enabled: true,
      priority: 'High',
      status: 'Active',
      parameters: { weight: 85, minSatisfaction: 75 }
    },
    {
      id: '3',
      name: 'Equipment Availability',
      description: 'Check conflicts: Enabled, Auto-resolve: Yes',
      enabled: true,
      priority: 'Medium',
      status: 'Active',
      parameters: { checkConflicts: true, autoResolve: true }
    },
    {
      id: '4',
      name: 'Faculty Workload Balancing',
      description: 'Max load per lab: 25 students',
      enabled: true,
      priority: 'Medium',
      status: 'Warning',
      parameters: { maxLoadPerLab: 25 }
    },
    {
      id: '5',
      name: 'Time Slot Optimization',
      description: 'Algorithm incomplete',
      enabled: false,
      priority: 'Low',
      status: 'Disabled',
      parameters: {}
    }
  ]);

  const [currentProcess, setCurrentProcess] = useState<AdjustmentProcess>({
    status: 'Running',
    progress: 67,
    startTime: '14:23',
    eta: '8 minutes',
    studentsAffected: 42,
    labsModified: 6,
    conflictsResolved: 8,
    newConflicts: 2,
    overallSatisfaction: 89,
    efficiencyGain: 12,
    fairnessScore: 91
  });

  const [labChanges] = useState<LabChange[]>([
    { labName: 'Lab A', before: 12, after: 15, change: 3, status: 'improved' },
    { labName: 'Lab B', before: 23, after: 20, change: -3, status: 'improved' },
    { labName: 'Lab C', before: 8, after: 12, change: 4, status: 'improved' },
    { labName: 'Lab D', before: 18, after: 14, change: -4, status: 'improved' },
    { labName: 'Lab E', before: 15, after: 16, change: 1, status: 'minor' },
    { labName: 'Lab F', before: 20, after: 19, change: -1, status: 'minor' },
    { labName: 'Lab G', before: 14, after: 14, change: 0, status: 'nochange' }
  ]);

  const [adjustmentHistory] = useState<AdjustmentHistory[]>([
    { id: '1', dateTime: '08/02 14:23', trigger: 'Capacity Alert', changes: 42, success: 95, duration: '8.2 min' },
    { id: '2', dateTime: '08/02 09:15', trigger: 'Manual Override', changes: 18, success: 100, duration: '3.1 min' },
    { id: '3', dateTime: '08/01 16:45', trigger: 'Preference Opt', changes: 67, success: 87, duration: '12.8 min' },
    { id: '4', dateTime: '08/01 11:30', trigger: 'Equipment Issue', changes: 23, success: 100, duration: '5.4 min' },
    { id: '5', dateTime: '07/31 14:20', trigger: 'Schedule Conflict', changes: 31, success: 92, duration: '7.6 min' }
  ]);

  const [notifications] = useState<Notification[]>([
    {
      type: 'students',
      count: 18,
      details: ['Schedule changes: 15', 'Lab assignments: 3']
    },
    {
      type: 'faculty',
      count: 4,
      details: ['Capacity changes: 2', 'Equipment updates: 2']
    },
    {
      type: 'labs',
      count: 2,
      details: ['Schedule conflicts: 1', 'Resource allocation: 1']
    }
  ]);

  const [algorithmParams, setAlgorithmParams] = useState({
    optimizationLevel: 'High',
    maxIterations: 1000,
    convergenceThreshold: 0.01
  });

  const [isLocked, setIsLocked] = useState(false);
  const [lockDuration, setLockDuration] = useState('4 hours');

  const toggleRule = (ruleId: string) => {
    setAdjustmentRules(rules =>
      rules.map(rule =>
        rule.id === ruleId
          ? { ...rule, enabled: !rule.enabled, status: rule.enabled ? 'Disabled' : 'Active' }
          : rule
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Disabled':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeIcon = (status: string) => {
    switch (status) {
      case 'improved':
        return '🟢';
      case 'minor':
        return '🟡';
      case 'nochange':
        return '⚫';
      case 'review':
        return '🔴';
      default:
        return '⚫';
    }
  };

  const handleProcessControl = (action: 'pause' | 'stop' | 'force_complete') => {
    setCurrentProcess(prev => ({
      ...prev,
      status: action === 'pause' ? 'Paused' : action === 'stop' ? 'Stopped' : 'Completed'
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <RotateCcw className="h-8 w-8 text-blue-600" />
                Laboratory Rotation Auto-adjustment Console
              </h1>
              <p className="text-gray-600 mt-2">
                Intelligent adjustment system for laboratory rotation management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                Auto-adjustment: ON
              </Badge>
              <Badge variant="outline" className="text-sm">
                Last Run: 2 minutes ago
              </Badge>
              <Badge variant="outline" className="text-sm">
                Next Scheduled: 15:30
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Rules
            </TabsTrigger>
            <TabsTrigger value="adjustments" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Adjustments
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Adjustment Rules Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Adjustment Rules Configuration
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Active Rules ({adjustmentRules.filter(r => r.enabled).length}/{adjustmentRules.length})
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adjustmentRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(rule.status)}
                          <div>
                            <h4 className="font-medium">{rule.name}</h4>
                            <p className="text-sm text-gray-600">{rule.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(rule.priority)}>
                            {rule.priority}
                          </Badge>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleRule(rule.id)}
                        >
                          {rule.enabled ? 'Disable' : 'Enable'}
                        </Button>
                        {rule.status === 'Warning' && (
                          <Button variant="outline" size="sm" className="text-yellow-600">
                            Fix Issue
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline">+ Add Rule</Button>
                    <Button variant="outline">Import</Button>
                    <Button variant="outline">Test All</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Manual Override Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Manual Override Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Emergency Adjustments */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Emergency Adjustments
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Force Re-balance All Labs</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive">Execute</Button>
                          <Button size="sm" variant="outline">Schedule</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notification Controls */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Notify All Stakeholders
                    </h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Students</Button>
                      <Button size="sm" variant="outline">Faculty</Button>
                      <Button size="sm" variant="outline">Labs</Button>
                    </div>
                  </div>

                  {/* Lock Controls */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      Lock Current Assignments
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Duration:</span>
                        <Select value={lockDuration} onValueChange={setLockDuration}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1 hour">1 hour</SelectItem>
                            <SelectItem value="4 hours">4 hours</SelectItem>
                            <SelectItem value="8 hours">8 hours</SelectItem>
                            <SelectItem value="24 hours">24 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={isLocked ? "destructive" : "default"}
                          onClick={() => setIsLocked(!isLocked)}
                        >
                          {isLocked ? 'Remove Lock' : 'Apply Lock'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Algorithm Parameters */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Algorithm Parameters
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Optimization level:</span>
                        <Select
                          value={algorithmParams.optimizationLevel}
                          onValueChange={(value) =>
                            setAlgorithmParams(prev => ({ ...prev, optimizationLevel: value }))
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Max iterations:</span>
                        <Input
                          type="number"
                          value={algorithmParams.maxIterations}
                          onChange={(e) =>
                            setAlgorithmParams(prev => ({
                              ...prev,
                              maxIterations: parseInt(e.target.value)
                            }))
                          }
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Convergence:</span>
                        <Input
                          type="number"
                          step="0.001"
                          value={algorithmParams.convergenceThreshold}
                          onChange={(e) =>
                            setAlgorithmParams(prev => ({
                              ...prev,
                              convergenceThreshold: parseFloat(e.target.value)
                            }))
                          }
                          className="w-32"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Update</Button>
                      <Button size="sm" variant="outline">Reset to Default</Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button>Execute Manual Run</Button>
                    <Button variant="outline">Test Mode</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Adjustments Tab */}
          <TabsContent value="adjustments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Adjustment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Real-time Adjustment Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge
                        variant={currentProcess.status === 'Running' ? 'default' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        {currentProcess.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress:</span>
                        <span>{currentProcess.progress}%</span>
                      </div>
                      <Progress value={currentProcess.progress} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Started:</span>
                        <span className="font-medium">{currentProcess.startTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ETA:</span>
                        <span className="font-medium">{currentProcess.eta}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Adjustment Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Students Affected:</span>
                        <span className="font-medium">{currentProcess.studentsAffected}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labs Modified:</span>
                        <span className="font-medium">{currentProcess.labsModified}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conflicts Resolved:</span>
                        <span className="font-medium text-green-600">{currentProcess.conflictsResolved}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Conflicts:</span>
                        <span className="font-medium text-red-600">{currentProcess.newConflicts}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Quality Metrics
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Overall Satisfaction:</span>
                        <span className="font-medium text-green-600">{currentProcess.overallSatisfaction}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency Gain:</span>
                        <span className="font-medium text-blue-600">+{currentProcess.efficiencyGain}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fairness Score:</span>
                        <span className="font-medium text-green-600">{currentProcess.fairnessScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProcessControl('pause')}
                      disabled={currentProcess.status !== 'Running'}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProcessControl('stop')}
                      disabled={currentProcess.status === 'Stopped'}
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleProcessControl('force_complete')}
                    >
                      Force Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Adjustment Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Adjustment Visualization
                  </CardTitle>
                  <p className="text-sm text-gray-600">Before → After Changes</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {labChanges.map((lab, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getChangeIcon(lab.status)}</span>
                          <span className="font-medium">{lab.labName}:</span>
                        </div>
                        <div className="text-sm">
                          <span>{lab.before}→{lab.after}</span>
                          <span className={`ml-2 ${lab.change > 0 ? 'text-blue-600' : lab.change < 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                            ({lab.change > 0 ? '+' : ''}{lab.change})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-2">Legend:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span>🟢</span>
                        <span>Improved</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🟡</span>
                        <span>Minor Change</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⚫</span>
                        <span>No Change</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🔴</span>
                        <span>Needs Review</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Export Report</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Adjustment Results & Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">94.3%</div>
                          <div className="text-sm text-gray-600">Average Success Rate</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">8.2</div>
                          <div className="text-sm text-gray-600">Avg Duration (min)</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">156</div>
                          <div className="text-sm text-gray-600">Total Students</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">7</div>
                          <div className="text-sm text-gray-600">Active Labs</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Success Trends Chart Placeholder */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Success Trends (Last 7 Days)</h4>
                    <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                        <p>Success rate trending chart would be displayed here</p>
                        <p className="text-sm">Shows daily success rates with trend analysis</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      Key Insights
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Average success rate: 94.3%</li>
                      <li>• Peak efficiency during manual overrides</li>
                      <li>• Equipment issues cause most adjustment delays</li>
                      <li>• Capacity balancing shows highest impact on satisfaction</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline">Detailed Report</Button>
                    <Button variant="outline">Export Data</Button>
                    <Button variant="outline">Schedule Analysis</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Adjustment History & Analytics
                </CardTitle>
                <p className="text-sm text-gray-600">Recent Adjustments (Last 7 Days)</p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Date/Time</th>
                        <th className="text-left py-2">Trigger</th>
                        <th className="text-left py-2">Changes</th>
                        <th className="text-left py-2">Success</th>
                        <th className="text-left py-2">Duration</th>
                        <th className="text-left py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adjustmentHistory.map((record) => (
                        <tr key={record.id} className="border-b">
                          <td className="py-2">{record.dateTime}</td>
                          <td className="py-2">{record.trigger}</td>
                          <td className="py-2">{record.changes}</td>
                          <td className="py-2">
                            <Badge
                              variant={record.success >= 95 ? 'default' : record.success >= 90 ? 'secondary' : 'destructive'}
                            >
                              {record.success}%
                            </Badge>
                          </td>
                          <td className="py-2">{record.duration}</td>
                          <td className="py-2">
                            <Button size="sm" variant="outline">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Notification Center
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Pending Notifications ({notifications.reduce((sum, n) => sum + n.count, 0)})
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {notification.type === 'students' && <Users className="h-4 w-4" />}
                        {notification.type === 'faculty' && <Users className="h-4 w-4" />}
                        {notification.type === 'labs' && <Building2 className="h-4 w-4" />}
                        <h4 className="font-medium capitalize">{notification.type}</h4>
                        <Badge variant="secondary">({notification.count})</Badge>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 mb-3">
                      {notification.details.map((detail, idx) => (
                        <li key={idx}>• {detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="flex gap-2 pt-4">
                  <Button>Send All</Button>
                  <Button variant="outline">Schedule Batch</Button>
                  <Button variant="outline">Preview</Button>
                  <Button variant="outline">Configure Rules</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Footer */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Auto-adjustment: ON
              </span>
              <span>Last Run: 2 minutes ago</span>
              <span>Next Scheduled: 15:30</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Notifications: 24 pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryAutoAdjustment;