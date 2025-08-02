import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SimpleChart from '@/components/charts/SimpleChart'
import PieChart from '@/components/charts/PieChart'
import GaugeChart from '@/components/charts/GaugeChart'
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  Users,
  Calendar,
  BookOpen,
  Settings,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  Activity,
  Clock,
  Shield,
  Zap,
  Database,
  Cpu,
  UserCheck,
  GraduationCap,
  Building,
  Wrench,
  MapPin,
  FileText,
  Lightbulb,
  Eye,
  CheckCircle,
  XCircle,
  Loader,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

interface PredictionModel {
  id: string
  name: string
  type: 'linear_regression' | 'decision_tree' | 'neural_network' | 'random_forest'
  accuracy: number
  lastTrained: string
  status: 'active' | 'training' | 'inactive'
  description: string
}

interface StudentPrediction {
  studentId: string
  studentName: string
  currentGrade: number
  predictedGrade: number
  riskLevel: 'low' | 'medium' | 'high'
  confidence: number
  factors: string[]
  recommendations: string[]
}

interface ResourcePrediction {
  resource: string
  currentUsage: number
  predictedUsage: number
  trend: 'up' | 'down' | 'stable'
  timeframe: string
  demandLevel: 'low' | 'medium' | 'high'
}

interface RiskAssessment {
  category: 'academic' | 'management' | 'systematic'
  riskType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: number
  impact: number
  description: string
  mitigation: string[]
  timeline: string
}

