import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Send, Paperclip, Mic, Camera, MoreVertical, Phone, Video, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Navigate } from 'react-router-dom'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  type: 'text' | 'voice' | 'image' | 'file'
  fileUrl?: string
  fileName?: string
  duration?: number
  isRead: boolean
}

interface Chat {
  id: string
  participantId: string
  participantName: string
  participantRole: string
  participantAvatar?: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
}

export default function InstantMessaging() {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chats, setChats] = useState<Chat[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mock data for chats
    setChats([
      {
        id: '1',
        participantId: '1',
        participantName: '张教授',
        participantRole: '导师',
        lastMessage: '方案整体不错，但需要注意以下几点...',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 45),
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        participantId: '2',
        participantName: '李同学',
        participantRole: '学生',
        lastMessage: '收到，我会尽快修改实验方案',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '3',
        participantId: '3',
        participantName: '王教授',
        participantRole: '导师',
        lastMessage: '下周三的组会安排在下午3点',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
        unreadCount: 1,
        isOnline: true
      }
    ])
  }, [])

  useEffect(() => {
    if (selectedChat) {
      // Mock messages for selected chat
      setMessages([
        {
          id: '1',
          senderId: 'student',
          senderName: '我',
          content: '关于实验设计，我有几个问题...',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          type: 'text',
          isRead: true
        },
        {
          id: '2',
          senderId: 'student',
          senderName: '我',
          content: '实验方案v1.pdf',
          timestamp: new Date(Date.now() - 1000 * 60 * 55),
          type: 'file',
          fileName: '实验方案v1.pdf',
          fileUrl: '/files/experiment-plan.pdf',
          isRead: true
        },
        {
          id: '3',
          senderId: selectedChat.participantId,
          senderName: selectedChat.participantName,
          content: '方案整体不错，但需要注意以下几点:\n1. 样本量需要增加到30个\n2. 对照组设置需要更严格',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          type: 'text',
          isRead: true
        },
        {
          id: '4',
          senderId: selectedChat.participantId,
          senderName: selectedChat.participantName,
          content: '',
          timestamp: new Date(Date.now() - 1000 * 60 * 40),
          type: 'voice',
          duration: 150,
          fileUrl: '/files/voice-message.mp3',
          isRead: false
        }
      ])
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'student',
      senderName: '我',
      content: message,
      timestamp: new Date(),
      type: 'text',
      isRead: false
    }

    setMessages([...messages, newMessage])
    setMessage('')

    // Update last message in chat list
    const updatedChats = chats.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: message, lastMessageTime: new Date() }
        : chat
    )
    setChats(updatedChats)
  }

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const filteredChats = chats.filter(chat =>
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has permission (professors and students only)
  if (user.role !== 'professor' && user.role !== 'student') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">即时通讯</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">消息列表</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索联系人..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-380px)]">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedChat?.id === chat.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={chat.participantAvatar} />
                            <AvatarFallback>{chat.participantName[0]}</AvatarFallback>
                          </Avatar>
                          {chat.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{chat.participantName}</h3>
                            <span className="text-xs text-gray-500">
                              {formatDate(chat.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                            {chat.unreadCount > 0 && (
                              <Badge variant="destructive" className="ml-2">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2">
              {selectedChat ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedChat.participantAvatar} />
                          <AvatarFallback>{selectedChat.participantName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="font-semibold">{selectedChat.participantName}</h2>
                          <p className="text-sm text-gray-500">{selectedChat.participantRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-450px)] p-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex mb-4 ${
                            msg.senderId === 'student' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] ${
                              msg.senderId === 'student' ? 'order-2' : 'order-1'
                            }`}
                          >
                            <div
                              className={`rounded-lg p-3 ${
                                msg.senderId === 'student'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              {msg.type === 'text' && (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              )}
                              {msg.type === 'file' && (
                                <div className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4" />
                                  <span className="underline">{msg.fileName}</span>
                                </div>
                              )}
                              {msg.type === 'voice' && (
                                <div className="flex items-center gap-2">
                                  <Mic className="h-4 w-4" />
                                  <span>语音消息 {Math.floor(msg.duration! / 60)}:{(msg.duration! % 60).toString().padStart(2, '0')}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-xs ${
                                  msg.senderId === 'student' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {formatTime(msg.timestamp)}
                                </span>
                                {msg.senderId === 'student' && (
                                  <span className="text-xs text-blue-100">
                                    {msg.isRead ? '已读' : '未读'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Camera className="h-4 w-4" />
                        </Button>
                        <Input
                          placeholder="输入消息..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  选择一个对话开始聊天
                </div>
              )}
            </Card>
          </div>
        </main>
        <Footer />
      </div>
  )
}