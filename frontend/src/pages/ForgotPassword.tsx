import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Mail, ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const ForgotPassword = () => {
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'success'>('email')
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const startCountdown = () => {
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      setError('请输入邮箱地址')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('邮箱格式不正确')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate success
      setStep('code')
      startCountdown()
    } catch (error) {
      setError('发送验证码失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.verificationCode) {
      setError('请输入验证码')
      return
    }
    
    if (formData.verificationCode.length !== 6) {
      setError('验证码应为6位数字')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulate verification
      if (formData.verificationCode === '123456') { // Mock verification
        setStep('reset')
      } else {
        setError('验证码不正确，请重新输入')
      }
    } catch (error) {
      setError('验证失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.newPassword) {
      setError('请输入新密码')
      return
    }
    
    if (formData.newPassword.length < 8) {
      setError('密码长度至少8位')
      return
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStep('success')
    } catch (error) {
      setError('重置密码失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (countdown > 0) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      startCountdown()
    } catch (error) {
      setError('重发验证码失败')
    } finally {
      setIsLoading(false)
    }
  }

  // Email Step
  if (step === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              忘记密码
            </h1>
            <p className="text-gray-600">
              输入您的邮箱地址，我们将发送验证码给您
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-center">
                找回您的账户
              </CardTitle>
              <CardDescription className="text-center">
                请输入您注册时使用的邮箱地址
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSendVerificationCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="请输入您的邮箱地址"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? '发送中...' : '发送验证码'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  返回登录
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Verification Code Step
  if (step === 'code') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              验证您的邮箱
            </h1>
            <p className="text-gray-600">
              我们已向 {formData.email} 发送了验证码
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-center">
                输入验证码
              </CardTitle>
              <CardDescription className="text-center">
                请输入您收到的6位验证码
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">验证码</Label>
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    placeholder="请输入6位验证码"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="h-11 text-center text-lg tracking-wider"
                    required
                  />
                  <p className="text-xs text-gray-500 text-center">
                    测试用验证码: 123456
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? '验证中...' : '验证'}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-gray-600">没有收到验证码？</p>
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isLoading}
                  className="text-sm text-primary hover:text-primary/80 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? (
                    <>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {countdown}秒后可重发
                    </>
                  ) : (
                    '重新发送验证码'
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setStep('email')}
                  className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  修改邮箱地址
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Reset Password Step
  if (step === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              重置密码
            </h1>
            <p className="text-gray-600">
              请设置一个新的安全密码
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl font-semibold text-center">
                设置新密码
              </CardTitle>
              <CardDescription className="text-center">
                请输入您的新密码
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">新密码</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="请输入新密码（至少8位）"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-11"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? '重置中...' : '重置密码'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Success Step
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              密码重置成功
            </CardTitle>
            <CardDescription>
              您的密码已成功重置
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              您现在可以使用新密码登录您的账户了。
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button className="w-full h-11">
                  立即登录
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword