import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Navigate } from 'react-router-dom'
import { 
  Users, 
  History, 
  Save, 
  Download,
  Share,
  Eye,
  Edit,
  MessageSquare,
  Settings,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Wifi,
  WifiOff,
  Undo,
  Redo,
  Copy
} from 'lucide-react'

interface OnlineUser {
  id: string
  name: string
  role: string
  color: string
  cursorPosition: number
  lastActive: string
  status: 'active' | 'idle' | 'away'
}

interface DocumentVersion {
  id: string
  version: number
  title: string
  createdBy: string
  createdAt: string
  changes: string
  size: string
}

interface Conflict {
  id: string
  type: 'text_overlap' | 'simultaneous_edit' | 'version_mismatch'
  users: string[]
  content: string
  suggestedResolution: string
  status: 'pending' | 'resolved' | 'ignored'
  timestamp: string
}

const RealtimeDocumentEditing = () => {
  const { user } = useAuth()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  const [documentTitle, setDocumentTitle] = useState('学术研究报告 - 机器学习算法优化')
  const [documentContent, setDocumentContent] = useState(`# 机器学习算法优化研究报告

## 摘要
本研究探讨了深度学习在图像识别领域的应用，通过对比实验分析了不同算法的性能表现。

## 1. 研究背景
随着人工智能技术的快速发展，机器学习算法在各个领域都展现出了巨大的潜力...

## 2. 方法论
### 2.1 数据收集
我们收集了来自不同源的10,000张图像样本...

### 2.2 算法选择
选择了以下三种主流算法进行对比：
- CNN (卷积神经网络)
- ResNet (残差网络)
- Transformer

## 3. 实验结果
...`)

  const [onlineUsers] = useState<OnlineUser[]>([
    {
      id: '1',
      name: '张教授',
      role: 'professor',
      color: 'bg-blue-500',
      cursorPosition: 245,
      lastActive: '1分钟前',
      status: 'active'
    },
    {
      id: '2',
      name: '李同学',
      role: 'student',
      color: 'bg-green-500',
      cursorPosition: 156,
      lastActive: '刚刚',
      status: 'active'
    },
    {
      id: '3',
      name: '王研究员',
      role: 'researcher',
      color: 'bg-purple-500',
      cursorPosition: 89,
      lastActive: '5分钟前',
      status: 'idle'
    }
  ])

  const [documentVersions] = useState<DocumentVersion[]>([
    {
      id: '1',
      version: 5,
      title: '添加实验结果章节',
      createdBy: '张教授',
      createdAt: '2024-03-15 16:30',
      changes: '新增第3章实验结果部分，包含详细的数据分析',
      size: '4.2KB'
    },
    {
      id: '2',
      version: 4,
      title: '修正方法论描述',
      createdBy: '李同学',
      createdAt: '2024-03-15 15:45',
      changes: '更新了2.2节算法选择部分的描述',
      size: '3.8KB'
    },
    {
      id: '3',
      version: 3,
      title: '完善研究背景',
      createdBy: '王研究员',
      createdAt: '2024-03-15 14:20',
      changes: '扩充了第1章研究背景的内容',
      size: '3.5KB'
    }
  ])

  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: '1',
      type: 'simultaneous_edit',
      users: ['张教授', '李同学'],
      content: '第2.1节数据收集部分同时被编辑',
      suggestedResolution: '合并两处修改，保留关键信息',
      status: 'pending',
      timestamp: '2024-03-15 16:45'
    }
  ])

  const [isConnected, setIsConnected] = useState(true)
  const [lastSaved, setLastSaved] = useState('2分钟前')
  const [wordCount, setWordCount] = useState(1250)
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(true)
  const [permission, setPermission] = useState<'view' | 'comment' | 'edit'>('edit')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Simulate real-time sync
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSaved('刚刚')
      setTimeout(() => setLastSaved('1分钟前'), 60000)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldDisconnect = Math.random() < 0.1
      setIsConnected(!shouldDisconnect)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleDocumentChange = (value: string) => {
    setDocumentContent(value)
    setWordCount(value.length)
    
    // Simulate auto-save
    setTimeout(() => {
      setLastSaved('刚刚')
    }, 1000)
  }

  const handleConflictResolution = (conflictId: string, action: 'accept' | 'reject' | 'merge') => {
    setConflicts(prev => prev.map(conflict => 
      conflict.id === conflictId 
        ? { ...conflict, status: 'resolved' }
        : conflict
    ))
  }

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'idle':
        return 'bg-yellow-500'
      case 'away':
        return 'bg-gray-500'
      default:
        return 'bg-gray-400'
    }
  }

  const getUserStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃'
      case 'idle':
        return '空闲'
      case 'away':
        return '离开'
      default:
        return '未知'
    }
  }

  const getPermissionText = (perm: string) => {
    switch (perm) {
      case 'view':
        return '查看'
      case 'comment':
        return '评论'
      case 'edit':
        return '编辑'
      default:
        return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="text-2xl font-bold border-none px-0 focus:ring-0"
              placeholder="文档标题"
              data-testid="document-title"
            />
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-green-600" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-600" />
                )}
                <span>{isConnected ? '已连接' : '连接中断'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Save className="w-4 h-4" />
                <span>上次保存：{lastSaved}</span>
              </div>
              <div>字数：{wordCount}</div>
              <div>权限：{getPermissionText(permission)}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              data-testid="version-history-button"
            >
              <History className="w-4 h-4 mr-2" />
              版本历史
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              分享
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* Connection Status Alert */}
        {!isConnected && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2" data-testid="connection-alert">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-800">连接中断，正在尝试重新连接...</span>
            <Button size="sm" variant="outline" className="ml-auto">
              <RefreshCw className="w-4 h-4 mr-1" />
              重连
            </Button>
          </div>
        )}

        {/* Conflict Resolution */}
        {conflicts.filter(c => c.status === 'pending').length > 0 && (
          <Card className="mb-4" data-testid="conflict-resolution">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                发现编辑冲突
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conflicts.filter(c => c.status === 'pending').map((conflict) => (
                <div key={conflict.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg mb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-orange-800 mb-1">{conflict.content}</p>
                      <p className="text-sm text-orange-600 mb-2">
                        涉及用户：{conflict.users.join(', ')}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        建议：{conflict.suggestedResolution}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleConflictResolution(conflict.id, 'accept')}
                          data-testid="accept-resolution"
                        >
                          接受建议
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleConflictResolution(conflict.id, 'merge')}
                          data-testid="merge-resolution"
                        >
                          手动合并
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleConflictResolution(conflict.id, 'reject')}
                          data-testid="ignore-conflict"
                        >
                          忽略
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{conflict.timestamp}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-6">
          {/* Main Editor */}
          <div className="flex-1">
            <Card data-testid="document-editor">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>文档编辑器</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={!isConnected}>
                      <Undo className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" disabled={!isConnected}>
                      <Redo className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  ref={textareaRef}
                  value={documentContent}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  className="min-h-96 font-mono text-sm"
                  placeholder="开始编写文档..."
                  disabled={permission === 'view' || !isConnected}
                  data-testid="document-textarea"
                />
                
                {/* User Cursors Simulation */}
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-2">
                    {onlineUsers.filter(u => u.status === 'active').map((user) => (
                      <div key={user.id} className="flex items-center gap-1">
                        <div className={`w-2 h-2 ${user.color} rounded-full`}></div>
                        <span>{user.name} 正在第 {Math.floor(user.cursorPosition / 50) + 1} 行编辑</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Collaboration Sidebar */}
          {showCollaborationPanel && (
            <div className="w-80 space-y-4">
              {/* Online Users */}
              <Card data-testid="online-users">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    在线用户 ({onlineUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3" data-testid="user-item">
                        <div className="relative">
                          <div className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center text-white text-sm font-medium`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getUserStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {getUserStatusText(user.status)} · {user.lastActive}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            {user.role === 'professor' ? '教授' : user.role === 'student' ? '学生' : '研究员'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Version History */}
              {showVersionHistory && (
                <Card data-testid="version-history">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5" />
                      版本历史
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {documentVersions.map((version) => (
                        <div 
                          key={version.id} 
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedVersion?.id === version.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedVersion(version)}
                          data-testid="version-item"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">v{version.version}</Badge>
                              <span className="text-sm font-medium">{version.title}</span>
                            </div>
                            <Button size="sm" variant="ghost">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {version.createdBy} · {version.createdAt}
                          </div>
                          <div className="text-xs text-gray-500">
                            {version.changes} · {version.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Document Statistics */}
              <Card data-testid="document-statistics">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    文档统计
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">总字数</span>
                      <span className="text-sm font-medium">{wordCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">段落数</span>
                      <span className="text-sm font-medium">{documentContent.split('\n\n').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">章节数</span>
                      <span className="text-sm font-medium">{(documentContent.match(/^##/gm) || []).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">版本数</span>
                      <span className="text-sm font-medium">{documentVersions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">协作者</span>
                      <span className="text-sm font-medium">{onlineUsers.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Auto-save Status */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {isConnected ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>文档已自动保存</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-yellow-600" />
                <span>等待连接恢复后保存</span>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default RealtimeDocumentEditing