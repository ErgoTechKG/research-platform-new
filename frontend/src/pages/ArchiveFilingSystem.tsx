import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Archive, 
  FolderOpen, 
  Search, 
  Download, 
  Shield,
  Clock,
  CheckCircle,
  FileText,
  Lock,
  Unlock,
  HardDrive,
  Cloud,
  AlertTriangle,
  RefreshCw,
  Filter,
  Calendar,
  User,
  Tag,
  Database,
  BarChart3,
  FolderArchive
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArchiveItem {
  id: string
  title: string
  type: 'course' | 'evaluation' | 'grade' | 'report' | 'certificate'
  category: string
  studentName: string
  studentId: string
  archivedDate: Date
  fileSize: number
  status: 'archived' | 'processing' | 'failed' | 'backed_up'
  accessLevel: 'public' | 'restricted' | 'confidential'
  tags: string[]
  backupStatus: 'pending' | 'completed' | 'failed'
  lastAccessed?: Date
  accessCount: number
}

const ARCHIVE_TYPES = {
  course: { label: '课程资料', icon: FileText, color: 'blue' },
  evaluation: { label: '评价材料', icon: BarChart3, color: 'green' },
  grade: { label: '成绩记录', icon: FileText, color: 'purple' },
  report: { label: '报告文档', icon: FileText, color: 'orange' },
  certificate: { label: '证书文件', icon: Shield, color: 'red' }
}

const ACCESS_LEVELS = {
  public: { label: '公开访问', icon: Unlock, color: 'green' },
  restricted: { label: '限制访问', icon: Lock, color: 'yellow' },
  confidential: { label: '机密文件', icon: Shield, color: 'red' }
}

