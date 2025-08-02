import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FileText, 
  Download, 
  Eye,
  Clock,
  Calendar,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  FileSpreadsheet,
  FileImage,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  School,
  Award,
  Brain,
  Timer,
  History,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'academic' | 'evaluation' | 'statistics' | 'summary'
  dataSource: string[]
  outputFormats: string[]
  lastUsed?: Date
  useCount: number
}

interface GeneratedReport {
  id: string
  title: string
  templateId: string
  templateName: string
  generatedAt: Date
  status: 'generating' | 'completed' | 'failed'
  format: 'pdf' | 'docx' | 'xlsx' | 'pptx'
  size?: number
  aiGenerated: boolean
  progress?: number
  error?: string
}

interface ScheduledReport {
  id: string
  templateId: string
  templateName: string
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  nextRun: Date
  lastRun?: Date
  enabled: boolean
  recipients: string[]
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    name: '学期综合评价报告',
    description: '自动生成学期综合素质评价报告，包含成绩分析、活动参与、导师评价等',
    category: 'evaluation',
    dataSource: ['成绩系统', '活动记录', '导师评价'],
    outputFormats: ['pdf', 'docx'],
    lastUsed: new Date('2024-06-30'),
    useCount: 45
  },
  {
    id: '2',
    name: '实验室轮转总结',
    description: '汇总实验室轮转情况，包含学生分配、项目进展、成果展示',
    category: 'academic',
    dataSource: ['轮转记录', '项目数据', '成果展示'],
    outputFormats: ['pdf', 'pptx'],
    lastUsed: new Date('2024-07-15'),
    useCount: 32
  },
  {
    id: '3',
    name: '年度数据统计报告',
    description: '全年数据统计分析，包含各项指标对比、趋势分析、问题诊断',
    category: 'statistics',
    dataSource: ['所有模块数据'],
    outputFormats: ['pdf', 'xlsx'],
    useCount: 12
  },
  {
    id: '4',
    name: '学生成长档案',
    description: 'AI智能生成个人成长档案，包含学习轨迹、能力评估、发展建议',
    category: 'summary',
    dataSource: ['个人数据', '评价记录', '成果展示'],
    outputFormats: ['pdf', 'docx'],
    useCount: 156
  }
]

const TEMPLATE_ICONS = {
  academic: { icon: School, color: 'blue' },
  evaluation: { icon: Award, color: 'green' },
  statistics: { icon: BarChart3, color: 'purple' },
  summary: { icon: FileText, color: 'orange' }
}

