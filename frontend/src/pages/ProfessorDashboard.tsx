import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  FileText, 
  BarChart, 
  Bell,
  Download,
  Settings,
  LogOut,
  User,
  Calendar,
  BookOpen,
  MessageSquare
} from 'lucide-react'

const ProfessorDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if not authenticated or not faculty
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'faculty') {
    return <Navigate to="/dashboard" replace />
  }

  // Mock data for demonstration
  const todaySchedule = [
    {
      id: 1,
      time: '10:00',
      title: '组会',
      type: 'meeting',
      location: 'AI实验室'
    },
    {
      id: 2,
      time: '14:00',
      title: '面试学生',
      type: 'interview',
      location: '办公室'
    },
    {
      id: 3,
      time: '16:00',
      title: '答辩评审',
      type: 'defense',
      location: '会议室A'
    }
  ]

  const pendingTasks = [
    {
      category: '待评作业',
      count: 8,
      color: 'bg-blue-500',
      urgent: false
    },
    {
      category: '申请审批',
      count: 3,
      color: 'bg-yellow-500',
      urgent: true
    },
    {
      category: '报告评阅',
      count: 5,
      color: 'bg-green-500',
      urgent: false
    }
  ]

  const studentOverview = {
    totalStudents: 12,
    weeklySubmissionRate: 85,
    averageProgress: 72
  }

  const students = [
    {
      id: 1,
      name: '王小明',
      progress: 75,
      lastSubmission: '2小时前',
      status: 'excellent',
      statusText: '优秀'
    },
    {
      id: 2,
      name: '李小红',
      progress: 82,
      lastSubmission: '昨天',
      status: 'good',
      statusText: '良好'
    },
    {
      id: 3,
      name: '张小华',
      progress: 45,
      lastSubmission: '3天前',
      status: 'warning',
      statusText: '需关注'
    },
    {
      id: 4,
      name: '陈小军',
      progress: 88,
      lastSubmission: '4小时前',
      status: 'excellent',
      statusText: '优秀'
    },
    {
      id: 5,
      name: '刘小丽',
      progress: 69,
      lastSubmission: '1天前',
      status: 'good',
      statusText: '良好'
    }
  ]

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500'
      case 'good':
        return 'bg-blue-500'
      case 'warning':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return Users
      case 'interview':
        return User
      case 'defense':
        return FileText
      default:
        return Calendar
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
              教学管理中心
            </h1>
            <p className="text-gray-600">
              {user.name} | AI实验室 | 欢迎回到您的教学管理空间
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

        {/* Top Row - Schedule and Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Today's Schedule */}
          <Card data-testid="schedule-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                今日日程
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaySchedule.map((event) => {
                  const Icon = getScheduleIcon(event.type)
                  return (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" data-testid="schedule-item">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">{event.time}</span>
                        <span className="text-sm">{event.title}</span>
                      </div>
                      <span className="text-xs text-gray-500">{event.location}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card data-testid="pending-tasks-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                待处理事项
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid="pending-task-item">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${task.color}`} />
                      <span className="font-medium text-sm">{task.category}</span>
                      {task.urgent && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" data-testid="urgent-indicator" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {task.count}项
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Management Overview */}
        <Card data-testid="student-management-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              学生管理概览
            </CardTitle>
            <CardDescription>
              <div className="flex gap-6 mt-2">
                <span>指导学生: <strong>{studentOverview.totalStudents}人</strong></span>
                <span>本周提交: <strong>{studentOverview.weeklySubmissionRate}%</strong></span>
                <span>平均进度: <strong>{studentOverview.averageProgress}%</strong></span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Student Table */}
            <div className="border rounded-lg overflow-hidden mb-4" data-testid="student-table">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                  <span>学生</span>
                  <span>进度</span>
                  <span>最近提交</span>
                  <span>状态</span>
                </div>
              </div>
              <div className="divide-y">
                {students.map((student) => (
                  <div key={student.id} className="px-4 py-3 hover:bg-gray-50" data-testid="student-row">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${student.progress}%` }}
                            data-testid="progress-bar"
                          />
                        </div>
                        <span className="text-sm text-gray-600">{student.progress}%</span>
                      </div>
                      <span className="text-sm text-gray-600">{student.lastSubmission}</span>
                      <Badge 
                        className={`${getStatusBadgeColor(student.status)} text-white text-xs`}
                        data-testid="status-badge"
                      >
                        {student.statusText}
                        {student.status === 'warning' && (
                          <AlertTriangle className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Operations */}
            <div className="flex gap-3" data-testid="batch-operations">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/batch-scoring')}
                data-testid="batch-grading-button"
              >
                <BarChart className="w-4 h-4 mr-2" />
                批量评分
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/notification-center')}
                data-testid="send-notification-button"
              >
                <Bell className="w-4 h-4 mr-2" />
                发送通知
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/report-generator')}
                data-testid="export-report-button"
              >
                <Download className="w-4 h-4 mr-2" />
                导出报告
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">快速操作</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="quick-actions">
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/task-publishing')}
              data-testid="quick-action-button"
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">发布任务</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/mentor-screening')}
              data-testid="quick-action-button"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm">学生筛选</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/weekly-meeting')}
              data-testid="quick-action-button"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">师生互动</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col gap-2"
              onClick={() => navigate('/data-analysis-center')}
              data-testid="quick-action-button"
            >
              <BarChart className="w-6 h-6" />
              <span className="text-sm">数据分析</span>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default ProfessorDashboard