import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Trophy,
  Lightbulb,
  FlaskConical,
  Users,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Send,
  User,
  GitMerge,
  History,
  Shield
} from 'lucide-react'

interface Student {
  id: string
  name: string
  competitions: Competition[]
  research: ResearchProject[]
  status: 'pending' | 'in_review' | 'conflict' | 'completed'
  assignedExperts: Expert[]
}

interface Competition {
  name: string
  level: string
  award: string
  score: number
}

interface ResearchProject {
  name: string
  role: string
  type: string
  score: number
}

interface Expert {
  id: string
  name: string
  avatar: string
  status: 'online' | 'reviewing' | 'offline'
  currentReview?: string
}

interface ReviewScore {
  expertId: string
  creativeThinking: number
  practicalAbility: number
  developmentPotential: number
  comment: string
  timestamp: Date
  status: 'draft' | 'submitted'
}

interface Discussion {
  id: string
  expertId: string
  expertName: string
  message: string
  timestamp: Date
}

interface ReviewConflict {
  dimension: string
  experts: string[]
  scores: number[]
  resolved: boolean
}

export default function ExpertReviewPlatform() {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const [activeExperts, setActiveExperts] = useState<Expert[]>([
    { id: '1', name: '张教授', avatar: 'ZJ', status: 'online' },
    { id: '2', name: '李教授', avatar: 'LJ', status: 'reviewing', currentReview: '王小明' },
    { id: '3', name: '王教授', avatar: 'WJ', status: 'online' },
    { id: '4', name: '陈教授', avatar: 'CJ', status: 'offline' }
  ])

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: '王小明',
      status: 'in_review',
      assignedExperts: [
        { id: '1', name: '张教授', avatar: 'ZJ', status: 'reviewing' },
        { id: '2', name: '李教授', avatar: 'LJ', status: 'reviewing' }
      ],
      competitions: [
        { name: '全国大学生数学建模竞赛', level: '国家级', award: '一等奖', score: 20 },
        { name: '中国"互联网+"大学生创新创业大赛', level: '国家级', award: '一等奖', score: 20 },
        { name: '全国大学生电子设计竞赛', level: '省级', award: '二等奖', score: 15 }
      ],
      research: [
        { name: '基于深度学习的目标检测算法研究', role: '负责人', type: '国家级大创项目', score: 25 },
        { name: '智能制造系统优化研究', role: '第二作者', type: '发表论文1篇', score: 10 }
      ]
    },
    {
      id: '2',
      name: '李小红',
      status: 'pending',
      assignedExperts: [],
      competitions: [
        { name: '全国大学生机械创新设计大赛', level: '国家级', award: '二等奖', score: 15 },
        { name: '全国大学生数学竞赛', level: '省级', award: '一等奖', score: 10 }
      ],
      research: [
        { name: '新能源汽车电池管理系统研究', role: '参与者', type: '省级科研项目', score: 15 }
      ]
    }
  ])

  const [reviews, setReviews] = useState<Record<string, ReviewScore[]>>({
    '1': [
      {
        expertId: '1',
        creativeThinking: 25,
        practicalAbility: 22,
        developmentPotential: 28,
        comment: '创新思维活跃，在多个国家级竞赛中表现突出，科研能力强。',
        timestamp: new Date('2024-03-20T10:30:00'),
        status: 'submitted'
      },
      {
        expertId: '2',
        creativeThinking: 28,
        practicalAbility: 26,
        developmentPotential: 29,
        comment: '极具创新潜力，实践能力出众，科研项目成果显著。',
        timestamp: new Date('2024-03-20T11:15:00'),
        status: 'submitted'
      }
    ]
  })

  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: '1',
      expertId: '1',
      expertName: '张教授',
      message: '该学生的创新思维确实很突出，特别是在算法设计方面。',
      timestamp: new Date('2024-03-20T10:35:00')
    },
    {
      id: '2',
      expertId: '2',
      expertName: '李教授',
      message: '同意，而且实践能力也很强，建议给予较高评分。',
      timestamp: new Date('2024-03-20T11:20:00')
    }
  ])

  const [conflicts, setConflicts] = useState<ReviewConflict[]>([])
  const [showConflictDialog, setShowConflictDialog] = useState(false)
  const [currentScore, setCurrentScore] = useState<ReviewScore>({
    expertId: '1',
    creativeThinking: 25,
    practicalAbility: 22,
    developmentPotential: 28,
    comment: '',
    timestamp: new Date(),
    status: 'draft'
  })
  const [discussionInput, setDiscussionInput] = useState('')

  const currentStudent = students[currentStudentIndex]
  const studentReviews = reviews[currentStudent.id] || []

  const competitionScore = Math.min(
    currentStudent.competitions.reduce((sum, c) => sum + c.score, 0),
    40
  )
  const researchScore = Math.min(
    currentStudent.research.reduce((sum, r) => sum + r.score, 0),
    30
  )

  useEffect(() => {
    checkConflicts()
  }, [studentReviews])

  const checkConflicts = () => {
    if (studentReviews.length < 2) return

    const dimensions = ['creativeThinking', 'practicalAbility', 'developmentPotential']
    const newConflicts: ReviewConflict[] = []

    dimensions.forEach(dim => {
      const scores = studentReviews.map(r => r[dim as keyof ReviewScore] as number)
      const maxDiff = Math.max(...scores) - Math.min(...scores)
      
      if (maxDiff > 5) {
        newConflicts.push({
          dimension: dim === 'creativeThinking' ? '创新思维' : 
                     dim === 'practicalAbility' ? '实践能力' : '发展潜力',
          experts: studentReviews.map(r => 
            activeExperts.find(e => e.id === r.expertId)?.name || ''
          ),
          scores,
          resolved: false
        })
      }
    })

    setConflicts(newConflicts)
    if (newConflicts.length > 0) {
      setShowConflictDialog(true)
    }
  }

  const handleScoreChange = (field: keyof ReviewScore, value: number[]) => {
    setCurrentScore({
      ...currentScore,
      [field]: value[0]
    })
  }

  const handleSubmitReview = () => {
    const newReview: ReviewScore = {
      ...currentScore,
      timestamp: new Date(),
      status: 'submitted'
    }

    setReviews({
      ...reviews,
      [currentStudent.id]: [...studentReviews, newReview]
    })

    alert('评审已提交')
  }

  const handleSendDiscussion = () => {
    if (!discussionInput.trim()) return

    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      expertId: '1',
      expertName: '张教授',
      message: discussionInput,
      timestamp: new Date()
    }

    setDiscussions([...discussions, newDiscussion])
    setDiscussionInput('')
  }

  const getMergedScore = () => {
    if (studentReviews.length === 0) return null

    const avgScores = {
      creativeThinking: studentReviews.reduce((sum, r) => sum + r.creativeThinking, 0) / studentReviews.length,
      practicalAbility: studentReviews.reduce((sum, r) => sum + r.practicalAbility, 0) / studentReviews.length,
      developmentPotential: studentReviews.reduce((sum, r) => sum + r.developmentPotential, 0) / studentReviews.length
    }

    const innovationScore = (avgScores.creativeThinking + avgScores.practicalAbility + avgScores.developmentPotential) / 3
    return competitionScore + researchScore + innovationScore
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">专家协同评审平台</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">
                  在线专家: {activeExperts.filter(e => e.status !== 'offline').length}
                </span>
              </div>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-1" />
                评分指南
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium">当前学生:</span>
                      <span className="text-xl font-bold">{currentStudent.name}</span>
                      <Badge 
                        variant={currentStudent.status === 'completed' ? 'default' : 
                                currentStudent.status === 'conflict' ? 'destructive' : 
                                currentStudent.status === 'in_review' ? 'secondary' : 'outline'}
                      >
                        {currentStudent.status === 'completed' ? '已完成' :
                         currentStudent.status === 'conflict' ? '存在冲突' :
                         currentStudent.status === 'in_review' ? '评审中' : '待评审'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStudentIndex(Math.max(0, currentStudentIndex - 1))}
                        disabled={currentStudentIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        上一个
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStudentIndex(Math.min(students.length - 1, currentStudentIndex + 1))}
                        disabled={currentStudentIndex === students.length - 1}
                      >
                        下一个
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  {currentStudent.assignedExperts.length > 0 && (
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-sm text-gray-600">分配专家:</span>
                      <div className="flex gap-2">
                        {currentStudent.assignedExperts.map(expert => (
                          <div key={expert.id} className="flex items-center gap-1">
                            <Avatar className="w-6 h-6">
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs">
                                {expert.avatar}
                              </div>
                            </Avatar>
                            <span className="text-sm">{expert.name}</span>
                            {expert.status === 'reviewing' && (
                              <Badge variant="secondary" className="text-xs px-1">
                                评审中
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="review" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="review">评审打分</TabsTrigger>
                  <TabsTrigger value="history">评审历史</TabsTrigger>
                  <TabsTrigger value="merge">结果合并</TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        竞赛获奖 (40%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentStudent.competitions.map((comp, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium">{comp.name}</span>
                              <div className="text-sm text-gray-600 mt-1">
                                {comp.level} · {comp.award}
                              </div>
                            </div>
                            <span className="text-lg font-bold">{comp.score}分</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">小计:</span>
                          <span className="text-lg font-bold">{competitionScore}/40 分</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-blue-500" />
                        科研项目 (30%)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentStudent.research.map((project, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium">{project.name}</span>
                              <div className="text-sm text-gray-600 mt-1">
                                {project.type} · {project.role}
                              </div>
                            </div>
                            <span className="text-lg font-bold">{project.score}分</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">小计:</span>
                          <span className="text-lg font-bold">{researchScore}/30 分</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-orange-500" />
                        创新能力 (30%) - 专家评分
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">创新思维:</label>
                          <span className="text-sm font-bold">{currentScore.creativeThinking}/30</span>
                        </div>
                        <Slider
                          value={[currentScore.creativeThinking]}
                          onValueChange={(value) => handleScoreChange('creativeThinking', value)}
                          max={30}
                          step={1}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">实践能力:</label>
                          <span className="text-sm font-bold">{currentScore.practicalAbility}/30</span>
                        </div>
                        <Slider
                          value={[currentScore.practicalAbility]}
                          onValueChange={(value) => handleScoreChange('practicalAbility', value)}
                          max={30}
                          step={1}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-medium">发展潜力:</label>
                          <span className="text-sm font-bold">{currentScore.developmentPotential}/30</span>
                        </div>
                        <Slider
                          value={[currentScore.developmentPotential]}
                          onValueChange={(value) => handleScoreChange('developmentPotential', value)}
                          max={30}
                          step={1}
                        />
                      </div>

                      <div>
                        <label className="font-medium block mb-2">专家评语:</label>
                        <Textarea
                          value={currentScore.comment}
                          onChange={(e) => setCurrentScore({...currentScore, comment: e.target.value})}
                          placeholder="请输入对该学生创新能力的评价..."
                          rows={4}
                        />
                      </div>

                      <Button onClick={handleSubmitReview} className="w-full">
                        提交评审
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  {studentReviews.map((review, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                {activeExperts.find(e => e.id === review.expertId)?.avatar || 'E'}
                              </div>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {activeExperts.find(e => e.id === review.expertId)?.name || '专家'}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {review.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={review.status === 'submitted' ? 'default' : 'secondary'}>
                            {review.status === 'submitted' ? '已提交' : '草稿'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">创新思维</p>
                            <p className="font-bold">{review.creativeThinking}/30</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">实践能力</p>
                            <p className="font-bold">{review.practicalAbility}/30</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">发展潜力</p>
                            <p className="font-bold">{review.developmentPotential}/30</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="merge">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitMerge className="w-5 h-5" />
                        评审结果合并
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {studentReviews.length === 0 ? (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            暂无评审结果，请等待专家完成评审
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">创新思维平均分</p>
                              <p className="text-2xl font-bold">
                                {(studentReviews.reduce((sum, r) => sum + r.creativeThinking, 0) / studentReviews.length).toFixed(1)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">实践能力平均分</p>
                              <p className="text-2xl font-bold">
                                {(studentReviews.reduce((sum, r) => sum + r.practicalAbility, 0) / studentReviews.length).toFixed(1)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">发展潜力平均分</p>
                              <p className="text-2xl font-bold">
                                {(studentReviews.reduce((sum, r) => sum + r.developmentPotential, 0) / studentReviews.length).toFixed(1)}
                              </p>
                            </div>
                          </div>

                          {conflicts.length > 0 && (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                检测到评分冲突，请专家协商解决
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-lg font-medium">最终得分:</span>
                              <span className="text-2xl font-bold text-blue-600">
                                {getMergedScore()?.toFixed(1)}/100
                              </span>
                            </div>
                            <Button className="w-full">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              确认合并结果
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    质量监控
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">评审完成度</span>
                      <span className="font-medium">{studentReviews.length}/{currentStudent.assignedExperts.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">评分一致性</span>
                      <Badge variant={conflicts.length === 0 ? 'default' : 'destructive'}>
                        {conflicts.length === 0 ? '正常' : `${conflicts.length}个冲突`}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">平均评审时长</span>
                      <span className="font-medium">15分钟</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    专家讨论
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64 mb-4">
                    <div className="space-y-3">
                      {discussions.map(discussion => (
                        <div key={discussion.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{discussion.expertName}</span>
                            <span className="text-xs text-gray-500">
                              {discussion.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {discussion.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Textarea
                      value={discussionInput}
                      onChange={(e) => setDiscussionInput(e.target.value)}
                      placeholder="输入讨论内容..."
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={handleSendDiscussion} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    在线专家
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activeExperts.map(expert => (
                      <div key={expert.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-sm">
                              {expert.avatar}
                            </div>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{expert.name}</p>
                            {expert.currentReview && (
                              <p className="text-xs text-gray-600">正在评审: {expert.currentReview}</p>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant={expert.status === 'online' ? 'default' : 
                                  expert.status === 'reviewing' ? 'secondary' : 'outline'}
                        >
                          {expert.status === 'online' ? '在线' :
                           expert.status === 'reviewing' ? '评审中' : '离线'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              评分冲突检测
            </DialogTitle>
            <DialogDescription>
              检测到以下维度存在较大评分差异，请专家协商解决
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {conflicts.map((conflict, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2">{conflict.dimension}</h4>
                <div className="space-y-1">
                  {conflict.experts.map((expert, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{expert}:</span>
                      <span className="font-medium">{conflict.scores[i]}分</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  差值: {Math.max(...conflict.scores) - Math.min(...conflict.scores)}分
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={() => setShowConflictDialog(false)} className="flex-1">
                开始协商
              </Button>
              <Button variant="outline" onClick={() => setShowConflictDialog(false)}>
                稍后处理
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}