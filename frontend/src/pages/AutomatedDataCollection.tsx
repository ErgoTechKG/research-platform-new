import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Database,
  Download,
  Upload,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  RefreshCw,
  Play,
  Pause,
  FileText,
  Server,
  Globe,
  Shield,
  TrendingUp,
  Calendar,
  Filter,
  Monitor,
  Bell,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Plus,
  Trash2
} from 'lucide-react'

interface DataSource {
  id: string
  name: string
  type: 'database' | 'api' | 'file' | 'ftp'
  url: string
  status: 'active' | 'inactive' | 'error'
  lastSync: string
  nextSync: string
  schedule: string
  dataCount: number
  errorCount: number
  rateLimit: number
  config: Record<string, any>
}

interface ExtractionTask {
  id: string
  name: string
  sourceId: string
  sourceName: string
  status: 'running' | 'completed' | 'failed' | 'pending' | 'paused'
  progress: number
  startTime: string
  endTime?: string
  recordsProcessed: number
  recordsTotal: number
  errorMessages: string[]
  validationPassed: boolean
}

interface DataQualityMetric {
  metric: string
  value: number
  threshold: number
  status: 'good' | 'warning' | 'error'
  description: string
}

interface ValidationRule {
  id: string
  name: string
  type: 'required' | 'format' | 'range' | 'unique' | 'business'
  field: string
  condition: string
  enabled: boolean
  errorCount: number
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  sourceId?: string
  acknowledged: boolean
}

interface RateLimitConfig {
  sourceId: string
  requestsPerSecond: number
  requestsPerMinute: number
  requestsPerHour: number
  currentUsage: number
  resetTime: string
}