export default function ArchiveFilingSystem() {
  const [archives, setArchives] = useState<ArchiveItem[]>([
    {
      id: '1',
      title: '2024年春季学期-综合素质评价报告',
      type: 'evaluation',
      category: '学期评价',
      studentName: '张三',
      studentId: '2024001',
      archivedDate: new Date('2024-06-30'),
      fileSize: 2457600,
      status: 'backed_up',
      accessLevel: 'restricted',
      tags: ['2024春季', '综合评价', '已完成'],
      backupStatus: 'completed',
      lastAccessed: new Date('2024-07-15'),
      accessCount: 5
    },
    {
      id: '2',
      title: '创新实践课程-最终成绩单',
      type: 'grade',
      category: '成绩档案',
      studentName: '李四',
      studentId: '2024002',
      archivedDate: new Date('2024-07-01'),
      fileSize: 1024000,
      status: 'archived',
      accessLevel: 'confidential',
      tags: ['成绩单', '创新实践', '2024'],
      backupStatus: 'completed',
      accessCount: 2
    },
    {
      id: '3',
      title: '研究报告-AI在教育中的应用',
      type: 'report',
      category: '研究成果',
      studentName: '王五',
      studentId: '2024003',
      archivedDate: new Date('2024-07-02'),
      fileSize: 5242880,
      status: 'processing',
      accessLevel: 'public',
      tags: ['研究报告', 'AI', '教育技术'],
      backupStatus: 'pending',
      accessCount: 0
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAutoArchiving, setIsAutoArchiving] = useState(true)

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
      month: 'long',
      day: 'numeric'
    })
  }

  const getFilteredArchives = () => {
    return archives.filter(archive => {
      const matchesSearch = searchTerm === '' || 
        archive.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.studentId.includes(searchTerm) ||
        archive.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesType = selectedType === 'all' || archive.type === selectedType
      const matchesAccess = selectedAccessLevel === 'all' || archive.accessLevel === selectedAccessLevel
      const matchesStatus = selectedStatus === 'all' || archive.status === selectedStatus

      return matchesSearch && matchesType && matchesAccess && matchesStatus
    })
  }

  const getStatistics = () => {
    const total = archives.length
    const archived = archives.filter(a => a.status === 'archived' || a.status === 'backed_up').length
    const processing = archives.filter(a => a.status === 'processing').length
    const backedUp = archives.filter(a => a.backupStatus === 'completed').length
    const totalSize = archives.reduce((sum, a) => sum + a.fileSize, 0)

    return { total, archived, processing, backedUp, totalSize }
  }

  const handleBackup = (archiveId: string) => {
    setArchives(prev => prev.map(archive => {
      if (archive.id === archiveId) {
        return {
          ...archive,
          backupStatus: 'completed',
          status: 'backed_up'
        }
      }
      return archive
    }))
  }

  const handleExport = (archiveId: string) => {
    const archive = archives.find(a => a.id === archiveId)
    if (archive) {
      // Update access information
      setArchives(prev => prev.map(a => {
        if (a.id === archiveId) {
          return {
            ...a,
            lastAccessed: new Date(),
            accessCount: a.accessCount + 1
          }
        }
        return a
      }))
      
      // Simulate export
      console.log('Exporting archive:', archive.title)
    }
  }

  const stats = getStatistics()
  const filteredArchives = getFilteredArchives()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">档案归档系统</h1>
            <p className="text-gray-600 mt-1">永久保存评价材料，提供完整的档案管理和归档功能</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">总档案数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Archive className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">已归档</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <RefreshCw className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">处理中</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Cloud className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">已备份</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.backedUp}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <HardDrive className="h-8 w-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">总存储</p>
                    <p className="text-lg font-bold text-gray-900">{formatFileSize(stats.totalSize)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索档案标题、学生姓名、学号或标签..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="档案类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有类型</SelectItem>
                    {Object.entries(ARCHIVE_TYPES).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedAccessLevel} onValueChange={setSelectedAccessLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="访问级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有级别</SelectItem>
                    {Object.entries(ACCESS_LEVELS).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="归档状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">所有状态</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                    <SelectItem value="processing">处理中</SelectItem>
                    <SelectItem value="backed_up">已备份</SelectItem>
                    <SelectItem value="failed">失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Auto Archive Toggle */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">自动归档</span>
                </div>
                <Button
                  variant={isAutoArchiving ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAutoArchiving(!isAutoArchiving)}
                >
                  {isAutoArchiving ? "已启用" : "已禁用"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Archive List */}
          {filteredArchives.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>档案列表 ({filteredArchives.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredArchives.map((archive) => {
                    const TypeIcon = ARCHIVE_TYPES[archive.type].icon
                    const AccessIcon = ACCESS_LEVELS[archive.accessLevel].icon
                    const typeColor = ARCHIVE_TYPES[archive.type].color
                    const accessColor = ACCESS_LEVELS[archive.accessLevel].color

                    return (
                      <div
                        key={archive.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-grow">
                            {/* Type Icon */}
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                              typeColor === 'blue' && "bg-blue-100 text-blue-600",
                              typeColor === 'green' && "bg-green-100 text-green-600",
                              typeColor === 'purple' && "bg-purple-100 text-purple-600",
                              typeColor === 'orange' && "bg-orange-100 text-orange-600",
                              typeColor === 'red' && "bg-red-100 text-red-600"
                            )}>
                              <TypeIcon className="w-6 h-6" />
                            </div>

                            {/* Archive Info */}
                            <div className="flex-grow">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{archive.title}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {ARCHIVE_TYPES[archive.type].label}
                                </Badge>
                                <Badge 
                                  variant={archive.status === 'backed_up' ? 'default' : 
                                          archive.status === 'archived' ? 'secondary' : 
                                          archive.status === 'processing' ? 'outline' : 'destructive'}
                                  className="text-xs"
                                >
                                  {archive.status === 'backed_up' ? '已备份' :
                                   archive.status === 'archived' ? '已归档' :
                                   archive.status === 'processing' ? '处理中' : '失败'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {archive.studentName} ({archive.studentId})
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(archive.archivedDate)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <HardDrive className="w-3 h-3" />
                                    {formatFileSize(archive.fileSize)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <AccessIcon className={cn(
                                      "w-3 h-3",
                                      accessColor === 'green' && "text-green-600",
                                      accessColor === 'yellow' && "text-yellow-600",
                                      accessColor === 'red' && "text-red-600"
                                    )} />
                                    {ACCESS_LEVELS[archive.accessLevel].label}
                                  </span>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {archive.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Access Info */}
                              {archive.lastAccessed && (
                                <div className="text-xs text-gray-500">
                                  最后访问: {formatDate(archive.lastAccessed)} | 访问次数: {archive.accessCount}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            {archive.backupStatus === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleBackup(archive.id)}
                              >
                                <Cloud className="w-4 h-4 mr-1" />
                                备份
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleExport(archive.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              导出
                            </Button>
                          </div>
                        </div>

                        {/* Progress Bar for Processing */}
                        {archive.status === 'processing' && (
                          <div className="mt-3">
                            <Progress value={65} className="h-2" />
                            <p className="text-xs text-gray-500 mt-1">正在处理归档...</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  没有找到匹配的档案
                </h3>
                <p className="text-gray-600">
                  请尝试调整搜索条件或筛选器
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