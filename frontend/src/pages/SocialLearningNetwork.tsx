import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Users, 
  MessageSquare, 
  Share2,
  UserPlus,
  Trophy,
  Star,
  Clock,
  Send,
  Sparkles,
  FileText,
  Heart,
  MessageCircle,
  ChevronRight,
  Calendar,
  MapPin,
  Book,
  Target,
  GitBranch,
  Folder,
  TrendingUp,
  Award,
  ThumbsUp,
  MoreVertical,
  Search,
  Filter,
  Plus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UsersIcon,
  Brain,
  Lightbulb,
  Zap,
  Save,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LearningGroup {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  tags: string[]
  createdAt: Date
  creator: string
  status: 'active' | 'full' | 'archived'
  avatar?: string
  lastActive: Date
}

interface SharedExperience {
  id: string
  author: {
    name: string
    avatar?: string
    role: string
  }
  title: string
  content: string
  tags: string[]
  likes: number
  comments: number
  createdAt: Date
  isLiked?: boolean
}

interface PairingRecommendation {
  id: string
  user: {
    name: string
    avatar?: string
    role: 'mentor' | 'student'
    field: string
  }
  matchScore: number
  matchReasons: string[]
  skills: string[]
  availability: string
}

interface CollaborationProject {
  id: string
  name: string
  description: string
  members: {
    name: string
    avatar?: string
    role: string
  }[]
  progress: number
  tasks: {
    total: number
    completed: number
  }
  deadline: Date
  status: 'planning' | 'in-progress' | 'review' | 'completed'
}

interface PeerReview {
  id: string
  project: string
  reviewer: {
    name: string
    avatar?: string
  }
  score: number
  feedback: string
  createdAt: Date
  status: 'pending' | 'submitted'
}

const LEARNING_GROUPS: LearningGroup[] = [
  {
    id: '1',
    name: '机器学习研究小组',
    description: '深入探讨机器学习算法和实践应用',
    members: 8,
    maxMembers: 10,
    tags: ['机器学习', 'Python', '深度学习'],
    createdAt: new Date('2024-09-15'),
    creator: '李教授',
    status: 'active',
    lastActive: new Date('2024-10-30 14:00')
  },
  {
    id: '2',
    name: '论文写作互助组',
    description: '相互帮助提升学术论文写作能力',
    members: 15,
    maxMembers: 15,
    tags: ['论文写作', '学术交流'],
    createdAt: new Date('2024-10-01'),
    creator: '王同学',
    status: 'full',
    lastActive: new Date('2024-10-30 10:00')
  },
  {
    id: '3',
    name: '数据可视化兴趣组',
    description: '学习和分享数据可视化技术',
    members: 6,
    maxMembers: 12,
    tags: ['数据可视化', 'D3.js', 'Python'],
    createdAt: new Date('2024-10-10'),
    creator: '张同学',
    status: 'active',
    lastActive: new Date('2024-10-29 16:30')
  }
]

const SHARED_EXPERIENCES: SharedExperience[] = [
  {
    id: '1',
    author: {
      name: '李明',
      role: '博士生',
      avatar: undefined
    },
    title: '如何高效阅读机器学习论文',
    content: '分享我总结的论文阅读方法：1. 先读摘要和结论 2. 浏览图表理解核心思想 3. 深入方法部分...',
    tags: ['学习方法', '论文阅读'],
    likes: 128,
    comments: 23,
    createdAt: new Date('2024-10-28'),
    isLiked: true
  },
  {
    id: '2',
    author: {
      name: '王教授',
      role: '导师',
      avatar: undefined
    },
    title: '科研项目时间管理心得',
    content: '作为导师，我发现很多学生在时间管理上存在问题。这里分享几个实用的时间管理技巧...',
    tags: ['时间管理', '科研技巧'],
    likes: 256,
    comments: 45,
    createdAt: new Date('2024-10-27'),
    isLiked: false
  }
]

