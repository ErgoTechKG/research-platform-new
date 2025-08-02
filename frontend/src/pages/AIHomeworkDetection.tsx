import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Brain, 
  Shield,
  Search,
  FileText,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  BarChart3,
  PieChart,
  Target,
  Star,
  Users,
  Activity,
  RefreshCw,
  Settings,
  FileCheck,
  FileMinus,
  AlertCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Zap,
  Filter,
  Calendar,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Sparkles,
  Award,
  Network,
  Bot,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DetectionResult {
  id: string
  fileName: string
  submissionDate: Date
  aiProbability: number
  similarityScore: number
  qualityScore: number
  confidenceLevel: number
  status: 'analyzing' | 'completed' | 'failed'
  detectedSources: string[]
  flaggedSections: DetectedSection[]
  writingAnalysis: WritingAnalysis
  reviewStatus: 'pending' | 'approved' | 'rejected' | 'needs_review'
}

interface DetectedSection {
  id: string
  text: string
  startPos: number
  endPos: number
  type: 'ai_generated' | 'plagiarized' | 'suspicious'
  confidence: number
  source?: string
  suggestion?: string
}

interface WritingAnalysis {
  originalityScore: number
  academicStandardScore: number
  logicalStructureScore: number
  languageExpressionScore: number
  overallQualityScore: number
  strengthPoints: string[]
  improvementAreas: string[]
  detailedFeedback: string
}

interface BatchDetectionJob {
  id: string
  name: string
  fileCount: number
  completedFiles: number
  startTime: Date
  estimatedCompletion?: Date
  status: 'running' | 'completed' | 'failed' | 'paused'
  results: DetectionResult[]
}

interface DetectionHistory {
  id: string
  date: Date
  totalFiles: number
  aiDetected: number
  plagiarismDetected: number
  averageQuality: number
  flaggedCount: number
}

interface SystemSettings {
  aiDetectionThreshold: number
  similarityThreshold: number
  qualityThreshold: number
  autoReview: boolean
  batchSize: number
  enableRealTimeAnalysis: boolean
}

const SAMPLE_DETECTION_RESULTS: DetectionResult[] = [
  {
    id: '1',
    fileName: '张三_机器学习课程作业.pdf',
    submissionDate: new Date('2024-11-15'),
    aiProbability: 85,
    similarityScore: 23,
    qualityScore: 78,
    confidenceLevel: 92,
    status: 'completed',
    detectedSources: ['学术论文库', '公开代码仓库'],
    flaggedSections: [
      {
        id: '1-1',
        text: '机器学习是一种人工智能技术，通过算法让计算机从数据中自动学习和改进，无需显式编程...',
        startPos: 245,
        endPos: 456,
        type: 'ai_generated',
        confidence: 87,
        suggestion: '建议用自己的话重新表述这段内容'
      },
      {
        id: '1-2',
        text: '在监督学习中，我们使用标记的训练数据来训练模型...',
        startPos: 1024,
        endPos: 1158,
        type: 'plagiarized',
        confidence: 94,
        source: '《机器学习导论》教科书',
        suggestion: '需要添加引用并用自己的理解重写'
      }
    ],
    writingAnalysis: {
      originalityScore: 68,
      academicStandardScore: 82,
      logicalStructureScore: 75,
      languageExpressionScore: 88,
      overallQualityScore: 78,
      strengthPoints: ['逻辑清晰', '语言表达流畅', '格式规范'],
      improvementAreas: ['原创性不足', '缺少个人见解', '引用不当'],
      detailedFeedback: '该作业整体结构合理，表达清晰，但存在较多AI生成内容和抄袭段落。建议增加个人理解和分析，确保内容原创性。'
    },
    reviewStatus: 'needs_review'
  },
  {
    id: '2',
    fileName: '李四_深度学习实验报告.docx',
    submissionDate: new Date('2024-11-14'),
    aiProbability: 45,
    similarityScore: 12,
    qualityScore: 91,
    confidenceLevel: 88,
    status: 'completed',
    detectedSources: [],
    flaggedSections: [],
    writingAnalysis: {
      originalityScore: 89,
      academicStandardScore: 92,
      logicalStructureScore: 88,
      languageExpressionScore: 94,
      overallQualityScore: 91,
      strengthPoints: ['原创性高', '实验设计合理', '数据分析深入', '结论有见地'],
      improvementAreas: ['图表标题可以更详细', '参考文献格式需规范'],
      detailedFeedback: '优秀的实验报告，展现了良好的学术写作能力和深入的理解。实验设计科学，数据分析全面，结论合理。'
    },
    reviewStatus: 'approved'
  }
]

