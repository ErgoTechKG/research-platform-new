import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  FileText,
  Settings,
  LogOut,
  Activity,
  Database,
  FileSpreadsheet,
  Workflow,
  TrendingUp,
  Eye
} from 'lucide-react'

const SecretaryDashboard = () => {
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
  const systemOverview = {
    onlineUsers: 156,
    todayActiveRate: 89,
    coursesInProgress: 2,
    pendingApprovals: 23
  }

  const workKanban = {
    pending: {
      count: 12,
      tasks: [
        { id: 1, title: '双选匹配', description: '学生导师双向选择', priority: 'high' },
        { id: 2, title: '课程审核', description: '新课程申请审核', priority: 'medium' },
        { id: 3, title: '成绩录入', description: '期末成绩录入确认', priority: 'high' }
      ]
    },
    inProgress: {
      count: 5,
      tasks: [
        { id: 4, title: '成绩录入', description: '批量成绩处理中', priority: 'medium' },
        { id: 5, title: '报告生成', description: '月度数据报告', priority: 'low' }
      ]
    },
    completed: {
      count: 28,
      tasks: [
        { id: 6, title: '报告生成', description: '学期总结报告', priority: 'low' },
        { id: 7, title: '数据备份', description: '系统数据定期备份', priority: 'medium' },
        { id: 8, title: '用户管理', description: '新用户账号开通', priority: 'low' }
      ]
    }
  }

  const quickActions = [
    {
      title: '数据导出',
      description: '导出系统数据报表',
      icon: Download,
      color: 'bg-blue-500',
      path: '/batch-import-tool'
    },
    {
      title: '生成报告',
      description: '生成各类统计报告',
      icon: FileText,
      color: 'bg-green-500',
      path: '/report-generator'
    },
    {
      title: '系统设置',
      description: '配置系统参数',
      icon: Settings,
      color: 'bg-purple-500',
      path: '/system-settings'
    },
    {
      title: '批量操作',
      description: '执行批量管理操作',
      icon: Workflow,
      color: 'bg-orange-500',
      path: '/batch-operations'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '高优先级'
      case 'medium':
        return '中优先级'
      case 'low':
        return '低优先级'
      default:
        return '普通'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              管理控制台
            </h1>
            <p className="text-gray-600">
              {user.name} | 教务处 | 欢迎回到您的管理控制中心
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

        {/* System Overview */}
        <Card className="mb-6" data-testid="system-overview-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              系统概览
            </CardTitle>
            <CardDescription>实时数据</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg" data-testid="online-users-stat">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">在线用户</p>
                  <p className="text-2xl font-bold text-blue-600">{systemOverview.onlineUsers}人</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg" data-testid="active-rate-stat">
                <Activity className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">今日活跃</p>
                  <p className="text-2xl font-bold text-green-600">{systemOverview.todayActiveRate}%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg" data-testid="courses-stat">
                <BookOpen className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">课程进行</p>
                  <p className="text-2xl font-bold text-purple-600">{systemOverview.coursesInProgress}门</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg" data-testid="pending-approvals-stat">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">待审核</p>
                  <p className="text-2xl font-bold text-orange-600">{systemOverview.pendingApprovals}项</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Kanban */}
        <Card className="mb-6" data-testid="work-kanban-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              工作看板
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Tasks */}
              <div className="space-y-3" data-testid="pending-tasks-column">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-red-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    待办
                  </h3>
                  <Badge variant="outline" className="bg-red-50 text-red-600">
                    {workKanban.pending.count}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {workKanban.pending.tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-red-50 border border-red-200 rounded-lg" data-testid="kanban-task-item">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge 
                          className={`${getPriorityColor(task.priority)} text-white text-xs`}
                          data-testid="task-priority-badge"
                        >
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress Tasks */}
              <div className="space-y-3" data-testid="in-progress-tasks-column">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-blue-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    进行中
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600">
                    {workKanban.inProgress.count}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {workKanban.inProgress.tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg" data-testid="kanban-task-item">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge 
                          className={`${getPriorityColor(task.priority)} text-white text-xs`}
                          data-testid="task-priority-badge"
                        >
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{task.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Tasks */}
              <div className="space-y-3" data-testid="completed-tasks-column">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    已完成
                  </h3>
                  <Badge variant="outline" className="bg-green-50 text-green-600">
                    {workKanban.completed.count}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {workKanban.completed.tasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="p-3 bg-green-50 border border-green-200 rounded-lg" data-testid="kanban-task-item">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{task.title}</h4>
                        <Badge 
                          className={`${getPriorityColor(task.priority)} text-white text-xs`}
                          data-testid="task-priority-badge"
                        >
                          {getPriorityText(task.priority)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{task.description}</p>
                    </div>
                  ))}
                  {workKanban.completed.count > 3 && (
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      查看更多 ({workKanban.completed.count - 3} 项)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card data-testid="quick-actions-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              管理操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="action-buttons">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex-col gap-2 hover:shadow-md transition-shadow"
                    onClick={() => action.path && navigate(action.path)}
                    data-testid="action-button"
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

        {/* Recent Activity Summary */}
        <div className="mt-6">
          <Card data-testid="recent-activity-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" data-testid="activity-item">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">系统数据备份完成</p>
                    <p className="text-xs text-gray-500">2分钟前</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" data-testid="activity-item">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">月度报告生成完成</p>
                    <p className="text-xs text-gray-500">1小时前</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" data-testid="activity-item">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">新增用户账号审批</p>
                    <p className="text-xs text-gray-500">3小时前</p>
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

export default SecretaryDashboard