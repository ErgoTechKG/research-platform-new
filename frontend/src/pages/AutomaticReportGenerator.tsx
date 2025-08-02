import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  FileText, 
  Download, 
  Eye,
  Clock,
  Calendar as CalendarIcon,
  Settings,
  Plus,
  Trash2,
  Sparkles,
  FileSpreadsheet,
  FileImage,
  BarChart3,
  Brain,
  Timer,
  History,
  Play,
  RefreshCw,
  Save,
  Upload,
  FolderOpen,
  ChevronRight,
  Edit2,
  Copy,
  Layout,
  Type,
  Image,
  Table,
  List,
  CheckSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface ReportModule {
  id: string
  name: string
  description: string
  enabled: boolean
  order: number
  required: boolean
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  modules: ReportModule[]
  lastModified: Date
  isSystem: boolean
}

interface ScheduledTask {
  id: string
  reportType: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  nextRun: Date
  lastRun?: Date
  enabled: boolean
  recipients: string[]
  timeRange: 'auto' | 'custom'
}

interface ReportHistory {
  id: string
  title: string
  type: string
  generatedAt: Date
  generatedBy: string
  format: string
  status: 'success' | 'failed'
  size: number
  downloadUrl?: string
}

const REPORT_TYPES = [
  { id: 'monthly', name: '月度报告', description: '教学质量月度总结报告' },
  { id: 'quality', name: '质量报告', description: '教学质量评估分析报告' },
  { id: 'statistical', name: '统计报告', description: '各项数据统计分析报告' },
  { id: 'summary', name: '年度总结', description: '年度工作总结报告' },
  { id: 'custom', name: '自定义报告', description: '根据需求定制报告' }
]

const DEFAULT_MODULES: ReportModule[] = [
  { id: '1', name: '执行摘要', description: 'AI自动生成的报告摘要', enabled: true, order: 1, required: true },
  { id: '2', name: '统计分析', description: '关键数据统计与趋势分析', enabled: true, order: 2, required: false },
  { id: '3', name: '问题与建议', description: 'AI分析发现的问题和改进建议', enabled: true, order: 3, required: false },
  { id: '4', name: '成绩分析', description: '学生成绩分布与对比分析', enabled: true, order: 4, required: false },
  { id: '5', name: '教学质量', description: '教学质量评估结果汇总', enabled: true, order: 5, required: false },
  { id: '6', name: '资源利用', description: '教学资源使用情况分析', enabled: false, order: 6, required: false },
  { id: '7', name: '满意度调查', description: '师生满意度调查结果', enabled: false, order: 7, required: false },
  { id: '8', name: '详细数据附录', description: '完整的数据表格和图表', enabled: false, order: 8, required: false }
]

const TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    name: '标准月度报告模板',
    description: '包含基本统计分析和问题建议',
    modules: DEFAULT_MODULES.filter(m => ['1', '2', '3', '4'].includes(m.id)),
    lastModified: new Date('2024-10-01'),
    isSystem: true
  },
  {
    id: '2',
    name: '完整质量报告模板',
    description: '包含所有分析模块的详细报告',
    modules: DEFAULT_MODULES,
    lastModified: new Date('2024-09-15'),
    isSystem: true
  }
]

