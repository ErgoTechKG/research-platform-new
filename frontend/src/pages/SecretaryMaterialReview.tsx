import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Navigate } from 'react-router-dom'
import { 
  FileText, 
  Search, 
  Filter, 
  Upload, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Users,
  FileImage,
  FileCheck,
  Zap,
  Settings,
  History,
  Trash2
} from 'lucide-react'

interface Material {
  id: string
  name: string
  type: 'research' | 'course' | 'admin' | 'assignment'
  status: 'pending' | 'approved' | 'rejected' | 'reviewing' | 'failed'
  priority: 'urgent' | 'medium' | 'low'
  uploadDate: string
  reviewer?: string
  confidence?: number
  ocrText?: string
  metadata: {
    size: string
    format: string
    pages?: number
  }
  tags: string[]
}

const SecretaryMaterialReview = () => {
  const { user } = useAuth()
  
  // Redirect to login if not authenticated or not admin
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      name: '研究报告-机器学习算法优化.pdf',
      type: 'research',
      status: 'pending',
      priority: 'urgent',
      uploadDate: '2024-03-15 09:30',
      confidence: 95,
      ocrText: '本研究探讨了深度学习在图像识别领域的应用...',
      metadata: { size: '2.3MB', format: 'PDF', pages: 15 },
      tags: ['机器学习', '算法优化', '研究报告']
    },
    {
      id: '2',
      name: '课程资料-数据结构与算法.docx',
      type: 'course',
      status: 'reviewing',
      priority: 'medium',
      uploadDate: '2024-03-15 10:15',
      reviewer: '张教授',
      confidence: 88,
      ocrText: '第一章：数据结构基础概念...',
      metadata: { size: '1.8MB', format: 'DOCX', pages: 32 },
      tags: ['数据结构', '算法', '课程资料']
    },
    {
      id: '3',
      name: '学生作业-软件工程项目报告.pdf',
      type: 'assignment',
      status: 'approved',
      priority: 'low',
      uploadDate: '2024-03-15 14:20',
      reviewer: '李老师',
      confidence: 92,
      metadata: { size: '3.1MB', format: 'PDF', pages: 28 },
      tags: ['软件工程', '项目报告', '学生作业']
    },
    {
      id: '4',
      name: '行政文档-学期评估方案.xlsx',
      type: 'admin',
      status: 'failed',
      priority: 'medium',
      uploadDate: '2024-03-15 16:45',
      confidence: 45,
      metadata: { size: '892KB', format: 'XLSX' },
      tags: ['行政文档', '评估方案']
    }
  ])

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)

  // Filter materials based on current filters
  const filteredMaterials = materials.filter(material => {
    const matchesStatus = filterStatus === 'all' || material.status === filterStatus
    const matchesType = filterType === 'all' || material.type === filterType
    const matchesPriority = filterPriority === 'all' || material.priority === filterPriority
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesStatus && matchesType && matchesPriority && matchesSearch
  })

  // Statistics
  const stats = {
    total: materials.length,
    pending: materials.filter(m => m.status === 'pending').length,
    approved: materials.filter(m => m.status === 'approved').length,
    reviewing: materials.filter(m => m.status === 'reviewing').length,
    failed: materials.filter(m => m.status === 'failed').length,
    urgent: materials.filter(m => m.priority === 'urgent').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 text-white'
      case 'rejected':
        return 'bg-red-500 text-white'
      case 'reviewing':
        return 'bg-blue-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'failed':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已批准'
      case 'rejected':
        return '已拒绝'
      case 'reviewing':
        return '审核中'
      case 'pending':
        return '待审核'
      case 'failed':
        return '处理失败'
      default:
        return '未知'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '紧急'
      case 'medium':
        return '中等'
      case 'low':
        return '低'
      default:
        return '普通'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'research':
        return '研究文档'
      case 'course':
        return '课程材料'
      case 'admin':
        return '行政文档'
      case 'assignment':
        return '学生作业'
      default:
        return '其他'
    }
  }

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    )
  }

  const handleBatchAction = (action: string) => {
    if (selectedMaterials.length === 0) return
    
    setMaterials(prev => prev.map(material => 
      selectedMaterials.includes(material.id)
        ? { ...material, status: action as Material['status'], reviewer: user.name }
        : material
    ))
    setSelectedMaterials([])
  }

  const handleOCRProcess = (materialId: string) => {
    setMaterials(prev => prev.map(material => 
      material.id === materialId
        ? { 
            ...material, 
            status: 'reviewing',
            ocrText: '正在进行OCR文字识别，请稍候...',
            confidence: 0
          }
        : material
    ))

    // Simulate OCR processing
    setTimeout(() => {
      setMaterials(prev => prev.map(material => 
        material.id === materialId
          ? { 
              ...material, 
              ocrText: '这是通过OCR识别的文档内容示例。文档包含了重要的学术研究信息，涵盖了多个学科领域的内容...',
              confidence: Math.floor(Math.random() * 30) + 70
            }
          : material
      ))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              材料审核系统
            </h1>
            <p className="text-gray-600">
              OCR文字识别 | 智能分类 | 批量审核 | 质量检查
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              上传材料
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出报告
            </Button>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6" data-testid="statistics-overview">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">总材料</p>
                  <p className="text-xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">待审核</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">已批准</p>
                  <p className="text-xl font-bold text-green-600">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">审核中</p>
                  <p className="text-xl font-bold text-blue-600">{stats.reviewing}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">处理失败</p>
                  <p className="text-xl font-bold text-gray-600">{stats.failed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">紧急</p>
                  <p className="text-xl font-bold text-red-600">{stats.urgent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6" data-testid="filters-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              筛选和搜索
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-medium mb-1">搜索材料</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索材料名称或标签..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="search-input"
                  />
                </div>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">状态</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待审核</SelectItem>
                    <SelectItem value="reviewing">审核中</SelectItem>
                    <SelectItem value="approved">已批准</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                    <SelectItem value="failed">处理失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">类型</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger data-testid="type-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="research">研究文档</SelectItem>
                    <SelectItem value="course">课程材料</SelectItem>
                    <SelectItem value="admin">行政文档</SelectItem>
                    <SelectItem value="assignment">学生作业</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">优先级</label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger data-testid="priority-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部优先级</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                    <SelectItem value="medium">中等</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch Actions */}
        {selectedMaterials.length > 0 && (
          <Card className="mb-6" data-testid="batch-actions">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  已选择 {selectedMaterials.length} 个材料
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBatchAction('approved')}
                    data-testid="batch-approve"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    批量批准
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleBatchAction('rejected')}
                    data-testid="batch-reject"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    批量拒绝
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedMaterials([])}
                    data-testid="clear-selection"
                  >
                    清除选择
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Materials List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials Queue */}
          <Card data-testid="materials-queue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                材料队列 ({filteredMaterials.length})
              </CardTitle>
              <CardDescription>按优先级排序的待审核材料</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  没有找到符合条件的材料
                </div>
              ) : (
                filteredMaterials.map((material) => (
                  <div 
                    key={material.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMaterial?.id === material.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMaterial(material)}
                    data-testid="material-item"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => handleMaterialSelect(material.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1"
                        data-testid="material-checkbox"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm truncate">{material.name}</h4>
                          <div className="flex gap-1 ml-2">
                            <Badge className={getPriorityColor(material.priority)}>
                              {getPriorityText(material.priority)}
                            </Badge>
                            <Badge className={getStatusColor(material.status)}>
                              {getStatusText(material.status)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span>{getTypeText(material.type)}</span>
                          <span>{material.metadata.size}</span>
                          <span>{material.uploadDate}</span>
                          {material.confidence && (
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              OCR: {material.confidence}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {material.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {material.reviewer && (
                          <div className="mt-2 text-xs text-blue-600">
                            审核人：{material.reviewer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Material Details and OCR */}
          <Card data-testid="material-details">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                材料详情与OCR
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMaterial ? (
                <div className="space-y-4">
                  {/* Material Info */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">{selectedMaterial.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>类型：{getTypeText(selectedMaterial.type)}</div>
                      <div>大小：{selectedMaterial.metadata.size}</div>
                      <div>格式：{selectedMaterial.metadata.format}</div>
                      <div>上传时间：{selectedMaterial.uploadDate}</div>
                      {selectedMaterial.metadata.pages && (
                        <div>页数：{selectedMaterial.metadata.pages}</div>
                      )}
                      {selectedMaterial.confidence && (
                        <div>OCR置信度：{selectedMaterial.confidence}%</div>
                      )}
                    </div>
                  </div>

                  {/* OCR Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">OCR文字识别</h5>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleOCRProcess(selectedMaterial.id)}
                        data-testid="ocr-process-button"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        重新识别
                      </Button>
                    </div>
                    <Textarea
                      value={selectedMaterial.ocrText || '点击"重新识别"按钮开始OCR文字识别...'}
                      readOnly
                      className="min-h-32"
                      data-testid="ocr-text-area"
                    />
                  </div>

                  {/* Review Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        setMaterials(prev => prev.map(m => 
                          m.id === selectedMaterial.id 
                            ? { ...m, status: 'approved', reviewer: user.name }
                            : m
                        ))
                        setSelectedMaterial(null)
                      }}
                      data-testid="approve-button"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      批准
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setMaterials(prev => prev.map(m => 
                          m.id === selectedMaterial.id 
                            ? { ...m, status: 'rejected', reviewer: user.name }
                            : m
                        ))
                        setSelectedMaterial(null)
                      }}
                      data-testid="reject-button"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      拒绝
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileImage className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>选择一个材料查看详情和进行OCR识别</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Statistics */}
        <Card className="mt-6" data-testid="review-statistics">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              审核统计分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.round((stats.approved / stats.total) * 100)}%
                </div>
                <div className="text-sm text-gray-600">批准率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  2.3分钟
                </div>
                <div className="text-sm text-gray-600">平均处理时间</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  87%
                </div>
                <div className="text-sm text-gray-600">OCR准确率</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  )
}

export default SecretaryMaterialReview