const SAMPLE_BATCH_JOBS: BatchDetectionJob[] = [
  {
    id: '1',
    name: '机器学习课程期末作业批量检测',
    fileCount: 25,
    completedFiles: 18,
    startTime: new Date('2024-11-15 09:00'),
    estimatedCompletion: new Date('2024-11-15 11:30'),
    status: 'running',
    results: SAMPLE_DETECTION_RESULTS
  },
  {
    id: '2',
    name: '数据结构课程作业检测',
    fileCount: 30,
    completedFiles: 30,
    startTime: new Date('2024-11-14 14:00'),
    status: 'completed',
    results: []
  }
]

const SAMPLE_HISTORY: DetectionHistory[] = [
  { id: '1', date: new Date('2024-11-15'), totalFiles: 45, aiDetected: 12, plagiarismDetected: 8, averageQuality: 82.5, flaggedCount: 15 },
  { id: '2', date: new Date('2024-11-14'), totalFiles: 38, aiDetected: 9, plagiarismDetected: 5, averageQuality: 85.2, flaggedCount: 10 },
  { id: '3', date: new Date('2024-11-13'), totalFiles: 52, aiDetected: 15, plagiarismDetected: 12, averageQuality: 78.8, flaggedCount: 20 },
  { id: '4', date: new Date('2024-11-12'), totalFiles: 29, aiDetected: 6, plagiarismDetected: 3, averageQuality: 88.1, flaggedCount: 7 },
  { id: '5', date: new Date('2024-11-11'), totalFiles: 41, aiDetected: 11, plagiarismDetected: 7, averageQuality: 81.3, flaggedCount: 14 }
]