export default function ReportGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [reportTitle, setReportTitle] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf')
  const [useAI, setUseAI] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: '1',
      title: '2024春季学期综合评价报告',
      templateId: '1',
      templateName: '学期综合评价报告',
      generatedAt: new Date('2024-07-01'),
      status: 'completed',
      format: 'pdf',
      size: 2457600,
      aiGenerated: true
    },
    {
      id: '2',
      title: '第一批实验室轮转总结',
      templateId: '2',
      templateName: '实验室轮转总结',
      generatedAt: new Date('2024-07-02'),
      status: 'completed',
      format: 'pptx',
      size: 5242880,
      aiGenerated: false
    }
  ])

  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      templateId: '3',
      templateName: '年度数据统计报告',
      schedule: 'monthly',
      nextRun: new Date('2024-08-01'),
      lastRun: new Date('2024-07-01'),
      enabled: true,
      recipients: ['admin@hust.edu.cn', 'secretary@hust.edu.cn']
    }
  ])

  const handleGenerateReport = () => {
    if (!selectedTemplate || !reportTitle) return

    setIsGenerating(true)
    setGenerationProgress(0)

    const template = REPORT_TEMPLATES.find(t => t.id === selectedTemplate)
    if (!template) return

    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      title: reportTitle,
      templateId: selectedTemplate,
      templateName: template.name,
      generatedAt: new Date(),
      status: 'generating',
      format: selectedFormat as any,
      aiGenerated: useAI,
      progress: 0
    }

    setGeneratedReports(prev => [newReport, ...prev])

    // Simulate generation progress
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 20, 100)
        
        setGeneratedReports(reports => reports.map(r => 
          r.id === newReport.id 
            ? { ...r, progress: newProgress }
            : r
        ))

        if (newProgress >= 100) {
          clearInterval(interval)
          setGeneratedReports(reports => reports.map(r => 
            r.id === newReport.id 
              ? { 
                  ...r, 
                  status: 'completed' as const, 
                  size: Math.floor(Math.random() * 10000000) + 1000000,
                  progress: 100
                }
              : r
          ))
          setIsGenerating(false)
          setSelectedTemplate('')
          setReportTitle('')
          setReportDescription('')
          setGenerationProgress(0)
        }
        
        return newProgress
      })
    }, 500)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return FileText
      case 'docx': return FileText
      case 'xlsx': return FileSpreadsheet
      case 'pptx': return FileImage
      default: return FileText
    }
  }

  const toggleSchedule = (scheduleId: string) => {
    setScheduledReports(prev => prev.map(schedule =>
      schedule.id === scheduleId
        ? { ...schedule, enabled: !schedule.enabled }
        : schedule
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">报告生成器</h1>
            <p className="text-gray-600 mt-1">自动生成各类报告，提供智能化的报告生成和管理功能</p>
          </div>

          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">生成报告</TabsTrigger>
              <TabsTrigger value="history">历史报告</TabsTrigger>
              <TabsTrigger value="schedule">定时任务</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>选择报告模板</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REPORT_TEMPLATES.map((template) => {
                      const IconConfig = TEMPLATE_ICONS[template.category]
                      const Icon = IconConfig.icon
                      const isSelected = selectedTemplate === template.id

                      return (
                        <div
                          key={template.id}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all",
                            isSelected 
                              ? "border-blue-500 bg-blue-50" 
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              IconConfig.color === 'blue' && "bg-blue-100 text-blue-600",
                              IconConfig.color === 'green' && "bg-green-100 text-green-600",
                              IconConfig.color === 'purple' && "bg-purple-100 text-purple-600",
                              IconConfig.color === 'orange' && "bg-orange-100 text-orange-600"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                {template.useCount > 50 && (
                                  <Badge variant="secondary" className="text-xs">
                                    热门
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                              
                              <div className="flex flex-wrap gap-2 text-xs">
                                <div className="flex items-center gap-1 text-gray-500">
                                  <BarChart3 className="w-3 h-3" />
                                  <span>使用 {template.useCount} 次</span>
                                </div>
                                {template.lastUsed && (
                                  <div className="flex items-center gap-1 text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>最近: {template.lastUsed.toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Report Configuration */}
              {selectedTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle>配置报告参数</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">报告标题</label>
                      <Input
                        placeholder="输入报告标题..."
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">报告描述（可选）</label>
                      <Textarea
                        placeholder="输入报告描述..."
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">输出格式</label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {REPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.outputFormats.map(format => (
                              <SelectItem key={format} value={format}>
                                {format.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">生成方式</label>
                        <div className="mt-1 space-y-2">
                          <Button
                            variant={useAI ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setUseAI(true)}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            AI 智能生成
                          </Button>
                          <Button
                            variant={!useAI ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setUseAI(false)}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            模板填充生成
                          </Button>
                        </div>
                      </div>
                    </div>

                    {useAI && (
                      <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertDescription>
                          AI 将基于历史数据和模板智能生成报告内容，确保准确性和专业性
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTemplate('')
                          setReportTitle('')
                          setReportDescription('')
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        onClick={handleGenerateReport}
                        disabled={!reportTitle || isGenerating}
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            开始生成
                          </>
                        )}
                      </Button>
                    </div>

                    {isGenerating && (
                      <div className="space-y-2">
                        <Progress value={generationProgress} />
                        <p className="text-sm text-gray-600 text-center">
                          正在生成报告... {Math.round(generationProgress)}%
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>历史报告 ({generatedReports.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedReports.map((report) => {
                      const FormatIcon = getFormatIcon(report.format)
                      
                      return (
                        <div
                          key={report.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FormatIcon className="w-5 h-5 text-gray-600" />
                            </div>
                          </div>

                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900">{report.title}</h4>
                              {report.aiGenerated && (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI 生成
                                </Badge>
                              )}
                              <Badge 
                                variant={report.status === 'completed' ? 'default' : 
                                        report.status === 'generating' ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {report.status === 'completed' ? '已完成' :
                                 report.status === 'generating' ? '生成中' : '失败'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>模板: {report.templateName}</span>
                              <span>{formatDate(report.generatedAt)}</span>
                              {report.size && <span>{formatFileSize(report.size)}</span>}
                            </div>

                            {report.status === 'generating' && report.progress !== undefined && (
                              <Progress value={report.progress} className="mt-2 h-2" />
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {report.status === 'completed' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  预览
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-1" />
                                  下载
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}

                    {generatedReports.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">暂无历史报告</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>定时任务</CardTitle>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      新建任务
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scheduledReports.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{schedule.templateName}</h4>
                            <Badge variant={schedule.enabled ? "default" : "secondary"}>
                              {schedule.enabled ? '启用' : '禁用'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Timer className="w-3 h-3" />
                              {schedule.schedule === 'daily' ? '每日' :
                               schedule.schedule === 'weekly' ? '每周' :
                               schedule.schedule === 'monthly' ? '每月' : '每季度'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              下次运行: {formatDate(schedule.nextRun)}
                            </span>
                            {schedule.lastRun && (
                              <span className="flex items-center gap-1">
                                <History className="w-3 h-3" />
                                上次运行: {formatDate(schedule.lastRun)}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-sm text-gray-500">
                            收件人: {schedule.recipients.join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSchedule(schedule.id)}
                          >
                            {schedule.enabled ? (
                              <>
                                <Pause className="w-4 h-4 mr-1" />
                                暂停
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-1" />
                                启用
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Settings className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {scheduledReports.length === 0 && (
                      <div className="text-center py-12">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">暂无定时任务</p>
                      </div>
                    )}
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