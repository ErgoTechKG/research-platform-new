import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Navigate } from 'react-router-dom'
import { 
  FileText, 
  Save, 
  RotateCcw, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart3,
  HelpCircle,
  Star,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  Target,
  Copy,
  Download,
  RefreshCw,
  User,
  Hash,
  BookOpen
} from 'lucide-react'

// Mock data
const gradingTemplates = [
  {
    id: 1,
    name: '完全正确',
    score: 20,
    comment: '解题思路正确，步骤完整，答案准确',
    shortcut: 'T1',
    color: 'success'
  },
  {
    id: 2,
    name: '部分正确',
    score: 15,
    comment: '解题思路基本正确，但存在部分错误',
    shortcut: 'T2',
    color: 'warning'
  },
  {
    id: 3,
    name: '错误解答',
    score: 5,
    comment: '解题思路错误，需要重新学习相关概念',
    shortcut: 'T3',
    color: 'error'
  },
  {
    id: 4,
    name: '参考答案',
    score: 0,
    comment: '请参考标准答案重新解题',
    shortcut: 'T4',
    color: 'info'
  }
]

const mockAssignments = [
  {
    id: 1,
    student: '张三',
    studentId: '2021001',
    question: '第1题',
    maxScore: 20,
    answer: `解: 设函数f(x)=x²+2x+1
    
    因为lim(x→0)[f(x+h)-f(x)]/h 
    = lim(h→0)[(x+h)²+2(x+h)+1-x²-2x-1]/h
    = lim(h→0)[2xh+h²+2h]/h
    = lim(h→0)[2x+h+2]
    = 2x+2
    
    所以该函数在x=0处的导数为2`,
    referenceAnswer: `标准解答:
    解: 利用极限定义求导数
    
    f'(x) = lim(h→0)[f(x+h)-f(x)]/h
    = lim(h→0)[(x+h)²+2(x+h)+1-x²-2x-1]/h
    = lim(h→0)[x²+2xh+h²+2x+2h+1-x²-2x-1]/h
    = lim(h→0)[2xh+h²+2h]/h
    = lim(h→0)[2x+h+2]
    = 2x+2
    
    因此f'(0) = 2`,
    currentScore: 18,
    comment: '解题思路正确，步骤完整，仅在最后计算有小错误',
    tags: ['思路正确', '计算错误'],
    isGraded: true
  },
  {
    id: 2,
    student: '李四',
    studentId: '2021002',
    question: '第1题',
    maxScore: 20,
    answer: `解: f(x)=x²+2x+1
    
    f'(x) = 2x+2
    
    所以f'(0) = 2`,
    referenceAnswer: `标准解答:
    解: 利用极限定义求导数
    
    f'(x) = lim(h→0)[f(x+h)-f(x)]/h
    = lim(h→0)[(x+h)²+2(x+h)+1-x²-2x-1]/h
    = lim(h→0)[x²+2xh+h²+2x+2h+1-x²-2x-1]/h
    = lim(h→0)[2xh+h²+2h]/h
    = lim(h→0)[2x+h+2]
    = 2x+2
    
    因此f'(0) = 2`,
    currentScore: 0,
    comment: '',
    tags: [],
    isGraded: false
  }
]

const historicalStats = {
  scores: [
    { score: 20, count: 32, percentage: 32 },
    { score: 18, count: 48, percentage: 48 },
    { score: 15, count: 16, percentage: 16 },
    { score: 12, count: 8, percentage: 8 },
    { score: 10, count: 4, percentage: 4 },
    { score: 8, count: 4, percentage: 4 }
  ],
  recommendedScore: 18,
  tolerance: 1
}

const consistencyIssues = [
  {
    type: 'score_deviation',
    message: '第3题: 当前17分，历史平均19分',
    suggestion: '建议重新审查评分标准',
    severity: 'warning'
  },
  {
    type: 'student_variance',
    message: '学生王五: 各题分差较大',
    suggestion: '建议检查是否存在代做情况',
    severity: 'error'
  }
]

