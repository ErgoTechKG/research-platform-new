import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigate, useNavigate } from 'react-router-dom'
import { BookOpen, Users, BarChart, Settings, FileText, Calendar, PlusCircle, UserCheck, Presentation, Clock, Heart, UserSearch, GitBranch, ClipboardList, KanbanSquare, MessageSquare, MessageCircle, Palette, Shield, Archive } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // Redirect to role-specific dashboard
  const redirectToDashboard = () => {
    switch (user.role) {
      case 'student':
        navigate('/dashboard/student')
        break
      case 'professor':
        navigate('/dashboard/professor')
        break
      case 'secretary':
        navigate('/dashboard/secretary')
        break
      case 'admin':
        navigate('/dashboard/admin')
        break
      default:
        break
    }
  }

  // Define features based on role with updated paths
  const roleFeatures = {
    student: [
      { icon: BookOpen, title: '学生仪表盘', description: '专属学生功能面板', color: 'bg-blue-500', path: '/dashboard/student' },
      { icon: Calendar, title: '实验室轮转', description: '查看轮转课程各阶段', color: 'bg-green-500', path: '/lab-rotation/preparation/course-publish' },
      { icon: Heart, title: '志愿填报', description: '填报导师选择志愿', color: 'bg-red-500', path: '/lab-rotation/matching/student-preference' },
      { icon: KanbanSquare, title: '任务看板', description: '查看和管理学习任务进度', color: 'bg-orange-500', path: '/lab-rotation/management/progress-tracking' },
      { icon: MessageSquare, title: '师生互动', description: '与导师进行在线讨论', color: 'bg-cyan-500', path: '/lab-rotation/management/weekly-meeting' },
      { icon: MessageCircle, title: '即时通讯', description: '实时消息沟通和文件传输', color: 'bg-teal-500', path: '/lab-rotation/management/instant-messaging' },
      { icon: Palette, title: '海报设计', description: '在线设计学术海报', color: 'bg-purple-500', path: '/lab-rotation/verification/poster-designer' },
      { icon: Clock, title: '进度时间轴', description: '查看课程进度和里程碑', color: 'bg-indigo-500', path: '/lab-rotation/preparation/course-timeline' },
      { icon: FileText, title: '学习报告', description: '提交和查看学习报告', color: 'bg-yellow-500', path: '/lab-rotation/management/learning-report' },
      { icon: FileText, title: '大报告提交', description: '使用结构化模板提交研究报告', color: 'bg-pink-500', path: '/lab-rotation/verification/research-report' },
      { icon: Calendar, title: '答辩安排', description: '查看答辩时间和评委安排', color: 'bg-rose-500', path: '/lab-rotation/verification/defense-scheduling' },
      { icon: BarChart, title: '成绩查询', description: '查看各科成绩和排名', color: 'bg-purple-500', path: '/lab-rotation/grading/grade-inquiry' },
      { icon: FileText, title: '综合素质填报', description: '填写综合素质评价信息', color: 'bg-emerald-500', path: '/quality-assessment/collection/information-collection-form' }
    ],
    professor: [
      { icon: Users, title: '教授仪表盘', description: '专属教授功能面板', color: 'bg-blue-500', path: '/dashboard/professor' },
      { icon: UserSearch, title: '学生筛选', description: '筛选和管理学生申请', color: 'bg-cyan-500', path: '/lab-rotation/matching/mentor-screening' },
      { icon: BookOpen, title: '课程发布', description: '发布实验室轮转课程', color: 'bg-green-500', path: '/lab-rotation/preparation/course-publish' },
      { icon: ClipboardList, title: '任务发布', description: '发布周任务和学习目标', color: 'bg-teal-500', path: '/lab-rotation/management/task-publishing' },
      { icon: KanbanSquare, title: '任务追踪', description: '查看学生任务完成情况', color: 'bg-orange-500', path: '/lab-rotation/management/progress-tracking' },
      { icon: MessageSquare, title: '师生互动', description: '与学生进行在线讨论', color: 'bg-cyan-500', path: '/lab-rotation/management/weekly-meeting' },
      { icon: MessageCircle, title: '即时通讯', description: '实时消息沟通和文件传输', color: 'bg-teal-500', path: '/lab-rotation/management/instant-messaging' },
      { icon: UserCheck, title: '导师管理', description: '管理导师资源信息', color: 'bg-indigo-500', path: '/lab-rotation/preparation/mentor-management' },
      { icon: Clock, title: '进度时间轴', description: '查看课程进度和里程碑', color: 'bg-indigo-500', path: '/lab-rotation/preparation/course-timeline' },
      { icon: Presentation, title: '宣讲会管理', description: '管理Intro Session', color: 'bg-pink-500', path: '/lab-rotation/preparation/seminar-management' },
      { icon: FileText, title: '多维度评分', description: '对学生进行多维度评价打分', color: 'bg-yellow-500', path: '/lab-rotation/grading/multidimensional-scoring' },
      { icon: BarChart, title: '批量评分', description: '批量处理学生评分', color: 'bg-purple-500', path: '/lab-rotation/grading/batch-scoring' },
      { icon: FileText, title: '思想品德评价', description: '评价学生思想品德', color: 'bg-rose-500', path: '/quality-assessment/evaluation/moral-character-evaluation' }
    ],
    secretary: [
      { icon: Users, title: '秘书仪表盘', description: '专属秘书功能面板', color: 'bg-blue-500', path: '/dashboard/secretary' },
      { icon: UserCheck, title: '导师管理', description: '管理导师资源信息', color: 'bg-indigo-500', path: '/lab-rotation/preparation/mentor-management' },
      { icon: Shield, title: '专家组管理', description: '管理评审专家组成员', color: 'bg-emerald-500', path: '/quality-assessment/preparation/expert-group-management' },
      { icon: GitBranch, title: '匹配算法', description: '双选匹配流程可视化', color: 'bg-purple-500', path: '/lab-rotation/matching/matching-visualization' },
      { icon: Settings, title: '系统设置', description: '配置系统参数', color: 'bg-green-500', path: '/admin/user-management' },
      { icon: PlusCircle, title: '发布课程', description: '发布实验室轮转课程', color: 'bg-orange-500', path: '/lab-rotation/preparation/course-publish' },
      { icon: Clock, title: '时间线规划', description: '规划评价时间节点', color: 'bg-indigo-500', path: '/quality-assessment/preparation/timeline-planning' },
      { icon: Presentation, title: '宣讲会管理', description: '管理Intro Session', color: 'bg-pink-500', path: '/lab-rotation/preparation/seminar-management' },
      { icon: Archive, title: '档案归档系统', description: '永久保存评价材料', color: 'bg-slate-500', path: '/quality-assessment/application/archive-filing-system' },
      { icon: FileText, title: '初审工作台', description: '审核学生提交材料', color: 'bg-yellow-500', path: '/quality-assessment/collection/preliminary-review-workbench' },
      { icon: BarChart, title: '实时数据仪表盘', description: '实时数据可视化和异常预警', color: 'bg-cyan-500', path: '/data/realtime-data-dashboard' },
      { icon: BarChart, title: '预测分析系统', description: '学生表现预测和风险评估', color: 'bg-violet-500', path: '/data/predictive-analytics' },
      { icon: FileText, title: '报告生成', description: '生成各类统计报告', color: 'bg-purple-500', path: '/quality-assessment/application/report-generator' },
      { icon: Users, title: '实验班筛选', description: '根据评价结果筛选学生', color: 'bg-red-500', path: '/quality-assessment/application/experimental-class-screening' }
    ],
    admin: [
      { icon: Users, title: '管理员仪表盘', description: '系统管理员功能面板', color: 'bg-red-500', path: '/dashboard/admin' },
      { icon: Settings, title: '用户管理', description: '管理系统用户和权限', color: 'bg-blue-500', path: '/admin/user-management' },
      { icon: Shield, title: '系统设置', description: '配置系统参数和安全设置', color: 'bg-green-500', path: '/admin/system-settings' },
      { icon: BarChart, title: '数据分析', description: '查看系统使用统计和分析', color: 'bg-purple-500', path: '/data/data-analysis-center' }
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
               user.role === 'professor' ? '教师' : 
               user.role === 'secretary' ? '秘书' : '管理员'}
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
            {user.role === 'professor' && '作为教师，您可以管理学生、课程和进行学生评价。'}
            {user.role === 'secretary' && '作为秘书，您可以协调评价流程、管理专家组和处理申诉。'}
            {user.role === 'admin' && '作为管理员，您拥有系统的完全访问权限。'}
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Dashboard