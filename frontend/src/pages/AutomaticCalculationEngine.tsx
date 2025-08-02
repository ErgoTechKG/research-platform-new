import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Calculator,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  Info,
  Activity,
  Eye,
  Check,
  X,
  ChevronRight,
  History
} from 'lucide-react'

interface DimensionScore {
  dimension: string
  weight: number
  avgScore: number
  contribution: number
}

interface GradeDistribution {
  grade: string
  range: string
  count: number
  percentage: number
}

interface StudentAnomaly {
  id: string
  name: string
  issue: string
  severity: 'high' | 'medium' | 'low'
  details: string
  status: 'pending' | 'processed'
}

interface CalculationLog {
  id: string
  timestamp: string
  operator: string
  action: string
  result: string
}

interface CalculationRule {
  id: string
  name: string
  formula: string
  weights: { [key: string]: number }
}

export default function AutomaticCalculationEngine() {
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationProgress, setCalculationProgress] = useState(0)
  const [selectedClass, setSelectedClass] = useState('all')
  const [showSuccess, setShowSuccess] = useState(false)
  const [processedAnomalies, setProcessedAnomalies] = useState<Set<string>>(new Set())

  // Mock data
  const dimensionScores: DimensionScore[] = [
    { dimension: '思想品德', weight: 20, avgScore: 82.5, contribution: 16.5 },
    { dimension: '课程成绩', weight: 40, avgScore: 78.3, contribution: 31.3 },
    { dimension: '科技创新', weight: 25, avgScore: 85.2, contribution: 21.3 },
    { dimension: '科研推进', weight: 15, avgScore: 76.8, contribution: 11.5 }
  ]

  const gradeDistribution: GradeDistribution[] = [
    { grade: 'A级', range: '90-100', count: 15, percentage: 25 },
    { grade: 'B级', range: '80-89', count: 28, percentage: 47 },
    { grade: 'C级', range: '70-79', count: 12, percentage: 20 },
    { grade: 'D级', range: '60-69', count: 5, percentage: 8 }
  ]

  const [studentAnomalies, setStudentAnomalies] = useState<StudentAnomaly[]>([
    {
      id: '1',
      name: '王某某',
      issue: '科技创新维度异常高',
      severity: 'high',
      details: '科技创新得分96分，超过95分阈值，需要核实',
      status: 'pending'
    },
    {
      id: '2',
      name: '李某某',
      issue: '各维度差异过大',
      severity: 'medium',
      details: '最高分与最低分差异35分，超过30分阈值',
      status: 'pending'
    },
    {
      id: '3',
      name: '张某某',
      issue: '总分偏低',
      severity: 'low',
      details: '综合评分58分，低于60分及格线',
      status: 'pending'
    }
  ])

  const calculationLogs: CalculationLog[] = [
    {
      id: '1',
      timestamp: '2025-08-02 15:30:00',
      operator: '系统',
      action: '执行自动计算',
      result: '成功计算60名学生成绩'
    },
    {
      id: '2',
      timestamp: '2025-08-02 14:15:00',
      operator: '张秘书',
      action: '手动重新计算',
      result: '更新5名学生成绩'
    },
    {
      id: '3',
      timestamp: '2025-08-02 10:00:00',
      operator: '系统',
      action: '定时计算任务',
      result: '检测到3个异常情况'
    }
  ]

  const calculationRules: CalculationRule[] = [
    {
      id: '1',
      name: '综合素质评价标准规则',
      formula: '思想品德×20% + 课程成绩×40% + 科技创新×25% + 科研推进×15%',
      weights: {
        moral: 0.2,
        academic: 0.4,
        innovation: 0.25,
        research: 0.15
      }
    }
  ]

  // Simulate calculation
  useEffect(() => {
    if (isCalculating) {
      const interval = setInterval(() => {
        setCalculationProgress(prev => {
          if (prev >= 100) {
            setIsCalculating(false)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
            return 100
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [isCalculating])

  const handleCalculate = () => {
    setCalculationProgress(0)
    setIsCalculating(true)
  }

  const handleMarkProcessed = (anomalyId: string) => {
    setProcessedAnomalies(new Set([...processedAnomalies, anomalyId]))
    setStudentAnomalies(anomalies =>
      anomalies.map(a =>
        a.id === anomalyId ? { ...a, status: 'processed' } : a
      )
    )
  }

  const getTotalScore = () => {
    return dimensionScores.reduce((sum, score) => sum + score.contribution, 0).toFixed(1)
  }

  const getAnomalyColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A级': return 'bg-green-500'
      case 'B级': return 'bg-blue-500'
      case 'C级': return 'bg-yellow-500'
      case 'D级': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">综合素质评价 - 成绩核算</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCalculate}
                disabled={isCalculating}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isCalculating ? 'animate-spin' : ''}`} />
                重新计算
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>

          {showSuccess && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                成绩计算完成！已成功计算60名学生的综合成绩。
              </AlertDescription>
            </Alert>
          )}

          {isCalculating && (
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">正在计算中...</span>
                  <span className="text-sm text-gray-600">{calculationProgress}%</span>
                </div>
                <Progress value={calculationProgress} className="h-2" />
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">计算概览</TabsTrigger>
              <TabsTrigger value="distribution">成绩分布</TabsTrigger>
              <TabsTrigger value="anomalies">异常检测</TabsTrigger>
              <TabsTrigger value="rules">计算规则</TabsTrigger>
              <TabsTrigger value="logs">计算日志</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    计算规则预览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-lg font-mono text-center">
                      思想品德(20%) + 课程成绩(40%) + 科技创新(25%) + 科研推进(15%) = 总分(100%)
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {dimensionScores.map((score) => (
                      <Card key={score.dimension}>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{score.dimension}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">权重：</span>
                              <span className="font-medium">{score.weight}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">平均分：</span>
                              <span className="font-medium">{score.avgScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">贡献分：</span>
                              <span className="font-bold text-blue-600">{score.contribution}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 text-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">综合平均分</p>
                    <p className="text-3xl font-bold text-blue-600">{getTotalScore()}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">已计算学生</p>
                        <p className="text-2xl font-bold">60</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">异常情况</p>
                        <p className="text-2xl font-bold text-red-600">3</p>
                      </div>
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">优秀率</p>
                        <p className="text-2xl font-bold text-green-600">25%</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    成绩分布统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="选择班级" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部班级</SelectItem>
                        <SelectItem value="2021">2021级</SelectItem>
                        <SelectItem value="2022">2022级</SelectItem>
                        <SelectItem value="2023">2023级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      {gradeDistribution.map((grade) => (
                        <div key={grade.grade} className="text-center">
                          <h4 className="font-medium mb-2">{grade.grade}</h4>
                          <p className="text-sm text-gray-600 mb-2">({grade.range})</p>
                          <div className="relative h-32 flex items-end justify-center mb-2">
                            <div
                              className={`w-16 ${getGradeColor(grade.grade)} rounded-t`}
                              style={{ height: `${grade.percentage * 1.2}%` }}
                            />
                          </div>
                          <p className="font-medium">{grade.count}人</p>
                          <p className="text-sm text-gray-600">{grade.percentage}%</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-3">统计指标</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">最高分</p>
                          <p className="text-xl font-bold">96.5</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">最低分</p>
                          <p className="text-xl font-bold">58.2</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">平均分</p>
                          <p className="text-xl font-bold">80.6</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-sm text-gray-600">标准差</p>
                          <p className="text-xl font-bold">8.7</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      异常提示
                    </div>
                    <Badge variant="destructive">
                      {studentAnomalies.filter(a => a.status === 'pending').length} 待处理
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      发现{studentAnomalies.length}名学生分数异常，请核实相关信息
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    {studentAnomalies.map((anomaly) => (
                      <div
                        key={anomaly.id}
                        className={`p-4 rounded-lg border ${
                          anomaly.status === 'processed' ? 'bg-gray-50 opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{anomaly.name}</h4>
                              <Badge className={getAnomalyColor(anomaly.severity)}>
                                {anomaly.severity === 'high' ? '高' :
                                 anomaly.severity === 'medium' ? '中' : '低'}优先级
                              </Badge>
                              {anomaly.status === 'processed' && (
                                <Badge variant="outline">已处理</Badge>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-700">{anomaly.issue}</p>
                            <p className="text-sm text-gray-600 mt-1">{anomaly.details}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={anomaly.status === 'processed'}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看详情
                            </Button>
                            {anomaly.status === 'pending' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkProcessed(anomaly.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                标记已处理
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    计算规则配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {calculationRules.map((rule) => (
                    <div key={rule.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{rule.name}</h4>
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="font-mono text-sm">{rule.formula}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(rule.weights).map(([key, value]) => (
                          <div key={key} className="text-center p-2 bg-blue-50 rounded">
                            <p className="text-xs text-gray-600 capitalize">{key}</p>
                            <p className="font-bold">{(value * 100).toFixed(0)}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">计算说明</p>
                        <ul className="mt-1 space-y-1 text-yellow-700">
                          <li>• 系统每日凌晨自动执行计算任务</li>
                          <li>• 手动重新计算将覆盖之前的结果</li>
                          <li>• 异常分数需要人工确认后才能生效</li>
                          <li>• 计算结果将自动同步到学生档案</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    计算日志记录
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>时间</TableHead>
                        <TableHead>操作人</TableHead>
                        <TableHead>操作</TableHead>
                        <TableHead>结果</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculationLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">{log.timestamp}</TableCell>
                          <TableCell>
                            <Badge variant={log.operator === '系统' ? 'secondary' : 'default'}>
                              {log.operator}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="text-sm">{log.result}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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