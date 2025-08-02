import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  RefreshCw,
  FileText,
  PieChart,
  UserCheck,
  AlertCircle,
  Brain,
  Target,
  Star,
  Award,
  Calendar,
  Filter,
  Settings,
  Eye
} from 'lucide-react'

interface LearningBehaviorData {
  studentId: string
  studentName: string
  loginFrequency: number
  studyTime: number
  completionRate: number
  interactionScore: number
  behaviorPattern: 'active' | 'moderate' | 'passive'
  trend: 'improving' | 'stable' | 'declining'
}

interface GradePrediction {
  studentId: string
  studentName: string
  currentGrade: number
  predictedGrade: number
  confidence: number
  factors: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

interface CourseQualityMetric {
  courseId: string
  courseName: string
  satisfactionScore: number
  difficultyRating: number
  engagementLevel: number
  completionRate: number
  feedbackCount: number
  improvementSuggestions: string[]
}

interface MentorEffectiveness {
  mentorId: string
  mentorName: string
  studentCount: number
  averageGrade: number
  satisfactionRating: number
  responseTime: number
  guidanceQuality: number
  improvementRate: number
  specialties: string[]
}

interface AnalysisInsight {
  id: string
  type: 'behavior' | 'grade' | 'course' | 'mentor'
  title: string
  description: string
  severity: 'info' | 'warning' | 'critical'
  actionItems: string[]
  timestamp: string
}

export default function DataAnalysisCenter() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last_month')
  const [selectedDimension, setSelectedDimension] = useState('all')
  const [alertThreshold, setAlertThreshold] = useState([70])
  const [autoAnalysis, setAutoAnalysis] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Mock data for learning behavior analysis
  const learningBehaviorData: LearningBehaviorData[] = [
    { studentId: '1', studentName: '张三', loginFrequency: 85, studyTime: 240, completionRate: 92, interactionScore: 88, behaviorPattern: 'active', trend: 'improving' },
    { studentId: '2', studentName: '李四', loginFrequency: 65, studyTime: 180, completionRate: 75, interactionScore: 70, behaviorPattern: 'moderate', trend: 'stable' },
    { studentId: '3', studentName: '王五', loginFrequency: 45, studyTime: 120, completionRate: 58, interactionScore: 52, behaviorPattern: 'passive', trend: 'declining' },
    { studentId: '4', studentName: '赵六', loginFrequency: 90, studyTime: 280, completionRate: 95, interactionScore: 92, behaviorPattern: 'active', trend: 'improving' },
    { studentId: '5', studentName: '刘七', loginFrequency: 55, studyTime: 150, completionRate: 68, interactionScore: 62, behaviorPattern: 'moderate', trend: 'stable' }
  ]

  // Mock data for grade predictions
  const gradePredictions: GradePrediction[] = [
    { studentId: '1', studentName: '张三', currentGrade: 85, predictedGrade: 88, confidence: 92, factors: ['学习时间增长', '互动积极'], riskLevel: 'low' },
    { studentId: '2', studentName: '李四', currentGrade: 75, predictedGrade: 73, confidence: 78, factors: ['出勤率下降', '作业延迟'], riskLevel: 'medium' },
    { studentId: '3', studentName: '王五', currentGrade: 68, predictedGrade: 62, confidence: 85, factors: ['学习时间不足', '缺乏互动'], riskLevel: 'high' },
    { studentId: '4', studentName: '赵六', currentGrade: 90, predictedGrade: 93, confidence: 95, factors: ['表现优异', '持续进步'], riskLevel: 'low' },
    { studentId: '5', studentName: '刘七', currentGrade: 72, predictedGrade: 74, confidence: 82, factors: ['稳定表现', '适度参与'], riskLevel: 'medium' }
  ]

  // Mock data for course quality assessment
  const courseQualityMetrics: CourseQualityMetric[] = [
    { courseId: '1', courseName: '机器学习基础', satisfactionScore: 4.5, difficultyRating: 3.8, engagementLevel: 85, completionRate: 92, feedbackCount: 48, improvementSuggestions: ['增加实践案例', '优化作业难度'] },
    { courseId: '2', courseName: '数据结构与算法', satisfactionScore: 4.2, difficultyRating: 4.2, engagementLevel: 78, completionRate: 85, feedbackCount: 52, improvementSuggestions: ['加强基础讲解', '增加辅导时间'] },
    { courseId: '3', courseName: 'Web开发实践', satisfactionScore: 4.7, difficultyRating: 3.5, engagementLevel: 92, completionRate: 95, feedbackCount: 45, improvementSuggestions: ['更新技术栈', '增加项目复杂度'] },
    { courseId: '4', courseName: '软件工程导论', satisfactionScore: 3.9, difficultyRating: 3.2, engagementLevel: 72, completionRate: 88, feedbackCount: 38, improvementSuggestions: ['增强案例研究', '改进教学方法'] }
  ]

