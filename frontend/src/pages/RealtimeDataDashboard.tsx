import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SimpleChart from '@/components/charts/SimpleChart'
import PieChart from '@/components/charts/PieChart'
import GaugeChart from '@/components/charts/GaugeChart'
import { 
  BarChart3,
  Users,
  AlertTriangle,
  TrendingUp,
  Activity,
  Download,
  RefreshCw,
  Maximize,
  Minimize,
  Settings,
  PieChart as PieChartIcon,
  LineChart,
  Filter,
  Eye,
  Share,
  Bell,
  Clock,
  Database,
  Zap,
  Target,
  Gauge,
  Calendar,
  FileText,
  Monitor,
  Grid,
  Shield,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Loader
} from 'lucide-react'

interface KPIMetric {
  id: string
  title: string
  value: string | number
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  icon: any
  color: string
  unit?: string
  target?: number
  description: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color: string
  }[]
}

interface AnomalyAlert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  source: string
  acknowledged: boolean
}

interface DashboardWidget {
  id: string
  type: 'kpi' | 'chart' | 'table' | 'alert'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  visible: boolean
  data?: any
}

interface FilterConfig {
  dateRange: string
  department: string
  dataSource: string
  refreshRate: string
}

export default function RealtimeDataDashboard() {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedView, setSelectedView] = useState('overview')
  const [showSettings, setShowSettings] = useState(false)
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected')
  const [dataSourcesStatus, setDataSourcesStatus] = useState({
    database: 'healthy',
    api: 'healthy', 
    cache: 'warning',
    storage: 'healthy'
  })
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    dateRange: '24h',
    department: 'all',
    dataSource: 'all',
    refreshRate: '30s'
  })
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Mock KPI data
  const kpiMetrics: KPIMetric[] = [
    {
      id: 'active_users',
      title: '活跃用户数',
      value: 1247,
      trend: 'up',
      trendValue: '+12.5%',
      icon: Users,
      color: 'bg-blue-500',
      unit: '人',
      target: 1200,
      description: '当前在线活跃用户总数'
    },
    {
      id: 'completion_rate',
      title: '任务完成率',
      value: 89.2,
      trend: 'up',
      trendValue: '+3.2%',
      icon: Target,
      color: 'bg-green-500',
      unit: '%',
      target: 85,
      description: '今日任务完成率'
    },
    {
      id: 'avg_response_time',
      title: '平均响应时间',
      value: 245,
      trend: 'down',
      trendValue: '-15ms',
      icon: Zap,
      color: 'bg-yellow-500',
      unit: 'ms',
      target: 300,
      description: '系统平均响应时间'
    },
    {
      id: 'data_processing',
      title: '数据处理量',
      value: '2.4TB',
      trend: 'up',
      trendValue: '+8.7%',
      icon: Database,
      color: 'bg-purple-500',
      description: '今日数据处理总量'
    },
    {
      id: 'system_health',
      title: '系统健康度',
      value: 98.5,
      trend: 'stable',
      trendValue: '0%',
      icon: Gauge,
      color: 'bg-emerald-500',
      unit: '%',
      target: 95,
      description: '系统整体健康状况'
    },
    {
      id: 'alert_count',
      title: '预警数量',
      value: 3,
      trend: 'down',
      trendValue: '-2',
      icon: AlertTriangle,
      color: 'bg-red-500',
      unit: '个',
      description: '当前未处理预警数量'
    }
  ]

  // Mock chart data
  const trendChartData: ChartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: '用户活跃度',
        data: [320, 280, 450, 890, 1100, 850],
        color: '#3b82f6',
        backgroundColor: '#3b82f620'
      },
      {
        label: '系统负载',
        data: [45, 52, 78, 85, 92, 68],
        color: '#10b981',
        backgroundColor: '#10b98120'
      }
    ]
  }

  const performanceData: ChartData = {
    labels: ['1分钟前', '2分钟前', '3分钟前', '4分钟前', '5分钟前'],
    datasets: [
      {
        label: '响应时间(ms)',
        data: [245, 289, 234, 267, 198],
        color: '#f59e0b'
      }
    ]
  }

  const resourceUsageData = [
    { label: 'CPU', value: 68, color: '#3b82f6' },
    { label: '内存', value: 45, color: '#10b981' },
    { label: '磁盘', value: 32, color: '#f59e0b' },
    { label: '网络', value: 28, color: '#8b5cf6' }
  ]

  const systemHealthData = [
    { label: '正常', value: 85, color: '#10b981' },
    { label: '警告', value: 12, color: '#f59e0b' },
    { label: '错误', value: 3, color: '#ef4444' }
  ]

  // Mock anomaly alerts
  const mockAlerts: AnomalyAlert[] = [
    {
      id: '1',
      type: 'critical',
      title: '系统负载异常',
      message: 'CPU使用率超过90%，建议立即处理',
      timestamp: new Date().toLocaleTimeString(),
      source: '系统监控',
      acknowledged: false
    },
    {
      id: '2',
      type: 'warning',
      title: '数据同步延迟',
      message: '数据同步延迟超过5分钟',
      timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
      source: '数据中心',
      acknowledged: false
    },
    {
      id: '3',
      type: 'info',
      title: '定期备份完成',
      message: '数据库定期备份已成功完成',
      timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
      source: '备份系统',
      acknowledged: true
    }
  ]

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setLastUpdate(new Date())
      // Simulate connection status changes
      if (Math.random() < 0.1) {
        setConnectionStatus('connecting')
        setTimeout(() => setConnectionStatus('connected'), 1000)
      }
      
      // Simulate new alerts
      if (Math.random() < 0.05) {
        const newAlert: AnomalyAlert = {
          id: Date.now().toString(),
          type: Math.random() < 0.3 ? 'critical' : Math.random() < 0.6 ? 'warning' : 'info',
          title: '系统监控报告',
          message: `检测到异常活动 - ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toLocaleTimeString(),
          source: '自动监控',
          acknowledged: false
        }
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)])
      }
    }, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  // Initialize alerts
  useEffect(() => {
    setAlerts(mockAlerts)
  }, [])

  // Anomaly detection logic
  const detectAnomalies = (metrics: KPIMetric[]) => {
    const anomalies: string[] = []
    
    metrics.forEach(metric => {
      if (typeof metric.value === 'number' && metric.target) {
        if (metric.value > metric.target * 1.2) {
          anomalies.push(`${metric.title}超出正常范围`)
        }
      }
    })
    
    return anomalies
  }

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (dashboardRef.current?.requestFullscreen) {
        dashboardRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullScreen(!isFullScreen)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'warning': return 'border-yellow-500 bg-yellow-50'
      case 'info': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const exportDashboard = () => {
    // Mock export functionality
    const data = {
      timestamp: new Date().toISOString(),
      kpiMetrics,
      alerts: alerts.filter(a => !a.acknowledged),
      config: filterConfig
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const renderSimpleChart = (data: ChartData, type: 'line' | 'bar' = 'line') => {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data))
    const chartHeight = 200
    const chartWidth = 400

    return (
      <div className="relative">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="border rounded">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Data visualization */}
          {data.datasets.map((dataset, datasetIndex) => (
            <g key={datasetIndex}>
              {type === 'line' ? (
                <>
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth="2"
                    points={dataset.data.map((value, i) => 
                      `${(i * chartWidth) / (data.labels.length - 1)},${chartHeight - (value / maxValue) * chartHeight}`
                    ).join(' ')}
                  />
                  {/* Points */}
                  {dataset.data.map((value, i) => (
                    <circle
                      key={i}
                      cx={(i * chartWidth) / (data.labels.length - 1)}
                      cy={chartHeight - (value / maxValue) * chartHeight}
                      r="4"
                      fill={dataset.color}
                    />
                  ))}
                </>
              ) : (
                /* Bars */
                dataset.data.map((value, i) => (
                  <rect
                    key={i}
                    x={(i * chartWidth) / data.labels.length + (datasetIndex * 20)}
                    y={chartHeight - (value / maxValue) * chartHeight}
                    width="15"
                    height={(value / maxValue) * chartHeight}
                    fill={dataset.color}
                  />
                ))
              )}
            </g>
          ))}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {data.labels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 mt-4">
          {data.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: dataset.color }}
              />
              <span className="text-sm">{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div ref={dashboardRef} className={`min-h-screen bg-gray-50 ${isFullScreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullScreen && <Header />}
      
      <main className={`${isFullScreen ? 'h-screen overflow-auto' : 'flex-grow'} container mx-auto py-4 px-4`}>
        <div className="max-w-full mx-auto">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">实时数据可视化仪表盘</h1>
              <div className="flex items-center gap-4 mt-1 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">最后更新: {lastUpdate.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-4 h-4 text-green-600" />
                  ) : connectionStatus === 'connecting' ? (
                    <Loader className="w-4 h-4 text-yellow-600 animate-spin" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {connectionStatus === 'connected' ? '已连接' : 
                     connectionStatus === 'connecting' ? '连接中' : '断开连接'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">数据源: </span>
                  <div className="flex gap-1">
                    {Object.entries(dataSourcesStatus).map(([source, status]) => (
                      <div
                        key={source}
                        className={`w-2 h-2 rounded-full ${
                          status === 'healthy' ? 'bg-green-500' :
                          status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        title={`${source}: ${status}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">最近1小时</SelectItem>
                  <SelectItem value="24h">最近24小时</SelectItem>
                  <SelectItem value="7d">最近7天</SelectItem>
                  <SelectItem value="30d">最近30天</SelectItem>
                </SelectContent>
              </Select>

              {/* Auto Refresh Toggle */}
              <div className="flex items-center gap-2">
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                <span className="text-sm">自动刷新</span>
              </div>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLastUpdate(new Date())}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                刷新
              </Button>

              {/* Settings */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    设置
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>仪表盘设置</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">刷新频率</label>
                      <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10秒</SelectItem>
                          <SelectItem value="30">30秒</SelectItem>
                          <SelectItem value="60">1分钟</SelectItem>
                          <SelectItem value="300">5分钟</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Export */}
              <Button variant="outline" size="sm" onClick={exportDashboard}>
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>

              {/* Full Screen Toggle */}
              <Button variant="outline" size="sm" onClick={toggleFullScreen}>
                {isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {kpiMetrics.map((metric) => {
              const Icon = metric.icon
              const isAboveTarget = metric.target && typeof metric.value === 'number' && metric.value >= metric.target
              
              return (
                <Card key={metric.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${metric.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {metric.target && (
                        <Badge variant={isAboveTarget ? "default" : "destructive"}>
                          {isAboveTarget ? '达标' : '未达标'}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        {metric.unit && <span className="text-sm text-gray-500">{metric.unit}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                          {getTrendIcon(metric.trend)} {metric.trendValue}
                        </span>
                        <span className="text-xs text-gray-500">vs 昨日</span>
                      </div>
                      {metric.target && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>目标: {metric.target}{metric.unit}</span>
                            <span>{typeof metric.value === 'number' ? Math.round((metric.value / metric.target) * 100) : 0}%</span>
                          </div>
                          <Progress 
                            value={typeof metric.value === 'number' ? (metric.value / metric.target) * 100 : 0} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Dashboard Tabs */}
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="trends">趋势分析</TabsTrigger>
              <TabsTrigger value="realtime">实时监控</TabsTrigger>
              <TabsTrigger value="alerts">异常预警</TabsTrigger>
              <TabsTrigger value="reports">报告分析</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      系统趋势分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleChart 
                      data={trendChartData} 
                      type="area" 
                      height={250}
                      animate={true}
                      showGrid={true}
                    />
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      系统状态监控
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'API服务', status: '正常', uptime: '99.9%', response: '245ms' },
                        { name: '数据库', status: '正常', uptime: '99.8%', response: '12ms' },
                        { name: '缓存系统', status: '警告', uptime: '98.5%', response: '5ms' },
                        { name: '文件存储', status: '正常', uptime: '99.9%', response: '89ms' }
                      ].map((service, i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              service.status === '正常' ? 'bg-green-500' : 
                              service.status === '警告' ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                            <span className="font-medium">{service.name}</span>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>可用性: {service.uptime}</span>
                            <span>响应: {service.response}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      用户活跃度趋势
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimpleChart 
                      data={performanceData} 
                      type="line" 
                      height={250}
                      animate={true}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5" />
                      资源使用分布
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <PieChart 
                        data={resourceUsageData}
                        size={200}
                        animate={true}
                        showLabels={true}
                        showLegend={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="realtime" className="space-y-6 mt-6">
              {/* Real-time gauge charts */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 flex justify-center">
                    <GaugeChart
                      value={68}
                      max={100}
                      label="CPU使用率"
                      unit="%"
                      color="#3b82f6"
                      thresholds={{
                        low: { value: 50, color: '#10b981' },
                        medium: { value: 75, color: '#f59e0b' },
                        high: { value: 90, color: '#ef4444' }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex justify-center">
                    <GaugeChart
                      value={45}
                      max={100}
                      label="内存使用率"
                      unit="%"
                      color="#10b981"
                      thresholds={{
                        low: { value: 60, color: '#10b981' },
                        medium: { value: 80, color: '#f59e0b' },
                        high: { value: 95, color: '#ef4444' }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex justify-center">
                    <GaugeChart
                      value={245}
                      max={500}
                      label="响应时间"
                      unit="ms"
                      color="#f59e0b"
                      thresholds={{
                        low: { value: 200, color: '#10b981' },
                        medium: { value: 350, color: '#f59e0b' },
                        high: { value: 450, color: '#ef4444' }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex justify-center">
                    <GaugeChart
                      value={1247}
                      max={2000}
                      label="在线用户"
                      unit="人"
                      color="#8b5cf6"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Real-time activity feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    实时活动流
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 border-b border-gray-100 last:border-b-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm flex-1">
                          用户 user_{1000 + i} 完成了任务提交
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(Date.now() - i * 30000).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    异常预警中心
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <Alert key={alert.id} className={`${getAlertTypeColor(alert.type)} ${alert.acknowledged ? 'opacity-60' : ''}`}>
                        <AlertTriangle className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{alert.title}</h4>
                              <AlertDescription className="mt-1">
                                {alert.message}
                              </AlertDescription>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>来源: {alert.source}</span>
                                <span>时间: {alert.timestamp}</span>
                              </div>
                            </div>
                            {!alert.acknowledged && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => acknowledgeAlert(alert.id)}
                              >
                                确认
                              </Button>
                            )}
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: '日报', description: '今日系统运行情况总结', icon: FileText, time: '每日 9:00' },
                  { title: '周报', description: '本周数据分析和趋势报告', icon: Calendar, time: '每周一 9:00' },
                  { title: '月报', description: '月度性能评估和优化建议', icon: BarChart3, time: '每月1日 9:00' }
                ].map((report, i) => (
                  <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <report.icon className="w-6 h-6 text-blue-600" />
                        <h3 className="font-medium">{report.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{report.time}</span>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {!isFullScreen && <Footer />}
    </div>
  )
}