export default function AutomatedDataCollection() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_day')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isNewSourceDialogOpen, setIsNewSourceDialogOpen] = useState(false)
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null)

  // Mock data for data sources
  const dataSources: DataSource[] = [
    {
      id: '1',
      name: '学生管理系统数据库',
      type: 'database',
      url: 'mysql://localhost:3306/students',
      status: 'active',
      lastSync: '2024-01-15 14:30:00',
      nextSync: '2024-01-15 15:00:00',
      schedule: '0 */30 * * * *',
      dataCount: 15420,
      errorCount: 2,
      rateLimit: 100,
      config: { batchSize: 1000, timeout: 30 }
    },
    {
      id: '2',
      name: '课程评价API',
      type: 'api',
      url: 'https://api.course.edu/v1/evaluations',
      status: 'active',
      lastSync: '2024-01-15 14:25:00',
      nextSync: '2024-01-15 14:35:00',
      schedule: '0 */10 * * * *',
      dataCount: 8760,
      errorCount: 0,
      rateLimit: 1000,
      config: { apiKey: 'xxx', version: 'v1' }
    },
    {
      id: '3',
      name: '成绩导入文件',
      type: 'file',
      url: '/data/imports/grades/',
      status: 'inactive',
      lastSync: '2024-01-15 13:00:00',
      nextSync: '2024-01-15 16:00:00',
      schedule: '0 0 */3 * * *',
      dataCount: 5230,
      errorCount: 15,
      rateLimit: 0,
      config: { filePattern: '*.csv', encoding: 'utf-8' }
    },
    {
      id: '4',
      name: '外部系统FTP',
      type: 'ftp',
      url: 'ftp://external.edu/data/',
      status: 'error',
      lastSync: '2024-01-15 12:00:00',
      nextSync: '2024-01-15 18:00:00',
      schedule: '0 0 */6 * * *',
      dataCount: 2150,
      errorCount: 8,
      rateLimit: 50,
      config: { username: 'user', password: 'xxx', path: '/exports' }
    }
  ]

  // Mock data for extraction tasks
  const extractionTasks: ExtractionTask[] = [
    {
      id: '1',
      name: '学生基本信息同步',
      sourceId: '1',
      sourceName: '学生管理系统数据库',
      status: 'running',
      progress: 75,
      startTime: '2024-01-15 14:30:00',
      recordsProcessed: 11565,
      recordsTotal: 15420,
      errorMessages: [],
      validationPassed: true
    },
    {
      id: '2',
      name: '课程评价数据抓取',
      sourceId: '2',
      sourceName: '课程评价API',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 14:25:00',
      endTime: '2024-01-15 14:28:00',
      recordsProcessed: 8760,
      recordsTotal: 8760,
      errorMessages: [],
      validationPassed: true
    },
    {
      id: '3',
      name: '成绩文件处理',
      sourceId: '3',
      sourceName: '成绩导入文件',
      status: 'failed',
      progress: 45,
      startTime: '2024-01-15 13:00:00',
      endTime: '2024-01-15 13:15:00',
      recordsProcessed: 2353,
      recordsTotal: 5230,
      errorMessages: ['格式验证失败', '重复记录过多', '必填字段缺失'],
      validationPassed: false
    },
    {
      id: '4',
      name: 'FTP文件同步',
      sourceId: '4',
      sourceName: '外部系统FTP',
      status: 'pending',
      progress: 0,
      startTime: '2024-01-15 18:00:00',
      recordsProcessed: 0,
      recordsTotal: 2150,
      errorMessages: [],
      validationPassed: false
    }
  ]

  // Mock data for quality metrics
  const qualityMetrics: DataQualityMetric[] = [
    { metric: '数据完整性', value: 96, threshold: 95, status: 'good', description: '必填字段完整率' },
    { metric: '数据准确性', value: 92, threshold: 90, status: 'good', description: '格式验证通过率' },
    { metric: '数据一致性', value: 88, threshold: 85, status: 'good', description: '跨源数据一致性' },
    { metric: '重复率控制', value: 3, threshold: 5, status: 'good', description: '重复记录占比' },
    { metric: '及时性指标', value: 94, threshold: 90, status: 'good', description: '数据更新及时率' },
    { metric: '异常值检测', value: 7, threshold: 10, status: 'good', description: '异常值占比' }
  ]

  // Mock data for validation rules
  const validationRules: ValidationRule[] = [
    { id: '1', name: '学号必填验证', type: 'required', field: 'student_id', condition: 'NOT NULL', enabled: true, errorCount: 5 },
    { id: '2', name: '邮箱格式验证', type: 'format', field: 'email', condition: 'REGEX @.*\\.edu', enabled: true, errorCount: 12 },
    { id: '3', name: '成绩范围验证', type: 'range', field: 'score', condition: '0 <= value <= 100', enabled: true, errorCount: 3 },
    { id: '4', name: '学号唯一性验证', type: 'unique', field: 'student_id', condition: 'UNIQUE', enabled: true, errorCount: 8 },
    { id: '5', name: '选课逻辑验证', type: 'business', field: 'course_selection', condition: 'MAX 8 COURSES', enabled: false, errorCount: 0 }
  ]

  // Mock data for system alerts
  const systemAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'error',
      title: 'FTP连接失败',
      message: '外部系统FTP连接超时，请检查网络连接和认证信息',
      timestamp: '2024-01-15 14:32:00',
      sourceId: '4',
      acknowledged: false
    },
    {
      id: '2',
      type: 'warning',
      title: '数据量异常',
      message: '课程评价API返回数据量比平时减少30%，建议检查',
      timestamp: '2024-01-15 14:25:00',
      sourceId: '2',
      acknowledged: false
    },
    {
      id: '3',
      type: 'info',
      title: '定时任务完成',
      message: '学生基本信息同步任务已成功完成，处理记录15420条',
      timestamp: '2024-01-15 14:15:00',
      sourceId: '1',
      acknowledged: true
    }
  ]

  // Mock data for rate limits
  const rateLimits: RateLimitConfig[] = [
    { sourceId: '1', requestsPerSecond: 10, requestsPerMinute: 100, requestsPerHour: 1000, currentUsage: 450, resetTime: '15:00:00' },
    { sourceId: '2', requestsPerSecond: 50, requestsPerMinute: 1000, requestsPerHour: 10000, currentUsage: 2340, resetTime: '15:00:00' },
    { sourceId: '3', requestsPerSecond: 0, requestsPerMinute: 0, requestsPerHour: 0, currentUsage: 0, resetTime: '00:00:00' },
    { sourceId: '4', requestsPerSecond: 5, requestsPerMinute: 50, requestsPerHour: 500, currentUsage: 120, resetTime: '15:00:00' }
  ]

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh])

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="w-4 h-4" />
      case 'api': return <Globe className="w-4 h-4" />
      case 'file': return <FileText className="w-4 h-4" />
      case 'ftp': return <Server className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'running': return 'text-blue-600 bg-blue-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'failed': return 'text-red-600 bg-red-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'paused': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'running': return <Activity className="w-4 h-4 text-blue-600" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'inactive': return <Pause className="w-4 h-4 text-gray-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      case 'paused': return <Pause className="w-4 h-4 text-orange-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const formatSchedule = (schedule: string) => {
    // Simple cron expression formatter
    if (schedule === '0 */30 * * * *') return '每30分钟'
    if (schedule === '0 */10 * * * *') return '每10分钟'
    if (schedule === '0 0 */3 * * *') return '每3小时'
    if (schedule === '0 0 */6 * * *') return '每6小时'
    return schedule
  }

  const getRateLimitUsage = (sourceId: string) => {
    const rateLimit = rateLimits.find(r => r.sourceId === sourceId)
    if (!rateLimit) return 0
    return Math.round((rateLimit.currentUsage / rateLimit.requestsPerHour) * 100)
  }

  const manualTrigger = (sourceId: string) => {
    alert(`手动触发数据源 ${sourceId} 的数据抓取任务`)
  }

  const pauseTask = (taskId: string) => {
    alert(`暂停任务 ${taskId}`)
  }

  const resumeTask = (taskId: string) => {
    alert(`恢复任务 ${taskId}`)
  }

  const acknowledgeAlert = (alertId: string) => {
    alert(`确认告警 ${alertId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">自动化数据收集系统</h1>
              <p className="text-gray-600 mt-1">定时数据抓取、多源整合、质量监控和自动化验证</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  最后更新: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label>自动刷新</Label>
              </div>
              <Dialog open={isNewSourceDialogOpen} onOpenChange={setIsNewSourceDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    添加数据源
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>配置新数据源</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>数据源名称</Label>
                        <Input placeholder="输入数据源名称" />
                      </div>
                      <div className="space-y-2">
                        <Label>数据源类型</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="选择类型" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="database">数据库</SelectItem>
                            <SelectItem value="api">API接口</SelectItem>
                            <SelectItem value="file">本地文件</SelectItem>
                            <SelectItem value="ftp">FTP服务器</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>连接地址</Label>
                      <Input placeholder="输入连接URL或路径" />
                    </div>
                    <div className="space-y-2">
                      <Label>执行计划 (Cron表达式)</Label>
                      <Input placeholder="0 */30 * * * *" />
                    </div>
                    <div className="space-y-2">
                      <Label>速率限制 (请求/小时)</Label>
                      <Input type="number" placeholder="1000" />
                    </div>
                    <div className="space-y-2">
                      <Label>配置参数</Label>
                      <Textarea placeholder="JSON格式的配置参数" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewSourceDialogOpen(false)}>
                        取消
                      </Button>
                      <Button onClick={() => setIsNewSourceDialogOpen(false)}>
                        保存配置
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                立即刷新
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">数据源总数</p>
                    <p className="text-2xl font-bold">{dataSources.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  {dataSources.filter(s => s.status === 'active').length} 个活跃
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">运行中任务</p>
                    <p className="text-2xl font-bold">
                      {extractionTasks.filter(t => t.status === 'running').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  {extractionTasks.filter(t => t.status === 'pending').length} 个待执行
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">数据质量</p>
                    <p className="text-2xl font-bold">92.5%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 2.1% 较昨日</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">系统告警</p>
                    <p className="text-2xl font-bold">
                      {systemAlerts.filter(a => !a.acknowledged).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Bell className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <p className="text-xs text-red-600 mt-2">需要处理</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sources" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="sources">数据源管理</TabsTrigger>
              <TabsTrigger value="tasks">抓取任务</TabsTrigger>
              <TabsTrigger value="monitoring">流程监控</TabsTrigger>
              <TabsTrigger value="quality">质量检查</TabsTrigger>
              <TabsTrigger value="ratelimits">速率管理</TabsTrigger>
              <TabsTrigger value="alerts">系统告警</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    数据源配置管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataSources.map((source) => (
                      <div key={source.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getSourceTypeIcon(source.type)}
                            <div>
                              <h4 className="font-medium">{source.name}</h4>
                              <p className="text-sm text-gray-600">{source.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(source.status)}>
                              {source.status === 'active' ? '运行中' : 
                               source.status === 'inactive' ? '已停止' : '错误'}
                            </Badge>
                            <Button variant="outline" size="sm" onClick={() => manualTrigger(source.id)}>
                              <Play className="w-3 h-3 mr-1" />
                              手动触发
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3 mr-1" />
                              编辑
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">执行计划:</span>
                            <div className="font-medium">{formatSchedule(source.schedule)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">上次同步:</span>
                            <div className="font-medium">{source.lastSync}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">下次同步:</span>
                            <div className="font-medium">{source.nextSync}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">数据量:</span>
                            <div className="font-medium">{source.dataCount.toLocaleString()} 条</div>
                          </div>
                        </div>

                        {source.errorCount > 0 && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            <span>检测到 {source.errorCount} 个错误</span>
                          </div>
                        )}

                        <div className="mt-3">
                          <div className="text-sm text-gray-600 mb-1">速率限制使用情况:</div>
                          <Progress value={getRateLimitUsage(source.id)} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {rateLimits.find(r => r.sourceId === source.id)?.currentUsage || 0} / {source.rateLimit} 请求/小时
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    数据抓取任务状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {extractionTasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <h4 className="font-medium">{task.name}</h4>
                              <p className="text-sm text-gray-600">{task.sourceName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(task.status)}>
                              {task.status === 'running' ? '运行中' :
                               task.status === 'completed' ? '已完成' :
                               task.status === 'failed' ? '失败' :
                               task.status === 'pending' ? '待执行' : '已暂停'}
                            </Badge>
                            {task.status === 'running' && (
                              <Button variant="outline" size="sm" onClick={() => pauseTask(task.id)}>
                                <Pause className="w-3 h-3 mr-1" />
                                暂停
                              </Button>
                            )}
                            {task.status === 'paused' && (
                              <Button variant="outline" size="sm" onClick={() => resumeTask(task.id)}>
                                <Play className="w-3 h-3 mr-1" />
                                恢复
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>处理进度</span>
                              <span>{task.recordsProcessed.toLocaleString()} / {task.recordsTotal.toLocaleString()} ({task.progress}%)</span>
                            </div>
                            <Progress value={task.progress} />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">开始时间:</span>
                              <div className="font-medium">{task.startTime}</div>
                            </div>
                            {task.endTime && (
                              <div>
                                <span className="text-gray-600">结束时间:</span>
                                <div className="font-medium">{task.endTime}</div>
                              </div>
                            )}
                            <div>
                              <span className="text-gray-600">验证状态:</span>
                              <div className={`font-medium ${task.validationPassed ? 'text-green-600' : 'text-red-600'}`}>
                                {task.validationPassed ? '通过' : '失败'}
                              </div>
                            </div>
                          </div>

                          {task.errorMessages.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded p-3">
                              <div className="text-sm font-medium text-red-800 mb-2">错误信息:</div>
                              <ul className="text-sm text-red-700 space-y-1">
                                {task.errorMessages.map((error, index) => (
                                  <li key={index}>• {error}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    数据流监控面板
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">今日数据量</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">31,560</div>
                          <div className="text-sm text-gray-600 mt-1">条记录</div>
                          <div className="flex items-center justify-center gap-1 mt-2 text-sm text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>↑ 12.5% 较昨日</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">处理效率</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">1,250</div>
                          <div className="text-sm text-gray-600 mt-1">条/分钟</div>
                          <div className="mt-3">
                            <Progress value={85} />
                            <div className="text-xs text-gray-500 mt-1">平均处理速度</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">系统负载</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>CPU使用率</span>
                              <span>65%</span>
                            </div>
                            <Progress value={65} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>内存使用率</span>
                              <span>72%</span>
                            </div>
                            <Progress value={72} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>网络带宽</span>
                              <span>45%</span>
                            </div>
                            <Progress value={45} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border">
                      <CardHeader>
                        <CardTitle>数据源活动状态</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dataSources.map((source) => (
                            <div key={source.id} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getSourceTypeIcon(source.type)}
                                <span className="text-sm font-medium">{source.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(source.status)}
                                <span className="text-xs text-gray-600">
                                  {source.status === 'active' ? '运行中' : '停止'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border">
                      <CardHeader>
                        <CardTitle>处理统计</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">成功处理</span>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">28,235</div>
                              <div className="text-xs text-gray-500">89.5%</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">验证失败</span>
                            <div className="text-right">
                              <div className="font-semibold text-red-600">2,105</div>
                              <div className="text-xs text-gray-500">6.7%</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">格式错误</span>
                            <div className="text-right">
                              <div className="font-semibold text-yellow-600">890</div>
                              <div className="text-xs text-gray-500">2.8%</div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">重复数据</span>
                            <div className="text-right">
                              <div className="font-semibold text-orange-600">330</div>
                              <div className="text-xs text-gray-500">1.0%</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quality" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    数据质量检查与验证
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium mb-4">质量指标</h4>
                      <div className="space-y-4">
                        {qualityMetrics.map((metric) => (
                          <div key={metric.metric} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{metric.metric}</span>
                              <span className={`text-sm font-semibold ${getQualityStatusColor(metric.status)}`}>
                                {metric.value}%
                              </span>
                            </div>
                            <Progress 
                              value={metric.value} 
                              className={`h-2 ${
                                metric.status === 'good' ? '[&>div]:bg-green-500' :
                                metric.status === 'warning' ? '[&>div]:bg-yellow-500' :
                                '[&>div]:bg-red-500'
                              }`}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{metric.description}</span>
                              <span>阈值: {metric.threshold}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">验证规则配置</h4>
                      <div className="space-y-3">
                        {validationRules.map((rule) => (
                          <div key={rule.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{rule.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {rule.type === 'required' ? '必填' :
                                   rule.type === 'format' ? '格式' :
                                   rule.type === 'range' ? '范围' :
                                   rule.type === 'unique' ? '唯一' : '业务'}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                字段: {rule.field} | 条件: {rule.condition}
                              </div>
                              {rule.errorCount > 0 && (
                                <div className="text-xs text-red-600 mt-1">
                                  错误数量: {rule.errorCount}
                                </div>
                              )}
                            </div>
                            <Switch checked={rule.enabled} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Card className="border">
                    <CardHeader>
                      <CardTitle className="text-lg">数据清洗统计</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">31,560</div>
                          <div className="text-sm text-gray-600">总记录数</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">28,235</div>
                          <div className="text-sm text-gray-600">清洗后保留</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">2,105</div>
                          <div className="text-sm text-gray-600">验证失败</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">1,220</div>
                          <div className="text-sm text-gray-600">重复删除</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ratelimits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    API速率限制管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataSources.map((source) => {
                      const rateLimit = rateLimits.find(r => r.sourceId === source.id)
                      if (!rateLimit) return null

                      return (
                        <div key={source.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getSourceTypeIcon(source.type)}
                              <div>
                                <h4 className="font-medium">{source.name}</h4>
                                <p className="text-sm text-gray-600">{source.url}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(source.status)}>
                              {source.status === 'active' ? '运行中' : 
                               source.status === 'inactive' ? '已停止' : '错误'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm font-medium">每秒请求数</div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">0</span>
                                <span className="text-xs">{rateLimit.requestsPerSecond}</span>
                              </div>
                              <Progress value={(rateLimit.currentUsage / rateLimit.requestsPerHour) * 100} />
                              <div className="text-xs text-gray-500">
                                当前: {Math.round((rateLimit.currentUsage / 3600) * 100) / 100}/秒
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm font-medium">每分钟请求数</div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">0</span>
                                <span className="text-xs">{rateLimit.requestsPerMinute}</span>
                              </div>
                              <Progress value={(rateLimit.currentUsage / rateLimit.requestsPerHour) * 100} />
                              <div className="text-xs text-gray-500">
                                当前: {Math.round((rateLimit.currentUsage / 60) * 100) / 100}/分钟
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm font-medium">每小时请求数</div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs">0</span>
                                <span className="text-xs">{rateLimit.requestsPerHour}</span>
                              </div>
                              <Progress 
                                value={(rateLimit.currentUsage / rateLimit.requestsPerHour) * 100}
                                className={
                                  (rateLimit.currentUsage / rateLimit.requestsPerHour) > 0.9 ? '[&>div]:bg-red-500' :
                                  (rateLimit.currentUsage / rateLimit.requestsPerHour) > 0.7 ? '[&>div]:bg-yellow-500' :
                                  '[&>div]:bg-green-500'
                                }
                              />
                              <div className="text-xs text-gray-500">
                                使用: {rateLimit.currentUsage} / {rateLimit.requestsPerHour}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              下次重置时间: {rateLimit.resetTime}
                            </span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Settings className="w-3 h-3 mr-1" />
                                调整限制
                              </Button>
                              {(rateLimit.currentUsage / rateLimit.requestsPerHour) > 0.9 && (
                                <Alert className="py-1 px-2">
                                  <AlertTriangle className="h-3 w-3" />
                                  <AlertDescription className="text-xs">
                                    即将达到速率限制
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    系统监控告警
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemAlerts.map((alert) => (
                      <Alert key={alert.id} className={getAlertColor(alert.type)}>
                        <AlertTriangle className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">{alert.title}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {alert.type === 'error' ? '错误' :
                                 alert.type === 'warning' ? '警告' : '信息'}
                              </Badge>
                              <span className="text-xs text-gray-500">{alert.timestamp}</span>
                            </div>
                          </div>
                          <AlertDescription className="mb-3">
                            {alert.message}
                          </AlertDescription>
                          {alert.sourceId && (
                            <div className="text-xs text-gray-600 mb-2">
                              数据源: {dataSources.find(s => s.id === alert.sourceId)?.name}
                            </div>
                          )}
                          <div className="flex justify-end gap-2">
                            {!alert.acknowledged && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                确认处理
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-3 h-3 mr-1" />
                              查看详情
                            </Button>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      显示最近 {systemAlerts.length} 条告警 | 
                      未处理: {systemAlerts.filter(a => !a.acknowledged).length} 条
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-3 h-3 mr-1" />
                        筛选
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        刷新
                      </Button>
                      <Button variant="outline" size="sm">
                        全部标记为已读
                      </Button>
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