  // Mock data for mentor effectiveness
  const mentorEffectiveness: MentorEffectiveness[] = [
    { mentorId: '1', mentorName: '张教授', studentCount: 25, averageGrade: 85.2, satisfactionRating: 4.6, responseTime: 2.3, guidanceQuality: 4.8, improvementRate: 15.5, specialties: ['机器学习', '深度学习'] },
    { mentorId: '2', mentorName: '李教授', studentCount: 22, averageGrade: 82.8, satisfactionRating: 4.4, responseTime: 3.1, guidanceQuality: 4.5, improvementRate: 12.8, specialties: ['数据分析', '统计学'] },
    { mentorId: '3', mentorName: '王教授', studentCount: 28, averageGrade: 88.5, satisfactionRating: 4.8, responseTime: 1.8, guidanceQuality: 4.9, improvementRate: 18.2, specialties: ['Web开发', '前端技术'] },
    { mentorId: '4', mentorName: '陈教授', studentCount: 20, averageGrade: 80.5, satisfactionRating: 4.2, responseTime: 2.8, guidanceQuality: 4.3, improvementRate: 10.5, specialties: ['软件工程', '项目管理'] }
  ]

  // Mock data for analysis insights
  const analysisInsights: AnalysisInsight[] = [
    { id: '1', type: 'behavior', title: '学习行为异常检测', description: '发现3名学生学习时间显著下降，建议及时干预', severity: 'warning', actionItems: ['联系相关学生', '调整学习计划', '增加辅导支持'], timestamp: '2024-01-15 10:30' },
    { id: '2', type: 'grade', title: '成绩预测风险预警', description: '5名学生存在成绩下滑风险，预测准确率85%', severity: 'critical', actionItems: ['制定提升计划', '加强个性化指导', '增加练习机会'], timestamp: '2024-01-15 09:15' },
    { id: '3', type: 'course', title: '课程质量分析报告', description: '《数据结构与算法》课程满意度较低，需要改进教学方法', severity: 'warning', actionItems: ['优化课程内容', '增加实践环节', '收集详细反馈'], timestamp: '2024-01-15 08:45' },
    { id: '4', type: 'mentor', title: '导师效能评估结果', description: '王教授指导效果突出，建议分享优秀经验', severity: 'info', actionItems: ['组织经验分享', '制定标准流程', '推广最佳实践'], timestamp: '2024-01-15 08:00' }
  ]

