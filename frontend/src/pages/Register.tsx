import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const navigate = useNavigate()

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = []
    let score = 0
    
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('密码长度至少8位')
    }
    
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('包含大写字母')
    }
    
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('包含小写字母')
    }
    
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('包含数字')
    }
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('包含特殊字符')
    }
    
    let color = 'bg-red-500'
    if (score >= 3) color = 'bg-yellow-500'
    if (score >= 4) color = 'bg-green-500'
    
    return { score, feedback, color }
  }

  const passwordStrength = checkPasswordStrength(formData.password)
  const isPasswordMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Student ID validation (assuming HUST format)
  const isValidStudentId = (studentId: string) => {
    const studentIdRegex = /^[DUM]\d{9,10}$/i // D/U/M followed by 9-10 digits
    return studentIdRegex.test(studentId)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('请输入姓名')
      return false
    }
    
    if (!formData.studentId.trim()) {
      setError('请输入学号')
      return false
    }
    
    if (!isValidStudentId(formData.studentId)) {
      setError('学号格式不正确（应为D/U/M开头+9-10位数字）')
      return false
    }
    
    if (!formData.email.trim()) {
      setError('请输入邮箱地址')
      return false
    }
    
    if (!isValidEmail(formData.email)) {
      setError('邮箱格式不正确')
      return false
    }
    
    if (!formData.email.endsWith('@hust.edu.cn') && !formData.email.endsWith('@mail.hust.edu.cn')) {
      setError('请使用华中科技大学邮箱（@hust.edu.cn 或 @mail.hust.edu.cn）')
      return false
    }
    
    if (passwordStrength.score < 3) {
      setError('密码强度不足，请设置更强的密码')
      return false
    }
    
    if (!isPasswordMatch) {
      setError('两次输入的密码不一致')
      return false
    }
    
    if (!formData.role) {
      setError('请选择用户角色')
      return false
    }
    
    if (!formData.department.trim()) {
      setError('请输入院系信息')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Mock registration API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate success
      setSuccess('注册申请已提交！请检查您的邮箱以验证账户。')
      setEmailVerificationSent(true)
      
      // In real implementation, redirect after email verification
      setTimeout(() => {
        navigate('/login', { 
          state: { message: '注册成功！请使用您的邮箱和密码登录。' }
        })
      }, 3000)
      
    } catch (error) {
      setError('注册失败，请重试。')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold">
                验证邮件已发送
              </CardTitle>
              <CardDescription>
                我们已向您的邮箱发送了验证链接
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                请检查您的邮箱 <strong>{formData.email}</strong> 并点击验证链接激活账户。
              </p>
              <p className="text-xs text-gray-500">
                没有收到邮件？请检查垃圾邮件文件夹或 
                <button className="text-primary hover:underline ml-1">
                  重新发送验证邮件
                </button>
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    返回登录页面
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            加入科研实验班
          </h1>
          <p className="text-gray-600">
            华中科技大学机械科学与工程学院
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">
              申请注册账户
            </CardTitle>
            <CardDescription className="text-center">
              请填写您的个人信息以申请账户
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Student ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="请输入真实姓名"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">学号 *</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    placeholder="如：D202377777"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">华科邮箱 *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@hust.edu.cn"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-gray-500">
                  请使用华中科技大学邮箱（@hust.edu.cn 或 @mail.hust.edu.cn）
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">密码 *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="请设置密码"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {passwordStrength.score < 3 ? '弱' : passwordStrength.score < 4 ? '中' : '强'}
                      </span>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <p className="text-xs text-gray-500">
                        建议：{passwordStrength.feedback.join('、')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认密码 *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="请再次输入密码"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center space-x-1 text-xs">
                    {isPasswordMatch ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">密码匹配</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">密码不匹配</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Role and Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">申请角色 *</Label>
                  <Select onValueChange={(value) => handleSelectChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">学生</SelectItem>
                      <SelectItem value="faculty">教师</SelectItem>
                      <SelectItem value="admin">管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">院系 *</Label>
                  <Input
                    id="department"
                    name="department"
                    placeholder="如：机械科学与工程学院"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Phone (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="phone">联系电话（可选）</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="请输入手机号码"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-11 text-base"
                disabled={isLoading}
              >
                {isLoading ? '提交申请中...' : '提交注册申请'}
              </Button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    已有账号？
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/login" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  立即登录
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 华中科技大学机械科学与工程学院<br/>
            技术支持：科研实验班信息化小组
          </p>
          <div className="mt-2">
            <p className="text-xs text-gray-400">
              注册即表示您同意我们的 
              <a href="#" className="text-primary hover:underline">使用条款</a> 和 
              <a href="#" className="text-primary hover:underline">隐私政策</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register