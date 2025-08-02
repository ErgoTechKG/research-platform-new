import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
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
  CheckSquare,
  Bot,
  Wand2,
  PieChart,
  TrendingUp,
  FileDown,
  Globe,
  Users,
  School,
  Award,
  Lightbulb,
  Target,
  RotateCcw,
  Maximize2,
  Minimize2,
  Star,
  MessageSquare,
  ArrowRight,
  BookOpen,
  Zap,
  Database
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface LLMProvider {
  id: string
  name: string
  model: string
  description: string
  maxTokens: number
  supportsChinese: boolean
  status: 'active' | 'inactive' | 'error'
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: 'academic' | 'evaluation' | 'analytics' | 'summary' | 'custom'
  structure: TemplateSection[]
  variables: TemplateVariable[]
  isSystem: boolean
  createdBy: string
  lastModified: Date
  useCount: number
}

interface TemplateSection {
  id: string
  name: string
  description: string
  type: 'text' | 'chart' | 'table' | 'data'
  order: number
  required: boolean
  llmPrompt?: string
  chartConfig?: ChartConfig
}

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap'
  dataSource: string
  xAxis?: string
  yAxis?: string
  title: string
}

interface TemplateVariable {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'select'
  defaultValue?: any
  required: boolean
  options?: string[]
}

interface GeneratedReport {
  id: string
  title: string
  templateId: string
  templateName: string
  generatedAt: Date
  status: 'generating' | 'completed' | 'failed' | 'reviewing'
  format: string[]
  llmProvider: string
  model: string
  aiGenerated: boolean
  progress?: number
  error?: string
  size?: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  reviewComments?: string
  version: number
  downloadUrls?: { [format: string]: string }
}

interface BatchGenerationTask {
  id: string
  templateId: string
  templateName: string
  targets: string[]
  progress: number
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: Date
  completedReports: number
  totalReports: number
}

const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'gpt-4',
    name: 'OpenAI GPT-4',
    model: 'gpt-4-turbo',
    description: '最先进的语言模型，支持复杂分析和推理',
    maxTokens: 8192,
    supportsChinese: true,
    status: 'active'
  },
  {
    id: 'claude-3',
    name: 'Anthropic Claude 3',
    model: 'claude-3-sonnet',
    description: '擅长长文本分析和学术写作',
    maxTokens: 200000,
    supportsChinese: true,
    status: 'active'
  },
  {
    id: 'gemini-pro',
    name: 'Google Gemini Pro',
    model: 'gemini-pro',
    description: '多模态能力，支持图表和数据分析',
    maxTokens: 32768,
    supportsChinese: true,
    status: 'inactive'
  }
]

const SYSTEM_TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    name: 'AI深度学术分析报告',
    description: '基于LLM的深度学术数据分析和洞察生成',
    category: 'academic',
    structure: [
      { id: '1', name: '执行摘要', description: 'AI生成的报告核心要点', type: 'text', order: 1, required: true, llmPrompt: '基于提供的数据，生成一份简洁的执行摘要，突出关键发现和建议' },
      { id: '2', name: '数据趋势分析', description: '智能识别数据模式和趋势', type: 'chart', order: 2, required: true, chartConfig: { type: 'line', dataSource: 'analytics', title: '趋势分析图' } },
      { id: '3', name: '问题诊断与建议', description: 'AI识别问题并提供解决建议', type: 'text', order: 3, required: true, llmPrompt: '分析数据中存在的问题，并提供具体的改进建议' },
      { id: '4', name: '对比分析', description: '多维度对比分析', type: 'table', order: 4, required: false },
      { id: '5', name: '预测与展望', description: 'AI基于历史数据的预测分析', type: 'text', order: 5, required: false, llmPrompt: '基于历史趋势，预测未来发展方向并提供战略建议' }
    ],
    variables: [
      { id: '1', name: '分析时间段', type: 'select', required: true, options: ['本月', '上月', '本季度', '上季度', '本年度'] },
      { id: '2', name: '分析深度', type: 'select', required: true, options: ['基础', '详细', '深度'] }
    ],
    isSystem: true,
    createdBy: 'System',
    lastModified: new Date('2024-11-01'),
    useCount: 156
  },
  {
    id: '2',
    name: '智能教学质量报告',
    description: '全方位教学质量评估与改进建议',
    category: 'evaluation',
    structure: [
      { id: '1', name: '教学质量概览', description: '整体质量状况AI分析', type: 'text', order: 1, required: true, llmPrompt: '分析教学质量数据，生成综合评价和关键指标解读' },
      { id: '2', name: '成绩分布分析', description: '学生成绩分布可视化', type: 'chart', order: 2, required: true, chartConfig: { type: 'bar', dataSource: 'grades', title: '成绩分布图' } },
      { id: '3', name: '教师评价分析', description: 'AI挖掘评价数据洞察', type: 'text', order: 3, required: true, llmPrompt: '分析教师评价数据，识别优秀实践和改进机会' },
      { id: '4', name: '学生反馈总结', description: '学生反馈智能归纳', type: 'text', order: 4, required: false, llmPrompt: '总结学生反馈，提取关键意见和建议' }
    ],
    variables: [
      { id: '1', name: '课程类型', type: 'select', required: true, options: ['理论课', '实验课', '实习课', '全部'] },
      { id: '2', name: '分析维度', type: 'select', required: true, options: ['整体', '分专业', '分年级'] }
    ],
    isSystem: true,
    createdBy: 'System',
    lastModified: new Date('2024-11-01'),
    useCount: 89
  }
]

