import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Download,
  RefreshCw,
  FileText,
  PieChart,
  UserCheck,
  AlertCircle
} from 'lucide-react'

interface ReviewProgress {
  dimension: string
  total: number
  completed: number
  inProgress: number
  pending: number
  percentage: number
}

interface ScoreDistribution {
  range: string
  count: number
  percentage: number
}

interface ExpertWorkload {
  expertId: string
  expertName: string
  assigned: number
  completed: number
  avgTime: string
  avgScore: number
  status: 'active' | 'idle' | 'offline'
}

interface QualityIndicator {
  indicator: string
  value: number
  trend: 'up' | 'down' | 'stable'
  status: 'good' | 'warning' | 'error'
}

interface AnomalyAlert {
  id: string
  type: 'score_deviation' | 'time_exceeded' | 'incomplete' | 'system'
  severity: 'high' | 'medium' | 'low'
  message: string
  timestamp: string
  expert?: string
}

export default function RealtimeStatisticsPanel() {
  const [selectedDimension, setSelectedDimension] = useState('all')
  const [refreshInterval, setRefreshInterval] = useState('30')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)

  // Mock data
  const reviewProgress: ReviewProgress[] = [
    { dimension: '思想品德', total: 150, completed: 120, inProgress: 20, pending: 10, percentage: 80 },
    { dimension: '科技创新', total: 150, completed: 95, inProgress: 30, pending: 25, percentage: 63 },
    { dimension: '实践能力', total: 150, completed: 110, inProgress: 25, pending: 15, percentage: 73 },
    { dimension: '发展潜力', total: 150, completed: 85, inProgress: 35, pending: 30, percentage: 57 },
    { dimension: '综合素质', total: 150, completed: 75, inProgress: 40, pending: 35, percentage: 50 }
  ]

  const scoreDistribution: ScoreDistribution[] = [
    { range: '90-100', count: 15, percentage: 10 },
    { range: '80-89', count: 45, percentage: 30 },
    { range: '70-79', count: 60, percentage: 40 },
    { range: '60-69', count: 25, percentage: 17 },
    { range: '0-59', count: 5, percentage: 3 }
  ]

  const expertWorkload: ExpertWorkload[] = [
    { expertId: '1', expertName: '张教授', assigned: 50, completed: 45, avgTime: '8分钟', avgScore: 82, status: 'active' },
    { expertId: '2', expertName: '李教授', assigned: 50, completed: 38, avgTime: '10分钟', avgScore: 78, status: 'active' },
    { expertId: '3', expertName: '王教授', assigned: 50, completed: 42, avgTime: '6分钟', avgScore: 85, status: 'idle' },
    { expertId: '4', expertName: '陈教授', assigned: 50, completed: 30, avgTime: '12分钟', avgScore: 76, status: 'active' },
    { expertId: '5', expertName: '刘教授', assigned: 50, completed: 25, avgTime: '15分钟', avgScore: 80, status: 'offline' }
  ]

  const qualityIndicators: QualityIndicator[] = [
    { indicator: '评分一致性', value: 85, trend: 'up', status: 'good' },
    { indicator: '完成及时率', value: 72, trend: 'down', status: 'warning' },
    { indicator: '评语完整度', value: 90, trend: 'stable', status: 'good' },
    { indicator: '异常检出率', value: 5, trend: 'up', status: 'warning' }
  ]

  const anomalyAlerts: AnomalyAlert[] = [
    { id: '1', type: 'score_deviation', severity: 'high', message: '王教授在科技创新维度评分明显偏高（+15分）', timestamp: '10:32', expert: '王教授' },
    { id: '2', type: 'time_exceeded', severity: 'medium', message: '刘教授平均评审时间超过预期（15分钟/人）', timestamp: '10:15', expert: '刘教授' },
    { id: '3', type: 'incomplete', severity: 'low', message: '3份评审表缺少评语说明', timestamp: '09:45' },
    { id: '4', type: 'system', severity: 'medium', message: '系统检测到异常登录尝试', timestamp: '09:20' }
  ]

  // Auto refresh
  useEffect(() => {
    if (!isAutoRefresh) return

    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, parseInt(refreshInterval) * 1000)

    return () => clearInterval(interval)
  }, [isAutoRefresh, refreshInterval])

  const getTotalProgress = () => {
    const total = reviewProgress.reduce((sum, p) => sum + p.total, 0)
    const completed = reviewProgress.reduce((sum, p) => sum + p.completed, 0)
    return Math.round((completed / total) * 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↑'
      case 'down': return '↓'
      default: return '→'
    }
  }

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">实时统计面板</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  最后更新: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10秒</SelectItem>
                  <SelectItem value="30">30秒</SelectItem>
                  <SelectItem value="60">1分钟</SelectItem>
                  <SelectItem value="300">5分钟</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={isAutoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                自动刷新
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">总体进度</p>
                    <p className="text-2xl font-bold">{getTotalProgress()}%</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <Progress value={getTotalProgress()} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">在线专家</p>
                    <p className="text-2xl font-bold">3/5</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">60% 在线率</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均评分</p>
                    <p className="text-2xl font-bold">78.2</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 2.3 较昨日</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">异常预警</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-2">需要关注</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="progress">评审进度</TabsTrigger>
              <TabsTrigger value="distribution">分数分布</TabsTrigger>
              <TabsTrigger value="workload">工作量统计</TabsTrigger>
              <TabsTrigger value="quality">质量指标</TabsTrigger>
              <TabsTrigger value="alerts">异常预警</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    各维度评审进度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewProgress.map((progress) => (
                      <div key={progress.dimension} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{progress.dimension}</span>
                          <span className="text-sm text-gray-600">
                            {progress.completed}/{progress.total} ({progress.percentage}%)
                          </span>
                        </div>
                        <div className="relative">
                          <Progress value={progress.percentage} className="h-8" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex gap-2 text-xs">
                              <span className="text-green-600">{progress.completed} 完成</span>
                              <span className="text-yellow-600">{progress.inProgress} 进行中</span>
                              <span className="text-gray-600">{progress.pending} 待评</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    分数分布统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">分数段分布</h4>
                      <div className="space-y-3">
                        {scoreDistribution.map((dist) => (
                          <div key={dist.range} className="flex items-center gap-3">
                            <span className="w-20 text-sm">{dist.range}分</span>
                            <div className="flex-1">
                              <Progress value={dist.percentage} className="h-6" />
                            </div>
                            <span className="w-16 text-sm text-right">
                              {dist.count}人 ({dist.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">统计指标</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">最高分</span>
                          <span className="font-medium">96</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">最低分</span>
                          <span className="font-medium">52</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">平均分</span>
                          <span className="font-medium">78.2</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-sm text-gray-600">中位数</span>
                          <span className="font-medium">76.5</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600">标准差</span>
                          <span className="font-medium">8.3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    专家工作量统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">专家</th>
                          <th className="text-center py-3 px-4">状态</th>
                          <th className="text-center py-3 px-4">分配任务</th>
                          <th className="text-center py-3 px-4">已完成</th>
                          <th className="text-center py-3 px-4">完成率</th>
                          <th className="text-center py-3 px-4">平均用时</th>
                          <th className="text-center py-3 px-4">平均分</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expertWorkload.map((expert) => (
                          <tr key={expert.expertId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(expert.status)}`} />
                                {expert.expertName}
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge variant={expert.status === 'active' ? 'default' : 'secondary'}>
                                {expert.status === 'active' ? '在线' : expert.status === 'idle' ? '空闲' : '离线'}
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">{expert.assigned}</td>
                            <td className="text-center py-3 px-4">{expert.completed}</td>
                            <td className="text-center py-3 px-4">
                              <span className={expert.completed / expert.assigned > 0.8 ? 'text-green-600' : ''}>
                                {Math.round((expert.completed / expert.assigned) * 100)}%
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">{expert.avgTime}</td>
                            <td className="text-center py-3 px-4">{expert.avgScore}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    评审质量指标
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {qualityIndicators.map((indicator) => (
                      <Card key={indicator.indicator}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{indicator.indicator}</span>
                            <span className={`text-sm ${getQualityStatusColor(indicator.status)}`}>
                              {indicator.value}% {getTrendIcon(indicator.trend)}
                            </span>
                          </div>
                          <Progress 
                            value={indicator.value} 
                            className={`h-2 ${
                              indicator.status === 'good' ? '[&>div]:bg-green-500' :
                              indicator.status === 'warning' ? '[&>div]:bg-yellow-500' :
                              '[&>div]:bg-red-500'
                            }`}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    异常情况预警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {anomalyAlerts.map((alert) => (
                      <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                        <AlertTriangle className="h-4 w-4" />
                        <div className="flex-1">
                          <AlertDescription className="flex items-center justify-between">
                            <span>{alert.message}</span>
                            <span className="text-xs">{alert.timestamp}</span>
                          </AlertDescription>
                        </div>
                      </Alert>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      查看全部
                    </Button>
                    <Button variant="outline" size="sm">
                      清除已读
                    </Button>
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