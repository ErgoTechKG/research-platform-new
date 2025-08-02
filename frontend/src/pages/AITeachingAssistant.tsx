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
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Brain, 
  MessageSquare, 
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Sparkles,
  FileText,
  BarChart3,
  Target,
  Lightbulb,
  Zap,
  Users,
  Activity,
  Calendar,
  ChevronRight,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Upload,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Network,
  Map,
  Compass
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  helpful?: boolean
}

interface LearningPath {
  id: string
  name: string
  description: string
  progress: number
  estimated: string
  status: 'current' | 'recommended' | 'completed'
  modules: number
}

interface Assignment {
  id: string
  title: string
  submitted: Date
  score?: number
  status: 'pending' | 'graded' | 'reviewing'
  feedback?: string
  aiSuggestions?: string[]
}

interface LearningInsight {
  type: 'strength' | 'weakness' | 'opportunity' | 'warning'
  title: string
  description: string
  action?: string
}

interface KnowledgeNode {
  id: string
  name: string
  mastery: number
  connections: number
  status: 'mastered' | 'learning' | 'new'
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: '请帮我解释一下什么是机器学习中的过拟合？',
    timestamp: new Date(Date.now() - 600000)
  },
  {
    id: '2',
    role: 'assistant',
    content: '过拟合（Overfitting）是机器学习中的一个重要概念。\n\n**定义**：当模型在训练数据上表现很好，但在新数据上表现较差时，我们说模型发生了过拟合。\n\n**形象比喻**：就像学生死记硬背了所有练习题的答案，但遇到新题目就不会做了。\n\n**主要原因**：\n1. 模型过于复杂\n2. 训练数据太少\n3. 训练时间过长\n\n**解决方法**：\n- 增加训练数据\n- 简化模型（减少参数）\n- 使用正则化技术\n- 早停（Early Stopping）\n- 交叉验证\n\n需要我详细解释某个解决方法吗？',
    timestamp: new Date(Date.now() - 300000),
    helpful: true
  }
]

const LEARNING_PATHS: LearningPath[] = [
  {
    id: '1',
    name: '机器学习基础',
    description: '从零开始掌握机器学习核心概念和算法',
    progress: 65,
    estimated: '剩余2周',
    status: 'current',
    modules: 12
  },
  {
    id: '2',
    name: '深度学习进阶',
    description: '深入理解神经网络和深度学习框架',
    progress: 0,
    estimated: '预计4周',
    status: 'recommended',
    modules: 16
  },
  {
    id: '3',
    name: 'Python数据分析',
    description: '使用Python进行数据处理和分析',
    progress: 100,
    estimated: '已完成',
    status: 'completed',
    modules: 8
  }
]

const ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: '线性回归实验报告',
    submitted: new Date('2024-10-28'),
    score: 92,
    status: 'graded',
    feedback: '实验设计合理，数据分析到位。建议在结论部分加入更多对比分析。',
    aiSuggestions: [
      '代码结构清晰，注释完整',
      '可以考虑添加更多可视化图表',
      '建议尝试其他回归模型进行对比'
    ]
  },
  {
    id: '2',
    title: '神经网络作业',
    submitted: new Date('2024-10-30'),
    status: 'reviewing',
    aiSuggestions: [
      '正在分析代码结构...',
      '检查算法实现正确性...'
    ]
  }
]

const LEARNING_INSIGHTS: LearningInsight[] = [
  {
    type: 'strength',
    title: '编程能力突出',
    description: '您的代码质量和算法实现能力在班级中排名前20%',
    action: '建议参加算法竞赛提升水平'
  },
  {
    type: 'weakness',
    title: '理论知识需加强',
    description: '数学推导和理论证明部分得分偏低',
    action: '推荐观看相关理论课程视频'
  },
  {
    type: 'opportunity',
    title: '新课程推荐',
    description: '基于您的学习进度，推荐学习"计算机视觉"课程',
    action: '查看课程大纲'
  },
  {
    type: 'warning',
    title: '学习进度提醒',
    description: '本周学习时长较上周下降40%',
    action: '制定学习计划'
  }
]

const KNOWLEDGE_NODES: KnowledgeNode[] = [
  { id: '1', name: '线性代数', mastery: 85, connections: 8, status: 'mastered' },
  { id: '2', name: '概率论', mastery: 72, connections: 6, status: 'learning' },
  { id: '3', name: '微积分', mastery: 90, connections: 10, status: 'mastered' },
  { id: '4', name: '机器学习', mastery: 65, connections: 12, status: 'learning' },
  { id: '5', name: '深度学习', mastery: 30, connections: 8, status: 'new' },
  { id: '6', name: '数据结构', mastery: 88, connections: 7, status: 'mastered' }
]