export default function AIHomeworkDetection() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>(SAMPLE_DETECTION_RESULTS)
  const [batchJobs, setBatchJobs] = useState<BatchDetectionJob[]>(SAMPLE_BATCH_JOBS)
  const [detectionHistory, setDetectionHistory] = useState<DetectionHistory[]>(SAMPLE_HISTORY)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedResult, setSelectedResult] = useState<DetectionResult | null>(null)
  const [textInput, setTextInput] = useState('')
  const [detectionMode, setDetectionMode] = useState<'file' | 'text' | 'batch'>('file')
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    aiDetectionThreshold: 70,
    similarityThreshold: 30,
    qualityThreshold: 60,
    autoReview: false,
    batchSize: 10,
    enableRealTimeAnalysis: true
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
  }

  const handleSingleDetection = async () => {
    if (detectionMode === 'text' && !textInput.trim()) return
    if (detectionMode === 'file' && selectedFiles.length === 0) return

    setIsAnalyzing(true)

    // Simulate AI detection process
    setTimeout(() => {
      const newResult: DetectionResult = {
        id: Date.now().toString(),
        fileName: detectionMode === 'text' ? '文本输入内容' : selectedFiles[0].name,
        submissionDate: new Date(),
        aiProbability: Math.floor(Math.random() * 100),
        similarityScore: Math.floor(Math.random() * 100),
        qualityScore: Math.floor(Math.random() * 40) + 60,
        confidenceLevel: Math.floor(Math.random() * 20) + 80,
        status: 'completed',
        detectedSources: [],
        flaggedSections: [],
        writingAnalysis: {
          originalityScore: Math.floor(Math.random() * 40) + 60,
          academicStandardScore: Math.floor(Math.random() * 30) + 70,
          logicalStructureScore: Math.floor(Math.random() * 30) + 70,
          languageExpressionScore: Math.floor(Math.random() * 20) + 80,
          overallQualityScore: Math.floor(Math.random() * 40) + 60,
          strengthPoints: ['表达清晰', '逻辑合理'],
          improvementAreas: ['需要更多原创内容'],
          detailedFeedback: '分析完成，请查看详细报告。'
        },
        reviewStatus: 'pending'
      }

      setDetectionResults(prev => [newResult, ...prev])
      setSelectedResult(newResult)
      setIsAnalyzing(false)
      setSelectedFiles([])
      setTextInput('')
    }, 3000)
  }

  const handleBatchDetection = () => {
    if (selectedFiles.length === 0) return

    const newJob: BatchDetectionJob = {
      id: Date.now().toString(),
      name: `批量检测_${new Date().toLocaleDateString()}`,
      fileCount: selectedFiles.length,
      completedFiles: 0,
      startTime: new Date(),
      status: 'running',
      results: []
    }

    setBatchJobs(prev => [newJob, ...prev])
    setSelectedFiles([])

    // Simulate batch processing
    const interval = setInterval(() => {
      setBatchJobs(prev => prev.map(job => {
        if (job.id === newJob.id && job.completedFiles < job.fileCount) {
          return { ...job, completedFiles: job.completedFiles + 1 }
        }
        if (job.id === newJob.id && job.completedFiles >= job.fileCount) {
          clearInterval(interval)
          return { ...job, status: 'completed' as const }
        }
        return job
      }))
    }, 1000)
  }

  const getStatusColor = (status: DetectionResult['status']) => {
    switch (status) {
      case 'analyzing': return 'text-blue-600 bg-blue-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getReviewStatusColor = (status: DetectionResult['reviewStatus']) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50'
      case 'rejected': return 'text-red-600 bg-red-50'
      case 'needs_review': return 'text-orange-600 bg-orange-50'
      case 'pending': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRiskLevel = (aiProbability: number, similarityScore: number) => {
    if (aiProbability > 80 || similarityScore > 50) return { level: 'high', color: 'text-red-600' }
    if (aiProbability > 60 || similarityScore > 30) return { level: 'medium', color: 'text-orange-600' }
    return { level: 'low', color: 'text-green-600' }
  }

  const generateReport = (result: DetectionResult) => {
    // Mock report generation
    alert(`正在生成 ${result.fileName} 的详细检测报告...`)
  }

  const exportResults = () => {
    // Mock export functionality
    alert('正在导出检测结果...')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                AI作业检测系统
              </h1>
              <p className="text-gray-600 mt-1">AI内容识别 • 相似度检测 • 质量评分 • 智能审核</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                导出结果
              </Button>
              <Button size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                刷新数据
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">AI检测准确率</p>
                    <p className="text-2xl font-bold">92.5%</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">↑ 2.3% 较上月</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">今日检测数量</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileCheck className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2">45 个待审核</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">异常检出率</p>
                    <p className="text-2xl font-bold">18.3%</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-orange-600 mt-2">需要人工复核</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">平均质量分</p>
                    <p className="text-2xl font-bold">83.7</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-2">质量整体良好</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="detection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="detection">内容检测</TabsTrigger>
              <TabsTrigger value="results">检测结果</TabsTrigger>
              <TabsTrigger value="batch">批量处理</TabsTrigger>
              <TabsTrigger value="history">检测历史</TabsTrigger>
              <TabsTrigger value="settings">系统设置</TabsTrigger>
            </TabsList>

            {/* Content Detection Tab */}
            <TabsContent value="detection" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Search className="w-5 h-5" />
                          智能检测
                        </span>
                        <Select value={detectionMode} onValueChange={(value: 'file' | 'text' | 'batch') => setDetectionMode(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="file">文件上传</SelectItem>
                            <SelectItem value="text">文本输入</SelectItem>
                            <SelectItem value="batch">批量检测</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {detectionMode === 'text' && (
                        <div className="space-y-4">
                          <Label>请输入待检测文本内容</Label>
                          <Textarea
                            placeholder="粘贴或输入需要检测的文本内容..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            className="min-h-[200px]"
                          />
                          <div className="text-xs text-gray-500">
                            字符数: {textInput.length} | 建议最少100字符以确保检测准确性
                          </div>
                        </div>
                      )}

                      {(detectionMode === 'file' || detectionMode === 'batch') && (
                        <div className="space-y-4">
                          <div
                            className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            <input
                              id="file-upload"
                              type="file"
                              multiple={detectionMode === 'batch'}
                              className="hidden"
                              onChange={handleFileUpload}
                              accept=".pdf,.doc,.docx,.txt,.md"
                            />
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {detectionMode === 'batch' ? '批量上传文件' : '上传单个文件'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              支持 PDF、Word、TXT、Markdown 格式
                            </p>
                            <p className="text-xs text-gray-500">
                              {detectionMode === 'batch' ? '最多支持50个文件同时上传' : '单个文件大小限制10MB'}
                            </p>
                          </div>

                          {selectedFiles.length > 0 && (
                            <div className="space-y-2">
                              <Label>已选择文件 ({selectedFiles.length})</Label>
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {selectedFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-600" />
                                      <span className="text-sm truncate">{file.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(1)} MB
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {isAnalyzing && (
                        <Alert>
                          <Brain className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p>AI正在分析内容，预计需要30-60秒...</p>
                              <Progress value={33} className="w-full" />
                              <div className="text-xs text-gray-600">
                                正在进行：内容识别 → 相似度检测 → 质量评分
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          {detectionMode === 'batch' ? 
                            `将检测 ${selectedFiles.length} 个文件` :
                            detectionMode === 'text' ? 
                              `将检测 ${textInput.length} 个字符` :
                              selectedFiles.length > 0 ? `将检测 ${selectedFiles[0].name}` : '请选择文件或输入文本'
                          }
                        </div>
                        <div className="flex gap-2">
                          {detectionMode === 'batch' ? (
                            <Button 
                              onClick={handleBatchDetection} 
                              disabled={selectedFiles.length === 0 || isAnalyzing}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              开始批量检测
                            </Button>
                          ) : (
                            <Button 
                              onClick={handleSingleDetection} 
                              disabled={(detectionMode === 'file' && selectedFiles.length === 0) || 
                                       (detectionMode === 'text' && !textInput.trim()) || 
                                       isAnalyzing}
                            >
                              <Brain className="w-4 h-4 mr-2" />
                              开始检测
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detection Configuration */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">检测配置</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>AI检测阈值: {systemSettings.aiDetectionThreshold}%</Label>
                        <Slider
                          value={[systemSettings.aiDetectionThreshold]}
                          onValueChange={(value) => setSystemSettings(prev => ({ ...prev, aiDetectionThreshold: value[0] }))}
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>相似度阈值: {systemSettings.similarityThreshold}%</Label>
                        <Slider
                          value={[systemSettings.similarityThreshold]}
                          onValueChange={(value) => setSystemSettings(prev => ({ ...prev, similarityThreshold: value[0] }))}
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>质量评分阈值: {systemSettings.qualityThreshold}%</Label>
                        <Slider
                          value={[systemSettings.qualityThreshold]}
                          onValueChange={(value) => setSystemSettings(prev => ({ ...prev, qualityThreshold: value[0] }))}
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto-review"
                          checked={systemSettings.autoReview}
                          onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoReview: checked }))}
                        />
                        <Label htmlFor="auto-review">自动审核</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">检测说明</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">AI内容识别</p>
                            <p className="text-xs text-gray-600">检测GPT、Claude等AI工具生成的文本</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Search className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">相似度检测</p>
                            <p className="text-xs text-gray-600">与历史作业和网络资源对比</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">质量评分</p>
                            <p className="text-xs text-gray-600">多维度评估内容质量</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Detection Results Tab */}
            <TabsContent value="results" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {detectionResults.map((result) => (
                    <Card 
                      key={result.id} 
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedResult?.id === result.id ? "ring-2 ring-blue-500" : ""
                      )}
                      onClick={() => setSelectedResult(result)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{result.fileName}</h3>
                            <p className="text-sm text-gray-600">
                              提交时间: {result.submissionDate.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(result.status)}>
                              {result.status === 'analyzing' ? '分析中' : 
                               result.status === 'completed' ? '已完成' : '失败'}
                            </Badge>
                            <Badge className={getReviewStatusColor(result.reviewStatus)}>
                              {result.reviewStatus === 'approved' ? '已通过' :
                               result.reviewStatus === 'rejected' ? '未通过' :
                               result.reviewStatus === 'needs_review' ? '需复核' : '待审核'}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className={cn(
                              "text-2xl font-bold",
                              getRiskLevel(result.aiProbability, result.similarityScore).color
                            )}>
                              {result.aiProbability}%
                            </div>
                            <div className="text-xs text-gray-600">AI概率</div>
                          </div>
                          <div className="text-center">
                            <div className={cn(
                              "text-2xl font-bold",
                              result.similarityScore > 30 ? "text-orange-600" : "text-green-600"
                            )}>
                              {result.similarityScore}%
                            </div>
                            <div className="text-xs text-gray-600">相似度</div>
                          </div>
                          <div className="text-center">
                            <div className={cn(
                              "text-2xl font-bold",
                              result.qualityScore > 80 ? "text-green-600" : 
                              result.qualityScore > 60 ? "text-orange-600" : "text-red-600"
                            )}>
                              {result.qualityScore}
                            </div>
                            <div className="text-xs text-gray-600">质量分</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{result.confidenceLevel}%</div>
                            <div className="text-xs text-gray-600">置信度</div>
                          </div>
                        </div>

                        {result.flaggedSections.length > 0 && (
                          <Alert className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              发现 {result.flaggedSections.length} 个可疑段落需要关注
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            风险等级: <span className={getRiskLevel(result.aiProbability, result.similarityScore).color}>
                              {getRiskLevel(result.aiProbability, result.similarityScore).level === 'high' ? '高风险' :
                               getRiskLevel(result.aiProbability, result.similarityScore).level === 'medium' ? '中等风险' : '低风险'}
                            </span>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              generateReport(result)
                            }}
                          >
                            生成报告
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Result View */}
                <div className="space-y-4">
                  {selectedResult ? (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">详细分析</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">写作质量评估</Label>
                            <div className="space-y-2 mt-2">
                              <div className="flex justify-between text-sm">
                                <span>原创性</span>
                                <span>{selectedResult.writingAnalysis.originalityScore}/100</span>
                              </div>
                              <Progress value={selectedResult.writingAnalysis.originalityScore} />
                              
                              <div className="flex justify-between text-sm">
                                <span>学术规范</span>
                                <span>{selectedResult.writingAnalysis.academicStandardScore}/100</span>
                              </div>
                              <Progress value={selectedResult.writingAnalysis.academicStandardScore} />
                              
                              <div className="flex justify-between text-sm">
                                <span>逻辑结构</span>
                                <span>{selectedResult.writingAnalysis.logicalStructureScore}/100</span>
                              </div>
                              <Progress value={selectedResult.writingAnalysis.logicalStructureScore} />
                              
                              <div className="flex justify-between text-sm">
                                <span>语言表达</span>
                                <span>{selectedResult.writingAnalysis.languageExpressionScore}/100</span>
                              </div>
                              <Progress value={selectedResult.writingAnalysis.languageExpressionScore} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">优势与改进</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-green-600">优势特点</Label>
                            <div className="space-y-1 mt-2">
                              {selectedResult.writingAnalysis.strengthPoints.map((point, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-orange-600">改进建议</Label>
                            <div className="space-y-1 mt-2">
                              {selectedResult.writingAnalysis.improvementAreas.map((area, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <AlertCircle className="w-3 h-3 text-orange-600" />
                                  <span>{area}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {selectedResult.flaggedSections.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">可疑段落</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {selectedResult.flaggedSections.map((section) => (
                              <div key={section.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className={
                                    section.type === 'ai_generated' ? 'text-blue-600' :
                                    section.type === 'plagiarized' ? 'text-red-600' : 'text-orange-600'
                                  }>
                                    {section.type === 'ai_generated' ? 'AI生成' :
                                     section.type === 'plagiarized' ? '抄袭' : '可疑'}
                                  </Badge>
                                  <span className="text-xs text-gray-500">置信度: {section.confidence}%</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2 italic">
                                  "{section.text.substring(0, 100)}..."
                                </p>
                                {section.source && (
                                  <p className="text-xs text-gray-600 mb-1">
                                    来源: {section.source}
                                  </p>
                                )}
                                {section.suggestion && (
                                  <p className="text-xs text-blue-600">
                                    建议: {section.suggestion}
                                  </p>
                                )}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">选择检测结果</h3>
                        <p className="text-sm text-gray-600">点击左侧任一检测结果查看详细分析</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Batch Processing Tab */}
            <TabsContent value="batch" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    批量检测管理
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {batchJobs.map((job) => (
                      <Card key={job.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{job.name}</h3>
                              <p className="text-sm text-gray-600">
                                开始时间: {job.startTime.toLocaleString()}
                              </p>
                              {job.estimatedCompletion && (
                                <p className="text-sm text-gray-600">
                                  预计完成: {job.estimatedCompletion.toLocaleString()}
                                </p>
                              )}
                            </div>
                            <Badge className={
                              job.status === 'running' ? 'text-blue-600 bg-blue-50' :
                              job.status === 'completed' ? 'text-green-600 bg-green-50' :
                              job.status === 'failed' ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50'
                            }>
                              {job.status === 'running' ? '进行中' :
                               job.status === 'completed' ? '已完成' :
                               job.status === 'failed' ? '失败' : '已暂停'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>进度</span>
                              <span>{job.completedFiles}/{job.fileCount} 个文件</span>
                            </div>
                            <Progress value={(job.completedFiles / job.fileCount) * 100} />
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-sm text-gray-600">
                              完成率: {Math.round((job.completedFiles / job.fileCount) * 100)}%
                            </div>
                            <div className="flex gap-2">
                              {job.status === 'running' && (
                                <Button size="sm" variant="outline">
                                  暂停
                                </Button>
                              )}
                              {job.status === 'completed' && (
                                <Button size="sm" variant="outline">
                                  查看结果
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detection History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    检测历史统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">日期</th>
                          <th className="text-center py-3 px-4">检测总数</th>
                          <th className="text-center py-3 px-4">AI检出</th>
                          <th className="text-center py-3 px-4">抄袭检出</th>
                          <th className="text-center py-3 px-4">平均质量</th>
                          <th className="text-center py-3 px-4">标记数量</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detectionHistory.map((record) => (
                          <tr key={record.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{record.date.toLocaleDateString()}</td>
                            <td className="text-center py-3 px-4">{record.totalFiles}</td>
                            <td className="text-center py-3 px-4 text-orange-600">{record.aiDetected}</td>
                            <td className="text-center py-3 px-4 text-red-600">{record.plagiarismDetected}</td>
                            <td className="text-center py-3 px-4">
                              <span className={cn(
                                "font-medium",
                                record.averageQuality > 85 ? "text-green-600" :
                                record.averageQuality > 70 ? "text-orange-600" : "text-red-600"
                              )}>
                                {record.averageQuality}
                              </span>
                            </td>
                            <td className="text-center py-3 px-4">{record.flaggedCount}</td>
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
                    <CardTitle className="text-base">检测趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold">205</div>
                      <div className="text-sm text-gray-600 mt-1">本周总检测数</div>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">较上周 +15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">检出率统计</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">AI内容</span>
                        <span className="text-sm font-medium text-orange-600">23.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">抄袭内容</span>
                        <span className="text-sm font-medium text-red-600">15.8%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">正常内容</span>
                        <span className="text-sm font-medium text-green-600">60.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">质量分布</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">优秀(85+)</span>
                        <span className="text-sm font-medium text-green-600">32%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">良好(70-84)</span>
                        <span className="text-sm font-medium text-blue-600">45%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">需改进(70以下)</span>
                        <span className="text-sm font-medium text-orange-600">23%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    系统参数配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">检测阈值设置</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>AI检测敏感度: {systemSettings.aiDetectionThreshold}%</Label>
                          <Slider
                            value={[systemSettings.aiDetectionThreshold]}
                            onValueChange={(value) => setSystemSettings(prev => ({ ...prev, aiDetectionThreshold: value[0] }))}
                            max={100}
                            min={0}
                            step={5}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            较低值会检测出更多AI内容，但可能增加误报率
                          </p>
                        </div>
                        
                        <div>
                          <Label>相似度警告阈值: {systemSettings.similarityThreshold}%</Label>
                          <Slider
                            value={[systemSettings.similarityThreshold]}
                            onValueChange={(value) => setSystemSettings(prev => ({ ...prev, similarityThreshold: value[0] }))}
                            max={100}
                            min={0}
                            step={5}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            超过此阈值将标记为可能的抄袭行为
                          </p>
                        </div>
                        
                        <div>
                          <Label>质量评分合格线: {systemSettings.qualityThreshold}%</Label>
                          <Slider
                            value={[systemSettings.qualityThreshold]}
                            onValueChange={(value) => setSystemSettings(prev => ({ ...prev, qualityThreshold: value[0] }))}
                            max={100}
                            min={0}
                            step={5}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            低于此分数的作业将被标记为需要改进
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">处理配置</h3>
                      <div className="space-y-4">
                        <div>
                          <Label>批处理大小: {systemSettings.batchSize}</Label>
                          <Slider
                            value={[systemSettings.batchSize]}
                            onValueChange={(value) => setSystemSettings(prev => ({ ...prev, batchSize: value[0] }))}
                            max={50}
                            min={1}
                            step={1}
                            className="mt-2"
                          />
                          <p className="text-xs text-gray-600 mt-1">
                            同时处理的文件数量，影响检测速度和系统负载
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>自动审核模式</Label>
                            <p className="text-xs text-gray-600 mt-1">
                              低风险检测结果自动通过审核
                            </p>
                          </div>
                          <Switch
                            checked={systemSettings.autoReview}
                            onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoReview: checked }))}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>实时分析</Label>
                            <p className="text-xs text-gray-600 mt-1">
                              文件上传后立即开始分析
                            </p>
                          </div>
                          <Switch
                            checked={systemSettings.enableRealTimeAnalysis}
                            onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, enableRealTimeAnalysis: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">配置管理</h3>
                        <p className="text-sm text-gray-600">保存或重置系统配置</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">重置默认</Button>
                        <Button>保存配置</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>模型信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold">AI检测模型</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        版本: v2.1.3<br />
                        准确率: 92.5%<br />
                        最后更新: 2024-11-01
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Search className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold">相似度检测</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        算法: LSH + 语义匹配<br />
                        数据库: 5000万+ 文档<br />
                        响应时间: &lt;3秒
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold">质量评估</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        维度: 4个评估维度<br />
                        标准: 学术写作规范<br />
                        校准: 专家标注数据
                      </p>
                    </div>
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