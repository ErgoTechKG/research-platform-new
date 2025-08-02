import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { BookOpen, User, Menu } from 'lucide-react'

const Header = () => {
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
            <Link 
              to="/courses" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              课程管理
            </Link>
            <Link 
              to="/labs" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              实验室轮转
            </Link>
            <Link 
              to="/progress" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              进度跟踪
            </Link>
            <Link 
              to="/evaluation" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              综合评价
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              个人中心
            </Button>
            <Link to="/login">
              <Button size="sm">
                登录
              </Button>
            </Link>
            
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
                  <Link 
                    to="/courses" 
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    课程管理
                  </Link>
                  <Link 
                    to="/labs" 
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    实验室轮转
                  </Link>
                  <Link 
                    to="/progress" 
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    进度跟踪
                  </Link>
                  <Link 
                    to="/evaluation" 
                    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  >
                    综合评价
                  </Link>
                  <div className="border-t pt-4 mt-4">
                    <Button className="w-full mb-2">
                      <User className="w-4 h-4 mr-2" />
                      个人中心
                    </Button>
                    <Link to="/login" className="block">
                      <Button variant="outline" className="w-full">
                        登录
                      </Button>
                    </Link>
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