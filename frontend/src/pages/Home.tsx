import { Link } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  RotateCcw, 
  TrendingUp, 
  ClipboardCheck,
  Users,
  GraduationCap,
  ArrowRight
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "课程管理",
      description: "本科科研实验班课程规划、排课和资源管理",
      color: "bg-blue-500"
    },
    {
      icon: RotateCcw,
      title: "实验室轮转",
      description: "优化实验室轮转安排，提升科研体验",
      color: "bg-green-500"
    },
    {
      icon: TrendingUp,
      title: "进度跟踪",
      description: "实时监控学生学习进度和学术成就",
      color: "bg-purple-500"
    },
    {
      icon: ClipboardCheck,
      title: "综合评价",
      description: "公平透明的综合素质评价系统",
      color: "bg-orange-500"
    }
  ]

  const userRoles = [
    {
      title: "学生",
      description: "查看课程、跟踪进度、管理实验室轮转",
      icon: GraduationCap,
      action: "学生入口"
    },
    {
      title: "教师",
      description: "管理课程、评价学生、监督科研活动",
      icon: Users,
      action: "教师入口"
    },
    {
      title: "管理员",
      description: "系统管理和全局监督",
      icon: ClipboardCheck,
      action: "管理入口"
    }
  ]

  const stats = [
    { label: "在读学生", value: "120+" },
    { label: "合作实验室", value: "25" },
    { label: "指导教师", value: "45" },
    { label: "培养成功率", value: "98%" }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl mb-2">华中科技大学机械科学与工程学院</h2>
              <h1 className="text-4xl md:text-5xl font-bold">
                本科科研实验班管理平台
              </h1>
            </div>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              为机械学院科研实验班提供全方位的课程管理、实验室轮转和进度跟踪服务
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-primary">
                  立即登录
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              平台功能
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              专为科研实验班设计的综合管理工具
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      <div className={`w-16 h-16 ${feature.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              快速入口
            </h2>
            <p className="text-lg text-gray-600">
              选择您的身份进入对应系统
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((role, index) => {
              const IconComponent = role.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <CardHeader>
                    <div className="mx-auto mb-4">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <IconComponent className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                    <CardDescription className="text-base mb-6">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to="/login">
                      <Button className="w-full">
                        {role.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>


      <Footer />
    </div>
  )
}

export default Home