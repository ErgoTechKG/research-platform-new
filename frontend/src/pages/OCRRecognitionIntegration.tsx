import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Upload, 
  FileImage, 
  CheckCircle, 
  AlertTriangle,
  X,
  Eye,
  RotateCcw,
  Zap,
  FileText,
  Scan,
  Settings,
  Languages,
  Download,
  Edit3
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface OCRResult {
  field: string
  value: string
  confidence: number
  verified: boolean
  originalText?: string
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface ProcessedImage {
  id: string
  name: string
  url: string
  size: number
  status: 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  ocrResults: OCRResult[]
  language: string
  processingTime?: number
  accuracy?: number
  error?: string
}

const SUPPORTED_LANGUAGES = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
]

const MOCK_OCR_RESULTS = {
  competition: [
    { field: '竞赛名称', value: '全国大学生数学建模竞赛', confidence: 95, verified: true },
    { field: '获奖等级', value: '国家级一等奖', confidence: 90, verified: true },
    { field: '获奖日期', value: '2024年11月', confidence: 75, verified: false },
    { field: '参赛者姓名', value: '张三', confidence: 88, verified: true },
    { field: '学校名称', value: '华中科技大学', confidence: 92, verified: true }
  ],
  certificate: [
    { field: '证书类型', value: '英语四级证书', confidence: 96, verified: true },
    { field: '成绩分数', value: '568分', confidence: 90, verified: true },
    { field: '考试时间', value: '2024年6月', confidence: 82, verified: false },
    { field: '姓名', value: '张三', confidence: 94, verified: true },
    { field: '身份证号', value: '420***********1234', confidence: 85, verified: true }
  ],
  research: [
    { field: '项目名称', value: '基于深度学习的图像识别研究', confidence: 88, verified: true },
    { field: '项目类型', value: '国家级大学生创新训练项目', confidence: 85, verified: true },
    { field: '项目编号', value: '202410487123', confidence: 92, verified: true },
    { field: '负责人', value: '张三', confidence: 90, verified: true },
    { field: '指导教师', value: '李教授', confidence: 78, verified: false }
  ]
}

