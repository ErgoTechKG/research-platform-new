import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Circle, Zap, Clock, FileText, Upload, Eye, AlertCircle } from 'lucide-react'

interface Milestone {
  id: string
  name: string
  status: 'completed' | 'in-progress' | 'not-started'
  score?: number
  deadline?: string
  daysRemaining?: number
  description: string
  requirements: string[]
}

export default function MilestoneReportSubmission() {
  const navigate = useNavigate()
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      name: '项目启动',
      status: 'completed',
      score: 95,
      description: '完成项目立项、文献调研和初步方案设计',
      requirements: ['项目计划书', '文献综述报告', '初步技术方案']
    },
    {
      id: '2', 
      name: '中期进展',
      status: 'in-progress',
      deadline: '2025-08-25',
      daysRemaining: 5,
      description: '完成主要实验设计和初步数据收集',
      requirements: ['实验设计方案', '初步实验数据', '中期进展报告']
    },
    {
      id: '3',
      name: '实验完成',
      status: 'not-started',
      deadline: '2025-09-15',
      description: '完成所有实验并进行数据分析',
      requirements: ['完整实验数据', '数据分析报告', '实验总结']
    },
    {
      id: '4',
      name: '最终报告',
      status: 'not-started',
      deadline: '2025-10-01',
      description: '撰写并提交最终研究报告',
      requirements: ['最终研究报告', '项目总结PPT', '成果展示材料']
    }
  ])

  const [currentMilestone, setCurrentMilestone] = useState(milestones[1])
  const [reportContent, setReportContent] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [showRequirements, setShowRequirements] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Zap className="w-5 h-5 text-yellow-500" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'in-progress':
        return '进行中'
      default:
        return '未开始'
    }
  }

  const handleFileUpload = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = true
    fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const fileNames = Array.from(files).map(file => file.name)
        setUploadedFiles(prev => [...prev, ...fileNames])
      }
    }
    fileInput.click()
  }

  const handleSubmit = () => {
    if (!reportContent.trim()) {
      alert('请填写报告内容')
      return
    }
    if (uploadedFiles.length === 0) {
      alert('请上传相关文档')
      return
    }
    
    // 模拟提交
    alert('里程碑报告已提交成功！')
    
    // 更新里程碑状态
    setMilestones(prev => prev.map(m => {
      if (m.id === currentMilestone.id) {
        return { ...m, status: 'completed', score: Math.floor(Math.random() * 10) + 90 }
      }
      return m
    }))
    
    // 清空表单
    setReportContent('')
    setUploadedFiles([])
  }

  const completedCount = milestones.filter(m => m.status === 'completed').length
  const progressPercentage = (completedCount / milestones.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">里程碑报告</h1>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-gray-600">第{milestones.findIndex(m => m.status === 'in-progress') + 1}个里程碑/共{milestones.length}个</span>
              <div className="flex-1">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
          </div>

          {/* 里程碑列表 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>里程碑进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      milestone.status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(milestone.status)}
                      <div>
                        <div className="font-medium">
                          M{index + 1}: {milestone.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {milestone.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {milestone.score && (
                        <Badge variant="secondary">{milestone.score}分</Badge>
                      )}
                      <Badge variant={
                        milestone.status === 'completed' ? 'default' :
                        milestone.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {getStatusText(milestone.status)}
                      </Badge>
                      {milestone.deadline && milestone.status !== 'completed' && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {milestone.daysRemaining ? `${milestone.daysRemaining}天后` : milestone.deadline}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 当前里程碑提交 */}
          <Card>
            <CardHeader>
              <CardTitle>当前里程碑: {currentMilestone.name}报告</CardTitle>
              {currentMilestone.daysRemaining && (
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>截止时间：{currentMilestone.daysRemaining}天后</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="report-content">报告内容</Label>
                <Textarea
                  id="report-content"
                  placeholder="请输入里程碑完成情况、主要成果、遇到的问题等..."
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  rows={8}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>上传文档</Label>
                <div className="mt-2 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>{file}</span>
                      <button
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => navigate('/learning-report')}>
                  <FileText className="w-4 h-4 mr-2" />
                  在线填写表单
                </Button>
                <Button variant="outline" onClick={handleFileUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  上传文档
                </Button>
                <Button variant="outline" onClick={() => setShowRequirements(!showRequirements)}>
                  <Eye className="w-4 h-4 mr-2" />
                  查看要求
                </Button>
              </div>

              {showRequirements && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">里程碑要求</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {currentMilestone.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => navigate('/progress-tracking')}>
                  保存草稿
                </Button>
                <Button onClick={handleSubmit} disabled={!reportContent.trim() || uploadedFiles.length === 0}>
                  提交报告
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}