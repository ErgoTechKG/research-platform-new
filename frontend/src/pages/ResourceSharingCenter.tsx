import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Search,
  Filter,
  Download,
  Upload,
  Star,
  Eye,
  BookOpen,
  FileText,
  Database,
  GraduationCap,
  Heart,
  Share2,
  Clock,
  User,
  Tag,
  TrendingUp,
  Award,
  ThumbsUp,
  MessageSquare,
  Calendar,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Resource {
  id: string
  title: string
  description: string
  author: string
  authorAvatar?: string
  category: 'course' | 'project' | 'paper' | 'dataset'
  type: 'pdf' | 'doc' | 'video' | 'image' | 'zip' | 'other'
  size: number
  downloadCount: number
  likeCount: number
  rating: number
  tags: string[]
  uploadDate: Date
  lastModified: Date
  previewUrl?: string
  downloadUrl: string
  isPublic: boolean
  isPremium: boolean
  comments: number
}

interface CategoryConfig {
  label: string
  icon: React.ComponentType<any>
  color: string
  description: string
}

const CATEGORIES: Record<string, CategoryConfig> = {
  course: { 
    label: '课程资料', 
    icon: BookOpen, 
    color: 'blue', 
    description: '教学课件、笔记、练习题等'
  },
  project: { 
    label: '项目案例', 
    icon: Award, 
    color: 'green', 
    description: '优秀项目案例、源代码、演示文档'
  },
  paper: { 
    label: '学术论文', 
    icon: GraduationCap, 
    color: 'purple', 
    description: '学术研究论文、期刊文章、会议论文'
  },
  dataset: { 
    label: '实验数据', 
    icon: Database, 
    color: 'orange', 
    description: '实验数据集、统计数据、研究数据'
  }
}

const SORT_OPTIONS = [
  { value: 'latest', label: '最新上传' },
  { value: 'popular', label: '最受欢迎' },
  { value: 'downloads', label: '下载量' },
  { value: 'rating', label: '评分' },
  { value: 'alphabetical', label: '名称' }
]

const mockResources: Resource[] = [
  {
    id: '1',
    title: '机器学习基础教程',
    description: '详细的机器学习入门教程，包含理论基础和实践案例',
    author: '张教授',
    authorAvatar: '',
    category: 'course',
    type: 'pdf',
    size: 15728640, // 15MB
    downloadCount: 2543,
    likeCount: 189,
    rating: 4.8,
    tags: ['机器学习', '人工智能', '教程', '基础'],
    uploadDate: new Date('2024-01-15'),
    lastModified: new Date('2024-01-20'),
    downloadUrl: '/downloads/ml-tutorial.pdf',
    isPublic: true,
    isPremium: false,
    comments: 45
  },
  {
    id: '2',
    title: '智能推荐系统项目',
    description: '基于协同过滤的电商推荐系统完整实现，包含前后端代码',
    author: '李同学',
    category: 'project',
    type: 'zip',
    size: 52428800, // 50MB
    downloadCount: 1876,
    likeCount: 234,
    rating: 4.6,
    tags: ['推荐系统', '协同过滤', '项目', 'Python'],
    uploadDate: new Date('2024-01-10'),
    lastModified: new Date('2024-01-15'),
    downloadUrl: '/downloads/recommendation-system.zip',
    isPublic: true,
    isPremium: true,
    comments: 67
  },
  {
    id: '3',
    title: '深度学习在图像识别中的应用研究',
    description: '关于卷积神经网络在图像分类任务中的应用研究论文',
    author: '王研究员',
    category: 'paper',
    type: 'pdf',
    size: 8388608, // 8MB
    downloadCount: 1234,
    likeCount: 156,
    rating: 4.9,
    tags: ['深度学习', '图像识别', 'CNN', '研究论文'],
    uploadDate: new Date('2024-01-05'),
    lastModified: new Date('2024-01-08'),
    downloadUrl: '/downloads/dl-image-recognition.pdf',
    isPublic: true,
    isPremium: false,
    comments: 23
  },
  {
    id: '4',
    title: 'COVID-19 疫情数据集',
    description: '全球COVID-19疫情统计数据，包含每日确诊、死亡、康复数据',
    author: '数据科学团队',
    category: 'dataset',
    type: 'zip',
    size: 125829120, // 120MB
    downloadCount: 3456,
    likeCount: 312,
    rating: 4.7,
    tags: ['COVID-19', '疫情数据', '统计', '数据集'],
    uploadDate: new Date('2023-12-20'),
    lastModified: new Date('2024-01-01'),
    downloadUrl: '/downloads/covid19-dataset.zip',
    isPublic: true,
    isPremium: false,
    comments: 89
  },
  {
    id: '5',
    title: 'React 前端开发最佳实践',
    description: 'React框架的高级用法和最佳实践指南，适合有一定基础的开发者',
    author: '前端团队',
    category: 'course',
    type: 'pdf',
    size: 12582912, // 12MB
    downloadCount: 1987,
    likeCount: 267,
    rating: 4.5,
    tags: ['React', '前端', '最佳实践', 'JavaScript'],
    uploadDate: new Date('2024-01-12'),
    lastModified: new Date('2024-01-18'),
    downloadUrl: '/downloads/react-best-practices.pdf',
    isPublic: true,
    isPremium: true,
    comments: 34
  }
]

