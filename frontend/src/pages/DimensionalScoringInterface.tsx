import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Trophy,
  Lightbulb,
  FlaskConical,
  AlertCircle,
  Save,
  CheckCircle
} from 'lucide-react'

interface Student {
  id: string
  name: string
  competitions: Competition[]
  research: ResearchProject[]
  innovationScores?: InnovationScores
  comments?: string
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

interface InnovationScores {
  creativeThinking: number
  practicalAbility: number
  developmentPotential: number
}

export default function DimensionalScoringInterface() {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0)
  const [students] = useState<Student[]>([
    {
      id: '1',
      name: '王小明',
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
      competitions: [
        { name: '全国大学生机械创新设计大赛', level: '国家级', award: '二等奖', score: 15 },
        { name: '全国大学生数学竞赛', level: '省级', award: '一等奖', score: 10 }
      ],
      research: [
        { name: '新能源汽车电池管理系统研究', role: '参与者', type: '省级科研项目', score: 15 }
      ]
    }
  ])

  const [scores, setScores] = useState<Record<string, InnovationScores>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({})

  const currentStudent = students[currentStudentIndex]
  const currentScores = scores[currentStudent.id] || {
    creativeThinking: 25,
    practicalAbility: 22,
    developmentPotential: 28
  }
  const currentComment = comments[currentStudent.id] || '思维活跃，实践能力较强，具有良好的创新潜力。在多个竞赛中表现优异，科研项目执行能力突出。'

  const competitionScore = Math.min(
    currentStudent.competitions.reduce((sum, c) => sum + c.score, 0),
    40
  )
  const researchScore = Math.min(
    currentStudent.research.reduce((sum, r) => sum + r.score, 0),
    30
  )
  const innovationScore = (
    currentScores.creativeThinking + 
    currentScores.practicalAbility + 
    currentScores.developmentPotential
  ) / 3

  const totalScore = competitionScore + researchScore + innovationScore

  const handleScoreChange = (field: keyof InnovationScores, value: number[]) => {
    setScores({
      ...scores,
      [currentStudent.id]: {
        ...currentScores,
        [field]: value[0]
      }
    })
    setSavedStatus({
      ...savedStatus,
      [currentStudent.id]: false
    })
  }

  const handleCommentChange = (value: string) => {
    setComments({
      ...comments,
      [currentStudent.id]: value
    })
    setSavedStatus({
      ...savedStatus,
      [currentStudent.id]: false
    })
  }

  const handleSave = (isConfirm: boolean) => {
    setSavedStatus({
      ...savedStatus,
      [currentStudent.id]: true
    })
    
    if (isConfirm) {
      alert(`已确认 ${currentStudent.name} 的评分：${totalScore.toFixed(1)} 分`)
    } else {
      alert(`已暂存 ${currentStudent.name} 的评分`)
    }
  }

  const handleStudentNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1)
    } else if (direction === 'next' && currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1)
    }
  }

  const evaluatedCount = Object.keys(savedStatus).filter(id => savedStatus[id]).length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">科技创新维度评审</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                已评: {evaluatedCount}/{students.length}
              </span>
              <Button variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-1" />
                评分指南
              </Button>
            </div>
          </div>

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium">当前学生:</span>
                  <span className="text-xl font-bold">{currentStudent.name}</span>
                  {savedStatus[currentStudent.id] && (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      已评分
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStudentNavigation('prev')}
                    disabled={currentStudentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    上一个
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStudentNavigation('next')}
                    disabled={currentStudentIndex === students.length - 1}
                  >
                    下一个
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
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
                      <div className="text-right">
                        <span className="text-lg font-bold">{comp.score}分</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">小计:</span>
                    <span className="text-lg font-bold">
                      {competitionScore}/40 分
                      {currentStudent.competitions.reduce((sum, c) => sum + c.score, 0) > 40 && (
                        <span className="text-sm text-gray-600 ml-2">(超出部分按40分计)</span>
                      )}
                    </span>
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
                      <div className="text-right">
                        <span className="text-lg font-bold">{project.score}分</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">小计:</span>
                    <span className="text-lg font-bold">
                      {researchScore}/30 分
                      {currentStudent.research.reduce((sum, r) => sum + r.score, 0) > 30 && (
                        <span className="text-sm text-gray-600 ml-2">(超出部分按30分计)</span>
                      )}
                    </span>
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
                    <span className="text-sm font-bold">{currentScores.creativeThinking}/30</span>
                  </div>
                  <Slider
                    value={[currentScores.creativeThinking]}
                    onValueChange={(value) => handleScoreChange('creativeThinking', value)}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">实践能力:</label>
                    <span className="text-sm font-bold">{currentScores.practicalAbility}/30</span>
                  </div>
                  <Slider
                    value={[currentScores.practicalAbility]}
                    onValueChange={(value) => handleScoreChange('practicalAbility', value)}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-medium">发展潜力:</label>
                    <span className="text-sm font-bold">{currentScores.developmentPotential}/30</span>
                  </div>
                  <Slider
                    value={[currentScores.developmentPotential]}
                    onValueChange={(value) => handleScoreChange('developmentPotential', value)}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="font-medium block mb-2">专家评语:</label>
                  <Textarea
                    value={currentComment}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    placeholder="请输入对该学生创新能力的评价..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-lg font-medium">本维度得分:</span>
                    <span className="text-2xl font-bold text-blue-600 ml-3">
                      {totalScore.toFixed(1)}/100
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => handleSave(false)}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      暂存
                    </Button>
                    <Button 
                      onClick={() => handleSave(true)}
                      disabled={innovationScore === 0}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      确认评分
                    </Button>
                  </div>
                </div>

                {innovationScore === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      请完成创新能力专家评分后再确认提交
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}