import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Monitor,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Zap,
  Users,
  Settings,
  BarChart3,
  Activity,
  Database,
  Server,
  Clock,
  Download,
  Mail,
  StopCircle,
  Play,
  Pause,
  FileBarChart,
  CheckCircle,
  XCircle,
  Target,
  Eye,
  Calendar,
  Building
} from 'lucide-react';

interface MatchingMetrics {
  totalStudents: number;
  matched: number;
  pending: number;
  conflicts: number;
  satisfaction: number;
  efficiency: number;
  fairness: number;
  utilization: number;
}

interface Anomaly {
  id: string;
  level: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actions: string[];
}

interface Laboratory {
  id: string;
  name: string;
  icon: string;
  capacity: number;
  current: number;
  utilization: number;
}

interface WeekAssignment {
  week: number;
  assignments: { [key: string]: number };
}

interface SystemStatus {
  server: 'healthy' | 'warning' | 'error';
  database: 'online' | 'offline' | 'maintenance';
  algorithm: 'running' | 'stopped' | 'error';
  responseTime: number;
  lastUpdate: string;
}

const SecretaryMatchingMonitor: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const [metrics] = useState<MatchingMetrics>({
    totalStudents: 247,
    matched: 234,
    pending: 13,
    conflicts: 8,
    satisfaction: 87,
    efficiency: 73,
    fairness: 91,
    utilization: 84
  });

  const [anomalies] = useState<Anomaly[]>([
    {
      id: '1',
      level: 'high',
      title: 'Capacity Imbalance',
      description: 'Lab A: 15 students / Lab B: 3',
      actions: ['Investigate', 'Auto-Balance']
    },
    {
      id: '2',
      level: 'medium',
      title: 'Preference Conflict',
      description: '12 students unassigned',
      actions: ['Review', 'Manual Assignment']
    },
    {
      id: '3',
      level: 'low',
      title: 'Equipment Scheduling',
      description: '3 labs double-booked',
      actions: ['Schedule', 'Notify Labs']
    }
  ]);

  const [laboratories] = useState<Laboratory[]>([
    { id: '1', name: 'Molecular Bio', icon: '🧬', capacity: 20, current: 18, utilization: 90 },
    { id: '2', name: 'Microscopy', icon: '🔬', capacity: 15, current: 15, utilization: 100 },
    { id: '3', name: 'Chemistry', icon: '⚗️', capacity: 25, current: 23, utilization: 92 },
    { id: '4', name: 'Biochemistry', icon: '🧪', capacity: 18, current: 12, utilization: 67 },
    { id: '5', name: 'Microbiology', icon: '🦠', capacity: 22, current: 21, utilization: 95 },
    { id: '6', name: 'Physics Lab', icon: '🔋', capacity: 16, current: 8, utilization: 50 },
    { id: '7', name: 'Computer Sim', icon: '💻', capacity: 30, current: 28, utilization: 93 }
  ]);

  const [weeklyAssignments] = useState<WeekAssignment[]>([
    { week: 1, assignments: { '🧬': 18, '🔬': 15, '⚗️': 23, '🧪': 12, '🦠': 21, '🔋': 8, '💻': 28 } },
    { week: 2, assignments: { '🔬': 15, '⚗️': 23, '🧪': 12, '🦠': 21, '🔋': 8, '💻': 28, '🧬': 18 } },
    { week: 3, assignments: { '⚗️': 23, '🧪': 12, '🦠': 21, '🔋': 8, '💻': 28, '🧬': 18, '🔬': 15 } },
    { week: 4, assignments: { '🧪': 12, '🦠': 21, '🔋': 8, '💻': 28, '🧬': 18, '🔬': 15, '⚗️': 23 } },
    { week: 5, assignments: { '🦠': 21, '🔋': 8, '💻': 28, '🧬': 18, '🔬': 15, '⚗️': 23, '🧪': 12 } },
    { week: 6, assignments: { '🔋': 8, '💻': 28, '🧬': 18, '🔬': 15, '⚗️': 23, '🧪': 12, '🦠': 21 } }
  ]);

  const [systemStatus] = useState<SystemStatus>({
    server: 'healthy',
    database: 'online',
    algorithm: 'running',
    responseTime: 0.8,
    lastUpdate: '2 min ago'
  });

  const [historicalData] = useState([
    { cycle: 'Cycle1', successRate: 95 },
    { cycle: 'Cycle2', successRate: 93 },
    { cycle: 'Cycle3', successRate: 95 },
    { cycle: 'Cycle4', successRate: 78 },
    { cycle: 'Cycle5', successRate: 85 },
    { cycle: 'Cycle6', successRate: 91 }
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAnomalyAction = (anomalyId: string, action: string) => {
    console.log(`Executing action: ${action} for anomaly: ${anomalyId}`);
  };

  const handleInterventionAction = (action: string) => {
    console.log(`Executing intervention: ${action}`);
  };

  const getAnomalyColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
      case 'offline':
      case 'stopped':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalUtilization = Math.round(laboratories.reduce((sum, lab) => sum + lab.utilization, 0) / laboratories.length);
  const imbalancedLabs = laboratories.filter(lab => lab.utilization < 70 || lab.utilization > 95).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Monitor className="w-8 h-8 text-blue-600" />
              实验室轮转匹配监控台
            </h1>
            <p className="text-gray-600 mt-1">实时监控匹配进度和异常检测</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Badge className="bg-green-100 text-green-800">
              在线 • 最后更新: {systemStatus.lastUpdate}
            </Badge>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📊 概览</TabsTrigger>
            <TabsTrigger value="analytics">🔍 分析</TabsTrigger>
            <TabsTrigger value="alerts">⚠️ 警报</TabsTrigger>
            <TabsTrigger value="trends">📈 趋势</TabsTrigger>
            <TabsTrigger value="interventions">🎯 干预</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Real-time Matching Metrics */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    实时匹配指标
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center border-b pb-4">
                    <h3 className="font-semibold text-lg">当前轮转周期</h3>
                    <p className="text-gray-600">Cycle 3 of 6 (Fall 2024)</p>
                    <p className="text-sm text-orange-600">剩余天数: 14</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">匹配统计</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">总学生数:</span>
                        <div className="font-semibold text-xl">{metrics.totalStudents}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">已匹配:</span>
                        <div className="font-semibold text-xl text-green-600">
                          {metrics.matched} ({Math.round((metrics.matched / metrics.totalStudents) * 100)}%)
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">等待中:</span>
                        <div className="font-semibold text-xl text-yellow-600">
                          {metrics.pending} ({Math.round((metrics.pending / metrics.totalStudents) * 100)}%)
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">冲突:</span>
                        <div className="font-semibold text-xl text-red-600">
                          {metrics.conflicts} ({Math.round((metrics.conflicts / metrics.totalStudents) * 100)}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">质量评分</h4>
                    <div className="space-y-2">
                      {[
                        { name: '满意度', value: metrics.satisfaction, color: 'bg-blue-500' },
                        { name: '效率', value: metrics.efficiency, color: 'bg-green-500' },
                        { name: '公平性', value: metrics.fairness, color: 'bg-purple-500' },
                        { name: '利用率', value: metrics.utilization, color: 'bg-orange-500' }
                      ].map((metric, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{metric.name}:</span>
                            <span className="font-medium">{metric.value}%</span>
                          </div>
                          <Progress value={metric.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline">导出</Button>
                    <Button size="sm" variant="outline">历史</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Anomaly Detection System */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-5 h-5" />
                    异常检测系统
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">活跃异常</span>
                    <Badge className="bg-red-100 text-red-800">{anomalies.length}</Badge>
                  </div>

                  <div className="space-y-3">
                    {anomalies.map((anomaly) => (
                      <div 
                        key={anomaly.id} 
                        className={`p-3 rounded-lg border ${getAnomalyColor(anomaly.level)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {anomaly.level.toUpperCase()}: {anomaly.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{anomaly.description}</p>
                        <div className="flex gap-2">
                          {anomaly.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => handleAnomalyAction(anomaly.id, action)}
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      查看全部
                    </Button>
                    <Button size="sm" variant="outline">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      创建警报
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Intervention Controls */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    快速干预控制
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">🔄 重新运行匹配算法</h4>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleInterventionAction('execute-now')}
                        >
                          立即执行
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInterventionAction('schedule-later')}
                        >
                          计划执行
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">📧 发送通知</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">学生</Button>
                        <Button size="sm" variant="outline">实验室</Button>
                        <Button size="sm" variant="outline">教师</Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">🔒 紧急停止</h4>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleInterventionAction('stop-all')}
                        >
                          <StopCircle className="w-4 h-4 mr-2" />
                          全部停止
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleInterventionAction('pause-matching')}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          暂停匹配
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">📊 生成报告</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">当前状态</Button>
                        <Button size="sm" variant="outline">周报</Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleInterventionAction('execute')}
                      >
                        执行
                      </Button>
                      <Button size="sm" variant="outline">计划</Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Laboratory Capacity Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-green-600" />
                  实验室容量状态
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-4">
                  {laboratories.map((lab) => (
                    <div key={lab.id} className="text-center p-3 border rounded-lg bg-white">
                      <div className="text-2xl mb-2">{lab.icon}</div>
                      <div className="font-medium text-sm">{lab.name}</div>
                      <div className="text-xs text-gray-600 mb-2">
                        {lab.current} / {lab.capacity}
                      </div>
                      <Progress value={lab.utilization} className="h-2 mb-1" />
                      <div className="text-xs text-gray-600">{lab.utilization}%</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span>🎯 总利用率: {totalUtilization}%</span>
                    <span>⚠️ 失衡实验室: {imbalancedLabs}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">平衡</Button>
                    <Button size="sm" variant="outline">重新分配</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Assignment Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  学生分配可视化
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-6 gap-4 min-w-[600px]">
                    {weeklyAssignments.map((week) => (
                      <div key={week.week} className="text-center">
                        <h4 className="font-medium mb-3">Week {week.week}</h4>
                        <div className="space-y-2">
                          {Object.entries(week.assignments).map(([icon, count]) => (
                            <div key={icon} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span className="text-lg">{icon}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    查看详情
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    下载排程
                  </Button>
                  <Button variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    邮件学生
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    系统性能
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4 text-gray-500" />
                      <span>服务器状态:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.server)}
                      <span className="capitalize">{systemStatus.server}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>响应时间:</span>
                    </div>
                    <span>{systemStatus.responseTime}s</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-500" />
                      <span>数据库:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.database)}
                      <span className="capitalize">{systemStatus.database}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                      <span>最后更新:</span>
                    </div>
                    <span>{systemStatus.lastUpdate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span>算法:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(systemStatus.algorithm)}
                      <span className="capitalize">{systemStatus.algorithm}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3">
                    <Button size="sm" variant="outline">重启</Button>
                    <Button size="sm" variant="outline">诊断</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Historical Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    历史对比趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="font-medium">匹配成功率 (最近6个周期)</h4>
                    
                    <div className="space-y-2">
                      {historicalData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{data.cycle}:</span>
                          <div className="flex items-center gap-2 flex-1 ml-3">
                            <Progress value={data.successRate} className="h-2 flex-1" />
                            <span className="text-sm font-medium w-12">{data.successRate}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg text-sm">
                      <h5 className="font-medium mb-2">关键见解:</h5>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Cycle 3 达到性能峰值 (95% 满意度)</li>
                        <li>• Cycle 5 出现容量问题</li>
                        <li>• 趋势表明需要算法优化</li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">详细分析</Button>
                      <Button size="sm" variant="outline">导出趋势</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>详细分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">分析功能正在开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>警报管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">警报管理功能正在开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>趋势分析</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">趋势分析功能正在开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interventions Tab */}
          <TabsContent value="interventions">
            <Card>
              <CardHeader>
                <CardTitle>干预历史</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">干预历史功能正在开发中...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Footer */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>最后刷新: 30秒前</span>
            <span>下次算法运行: 4小时</span>
            <span>警报数: {anomalies.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretaryMatchingMonitor;