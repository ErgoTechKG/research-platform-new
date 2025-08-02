import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Heart,
  Users,
  Award,
  BookOpen,
  Handshake,
  Shield,
  Save,
  Send,
  History,
  Download,
  User,
  CheckCircle,
  Star,
  AlertCircle,
  Calendar,
  FileText
} from 'lucide-react'

interface EvaluationItem {
  id: string
  name: string
  description: string
  score: number
  icon: React.ReactNode
}

interface Student {
  id: string
  name: string
  studentId: string
  class: string
  photo?: string
}

interface HistoricalEvaluation {
  id: string
  date: string
  evaluator: string
  totalScore: number
  status: 'submitted' | 'draft'
  comments: string
}

export default function MoralCharacterEvaluationInterface() {
  const [selectedStudent, setSelectedStudent] = useState<string>('1')
  const [comments, setComments] = useState('')
  const [evaluationStatus, setEvaluationStatus] = useState<'draft' | 'submitted'>('draft')
  const [showSuccess, setShowSuccess] = useState(false)

  // Mock data
  const students: Student[] = [
    { id: '1', name: '李小红', studentId: 'U202100001', class: '机械2021级' },
    { id: '2', name: '张明', studentId: 'U202100002', class: '机械2021级' },
    { id: '3', name: '王芳', studentId: 'U202100003', class: '机械2021级' },
    { id: '4', name: '刘强', studentId: 'U202100004', class: '机械2021级' },
    { id: '5', name: '陈雪', studentId: 'U202100005', class: '机械2021级' }
  ]

  const [evaluationItems, setEvaluationItems] = useState<EvaluationItem[]>([
    {
      id: '1',
      name: '社会责任感',
      description: '关心社会发展，积极参与社会公益活动，有强烈的社会责任意识',
      score: 9,
      icon: <Heart className="w-5 h-5 text-red-500" />
    },
    {
      id: '2',
      name: '团队协作精神',
      description: '善于与他人合作，在团队中发挥积极作用，有良好的沟通能力',
      score: 8,
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    {
      id: '3',
      name: '学术诚信',
      description: '恪守学术道德，诚实守信，不弄虚作假，尊重知识产权',
      score: 10,
      icon: <Shield className="w-5 h-5 text-green-500" />
    },
    {
      id: '4',
      name: '公益活动参与',
      description: '积极参加志愿服务、社会实践等公益活动，有奉献精神',
      score: 7,
      icon: <Handshake className="w-5 h-5 text-purple-500" />
    },
    {
      id: '5',
      name: '集体荣誉感',
      description: '关心集体，维护集体利益，积极为集体争光，有强烈的归属感',
      score: 9,
      icon: <Award className="w-5 h-5 text-yellow-500" />
    }
  ])

  const historicalEvaluations: HistoricalEvaluation[] = [
    {
      id: '1',
      date: '2024-01-15',
      evaluator: '张教授',
      totalScore: 85,
      status: 'submitted',
      comments: '该生品德优良，表现突出'
    },
    {
      id: '2',
      date: '2023-12-20',
      evaluator: '李教授',
      totalScore: 82,
      status: 'submitted',
      comments: '有进步空间，建议多参与集体活动'
    },
    {
      id: '3',
      date: '2023-11-10',
      evaluator: '王教授',
      totalScore: 88,
      status: 'submitted',
      comments: '品德表现优秀，值得表扬'
    }
  ]

  const currentStudent = students.find(s => s.id === selectedStudent)

  const handleScoreChange = (itemId: string, value: number[]) => {
    setEvaluationItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, score: value[0] } : item
      )
    )
  }

  const getTotalScore = () => {
    const sum = evaluationItems.reduce((acc, item) => acc + item.score, 0)
    return Math.round((sum / evaluationItems.length) * 10)
  }

  const handleSaveDraft = () => {
    setEvaluationStatus('draft')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleSubmit = () => {
    setEvaluationStatus('submitted')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600'
    if (score >= 7) return 'text-blue-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { text: '优秀', color: 'bg-green-100 text-green-700' }
    if (score >= 80) return { text: '良好', color: 'bg-blue-100 text-blue-700' }
    if (score >= 70) return { text: '中等', color: 'bg-yellow-100 text-yellow-700' }
    if (score >= 60) return { text: '合格', color: 'bg-orange-100 text-orange-700' }
    return { text: '待改进', color: 'bg-red-100 text-red-700' }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">思想品德评价界面</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">导师：张教授</span>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                评价历史
              </Button>
            </div>
          </div>

          {showSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {evaluationStatus === 'submitted' ? '评价已成功提交！' : '草稿已保存！'}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="evaluate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evaluate">进行评价</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="statistics">统计分析</TabsTrigger>
            </TabsList>

            <TabsContent value="evaluate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>学生信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                        <SelectTrigger className="w-64">
                          <SelectValue placeholder="选择学生" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} - {student.studentId}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {currentStudent && (
                        <div className="mt-2 text-sm text-gray-600">
                          <p>学号：{currentStudent.studentId}</p>
                          <p>班级：{currentStudent.class}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>思想品德评价表</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">总分：</span>
                      <span className={`text-2xl font-bold ${getScoreColor(getTotalScore())}`}>
                        {getTotalScore()}/100
                      </span>
                      <Badge className={getScoreLevel(getTotalScore()).color}>
                        {getScoreLevel(getTotalScore()).text}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {evaluationItems.map((item) => (
                      <div key={item.id} className="space-y-3">
                        <div className="flex items-start gap-3">
                          {item.icon}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                                {item.score}分
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex items-center gap-4">
                              <Slider
                                value={[item.score]}
                                onValueChange={(value) => handleScoreChange(item.id, value)}
                                max={10}
                                step={1}
                                className="flex-1"
                              />
                              <div className="flex gap-1">
                                {[...Array(10)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < item.score ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Label htmlFor="comments" className="text-base font-medium mb-2 block">
                      综合评语
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="请输入对该生思想品德的综合评价..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={4}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      请客观、公正地评价学生的思想品德表现，提出改进建议
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      <p>评价时间：{new Date().toLocaleDateString()}</p>
                      <p>评价状态：
                        <Badge variant={evaluationStatus === 'submitted' ? 'default' : 'secondary'}>
                          {evaluationStatus === 'submitted' ? '已提交' : '草稿'}
                        </Badge>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleSaveDraft}>
                        <Save className="w-4 h-4 mr-2" />
                        保存草稿
                      </Button>
                      <Button onClick={handleSubmit}>
                        <Send className="w-4 h-4 mr-2" />
                        提交评价
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>历史评价记录</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      导出记录
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {historicalEvaluations.map((evaluation) => (
                      <div key={evaluation.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{evaluation.date}</span>
                              <Badge variant={evaluation.status === 'submitted' ? 'default' : 'secondary'}>
                                {evaluation.status === 'submitted' ? '已提交' : '草稿'}
                              </Badge>
                            </div>
                            <p className="font-medium">评价人：{evaluation.evaluator}</p>
                            <p className="text-sm text-gray-600 mt-1">{evaluation.comments}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${getScoreColor(evaluation.totalScore)}`}>
                              {evaluation.totalScore}分
                            </p>
                            <Badge className={`mt-1 ${getScoreLevel(evaluation.totalScore).color}`}>
                              {getScoreLevel(evaluation.totalScore).text}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>维度分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {evaluationItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.icon}
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={item.score * 10} className="w-24" />
                            <span className="text-sm font-medium w-12 text-right">
                              {item.score * 10}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>评价趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <div className="text-4xl font-bold text-blue-600 mb-2">85.3</div>
                        <p className="text-sm text-gray-600">平均得分</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="font-medium">最高分</p>
                          <p className="text-lg text-green-600">88</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="font-medium">最低分</p>
                          <p className="text-lg text-red-600">82</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>评价建议</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <Star className="h-4 w-4" />
                      <AlertDescription>
                        该生整体表现优秀，特别是在学术诚信和社会责任感方面表现突出
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        建议加强公益活动参与，提升社会实践经验
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}