const PAIRING_RECOMMENDATIONS: PairingRecommendation[] = [
  {
    id: '1',
    user: {
      name: '陈教授',
      role: 'mentor',
      field: '机器学习'
    },
    matchScore: 95,
    matchReasons: ['研究方向高度匹配', '时间安排吻合', '指导风格适合'],
    skills: ['深度学习', '计算机视觉', 'PyTorch'],
    availability: '每周三、五下午'
  },
  {
    id: '2',
    user: {
      name: '刘同学',
      role: 'student',
      field: '数据分析'
    },
    matchScore: 88,
    matchReasons: ['学习目标一致', '技能互补', '性格相似'],
    skills: ['Python', '数据可视化', '统计分析'],
    availability: '工作日晚上'
  }
]

const COLLABORATION_PROJECTS: CollaborationProject[] = [
  {
    id: '1',
    name: '智能推荐系统开发',
    description: '基于深度学习的个性化推荐系统',
    members: [
      { name: '张三', role: '项目负责人' },
      { name: '李四', role: '算法工程师' },
      { name: '王五', role: '前端开发' }
    ],
    progress: 65,
    tasks: { total: 24, completed: 16 },
    deadline: new Date('2024-12-15'),
    status: 'in-progress'
  }
]

export default function SocialLearningNetwork() {
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [newGroupTags, setNewGroupTags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [newExperience, setNewExperience] = useState({
    title: '',
    content: '',
    tags: ''
  })
  const [selectedProject, setSelectedProject] = useState<string>('')

  const handleCreateGroup = () => {
    // Simulate group creation
    console.log('Creating group:', { newGroupName, newGroupDescription, newGroupTags })
    setShowCreateGroup(false)
    setNewGroupName('')
    setNewGroupDescription('')
    setNewGroupTags('')
  }

  const handleShareExperience = () => {
    // Simulate sharing experience
    console.log('Sharing experience:', newExperience)
    setNewExperience({ title: '', content: '', tags: '' })
  }

  const handleJoinGroup = (groupId: string) => {
    console.log('Joining group:', groupId)
  }

  const handleConnect = (userId: string) => {
    console.log('Connecting with user:', userId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'full': return 'bg-orange-100 text-orange-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'text-blue-600 bg-blue-100'
      case 'in-progress': return 'text-green-600 bg-green-100'
      case 'review': return 'text-orange-600 bg-orange-100'
      case 'completed': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (hours < 1) return '刚刚'
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              社交学习网络
            </h1>
            <p className="text-gray-600 mt-1">加入学习小组，分享经验，找到合适的学习伙伴</p>
          </div>

          <Tabs defaultValue="groups" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="groups">学习小组</TabsTrigger>
              <TabsTrigger value="experiences">经验分享</TabsTrigger>
              <TabsTrigger value="pairing">智能配对</TabsTrigger>
              <TabsTrigger value="projects">协作项目</TabsTrigger>
              <TabsTrigger value="reviews">同伴互评</TabsTrigger>
            </TabsList>

            {/* 学习小组 Tab */}
            <TabsContent value="groups" className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索小组..."
                      className="pl-10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="选择标签" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有标签</SelectItem>
                      <SelectItem value="机器学习">机器学习</SelectItem>
                      <SelectItem value="论文写作">论文写作</SelectItem>
                      <SelectItem value="数据分析">数据分析</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setShowCreateGroup(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  创建小组
                </Button>
              </div>

              {showCreateGroup && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>创建新的学习小组</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">小组名称</label>
                      <Input
                        placeholder="输入小组名称..."
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">小组描述</label>
                      <Textarea
                        placeholder="描述小组的目标和活动..."
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">标签（逗号分隔）</label>
                      <Input
                        placeholder="如：机器学习, Python, 深度学习"
                        value={newGroupTags}
                        onChange={(e) => setNewGroupTags(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateGroup}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        创建小组
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                        取消
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LEARNING_GROUPS.map((group) => (
                  <Card
                    key={group.id}
                    className={cn(
                      "hover:shadow-lg transition-all cursor-pointer",
                      selectedGroup === group.id && "ring-2 ring-blue-500"
                    )}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            {group.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-gray-500">创建者: {group.creator}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(group.status)}>
                          {group.status === 'active' ? '活跃' : 
                           group.status === 'full' ? '已满' : '已归档'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {group.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-gray-500">
                          <UsersIcon className="w-4 h-4" />
                          <span>{group.members}/{group.maxMembers} 成员</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(group.lastActive)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {group.status === 'active' && group.members < group.maxMembers ? (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleJoinGroup(group.id)
                            }}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            加入小组
                          </Button>
                        ) : (
                          <Button size="sm" className="w-full" disabled>
                            {group.status === 'full' ? '小组已满' : '查看详情'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-blue-600">42</p>
                    <p className="text-sm text-gray-600 mt-1">活跃小组</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-green-600">386</p>
                    <p className="text-sm text-gray-600 mt-1">活跃成员</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-purple-600">1.2k</p>
                    <p className="text-sm text-gray-600 mt-1">讨论话题</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-orange-600">89%</p>
                    <p className="text-sm text-gray-600 mt-1">满意度</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 经验分享 Tab */}
            <TabsContent value="experiences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>分享您的经验</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="分享标题..."
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="分享您的学习心得、研究经验或实用技巧..."
                    value={newExperience.content}
                    onChange={(e) => setNewExperience({ ...newExperience, content: e.target.value })}
                    rows={4}
                  />
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="添加标签（逗号分隔）"
                      value={newExperience.tags}
                      onChange={(e) => setNewExperience({ ...newExperience, tags: e.target.value })}
                      className="max-w-xs"
                    />
                    <Button onClick={handleShareExperience}>
                      <Send className="w-4 h-4 mr-2" />
                      发布分享
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {SHARED_EXPERIENCES.map((experience) => (
                  <Card key={experience.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{experience.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{experience.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{experience.author.name}</span>
                                <span>·</span>
                                <span>{experience.author.role}</span>
                                <span>·</span>
                                <span>{formatDate(experience.createdAt)}</span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <p className="text-gray-700 mb-3">{experience.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {experience.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Button
                              size="sm"
                              variant={experience.isLiked ? "default" : "outline"}
                              className="gap-2"
                            >
                              <Heart className={cn("w-4 h-4", experience.isLiked && "fill-current")} />
                              {experience.likes}
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <MessageCircle className="w-4 h-4" />
                              {experience.comments}
                            </Button>
                            <Button size="sm" variant="ghost" className="gap-2">
                              <Share2 className="w-4 h-4" />
                              分享
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline">
                  加载更多
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </TabsContent>

            {/* 智能配对 Tab */}
            <TabsContent value="pairing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    AI 智能配对推荐
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      基于您的学习目标、研究方向和时间安排，AI为您推荐最合适的学习伙伴
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {PAIRING_RECOMMENDATIONS.map((recommendation) => (
                      <Card key={recommendation.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback>
                                  {recommendation.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{recommendation.user.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {recommendation.user.role === 'mentor' ? '导师' : '学习伙伴'} · {recommendation.user.field}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">{recommendation.matchScore}%</p>
                              <p className="text-xs text-gray-500">匹配度</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-sm font-medium mb-1">匹配原因</p>
                              <div className="space-y-1">
                                {recommendation.matchReasons.map((reason, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">专长技能</p>
                              <div className="flex flex-wrap gap-2">
                                {recommendation.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>可用时间: {recommendation.availability}</span>
                            </div>
                          </div>
                          
                          <Button
                            className="w-full"
                            onClick={() => handleConnect(recommendation.id)}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            发起连接
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      刷新推荐
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pairing Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>配对偏好设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">我希望找到</label>
                      <Select defaultValue="both">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mentor">导师</SelectItem>
                          <SelectItem value="peer">学习伙伴</SelectItem>
                          <SelectItem value="both">都可以</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">研究方向</label>
                      <Select defaultValue="ml">
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ml">机器学习</SelectItem>
                          <SelectItem value="cv">计算机视觉</SelectItem>
                          <SelectItem value="nlp">自然语言处理</SelectItem>
                          <SelectItem value="robotics">机器人学</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">我的可用时间</label>
                    <Textarea
                      placeholder="请描述您的可用时间，如：周一至周五晚上，周末全天"
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    保存偏好
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 协作项目 Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {COLLABORATION_PROJECTS.map((project) => (
                    <Card
                      key={project.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedProject === project.id && "ring-2 ring-blue-500"
                      )}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{project.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                          </div>
                          <Badge className={cn("text-xs", getProjectStatusColor(project.status))}>
                            {project.status === 'planning' ? '规划中' :
                             project.status === 'in-progress' ? '进行中' :
                             project.status === 'review' ? '审核中' : '已完成'}
                          </Badge>
                        </div>
                        
                        <div className="flex -space-x-2 mb-4">
                          {project.members.slice(0, 4).map((member, index) => (
                            <Avatar key={index} className="w-8 h-8 border-2 border-white">
                              <AvatarFallback className="text-xs">
                                {member.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {project.members.length > 4 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{project.members.length - 4}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">项目进度</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-gray-500" />
                              <span>{project.tasks.completed}/{project.tasks.total} 任务完成</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span>截止: {project.deadline.toLocaleDateString('zh-CN')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            讨论
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <GitBranch className="w-4 h-4 mr-1" />
                            任务
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Folder className="w-4 h-4 mr-1" />
                            文件
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Project Creation */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>创建新项目</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            与小组成员一起创建协作项目
                          </p>
                          <Button>
                            <Lightbulb className="w-4 h-4 mr-2" />
                            发起新项目
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>项目统计</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">参与项目</span>
                          <span className="text-sm font-medium">5 个</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">完成任务</span>
                          <span className="text-sm font-medium">42 个</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">贡献度</span>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">获得好评</span>
                          <span className="text-sm font-medium">
                            <span className="text-yellow-500">★</span> 4.8
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 同伴互评 Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  您有 2 个待完成的同伴评价，请及时完成以维持良好的社区氛围
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pending Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>待评价</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { project: '数据可视化项目', partner: '李四', deadline: '2天后' },
                      { project: '机器学习作业', partner: '王五', deadline: '5天后' }
                    ].map((review, index) => (
                      <div key={index} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.project}</p>
                            <p className="text-sm text-gray-600">合作伙伴: {review.partner}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {review.deadline}
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full">
                          <Star className="w-4 h-4 mr-2" />
                          开始评价
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Received Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>收到的评价</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4">
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-6 h-6",
                              star <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-2xl font-bold">4.8</p>
                      <p className="text-sm text-gray-600">基于 23 个评价</p>
                    </div>
                    
                    <div className="space-y-2">
                      {[
                        { aspect: '专业能力', score: 4.9 },
                        { aspect: '沟通协作', score: 4.7 },
                        { aspect: '责任心', score: 4.8 },
                        { aspect: '创新思维', score: 4.6 }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.aspect}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={item.score * 20} className="w-24 h-2" />
                            <span className="text-sm font-medium">{item.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Review Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>互评指南</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-medium mb-1">客观公正</h4>
                      <p className="text-sm text-gray-600">基于实际表现给出评价</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium mb-1">建设性反馈</h4>
                      <p className="text-sm text-gray-600">提供有助于改进的建议</p>
                    </div>
                    <div className="text-center p-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <ThumbsUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-medium mb-1">积极鼓励</h4>
                      <p className="text-sm text-gray-600">认可优点，鼓励进步</p>
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