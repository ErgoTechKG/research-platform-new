import { useState } from 'react'
import { CheckSquare, Square, Filter, Send, Eye, RotateCcw, History, AlertCircle, CheckCircle, Users, Clock, FileText } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { ScrollArea } from '../components/ui/scroll-area'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

interface Assignment {
  id: string
  studentName: string
  studentId: string
  assignmentName: string
  submittedAt: string
  status: 'ungraded' | 'graded' | 'reviewing'
  currentScore?: number
  selected: boolean
}

interface ScoreTemplate {
  id: string
  name: string
  content: string
}

interface OperationHistory {
  id: string
  type: string
  targetCount: number
  operator: string
  timestamp: string
  status: 'completed' | 'reverted'
  details: string
}

export default function BatchOperationsManagement() {
  const [selectedTab, setSelectedTab] = useState('scoring')
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      studentName: '王小明',
      studentId: '2024001',
      assignmentName: '实验报告3',
      submittedAt: '10-15 08:30',
      status: 'ungraded',
      selected: true
    },
    {
      id: '2',
      studentName: '李小红',
      studentId: '2024002',
      assignmentName: '实验报告3',
      submittedAt: '10-15 09:15',
      status: 'ungraded',
      selected: true
    },
    {
      id: '3',
      studentName: '张小华',
      studentId: '2024003',
      assignmentName: '实验报告3',
      submittedAt: '10-15 10:20',
      status: 'ungraded',
      selected: true
    },
    {
      id: '4',
      studentName: '刘大伟',
      studentId: '2024004',
      assignmentName: '实验报告3',
      submittedAt: '10-15 11:45',
      status: 'graded',
      currentScore: 88,
      selected: false
    },
    {
      id: '5',
      studentName: '陈小雨',
      studentId: '2024005',
      assignmentName: '实验报告3',
      submittedAt: '10-15 14:20',
      status: 'ungraded',
      selected: false
    }
  ])

  const [scoreMode, setScoreMode] = useState<'uniform' | 'range'>('range')
  const [uniformScore, setUniformScore] = useState(90)
  const [scoreRange, setScoreRange] = useState({ min: 85, max: 95 })
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customComment, setCustomComment] = useState('')
  const [sendNotification, setSendNotification] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [showPreview, setShowPreview] = useState(false)
  const [previewData, setPreviewData] = useState<any[]>([])

  const scoreTemplates: ScoreTemplate[] = [
    { id: '1', name: '良好完成，继续努力', content: '作业完成质量良好，概念理解准确，继续保持。' },
    { id: '2', name: '优秀作业，值得表扬', content: '作业完成出色，思路清晰，分析深入，值得表扬！' },
    { id: '3', name: '基本完成，仍需改进', content: '作业基本完成要求，但部分内容需要进一步完善。' },
    { id: '4', name: '自定义评语', content: '' }
  ]

  const operationHistory: OperationHistory[] = [
    {
      id: '1',
      type: '批量评分',
      targetCount: 30,
      operator: '张教授',
      timestamp: '2024-01-20 15:30',
      status: 'completed',
      details: '实验报告2批量评分，分数区间85-95'
    },
    {
      id: '2',
      type: '批量通知',
      targetCount: 45,
      operator: '李秘书',
      timestamp: '2024-01-19 10:20',
      status: 'completed',
      details: '发送作业提醒通知'
    },
    {
      id: '3',
      type: '批量状态更新',
      targetCount: 15,
      operator: '王助教',
      timestamp: '2024-01-18 16:45',
      status: 'reverted',
      details: '更新作业提交状态（已撤销）'
    }
  ]

  const selectedCount = assignments.filter(a => a.selected).length

  const handleSelectAll = (checked: boolean) => {
    setAssignments(assignments.map(a => ({ ...a, selected: checked })))
  }

  const handleSelectAssignment = (id: string, checked: boolean) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, selected: checked } : a
    ))
  }

  const handleFilter = () => {
    // Implement filtering logic
    let filtered = [...assignments]
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => {
        if (filterStatus === 'ungraded') return a.status === 'ungraded'
        if (filterStatus === 'graded') return a.status === 'graded'
        return true
      })
    }

    // Update selection based on filter
    setAssignments(filtered)
  }

  const generatePreviewData = () => {
    const selected = assignments.filter(a => a.selected)
    const preview = selected.map(assignment => {
      let score = 0
      if (scoreMode === 'uniform') {
        score = uniformScore
      } else {
        // Generate random score within range
        score = Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min
      }

      const template = scoreTemplates.find(t => t.id === selectedTemplate)
      const comment = selectedTemplate === '4' ? customComment : template?.content || ''

      return {
        ...assignment,
        newScore: score,
        comment: comment
      }
    })

    setPreviewData(preview)
    setShowPreview(true)
  }

  const handleBatchScore = () => {
    // Implement batch scoring
    const updatedAssignments = assignments.map(assignment => {
      const previewItem = previewData.find(p => p.id === assignment.id)
      if (previewItem) {
        return {
          ...assignment,
          status: 'graded' as const,
          currentScore: previewItem.newScore,
          selected: false
        }
      }
      return assignment
    })

    setAssignments(updatedAssignments)
    setShowPreview(false)
    setPreviewData([])
    
    // Show success message
    alert('批量评分成功！')
  }

  const handleRevertOperation = (operationId: string) => {
    // Implement revert logic
    alert(`撤销操作 ${operationId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">批量操作管理</h1>
          <p className="text-muted-foreground">高效处理批量评分、通知和状态更新等操作</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scoring">批量评分</TabsTrigger>
            <TabsTrigger value="notification">批量通知</TabsTrigger>
            <TabsTrigger value="history">操作历史</TabsTrigger>
          </TabsList>

          <TabsContent value="scoring" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>批量评分操作</CardTitle>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    已选: {selectedCount}个作业
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filter bar */}
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedCount === assignments.length && selectedCount > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all">全选</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">筛选:</span>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="ungraded">未评分</SelectItem>
                        <SelectItem value="graded">已评分</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部时间</SelectItem>
                        <SelectItem value="today">今天提交</SelectItem>
                        <SelectItem value="week">本周提交</SelectItem>
                        <SelectItem value="month">本月提交</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleFilter} size="sm" variant="outline">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Assignment list */}
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-2">
                    {assignments.map(assignment => (
                      <div 
                        key={assignment.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={assignment.selected}
                            onCheckedChange={(checked) => 
                              handleSelectAssignment(assignment.id, !!checked)
                            }
                          />
                          <div>
                            <p className="font-medium">
                              {assignment.studentName} - {assignment.assignmentName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              提交: {assignment.submittedAt}
                            </p>
                          </div>
                        </div>
                        {assignment.status === 'graded' && (
                          <Badge variant="outline">
                            已评分: {assignment.currentScore}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Scoring settings */}
                <Card className="p-4">
                  <h3 className="font-medium mb-4">批量评分设置</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>评分模式</Label>
                      <RadioGroup 
                        value={scoreMode} 
                        onValueChange={(value: 'uniform' | 'range') => setScoreMode(value)}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="uniform" id="uniform" />
                          <Label htmlFor="uniform">统一分数</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="range" id="range" />
                          <Label htmlFor="range">区间分数</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {scoreMode === 'uniform' ? (
                      <div>
                        <Label htmlFor="uniform-score">分数</Label>
                        <Input
                          id="uniform-score"
                          type="number"
                          value={uniformScore}
                          onChange={(e) => setUniformScore(Number(e.target.value))}
                          min="0"
                          max="100"
                          className="w-24 mt-1"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label>分数范围</Label>
                        <Input
                          type="number"
                          value={scoreRange.min}
                          onChange={(e) => setScoreRange({ ...scoreRange, min: Number(e.target.value) })}
                          min="0"
                          max="100"
                          className="w-20"
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          value={scoreRange.max}
                          onChange={(e) => setScoreRange({ ...scoreRange, max: Number(e.target.value) })}
                          min="0"
                          max="100"
                          className="w-20"
                        />
                      </div>
                    )}

                    <div>
                      <Label htmlFor="comment-template">评语模板</Label>
                      <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="选择评语模板" />
                        </SelectTrigger>
                        <SelectContent>
                          {scoreTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTemplate === '4' && (
                      <div>
                        <Label htmlFor="custom-comment">自定义评语</Label>
                        <Textarea
                          id="custom-comment"
                          value={customComment}
                          onChange={(e) => setCustomComment(e.target.value)}
                          placeholder="请输入评语内容"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="send-notification"
                        checked={sendNotification}
                        onCheckedChange={(checked) => setSendNotification(!!checked)}
                      />
                      <Label htmlFor="send-notification">发送成绩通知</Label>
                    </div>
                  </div>
                </Card>

                {/* Action buttons */}
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={generatePreviewData}
                    variant="outline"
                    disabled={selectedCount === 0}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    预览结果
                  </Button>
                  <Button
                    onClick={handleBatchScore}
                    disabled={selectedCount === 0 || !showPreview}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    确认评分
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preview dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>评分预览</DialogTitle>
                  <DialogDescription>
                    请确认以下评分信息，确认后将批量应用到选中的作业
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>学生姓名</TableHead>
                        <TableHead>作业名称</TableHead>
                        <TableHead>评分</TableHead>
                        <TableHead>评语</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.studentName}</TableCell>
                          <TableCell>{item.assignmentName}</TableCell>
                          <TableCell className="font-medium">{item.newScore}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.comment}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    取消
                  </Button>
                  <Button onClick={handleBatchScore}>
                    确认评分
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="notification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>批量通知</CardTitle>
                <CardDescription>向选中的学生批量发送通知消息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>通知对象</Label>
                  <Select defaultValue="selected">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="selected">已选学生 ({selectedCount}人)</SelectItem>
                      <SelectItem value="all">全部学生</SelectItem>
                      <SelectItem value="class">按班级</SelectItem>
                      <SelectItem value="group">按小组</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>通知类型</Label>
                  <Select defaultValue="reminder">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reminder">作业提醒</SelectItem>
                      <SelectItem value="score">成绩通知</SelectItem>
                      <SelectItem value="meeting">会议通知</SelectItem>
                      <SelectItem value="custom">自定义通知</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notification-title">通知标题</Label>
                  <Input
                    id="notification-title"
                    placeholder="请输入通知标题"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="notification-content">通知内容</Label>
                  <Textarea
                    id="notification-content"
                    placeholder="请输入通知内容"
                    className="mt-1"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>发送渠道</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="channel-system" defaultChecked />
                      <Label htmlFor="channel-system">系统通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="channel-email" />
                      <Label htmlFor="channel-email">邮件通知</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="channel-sms" />
                      <Label htmlFor="channel-sms">短信通知</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    预览
                  </Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    发送通知
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>操作历史</CardTitle>
                <CardDescription>查看和管理批量操作记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operationHistory.map(operation => (
                    <Card key={operation.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{operation.type}</h4>
                            <Badge variant={operation.status === 'completed' ? 'default' : 'secondary'}>
                              {operation.status === 'completed' ? '已完成' : '已撤销'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {operation.details}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              影响 {operation.targetCount} 个对象
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {operation.timestamp}
                            </span>
                            <span>操作人: {operation.operator}</span>
                          </div>
                        </div>
                        {operation.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevertOperation(operation.id)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            撤销
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Operation statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">今日操作</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">比昨天增加 20%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">本周操作</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68</div>
                  <p className="text-xs text-muted-foreground">处理了 1,250 个对象</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">撤销率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3%</div>
                  <p className="text-xs text-muted-foreground">保持较低水平</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}