import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, Circle, Download, Bell, Plus, Edit2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface TimelineNode {
  id: string
  name: string
  date: Date
  type: 'milestone' | 'deadline' | 'checkpoint'
  status: 'completed' | 'in-progress' | 'pending' | 'overdue'
  description?: string
  reminders?: string[]
}

interface TimelinePhase {
  id: string
  name: string
  startDate: Date
  endDate: Date
  color: string
  nodes: TimelineNode[]
}

export default function TimelinePlanning() {
  const [phases, setPhases] = useState<TimelinePhase[]>([
    {
      id: '1',
      name: '评价准备阶段',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      color: 'bg-blue-500',
      nodes: [
        {
          id: '1-1',
          name: '评价方案制定',
          date: new Date('2024-01-05'),
          type: 'milestone',
          status: 'completed',
          description: '制定本学期综合素质评价实施方案'
        },
        {
          id: '1-2',
          name: '评价标准发布',
          date: new Date('2024-01-10'),
          type: 'milestone',
          status: 'completed',
          description: '发布各维度评价标准和评分细则'
        },
        {
          id: '1-3',
          name: '专家组组建',
          date: new Date('2024-01-15'),
          type: 'checkpoint',
          status: 'in-progress',
          description: '确定各学科评价专家组成员'
        }
      ]
    },
    {
      id: '2',
      name: '信息收集阶段',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-15'),
      color: 'bg-green-500',
      nodes: [
        {
          id: '2-1',
          name: '学生材料提交截止',
          date: new Date('2024-02-28'),
          type: 'deadline',
          status: 'pending',
          description: '学生提交评价材料的最后期限',
          reminders: ['提前一周', '提前三天', '当天']
        },
        {
          id: '2-2',
          name: '初审完成',
          date: new Date('2024-03-10'),
          type: 'checkpoint',
          status: 'pending',
          description: '完成所有提交材料的初步审核'
        }
      ]
    },
    {
      id: '3',
      name: '评价实施阶段',
      startDate: new Date('2024-03-16'),
      endDate: new Date('2024-04-30'),
      color: 'bg-purple-500',
      nodes: [
        {
          id: '3-1',
          name: '专家评审开始',
          date: new Date('2024-03-16'),
          type: 'milestone',
          status: 'pending',
          description: '各专家组开始评审工作'
        },
        {
          id: '3-2',
          name: '评审结果汇总',
          date: new Date('2024-04-20'),
          type: 'deadline',
          status: 'pending',
          description: '各专家组提交评审结果'
        }
      ]
    }
  ])

  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null)
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false)
  const [isEditNodeOpen, setIsEditNodeOpen] = useState(false)
  const [conflicts, setConflicts] = useState<string[]>([])

  const checkTimeConflicts = () => {
    const allNodes = phases.flatMap(phase => phase.nodes)
    const nodesByDate = allNodes.reduce((acc, node) => {
      const dateKey = format(node.date, 'yyyy-MM-dd')
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(node)
      return acc
    }, {} as Record<string, TimelineNode[]>)

    const newConflicts: string[] = []
    Object.entries(nodesByDate).forEach(([date, nodes]) => {
      if (nodes.length > 1) {
        newConflicts.push(`${date} 有 ${nodes.length} 个时间节点冲突`)
      }
    })

    setConflicts(newConflicts)
  }

  const getNodeIcon = (type: string, status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status === 'overdue') return <AlertCircle className="w-5 h-5 text-red-500" />
    if (status === 'in-progress') return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />
    return <Circle className="w-5 h-5 text-gray-400" />
  }

  const getNodeTypeLabel = (type: string) => {
    const labels = {
      milestone: '里程碑',
      deadline: '截止时间',
      checkpoint: '检查点'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || ''
  }

  const exportTimeline = () => {
    const timelineData = phases.map(phase => ({
      phase: phase.name,
      period: `${format(phase.startDate, 'yyyy-MM-dd')} 至 ${format(phase.endDate, 'yyyy-MM-dd')}`,
      nodes: phase.nodes.map(node => ({
        name: node.name,
        date: format(node.date, 'yyyy-MM-dd'),
        type: getNodeTypeLabel(node.type),
        status: node.status,
        description: node.description
      }))
    }))

    const jsonString = JSON.stringify(timelineData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `综合素质评价时间线_${format(new Date(), 'yyyyMMdd')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentDate = new Date()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">时间线规划</h1>
            <p className="text-gray-600 mt-1">综合素质评价各阶段时间节点管理</p>
          </div>

          {/* 时间冲突提醒 */}
          {conflicts.length > 0 && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>时间冲突检测：</strong>
                {conflicts.map((conflict, index) => (
                  <div key={index}>{conflict}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          {/* 时间轴可视化 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>评价时间轴</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsAddNodeOpen(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加节点
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportTimeline}>
                    <Download className="w-4 h-4 mr-1" />
                    导出时间表
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* 时间轴主线 */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />
                
                {/* 阶段和节点 */}
                {phases.map((phase, phaseIndex) => (
                  <div key={phase.id} className="mb-8">
                    {/* 阶段标题 */}
                    <div className="flex items-center mb-4">
                      <div className={`w-4 h-4 rounded-full ${phase.color} relative z-10`} />
                      <div className="ml-4">
                        <h3 className="font-semibold text-lg">{phase.name}</h3>
                        <p className="text-sm text-gray-600">
                          {format(phase.startDate, 'yyyy年M月d日', { locale: zhCN })} - 
                          {format(phase.endDate, 'yyyy年M月d日', { locale: zhCN })}
                        </p>
                      </div>
                    </div>
                    
                    {/* 节点列表 */}
                    {phase.nodes.map((node, nodeIndex) => (
                      <div key={node.id} className="relative flex items-start ml-8 mb-4">
                        {/* 节点连接线 */}
                        <div className="absolute -left-8 top-2.5 w-8 h-0.5 bg-gray-300" />
                        
                        {/* 节点图标 */}
                        <div className="relative z-10 bg-white rounded-full p-1">
                          {getNodeIcon(node.type, node.status)}
                        </div>
                        
                        {/* 节点内容 */}
                        <div className="ml-4 flex-1">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{node.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {getNodeTypeLabel(node.type)}
                                  </Badge>
                                  <Badge className={cn("text-xs", getStatusColor(node.status))}>
                                    {node.status === 'completed' ? '已完成' : 
                                     node.status === 'in-progress' ? '进行中' :
                                     node.status === 'overdue' ? '已逾期' : '待开始'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="w-4 h-4" />
                                    {format(node.date, 'yyyy年M月d日', { locale: zhCN })}
                                  </span>
                                  {node.date < currentDate && node.status === 'pending' && (
                                    <span className="text-red-600 font-medium">已逾期</span>
                                  )}
                                </div>
                                {node.description && (
                                  <p className="text-sm text-gray-600 mt-2">{node.description}</p>
                                )}
                                {node.reminders && node.reminders.length > 0 && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Bell className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      提醒: {node.reminders.join(', ')}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedNode(node)
                                    setIsEditNodeOpen(true)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    // 删除节点逻辑
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 进度统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">总节点数</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {phases.reduce((acc, phase) => acc + phase.nodes.length, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {phases.reduce((acc, phase) => 
                      acc + phase.nodes.filter(n => n.status === 'completed').length, 0
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">进行中</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {phases.reduce((acc, phase) => 
                      acc + phase.nodes.filter(n => n.status === 'in-progress').length, 0
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">已逾期</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {phases.reduce((acc, phase) => 
                      acc + phase.nodes.filter(n => n.status === 'overdue' || 
                        (n.date < currentDate && n.status === 'pending')).length, 0
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* 添加节点对话框 */}
      <Dialog open={isAddNodeOpen} onOpenChange={setIsAddNodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加时间节点</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="node-name">节点名称</Label>
              <Input id="node-name" placeholder="输入节点名称" />
            </div>
            <div>
              <Label htmlFor="node-phase">所属阶段</Label>
              <Select>
                <SelectTrigger id="node-phase">
                  <SelectValue placeholder="选择阶段" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map(phase => (
                    <SelectItem key={phase.id} value={phase.id}>
                      {phase.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="node-type">节点类型</Label>
              <Select>
                <SelectTrigger id="node-type">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milestone">里程碑</SelectItem>
                  <SelectItem value="deadline">截止时间</SelectItem>
                  <SelectItem value="checkpoint">检查点</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="node-date">日期</Label>
              <Input id="node-date" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNodeOpen(false)}>
              取消
            </Button>
            <Button onClick={() => {
              checkTimeConflicts()
              setIsAddNodeOpen(false)
            }}>
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}