export default function ResourceSharingCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showOnlyPublic, setShowOnlyPublic] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Get all unique tags from resources
  const allTags = Array.from(new Set(mockResources.flatMap(resource => resource.tags)))

  const filteredResources = mockResources.filter(resource => {
    // Category filter
    if (selectedCategory !== 'all' && resource.category !== selectedCategory) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!resource.title.toLowerCase().includes(query) &&
          !resource.description.toLowerCase().includes(query) &&
          !resource.author.toLowerCase().includes(query) &&
          !resource.tags.some(tag => tag.toLowerCase().includes(query))) {
        return false
      }
    }

    // Tag filter
    if (selectedTags.length > 0) {
      if (!selectedTags.some(tag => resource.tags.includes(tag))) {
        return false
      }
    }

    // Public only filter
    if (showOnlyPublic && !resource.isPublic) {
      return false
    }

    return true
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.uploadDate.getTime() - a.uploadDate.getTime()
      case 'popular':
        return b.likeCount - a.likeCount
      case 'downloads':
        return b.downloadCount - a.downloadCount
      case 'rating':
        return b.rating - a.rating
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getCategoryStats = () => {
    return Object.entries(CATEGORIES).map(([key, config]) => ({
      key,
      ...config,
      count: mockResources.filter(r => r.category === key).length
    }))
  }

  const getOverallStats = () => {
    return {
      totalResources: mockResources.length,
      totalDownloads: mockResources.reduce((sum, r) => sum + r.downloadCount, 0),
      totalLikes: mockResources.reduce((sum, r) => sum + r.likeCount, 0),
      averageRating: (mockResources.reduce((sum, r) => sum + r.rating, 0) / mockResources.length).toFixed(1)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDownload = (resource: Resource) => {
    // Simulate download
    console.log(`Downloading: ${resource.title}`)
    // In real implementation, this would trigger actual download
  }

  const handleLike = (resourceId: string) => {
    // Simulate like action
    console.log(`Liked resource: ${resourceId}`)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSelectedTags([])
    setShowOnlyPublic(false)
    setSortBy('latest')
  }

  const handleUpload = () => {
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      // Show success message
    }, 2000)
  }

  const stats = getOverallStats()
  const categoryStats = getCategoryStats()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">资源共享中心</h1>
                <p className="text-gray-600 mt-2">发现和分享优质的学习资源</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      上传中...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      上传资源
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">总资源数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalResources}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Download className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">总下载量</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">获赞数量</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">平均评分</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                全部资源 ({mockResources.length})
              </TabsTrigger>
              {categoryStats.map(({ key, label, count, icon: Icon }) => (
                <TabsTrigger key={key} value={key}>
                  <Icon className="w-4 h-4 mr-1" />
                  {label} ({count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search and Filter Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索资源名称、作者或标签..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Sort Selection */}
                <div className="flex gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    按标签筛选:
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 12).map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {(searchQuery || selectedTags.length > 0 || selectedCategory !== 'all') && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600">当前筛选:</span>
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary">
                      分类: {CATEGORIES[selectedCategory]?.label}
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary">
                      搜索: {searchQuery}
                    </Badge>
                  )}
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      标签: {tag}
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                  >
                    清除所有筛选
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resource List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                资源列表 ({sortedResources.length})
              </h2>
            </div>

            {sortedResources.length > 0 ? (
              <div className={cn(
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {sortedResources.map((resource) => {
                  const CategoryIcon = CATEGORIES[resource.category].icon
                  const categoryColor = CATEGORIES[resource.category].color

                  if (viewMode === 'grid') {
                    return (
                      <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "p-2 rounded-lg",
                                categoryColor === 'blue' && "bg-blue-100 text-blue-600",
                                categoryColor === 'green' && "bg-green-100 text-green-600",
                                categoryColor === 'purple' && "bg-purple-100 text-purple-600",
                                categoryColor === 'orange' && "bg-orange-100 text-orange-600"
                              )}>
                                <CategoryIcon className="w-4 h-4" />
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {CATEGORIES[resource.category].label}
                              </Badge>
                            </div>
                            {resource.isPremium && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                精品
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg leading-tight">
                            {resource.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {resource.description}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{resource.author}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(resource.uploadDate)}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {resource.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{resource.tags.length - 3}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                <span>{resource.downloadCount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                <span>{resource.likeCount}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{resource.rating}</span>
                              </div>
                            </div>
                            <span>{formatFileSize(resource.size)}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleDownload(resource)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              下载
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleLike(resource.id)}
                            >
                              <Heart className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  } else {
                    return (
                      <Card key={resource.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "p-3 rounded-lg flex-shrink-0",
                              categoryColor === 'blue' && "bg-blue-100 text-blue-600",
                              categoryColor === 'green' && "bg-green-100 text-green-600",
                              categoryColor === 'purple' && "bg-purple-100 text-purple-600",
                              categoryColor === 'orange' && "bg-orange-100 text-orange-600"
                            )}>
                              <CategoryIcon className="w-6 h-6" />
                            </div>

                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {CATEGORIES[resource.category].label}
                                </Badge>
                                {resource.isPremium && (
                                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                    精品
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                                {resource.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {resource.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(resource.uploadDate)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {resource.downloadCount.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {resource.rating}
                                </span>
                                <span>{formatFileSize(resource.size)}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 flex-shrink-0">
                              <Button 
                                size="sm"
                                onClick={() => handleDownload(resource)}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                下载
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleLike(resource.id)}
                              >
                                <Heart className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  }
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    没有找到相关资源
                  </h3>
                  <p className="text-gray-600 mb-4">
                    尝试调整搜索条件或清除筛选器
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    清除所有筛选
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Upload Progress (if uploading) */}
          {isUploading && (
            <Alert className="mb-6">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>正在上传资源...</span>
                  <Progress value={75} className="w-32 ml-4" />
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}