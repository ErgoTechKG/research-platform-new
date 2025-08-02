import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { BookOpen, Menu, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                科研实验班管理平台
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              首页
            </Link>
            <div className="relative group">
              <span className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                实验室轮转
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/lab-rotation/preparation/course-publish" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">前期筹备阶段</Link>
                <Link to="/lab-rotation/matching/student-preference" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">双选匹配阶段</Link>
                <Link to="/lab-rotation/management/task-publishing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">过程管理阶段</Link>
                <Link to="/lab-rotation/verification/poster-designer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">成果验收阶段</Link>
                <Link to="/lab-rotation/grading/multidimensional-scoring" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">成绩评定阶段</Link>
              </div>
            </div>
            <div className="relative group">
              <span className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                综合素质评价
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/quality-assessment/preparation/evaluation-plan-publishing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">评价准备阶段</Link>
                <Link to="/quality-assessment/collection/information-collection-form" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">信息采集阶段</Link>
                <Link to="/quality-assessment/evaluation/dimensional-scoring" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">多维度评价阶段</Link>
                <Link to="/quality-assessment/calculation/automatic-calculation-engine" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">综合核算阶段</Link>
                <Link to="/quality-assessment/application/grade-announcement" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">结果应用阶段</Link>
              </div>
            </div>
            <div className="relative group">
              <span className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                数据中心
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/data/data-analysis-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">数据分析中心</Link>
                <Link to="/data/realtime-data-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">实时数据看板</Link>
                <Link to="/data/predictive-analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">预测分析</Link>
                <Link to="/system/automatic-report-generator" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">报告生成</Link>
              </div>
            </div>
            <div className="relative group">
              <span className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                系统管理
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/admin/user-management" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">用户管理</Link>
                <Link to="/system/notification-center" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">通知中心</Link>
                <Link to="/system/batch-operations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">批量操作</Link>
                <Link to="/ai/ai-teaching-assistant" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">AI助手</Link>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-sm text-right">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-gray-500 text-xs">
                      {user.role === 'student' ? '学生' : 
                       user.role === 'professor' ? '教师' : '管理员'}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    退出
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">
                  登录
                </Button>
              </Link>
            )}
            
            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  <Link 
                    to="/" 
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    首页
                  </Link>
                  
                  <div className="px-2 py-1">
                    <div className="text-lg font-medium text-gray-700 mb-2">实验室轮转</div>
                    <div className="ml-4 space-y-1">
                      <Link to="/lab-rotation/preparation/course-publish" className="block text-sm text-gray-600 hover:text-primary py-1">前期筹备阶段</Link>
                      <Link to="/lab-rotation/matching/student-preference" className="block text-sm text-gray-600 hover:text-primary py-1">双选匹配阶段</Link>
                      <Link to="/lab-rotation/management/task-publishing" className="block text-sm text-gray-600 hover:text-primary py-1">过程管理阶段</Link>
                      <Link to="/lab-rotation/verification/poster-designer" className="block text-sm text-gray-600 hover:text-primary py-1">成果验收阶段</Link>
                      <Link to="/lab-rotation/grading/multidimensional-scoring" className="block text-sm text-gray-600 hover:text-primary py-1">成绩评定阶段</Link>
                    </div>
                  </div>

                  <div className="px-2 py-1">
                    <div className="text-lg font-medium text-gray-700 mb-2">综合素质评价</div>
                    <div className="ml-4 space-y-1">
                      <Link to="/quality-assessment/preparation/evaluation-plan-publishing" className="block text-sm text-gray-600 hover:text-primary py-1">评价准备阶段</Link>
                      <Link to="/quality-assessment/collection/information-collection-form" className="block text-sm text-gray-600 hover:text-primary py-1">信息采集阶段</Link>
                      <Link to="/quality-assessment/evaluation/dimensional-scoring" className="block text-sm text-gray-600 hover:text-primary py-1">多维度评价阶段</Link>
                      <Link to="/quality-assessment/calculation/automatic-calculation-engine" className="block text-sm text-gray-600 hover:text-primary py-1">综合核算阶段</Link>
                      <Link to="/quality-assessment/application/grade-announcement" className="block text-sm text-gray-600 hover:text-primary py-1">结果应用阶段</Link>
                    </div>
                  </div>

                  <div className="px-2 py-1">
                    <div className="text-lg font-medium text-gray-700 mb-2">数据中心</div>
                    <div className="ml-4 space-y-1">
                      <Link to="/data/data-analysis-center" className="block text-sm text-gray-600 hover:text-primary py-1">数据分析中心</Link>
                      <Link to="/data/realtime-data-dashboard" className="block text-sm text-gray-600 hover:text-primary py-1">实时数据看板</Link>
                      <Link to="/data/predictive-analytics" className="block text-sm text-gray-600 hover:text-primary py-1">预测分析</Link>
                    </div>
                  </div>

                  <div className="px-2 py-1">
                    <div className="text-lg font-medium text-gray-700 mb-2">系统管理</div>
                    <div className="ml-4 space-y-1">
                      <Link to="/admin/user-management" className="block text-sm text-gray-600 hover:text-primary py-1">用户管理</Link>
                      <Link to="/system/notification-center" className="block text-sm text-gray-600 hover:text-primary py-1">通知中心</Link>
                      <Link to="/system/batch-operations" className="block text-sm text-gray-600 hover:text-primary py-1">批量操作</Link>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <>
                        <div className="px-2 py-3 mb-3 bg-gray-50 rounded-md">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            {user.role === 'student' ? '学生' : 
                             user.role === 'professor' ? '教师' : '管理员'}
                          </p>
                        </div>
                        <Button onClick={logout} variant="outline" className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          退出登录
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" className="block">
                        <Button variant="outline" className="w-full">
                          登录
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header