const GradingAssistantWorkspace = () => {
  const { user } = useAuth()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentAssignment, setCurrentAssignment] = useState(mockAssignments[0])
  const [score, setScore] = useState(currentAssignment.currentScore)
  const [comment, setComment] = useState(currentAssignment.comment)
  const [tags, setTags] = useState<string[]>(currentAssignment.tags)
  const [fastMode, setFastMode] = useState({
    autoSave: true,
    skipGraded: false,
    showAnomalies: false,
    smartRecommend: true
  })

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return // Don't trigger shortcuts when typing in inputs
    }

    switch (event.key) {
      case '1':
        setScore(4)
        break
      case '2':
        setScore(8)
        break
      case '3':
        setScore(12)
        break
      case '4':
        setScore(16)
        break
      case '5':
        setScore(20)
        break
      case ' ':
        event.preventDefault()
        handleNext()
        break
      case 'b':
      case 'B':
        event.preventDefault()
        handlePrevious()
        break
      case 't':
      case 'T':
        event.preventDefault()
        // Open template modal
        break
      case 's':
      case 'S':
        event.preventDefault()
        handleSave()
        break
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    const assignment = mockAssignments[currentIndex]
    setCurrentAssignment(assignment)
    setScore(assignment.currentScore)
    setComment(assignment.comment)
    setTags(assignment.tags)
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < mockAssignments.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSave = () => {
    // Mock save logic
    console.log('Saving grade:', { score, comment, tags })
    // Update the assignment
    mockAssignments[currentIndex] = {
      ...currentAssignment,
      currentScore: score,
      comment,
      tags,
      isGraded: true
    }
  }

  const applyTemplate = (template: typeof gradingTemplates[0]) => {
    setScore(template.score)
    setComment(template.comment)
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const ratio = score / maxScore
    if (ratio >= 0.9) return 'text-green-600'
    if (ratio >= 0.7) return 'text-blue-600'
    if (ratio >= 0.5) return 'text-orange-600'
    return 'text-red-600'
  }

  const getStarRating = (score: number, maxScore: number) => {
    const ratio = score / maxScore
    return Math.round(ratio * 5)
  }

  // Redirect to login if not authenticated or not a professor
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'professor') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-8 h-8" />
                增强阅卷助手工作区
              </h1>
              <p className="text-gray-600 mt-2">高效的批量阅卷工作环境</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                统计
              </Button>
              <Button variant="outline" size="sm">
                <HelpCircle className="w-4 h-4 mr-2" />
                帮助
              </Button>
            </div>
          </div>

          {/* Grading Console */}
          <Card>
            <CardHeader>
              <CardTitle>阅卷控制台</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-medium">当前任务: 高等数学期中考试</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>进度: {currentIndex + 1}/{mockAssignments.length} ({Math.round(((currentIndex + 1) / mockAssignments.length) * 100)}%)</span>
                    </div>
                  </div>
                  <Progress value={((currentIndex + 1) / mockAssignments.length) * 100} className="w-32" />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentIndex === mockAssignments.length - 1}
                  >
                    <ChevronRight className="w-4 h-4 mr-1" />
                    Next
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-1" />
                    搜索
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    模板
                  </Button>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    快速模式
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    同步
                  </Button>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  快捷键: [1-5]评分 [Space]下一题 [B]返回 [T]模板 [S]保存 [C]评论
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Grading Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Student Answer and Reference Answer */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5" />
                      <div>
                        <CardTitle>学生: {currentAssignment.student} ({currentAssignment.studentId})</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          题目: {currentAssignment.question} ({currentAssignment.maxScore}分)
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={currentAssignment.isGraded ? 'default' : 'secondary'}>
                      {currentAssignment.isGraded ? '已评分' : '待评分'}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Split Screen View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Answer */}
                <Card>
                  <CardHeader>
                    <CardTitle>学生答案</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded border h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{currentAssignment.answer}</pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Reference Answer */}
                <Card>
                  <CardHeader>
                    <CardTitle>参考答案</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded border h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm">{currentAssignment.referenceAnswer}</pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Grading Panel */}
            <div className="space-y-6">
              {/* Template Library */}
              <Card>
                <CardHeader>
                  <CardTitle>评分模板库</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm font-medium">常用模板</div>
                    {gradingTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="border rounded p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => applyTemplate(template)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{template.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {template.shortcut}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {template.score}分 - {template.comment}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Grading */}
              <Card>
                <CardHeader>
                  <CardTitle>当前评分</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="score">分数</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="score"
                        type="number"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        min="0"
                        max={currentAssignment.maxScore}
                        className="w-20"
                      />
                      <span>/ {currentAssignment.maxScore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-sm">评级:</span>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < getStarRating(score, currentAssignment.maxScore)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className={`text-sm font-medium ml-2 ${getScoreColor(score, currentAssignment.maxScore)}`}>
                      {score >= currentAssignment.maxScore * 0.9 ? '优秀' : 
                       score >= currentAssignment.maxScore * 0.7 ? '良好' : 
                       score >= currentAssignment.maxScore * 0.5 ? '一般' : '需改进'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment">评语</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="解题思路正确，步骤完整，仅在最后计算有小错误"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>标签</Label>
                    <div className="flex flex-wrap gap-2">
                      {['思路正确', '计算错误', '步骤完整', '答案准确', '需改进'].map((tag) => (
                        <Badge
                          key={tag}
                          variant={tags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            if (tags.includes(tag)) {
                              setTags(tags.filter(t => t !== tag))
                            } else {
                              setTags([...tags, tag])
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                    <Button variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      应用模板
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      重置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Historical Reference */}
            <Card>
              <CardHeader>
                <CardTitle>历史评分参考</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-medium">类似题目历史评分分布:</div>
                  
                  <div className="space-y-2">
                    {historicalStats.scores.map((stat) => (
                      <div key={stat.score} className="flex items-center gap-3">
                        <span className="w-8 text-sm">{stat.score}分:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{stat.percentage}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Target className="w-4 h-4" />
                      <span className="font-medium">
                        建议评分: {historicalStats.recommendedScore}分 (±{historicalStats.tolerance}分)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      查看趋势
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-1" />
                      更新参考
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consistency Checker */}
            <Card>
              <CardHeader>
                <CardTitle>一致性检查器</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm font-medium">评分一致性分析</div>
                  
                  {consistencyIssues.length > 0 ? (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-orange-600 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        发现潜在不一致:
                      </div>
                      
                      {consistencyIssues.map((issue, index) => (
                        <div key={index} className="border-l-4 border-orange-400 pl-3 py-2">
                          <div className="text-sm font-medium">{issue.message}</div>
                          <div className="text-xs text-gray-600 mt-1">{issue.suggestion}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">整体评分标准: 正常</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      调整标准
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      详细报告
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Operations Panel */}
          <Card>
            <CardHeader>
              <CardTitle>批量操作面板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium">批量操作工具:</div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-1" />
                    批量打标签
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-1" />
                    批量评语
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    统计分析
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    导出成绩
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    同步状态
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-save"
                      checked={fastMode.autoSave}
                      onCheckedChange={(checked) => setFastMode({ ...fastMode, autoSave: checked })}
                    />
                    <Label htmlFor="auto-save" className="text-sm">自动保存</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="skip-graded"
                      checked={fastMode.skipGraded}
                      onCheckedChange={(checked) => setFastMode({ ...fastMode, skipGraded: checked })}
                    />
                    <Label htmlFor="skip-graded" className="text-sm">跳过已评</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-anomalies"
                      checked={fastMode.showAnomalies}
                      onCheckedChange={(checked) => setFastMode({ ...fastMode, showAnomalies: checked })}
                    />
                    <Label htmlFor="show-anomalies" className="text-sm">仅显示异常</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smart-recommend"
                      checked={fastMode.smartRecommend}
                      onCheckedChange={(checked) => setFastMode({ ...fastMode, smartRecommend: checked })}
                    />
                    <Label htmlFor="smart-recommend" className="text-sm">智能推荐</Label>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">当前选择: 5份作业</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        批量通过
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="w-4 h-4 mr-1" />
                        批量退回
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-1" />
                        统一评语
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Panel */}
          <Card>
            <CardHeader>
              <CardTitle>评分统计面板</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm font-medium">本次阅卷统计:</div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{currentIndex + 1}</div>
                    <div className="text-gray-600">已评</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{mockAssignments.length - currentIndex - 1}</div>
                    <div className="text-gray-600">待评</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">4.2</div>
                    <div className="text-gray-600">分钟/份</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(((currentIndex + 1) / mockAssignments.length) * 100)}%</div>
                    <div className="text-gray-600">今日进度</div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">效率趋势: 比上次快15%</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-800">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">预计完成时间: 明天下午3点</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="flex items-center gap-2 text-blue-800">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">
                      建议: 当前效率良好，建议保持当前节奏完成阅卷任务
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default GradingAssistantWorkspace