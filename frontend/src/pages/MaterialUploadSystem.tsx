import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Upload, 
  FileText, 
  Image, 
  File,
  CheckCircle, 
  AlertTriangle,
  X,
  Trash2,
  Eye,
  FolderOpen,
  HardDrive,
  Clock,
  RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  category: 'document' | 'image' | 'certificate' | 'other'
  status: 'uploading' | 'uploaded' | 'failed' | 'processing'
  progress: number
  preview?: string
  error?: string
  uploadedAt?: Date
}

const FILE_CATEGORIES = {
  document: { label: '文档资料', icon: FileText, color: 'blue' },
  image: { label: '图片资料', icon: Image, color: 'green' },
  certificate: { label: '证书文件', icon: FileText, color: 'purple' },
  other: { label: '其他文件', icon: File, color: 'gray' }
}

const SUPPORTED_FORMATS = {
  'application/pdf': 'document',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'image/jpeg': 'image',
  'image/jpg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'text/plain': 'document'
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 20

export default function MaterialUploadSystem() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isUploading, setIsUploading] = useState(false)

  const categorizeFile = (type: string, name: string): UploadFile['category'] => {
    // Auto-categorize based on file type and name
    if (name.toLowerCase().includes('证书') || name.toLowerCase().includes('certificate')) {
      return 'certificate'
    }
    return (SUPPORTED_FORMATS[type as keyof typeof SUPPORTED_FORMATS] as UploadFile['category']) || 'other'
  }

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `文件大小超过限制 (${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB)`
    }
    
    if (!SUPPORTED_FORMATS[file.type as keyof typeof SUPPORTED_FORMATS]) {
      return '不支持的文件格式'
    }

    return null
  }

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const newFiles: UploadFile[] = []
    
    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      
      if (files.length + newFiles.length >= MAX_FILES) {
        return
      }

      const uploadFile: UploadFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        category: categorizeFile(file.type, file.name),
        status: error ? 'failed' : 'uploading',
        progress: 0,
        error: error || undefined
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, preview: e.target?.result as string }
              : f
          ))
        }
        reader.readAsDataURL(file)
      }

      newFiles.push(uploadFile)
    })

    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles])
      simulateUpload(newFiles)
    }
  }, [files.length])

  const simulateUpload = (filesToUpload: UploadFile[]) => {
    setIsUploading(true)
    
    filesToUpload.forEach((file) => {
      if (file.status === 'failed') return

      // Simulate upload progress
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...f,
                progress: 100,
                status: 'uploaded' as const,
                uploadedAt: new Date()
              }
            }
            return { ...f, progress: newProgress }
          }
          return f
        }))
      }, 300)

      // Auto-stop after 5 seconds
      setTimeout(() => {
        clearInterval(interval)
        setFiles(prev => prev.map(f => 
          f.id === file.id && f.progress < 100
            ? { ...f, progress: 100, status: 'uploaded', uploadedAt: new Date() }
            : f
        ))
      }, 5000)
    })

    // Reset uploading state after all files are processed
    setTimeout(() => {
      setIsUploading(false)
    }, 6000)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0, error: undefined }
        : f
    ))
    
    const fileToRetry = files.find(f => f.id === fileId)
    if (fileToRetry) {
      simulateUpload([fileToRetry])
    }
  }

  const getFilteredFiles = () => {
    if (selectedCategory === 'all') return files
    return files.filter(file => file.category === selectedCategory)
  }

  const getCategoryStats = () => {
    return Object.entries(FILE_CATEGORIES).map(([key, config]) => ({
      key,
      label: config.label,
      count: files.filter(f => f.category === key).length,
      color: config.color
    }))
  }

  const getUploadStats = () => {
    const totalFiles = files.length
    const uploadedFiles = files.filter(f => f.status === 'uploaded').length
    const failedFiles = files.filter(f => f.status === 'failed').length
    const uploadingFiles = files.filter(f => f.status === 'uploading').length
    
    return { totalFiles, uploadedFiles, failedFiles, uploadingFiles }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const stats = getUploadStats()
  const filteredFiles = getFilteredFiles()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">材料上传系统</h1>
            <p className="text-gray-600 mt-1">批量上传文件，自动分类管理</p>
          </div>

          {/* Upload Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <HardDrive className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">总文件数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">已上传</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.uploadedFiles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">上传中</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.uploadingFiles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">失败</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.failedFiles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Area */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragOver 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:border-gray-400"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  拖拽文件到此处或点击选择文件
                </h3>
                <p className="text-gray-600 mb-4">
                  支持批量上传，最多 {MAX_FILES} 个文件
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  支持格式: PDF, DOC, DOCX, JPG, PNG, GIF, TXT (最大 {(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB)
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <label>
                    <Button disabled={isUploading || files.length >= MAX_FILES}>
                      <Upload className="w-4 h-4 mr-2" />
                      选择文件
                    </Button>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt"
                      onChange={handleFileSelect}
                      disabled={isUploading || files.length >= MAX_FILES}
                    />
                  </label>
                  
                  <Button 
                    variant="outline"
                    disabled={files.length === 0}
                    onClick={() => setFiles([])}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    清空列表
                  </Button>
                </div>

                {files.length >= MAX_FILES && (
                  <Alert className="mt-4 max-w-md mx-auto">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      已达到最大文件数量限制 ({MAX_FILES} 个文件)
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Filter */}
          {files.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    <FolderOpen className="w-4 h-4 mr-1" />
                    全部 ({files.length})
                  </Button>
                  {getCategoryStats().map(({ key, label, count, color }) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(key)}
                      disabled={count === 0}
                    >
                      {label} ({count})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* File List */}
          {filteredFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>文件列表 ({filteredFiles.length})</span>
                  {isUploading && (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      上传中...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredFiles.map((file) => {
                    const CategoryIcon = FILE_CATEGORIES[file.category].icon
                    const categoryColor = FILE_CATEGORIES[file.category].color
                    
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        {/* File Icon/Preview */}
                        <div className="flex-shrink-0">
                          {file.preview ? (
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className={cn(
                              "w-12 h-12 rounded flex items-center justify-center",
                              categoryColor === 'blue' && "bg-blue-100 text-blue-600",
                              categoryColor === 'green' && "bg-green-100 text-green-600",
                              categoryColor === 'purple' && "bg-purple-100 text-purple-600",
                              categoryColor === 'gray' && "bg-gray-100 text-gray-600"
                            )}>
                              <CategoryIcon className="w-6 h-6" />
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {FILE_CATEGORIES[file.category].label}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{formatFileSize(file.size)}</span>
                            {file.uploadedAt && (
                              <span>上传于 {file.uploadedAt.toLocaleTimeString()}</span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {file.status === 'uploading' && (
                            <Progress value={file.progress} className="mt-2 h-2" />
                          )}

                          {/* Error Message */}
                          {file.error && (
                            <Alert className="mt-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                {file.error}
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center gap-2">
                          {file.status === 'uploaded' && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          
                          {file.status === 'uploading' && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Clock className="w-4 h-4 animate-spin" />
                              <span className="text-sm">{Math.round(file.progress)}%</span>
                            </div>
                          )}
                          
                          {file.status === 'failed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => retryUpload(file.id)}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              重试
                            </Button>
                          )}

                          {file.preview && (
                            <Button size="sm" variant="ghost">
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteFile(file.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {files.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  还没有上传任何文件
                </h3>
                <p className="text-gray-600 mb-4">
                  开始上传您的材料文件，系统将自动为您分类管理
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}