export default function AutomaticReportGenerator() {
  const [reportType, setReportType] = useState('monthly')
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(2024, 9, 1),
    to: new Date(2024, 9, 31)
  })
  const [selectedModules, setSelectedModules] = useState<ReportModule[]>(
    DEFAULT_MODULES.filter(m => m.enabled)
  )
  const [outputFormats, setOutputFormats] = useState({
    pdf: true,
    word: true,
    excel: false,
    ppt: true
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showTemplateManager, setShowTemplateManager] = useState(false)
  
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([
    {
      id: '1',
      reportType: 'monthly',
      frequency: 'monthly',
      nextRun: new Date('2024-11-01'),
      lastRun: new Date('2024-10-01'),
      enabled: true,
      recipients: ['secretary@hust.edu.cn', 'leader@hust.edu.cn'],
      timeRange: 'auto'
    }
  ])

  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([
    {
      id: '1',
      title: '2024年10月教学质量月度报告',
      type: 'monthly',
      generatedAt: new Date('2024-10-01 09:00'),
      generatedBy: 'AI自动生成',
      format: 'PDF',
      status: 'success',
      size: 3457280,
      downloadUrl: '#'
    },
    {
      id: '2',
      title: '2024年第三季度统计分析报告',
      type: 'statistical',
      generatedAt: new Date('2024-10-05 14:30'),
      generatedBy: '张秘书',
      format: 'Word',
      status: 'success',
      size: 2145792,
      downloadUrl: '#'
    }
  ])

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev => {
      const module = DEFAULT_MODULES.find(m => m.id === moduleId)
      if (!module || module.required) return prev
      
      const exists = prev.find(m => m.id === moduleId)
      if (exists) {
        return prev.filter(m => m.id !== moduleId)
      } else {
        return [...prev, module].sort((a, b) => a.order - b.order)
      }
    })
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate AI generation process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setGenerationProgress(i)
    }

    const newReport: ReportHistory = {
      id: Date.now().toString(),
      title: `${dateRange.from ? format(dateRange.from, 'yyyy年MM月', { locale: zhCN }) : ''} ${REPORT_TYPES.find(t => t.id === reportType)?.name || ''}`,
      type: reportType,
      generatedAt: new Date(),
      generatedBy: 'AI自动生成',
      format: Object.entries(outputFormats).filter(([_, enabled]) => enabled).map(([format]) => format.toUpperCase()).join(', '),
      status: 'success',
      size: Math.floor(Math.random() * 5000000) + 1000000
    }

    setReportHistory(prev => [newReport, ...prev])
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setSelectedModules(template.modules)
      setSelectedTemplate(templateId)
    }
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">智能报告生成器</h1>
            <p className="text-gray-600 mt-1">快速生成各类教学质量报告和分析报告，支持AI智能内容生成</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Report Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    报告类型选择
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {REPORT_TYPES.map((type) => (
                      <div
                        key={type.id}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          reportType === type.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setReportType(type.id)}
                      >
                        <h4 className="font-medium text-gray-900">{type.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time Range Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    时间范围配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, 'yyyy年MM月dd日', { locale: zhCN }) : '开始日期'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <span className="text-gray-500">至</span>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, 'yyyy年MM月dd日', { locale: zhCN }) : '结束日期'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </CardContent>
              </Card>

              {/* Report Content Modules */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5" />
                      报告内容模块配置
                    </CardTitle>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowTemplateManager(true)}
                    >
                      <FolderOpen className="w-4 h-4 mr-1" />
                      模板库
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {DEFAULT_MODULES.map((module) => {
                    const isSelected = selectedModules.some(m => m.id === module.id)
                    return (
                      <div
                        key={module.id}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg",
                          isSelected ? "bg-blue-50 border-blue-200" : "bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={module.required}
                            onCheckedChange={() => toggleModule(module.id)}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{module.name}</span>
                              {module.required && (
                                <Badge variant="secondary" className="text-xs">必选</Badge>
                              )}
                              {module.name.includes('AI') && (
                                <Badge variant="outline" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI生成
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{module.description}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Output Format */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    输出格式
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(outputFormats).map(([format, enabled]) => (
                      <div
                        key={format}
                        className={cn(
                          "flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all",
                          enabled ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        )}
                        onClick={() => setOutputFormats(prev => ({ ...prev, [format]: !prev[format as keyof typeof prev] }))}
                      >
                        <Checkbox checked={enabled} />
                        <span className="font-medium uppercase">{format}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="flex justify-end gap-3">
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  预览报告
                </Button>
                <Button 
                  onClick={handleGenerateReport}
                  disabled={isGenerating || !dateRange.from || !dateRange.to}
                  className="min-w-[120px]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      生成报告
                    </>
                  )}
                </Button>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">正在生成报告...</span>
                        <span className="font-medium">{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} />
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 animate-pulse" />
                          AI正在分析数据并生成内容...
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Scheduled Tasks */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">定时生成</CardTitle>
                    <Button size="sm" variant="ghost">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scheduledTasks.map((task) => (
                      <div key={task.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {REPORT_TYPES.find(t => t.id === task.reportType)?.name}
                          </span>
                          <Badge variant={task.enabled ? "default" : "secondary"}>
                            {task.enabled ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            {task.frequency === 'monthly' ? '每月' : 
                             task.frequency === 'weekly' ? '每周' :
                             task.frequency === 'daily' ? '每日' :
                             task.frequency === 'quarterly' ? '每季度' : '每年'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            下次: {format(task.nextRun, 'MM-dd HH:mm')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">历史报告</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportHistory.slice(0, 3).map((report) => (
                      <div key={report.id} className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                              {report.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {report.generatedBy.includes('AI') && (
                                <Badge variant="outline" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatFileSize(report.size)}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {format(report.generatedAt, 'yyyy-MM-dd HH:mm')}
                        </p>
                      </div>
                    ))}
                    <Button variant="link" className="w-full text-sm">
                      查看全部历史 <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant Tips */}
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>AI 助手提示</strong>
                  <br />
                  选择"执行摘要"和"问题与建议"模块时，AI将自动分析数据并生成专业内容。
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}