  // Auto refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const getBehaviorColor = (pattern: string) => {
    switch (pattern) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'passive': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'border-blue-200 bg-blue-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'critical': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const generateReport = () => {
    // Mock report generation
    alert('正在生成分析报告...')
  }

  const exportData = () => {
    // Mock data export
    alert('正在导出数据...')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">数据分析中心</h1>
              <p className="text-gray-600 mt-1">深度分析学习行为、预测成绩趋势、评估课程质量和导师效能</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  最后更新: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={generateReport}>
                <FileText className="w-4 h-4 mr-2" />
                生成报告
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
              <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新分析
              </Button>
            </div>
          </div>

          {/* Control Panel */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                分析控制面板
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>时间范围</Label>
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_week">最近一周</SelectItem>
                      <SelectItem value="last_month">最近一月</SelectItem>
                      <SelectItem value="last_quarter">最近一季度</SelectItem>
                      <SelectItem value="last_year">最近一年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>分析维度</Label>
                  <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部维度</SelectItem>
                      <SelectItem value="behavior">学习行为</SelectItem>
                      <SelectItem value="grade">成绩趋势</SelectItem>
                      <SelectItem value="course">课程质量</SelectItem>
                      <SelectItem value="mentor">导师效能</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>预警阈值: {alertThreshold[0]}%</Label>
                  <Slider
                    value={alertThreshold}
                    onValueChange={setAlertThreshold}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Switch
                      checked={autoAnalysis}
                      onCheckedChange={setAutoAnalysis}
                    />
                    自动分析
                  </Label>
                  <p className="text-xs text-gray-500">启用实时数据分析</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">学习活跃度</p>
                    <p className="text-2xl font-bold">78.5%</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 5.2% 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">预测准确率</p>
                    <p className="text-2xl font-bold">85.3%</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">模型可信度高</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">课程满意度</p>
                    <p className="text-2xl font-bold">4.3/5</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 0.2 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">导师效能指数</p>
                    <p className="text-2xl font-bold">86.8</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 3.1 较上月</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="behavior" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="behavior">学习行为分析</TabsTrigger>
              <TabsTrigger value="prediction">成绩趋势预测</TabsTrigger>
              <TabsTrigger value="course">课程质量评估</TabsTrigger>
              <TabsTrigger value="mentor">导师效能分析</TabsTrigger>
              <TabsTrigger value="insights">智能洞察</TabsTrigger>
            </TabsList>

            <TabsContent value="behavior" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    学习行为深度分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">学生</th>
                          <th className="text-center py-3 px-4">登录频率</th>
                          <th className="text-center py-3 px-4">学习时长(分钟)</th>
                          <th className="text-center py-3 px-4">完成率</th>
                          <th className="text-center py-3 px-4">互动得分</th>
                          <th className="text-center py-3 px-4">行为模式</th>
                          <th className="text-center py-3 px-4">趋势</th>
                        </tr>
                      </thead>
                      <tbody>
                        {learningBehaviorData.map((student) => (
                          <tr key={student.studentId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{student.studentName}</td>
                            <td className="text-center py-3 px-4">{student.loginFrequency}%</td>
                            <td className="text-center py-3 px-4">{student.studyTime}</td>
                            <td className="text-center py-3 px-4">
                              <Progress value={student.completionRate} className="w-20 mx-auto" />
                              <span className="text-xs mt-1">{student.completionRate}%</span>
                            </td>
                            <td className="text-center py-3 px-4">{student.interactionScore}</td>
                            <td className="text-center py-3 px-4">
                              <Badge className={getBehaviorColor(student.behaviorPattern)}>
                                {student.behaviorPattern === 'active' ? '活跃' : 
                                 student.behaviorPattern === 'moderate' ? '中等' : '被动'}
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              {getTrendIcon(student.trend)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>行为模式分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>活跃型学生</span>
                        <div className="flex items-center gap-2">
                          <Progress value={40} className="w-32" />
                          <span className="text-sm">40%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>中等型学生</span>
                        <div className="flex items-center gap-2">
                          <Progress value={40} className="w-32" />
                          <span className="text-sm">40%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>被动型学生</span>
                        <div className="flex items-center gap-2">
                          <Progress value={20} className="w-32" />
                          <span className="text-sm">20%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>学习时长分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">194</div>
                        <div className="text-sm text-gray-600">平均学习时长(分钟)</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">280</div>
                          <div className="text-gray-600">最高</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">120</div>
                          <div className="text-gray-600">最低</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="prediction" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    成绩趋势精准预测
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">学生</th>
                          <th className="text-center py-3 px-4">当前成绩</th>
                          <th className="text-center py-3 px-4">预测成绩</th>
                          <th className="text-center py-3 px-4">预测变化</th>
                          <th className="text-center py-3 px-4">置信度</th>
                          <th className="text-center py-3 px-4">风险等级</th>
                          <th className="text-center py-3 px-4">关键因素</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradePredictions.map((prediction) => (
                          <tr key={prediction.studentId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{prediction.studentName}</td>
                            <td className="text-center py-3 px-4">{prediction.currentGrade}</td>
                            <td className="text-center py-3 px-4 font-semibold">{prediction.predictedGrade}</td>
                            <td className="text-center py-3 px-4">
                              <span className={
                                prediction.predictedGrade > prediction.currentGrade ? 'text-green-600' :
                                prediction.predictedGrade < prediction.currentGrade ? 'text-red-600' : 'text-gray-600'
                              }>
                                {prediction.predictedGrade > prediction.currentGrade ? '+' : ''}
                                {prediction.predictedGrade - prediction.currentGrade}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Progress value={prediction.confidence} className="w-20 mx-auto" />
                              <span className="text-xs mt-1">{prediction.confidence}%</span>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge className={getRiskColor(prediction.riskLevel)}>
                                {prediction.riskLevel === 'low' ? '低' : 
                                 prediction.riskLevel === 'medium' ? '中' : '高'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                {prediction.factors.map((factor, index) => (
                                  <span key={index} className="inline-block text-xs bg-gray-100 px-2 py-1 rounded mr-1">
                                    {factor}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>预测准确性</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">85.3%</div>
                      <div className="text-sm text-gray-600 mt-1">历史预测准确率</div>
                      <Progress value={85.3} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>风险分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">低风险</span>
                        <span className="text-sm font-semibold text-green-600">40%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">中风险</span>
                        <span className="text-sm font-semibold text-yellow-600">40%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">高风险</span>
                        <span className="text-sm font-semibold text-red-600">20%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>预测模型信息</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>模型类型</span>
                        <span className="font-medium">随机森林</span>
                      </div>
                      <div className="flex justify-between">
                        <span>特征数量</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>训练样本</span>
                        <span className="font-medium">2,850</span>
                      </div>
                      <div className="flex justify-between">
                        <span>最后更新</span>
                        <span className="font-medium">2024-01-15</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="course" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    课程质量多维评估
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courseQualityMetrics.map((course) => (
                      <Card key={course.courseId} className="border">
                        <CardHeader>
                          <CardTitle className="text-lg">{course.courseName}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-600">满意度</div>
                              <div className="text-xl font-bold">{course.satisfactionScore}/5</div>
                              <Progress value={course.satisfactionScore * 20} className="mt-1" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">难度评级</div>
                              <div className="text-xl font-bold">{course.difficultyRating}/5</div>
                              <Progress value={course.difficultyRating * 20} className="mt-1" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">参与度</div>
                              <div className="text-xl font-bold">{course.engagementLevel}%</div>
                              <Progress value={course.engagementLevel} className="mt-1" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">完成率</div>
                              <div className="text-xl font-bold">{course.completionRate}%</div>
                              <Progress value={course.completionRate} className="mt-1" />
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            反馈数量: {course.feedbackCount}
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2">改进建议</div>
                            <div className="space-y-1">
                              {course.improvementSuggestions.map((suggestion, index) => (
                                <span key={index} className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mr-1">
                                  {suggestion}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>整体满意度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.3/5</div>
                      <div className="text-sm text-gray-600 mt-1">平均满意度评分</div>
                      <Progress value={86} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>参与度分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">81.8%</div>
                      <div className="text-sm text-gray-600 mt-1">平均参与度</div>
                      <Progress value={81.8} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>完成率统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">90%</div>
                      <div className="text-sm text-gray-600 mt-1">平均完成率</div>
                      <Progress value={90} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mentor" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    导师效能量化分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">导师</th>
                          <th className="text-center py-3 px-4">学生数量</th>
                          <th className="text-center py-3 px-4">平均成绩</th>
                          <th className="text-center py-3 px-4">满意度</th>
                          <th className="text-center py-3 px-4">响应时间(小时)</th>
                          <th className="text-center py-3 px-4">指导质量</th>
                          <th className="text-center py-3 px-4">提升率</th>
                          <th className="text-center py-3 px-4">专业领域</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mentorEffectiveness.map((mentor) => (
                          <tr key={mentor.mentorId} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{mentor.mentorName}</td>
                            <td className="text-center py-3 px-4">{mentor.studentCount}</td>
                            <td className="text-center py-3 px-4 font-semibold">{mentor.averageGrade}</td>
                            <td className="text-center py-3 px-4">
                              <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span>{mentor.satisfactionRating}</span>
                              </div>
                            </td>
                            <td className="text-center py-3 px-4">{mentor.responseTime}</td>
                            <td className="text-center py-3 px-4">
                              <Progress value={mentor.guidanceQuality * 20} className="w-20 mx-auto" />
                              <span className="text-xs mt-1">{mentor.guidanceQuality}/5</span>
                            </td>
                            <td className="text-center py-3 px-4 text-green-600 font-semibold">
                              +{mentor.improvementRate}%
                            </td>
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                {mentor.specialties.map((specialty, index) => (
                                  <span key={index} className="inline-block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mr-1">
                                    {specialty}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>平均满意度</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.5/5</div>
                      <div className="text-sm text-gray-600 mt-1">导师指导满意度</div>
                      <div className="flex justify-center mt-2">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>响应效率</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">2.5h</div>
                      <div className="text-sm text-gray-600 mt-1">平均响应时间</div>
                      <Progress value={75} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>指导质量</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">4.6/5</div>
                      <div className="text-sm text-gray-600 mt-1">指导质量评分</div>
                      <Progress value={92} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>学生提升</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">14.3%</div>
                      <div className="text-sm text-gray-600 mt-1">平均成绩提升率</div>
                      <Progress value={85} className="mt-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    智能洞察与建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisInsights.map((insight) => (
                      <Alert key={insight.id} className={getSeverityColor(insight.severity)}>
                        <AlertTriangle className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {insight.type === 'behavior' ? '行为' :
                                 insight.type === 'grade' ? '成绩' :
                                 insight.type === 'course' ? '课程' : '导师'}
                              </Badge>
                              <span className="text-xs text-gray-500">{insight.timestamp}</span>
                            </div>
                          </div>
                          <AlertDescription className="mb-3">
                            {insight.description}
                          </AlertDescription>
                          <div>
                            <div className="text-sm font-medium mb-2">建议措施：</div>
                            <div className="space-y-1">
                              {insight.actionItems.map((action, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>预警机制状态</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>学习行为监控</span>
                        <Badge className="bg-green-100 text-green-800">正常</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>成绩预测模型</span>
                        <Badge className="bg-green-100 text-green-800">运行中</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>课程质量监测</span>
                        <Badge className="bg-yellow-100 text-yellow-800">需关注</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>导师效能评估</span>
                        <Badge className="bg-green-100 text-green-800">良好</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>数据质量指标</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>数据完整性</span>
                          <span>96%</span>
                        </div>
                        <Progress value={96} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>数据准确性</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>实时性</span>
                          <span>98%</span>
                        </div>
                        <Progress value={98} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>一致性</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} />
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