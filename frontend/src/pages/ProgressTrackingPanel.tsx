import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  Send,
  TimerIcon,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

interface StudentSubmission {
  id: string
  name: string
  submittedAt?: string
  status: 'pending' | 'submitted' | 'reviewing' | 'approved' | 'rejected'
  completeness: number
  issues?: string[]
}

interface SubmissionStats {
  total: number
  submitted: number
  pending: number
  reviewing: number
  approved: number
  rejected: number
}

export default function ProgressTrackingPanel() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([
    { id: '1', name: '王小明', submittedAt: '2024-08-28 14:32', status: 'submitted', completeness: 85, issues: ['证书日期模糊'] },
    { id: '2', name: '李小红', submittedAt: '2024-08-28 15:21', status: 'approved', completeness: 100 },
    { id: '3', name: '张三', status: 'pending', completeness: 0 },
    { id: '4', name: '赵六', submittedAt: '2024-08-27 09:15', status: 'reviewing', completeness: 90 },
    { id: '5', name: '王五', submittedAt: '2024-08-26 16:45', status: 'rejected', completeness: 60, issues: ['材料不完整', '缺少必要证明'] },
    { id: '6', name: '钱七', status: 'pending', completeness: 0 },
    { id: '7', name: '孙八', submittedAt: '2024-08-28 11:20', status: 'submitted', completeness: 95 },
    { id: '8', name: '周九', status: 'pending', completeness: 0 },
  ])

  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    submitted: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0
  })

  const [timeRemaining, setTimeRemaining] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const deadline = new Date('2024-09-01T23:59:59')

  useEffect(() => {
    const calculateStats = () => {
      const newStats: SubmissionStats = {
        total: submissions.length,
        submitted: submissions.filter(s => s.status === 'submitted').length,
        pending: submissions.filter(s => s.status === 'pending').length,
        reviewing: submissions.filter(s => s.status === 'reviewing').length,
        approved: submissions.filter(s => s.status === 'approved').length,
        rejected: submissions.filter(s => s.status === 'rejected').length
      }
      setStats(newStats)
    }
    calculateStats()
  }, [submissions])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = deadline.getTime() - now.getTime()
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeRemaining(`${days}天 ${hours}小时 ${minutes}分钟`)
      } else {
        setTimeRemaining('已截止')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  useEffect(() => {
    if (!autoRefresh) return
    
    const refreshInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * submissions.length)
      const updatedSubmissions = [...submissions]
      
      if (updatedSubmissions[randomIndex].status === 'pending' && Math.random() > 0.7) {
        updatedSubmissions[randomIndex] = {
          ...updatedSubmissions[randomIndex],
          status: 'submitted',
          submittedAt: new Date().toLocaleString('zh-CN'),
          completeness: Math.floor(Math.random() * 40) + 60
        }
        setSubmissions(updatedSubmissions)
      }
    }, 5000)

    return () => clearInterval(refreshInterval)
  }, [autoRefresh, submissions])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700'
      case 'submitted': return 'bg-blue-100 text-blue-700'
      case 'reviewing': return 'bg-yellow-100 text-yellow-700'
      case 'approved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '未提交'
      case 'submitted': return '已提交'
      case 'reviewing': return '审核中'
      case 'approved': return '已通过'
      case 'rejected': return '已退回'
      default: return status
    }
  }

  const filteredSubmissions = selectedFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === selectedFilter)

  const overallProgress = Math.round((stats.total - stats.pending) / stats.total * 100)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">进度追踪面板</h1>
            <div className="flex items-center gap-4">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? '自动刷新' : '手动刷新'}
              </Button>
              <Badge variant="outline" className="px-3 py-1">
                <TimerIcon className="w-4 h-4 mr-1" />
                截止时间: {timeRemaining}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>提交状态统计</span>
                  <div className="text-sm font-normal text-gray-600">
                    总人数: {stats.total}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div 
                    className="text-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedFilter('pending')}
                  >
                    <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-700">{stats.pending}</div>
                    <div className="text-sm text-gray-600">未提交</div>
                  </div>
                  <div 
                    className="text-center p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100"
                    onClick={() => setSelectedFilter('submitted')}
                  >
                    <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">{stats.submitted}</div>
                    <div className="text-sm text-blue-600">已提交</div>
                  </div>
                  <div 
                    className="text-center p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100"
                    onClick={() => setSelectedFilter('reviewing')}
                  >
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-700">{stats.reviewing}</div>
                    <div className="text-sm text-yellow-600">审核中</div>
                  </div>
                  <div 
                    className="text-center p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100"
                    onClick={() => setSelectedFilter('approved')}
                  >
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">{stats.approved}</div>
                    <div className="text-sm text-green-600">已通过</div>
                  </div>
                  <div 
                    className="text-center p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100"
                    onClick={() => setSelectedFilter('rejected')}
                  >
                    <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-700">{stats.rejected}</div>
                    <div className="text-sm text-red-600">已退回</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>整体进度</span>
                    <span className="font-medium">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>异常状态提醒</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.pending > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      还有 <span className="font-bold">{stats.pending}</span> 名学生未提交材料
                    </AlertDescription>
                  </Alert>
                )}
                {stats.rejected > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      有 <span className="font-bold">{stats.rejected}</span> 份材料被退回需要重新提交
                    </AlertDescription>
                  </Alert>
                )}
                <div className="pt-2">
                  <Button className="w-full" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    发送提醒通知
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>学生提交详情</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter('all')}
                  >
                    全部
                  </Button>
                  <Button
                    variant={selectedFilter === 'pending' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter('pending')}
                  >
                    未提交
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">学生姓名</th>
                      <th className="text-left p-2">提交时间</th>
                      <th className="text-left p-2">状态</th>
                      <th className="text-left p-2">完整度</th>
                      <th className="text-left p-2">问题标记</th>
                      <th className="text-left p-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map(submission => (
                      <tr key={submission.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            {submission.name}
                          </div>
                        </td>
                        <td className="p-2 text-sm text-gray-600">
                          {submission.submittedAt || '-'}
                        </td>
                        <td className="p-2">
                          <Badge className={getStatusColor(submission.status)}>
                            {getStatusText(submission.status)}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Progress value={submission.completeness} className="w-20 h-2" />
                            <span className="text-sm">{submission.completeness}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          {submission.issues && submission.issues.length > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600">{submission.issues.length} 个问题</span>
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          {submission.status === 'submitted' && (
                            <Button size="sm" variant="outline">查看详情</Button>
                          )}
                          {submission.status === 'pending' && (
                            <Button size="sm" variant="outline">发送提醒</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}