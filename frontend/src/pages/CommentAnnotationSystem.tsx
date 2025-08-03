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
  MessageSquare, 
  Reply, 
  AtSign,
  Bell,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  Edit2,
  Trash2,
  MoreHorizontal,
  User,
  Clock,
  Hash,
  X,
  Send,
  FileText,
  Eye,
  EyeOff
} from 'lucide-react'

interface Comment {
  id: string
  type: 'suggestion' | 'question' | 'approval' | 'correction' | 'general'
  content: string
  author: {
    id: string
    name: string
    role: string
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
  position: {
    start: number
    end: number
    text: string
  }
  status: 'open' | 'resolved' | 'closed'
  replies: CommentReply[]
  mentions: string[]
  reactions: Reaction[]
  isEdited: boolean
}

interface CommentReply {
  id: string
  content: string
  author: {
    id: string
    name: string
    role: string
  }
  createdAt: string
  mentions: string[]
}

interface Reaction {
  type: 'like' | 'agree' | 'disagree'
  userId: string
  userName: string
}

interface Notification {
  id: string
  type: 'mention' | 'reply' | 'status_change'
  content: string
  commentId: string
  from: string
  createdAt: string
  isRead: boolean
}

const CommentAnnotationSystem = () => {
  const { user } = useAuth()
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  const [documentContent] = useState(`# 学术研究报告：深度学习在图像识别中的应用

## 摘要
本研究探讨了深度学习技术在图像识别领域的最新进展，通过实验对比分析了不同算法的性能表现。研究结果表明，基于Transformer架构的模型在准确率和效率方面都有显著提升。

## 1. 研究背景
随着人工智能技术的快速发展，深度学习已成为计算机视觉领域的核心技术。传统的图像识别方法存在特征提取困难、泛化能力有限等问题，而深度学习通过多层神经网络能够自动学习图像的层次化特征表示。

## 2. 方法论
### 2.1 数据收集与预处理
我们收集了包含50,000张高清图像的数据集，涵盖了10个不同类别。所有图像都经过标准化预处理，包括尺寸调整、归一化和数据增强。

### 2.2 模型架构设计
本研究采用了三种主流的深度学习架构：
- 卷积神经网络（CNN）
- 残差神经网络（ResNet）
- 视觉Transformer（ViT）

## 3. 实验结果与分析
实验结果显示，ViT模型在测试集上达到了95.2%的准确率，相比传统CNN模型提升了约8%。这一结果验证了我们的假设，即注意力机制在图像特征学习中的重要作用。

## 4. 结论
本研究成功证明了Transformer架构在图像识别任务中的优越性能。未来工作将探索更多优化策略，以进一步提升模型的实用性和效率。`)

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      type: 'suggestion',
      content: '建议在摘要部分添加具体的性能提升数据，这样更有说服力。',
      author: {
        id: '1',
        name: '张教授',
        role: 'professor'
      },
      createdAt: '2024-03-15 14:30',
      position: {
        start: 50,
        end: 120,
        text: '研究结果表明，基于Transformer架构的模型在准确率和效率方面都有显著提升。'
      },
      status: 'open',
      replies: [
        {
          id: '1-1',
          content: '@李同学 你觉得这个建议怎么样？可以帮忙补充一下具体数据吗？',
          author: {
            id: '1',
            name: '张教授',
            role: 'professor'
          },
          createdAt: '2024-03-15 14:35',
          mentions: ['李同学']
        }
      ],
      mentions: [],
      reactions: [
        { type: 'like', userId: '2', userName: '李同学' }
      ],
      isEdited: false
    },
    {
      id: '2',
      type: 'question',
      content: '数据集的具体来源是什么？是否有版权问题？',
      author: {
        id: '3',
        name: '王研究员',
        role: 'researcher'
      },
      createdAt: '2024-03-15 15:20',
      position: {
        start: 280,
        end: 350,
        text: '我们收集了包含50,000张高清图像的数据集，涵盖了10个不同类别。'
      },
      status: 'open',
      replies: [],
      mentions: [],
      reactions: [],
      isEdited: false
    },
    {
      id: '3',
      type: 'approval',
      content: '第3章的实验结果分析很详细，数据可信度高。',
      author: {
        id: '4',
        name: '陈副教授',
        role: 'professor'
      },
      createdAt: '2024-03-15 16:10',
      position: {
        start: 600,
        end: 720,
        text: '实验结果显示，ViT模型在测试集上达到了95.2%的准确率，相比传统CNN模型提升了约8%。'
      },
      status: 'resolved',
      replies: [],
      mentions: [],
      reactions: [
        { type: 'agree', userId: '1', userName: '张教授' },
        { type: 'like', userId: '2', userName: '李同学' }
      ],
      isEdited: false
    }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'mention',
      content: '张教授 在评论中提到了您',
      commentId: '1',
      from: '张教授',
      createdAt: '2024-03-15 14:35',
      isRead: false
    },
    {
      id: '2',
      type: 'reply',
      content: '您的评论收到了新回复',
      commentId: '2',
      from: '李同学',
      createdAt: '2024-03-15 15:45',
      isRead: true
    }
  ])

  const [selectedText, setSelectedText] = useState<{start: number, end: number, text: string} | null>(null)
  const [newComment, setNewComment] = useState('')
  const [newCommentType, setNewCommentType] = useState<Comment['type']>('general')
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const textRef = useRef<HTMLDivElement>(null)

  // Filter comments
  const filteredComments = comments.filter(comment => {
    const matchesType = filterType === 'all' || comment.type === filterType
    const matchesStatus = filterStatus === 'all' || comment.status === filterStatus
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })

  // Unread notifications count
  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim() && textRef.current) {
      const range = selection.getRangeAt(0)
      const start = range.startOffset
      const end = range.endOffset
      const text = selection.toString().trim()
      
      setSelectedText({ start, end, text })
      setShowCommentForm(true)
    }
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedText) return

    const comment: Comment = {
      id: Date.now().toString(),
      type: newCommentType,
      content: newComment,
      author: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      createdAt: new Date().toLocaleString('zh-CN'),
      position: selectedText,
      status: 'open',
      replies: [],
      mentions: extractMentions(newComment),
      reactions: [],
      isEdited: false
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    setShowCommentForm(false)
    setSelectedText(null)
  }

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return

    const reply: CommentReply = {
      id: Date.now().toString(),
      content: replyContent,
      author: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      createdAt: new Date().toLocaleString('zh-CN'),
      mentions: extractMentions(replyContent)
    }

    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ))
    
    setReplyContent('')
    setReplyingTo(null)
  }

  const handleStatusChange = (commentId: string, status: Comment['status']) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status }
        : comment
    ))
  }

  const handleReaction = (commentId: string, reactionType: Reaction['type']) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        const existingReaction = comment.reactions.find(r => r.userId === user.id && r.type === reactionType)
        
        if (existingReaction) {
          // Remove reaction
          return {
            ...comment,
            reactions: comment.reactions.filter(r => !(r.userId === user.id && r.type === reactionType))
          }
        } else {
          // Add reaction (remove other reactions from same user first)
          const reactionsWithoutUser = comment.reactions.filter(r => r.userId !== user.id)
          return {
            ...comment,
            reactions: [...reactionsWithoutUser, { type: reactionType, userId: user.id, userName: user.name }]
          }
        }
      }
      return comment
    }))
  }

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@([^\s]+)/g
    const mentions = []
    let match
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1])
    }
    return mentions
  }

  const getCommentTypeColor = (type: Comment['type']) => {
    switch (type) {
      case 'suggestion':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'question':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approval':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'correction':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCommentTypeText = (type: Comment['type']) => {
    switch (type) {
      case 'suggestion':
        return '建议'
      case 'question':
        return '问题'
      case 'approval':
        return '赞同'
      case 'correction':
        return '修正'
      default:
        return '评论'
    }
  }

  const getCommentTypeIcon = (type: Comment['type']) => {
    switch (type) {
      case 'suggestion':
        return <Edit2 className="w-3 h-3" />
      case 'question':
        return <HelpCircle className="w-3 h-3" />
      case 'approval':
        return <CheckCircle className="w-3 h-3" />
      case 'correction':
        return <AlertCircle className="w-3 h-3" />
      default:
        return <MessageSquare className="w-3 h-3" />
    }
  }

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-500'
      case 'resolved':
        return 'bg-green-500'
      case 'closed':
        return 'bg-gray-500'
      default:
        return 'bg-blue-500'
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              评论与批注系统
            </h1>
            <p className="text-gray-600">
              行内批注 | @提及 | 讨论串 | 状态管理
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                data-testid="notifications-button"
              >
                <Bell className="w-4 h-4 mr-2" />
                通知
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <Card className="absolute right-0 top-full mt-2 w-80 z-50" data-testid="notifications-dropdown">
                  <CardHeader>
                    <CardTitle className="text-sm">通知中心</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center text-gray-500 py-4">
                          暂无通知
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-2 rounded-lg cursor-pointer ${
                              notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                            data-testid="notification-item"
                          >
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                notification.isRead ? 'bg-gray-400' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{notification.content}</p>
                                <p className="text-xs text-gray-500">
                                  来自 {notification.from} · {notification.createdAt}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              导出评论
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6" data-testid="filters-section">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              筛选和搜索
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">搜索评论</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="搜索评论内容或作者..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="search-input"
                  />
                </div>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">类型</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger data-testid="type-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="suggestion">建议</SelectItem>
                    <SelectItem value="question">问题</SelectItem>
                    <SelectItem value="approval">赞同</SelectItem>
                    <SelectItem value="correction">修正</SelectItem>
                    <SelectItem value="general">评论</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">状态</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="open">开放</SelectItem>
                    <SelectItem value="resolved">已解决</SelectItem>
                    <SelectItem value="closed">已关闭</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* Document Content */}
          <div className="flex-1">
            <Card data-testid="document-content">
              <CardHeader>
                <CardTitle>文档内容</CardTitle>
                <CardDescription>选择文本以添加批注</CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  ref={textRef}
                  className="prose max-w-none select-text cursor-text p-4 border rounded-lg bg-white"
                  onMouseUp={handleTextSelection}
                  data-testid="document-text"
                >
                  {documentContent.split('\n').map((line, index) => (
                    <p key={index} className="mb-4">
                      {line}
                    </p>
                  ))}
                </div>
                
                {/* Comment Form */}
                {showCommentForm && selectedText && (
                  <Card className="mt-4" data-testid="comment-form">
                    <CardHeader>
                      <CardTitle className="text-sm">添加批注</CardTitle>
                      <CardDescription className="text-xs">
                        选中文本："{selectedText.text.substring(0, 50)}..."
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Select value={newCommentType} onValueChange={(value) => setNewCommentType(value as Comment['type'])}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="suggestion">建议</SelectItem>
                            <SelectItem value="question">问题</SelectItem>
                            <SelectItem value="approval">赞同</SelectItem>
                            <SelectItem value="correction">修正</SelectItem>
                            <SelectItem value="general">评论</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Textarea
                          placeholder="输入您的评论... 使用 @用户名 来提及他人"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-20"
                          data-testid="comment-textarea"
                        />
                        
                        <div className="flex gap-2">
                          <Button onClick={handleAddComment} data-testid="submit-comment">
                            <Send className="w-4 h-4 mr-2" />
                            发布评论
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setShowCommentForm(false)
                              setSelectedText(null)
                              setNewComment('')
                            }}
                            data-testid="cancel-comment"
                          >
                            取消
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comments Sidebar */}
          <div className="w-96">
            <Card data-testid="comments-sidebar">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  评论列表 ({filteredComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredComments.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无评论</p>
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4" data-testid="comment-item">
                      {/* Comment Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {comment.author.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{comment.author.name}</div>
                            <div className="text-xs text-gray-500">{comment.createdAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getCommentTypeColor(comment.type)}>
                            {getCommentTypeIcon(comment.type)}
                            <span className="ml-1">{getCommentTypeText(comment.type)}</span>
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(comment.status)}`}></div>
                        </div>
                      </div>

                      {/* Referenced Text */}
                      <div className="mb-3 p-2 bg-gray-50 rounded text-xs text-gray-600 border-l-2 border-blue-500">
                        "{comment.position.text.substring(0, 100)}..."
                      </div>

                      {/* Comment Content */}
                      <div className="mb-3 text-sm">
                        {comment.content}
                      </div>

                      {/* Mentions */}
                      {comment.mentions.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {comment.mentions.map((mention, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <AtSign className="w-3 h-3 mr-1" />
                                {mention}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reactions */}
                      <div className="flex items-center gap-2 mb-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleReaction(comment.id, 'like')}
                          data-testid="like-button"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {comment.reactions.filter(r => r.type === 'like').length}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleReaction(comment.id, 'agree')}
                          data-testid="agree-button"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {comment.reactions.filter(r => r.type === 'agree').length}
                        </Button>
                      </div>

                      {/* Status Actions */}
                      <div className="flex items-center gap-2 mb-3">
                        {comment.status === 'open' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleStatusChange(comment.id, 'resolved')}
                            data-testid="resolve-button"
                          >
                            标记为已解决
                          </Button>
                        )}
                        {comment.status === 'resolved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleStatusChange(comment.id, 'open')}
                            data-testid="reopen-button"
                          >
                            重新打开
                          </Button>
                        )}
                      </div>

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="text-sm" data-testid="reply-item">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                                  {reply.author.name.charAt(0)}
                                </div>
                                <span className="font-medium text-xs">{reply.author.name}</span>
                                <span className="text-xs text-gray-500">{reply.createdAt}</span>
                              </div>
                              <div className="ml-8">{reply.content}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Form */}
                      {replyingTo === comment.id ? (
                        <div className="mt-3 space-y-2">
                          <Textarea
                            placeholder="回复评论... 使用 @用户名 来提及他人"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-16 text-sm"
                            data-testid="reply-textarea"
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleAddReply(comment.id)}
                              data-testid="submit-reply"
                            >
                              回复
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyContent('')
                              }}
                              data-testid="cancel-reply"
                            >
                              取消
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => setReplyingTo(comment.id)}
                          data-testid="reply-button"
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          回复
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default CommentAnnotationSystem