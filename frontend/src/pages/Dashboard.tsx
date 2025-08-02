import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigate, useNavigate } from 'react-router-dom'
import { BookOpen, Users, BarChart, Settings, FileText, Calendar, PlusCircle, UserCheck, Presentation, Clock, Heart, UserSearch } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Define features based on role
  const roleFeatures = {
    student: [
      { icon: BookOpen, title: '我的课程', description: '查看已选课程和课程进度', color: 'bg-blue-500' },
      { icon: Calendar, title: '实验室轮转', description: '查看和申请实验室轮转', color: 'bg-green-500' },
      { icon: Heart, title: '志愿填报', description: '填报导师选择志愿', color: 'bg-red-500', path: '/student-preference' },
      { icon: Clock, title: '进度时间轴', description: '查看课程进度和里程碑', color: 'bg-indigo-500', path: '/course-timeline' },
      { icon: FileText, title: '学习报告', description: '提交和查看学习报告', color: 'bg-yellow-500' },
      { icon: BarChart, title: '成绩查询', description: '查看各科成绩和排名', color: 'bg-purple-500' }
    ],
    faculty: [
      { icon: Users, title: '学生管理', description: '查看和管理指导学生', color: 'bg-blue-500' },
      { icon: UserSearch, title: '学生筛选', description: '筛选和管理学生申请', color: 'bg-cyan-500', path: '/mentor-screening' },
      { icon: BookOpen, title: '课程管理', description: '管理教授的课程', color: 'bg-green-500' },
      { icon: PlusCircle, title: '发布课程', description: '发布实验室轮转课程', color: 'bg-orange-500', path: '/course-publish' },
      { icon: Clock, title: '进度时间轴', description: '查看课程进度和里程碑', color: 'bg-indigo-500', path: '/course-timeline' },
      { icon: Presentation, title: '宣讲会管理', description: '管理Intro Session', color: 'bg-pink-500', path: '/seminar-management' },
      { icon: FileText, title: '评价管理', description: '对学生进行评价打分', color: 'bg-yellow-500' },
      { icon: BarChart, title: '数据分析', description: '查看教学数据分析', color: 'bg-purple-500' }
    ],
    admin: [
      { icon: Users, title: '用户管理', description: '管理所有用户账号', color: 'bg-blue-500' },
      { icon: UserCheck, title: '导师管理', description: '管理导师资源信息', color: 'bg-indigo-500', path: '/mentor-management' },
      { icon: Settings, title: '系统设置', description: '配置系统参数', color: 'bg-green-500' },
      { icon: PlusCircle, title: '发布课程', description: '发布实验室轮转课程', color: 'bg-orange-500', path: '/course-publish' },
      { icon: Clock, title: '进度时间轴', description: '查看课程进度和里程碑', color: 'bg-indigo-500', path: '/course-timeline' },
      { icon: Presentation, title: '宣讲会管理', description: '管理Intro Session', color: 'bg-pink-500', path: '/seminar-management' },
      { icon: BarChart, title: '全局数据', description: '查看系统运行数据', color: 'bg-yellow-500' },
      { icon: FileText, title: '报告生成', description: '生成各类统计报告', color: 'bg-purple-500' }
    ]
  }
  
  const features = roleFeatures[user.role] || []
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎回来，{user.name}
          </h1>
          <p className="text-gray-600">
            您当前的身份是：
            <span className="font-medium ml-1">
              {user.role === 'student' ? '学生' : 
               user.role === 'faculty' ? '教师' : '管理员'}
            </span>
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => feature.path && navigate(feature.path)}>
                <CardHeader>
                  <div className="mb-4">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {/* Role-specific Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>提示：</strong>
            {user.role === 'student' && '作为学生，您可以查看课程、管理实验室轮转和提交学习报告。'}
            {user.role === 'faculty' && '作为教师，您可以管理学生、课程和进行学生评价。'}
            {user.role === 'admin' && '作为管理员，您拥有系统的完全访问权限。'}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Dashboard