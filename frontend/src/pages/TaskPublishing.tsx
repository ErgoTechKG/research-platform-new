import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Calendar, Clock, Users, Save, Send, FileText, Plus, X, AlertCircle } from 'lucide-react'

interface TaskTemplate {
  id: string
  name: string
  title: string
  description: string
  requirements: string[]
  scoringCriteria: ScoringCriterion[]
}

interface ScoringCriterion {
  id: string
  name: string
  percentage: number
  enabled: boolean
}

interface Student {
  id: string
  name: string
  selected: boolean
}

export default function TaskPublishing() {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [requirements, setRequirements] = useState<string[]>([''])
  const [deadline, setDeadline] = useState('')
  const [assignmentType, setAssignmentType] = useState('all')
  const [showStudentSelection, setShowStudentSelection] = useState(false)
  
  const [templates] = useState<TaskTemplate[]>([
    {
      id: '1',
      name: '文献调研模板',
      title: '第X周：文献调研与综述撰写',
      description: '阅读10篇核心文献，完成3000字综述',
      requirements: [
        '文献需包含近3年顶会论文',
        '综述需包含研究背景、现状、趋势',
        '提交PPT汇报材料'
      ],
      scoringCriteria: [
        { id: '1', name: '文献质量', percentage: 30, enabled: true },
        { id: '2', name: '综述深度', percentage: 40, enabled: true },
        { id: '3', name: '汇报表现', percentage: 20, enabled: true },
        { id: '4', name: '按时提交', percentage: 10, enabled: true }
      ]
    },
    {
      id: '2',
      name: '实验设计模板',
      title: '第X周：实验方案设计',
      description: '设计并撰写实验方案，包含实验目的、步骤、预期结果',
      requirements: [
        '明确实验假设和目标',
        '详细描述实验步骤',
        '预估所需资源和时间',
        '分析可能的风险和应对措施'
      ],
      scoringCriteria: [
        { id: '1', name: '方案完整性', percentage: 35, enabled: true },
        { id: '2', name: '可行性分析', percentage: 35, enabled: true },
        { id: '3', name: '创新性', percentage: 20, enabled: true },
        { id: '4', name: '按时提交', percentage: 10, enabled: true }
      ]
    },
    {
      id: '3',
      name: '代码实现模板',
      title: '第X周：算法实现与测试',
      description: '实现核心算法并完成基础测试',
      requirements: [
        '代码需符合规范，包含必要注释',
        '提供单元测试用例',
        '撰写技术文档',
        '在组会上演示运行结果'
      ],
      scoringCriteria: [
        { id: '1', name: '代码质量', percentage: 40, enabled: true },
        { id: '2', name: '测试覆盖', percentage: 25, enabled: true },
        { id: '3', name: '文档完整', percentage: 25, enabled: true },
        { id: '4', name: '按时提交', percentage: 10, enabled: true }
      ]
    }
  ])

  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriterion[]>([
    { id: '1', name: '文献质量', percentage: 30, enabled: true },
    { id: '2', name: '综述深度', percentage: 40, enabled: true },
    { id: '3', name: '汇报表现', percentage: 20, enabled: true },
    { id: '4', name: '按时提交', percentage: 10, enabled: true }
  ])

  const [students] = useState<Student[]>([
    { id: '1', name: '王小明', selected: true },
    { id: '2', name: '李小红', selected: true },
    { id: '3', name: '张三', selected: true },
    { id: '4', name: '李四', selected: true },
    { id: '5', name: '王五', selected: true }
  ])

  const [selectedStudents, setSelectedStudents] = useState<Student[]>(students)

  // 使用模板
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setTaskTitle(template.title)
      setTaskDescription(template.description)
      setRequirements(template.requirements)
      setScoringCriteria(template.scoringCriteria)
      setSelectedTemplate(templateId)
    }
  }

  // 添加要求
  const handleAddRequirement = () => {
    setRequirements([...requirements, ''])
  }

  // 删除要求
  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  // 更新要求
  const handleUpdateRequirement = (index: number, value: string) => {
    const updated = [...requirements]
    updated[index] = value
    setRequirements(updated)
  }

  // 更新评分标准
  const handleUpdateScoring = (id: string, field: 'enabled' | 'percentage', value: boolean | number) => {
    setScoringCriteria(scoringCriteria.map(criterion =>
      criterion.id === id
        ? { ...criterion, [field]: value }
        : criterion
    ))
  }

  // 保存为模板
  const handleSaveAsTemplate = () => {
    const templateName = prompt('请输入模板名称:')
    if (templateName) {
      const newTemplate: TaskTemplate = {
        id: `custom-${Date.now()}`,
        name: templateName,
        title: taskTitle,
        description: taskDescription,
        requirements: requirements.filter(r => r.trim() !== ''),
        scoringCriteria: scoringCriteria
      }
      console.log('保存模板:', newTemplate)
      alert('模板保存成功！')
    }
  }

  // 发布任务
  const handlePublishTask = () => {
    if (!taskTitle.trim()) {
      alert('请填写任务标题')
      return
    }
    if (!taskDescription.trim()) {
      alert('请填写任务描述')
      return
    }
    if (!deadline) {
      alert('请设置截止时间')
      return
    }

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      requirements: requirements.filter(r => r.trim() !== ''),
      deadline,
      assignmentType,
      assignedStudents: assignmentType === 'all' ? students : selectedStudents.filter(s => s.selected),
      scoringCriteria: scoringCriteria.filter(c => c.enabled)
    }

    console.log('发布任务:', taskData)
    alert('任务发布成功！')
    navigate('/dashboard')
  }

  const totalPercentage = scoringCriteria
    .filter(c => c.enabled)
    .reduce((sum, c) => sum + c.percentage, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb className="mb-4" />
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">发布任务</h1>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="使用模板" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">不使用模板</SelectItem>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    任务标题
                  </label>
                  <Input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="例如：第3周：文献调研与综述撰写"
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>任务详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    目标描述
                  </label>
                  <Textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="描述任务的主要目标..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    具体要求
                  </label>
                  <div className="space-y-2">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-500">•</span>
                        <Input
                          value={req}
                          onChange={(e) => handleUpdateRequirement(index, e.target.value)}
                          placeholder="输入具体要求..."
                          className="flex-1"
                        />
                        {requirements.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveRequirement(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAddRequirement}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加要求
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      截止时间
                    </label>
                    <Input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Users className="w-4 h-4 inline mr-1" />
                      分配给
                    </label>
                    <div className="flex items-center gap-2">
                      <Select value={assignmentType} onValueChange={setAssignmentType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全组成员</SelectItem>
                          <SelectItem value="specific">指定成员</SelectItem>
                        </SelectContent>
                      </Select>
                      {assignmentType === 'specific' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowStudentSelection(!showStudentSelection)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          指定成员
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {assignmentType === 'specific' && showStudentSelection && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-3">选择学生</h4>
                    <div className="space-y-2">
                      {students.map(student => (
                        <div key={student.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedStudents.find(s => s.id === student.id)?.selected || false}
                            onCheckedChange={(checked) => {
                              setSelectedStudents(prev =>
                                prev.map(s =>
                                  s.id === student.id
                                    ? { ...s, selected: checked as boolean }
                                    : s
                                )
                              )
                            }}
                          />
                          <span className="text-sm">{student.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>评分标准</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scoringCriteria.map(criterion => (
                  <div key={criterion.id} className="flex items-center gap-4">
                    <Checkbox
                      checked={criterion.enabled}
                      onCheckedChange={(checked) =>
                        handleUpdateScoring(criterion.id, 'enabled', checked as boolean)
                      }
                    />
                    <span className="flex-1 text-sm">{criterion.name}</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={criterion.percentage}
                        onChange={(e) =>
                          handleUpdateScoring(criterion.id, 'percentage', parseInt(e.target.value) || 0)
                        }
                        className="w-20 text-right"
                        disabled={!criterion.enabled}
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                ))}
              </div>
              {totalPercentage !== 100 && totalPercentage > 0 && (
                <div className="mt-3 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  当前总百分比: {totalPercentage}%（应为100%）
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              取消
            </Button>
            <Button variant="outline" onClick={handleSaveAsTemplate}>
              <Save className="w-4 h-4 mr-1" />
              保存为模板
            </Button>
            <Button onClick={handlePublishTask}>
              <Send className="w-4 h-4 mr-1" />
              发布任务
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}