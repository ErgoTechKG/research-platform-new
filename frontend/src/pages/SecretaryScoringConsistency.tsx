import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navigate } from 'react-router-dom'
import { 
  BarChart3, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Users,
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Settings,
  Target,
  PieChart,
  Activity,
  Bell,
  Zap
} from 'lucide-react'

interface Evaluator {
  id: string
  name: string
  department: string
  totalEvaluations: number
  averageScore: number
  standardDeviation: number
  consistencyRank: number
  anomalyCount: number
  lastEvaluation: string
  trend: 'up' | 'down' | 'stable'
  status: 'normal' | 'warning' | 'critical'
}

interface ScoringAnomaly {
  id: string
  evaluatorId: string
  evaluatorName: string
  type: 'too_high' | 'too_low' | 'inconsistent' | 'pattern_change'
  severity: 'high' | 'medium' | 'low'
  description: string
  suggestedAction: string
  detectedAt: string
  status: 'pending' | 'reviewed' | 'resolved'
}

interface ScoreDistribution {
  range: string
  count: number
  percentage: number
  color: string
}

const SecretaryScoringConsistency = () => {
  const { user } = useAuth()
  
  // Redirect to login if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const [evaluators] = useState<Evaluator[]>([
    {
      id: '1',
      name: '张教授',
      department: '计算机学院',
      totalEvaluations: 156,
      averageScore: 87.5,
      standardDeviation: 8.2,
      consistencyRank: 1,
      anomalyCount: 2,
      lastEvaluation: '2024-03-15 14:30',
      trend: 'stable',
      status: 'normal'
    },
    {
      id: '2',
      name: '李老师',
      department: '软件学院',
      totalEvaluations: 203,
      averageScore: 92.3,
      standardDeviation: 15.6,
      consistencyRank: 8,
      anomalyCount: 7,
      lastEvaluation: '2024-03-15 16:45',
      trend: 'up',
      status: 'warning'
    },
    {
      id: '3',
      name: '王副教授',
      department: '人工智能学院',
      totalEvaluations: 89,
      averageScore: 78.9,
      standardDeviation: 12.4,
      consistencyRank: 5,
      anomalyCount: 3,
      lastEvaluation: '2024-03-15 11:20',
      trend: 'down',
      status: 'normal'
    },
    {
      id: '4',
      name: '陈教授',
      department: '数据科学学院',
      totalEvaluations: 134,
      averageScore: 95.8,
      standardDeviation: 18.9,
      consistencyRank: 12,
      anomalyCount: 15,
      lastEvaluation: '2024-03-15 09:15',
      trend: 'up',
      status: 'critical'
    }
  ])

  const [anomalies] = useState<ScoringAnomaly[]>([
    {
      id: '1',
      evaluatorId: '4',
      evaluatorName: '陈教授',
      type: 'too_high',
      severity: 'high',
      description: '评分明显高于同组平均水平（高出2.3个标准差）',
      suggestedAction: '建议重新审核评分标准，调整评分偏向',
      detectedAt: '2024-03-15 16:30',
      status: 'pending'
    },
    {
      id: '2',
      evaluatorId: '2',
      evaluatorName: '李老师',
      type: 'inconsistent',
      severity: 'medium',
      description: '评分波动较大，标准差超过预设阈值',
      suggestedAction: '建议进行评分标准培训和校准',
      detectedAt: '2024-03-15 15:45',
      status: 'reviewed'
    },
    {
      id: '3',
      evaluatorId: '1',
      evaluatorName: '张教授',
      type: 'pattern_change',
      severity: 'low',
      description: '近期评分模式发生变化，可能需要关注',
      suggestedAction: '建议与评价者沟通，了解评分变化原因',
      detectedAt: '2024-03-15 14:20',
      status: 'resolved'
    }
  ])

  const [scoreDistribution] = useState<ScoreDistribution[]>([
    { range: '90-100', count: 245, percentage: 35.2, color: 'bg-green-500' },
    { range: '80-89', count: 298, percentage: 42.8, color: 'bg-blue-500' },
    { range: '70-79', count: 112, percentage: 16.1, color: 'bg-yellow-500' },
    { range: '60-69', count: 32, percentage: 4.6, color: 'bg-orange-500' },
    { range: '0-59', count: 9, percentage: 1.3, color: 'bg-red-500' }
  ])

  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('month')
  const [selectedEvaluator, setSelectedEvaluator] = useState<Evaluator | null>(null)

  // Filter evaluators based on department
  const filteredEvaluators = evaluators.filter(evaluator => 
    selectedDepartment === 'all' || evaluator.department === selectedDepartment
  )

  // Statistics
  const stats = {
    totalEvaluators: evaluators.length,
    normalEvaluators: evaluators.filter(e => e.status === 'normal').length,
    warningEvaluators: evaluators.filter(e => e.status === 'warning').length,
    criticalEvaluators: evaluators.filter(e => e.status === 'critical').length,
    pendingAnomalies: anomalies.filter(a => a.status === 'pending').length,
    averageConsistency: Math.round(evaluators.reduce((sum, e) => sum + (100 - e.standardDeviation), 0) / evaluators.length),
    totalEvaluations: evaluators.reduce((sum, e) => sum + e.totalEvaluations, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'critical':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常'
      case 'warning':
        return '警告'
      case 'critical':
        return '严重'
      default:
        return '未知'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getAnomalyTypeText = (type: string) => {
    switch (type) {
      case 'too_high':
        return '评分过高'
      case 'too_low':
        return '评分过低'
      case 'inconsistent':
        return '评分不一致'
      case 'pattern_change':
        return '模式变化'
      default:
        return '其他'
    }
  }

  const generateReport = () => {
    // Simulate report generation
    console.log('Generating consistency report...')
  }

  const handleCalibration = (evaluatorId: string) => {
    console.log(`Starting calibration for evaluator ${evaluatorId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              评分一致性检查
            </h1>
            <p className="text-gray-600">
              异常检测 | 分布分析 | 自动纠偏 | 一致性监控
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generateReport}>
              <Download className="w-4 h-4 mr-2" />
              生成报告
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              校准设置
            </Button>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" data-testid="overview-statistics">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">评价者总数</p>
                  <p className="text-xl font-bold text-blue-600">{stats.totalEvaluators}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">待处理异常</p>
                  <p className="text-xl font-bold text-red-600">{stats.pendingAnomalies}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">平均一致性</p>
                  <p className="text-xl font-bold text-green-600">{stats.averageConsistency}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">总评价数</p>
                  <p className="text-xl font-bold text-purple-600">{stats.totalEvaluations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6" data-testid="filters-section">
          <CardHeader>
            <CardTitle>筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">部门</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger data-testid="department-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="计算机学院">计算机学院</SelectItem>
                    <SelectItem value="软件学院">软件学院</SelectItem>
                    <SelectItem value="人工智能学院">人工智能学院</SelectItem>
                    <SelectItem value="数据科学学院">数据科学学院</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">时间范围</label>
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger data-testid="time-range-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">近一周</SelectItem>
                    <SelectItem value="month">近一月</SelectItem>
                    <SelectItem value="quarter">近三月</SelectItem>
                    <SelectItem value="year">近一年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Distribution */}
          <Card data-testid="score-distribution">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                评分分布分析
              </CardTitle>
              <CardDescription>整体评分分布情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scoreDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium">{item.range}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 w-12">{item.percentage}%</div>
                        <div className="text-sm text-gray-500 w-12">({item.count})</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Anomalies */}
          <Card data-testid="recent-anomalies">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                异常检测预警
              </CardTitle>
              <CardDescription>最近发现的评分异常</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomalies.slice(0, 3).map((anomaly) => (
                  <div key={anomaly.id} className="p-3 border rounded-lg" data-testid="anomaly-item">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{anomaly.evaluatorName}</span>
                          <Badge className={getSeverityColor(anomaly.severity)}>
                            {getAnomalyTypeText(anomaly.type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{anomaly.description}</p>
                        <p className="text-xs text-blue-600">{anomaly.suggestedAction}</p>
                      </div>
                      <div className="text-xs text-gray-500">{anomaly.detectedAt}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evaluators Performance */}
        <Card data-testid="evaluators-performance">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              评价者性能分析
            </CardTitle>
            <CardDescription>评价者一致性排名和性能指标</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredEvaluators.map((evaluator) => (
                <div 
                  key={evaluator.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedEvaluator?.id === evaluator.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedEvaluator(evaluator)}
                  data-testid="evaluator-item"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{evaluator.name}</h4>
                        <Badge className={getStatusColor(evaluator.status)}>
                          {getStatusText(evaluator.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">{evaluator.department}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">评价总数：</span>
                          <span className="font-medium">{evaluator.totalEvaluations}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">平均分：</span>
                          <span className="font-medium">{evaluator.averageScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">标准差：</span>
                          <span className="font-medium">{evaluator.standardDeviation}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">排名：</span>
                          <span className="font-medium">#{evaluator.consistencyRank}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">异常数：</span>
                          <span className="font-medium text-red-600">{evaluator.anomalyCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">趋势：</span>
                          {getTrendIcon(evaluator.trend)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCalibration(evaluator.id)
                        }}
                        data-testid="calibration-button"
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        校准
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis (when evaluator is selected) */}
        {selectedEvaluator && (
          <Card className="mt-6" data-testid="detailed-analysis">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                详细分析 - {selectedEvaluator.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.round(100 - selectedEvaluator.standardDeviation)}%
                  </div>
                  <div className="text-sm text-gray-600">一致性评分</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    #{selectedEvaluator.consistencyRank}
                  </div>
                  <div className="text-sm text-gray-600">一致性排名</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {selectedEvaluator.anomalyCount}
                  </div>
                  <div className="text-sm text-gray-600">异常次数</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium mb-3">建议操作</h5>
                <div className="space-y-2">
                  {selectedEvaluator.status === 'critical' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>紧急：</strong>该评价者存在严重的评分偏差，建议立即进行评分标准校准和培训。
                      </p>
                    </div>
                  )}
                  {selectedEvaluator.status === 'warning' && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>注意：</strong>该评价者的评分一致性需要改善，建议安排评分标准讨论会。
                      </p>
                    </div>
                  )}
                  {selectedEvaluator.status === 'normal' && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>良好：</strong>该评价者的评分表现稳定，可以作为标准参考。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card className="mt-6" data-testid="system-status">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              系统状态概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">正常评价者</div>
                  <div className="text-sm text-gray-600">{stats.normalEvaluators} 人</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="font-medium">警告评价者</div>
                  <div className="text-sm text-gray-600">{stats.warningEvaluators} 人</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div>
                  <div className="font-medium">严重评价者</div>
                  <div className="text-sm text-gray-600">{stats.criticalEvaluators} 人</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}

export default SecretaryScoringConsistency