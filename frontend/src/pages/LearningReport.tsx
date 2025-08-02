import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Circle, Zap, Upload, FileText, Eye, Clock, ChevronRight } from 'lucide-react'

interface Milestone {
  id: string
  name: string
  status: 'completed' | 'in-progress' | 'not-started'
  score?: number
  deadline?: string
  daysRemaining?: number
}

interface ReportForm {
  title: string
  summary: string
  achievements: string
  challenges: string
  nextSteps: string
}

export default function LearningReport() {
  const navigate = useNavigate()
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showRequirements, setShowRequirements] = useState(false)
  const [formData, setFormData] = useState<ReportForm>({
    title: '',
    summary: '',
    achievements: '',
    challenges: '',
    nextSteps: ''
  })

  const milestones: Milestone[] = [
    {
      id: '1',
      name: '项目启动',
      status: 'completed',
      score: 95
    },
    {
      id: '2',
      name: '中期进展',
      status: 'in-progress',
      deadline: '5天后',
      daysRemaining: 5
    },
    {
      id: '3',
      name: '实验完成',
      status: 'not-started'
    },
    {
      id: '4',
      name: '最终报告',
      status: 'not-started'
    }
  ]

  const currentMilestone = milestones.find(m => m.status === 'in-progress') || milestones[1]

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in-progress':
        return <Zap className="w-5 h-5 text-yellow-600" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  // 获取状态文本
  const getStatusText = (milestone: Milestone) => {
    switch (milestone.status) {
      case 'completed':
        return `已完成 (${milestone.score}分)`
      case 'in-progress':
        return `进行中 (截止: ${milestone.deadline})`
      default:
        return '未开始'
    }
  }

  // 处理表单提交
  const handleSubmit = () => {
    if (!formData.title || !formData.summary) {
      alert('请填写必填项')
      return
    }

    console.log('提交报告:', formData)
    alert('报告提交成功！')
    setShowForm(false)
    navigate('/dashboard')
  }

  // 处理文档上传
  const handleDocumentUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('上传文档:', file.name)
        alert(`文档 ${file.name} 上传成功！`)
      }
    }
    input.click()
  }

  // 里程碑要求内容
  const requirements = {
    '项目启动': [
      '完成文献调研，至少阅读15篇相关论文',
      '撰写3000字的文献综述',
      '确定研究方向和技术路线',
      '制定详细的研究计划'
    ],
    '中期进展': [
      '完成实验设计方案',
      '实现核心算法或系统原型',
      '完成至少50%的实验工作',
      '撰写5000字的进展报告',
      '准备15分钟的汇报PPT'
    ],
    '实验完成': [
      '完成所有计划中的实验',
      '整理实验数据和结果',
      '进行数据分析和可视化',
      '撰写实验报告'
    ],
    '最终报告': [
      '完成15000字的完整研究报告',
      '准备20分钟的答辩PPT',
      '提交所有源代码和数据',
      '完成项目总结和反思'
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">里程碑报告</h1>
            <div className="text-sm text-gray-600">
              第{milestones.findIndex(m => m.status === 'in-progress') + 1}个里程碑/共{milestones.length}个
            </div>
          </div>

          {/* 里程碑列表 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                      milestone.status === 'in-progress'
                        ? 'bg-blue-50 border border-blue-200'
                        : milestone.status === 'completed'
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(milestone.status)}
                      <div>
                        <span className="font-medium">
                          M{index + 1}: {milestone.name}
                        </span>
                        <span className="ml-3 text-sm text-gray-600">
                          {getStatusText(milestone)}
                        </span>
                      </div>
                    </div>
                    {milestone.status === 'in-progress' && milestone.daysRemaining && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">
                          {milestone.daysRemaining}天后截止
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 当前里程碑操作 */}
          <Card>
            <CardHeader>
              <CardTitle>当前里程碑: {currentMilestone.name}报告</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => setShowForm(true)}>
                  <FileText className="w-4 h-4 mr-1" />
                  在线填写表单
                </Button>
                <Button variant="outline" onClick={handleDocumentUpload}>
                  <Upload className="w-4 h-4 mr-1" />
                  上传文档
                </Button>
                <Button variant="outline" onClick={() => setShowRequirements(!showRequirements)}>
                  <Eye className="w-4 h-4 mr-1" />
                  查看要求
                </Button>
              </div>

              {/* 显示要求 */}
              {showRequirements && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">里程碑要求:</h4>
                  <ul className="space-y-2">
                    {requirements[currentMilestone.name]?.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 报告表单 */}
          {showForm && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{currentMilestone.name}报告表单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      报告标题 *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="请输入报告标题"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      摘要 *
                    </label>
                    <Textarea
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="简要描述本阶段的工作内容（200字以内）"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      主要成果
                    </label>
                    <Textarea
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      placeholder="详细描述本阶段取得的主要成果"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      遇到的挑战
                    </label>
                    <Textarea
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      placeholder="描述遇到的主要困难和解决方案"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      下一步计划
                    </label>
                    <Textarea
                      value={formData.nextSteps}
                      onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
                      placeholder="说明下一阶段的工作计划"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setShowForm(false)}>
                      取消
                    </Button>
                    <Button onClick={handleSubmit}>
                      提交报告
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong>
              请在截止日期前完成里程碑报告的提交。您可以选择在线填写表单或直接上传PDF文档。
              系统会自动保存您的草稿，您可以随时继续编辑。
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}