import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  LineChart, 
  PieChart,
  FileText,
  Database,
  Settings,
  LogOut,
  Users,
  GraduationCap,
  BookOpen,
  Target,
  Download,
  Brain,
  BarChart,
  UserCheck
} from 'lucide-react'

const LeaderDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Mock data for demonstration
  const kpiData = [
    {
      title: '学生满意度',
      value: 92,
      unit: '%',
      trend: 3,
      trendDirection: 'up',
      color: 'bg-green-500',
      icon: Users
    },
    {
      title: '导师参与度',
      value: 87,
      unit: '%',
      trend: 5,
      trendDirection: 'up',
      color: 'bg-blue-500',
      icon: UserCheck
    },
    {
      title: '课程完成率',
      value: 95,
      unit: '%',
      trend: 2,
      trendDirection: 'up',
      color: 'bg-purple-500',
      icon: BookOpen
    },
    {
      title: '平均成绩',
      value: 82.5,
      unit: '分',
      trend: 1.2,
      trendDirection: 'up',
      color: 'bg-orange-500',
      icon: GraduationCap
    }
  ]

  const trendData = {
    title: '成绩分布趋势 (近3年)',
    years: ['2023', '2024', '2025'],
    data: [
      { year: '2023', value: 78.5, excellent: 25, good: 45, average: 30 },
      { year: '2024', value: 81.2, excellent: 32, good: 48, average: 20 },
      { year: '2025', value: 82.5, excellent: 35, good: 50, average: 15 }
    ]
  }

  const additionalMetrics = [
    {
      title: '项目完成率',
      value: '94.2%',
      subtitle: '本学期项目完成情况',
      trend: '+2.1%'
    },
    {
      title: '导师学生比',
      value: '1:8.5',
      subtitle: '师生配比情况',
      trend: '优化'
    },
    {
      title: '实验室利用率',
      value: '87.3%',
      subtitle: '实验室使用效率',
      trend: '+4.5%'
    },
    {
      title: '发表论文数',
      value: '156篇',
      subtitle: '学生发表论文统计',
      trend: '+12篇'
    }
  ]

  const actionButtons = [
    {
      title: '详细报告',
      description: '查看详细数据报告',
      icon: FileText,
      color: 'bg-blue-500',
      path: '/report-generator'
    },
    {
      title: '数据分析',
      description: '深入数据分析工具',
      icon: BarChart,
      color: 'bg-green-500',
      path: '/data-analysis-center'
    },
    {
      title: '导出PPT',
      description: '生成演示文稿',
      icon: Download,
      color: 'bg-purple-500',
      path: '/export-presentation'
    },
    {
      title: '预测模型',
      description: 'AI预测分析模型',
      icon: Brain,
      color: 'bg-orange-500',
      path: '/prediction-models'
    }
  ]

  const renderTrendIcon = (direction: string, trend: number) => {
    if (direction === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />
    } else {
      return <TrendingDown className="w-4 h-4 text-red-500" />
    }
  }

  const renderTrendChart = () => {
    return (
      <div className="space-y-4">
        {/* Simple trend visualization using CSS */}
        <div className="relative h-32 bg-gray-50 rounded-lg p-4">
          <div className="flex items-end justify-between h-full">
            {trendData.data.map((point, index) => (
              <div key={point.year} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-blue-500 rounded-t-sm min-w-8 transition-all duration-300"
                  style={{ 
                    height: `${(point.value / 85) * 80}px`,
                    minHeight: '20px'
                  }}
                  data-testid="trend-bar"
                />
                <div className="text-xs font-medium">{point.year}</div>
                <div className="text-xs text-gray-500">{point.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Detailed breakdown */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {trendData.data.map((point) => (
            <div key={point.year} className="bg-white p-3 rounded-lg border">
              <div className="text-center">
                <div className="font-medium text-sm">{point.year}</div>
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs">
                    <span>优秀:</span>
                    <span className="text-green-600">{point.excellent}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>良好:</span>
                    <span className="text-blue-600">{point.good}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>一般:</span>
                    <span className="text-gray-600">{point.average}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              决策支持系统
            </h1>
            <p className="text-gray-600">
              {user.name} | 管理层 | 欢迎访问执行决策支持中心
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </div>

        {/* KPI Indicators */}
        <Card className="mb-6" data-testid="kpi-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              关键指标 KPI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiData.map((kpi, index) => {
                const Icon = kpi.icon
                return (
                  <div key={index} className="bg-white p-4 rounded-lg border shadow-sm" data-testid="kpi-item">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 ${kpi.color} rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1" data-testid="trend-indicator">
                        {renderTrendIcon(kpi.trendDirection, kpi.trend)}
                        <span className={`text-sm font-medium ${kpi.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {kpi.trendDirection === 'up' ? '+' : '-'}{kpi.trend}{kpi.unit === '%' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {kpi.value}<span className="text-lg text-gray-500">{kpi.unit}</span>
                      </div>
                      <div className="text-sm text-gray-600">{kpi.title}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card className="mb-6" data-testid="trend-analysis-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              趋势分析
            </CardTitle>
            <CardDescription>{trendData.title}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderTrendChart()}
          </CardContent>
        </Card>

        {/* Additional Metrics */}
        <Card className="mb-6" data-testid="additional-metrics-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              运营指标
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {additionalMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg" data-testid="additional-metric-item">
                  <div className="text-lg font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{metric.subtitle}</div>
                  <div className="text-xs text-green-600 font-medium">{metric.trend}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card data-testid="action-buttons-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              决策工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="decision-tools">
              {actionButtons.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex-col gap-2 hover:shadow-md transition-shadow"
                    onClick={() => action.path && navigate(action.path)}
                    data-testid="decision-tool-button"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <div className="mt-6">
          <Card data-testid="executive-summary-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                执行总结
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">关键成就</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2" data-testid="achievement-item">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">学生满意度创历史新高，达到92%</span>
                    </div>
                    <div className="flex items-center gap-2" data-testid="achievement-item">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">导师参与度显著提升，增长5%</span>
                    </div>
                    <div className="flex items-center gap-2" data-testid="achievement-item">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">课程完成率保持高水平，95%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">改进建议</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2" data-testid="suggestion-item">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">进一步优化师生配比，目标1:7</span>
                    </div>
                    <div className="flex items-center gap-2" data-testid="suggestion-item">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">增加实验室资源，提升利用率至90%</span>
                    </div>
                    <div className="flex items-center gap-2" data-testid="suggestion-item">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm">加强学术指导，提升论文发表质量</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default LeaderDashboard