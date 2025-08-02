import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                华中科技大学机械学院
              </span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              机械科学与工程学院本科科研实验班管理平台，为学生提供全方位的课程管理、实验室轮转和进度跟踪服务。
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                湖北省武汉市洪山区珞喻路1037号
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                027-87542417
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                mse@hust.edu.cn
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              平台功能
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-600 hover:text-primary transition-colors">
                  课程管理
                </Link>
              </li>
              <li>
                <Link to="/labs" className="text-gray-600 hover:text-primary transition-colors">
                  实验室轮转
                </Link>
              </li>
              <li>
                <Link to="/progress" className="text-gray-600 hover:text-primary transition-colors">
                  进度跟踪
                </Link>
              </li>
              <li>
                <Link to="/evaluation" className="text-gray-600 hover:text-primary transition-colors">
                  综合评价
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              帮助支持
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-primary transition-colors">
                  帮助中心
                </Link>
              </li>
              <li>
                <Link to="/documentation" className="text-gray-600 hover:text-primary transition-colors">
                  使用文档
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 华中科技大学机械科学与工程学院 版权所有
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="http://mse.hust.edu.cn" className="text-gray-500 hover:text-primary text-sm transition-colors" target="_blank" rel="noopener noreferrer">
                学院主页
              </a>
              <a href="http://www.hust.edu.cn" className="text-gray-500 hover:text-primary text-sm transition-colors" target="_blank" rel="noopener noreferrer">
                学校主页
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer