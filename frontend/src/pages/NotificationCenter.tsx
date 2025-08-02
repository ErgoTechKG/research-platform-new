import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Bell, Settings, Plus, Edit2, Trash2, 
  AlertCircle, AlertTriangle, Info, Mail, 
  MessageSquare, Smartphone, Clock, CheckCircle,
  XCircle, Send, History
} from 'lucide-react'

interface NotificationType {
  id: string
  name: string
  priority: 'urgent' | 'important' | 'normal' | 'info'
  channels: string[]
  triggerConditions: string
  enabled: boolean
  lastTriggered?: string
  status?: 'sent' | 'pending' | 'failed'
}

interface NotificationHistory {
  id: string
  type: string
  priority: string
  channels: string[]
  recipient: string
  sentAt: string
  status: 'sent' | 'failed' | 'pending'
  content: string
}

export default function NotificationCenter() {
  const navigate = useNavigate()
  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: '1',
      name: '答辩截止提醒',
      priority: 'urgent',
      channels: ['system', 'sms', 'email'],
      triggerConditions: '答辩前1天',
      enabled: true,
      lastTriggered: '2025-08-19 10:00',
      status: 'sent'
    },
    {
      id: '2',
      name: '作业截止提醒',
      priority: 'important',
      channels: ['system', 'email'],
      triggerConditions: '作业截止前3天',
      enabled: true,
      lastTriggered: '2025-08-18 15:00',
      status: 'sent'
    },
    {
      id: '3',
      name: '新任务发布',
      priority: 'normal',
      channels: ['system'],
      triggerConditions: '任务发布时',
      enabled: true,
      lastTriggered: '2025-08-17 09:00',
      status: 'sent'
    },
    {
      id: '4',
      name: '成绩更新通知',
      priority: 'info',
      channels: ['system'],
      triggerConditions: '成绩发布或更新时',
      enabled: true,
      lastTriggered: '2025-08-16 14:00',
      status: 'sent'
    }
  ])

  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([
    {
      id: '1',
      type: '答辩截止提醒',
      priority: 'urgent',
      channels: ['system', 'sms', 'email'],
      recipient: '全体学生',
      sentAt: '2025-08-19 10:00',
      status: 'sent',
      content: '您的毕业答辩将于明天进行，请做好准备'
    },
    {
      id: '2',
      type: '作业截止提醒',
      priority: 'important',
      channels: ['system', 'email'],
      recipient: '张三',
      sentAt: '2025-08-18 15:00',
      status: 'sent',
      content: '实验报告将于3天后截止提交'
    },
    {
      id: '3',
      type: '新任务发布',
      priority: 'normal',
      channels: ['system'],
      recipient: '李四',
      sentAt: '2025-08-17 09:00',
      status: 'failed',
      content: '新的研究任务已发布，请查看详情'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [personalSettings, setPersonalSettings] = useState({
    systemNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'important':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'normal':
        return <Info className="w-4 h-4 text-green-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '紧急通知'
      case 'important':
        return '重要提醒'
      case 'normal':
        return '一般通知'
      case 'info':
        return '信息更新'
      default:
        return '未知'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'system':
        return <Bell className="w-4 h-4" />
      case 'email':
        return <Mail className="w-4 h-4" />
      case 'sms':
        return <Smartphone className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getChannelText = (channel: string) => {
    switch (channel) {
      case 'system':
        return '系统通知'
      case 'email':
        return '邮件'
      case 'sms':
        return '短信'
      default:
        return channel
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const handleToggleNotification = (id: string) => {
    setNotificationTypes(prev => prev.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ))
  }

  const handleDeleteNotification = (id: string) => {
    if (confirm('确定要删除此通知类型吗？')) {
      setNotificationTypes(prev => prev.filter(n => n.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">通知管理中心</h1>
            <Button onClick={() => navigate('/notification-settings')}>
              <Settings className="w-4 h-4 mr-2" />
              通知设置
            </Button>
          </div>

          <Tabs defaultValue="types" className="w-full">
            <TabsList>
              <TabsTrigger value="types">通知类型</TabsTrigger>
              <TabsTrigger value="history">发送历史</TabsTrigger>
              <TabsTrigger value="settings">个人设置</TabsTrigger>
            </TabsList>

            <TabsContent value="types">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>通知类型配置</CardTitle>
                    <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                      <Plus className="w-4 h-4 mr-2" />
                      添加通知类型
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 pb-2 border-b font-medium text-sm text-gray-600">
                      <div>通知类型</div>
                      <div>渠道</div>
                      <div>触发条件</div>
                      <div>状态</div>
                      <div>操作</div>
                    </div>

                    {notificationTypes.map((notification) => (
                      <div key={notification.id} className="grid grid-cols-5 gap-4 items-center py-3 border-b">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(notification.priority)}
                          <div>
                            <div className="font-medium">{notification.name}</div>
                            <Badge variant={
                              notification.priority === 'urgent' ? 'destructive' :
                              notification.priority === 'important' ? 'default' :
                              notification.priority === 'normal' ? 'secondary' : 'outline'
                            } className="text-xs mt-1">
                              {getPriorityText(notification.priority)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {notification.channels.map((channel) => (
                            <div key={channel} className="flex items-center gap-1 text-sm">
                              {getChannelIcon(channel)}
                              <span>{getChannelText(channel)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-sm text-gray-600">
                          {notification.triggerConditions}
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={notification.enabled}
                            onCheckedChange={() => handleToggleNotification(notification.id)}
                          />
                          {notification.status && getStatusIcon(notification.status)}
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>通知发送历史</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationHistory.map((history) => (
                      <div key={history.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getPriorityIcon(history.priority)}
                            <span className="font-medium">{history.type}</span>
                            {getStatusIcon(history.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{history.content}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{history.sentAt}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Send className="w-3 h-3" />
                              <span>发送至: {history.recipient}</span>
                            </div>
                            <div className="flex gap-2">
                              {history.channels.map((channel) => (
                                <Badge key={channel} variant="outline" className="text-xs">
                                  {getChannelText(channel)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">重新发送</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>个人通知设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>系统通知</Label>
                        <p className="text-sm text-gray-600">在系统内接收通知提醒</p>
                      </div>
                      <Switch
                        checked={personalSettings.systemNotifications}
                        onCheckedChange={(checked) => 
                          setPersonalSettings(prev => ({ ...prev, systemNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>邮件通知</Label>
                        <p className="text-sm text-gray-600">通过邮件接收重要通知</p>
                      </div>
                      <Switch
                        checked={personalSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setPersonalSettings(prev => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>短信通知</Label>
                        <p className="text-sm text-gray-600">通过短信接收紧急通知</p>
                      </div>
                      <Switch
                        checked={personalSettings.smsNotifications}
                        onCheckedChange={(checked) => 
                          setPersonalSettings(prev => ({ ...prev, smsNotifications: checked }))
                        }
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-0.5">
                        <Label>免打扰时段</Label>
                        <p className="text-sm text-gray-600">在指定时间段内不接收通知</p>
                      </div>
                      <Switch
                        checked={personalSettings.quietHoursEnabled}
                        onCheckedChange={(checked) => 
                          setPersonalSettings(prev => ({ ...prev, quietHoursEnabled: checked }))
                        }
                      />
                    </div>

                    {personalSettings.quietHoursEnabled && (
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label htmlFor="quiet-start">开始时间</Label>
                          <Input
                            id="quiet-start"
                            type="time"
                            value={personalSettings.quietHoursStart}
                            onChange={(e) => 
                              setPersonalSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="quiet-end">结束时间</Label>
                          <Input
                            id="quiet-end"
                            type="time"
                            value={personalSettings.quietHoursEnd}
                            onChange={(e) => 
                              setPersonalSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button>保存设置</Button>
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