export default function LLMReportGeneration() {
  const [selectedProvider, setSelectedProvider] = useState('gpt-4')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [reportTitle, setReportTitle] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [outputFormats, setOutputFormats] = useState({
    pdf: true,
    word: true,
    html: false,
    excel: false
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStage, setGenerationStage] = useState('')
  const [templateVariables, setTemplateVariables] = useState<{ [key: string]: any }>({})
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [currentTemplateSection, setCurrentTemplateSection] = useState('')
  const [llmTemperature, setLlmTemperature] = useState([0.7])
  const [llmMaxTokens, setLlmMaxTokens] = useState([2000])
  const [contentReviewMode, setContentReviewMode] = useState(true)
  
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
    {
      id: '1',
      title: '2024年10月AI深度学术分析报告',
      templateId: '1',
      templateName: 'AI深度学术分析报告',
      generatedAt: new Date('2024-11-01'),
      status: 'completed',
      format: ['PDF', 'Word'],
      llmProvider: 'OpenAI GPT-4',
      model: 'gpt-4-turbo',
      aiGenerated: true,
      size: 3457280,
      quality: 'excellent',
      version: 1,
      downloadUrls: { pdf: '#', word: '#' }
    },
    {
      id: '2',
      title: '教学质量智能分析报告',
      templateId: '2',
      templateName: '智能教学质量报告',
      generatedAt: new Date('2024-10-30'),
      status: 'reviewing',
      format: ['PDF'],
      llmProvider: 'Anthropic Claude 3',
      model: 'claude-3-sonnet',
      aiGenerated: true,
      quality: 'good',
      version: 2,
      reviewComments: '建议增加更多具体的改进措施'
    }
  ])

  const [batchTasks, setBatchTasks] = useState<BatchGenerationTask[]>([
    {
      id: '1',
      templateId: '2',
      templateName: '智能教学质量报告',
      targets: ['计算机学院', '机械学院', '电气学院'],
      progress: 66,
      status: 'running',
      createdAt: new Date('2024-11-01'),
      completedReports: 2,
      totalReports: 3
    }
  ])

  const handleGenerateReport = async () => {
    if (!selectedTemplate || !reportTitle) return

    setIsGenerating(true)
    setGenerationProgress(0)

    const template = SYSTEM_TEMPLATES.find(t => t.id === selectedTemplate)
    if (!template) return

    const provider = LLM_PROVIDERS.find(p => p.id === selectedProvider)
    if (!provider) return

    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      title: reportTitle,
      templateId: selectedTemplate,
      templateName: template.name,
      generatedAt: new Date(),
      status: 'generating',
      format: Object.entries(outputFormats).filter(([_, enabled]) => enabled).map(([format]) => format.toUpperCase()),
      llmProvider: provider.name,
      model: provider.model,
      aiGenerated: true,
      progress: 0,
      quality: 'good',
      version: 1
    }

    setGeneratedReports(prev => [newReport, ...prev])

    // Simulate LLM generation process with stages
    const stages = [
      '数据分析中...',
      '生成报告大纲...',
      'AI内容生成中...',
      '图表自动生成...',
      '内容质量检查...',
      '格式化报告...',
      '生成多格式文件...'
    ]

    for (let i = 0; i < stages.length; i++) {
      setGenerationStage(stages[i])
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const progress = Math.min(((i + 1) / stages.length) * 100, 100)
      setGenerationProgress(progress)
      
      setGeneratedReports(reports => reports.map(r => 
        r.id === newReport.id 
          ? { ...r, progress }
          : r
      ))
    }

    // Complete generation
    setGeneratedReports(reports => reports.map(r => 
      r.id === newReport.id 
        ? { 
            ...r, 
            status: contentReviewMode ? 'reviewing' : 'completed',
            size: Math.floor(Math.random() * 10000000) + 1000000,
            progress: 100,
            downloadUrls: { pdf: '#', word: '#', html: '#' }
          }
        : r
    ))

    setIsGenerating(false)
    setSelectedTemplate('')
    setReportTitle('')
    setReportDescription('')
    setGenerationProgress(0)
    setGenerationStage('')
  }

  const handleTemplateVariableChange = (variableId: string, value: any) => {
    setTemplateVariables(prev => ({ ...prev, [variableId]: value }))
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

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'fair': return 'text-yellow-600 bg-yellow-50'
      case 'poor': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'excellent': return '优秀'
      case 'good': return '良好'
      case 'fair': return '一般'
      case 'poor': return '较差'
      default: return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              LLM智能报告生成系统
            </h1>
            <p className="text-gray-600 mt-1">基于大语言模型的智能报告生成，支持自定义模板、可视化图表嵌入和多格式导出</p>
          </div>

          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generate">AI生成</TabsTrigger>
              <TabsTrigger value="templates">模板管理</TabsTrigger>
              <TabsTrigger value="batch">批量生成</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Configuration */}
                <div className="lg:col-span-2 space-y-6">
                  {/* LLM Provider Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        LLM模型选择
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {LLM_PROVIDERS.map((provider) => (
                          <div
                            key={provider.id}
                            className={cn(
                              "border rounded-lg p-4 cursor-pointer transition-all",
                              selectedProvider === provider.id
                                ? "border-blue-500 bg-blue-50"
                                : provider.status === 'active'
                                ? "border-gray-200 hover:border-gray-300"
                                : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
                            )}
                            onClick={() => provider.status === 'active' && setSelectedProvider(provider.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{provider.name}</h4>
                              <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                                {provider.status === 'active' ? '可用' : '维护中'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>模型: {provider.model}</span>
                              <span>最大Token: {provider.maxTokens.toLocaleString()}</span>
                              {provider.supportsChinese && (
                                <Badge variant="outline" className="text-xs">
                                  中文
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Template Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="w-5 h-5" />
                        报告模板选择
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {SYSTEM_TEMPLATES.map((template) => (
                          <div
                            key={template.id}
                            className={cn(
                              "border rounded-lg p-4 cursor-pointer transition-all",
                              selectedTemplate === template.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                            onClick={() => setSelectedTemplate(template.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {template.category === 'academic' ? '学术' : 
                                   template.category === 'evaluation' ? '评估' : 
                                   template.category === 'analytics' ? '分析' : '总结'}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  使用 {template.useCount} 次
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <List className="w-3 h-3" />
                                {template.structure.length} 个章节
                              </span>
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                AI智能生成
                              </span>
                              <span className="flex items-center gap-1">
                                <BarChart3 className="w-3 h-3" />
                                包含图表
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Report Configuration */}
                  {selectedTemplate && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          报告配置
                        </CardTitle>
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

                        {/* Template Variables */}
                        {SYSTEM_TEMPLATES.find(t => t.id === selectedTemplate)?.variables.map((variable) => (
                          <div key={variable.id}>
                            <label className="text-sm font-medium text-gray-700">{variable.name}</label>
                            {variable.type === 'select' && variable.options ? (
                              <Select 
                                value={templateVariables[variable.id] || ''}
                                onValueChange={(value) => handleTemplateVariableChange(variable.id, value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder={`选择${variable.name}`} />
                                </SelectTrigger>
                                <SelectContent>
                                  {variable.options.map(option => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                placeholder={`输入${variable.name}...`}
                                value={templateVariables[variable.id] || ''}
                                onChange={(e) => handleTemplateVariableChange(variable.id, e.target.value)}
                                className="mt-1"
                              />
                            )}
                          </div>
                        ))}

                        {/* Custom Prompt */}
                        <div>
                          <label className="text-sm font-medium text-gray-700">自定义AI提示词（高级）</label>
                          <Textarea
                            placeholder="输入额外的AI指令，用于定制报告内容和风格..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="mt-1"
                            rows={3}
                          />
                        </div>

                        {/* Output Formats */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">输出格式</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {Object.entries(outputFormats).map(([format, enabled]) => (
                              <div
                                key={format}
                                className={cn(
                                  "flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all",
                                  enabled ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                )}
                                onClick={() => setOutputFormats(prev => ({ ...prev, [format]: !prev[format as keyof typeof prev] }))}
                              >
                                <Checkbox checked={enabled} />
                                <span className="font-medium uppercase">{format}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Generation Controls */}
                  {selectedTemplate && (
                    <div className="flex justify-end gap-3">
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        预览模板
                      </Button>
                      <Button
                        onClick={handleGenerateReport}
                        disabled={!reportTitle || isGenerating}
                        className="min-w-[140px]"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            开始AI生成
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Generation Progress */}
                  {isGenerating && (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{generationStage}</span>
                            <span className="font-medium">{Math.round(generationProgress)}%</span>
                          </div>
                          <Progress value={generationProgress} />
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 animate-pulse text-blue-600" />
                              AI正在使用 {LLM_PROVIDERS.find(p => p.id === selectedProvider)?.name} 智能分析数据并生成专业报告内容...
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* LLM Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        AI参数设置
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          创造性 ({llmTemperature[0]})
                        </label>
                        <Slider
                          value={llmTemperature}
                          onValueChange={setLlmTemperature}
                          max={1}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>保守</span>
                          <span>创新</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          最大长度 ({llmMaxTokens[0]})
                        </label>
                        <Slider
                          value={llmMaxTokens}
                          onValueChange={setLlmMaxTokens}
                          max={4000}
                          min={500}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>简洁</span>
                          <span>详细</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">内容审核</label>
                        <Checkbox 
                          checked={contentReviewMode}
                          onCheckedChange={setContentReviewMode}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">最近生成</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {generatedReports.slice(0, 3).map((report) => (
                          <div key={report.id} className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {report.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-xs", getQualityColor(report.quality))}
                                  >
                                    <Star className="w-3 h-3 mr-1" />
                                    {getQualityText(report.quality)}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    v{report.version}
                                  </Badge>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost">
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDate(report.generatedAt)} · {report.llmProvider}
                            </p>
                          </div>
                        ))}
                        <Button variant="link" className="w-full text-sm">
                          查看全部历史 <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Tips */}
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>AI生成提示</strong>
                      <br />
                      选择合适的LLM模型和模板，可以显著提高报告质量。Claude适合长文本分析，GPT-4擅长数据洞察。
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">报告模板管理</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  创建新模板
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SYSTEM_TEMPLATES.map((template) => (
                  <Card key={template.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <Badge variant={template.isSystem ? "secondary" : "default"}>
                          {template.isSystem ? '系统' : '自定义'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <List className="w-3 h-3" />
                          {template.structure.length} 章节
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {template.useCount} 次使用
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit2 className="w-3 h-3 mr-1" />
                          编辑
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Copy className="w-3 h-3 mr-1" />
                          复制
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="batch" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">批量生成任务</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新建批量任务
                </Button>
              </div>

              <div className="space-y-4">
                {batchTasks.map((task) => (
                  <Card key={task.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">{task.templateName}</h3>
                        <Badge variant={
                          task.status === 'completed' ? 'default' :
                          task.status === 'running' ? 'secondary' :
                          task.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {task.status === 'completed' ? '已完成' :
                           task.status === 'running' ? '运行中' :
                           task.status === 'failed' ? '失败' : '等待中'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            目标: {task.targets.join(', ')}
                          </span>
                          <span className="font-medium">
                            {task.completedReports}/{task.totalReports}
                          </span>
                        </div>
                        <Progress value={task.progress} />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>创建于 {formatDate(task.createdAt)}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            查看
                          </Button>
                          {task.status === 'running' && (
                            <Button size="sm" variant="outline">
                              <RotateCcw className="w-3 h-3 mr-1" />
                              暂停
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {batchTasks.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Database className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">暂无批量生成任务</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">生成历史 ({generatedReports.length})</h2>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="completed">已完成</SelectItem>
                      <SelectItem value="reviewing">审核中</SelectItem>
                      <SelectItem value="failed">失败</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {generatedReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{report.title}</h4>
                              <p className="text-sm text-gray-600">模板: {report.templateName}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={report.status === 'completed' ? 'default' : 
                                        report.status === 'reviewing' ? 'secondary' : 
                                        report.status === 'generating' ? 'outline' : 'destructive'}
                              >
                                {report.status === 'completed' ? '已完成' :
                                 report.status === 'reviewing' ? '审核中' :
                                 report.status === 'generating' ? '生成中' : '失败'}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={getQualityColor(report.quality)}
                              >
                                <Star className="w-3 h-3 mr-1" />
                                {getQualityText(report.quality)}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Bot className="w-3 h-3" />
                              {report.llmProvider}
                            </span>
                            <span>{formatDate(report.generatedAt)}</span>
                            <span>格式: {report.format.join(', ')}</span>
                            {report.size && <span>{formatFileSize(report.size)}</span>}
                            <span>v{report.version}</span>
                          </div>

                          {report.reviewComments && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 text-sm">
                                <MessageSquare className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium text-yellow-800">审核意见:</span>
                              </div>
                              <p className="text-sm text-yellow-700 mt-1">{report.reviewComments}</p>
                            </div>
                          )}

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
                            {report.status === 'reviewing' && (
                              <>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  审核
                                </Button>
                                <Button size="sm" variant="outline">
                                  <CheckSquare className="w-4 h-4 mr-1" />
                                  通过
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost">
                              <Copy className="w-4 h-4 mr-1" />
                              复制配置
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {generatedReports.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">暂无生成历史</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}