export default function OCRRecognitionIntegration() {
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN')
  const [isProcessing, setIsProcessing] = useState(false)
  const [editingResult, setEditingResult] = useState<{ imageId: string, fieldIndex: number } | null>(null)
  const [editValue, setEditValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const detectImageType = (filename: string): 'competition' | 'certificate' | 'research' => {
    const lower = filename.toLowerCase()
    if (lower.includes('竞赛') || lower.includes('比赛') || lower.includes('contest') || lower.includes('competition')) {
      return 'competition'
    }
    if (lower.includes('证书') || lower.includes('certificate') || lower.includes('四级') || lower.includes('六级')) {
      return 'certificate'
    }
    return 'research'
  }

  const simulateOCR = (image: ProcessedImage) => {
    const imageType = detectImageType(image.name)
    const mockResults = MOCK_OCR_RESULTS[imageType]
    
    // Add some randomization to make it more realistic
    const results: OCRResult[] = mockResults.map(result => ({
      ...result,
      confidence: Math.max(60, result.confidence + (Math.random() - 0.5) * 20),
      verified: result.confidence > 85 ? true : Math.random() > 0.3
    }))

    const processingTime = Math.random() * 3000 + 2000 // 2-5 seconds
    const accuracy = Math.round(results.reduce((sum, r) => sum + r.confidence, 0) / results.length)

    setTimeout(() => {
      setImages(prev => prev.map(img => 
        img.id === image.id
          ? {
              ...img,
              status: 'completed',
              progress: 100,
              ocrResults: results,
              processingTime: Math.round(processingTime),
              accuracy
            }
          : img
      ))
      setIsProcessing(false)
    }, processingTime)

    // Update progress during processing
    const progressInterval = setInterval(() => {
      setImages(prev => prev.map(img => {
        if (img.id === image.id && img.status === 'processing') {
          const newProgress = Math.min(img.progress + Math.random() * 15, 95)
          return { ...img, progress: newProgress }
        }
        return img
      }))
    }, 300)

    setTimeout(() => clearInterval(progressInterval), processingTime)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsProcessing(true)
    
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件 (JPG, PNG, GIF, WebP)')
        return
      }

      // Validate file size (10MB limit for OCR)
      if (file.size > 10 * 1024 * 1024) {
        alert('图片文件大小不能超过 10MB')
        return
      }

      const imageUrl = URL.createObjectURL(file)
      const newImage: ProcessedImage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: imageUrl,
        size: file.size,
        status: 'processing',
        progress: 0,
        ocrResults: [],
        language: selectedLanguage
      }

      setImages(prev => [...prev, newImage])
      simulateOCR(newImage)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const retryOCR = (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    setIsProcessing(true)
    setImages(prev => prev.map(img => 
      img.id === imageId
        ? { ...img, status: 'processing', progress: 0, ocrResults: [], error: undefined }
        : img
    ))

    simulateOCR(image)
  }

  const deleteImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  const startEditing = (imageId: string, fieldIndex: number) => {
    const image = images.find(img => img.id === imageId)
    if (image && image.ocrResults[fieldIndex]) {
      setEditingResult({ imageId, fieldIndex })
      setEditValue(image.ocrResults[fieldIndex].value)
    }
  }

  const saveEdit = () => {
    if (!editingResult) return

    setImages(prev => prev.map(img => {
      if (img.id === editingResult.imageId) {
        const newResults = [...img.ocrResults]
        newResults[editingResult.fieldIndex] = {
          ...newResults[editingResult.fieldIndex],
          value: editValue,
          verified: true
        }
        return { ...img, ocrResults: newResults }
      }
      return img
    }))

    setEditingResult(null)
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditingResult(null)
    setEditValue('')
  }

  const toggleVerification = (imageId: string, fieldIndex: number) => {
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const newResults = [...img.ocrResults]
        newResults[fieldIndex] = {
          ...newResults[fieldIndex],
          verified: !newResults[fieldIndex].verified
        }
        return { ...img, ocrResults: newResults }
      }
      return img
    }))
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 90) return 'default'
    if (confidence >= 75) return 'secondary'
    return 'destructive'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const exportResults = (imageId: string) => {
    const image = images.find(img => img.id === imageId)
    if (!image) return

    const results = {
      fileName: image.name,
      language: image.language,
      accuracy: image.accuracy,
      processingTime: image.processingTime,
      results: image.ocrResults.map(result => ({
        field: result.field,
        value: result.value,
        confidence: result.confidence,
        verified: result.verified
      }))
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ocr-results-${image.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">OCR识别集成</h1>
            <p className="text-gray-600 mt-1">智能文字识别，自动提取证书信息</p>
          </div>

          {/* Upload and Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                图片上传与识别设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="language">识别语言</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <div className="flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    选择图片
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Settings className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">OCR识别说明</h4>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      <li>• 支持 JPG, PNG, GIF, WebP 格式，最大 10MB</li>
                      <li>• 建议上传清晰、正向的证书或竞赛获奖图片</li>
                      <li>• 识别结果可手动验证和修正</li>
                      <li>• 支持多语言识别，识别准确率通常在 75-95% 之间</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Processing Queue */}
          {images.length > 0 && (
            <div className="space-y-6">
              {images.map((image) => (
                <Card key={image.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileImage className="w-5 h-5" />
                        {image.name}
                        <Badge variant="outline">{formatFileSize(image.size)}</Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {image.status === 'processing' && (
                          <Badge variant="secondary">
                            <Zap className="w-3 h-3 mr-1 animate-pulse" />
                            识别中...
                          </Badge>
                        )}
                        {image.status === 'completed' && (
                          <Badge variant="default">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            已完成
                          </Badge>
                        )}
                        {image.status === 'failed' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            识别失败
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Image Preview */}
                      <div className="space-y-3">
                        <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-4 h-4 mr-1" />
                            预览
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteImage(image.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Processing Status */}
                      <div className="lg:col-span-2 space-y-4">
                        {image.status === 'processing' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span>识别进度</span>
                              <span>{Math.round(image.progress)}%</span>
                            </div>
                            <Progress value={image.progress} className="h-2" />
                            <div className="text-sm text-gray-600">
                              正在使用 {SUPPORTED_LANGUAGES.find(l => l.code === image.language)?.name} 进行识别...
                            </div>
                          </div>
                        )}

                        {image.status === 'failed' && (
                          <div className="space-y-3">
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                {image.error || '识别失败，请检查图片质量或重试'}
                              </AlertDescription>
                            </Alert>
                            <Button onClick={() => retryOCR(image.id)} size="sm">
                              <RotateCcw className="w-4 h-4 mr-1" />
                              重新识别
                            </Button>
                          </div>
                        )}

                        {image.status === 'completed' && (
                          <div className="space-y-4">
                            {/* Processing Stats */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <div className="text-lg font-semibold">{image.accuracy}%</div>
                                <div className="text-sm text-gray-600">平均准确率</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">{image.processingTime}ms</div>
                                <div className="text-sm text-gray-600">处理时间</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">{image.ocrResults.length}</div>
                                <div className="text-sm text-gray-600">识别字段</div>
                              </div>
                            </div>

                            {/* OCR Results */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">OCR识别结果</h4>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => exportResults(image.id)}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  导出结果
                                </Button>
                              </div>
                              
                              <div className="space-y-2">
                                {image.ocrResults.map((result, index) => (
                                  <div 
                                    key={index}
                                    className="flex items-center gap-3 p-3 border rounded-lg"
                                  >
                                    <div className="flex-shrink-0 w-24">
                                      <Label className="text-sm font-medium">{result.field}</Label>
                                    </div>
                                    
                                    <div className="flex-1">
                                      {editingResult?.imageId === image.id && editingResult?.fieldIndex === index ? (
                                        <div className="flex gap-2">
                                          <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="flex-1"
                                          />
                                          <Button size="sm" onClick={saveEdit}>
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>
                                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                                            <X className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">{result.value}</span>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => startEditing(image.id, index)}
                                          >
                                            <Edit3 className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Badge 
                                        variant={getConfidenceBadgeVariant(result.confidence)}
                                        className="text-xs"
                                      >
                                        {Math.round(result.confidence)}%
                                      </Badge>
                                      
                                      <Button
                                        size="sm"
                                        variant={result.verified ? "default" : "outline"}
                                        onClick={() => toggleVerification(image.id, index)}
                                      >
                                        {result.verified ? (
                                          <CheckCircle className="w-4 h-4" />
                                        ) : (
                                          <AlertTriangle className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Summary */}
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                  <Zap className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium">识别总结：</span>
                                  <span className="text-green-600">
                                    ✓ {image.ocrResults.filter(r => r.verified).length} 项已验证
                                  </span>
                                  <span className="text-orange-600">
                                    ⚡ {image.ocrResults.filter(r => !r.verified).length} 项需确认
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Scan className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  开始OCR识别
                </h3>
                <p className="text-gray-600 mb-4">
                  上传证书或竞赛获奖图片，AI将自动识别并提取关键信息
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  上传第一张图片
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}