export default function PredictiveAnalytics() {
  const [selectedModel, setSelectedModel] = useState('model_1')
  const [selectedTimeframe, setSelectedTimeframe] = useState('semester')
  const [isTraining, setIsTraining] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedTab, setSelectedTab] = useState('student-performance')

  // Mock prediction models
  const predictionModels: PredictionModel[] = [
    {
      id: 'model_1',
      name: '学生成绩预测模型 v2.1',
      type: 'neural_network',
      accuracy: 87.5,
      lastTrained: '2024-02-01',
      status: 'active',
      description: '基于神经网络的学生成绩预测模型，考虑历史成绩、出勤率、作业提交情况等因素'
    },
    {
      id: 'model_2',
      name: '资源需求预测模型 v1.8',
      type: 'random_forest',
      accuracy: 82.3,
      lastTrained: '2024-01-28',
      status: 'active',
      description: '随机森林算法预测教室、设备等资源的使用需求'
    },
    {
      id: 'model_3',
      name: '风险评估模型 v1.5',
      type: 'decision_tree',
      accuracy: 79.8,
      lastTrained: '2024-01-25',
      status: 'training',
      description: '决策树模型用于识别学术和管理风险'
    }
  ]

  // Mock student predictions
  const studentPredictions: StudentPrediction[] = [
    {
      studentId: 'ST001',
      studentName: '张同学',
      currentGrade: 78,
      predictedGrade: 82,
      riskLevel: 'low',
      confidence: 0.89,
      factors: ['历史成绩稳定', '出勤率高', '作业按时提交'],
      recommendations: ['保持当前学习状态', '可考虑挑战更高难度课程']
    },
    {
      studentId: 'ST002',
      studentName: '李同学',
      currentGrade: 65,
      predictedGrade: 58,
      riskLevel: 'high',
      confidence: 0.76,
      factors: ['近期成绩下降', '缺勤增加', '作业提交延迟'],
      recommendations: ['需要导师额外关注', '建议参加辅导课程', '调整学习计划']
    },
    {
      studentId: 'ST003',
      studentName: '王同学',
      currentGrade: 72,
      predictedGrade: 74,
      riskLevel: 'medium',
      confidence: 0.81,
      factors: ['成绩波动较大', '参与度中等'],
      recommendations: ['加强课程参与', '定期学习进度检查']
    }
  ]

  // Mock resource predictions
  const resourcePredictions: ResourcePrediction[] = [
    {
      resource: '实验室A',
      currentUsage: 75,
      predictedUsage: 88,
      trend: 'up',
      timeframe: '下周',
      demandLevel: 'high'
    },
    {
      resource: '多媒体教室',
      currentUsage: 60,
      predictedUsage: 55,
      trend: 'down',
      timeframe: '下月',
      demandLevel: 'medium'
    },
    {
      resource: '图书馆研讨室',
      currentUsage: 85,
      predictedUsage: 85,
      trend: 'stable',
      timeframe: '下周',
      demandLevel: 'high'
    },
    {
      resource: '导师资源',
      currentUsage: 92,
      predictedUsage: 95,
      trend: 'up',
      timeframe: '下月',
      demandLevel: 'critical'
    }
  ]

  // Mock risk assessments
  const riskAssessments: RiskAssessment[] = [
    {
      category: 'academic',
      riskType: '学生挂科风险',
      severity: 'high',
      probability: 0.68,
      impact: 0.85,
      description: '预计有15%的学生存在挂科风险，主要集中在数学和物理课程',
      mitigation: ['提供额外辅导', '调整课程难度', '增加实践环节'],
      timeline: '期末考试前'
    },
    {
      category: 'management',
      riskType: '资源冲突风险',
      severity: 'medium',
      probability: 0.45,
      impact: 0.60,
      description: '下月实验室使用需求可能超过容量，存在资源调度冲突',
      mitigation: ['优化排课安排', '增加设备采购', '推行分时使用制'],
      timeline: '下个月'
    },
    {
      category: 'systematic',
      riskType: '系统性能风险',
      severity: 'low',
      probability: 0.25,
      impact: 0.40,
      description: '随着用户数量增长，系统性能可能出现瓶颈',
      mitigation: ['服务器扩容', '代码优化', '负载均衡'],
      timeline: '下学期'
    }
  ]

  // Chart data for performance prediction trends
  const performanceTrendData = {
    labels: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
    datasets: [
      {
        label: '预测平均分',
        data: [76, 77, 79, 78, 80, 82],
        color: '#3b82f6',
        backgroundColor: '#3b82f620'
      },
      {
        label: '实际平均分',
        data: [75, 78, 77, 79, 81, 0], // Last point is 0 as it's future
        color: '#10b981',
        backgroundColor: '#10b98120'
      }
    ]
  }

  // Risk distribution data
  const riskDistributionData = [
    { label: '低风险', value: 65, color: '#10b981' },
    { label: '中风险', value: 25, color: '#f59e0b' },
    { label: '高风险', value: 10, color: '#ef4444' }
  ]

  // Resource demand chart data
  const resourceDemandData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '实验室需求',
        data: [80, 85, 92, 88, 95, 90],
        color: '#8b5cf6'
      },
      {
        label: '教室需求',
        data: [70, 75, 82, 78, 85, 80],
        color: '#06b6d4'
      }
    ]
  }

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case 'neural_network': return <Brain className="w-4 h-4" />
      case 'random_forest': return <Database className="w-4 h-4" />
      case 'decision_tree': return <BarChart3 className="w-4 h-4" />
      default: return <Cpu className="w-4 h-4" />
    }
  }

  const getModelTypeName = (type: string) => {
    const names = {
      'neural_network': '神经网络',
      'random_forest': '随机森林',
      'decision_tree': '决策树',
      'linear_regression': '线性回归'
    }
    return names[type as keyof typeof names] || type
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      case 'critical': return 'text-red-800 bg-red-100'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />
      default: return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'high': return 'bg-orange-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const handleModelRetrain = () => {
    setIsTraining(true)
    setTimeout(() => {
      setIsTraining(false)
      setLastUpdate(new Date())
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">学生表现预测分析</h1>
              <p className="text-gray-600 mt-1">
                基于机器学习的智能预测分析系统，提供学生表现预测、资源需求分析和风险评估
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Model Selector */}
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {predictionModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Timeframe Selector */}
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">本周</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="semester">本学期</SelectItem>
                  <SelectItem value="year">本年度</SelectItem>
                </SelectContent>
              </Select>

              {/* Retrain Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleModelRetrain}
                disabled={isTraining}
              >
                {isTraining ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isTraining ? '训练中' : '重新训练'}
              </Button>

              {/* Export Button */}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>

          {/* Model Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {predictionModels.map((model) => (
              <Card key={model.id} className={`${selectedModel === model.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getModelTypeIcon(model.type)}
                      <span className="font-medium text-sm">{getModelTypeName(model.type)}</span>
                    </div>
                    <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                      {model.status === 'active' ? '运行中' : model.status === 'training' ? '训练中' : '未激活'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">准确率</span>
                      <span className="font-bold text-lg">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                    <div className="text-xs text-gray-500">
                      最后训练: {model.lastTrained}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="student-performance">学生表现预测</TabsTrigger>
              <TabsTrigger value="resource-demand">资源需求预测</TabsTrigger>
              <TabsTrigger value="risk-assessment">风险评估</TabsTrigger>
              <TabsTrigger value="model-management">模型管理</TabsTrigger>
            </TabsList>

            {/* Student Performance Prediction */}
            <TabsContent value="student-performance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      成绩趋势预测
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleChart 
                      data={performanceTrendData}
                      type="area"
                      height={250}
                      animate={true}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      基于历史数据预测未来6周的平均成绩变化趋势
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      风险分布
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <PieChart 
                        data={riskDistributionData}
                        size={200}
                        animate={true}
                        centerText="100名学生"
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600 text-center">
                      基于预测模型分析的学生风险等级分布
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student Predictions Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    学生个体预测结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">学生</th>
                          <th className="text-center py-3 px-4">当前成绩</th>
                          <th className="text-center py-3 px-4">预测成绩</th>
                          <th className="text-center py-3 px-4">风险等级</th>
                          <th className="text-center py-3 px-4">置信度</th>
                          <th className="text-left py-3 px-4">建议</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentPredictions.map((prediction) => (
                          <tr key={prediction.studentId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">{prediction.studentName}</div>
                                <div className="text-sm text-gray-500">{prediction.studentId}</div>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="font-medium">{prediction.currentGrade}</span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className={`font-medium ${
                                prediction.predictedGrade > prediction.currentGrade ? 'text-green-600' : 
                                prediction.predictedGrade < prediction.currentGrade ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                {prediction.predictedGrade}
                                {prediction.predictedGrade !== prediction.currentGrade && (
                                  <span className="text-xs ml-1">
                                    ({prediction.predictedGrade > prediction.currentGrade ? '+' : ''}
                                    {prediction.predictedGrade - prediction.currentGrade})
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge className={getRiskLevelColor(prediction.riskLevel)}>
                                {prediction.riskLevel === 'low' ? '低风险' : 
                                 prediction.riskLevel === 'medium' ? '中风险' : '高风险'}
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <span className="text-sm">{Math.round(prediction.confidence * 100)}%</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm">
                                {prediction.recommendations.slice(0, 2).map((rec, i) => (
                                  <div key={i} className="text-gray-600">• {rec}</div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resource Demand Prediction */}
            <TabsContent value="resource-demand" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Resource Demand Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      资源需求趋势
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleChart 
                      data={resourceDemandData}
                      type="line"
                      height={250}
                      animate={true}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      未来6个月的资源使用需求预测（使用率%）
                    </div>
                  </CardContent>
                </Card>

                {/* Resource Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      资源状态监控
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resourcePredictions.map((resource, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{resource.resource}</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(resource.trend)}
                            <Badge className={getRiskLevelColor(resource.demandLevel)}>
                              {resource.demandLevel === 'low' ? '需求低' :
                               resource.demandLevel === 'medium' ? '需求中' :
                               resource.demandLevel === 'high' ? '需求高' : '需求紧急'}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>当前使用率: {resource.currentUsage}%</span>
                            <span className={resource.predictedUsage > resource.currentUsage ? 'text-red-600' : 'text-green-600'}>
                              预测使用率: {resource.predictedUsage}%
                            </span>
                          </div>
                          <Progress value={resource.predictedUsage} className="h-2" />
                          <div className="text-xs text-gray-500">
                            预测时间: {resource.timeframe}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Risk Assessment */}
            <TabsContent value="risk-assessment" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Risk Summary Cards */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">学术风险</p>
                        <p className="text-2xl font-bold text-red-600">高</p>
                      </div>
                      <GraduationCap className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">15%学生存在挂科风险</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">管理风险</p>
                        <p className="text-2xl font-bold text-yellow-600">中</p>
                      </div>
                      <Settings className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">资源调度存在冲突风险</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">系统风险</p>
                        <p className="text-2xl font-bold text-green-600">低</p>
                      </div>
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">系统运行状态良好</p>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    风险详细分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAssessments.map((risk, i) => (
                      <Alert key={i} className={getRiskLevelColor(risk.severity)}>
                        <AlertTriangle className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{risk.riskType}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {risk.category === 'academic' ? '学术' : 
                                 risk.category === 'management' ? '管理' : '系统'}
                              </Badge>
                              <Badge className={getRiskLevelColor(risk.severity)}>
                                {risk.severity === 'low' ? '低' :
                                 risk.severity === 'medium' ? '中' :
                                 risk.severity === 'high' ? '高' : '严重'}
                              </Badge>
                            </div>
                          </div>
                          <AlertDescription className="mb-3">
                            {risk.description}
                          </AlertDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">发生概率: </span>
                              <span>{Math.round(risk.probability * 100)}%</span>
                            </div>
                            <div>
                              <span className="font-medium">影响程度: </span>
                              <span>{Math.round(risk.impact * 100)}%</span>
                            </div>
                            <div>
                              <span className="font-medium">预期时间: </span>
                              <span>{risk.timeline}</span>
                            </div>
                            <div>
                              <span className="font-medium">风险等级: </span>
                              <span className={
                                risk.severity === 'low' ? 'text-green-600' :
                                risk.severity === 'medium' ? 'text-yellow-600' :
                                risk.severity === 'high' ? 'text-red-600' : 'text-red-800'
                              }>
                                {Math.round(risk.probability * risk.impact * 100)}分
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="font-medium text-sm">缓解措施:</span>
                            <ul className="mt-1 text-sm space-y-1">
                              {risk.mitigation.map((measure, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <span className="text-gray-400">•</span>
                                  <span>{measure}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Model Management */}
            <TabsContent value="model-management" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Model Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      模型性能对比
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {predictionModels.map((model) => (
                      <div key={model.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getModelTypeIcon(model.type)}
                            <span className="font-medium">{model.name}</span>
                          </div>
                          <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                            {model.status === 'active' ? '运行中' : model.status === 'training' ? '训练中' : '未激活'}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>准确率</span>
                            <span className="font-medium">{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-2" />
                          <div className="text-xs text-gray-500">
                            算法类型: {getModelTypeName(model.type)} | 
                            最后训练: {model.lastTrained}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            {model.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Model Training History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      训练历史
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { date: '2024-02-01', accuracy: 87.5, status: 'success', notes: '增加新特征，性能提升2%' },
                        { date: '2024-01-28', accuracy: 85.3, status: 'success', notes: '优化超参数' },
                        { date: '2024-01-25', accuracy: 83.1, status: 'success', notes: '扩增训练数据集' },
                        { date: '2024-01-22', accuracy: 79.8, status: 'warning', notes: '模型过拟合，需要调整' },
                        { date: '2024-01-19', accuracy: 82.4, status: 'success', notes: '基线模型建立' }
                      ].map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              entry.status === 'success' ? 'bg-green-500' : 
                              entry.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <div className="font-medium text-sm">{entry.date}</div>
                              <div className="text-xs text-gray-500">{entry.notes}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{entry.accuracy}%</div>
                            <div className="text-xs text-gray-500">准确率</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    模型配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">数据分割比例</label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">训练集</div>
                          <div className="font-medium">70%</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">验证集</div>
                          <div className="font-medium">20%</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">测试集</div>
                          <div className="font-medium">10%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">训练参数</label>
                      <div className="text-sm text-gray-600">
                        <div>学习率: 0.001</div>
                        <div>批次大小: 32</div>
                        <div>迭代次数: 100</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">特征工程</label>
                      <div className="text-sm text-gray-600">
                        <div>特征数量: 24</div>
                        <div>数据规范化: MinMax</div>
                        <div>缺失值处理: 均值填充</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}