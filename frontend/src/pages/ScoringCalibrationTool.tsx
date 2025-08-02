import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Target,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Info,
  Download,
  PlayCircle,
  FileText,
  Award,
  RefreshCw
} from 'lucide-react'

interface ExpertScore {
  expertId: string
  expertName: string
  dimension: string
  score: number
  deviation: number
}

interface StandardSample {
  id: string
  studentName: string
  description: string
  expectedScore: number
  scoreRange: { min: number; max: number }
  keyPoints: string[]
}

interface CalibrationTest {
  id: string
  question: string
  sampleData: any
  options: { value: number; label: string }[]
  correctAnswer: number
  explanation: string
}

interface CalibrationResult {
  expertId: string
  expertName: string
  testScore: number
  accuracy: number
  consistency: number
  suggestions: string[]
}

export default function ScoringCalibrationTool() {
  const [selectedDimension, setSelectedDimension] = useState('innovation')
  const [selectedExpert, setSelectedExpert] = useState('all')
  const [currentTestIndex, setCurrentTestIndex] = useState(0)
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)

  // Mock data
  const expertScores: ExpertScore[] = [
    { expertId: '1', expertName: '张教授', dimension: '创新思维', score: 85, deviation: 5 },
    { expertId: '2', expertName: '李教授', dimension: '创新思维', score: 78, deviation: -2 },
    { expertId: '3', expertName: '王教授', dimension: '创新思维', score: 92, deviation: 12 },
    { expertId: '1', expertName: '张教授', dimension: '实践能力', score: 80, deviation: 3 },
    { expertId: '2', expertName: '李教授', dimension: '实践能力', score: 75, deviation: -2 },
    { expertId: '3', expertName: '王教授', dimension: '实践能力', score: 77, deviation: 0 }
  ]

  const standardSamples: StandardSample[] = [
    {
      id: '1',
      studentName: '标准案例A - 优秀',
      description: '该学生在多个国家级竞赛中获得一等奖，主持国家级科研项目，发表高质量论文。',
      expectedScore: 90,
      scoreRange: { min: 85, max: 95 },
      keyPoints: [
        '国家级竞赛一等奖（2项）',
        '主持国家级大创项目',
        '发表SCI论文（第一作者）',
        '创新思维活跃，实践能力强'
      ]
    },
    {
      id: '2',
      studentName: '标准案例B - 良好',
      description: '该学生在省级竞赛中获奖，参与科研项目，有一定的创新成果。',
      expectedScore: 75,
      scoreRange: { min: 70, max: 80 },
      keyPoints: [
        '省级竞赛二等奖',
        '参与省级科研项目',
        '校级创新成果',
        '具有较好的学习能力'
      ]
    },
    {
      id: '3',
      studentName: '标准案例C - 中等',
      description: '该学生参与一些竞赛和项目，但成果一般。',
      expectedScore: 60,
      scoreRange: { min: 55, max: 65 },
      keyPoints: [
        '参加校级竞赛',
        '课程项目完成良好',
        '有基本的创新意识',
        '需要更多实践锻炼'
      ]
    }
  ]

  const calibrationTests: CalibrationTest[] = [
    {
      id: '1',
      question: '基于以下学生信息，请评估其创新思维得分：',
      sampleData: {
        name: '测试学生A',
        achievements: [
          '全国大学生数学建模竞赛国家一等奖',
          '中国"互联网+"大学生创新创业大赛省级金奖',
          '主持校级创新项目1项',
          '申请实用新型专利1项'
        ]
      },
      options: [
        { value: 60, label: '60-65分（中等）' },
        { value: 75, label: '70-80分（良好）' },
        { value: 85, label: '80-90分（优秀）' },
        { value: 95, label: '90-100分（卓越）' }
      ],
      correctAnswer: 85,
      explanation: '该学生有国家级和省级重要竞赛获奖，具有专利申请，创新能力突出，应评80-90分。'
    },
    {
      id: '2',
      question: '评估该学生的实践能力：',
      sampleData: {
        name: '测试学生B',
        projects: [
          '参与导师横向课题，负责数据分析模块',
          '独立完成课程设计3项，均获优秀',
          '暑期企业实习，获得优秀实习生称号',
          '参与开源项目贡献代码'
        ]
      },
      options: [
        { value: 65, label: '60-70分（合格）' },
        { value: 75, label: '70-80分（良好）' },
        { value: 85, label: '80-90分（优秀）' },
        { value: 95, label: '90-100分（卓越）' }
      ],
      correctAnswer: 75,
      explanation: '该学生实践经验丰富但缺乏突出成果，实践能力良好，应评70-80分。'
    }
  ]

  const calibrationResults: CalibrationResult[] = [
    {
      expertId: '1',
      expertName: '张教授',
      testScore: 85,
      accuracy: 92,
      consistency: 88,
      suggestions: ['评分略偏高，建议参考标准案例', '注意区分良好与优秀的界限']
    },
    {
      expertId: '2',
      expertName: '李教授',
      testScore: 78,
      accuracy: 86,
      consistency: 90,
      suggestions: ['评分标准把握较好', '可适当提高对创新成果的认可度']
    },
    {
      expertId: '3',
      expertName: '王教授',
      testScore: 72,
      accuracy: 75,
      consistency: 70,
      suggestions: ['评分波动较大，需加强标准理解', '建议重新学习评分指南']
    }
  ]

  const currentTest = calibrationTests[currentTestIndex]

  const handleTestAnswer = (value: number) => {
    setTestAnswers({
      ...testAnswers,
      [currentTest.id]: value
    })
  }

  const handleNextTest = () => {
    if (currentTestIndex < calibrationTests.length - 1) {
      setCurrentTestIndex(currentTestIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const getDeviationColor = (deviation: number) => {
    if (Math.abs(deviation) <= 5) return 'text-green-600'
    if (Math.abs(deviation) <= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">评分校准工具</h1>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              导出校准报告
            </Button>
          </div>

          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="comparison">标准对比</TabsTrigger>
              <TabsTrigger value="analysis">差异分析</TabsTrigger>
              <TabsTrigger value="samples">标准样本</TabsTrigger>
              <TabsTrigger value="test">校准测试</TabsTrigger>
              <TabsTrigger value="training">培训材料</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    评分标准对比
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-4">
                    <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="选择评分维度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="innovation">创新思维</SelectItem>
                        <SelectItem value="practice">实践能力</SelectItem>
                        <SelectItem value="potential">发展潜力</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">平均分</h4>
                          <p className="text-2xl font-bold">81.7</p>
                          <p className="text-sm text-gray-600">所有专家平均</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">标准差</h4>
                          <p className="text-2xl font-bold">7.2</p>
                          <p className="text-sm text-gray-600">评分离散程度</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">一致性</h4>
                          <p className="text-2xl font-bold text-green-600">85%</p>
                          <p className="text-sm text-gray-600">专家间一致性</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      {expertScores
                        .filter(s => s.dimension === '创新思维')
                        .map((score, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                  {score.expertName[0]}
                                </div>
                              </Avatar>
                              <div>
                                <p className="font-medium">{score.expertName}</p>
                                <p className="text-sm text-gray-600">{score.dimension}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">{score.score}分</p>
                              <p className={`text-sm ${getDeviationColor(score.deviation)}`}>
                                {score.deviation > 0 ? '+' : ''}{score.deviation}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    专家评分差异分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        检测到3位专家在"创新思维"维度存在较大差异（&gt;10分），建议进行评分校准。
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">各维度差异分析</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">创新思维</span>
                              <span className="text-sm font-medium text-red-600">高差异</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">实践能力</span>
                              <span className="text-sm font-medium text-green-600">低差异</span>
                            </div>
                            <Progress value={25} className="h-2" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm">发展潜力</span>
                              <span className="text-sm font-medium text-yellow-600">中等差异</span>
                            </div>
                            <Progress value={55} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">专家评分模式</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">张教授</span>
                            <Badge>偏宽松</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">李教授</span>
                            <Badge variant="secondary">标准</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">王教授</span>
                            <Badge variant="destructive">偏严格</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">校准建议</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span className="text-sm">组织专家讨论会，明确创新思维评分标准</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span className="text-sm">提供更多标准案例供专家参考</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                          <span className="text-sm">建议王教授适当提高评分，张教授适当降低评分</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="samples" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    标准评分样本
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {standardSamples.map((sample) => (
                      <Card key={sample.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">{sample.studentName}</h4>
                              <p className="text-sm text-gray-600 mt-1">{sample.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-blue-600">{sample.expectedScore}分</p>
                              <p className="text-xs text-gray-500">
                                建议范围: {sample.scoreRange.min}-{sample.scoreRange.max}分
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">关键评分点：</h5>
                            <ul className="space-y-1">
                              {sample.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                  <Award className="w-3 h-3 text-yellow-500" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test" className="space-y-6">
              {!showResults ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5" />
                      评分校准测试
                    </CardTitle>
                    <div className="mt-2">
                      <Progress value={(currentTestIndex + 1) / calibrationTests.length * 100} />
                      <p className="text-sm text-gray-600 mt-1">
                        问题 {currentTestIndex + 1} / {calibrationTests.length}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">{currentTest.question}</h4>
                        
                        <Card className="mb-4">
                          <CardContent className="p-4">
                            <h5 className="font-medium mb-2">{currentTest.sampleData.name}</h5>
                            {currentTest.sampleData.achievements && (
                              <ul className="space-y-1">
                                {currentTest.sampleData.achievements.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {currentTest.sampleData.projects && (
                              <ul className="space-y-1">
                                {currentTest.sampleData.projects.map((item: string, index: number) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </CardContent>
                        </Card>

                        <RadioGroup
                          value={testAnswers[currentTest.id]?.toString()}
                          onValueChange={(value) => handleTestAnswer(parseInt(value))}
                        >
                          {currentTest.options.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2 mb-2">
                              <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                              <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentTestIndex(Math.max(0, currentTestIndex - 1))}
                          disabled={currentTestIndex === 0}
                        >
                          上一题
                        </Button>
                        <Button
                          onClick={handleNextTest}
                          disabled={!testAnswers[currentTest.id]}
                        >
                          {currentTestIndex === calibrationTests.length - 1 ? '提交测试' : '下一题'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      校准测试结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          恭喜！您的评分准确率为 85%，已达到校准标准。
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-1">准确率</p>
                            <p className="text-2xl font-bold text-green-600">85%</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-1">一致性</p>
                            <p className="text-2xl font-bold text-blue-600">88%</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <p className="text-sm text-gray-600 mb-1">总得分</p>
                            <p className="text-2xl font-bold">82分</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">详细反馈</h4>
                        {calibrationTests.map((test, index) => (
                          <div key={test.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">问题 {index + 1}</span>
                              {testAnswers[test.id] === test.correctAnswer ? (
                                <Badge className="bg-green-100 text-green-700">正确</Badge>
                              ) : (
                                <Badge variant="destructive">错误</Badge>
                              )}
                            </div>
                            {testAnswers[test.id] !== test.correctAnswer && (
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">解释：</span> {test.explanation}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button onClick={() => {
                          setShowResults(false)
                          setCurrentTestIndex(0)
                          setTestAnswers({})
                        }}>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          重新测试
                        </Button>
                        <Button variant="outline">
                          查看培训材料
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="training" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      评分指南
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        综合素质评价评分标准.pdf
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        创新能力评分细则.pdf
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        实践能力认定办法.pdf
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="w-5 h-5" />
                      培训视频
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="font-medium">评分标准解读</p>
                            <p className="text-sm text-gray-600">时长: 15分钟</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="font-medium">典型案例分析</p>
                            <p className="text-sm text-gray-600">时长: 20分钟</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      常见问题
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Q: 如何把握优秀与良好的界限？</h4>
                        <p className="text-sm text-gray-600">
                          A: 优秀（80-90分）需要有省级以上重要竞赛获奖或主持科研项目；良好（70-80分）一般为校级获奖或参与项目。
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Q: 创新能力如何量化评分？</h4>
                        <p className="text-sm text-gray-600">
                          A: 主要看创新成果的层次、数量和质量，如专利、论文、竞赛获奖等具体成果。
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Q: 评分时是否考虑学生年级？</h4>
                        <p className="text-sm text-gray-600">
                          A: 是的，低年级学生的评分标准会适当放宽，重点看发展潜力。
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Add missing Avatar component
const Avatar = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full ${className}`}>
    {children}
  </div>
)