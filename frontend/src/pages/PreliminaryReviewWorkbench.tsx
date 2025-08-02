import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Search,
  Filter,
  CheckCircle, 
  AlertTriangle,
  Eye,
  FileText,
  Users,
  Clock,
  XCircle,
  Zap,
  Bot,
  RefreshCw,
  Download,
  MoreVertical
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged'
type FilterType = 'all' | 'pending' | 'flagged' | 'approved'

interface StudentSubmission {
  id: string
  studentName: string
  studentId: string
  submissionDate: string
  reviewStatus: ReviewStatus
  materials: {
    competitions: number
    research: number
    social: number
    certificates: number
  }
  issues: string[]
  aiSuggestions: string[]
  completeness: number
  duplicateRisk: 'none' | 'low' | 'medium' | 'high'
  lastReviewDate?: string
  reviewer?: string
}

const MOCK_SUBMISSIONS: StudentSubmission[] = [
  {
    id: '1',
    studentName: '王小明',
    studentId: '2021010101',
    submissionDate: '2024-12-01',
    reviewStatus: 'pending',
    materials: { competitions: 3, research: 2, social: 1, certificates: 4 },
    issues: ['证书日期模糊，需要确认', '竞赛证书扫描不清晰'],
    aiSuggestions: ['建议重新上传高清版证书', '日期信息需要人工核实'],
    completeness: 85,
    duplicateRisk: 'low'
  },
  {
    id: '2',
    studentName: '李小红',
    studentId: '2021010102',
    submissionDate: '2024-12-02',
    reviewStatus: 'pending',
    materials: { competitions: 5, research: 1, social: 4, certificates: 6 },
    issues: [],
    aiSuggestions: ['材料完整，建议快速通过'],
    completeness: 95,
    duplicateRisk: 'none'
  },
  {
    id: '3',
    studentName: '张三',
    studentId: '2021010103',
    submissionDate: '2024-11-28',
    reviewStatus: 'flagged',
    materials: { competitions: 4, research: 3, social: 2, certificates: 5 },
    issues: ['存在疑似重复提交的材料', '部分证书可能为伪造'],
    aiSuggestions: ['需要详细核实证书真实性', '建议联系学生确认材料来源'],
    completeness: 78,
    duplicateRisk: 'high'
  },
  {
    id: '4',
    studentName: '赵小花',
    studentId: '2021010104',
    submissionDate: '2024-12-03',
    reviewStatus: 'approved',
    materials: { competitions: 2, research: 4, social: 3, certificates: 7 },
    issues: [],
    aiSuggestions: [],
    completeness: 100,
    duplicateRisk: 'none',
    lastReviewDate: '2024-12-03',
    reviewer: '张秘书'
  },
  {
    id: '5',
    studentName: '刘小刚',
    studentId: '2021010105',
    submissionDate: '2024-11-30',
    reviewStatus: 'rejected',
    materials: { competitions: 1, research: 0, social: 1, certificates: 2 },
    issues: ['材料不足，未达到申请要求', '缺少必要的科研项目证明'],
    aiSuggestions: ['建议补充科研项目材料', '竞赛获奖需要更多证明'],
    completeness: 45,
    duplicateRisk: 'none',
    lastReviewDate: '2024-12-01',
    reviewer: '王秘书'
  }
]

