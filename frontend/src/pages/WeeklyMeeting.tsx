import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Video, History, Send, Paperclip, Mic, Camera, FileText, Play, Download } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  sender: 'student' | 'teacher'
  senderName: string
  content: string
  timestamp: string
  type: 'text' | 'file' | 'voice'
  attachment?: {
    name: string
    size?: string
    duration?: string
  }
}

export default function WeeklyMeeting() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'student',
      senderName: '张三',
      content: '关于实验设计，我有几个问题想请教您。主要是关于样本选择和对照组设置的部分。',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: '2',
      sender: 'student',
      senderName: '张三',
      content: '',
      timestamp: '10:31 AM',
      type: 'file',
      attachment: {
        name: '实验方案v1.pdf',
        size: '2.3 MB'
      }
    },
    {
      id: '3',
      sender: 'teacher',
      senderName: '张教授',
      content: '方案整体不错，但需要注意以下几点:\n1. 样本量需要增加到30个\n2. 对照组设置需要更严格\n3. 数据收集方法需要更详细的说明',
      timestamp: '11:15 AM',
      type: 'text'
    },
    {
      id: '4',
      sender: 'teacher',
      senderName: '张教授',
      content: '',
      timestamp: '11:16 AM',
      type: 'voice',
      attachment: {
        name: '语音消息',
        duration: '2:30'
      }
    },
    {
      id: '5',
      sender: 'student',
      senderName: '张三',
      content: '明白了，我会根据您的建议修改方案。关于样本量的计算，我使用的是G*Power软件，您看这样合理吗？',
      timestamp: '11:45 AM',
      type: 'text'
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 发送消息
  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      sender: user?.role === 'faculty' ? 'teacher' : 'student',
      senderName: user?.name || '未知用户',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    }

    setMessages([...messages, message])
    setNewMessage('')
  }

  // 处理文件上传
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        sender: user?.role === 'faculty' ? 'teacher' : 'student',
        senderName: user?.name || '未知用户',
        content: '',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        type: 'file',
        attachment: {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
        }
      }
      setMessages([...messages, message])
    }
  }

  // 发送语音消息（模拟）
  const sendVoiceMessage = () => {
    const message: Message = {
      id: Date.now().toString(),
      sender: user?.role === 'faculty' ? 'teacher' : 'student',
      senderName: user?.name || '未知用户',
      content: '',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      type: 'voice',
      attachment: {
        name: '语音消息',
        duration: '0:15'
      }
    }
    setMessages([...messages, message])
  }

  // 渲染消息
  const renderMessage = (message: Message) => {
    const isCurrentUser = 
      (user?.role === 'faculty' && message.sender === 'teacher') ||
      (user?.role !== 'faculty' && message.sender === 'student')

    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          <div className={`text-xs text-gray-500 mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {message.senderName}
          </div>
          <div
            className={`rounded-lg p-3 ${
              isCurrentUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.type === 'text' && (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
            
            {message.type === 'file' && message.attachment && (
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">{message.attachment.name}</p>
                  <p className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.attachment.size}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isCurrentUser ? "secondary" : "outline"}
                  className="h-8 w-8 p-0"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {message.type === 'voice' && message.attachment && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={isCurrentUser ? "secondary" : "outline"}
                  className="h-8 w-8 p-0"
                >
                  <Play className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <div className="h-8 bg-gray-300 bg-opacity-30 rounded flex items-center px-2">
                    <div className="w-full h-1 bg-gray-400 bg-opacity-50 rounded-full">
                      <div className="w-1/3 h-full bg-current rounded-full" />
                    </div>
                  </div>
                </div>
                <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                  {message.attachment.duration}
                </span>
              </div>
            )}
          </div>
          <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  与{user?.role === 'faculty' ? '学生' : '张教授'}的讨论
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Video className="w-4 h-4 mr-1" />
                    视频通话
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="w-4 h-4 mr-1" />
                    查看历史
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
              {/* 消息区域 */}
              <div className="flex-1 overflow-y-auto p-4">
                {showHistory && (
                  <div className="text-center text-gray-500 text-sm py-2 mb-4">
                    —— 历史消息 ——
                  </div>
                )}
                
                {messages.map(renderMessage)}
                <div ref={messagesEndRef} />
              </div>
              
              {/* 输入区域 */}
              <div className="border-t p-4">
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="输入消息..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage}>
                    <Send className="w-4 h-4 mr-1" />
                    发送
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileUpload}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={sendVoiceMessage}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 会议记录提示 */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>
              所有会议内容将自动保存，您可以随时通过"查看历史"功能回顾之前的讨论内容。
              支持发送文本、文件、语音和图片消息。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}