export default function AITeachingAssistant() {
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '我正在分析您的问题，这可能需要几秒钟...\n\n根据您的问题，我为您准备了详细的解答。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsAnalyzing(true)
      
      // Simulate analysis
      setTimeout(() => {
        setIsAnalyzing(false)
      }, 3000)
    }
  }

  const getInsightIcon = (type: LearningInsight['type']) => {
    switch (type) {
      case 'strength': return CheckCircle2
      case 'weakness': return AlertTriangle
      case 'opportunity': return Lightbulb
      case 'warning': return AlertCircle
    }
  }

  const getInsightColor = (type: LearningInsight['type']) => {
    switch (type) {
      case 'strength': return 'text-green-600 bg-green-100'
      case 'weakness': return 'text-orange-600 bg-orange-100'
      case 'opportunity': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-red-600 bg-red-100'
    }
  }

  const getNodeColor = (status: KnowledgeNode['status']) => {
    switch (status) {
      case 'mastered': return 'bg-green-500'
      case 'learning': return 'bg-blue-500'
      case 'new': return 'bg-gray-400'
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
              AI 教学助手增强版
            </h1>
            <p className="text-gray-600 mt-1">24/7 智能答疑、个性化学习指导、作业智能批改</p>
          </div>

          <Tabs defaultValue="qa" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="qa">智能答疑</TabsTrigger>
              <TabsTrigger value="path">学习路径</TabsTrigger>
              <TabsTrigger value="knowledge">知识图谱</TabsTrigger>
              <TabsTrigger value="assignment">作业批改</TabsTrigger>
              <TabsTrigger value="insights">学习分析</TabsTrigger>
            </TabsList>

            {/* 智能答疑 Tab */}
            <TabsContent value="qa" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          AI 智能答疑
                        </span>
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          GPT-4 Powered
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col p-0">
                      <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={cn(
                                "flex gap-3",
                                message.role === 'user' ? "justify-end" : "justify-start"
                              )}
                            >
                              {message.role === 'assistant' && (
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-blue-100">
                                    <Bot className="w-4 h-4 text-blue-600" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div className={cn(
                                "max-w-[80%] rounded-lg p-3",
                                message.role === 'user' 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-gray-100 text-gray-900"
                              )}>
                                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                <div className={cn(
                                  "flex items-center gap-2 mt-2 text-xs",
                                  message.role === 'user' ? "text-blue-100" : "text-gray-500"
                                )}>
                                  <Clock className="w-3 h-3" />
                                  {message.timestamp.toLocaleTimeString()}
                                  
                                  {message.role === 'assistant' && message.helpful !== undefined && (
                                    <div className="flex items-center gap-1 ml-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 p-1"
                                      >
                                        <ThumbsUp className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 p-1"
                                      >
                                        <ThumbsDown className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {message.role === 'user' && (
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gray-100">
                                    <User className="w-4 h-4 text-gray-600" />
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          ))}
                          
                          {isTyping && (
                            <div className="flex gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="bg-blue-100">
                                  <Bot className="w-4 h-4 text-blue-600" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="bg-gray-100 rounded-lg p-3">
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      
                      <div className="p-4 border-t">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            handleSendMessage()
                          }}
                          className="flex gap-2"
                        >
                          <Input
                            placeholder="输入您的问题..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">快速提问</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        '解释概念',
                        '代码调试',
                        '作业帮助',
                        '考试复习',
                        '论文指导'
                      ].map((topic) => (
                        <Button
                          key={topic}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => setInputValue(`请帮我${topic}`)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          {topic}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">学习资源</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          课程讲义
                        </span>
                        <Badge>42 份</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-gray-500" />
                          参考书籍
                        </span>
                        <Badge>15 本</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-gray-500" />
                          练习题库
                        </span>
                        <Badge>238 题</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      AI助手全天候在线，平均响应时间小于3秒
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            {/* 学习路径 Tab */}
            <TabsContent value="path" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {LEARNING_PATHS.map((path) => (
                    <Card
                      key={path.id}
                      className={cn(
                        "cursor-pointer transition-all",
                        selectedPath === path.id ? "ring-2 ring-blue-500" : "",
                        path.status === 'completed' && "opacity-75"
                      )}
                      onClick={() => setSelectedPath(path.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {path.name}
                              {path.status === 'current' && (
                                <Badge variant="default" className="text-xs">进行中</Badge>
                              )}
                              {path.status === 'recommended' && (
                                <Badge variant="secondary" className="text-xs">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI推荐
                                </Badge>
                              )}
                              {path.status === 'completed' && (
                                <Badge variant="outline" className="text-xs">已完成</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">{path.progress}%</p>
                            <p className="text-xs text-gray-500">{path.estimated}</p>
                          </div>
                        </div>
                        
                        <Progress value={path.progress} className="mb-3" />
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{path.modules} 个学习模块</span>
                          <Button size="sm" variant="ghost">
                            查看详情 <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Learning Recommendations */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        学习目标
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">本周学习时长</span>
                          <span className="text-sm font-medium">18/20 小时</span>
                        </div>
                        <Progress value={90} className="h-2" />
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">本月完成模块</span>
                          <span className="text-sm font-medium">12/15 个</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">AI 学习建议</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Alert>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          基于您的学习进度，建议每天增加30分钟练习时间
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">推荐学习顺序：</p>
                        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                          <li>完成当前机器学习基础课程</li>
                          <li>开始深度学习预习</li>
                          <li>参加实践项目巩固知识</li>
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 知识图谱 Tab */}
            <TabsContent value="knowledge" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    知识图谱导航
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {KNOWLEDGE_NODES.map((node) => (
                      <div
                        key={node.id}
                        className="text-center space-y-2 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="relative mx-auto w-16 h-16">
                          <div className={cn(
                            "absolute inset-0 rounded-full opacity-20",
                            getNodeColor(node.status)
                          )} />
                          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold">{node.mastery}%</span>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm">{node.name}</h4>
                        <p className="text-xs text-gray-500">{node.connections} 个关联</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">知识掌握度</span>
                      <span className="text-sm text-gray-600">综合评分: 75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">4</p>
                        <p className="text-xs text-gray-500">已掌握</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">2</p>
                        <p className="text-xs text-gray-500">学习中</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-600">3</p>
                        <p className="text-xs text-gray-500">待学习</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      学习地图
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm">已掌握知识点</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="text-sm">正在学习</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full" />
                        <span className="text-sm">计划学习</span>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-4">
                      <Compass className="w-4 h-4 mr-2" />
                      探索完整知识图谱
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">关联推荐</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        基于您的学习进度，推荐以下关联知识点
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-2">
                      {['统计学基础', '优化理论', '信号处理'].map((topic) => (
                        <div key={topic} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <span className="text-sm">{topic}</span>
                          <Button size="sm" variant="ghost">
                            了解更多
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 作业批改 Tab */}
            <TabsContent value="assignment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {ASSIGNMENTS.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              提交时间：{assignment.submitted.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            {assignment.score !== undefined ? (
                              <div>
                                <p className="text-2xl font-bold text-blue-600">{assignment.score}</p>
                                <p className="text-xs text-gray-500">分数</p>
                              </div>
                            ) : (
                              <Badge variant="secondary">
                                {assignment.status === 'reviewing' ? '批改中' : '待批改'}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {assignment.feedback && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 mb-1">教师反馈</p>
                            <p className="text-sm text-blue-800">{assignment.feedback}</p>
                          </div>
                        )}

                        {assignment.aiSuggestions && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              AI 分析建议
                            </p>
                            {assignment.aiSuggestions.map((suggestion, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{suggestion}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            查看详情
                          </Button>
                          {assignment.status === 'graded' && (
                            <Button size="sm" variant="outline">
                              下载批注
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Upload Assignment */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">提交新作业</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div
                          className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.txt,.py,.ipynb"
                          />
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            点击或拖拽文件上传
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            支持 PDF, DOC, TXT, PY, IPYNB
                          </p>
                        </div>

                        {uploadedFile && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium">{uploadedFile.name}</span>
                            </div>
                            {isAnalyzing && (
                              <div className="mt-2">
                                <Progress value={45} className="h-1" />
                                <p className="text-xs text-gray-500 mt-1">AI 正在分析...</p>
                              </div>
                            )}
                          </div>
                        )}

                        <Button className="w-full" disabled={!uploadedFile || isAnalyzing}>
                          <Send className="w-4 h-4 mr-2" />
                          提交作业
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">批改统计</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">平均分数</span>
                          <span className="text-sm font-medium">87.5</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">已批改作业</span>
                          <span className="text-sm font-medium">12/15</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI 辅助批改率</span>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* 学习分析 Tab */}
            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {LEARNING_INSIGHTS.map((insight, index) => {
                  const Icon = getInsightIcon(insight.type)
                  const colorClass = getInsightColor(insight.type)
                  
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-3", colorClass)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{insight.title}</h3>
                        <p className="text-xs text-gray-600 mb-3">{insight.description}</p>
                        {insight.action && (
                          <Button size="sm" variant="outline" className="w-full">
                            {insight.action}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      学习行为分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">每日学习时长趋势</span>
                          <Badge variant="outline">过去7天</Badge>
                        </div>
                        <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                          <BarChart3 className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-2xl font-bold">3.5h</p>
                          <p className="text-xs text-gray-500">日均学习时长</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">85%</p>
                          <p className="text-xs text-gray-500">学习效率</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      预测与建议
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <Brain className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI 预测</strong><br />
                          按当前学习进度，您将在2周内完成机器学习基础课程
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">个性化建议</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                            <p className="text-sm text-gray-600">增加编程练习时间，提升实践能力</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                            <p className="text-sm text-gray-600">参与小组讨论，加深理论理解</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                            <p className="text-sm text-gray-600">定期复习已学内容，巩固记忆</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}