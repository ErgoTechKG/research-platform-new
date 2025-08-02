import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Shield, User, GraduationCap, FileText } from 'lucide-react'

const TestModeIndicator = () => {
  const { user, isTestMode, switchRole } = useAuth()
  
  if (!isTestMode || !user) return null
  
  const roleConfig = {
    student: {
      icon: GraduationCap,
      label: '学生',
      color: 'bg-blue-500'
    },
    professor: {
      icon: User,
      label: '教授',
      color: 'bg-green-500'
    },
    secretary: {
      icon: FileText,
      label: '秘书',
      color: 'bg-orange-500'
    },
    admin: {
      icon: Shield,
      label: '管理员',
      color: 'bg-purple-500'
    }
  }
  
  const currentRoleConfig = roleConfig[user.role]
  const Icon = currentRoleConfig.icon
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-md ${currentRoleConfig.color} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500">测试模式</p>
            <p className="font-semibold text-sm">{currentRoleConfig.label}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-xs text-gray-600">
          当前用户: <span className="font-medium">{user.name}</span>
        </p>
        <p className="text-xs text-gray-600">
          邮箱: <span className="font-medium">{user.email}</span>
        </p>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-500 mb-2">切换角色:</p>
        <Select value={user.role} onValueChange={(value) => switchRole(value as any)}>
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">学生</SelectItem>
            <SelectItem value="professor">教授</SelectItem>
            <SelectItem value="secretary">秘书</SelectItem>
            <SelectItem value="admin">管理员</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-3 text-xs text-gray-400 text-center">
        仅在开发环境显示
      </div>
    </div>
  )
}

export default TestModeIndicator