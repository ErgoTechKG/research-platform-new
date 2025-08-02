import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, Button as AvatarButton } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  IdCard, 
  Camera, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  Clock,
  Shield,
  Activity
} from 'lucide-react'

const UserProfile = () => {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    studentId: user?.studentId || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setMessage('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
    setMessage('')
  }

  const handleAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('请选择图片文件')
      setMessageType('error')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('图片大小不能超过5MB')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    try {
      // Mock avatar upload
      const mockAvatarUrl = URL.createObjectURL(file)
      const success = await updateProfile({ avatar: mockAvatarUrl })
      
      if (success) {
        setMessage('头像更新成功')
        setMessageType('success')
      } else {
        setMessage('头像更新失败')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('头像上传失败')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setMessage('姓名不能为空')
      setMessageType('error')
      return
    }
    
    if (!formData.email.trim()) {
      setMessage('邮箱不能为空')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    try {
      const success = await updateProfile(formData)
      
      if (success) {
        setMessage('个人信息更新成功')
        setMessageType('success')
      } else {
        setMessage('更新失败，请重试')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('更新失败，请重试')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!passwordData.currentPassword) {
      setMessage('请输入当前密码')
      setMessageType('error')
      return
    }
    
    if (!passwordData.newPassword) {
      setMessage('请输入新密码')
      setMessageType('error')
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage('新密码长度至少8位')
      setMessageType('error')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('两次输入的新密码不一致')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    try {
      // Mock password update
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setMessage('密码修改成功')
      setMessageType('success')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setMessage('密码修改失败')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'professor': return 'bg-green-100 text-green-800'
      case 'secretary': return 'bg-orange-100 text-orange-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return '学生'
      case 'professor': return '教授'
      case 'secretary': return '秘书'
      case 'admin': return '管理员'
      default: return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">个人中心</h1>
          <p className="mt-2 text-gray-600">管理您的个人信息和账户设置</p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <Alert className={`mb-6 ${messageType === 'success' ? 'border-green-200 bg-green-50' : ''}`}>
            {messageType === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertDescription>{message}</AlertDescription>
            )}
            {messageType === 'success' && (
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            )}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt="头像" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={handleAvatarUpload}
                      className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition-colors"
                      disabled={isLoading}
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {/* User Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Separator />
                
                {/* User Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{user.department}</span>
                  </div>
                  
                  {user.studentId && (
                    <div className="flex items-center space-x-3">
                      <IdCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.studentId}</span>
                    </div>
                  )}
                  
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{user.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      最后登录: {user.lastLogin ? new Date(user.lastLogin).toLocaleString('zh-CN') : '未知'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className={`text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? '账户正常' : '账户被禁用'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">基本信息</TabsTrigger>
                <TabsTrigger value="security">安全设置</TabsTrigger>
                <TabsTrigger value="permissions">权限信息</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>
                      更新您的个人基本信息
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">姓名 *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        
                        {user.role === 'student' && (
                          <div className="space-y-2">
                            <Label htmlFor="studentId">学号</Label>
                            <Input
                              id="studentId"
                              name="studentId"
                              value={formData.studentId}
                              onChange={handleInputChange}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱地址 *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">联系电话</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">院系</Label>
                        <Input
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? '更新中...' : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            保存更改
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>修改密码</CardTitle>
                    <CardDescription>
                      更改您的登录密码以保护账户安全
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">当前密码 *</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">新密码 *</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">确认新密码 *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            className="pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? '修改中...' : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            修改密码
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Permissions Tab */}
              <TabsContent value="permissions">
                <Card>
                  <CardHeader>
                    <CardTitle>权限信息</CardTitle>
                    <CardDescription>
                      查看您当前的角色权限
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">当前角色</h4>
                        <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-3">权限列表</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {user.permissions.map((permission, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-gray-700">
                                {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {user.role !== 'admin' && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            如需更多权限，请联系系统管理员申请角色变更。
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile