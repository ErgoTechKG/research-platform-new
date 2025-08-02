import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Bell, Settings, BarChart3, Calendar, Clock, 
  AlertCircle, AlertTriangle, Info, Mail, 
  CheckCircle, FileText, Timer, Lightbulb,
  ChevronRight, Edit, Trash2, Plus, Save,
  X, CheckSquare, Square, MoreVertical
} from 'lucide-react'

interface Task {
  id: string
  title: string
  priority: 'urgent' | 'important' | 'normal'
  deadline: Date
  status: 'pending' | 'in_progress' | 'completed'
  category: string
  description: string
  suggestions?: string
  reminders: {
    sent: boolean
    time: string
    channel: string[]
  }[]
  timeRemaining: string
}

interface ReminderRule {
  id: string
  taskType: string
  reminders: {
    time: string
    enabled: boolean
  }[]
  emailEnabled: boolean
  pushEnabled: boolean
}

interface ReminderStats {
  totalReminders: number
  completionRate: number
  delayRate: number
  cancelRate: number
  satisfaction: number
  trends: {
    label: string
    value: number
  }[]
}

export default function SmartTaskReminder() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('tasks')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '实验室轮转志愿提交',
      priority: 'urgent',
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
      status: 'pending',
      category: '作业提交',
      description: '需要提交第二轮实验室轮转的志愿表',
      suggestions: '立即完成，避免错过最后期限',
      reminders: [
        { sent: true, time: '24小时前', channel: ['email', 'system'] },
        { sent: true, time: '12小时前', channel: ['email', 'push'] }
      ],
      timeRemaining: '2小时'
    },
    {
      id: '2',
      title: '综合素质评价材料上传',
      priority: 'important',
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000),
      status: 'pending',
      category: '材料提交',
      description: '上传本学期综合素质评价相关材料',
      suggestions: '准备好材料后统一上传，提高效率',
      reminders: [
        { sent: true, time: '24小时前', channel: ['email'] },
        { sent: false, time: '12小时前', channel: ['email'] }
      ],
      timeRemaining: '12小时'
    },
    {
      id: '3',
      title: '周例会项目汇报',
      priority: 'normal',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'pending',
      category: '会议提醒',
      description: '准备本周项目进度汇报材料',
      suggestions: '提前准备汇报材料，包含进度和问题',
      reminders: [
        { sent: false, time: '24小时前', channel: ['email'] }
      ],
      timeRemaining: '2天'
    },
    {
      id: '4',
      title: '研究方向调研报告',
      priority: 'normal',
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: 'completed',
      category: '作业提交',
      description: '提交研究方向的调研报告',
      reminders: [],
      timeRemaining: '已完成'
    }
  ])

  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([
    {
      id: '1',
      taskType: '作业提交',
      reminders: [
        { time: '24h', enabled: true },
        { time: '12h', enabled: true }
      ],
      emailEnabled: true,
      pushEnabled: true
    },
    {
      id: '2',
      taskType: '考试安排',
      reminders: [
        { time: '72h', enabled: true },
        { time: '24h', enabled: true }
      ],
      emailEnabled: true,
      pushEnabled: true
    },
    {
      id: '3',
      taskType: '会议提醒',
      reminders: [
        { time: '30m', enabled: true },
        { time: '15m', enabled: true }
      ],
      emailEnabled: false,
      pushEnabled: true
    },
    {
      id: '4',
      taskType: '实验预约',
      reminders: [
        { time: '2h', enabled: true },
        { time: '30m', enabled: true }
      ],
      emailEnabled: true,
      pushEnabled: true
    }
  ])

  const [stats] = useState<ReminderStats>({
    totalReminders: 156,
    completionRate: 91,
    delayRate: 8,
    cancelRate: 1,
    satisfaction: 4.8,
    trends: [
      { label: '1月', value: 85 },
      { label: '2月', value: 88 },
      { label: '3月', value: 91 }
    ]
  })

  const [showAddRuleForm, setShowAddRuleForm] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'important':
        return 'bg-orange-500'
      case 'normal':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="w-4 h-4" />
      case 'important':
        return <AlertTriangle className="w-4 h-4" />
      case 'normal':
        return <Info className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '紧急'
      case 'important':
        return '重要'
      case 'normal':
        return '普通'
      default:
        return '未知'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600'
      case 'in_progress':
        return 'text-blue-600'
      case 'completed':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredTasks = tasks.filter(task => 
    selectedPriority === 'all' || task.priority === selectedPriority
  )

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
  const todayTasks = tasks.filter(t => {
    const deadline = new Date(t.deadline)
    const today = new Date()
    return deadline.toDateString() === today.toDateString() && t.status !== 'completed'
  }).length
  const upcomingTasks = tasks.filter(t => t.status !== 'completed').length

  const handleTaskAction = (taskId: string, action: string) => {
    if (action === 'complete') {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'completed' } : task
      ))
    }
  }

  const handleRuleToggle = (ruleId: string, field: string, index?: number) => {
    setReminderRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        if (field === 'email') {
          return { ...rule, emailEnabled: !rule.emailEnabled }
        } else if (field === 'push') {
          return { ...rule, pushEnabled: !rule.pushEnabled }
        } else if (field === 'reminder' && index !== undefined) {
          const newReminders = [...rule.reminders]
          newReminders[index].enabled = !newReminders[index].enabled
          return { ...rule, reminders: newReminders }
        }
      }
      return rule
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">智能任务提醒中心</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/notification-center')}>
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                统计
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700">紧急提醒</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-red-700">{urgentTasks}个紧急任务</div>
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-sm text-red-600 mt-2">需要立即处理</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">今日提醒</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-700">{todayTasks}个</div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600 mt-2">今日到期</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">未来提醒</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-700">{upcomingTasks}个</div>
                  <FileText className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-sm text-gray-600 mt-2">即将到期</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">提醒设置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-700">自定义</div>
                  <Settings className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-sm text-gray-600 mt-2">规则配置</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">任务列表</TabsTrigger>
              <TabsTrigger value="rules">提醒规则配置</TabsTrigger>
              <TabsTrigger value="stats">提醒统计分析</TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>任务列表</CardTitle>
                    <Select
                      value={selectedPriority}
                      onValueChange={setSelectedPriority}
                    >
                      <option value="all">全部任务</option>
                      <option value="urgent">紧急任务</option>
                      <option value="important">重要任务</option>
                      <option value="normal">普通任务</option>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {filteredTasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`border rounded-lg p-4 ${
                            task.status === 'completed' ? 'bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-1 h-6 rounded ${getPriorityColor(task.priority)}`} />
                                <Badge 
                                  variant={
                                    task.priority === 'urgent' ? 'destructive' :
                                    task.priority === 'important' ? 'default' : 'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {getPriorityIcon(task.priority)}
                                  <span className="ml-1">{getPriorityText(task.priority)}</span>
                                </Badge>
                                <h3 className={`font-medium text-lg ${
                                  task.status === 'completed' ? 'line-through text-gray-500' : ''
                                }`}>
                                  {task.title}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Timer className="w-4 h-4" />
                                  <span>剩余: {task.timeRemaining}</span>
                                </div>
                              </div>
                              
                              {task.suggestions && (
                                <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded">
                                  <Lightbulb className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-blue-700">建议：{task.suggestions}</span>
                                </div>
                              )}

                              {task.reminders.length > 0 && (
                                <div className="mb-3 text-sm text-gray-600">
                                  {task.reminders.map((reminder, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      {reminder.sent ? (
                                        <>
                                          <Mail className="w-3 h-3" />
                                          <span>已发送{reminder.channel.join('、')}提醒</span>
                                        </>
                                      ) : (
                                        <span className="text-gray-400">
                                          {reminder.time}将发送{reminder.channel.join('、')}提醒
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex gap-2">
                                {task.status !== 'completed' && (
                                  <>
                                    <Button 
                                      size="sm" 
                                      variant={task.priority === 'urgent' ? 'destructive' : 'default'}
                                      onClick={() => navigate(`/task/${task.id}`)}
                                    >
                                      <FileText className="w-4 h-4 mr-1" />
                                      立即处理
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                    >
                                      <Clock className="w-4 h-4 mr-1" />
                                      延后提醒
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleTaskAction(task.id, 'complete')}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      标记完成
                                    </Button>
                                  </>
                                )}
                                {task.status === 'completed' && (
                                  <>
                                    <Button size="sm" variant="outline">
                                      <BarChart3 className="w-4 h-4 mr-1" />
                                      查看反馈
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <ChevronRight className="w-4 h-4 mr-1" />
                                      相关任务
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {task.status === 'completed' && (
                              <div className="text-right">
                                <CheckCircle className="w-6 h-6 text-green-500 mb-1" />
                                <p className="text-sm text-green-600">已于昨天提交</p>
                                <p className="text-xs text-gray-500">完成质量：优秀</p>
                                <p className="text-xs text-gray-500">用时：比预期少20%</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>提醒规则配置</CardTitle>
                    <Button size="sm" onClick={() => setShowAddRuleForm(!showAddRuleForm)}>
                      <Plus className="w-4 h-4 mr-2" />
                      添加规则
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">任务类型</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">提前提醒</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">邮件通知</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">推送通知</th>
                          <th className="text-center py-3 px-4 font-medium text-gray-700">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reminderRules.map((rule) => (
                          <tr key={rule.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">{rule.taskType}</td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {rule.reminders.map((reminder, index) => (
                                  <label key={index} className="flex items-center gap-1 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={reminder.enabled}
                                      onChange={() => handleRuleToggle(rule.id, 'reminder', index)}
                                      className="rounded"
                                    />
                                    <span className="text-sm">{reminder.time}</span>
                                  </label>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Switch
                                checked={rule.emailEnabled}
                                onCheckedChange={() => handleRuleToggle(rule.id, 'email')}
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Switch
                                checked={rule.pushEnabled}
                                onCheckedChange={() => handleRuleToggle(rule.id, 'push')}
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Save className="w-4 h-4 mr-2" />
                        保存设置
                      </Button>
                      <Button variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        重置默认
                      </Button>
                    </div>
                    <Button variant="outline">
                      <Info className="w-4 h-4 mr-2" />
                      帮助说明
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>提醒统计分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-700 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        本月提醒效果
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">总提醒:</span>
                          <span className="font-medium">{stats.totalReminders}次</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">及时完成:</span>
                          <span className="font-medium text-green-600">
                            {Math.round(stats.totalReminders * stats.completionRate / 100)}次
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">延期:</span>
                          <span className="font-medium text-orange-600">
                            {Math.round(stats.totalReminders * stats.delayRate / 100)}次
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">取消:</span>
                          <span className="font-medium text-red-600">
                            {Math.round(stats.totalReminders * stats.cancelRate / 100)}次
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-700 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        完成率趋势
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">▲</span>
                          <span className="text-sm">提升 15%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">▲</span>
                          <span className="text-sm">按时率 {stats.completionRate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">▼</span>
                          <span className="text-sm">延期率 {stats.delayRate}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">▲</span>
                          <span className="text-sm">满意度 {stats.satisfaction}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-700 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        改进建议
                      </h3>
                      <div className="space-y-2">
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            建议将会议提醒提前至30分钟
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            可以减少重复提醒频率
                          </AlertDescription>
                        </Alert>
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            增加周末任务提醒
                          </AlertDescription>
                        </Alert>
                      </div>
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