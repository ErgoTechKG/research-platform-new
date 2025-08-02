import { useState } from 'react'
import { PlusCircle, Plus, Save, Play, FileText, Settings, Trash2, Edit2, Power, PowerOff } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Checkbox } from '../components/ui/checkbox'
import { Textarea } from '../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { ScrollArea } from '../components/ui/scroll-area'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

interface Condition {
  id: string
  field: string
  operator: string
  value: string
  unit?: string
}

interface Action {
  systemNotification: boolean
  email: boolean
  sms: boolean
  reminderText: string
}

interface Rule {
  id: string
  name: string
  conditions: Condition[]
  action: Action
  enabled: boolean
  createdAt: string
  lastTriggered?: string
  triggerCount: number
}

export default function SmartReminderRuleEngine() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: '作业截止提醒',
      conditions: [
        { id: '1', field: '作业截止时间', operator: '小于', value: '24', unit: '小时' },
        { id: '2', field: '提交状态', operator: '等于', value: '未提交' }
      ],
      action: {
        systemNotification: true,
        email: true,
        sms: false,
        reminderText: '您有作业即将截止，请及时提交'
      },
      enabled: true,
      createdAt: '2024-01-15',
      lastTriggered: '2024-01-20 14:30',
      triggerCount: 15
    },
    {
      id: '2',
      name: '周报未提交提醒',
      conditions: [
        { id: '1', field: '周报提交状态', operator: '等于', value: '未提交' },
        { id: '2', field: '当前时间', operator: '等于', value: '周五下午5点' }
      ],
      action: {
        systemNotification: true,
        email: false,
        sms: false,
        reminderText: '请提交本周学习周报'
      },
      enabled: true,
      createdAt: '2024-01-10',
      lastTriggered: '2024-01-19 17:00',
      triggerCount: 8
    }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: '',
    conditions: [{ id: '1', field: '', operator: '', value: '' }],
    action: {
      systemNotification: false,
      email: false,
      sms: false,
      reminderText: ''
    },
    enabled: true
  })

  const [testResult, setTestResult] = useState<string>('')
  const [showTestDialog, setShowTestDialog] = useState(false)

  const fieldOptions = [
    '作业截止时间',
    '提交状态',
    '周报提交状态',
    '当前时间',
    '学习进度',
    '出勤率',
    '成绩状态',
    '会议时间'
  ]

  const operatorOptions = [
    '等于',
    '不等于',
    '大于',
    '小于',
    '包含',
    '不包含'
  ]

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: '',
      operator: '',
      value: ''
    }
    setNewRule({
      ...newRule,
      conditions: [...(newRule.conditions || []), newCondition]
    })
  }

  const handleRemoveCondition = (conditionId: string) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions?.filter(c => c.id !== conditionId) || []
    })
  }

  const handleUpdateCondition = (conditionId: string, field: keyof Condition, value: string) => {
    setNewRule({
      ...newRule,
      conditions: newRule.conditions?.map(c => 
        c.id === conditionId ? { ...c, [field]: value } : c
      ) || []
    })
  }

  const handleSaveRule = () => {
    if (editingRule) {
      // Update existing rule
      setRules(rules.map(r => 
        r.id === editingRule.id 
          ? { ...editingRule, ...newRule } as Rule
          : r
      ))
    } else {
      // Create new rule
      const rule: Rule = {
        id: Date.now().toString(),
        name: newRule.name || '新规则',
        conditions: newRule.conditions || [],
        action: newRule.action || {
          systemNotification: false,
          email: false,
          sms: false,
          reminderText: ''
        },
        enabled: true,
        createdAt: new Date().toISOString().split('T')[0],
        triggerCount: 0
      }
      setRules([...rules, rule])
    }
    setIsCreateDialogOpen(false)
    setEditingRule(null)
    resetNewRule()
  }

  const resetNewRule = () => {
    setNewRule({
      name: '',
      conditions: [{ id: '1', field: '', operator: '', value: '' }],
      action: {
        systemNotification: false,
        email: false,
        sms: false,
        reminderText: ''
      },
      enabled: true
    })
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
    setNewRule(rule)
    setIsCreateDialogOpen(true)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(r => r.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ))
  }

  const handleTestRule = (rule: Rule) => {
    // Simulate rule testing
    setTestResult(`规则"${rule.name}"测试成功！
    
触发条件:
${rule.conditions.map(c => `- ${c.field} ${c.operator} ${c.value}${c.unit ? c.unit : ''}`).join('\n')}

执行动作:
${rule.action.systemNotification ? '- ✓ 系统通知' : ''}
${rule.action.email ? '- ✓ 邮件提醒' : ''}
${rule.action.sms ? '- ✓ 短信通知' : ''}

提醒文案: ${rule.action.reminderText}`)
    setShowTestDialog(true)
  }

  const executionLogs = [
    {
      id: '1',
      ruleId: '1',
      ruleName: '作业截止提醒',
      triggerTime: '2024-01-20 14:30:00',
      targetUsers: 15,
      status: 'success',
      details: '成功发送15条提醒'
    },
    {
      id: '2',
      ruleId: '2',
      ruleName: '周报未提交提醒',
      triggerTime: '2024-01-19 17:00:00',
      targetUsers: 8,
      status: 'success',
      details: '成功发送8条提醒'
    },
    {
      id: '3',
      ruleId: '1',
      ruleName: '作业截止提醒',
      triggerTime: '2024-01-19 14:30:00',
      targetUsers: 12,
      status: 'partial',
      details: '发送12条提醒，2条失败'
    }
  ]

  const ruleTemplates = [
    {
      id: '1',
      name: '作业截止提醒模板',
      description: '在作业截止前24小时提醒未提交的学生',
      category: '作业管理'
    },
    {
      id: '2',
      name: '周报提醒模板',
      description: '每周五下午5点提醒未提交周报的学生',
      category: '进度管理'
    },
    {
      id: '3',
      name: '会议提醒模板',
      description: '会议开始前30分钟提醒参会人员',
      category: '会议管理'
    },
    {
      id: '4',
      name: '成绩发布通知模板',
      description: '成绩发布后立即通知学生查看',
      category: '成绩管理'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">智能提醒规则引擎</h1>
          <p className="text-muted-foreground">配置和管理各类自动提醒规则，支持灵活的条件设置和自动化执行</p>
        </div>

        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="rules">规则管理</TabsTrigger>
            <TabsTrigger value="logs">执行日志</TabsTrigger>
            <TabsTrigger value="templates">规则模板</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input
                  placeholder="搜索规则..."
                  className="w-64"
                />
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="enabled">已启用</SelectItem>
                    <SelectItem value="disabled">已禁用</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingRule(null)
                    resetNewRule()
                  }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    新建规则
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingRule ? '编辑规则' : '新建提醒规则'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="rule-name">规则名称</Label>
                      <Input
                        id="rule-name"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="请输入规则名称"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>触发条件</Label>
                      <Card className="p-4">
                        <div className="space-y-2">
                          {newRule.conditions?.map((condition, index) => (
                            <div key={condition.id} className="flex gap-2 items-center">
                              {index > 0 && <span className="text-sm text-muted-foreground">且</span>}
                              <span className="text-sm">当</span>
                              <Select
                                value={condition.field}
                                onValueChange={(value) => handleUpdateCondition(condition.id, 'field', value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="选择字段" />
                                </SelectTrigger>
                                <SelectContent>
                                  {fieldOptions.map(field => (
                                    <SelectItem key={field} value={field}>{field}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select
                                value={condition.operator}
                                onValueChange={(value) => handleUpdateCondition(condition.id, 'operator', value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="操作符" />
                                </SelectTrigger>
                                <SelectContent>
                                  {operatorOptions.map(op => (
                                    <SelectItem key={op} value={op}>{op}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                value={condition.value}
                                onChange={(e) => handleUpdateCondition(condition.id, 'value', e.target.value)}
                                placeholder="值"
                                className="w-24"
                              />
                              {condition.field.includes('时间') && (
                                <Select
                                  value={condition.unit}
                                  onValueChange={(value) => handleUpdateCondition(condition.id, 'unit', value)}
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue placeholder="单位" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="分钟">分钟</SelectItem>
                                    <SelectItem value="小时">小时</SelectItem>
                                    <SelectItem value="天">天</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              {newRule.conditions && newRule.conditions.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveCondition(condition.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddCondition}
                            className="mt-2"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            添加条件
                          </Button>
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-2">
                      <Label>执行动作</Label>
                      <Card className="p-4 space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="system-notification"
                            checked={newRule.action?.systemNotification}
                            onCheckedChange={(checked) => setNewRule({
                              ...newRule,
                              action: { ...newRule.action!, systemNotification: !!checked }
                            })}
                          />
                          <Label htmlFor="system-notification" className="cursor-pointer">
                            发送系统通知
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="email"
                            checked={newRule.action?.email}
                            onCheckedChange={(checked) => setNewRule({
                              ...newRule,
                              action: { ...newRule.action!, email: !!checked }
                            })}
                          />
                          <Label htmlFor="email" className="cursor-pointer">
                            发送邮件提醒
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="sms"
                            checked={newRule.action?.sms}
                            onCheckedChange={(checked) => setNewRule({
                              ...newRule,
                              action: { ...newRule.action!, sms: !!checked }
                            })}
                          />
                          <Label htmlFor="sms" className="cursor-pointer">
                            发送短信通知
                          </Label>
                        </div>
                        <div>
                          <Label htmlFor="reminder-text">提醒文案</Label>
                          <Textarea
                            id="reminder-text"
                            value={newRule.action?.reminderText}
                            onChange={(e) => setNewRule({
                              ...newRule,
                              action: { ...newRule.action!, reminderText: e.target.value }
                            })}
                            placeholder="请输入提醒文案"
                            rows={3}
                          />
                        </div>
                      </Card>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => {
                        setIsCreateDialogOpen(false)
                        setEditingRule(null)
                        resetNewRule()
                      }}>
                        取消
                      </Button>
                      <Button onClick={handleSaveRule}>
                        <Save className="mr-2 h-4 w-4" />
                        保存规则
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {rules.map(rule => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {rule.name}
                          <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                            {rule.enabled ? '已启用' : '已禁用'}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          创建于 {rule.createdAt} · 已触发 {rule.triggerCount} 次
                          {rule.lastTriggered && ` · 最后触发: ${rule.lastTriggered}`}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleRule(rule.id)}
                        >
                          {rule.enabled ? (
                            <Power className="h-4 w-4" />
                          ) : (
                            <PowerOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRule(rule)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTestRule(rule)}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">触发条件</h4>
                        <div className="text-sm text-muted-foreground">
                          {rule.conditions.map((condition, index) => (
                            <div key={condition.id}>
                              {index > 0 && <span>且 </span>}
                              当 {condition.field} {condition.operator} {condition.value}
                              {condition.unit && ` ${condition.unit}`}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">执行动作</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {rule.action.systemNotification && <span>✓ 系统通知</span>}
                          {rule.action.email && <span>✓ 邮件提醒</span>}
                          {rule.action.sms && <span>✓ 短信通知</span>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          提醒文案: {rule.action.reminderText}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>执行日志</CardTitle>
                <CardDescription>查看规则触发历史和执行结果</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>规则名称</TableHead>
                      <TableHead>触发时间</TableHead>
                      <TableHead>目标用户数</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>详情</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {executionLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell>{log.ruleName}</TableCell>
                        <TableCell>{log.triggerTime}</TableCell>
                        <TableCell>{log.targetUsers}</TableCell>
                        <TableCell>
                          <Badge variant={
                            log.status === 'success' ? 'default' :
                            log.status === 'partial' ? 'secondary' : 'destructive'
                          }>
                            {log.status === 'success' ? '成功' :
                             log.status === 'partial' ? '部分成功' : '失败'}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {ruleTemplates.map(template => (
                <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      使用此模板
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>规则测试结果</DialogTitle>
            </DialogHeader>
            <div className="whitespace-pre-wrap text-sm">{testResult}</div>
            <div className="flex justify-end">
              <Button onClick={() => setShowTestDialog(false)}>关闭</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}