export default function PreliminaryReviewWorkbench() {
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(MOCK_SUBMISSIONS)
  const [selectedSubmissions, setSelectedSubmissions] = useState<string[]>([])
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [batchMode, setBatchMode] = useState(true)

  const getStatusStats = () => {
    const pending = submissions.filter(s => s.reviewStatus === 'pending').length
    const approved = submissions.filter(s => s.reviewStatus === 'approved').length
    const rejected = submissions.filter(s => s.reviewStatus === 'rejected').length
    const flagged = submissions.filter(s => s.reviewStatus === 'flagged').length
    return { pending, approved, rejected, flagged }
  }

  const getFilteredSubmissions = () => {
    let filtered = submissions

    // Apply status filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(s => s.reviewStatus === currentFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.includes(searchQuery)
      )
    }

    return filtered
  }

  const handleStatusChange = (submissionId: string, newStatus: ReviewStatus) => {
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId 
        ? { 
            ...s, 
            reviewStatus: newStatus,
            lastReviewDate: new Date().toISOString().split('T')[0],
            reviewer: '当前用户'
          }
        : s
    ))
  }

  const handleBatchApprove = () => {
    if (selectedSubmissions.length === 0) return
    
    setSubmissions(prev => prev.map(s => 
      selectedSubmissions.includes(s.id) 
        ? { 
            ...s, 
            reviewStatus: 'approved' as ReviewStatus,
            lastReviewDate: new Date().toISOString().split('T')[0],
            reviewer: '当前用户'
          }
        : s
    ))
    setSelectedSubmissions([])
  }

  const handleBatchReject = () => {
    if (selectedSubmissions.length === 0) return
    
    setSubmissions(prev => prev.map(s => 
      selectedSubmissions.includes(s.id) 
        ? { 
            ...s, 
            reviewStatus: 'rejected' as ReviewStatus,
            lastReviewDate: new Date().toISOString().split('T')[0],
            reviewer: '当前用户'
          }
        : s
    ))
    setSelectedSubmissions([])
  }

  const handleSelectAll = () => {
    const filteredIds = getFilteredSubmissions().map(s => s.id)
    if (selectedSubmissions.length === filteredIds.length) {
      setSelectedSubmissions([])
    } else {
      setSelectedSubmissions(filteredIds)
    }
  }

  const handleSelectionChange = (submissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubmissions(prev => [...prev, submissionId])
    } else {
      setSelectedSubmissions(prev => prev.filter(id => id !== submissionId))
    }
  }

  const getStatusBadge = (status: ReviewStatus) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, label: '待审核' },
      approved: { variant: 'default' as const, icon: CheckCircle, label: '已通过' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: '已退回' },
      flagged: { variant: 'secondary' as const, icon: AlertTriangle, label: '有疑问' }
    }
    
    const config = variants[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getDuplicateRiskBadge = (risk: string) => {
    if (risk === 'none') return null
    
    const variants = {
      low: { color: 'text-yellow-600 bg-yellow-50', label: '低风险' },
      medium: { color: 'text-orange-600 bg-orange-50', label: '中风险' },
      high: { color: 'text-red-600 bg-red-50', label: '高风险' }
    }
    
    const config = variants[risk as keyof typeof variants]
    
    return (
      <Badge className={cn('text-xs', config.color)}>
        {config.label}
      </Badge>
    )
  }

  const getAIInsights = () => {
    const duplicateCount = submissions.filter(s => s.duplicateRisk !== 'none').length
    const issueCount = submissions.reduce((acc, s) => acc + s.issues.length, 0)
    const lowCompletenessCount = submissions.filter(s => s.completeness < 70).length
    
    return { duplicateCount, issueCount, lowCompletenessCount }
  }

  const stats = getStatusStats()
  const filteredSubmissions = getFilteredSubmissions()
  const aiInsights = getAIInsights()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">材料初审管理</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>待审: <span className="font-semibold text-orange-600">{stats.pending}</span></span>
              <span>已审: <span className="font-semibold text-green-600">{stats.approved}</span></span>
              <span>退回: <span className="font-semibold text-red-600">{stats.rejected}</span></span>
              <span>疑问: <span className="font-semibold text-yellow-600">{stats.flagged}</span></span>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索学生姓名或学号..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={currentFilter} onValueChange={(value: FilterType) => setCurrentFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="pending">待审核</SelectItem>
                      <SelectItem value="flagged">有疑问</SelectItem>
                      <SelectItem value="approved">已通过</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-1" />
                    筛选
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    导出
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          {(aiInsights.duplicateCount > 0 || aiInsights.issueCount > 0 || aiInsights.lowCompletenessCount > 0) && (
            <Alert className="mb-6">
              <Bot className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">AI辅助提示：</span>
                {aiInsights.duplicateCount > 0 && (
                  <span className="ml-1">发现 {aiInsights.duplicateCount} 份材料可能存在重复提交；</span>
                )}
                {aiInsights.issueCount > 0 && (
                  <span className="ml-1">检测到 {aiInsights.issueCount} 个潜在问题需要关注；</span>
                )}
                {aiInsights.lowCompletenessCount > 0 && (
                  <span className="ml-1">{aiInsights.lowCompletenessCount} 份材料完整度较低。</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Batch Operations */}
          {batchMode && (
            <Card className="mb-6">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm text-gray-600">
                      已选择 {selectedSubmissions.length} 项
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      disabled={selectedSubmissions.length === 0}
                      onClick={handleBatchApprove}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      批量通过
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedSubmissions.length === 0}
                      onClick={handleBatchReject}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      批量退回
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submissions List */}
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {batchMode && (
                      <Checkbox
                        checked={selectedSubmissions.includes(submission.id)}
                        onCheckedChange={(checked) => handleSelectionChange(submission.id, checked as boolean)}
                        className="mt-1"
                      />
                    )}
                    
                    <div className="flex-1">
                      {/* Student Info Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{submission.studentName}</h3>
                          <span className="text-gray-500 text-sm">({submission.studentId})</span>
                          {getStatusBadge(submission.reviewStatus)}
                          {getDuplicateRiskBadge(submission.duplicateRisk)}
                        </div>
                        <div className="text-sm text-gray-500">
                          提交时间: {submission.submissionDate}
                        </div>
                      </div>

                      {/* Materials Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-blue-600">
                            竞赛获奖 {submission.materials.competitions}项
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-green-600">
                            科研项目 {submission.materials.research}项
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-purple-600">
                            社会实践 {submission.materials.social}项
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="text-orange-600">
                            证书文件 {submission.materials.certificates}项
                          </Badge>
                        </div>
                      </div>

                      {/* Completeness Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">材料完整度</span>
                          <span className={cn(
                            "font-medium",
                            submission.completeness >= 90 ? "text-green-600" :
                            submission.completeness >= 70 ? "text-yellow-600" : "text-red-600"
                          )}>
                            {submission.completeness}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={cn(
                              "h-2 rounded-full",
                              submission.completeness >= 90 ? "bg-green-500" :
                              submission.completeness >= 70 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${submission.completeness}%` }}
                          />
                        </div>
                      </div>

                      {/* Issues and AI Suggestions */}
                      {(submission.issues.length > 0 || submission.aiSuggestions.length > 0) && (
                        <div className="space-y-2 mb-4">
                          {submission.issues.map((issue, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                              <span className="text-red-700">{issue}</span>
                            </div>
                          ))}
                          {submission.aiSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-blue-700">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Review History */}
                      {submission.lastReviewDate && (
                        <div className="text-sm text-gray-500 mb-4">
                          上次审核: {submission.lastReviewDate} by {submission.reviewer}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {submission.reviewStatus === 'pending' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleStatusChange(submission.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              快速通过
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(submission.id, 'flagged')}
                            >
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              标记问题
                            </Button>
                          </>
                        )}
                        
                        {submission.reviewStatus === 'flagged' && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleStatusChange(submission.id, 'approved')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              确认通过
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleStatusChange(submission.id, 'rejected')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              退回修改
                            </Button>
                          </>
                        )}

                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>

                        {submission.reviewStatus !== 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(submission.id, 'pending')}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            重新审核
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredSubmissions.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  暂无符合条件的提交材料
                </h3>
                <p className="text-gray-600">
                  {searchQuery ? '尝试调整搜索条件或筛选器' : '等待学生提交材料进行审核'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}