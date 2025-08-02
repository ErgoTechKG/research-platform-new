import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  Clock, 
  BookOpen, 
  Bell, 
  FileText, 
  BarChart, 
  UserCheck, 
  MessageCircle,
  Settings,
  LogOut,
  Trophy,
  Star,
  CheckCircle
} from 'lucide-react'

const StudentDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'student') {
    return <Navigate to="/dashboard" replace />
  }

  // Mock data for demonstration
  const todoItems = [
    {
      id: 1,
      title: '提交文献综述',
      deadline: '今晚 23:59',
      urgent: true
    },
    {
      id: 2,
      title: '参加组会',
      deadline: '14:00-16:00',
      urgent: false
    },
    {
      id: 3,
      title: '完成实验报告',
      deadline: '明天 18:00',
      urgent: false
    }
  ]

  const courseProgress = [
    {
      name: '实验室轮转',
      progress: 75,
      color: 'bg-blue-500'
    },
    {
      name: '综合评价',
      progress: 40,
      color: 'bg-green-500'
    },
    {
      name: '学术报告',
      progress: 85,
      color: 'bg-purple-500'
    }
  ]

  const notifications = [
    {
      id: 1,
      title: '下周答辩安排已发布',
      time: '2小时前',
      read: false
    },
    {
      id: 2,
      title: '综合素质材料提交开始',
      time: '1天前',
      read: false
    },
    {
      id: 3,
      title: '导师见面会安排通知',
      time: '2天前',
      read: true
    }
  ]

  const quickAccessItems = [
    {
      title: '提交作业',
      icon: FileText,
      color: 'bg-blue-500',
      path: '/learning-report'
    },
    {
      title: '查看成绩',
      icon: BarChart,
      color: 'bg-green-500',
      path: '/grade-inquiry'
    },
    {
      title: '预约导师',
      icon: UserCheck,
      color: 'bg-purple-500',
      path: '/weekly-meeting'
    },
    {
      title: '在线答疑',
      icon: MessageCircle,
      color: 'bg-orange-500',
      path: '/instant-messaging'
    }
  ]

  const achievements = {
    competitions: 3,
    completedTasks: 12,
    totalTasks: 15,
    currentRating: 'A-'
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              我的学习中心
            </h1>
            <p className="text-gray-600">
              {user.name} | 2023级 | 欢迎回到您的学习空间
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')} data-testid="settings-button">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
            <Button variant="outline" size="sm" onClick={logout} data-testid="logout-button">
              <LogOut className="w-4 h-4 mr-2" />
              退出
            </Button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-testid="dashboard-grid">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Today's Todo */}
            <Card data-testid="todo-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  今日待办
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todoItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg" data-testid="todo-item">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          截止: {item.deadline}
                        </p>
                      </div>
                      {item.urgent && (
                        <Badge variant="destructive" className="text-xs" data-testid="urgent-badge">
                          紧急
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card data-testid="quick-access-section">
              <CardHeader>
                <CardTitle>快速入口</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {quickAccessItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-16 flex-col gap-2"
                        onClick={() => item.path && navigate(item.path)}
                        data-testid="quick-access-button"
                      >
                        <div className={`w-6 h-6 ${item.color} rounded flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs">{item.title}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="space-y-6">
            {/* Course Progress */}
            <Card data-testid="course-progress-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  课程进度
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseProgress.map((course, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{course.name}</span>
                        <span className="text-sm text-gray-500">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" data-testid="progress-bar" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Latest Notifications */}
            <Card data-testid="notifications-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  最新通知
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer" data-testid="notification-item">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} data-testid={notification.read ? "read-indicator" : "unread-indicator"} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Achievement Statistics */}
            <Card data-testid="achievements-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  成就统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium">竞赛获奖</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600">{achievements.competitions}项</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">完成任务</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {achievements.completedTasks}/{achievements.totalTasks}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium">当前评级</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600">{achievements.currentRating}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Statistics */}
            <Card data-testid="study-statistics">
              <CardHeader>
                <CardTitle>学习数据</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">本周学习时长</span>
                    <span className="font-medium">28小时</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">本月提交作业</span>
                    <span className="font-medium">8份</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">平均成绩</span>
                    <span className="font-medium">87.5分</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">出勤率</span>
                    <span className="font-medium">96%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default StudentDashboard