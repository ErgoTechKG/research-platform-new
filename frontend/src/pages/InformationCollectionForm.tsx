import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  FileCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

type FormStep = 'basic' | 'competition' | 'research' | 'social'

interface Competition {
  id: string
  name: string
  level: string
  award: string
  date: string
  role: string
  certificate?: {
    name: string
    size: number
    status: 'uploading' | 'uploaded' | 'verified'
  }
  ocrResults?: {
    nameVerified: boolean
    levelVerified: boolean
    dateVerified: boolean
  }
}

interface BasicInfo {
  name: string
  studentId: string
  grade: string
  major: string
  phone: string
  email: string
}

interface ResearchProject {
  id: string
  name: string
  role: string
  duration: string
  description: string
  achievement?: string
  certificate?: {
    name: string
    size: number
    status: 'uploading' | 'uploaded' | 'verified'
  }
}

interface SocialPractice {
  id: string
  activity: string
  organization: string
  role: string
  duration: string
  description: string
  certificate?: {
    name: string
    size: number
    status: 'uploading' | 'uploaded' | 'verified'
  }
}

export default function InformationCollectionForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('basic')
  const [isEditingCompetition, setIsEditingCompetition] = useState<string | null>(null)
  const [isEditingResearch, setIsEditingResearch] = useState<string | null>(null)
  const [isEditingSocial, setIsEditingSocial] = useState<string | null>(null)
  
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    name: '张三',
    studentId: '2021010101',
    grade: '2021级',
    major: '机械工程',
    phone: '13800138000',
    email: 'zhangsan@hust.edu.cn'
  })
  
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: '1',
      name: '全国大学生数学建模竞赛',
      level: '国家级',
      award: '一等奖',
      date: '2025-05',
      role: '队长',
      certificate: {
        name: 'certificate.pdf',
        size: 1024 * 512,
        status: 'verified'
      },
      ocrResults: {
        nameVerified: true,
        levelVerified: true,
        dateVerified: false
      }
    }
  ])

  const [researchProjects, setResearchProjects] = useState<ResearchProject[]>([])
  const [socialPractices, setSocialPractices] = useState<SocialPractice[]>([])

  const steps = [
    { key: 'basic', label: '基本信息', completed: true },
    { key: 'competition', label: '竞赛获奖', completed: competitions.length > 0 },
    { key: 'research', label: '科研项目', completed: false },
    { key: 'social', label: '社会实践', completed: false }
  ]

  const calculateProgress = () => {
    const completedSteps = steps.filter(s => s.completed).length
    return (completedSteps / steps.length) * 100
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, competitionId?: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type and size
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      alert('仅支持 PDF, JPG, PNG 格式的文件')
      return
    }

    if (file.size > maxSize) {
      alert('文件大小不能超过 5MB')
      return
    }

    // Update competition with file info
    if (competitionId) {
      setCompetitions(prev => prev.map(comp => 
        comp.id === competitionId 
          ? {
              ...comp,
              certificate: {
                name: file.name,
                size: file.size,
                status: 'uploading' as const
              }
            }
          : comp
      ))

      // Simulate upload and OCR
      setTimeout(() => {
        setCompetitions(prev => prev.map(comp => 
          comp.id === competitionId 
            ? {
                ...comp,
                certificate: {
                  ...comp.certificate!,
                  status: 'uploaded' as const
                }
              }
            : comp
        ))
      }, 1000)

      setTimeout(() => {
        setCompetitions(prev => prev.map(comp => 
          comp.id === competitionId 
            ? {
                ...comp,
                certificate: {
                  ...comp.certificate!,
                  status: 'verified' as const
                },
                ocrResults: {
                  nameVerified: true,
                  levelVerified: true,
                  dateVerified: Math.random() > 0.5
                }
              }
            : comp
        ))
      }, 2000)
    }
  }

  const addCompetition = () => {
    const newCompetition: Competition = {
      id: Date.now().toString(),
      name: '',
      level: '',
      award: '',
      date: '',
      role: ''
    }
    setCompetitions([...competitions, newCompetition])
    setIsEditingCompetition(newCompetition.id)
  }

  const deleteCompetition = (id: string) => {
    setCompetitions(competitions.filter(c => c.id !== id))
  }

  const saveProgress = () => {
    // Save to localStorage or backend
    const formData = {
      basicInfo,
      competitions,
      researchProjects,
      socialPractices,
      lastSaved: new Date().toISOString()
    }
    localStorage.setItem('qualityEvaluationForm', JSON.stringify(formData))
    alert('保存成功！')
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center flex-1">
          <div className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
              currentStep === step.key ? "bg-blue-600 text-white" :
              step.completed ? "bg-green-600 text-white" :
              "bg-gray-300 text-gray-600"
            )}>
              {step.completed && currentStep !== step.key ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "ml-2 text-sm font-medium",
              currentStep === step.key ? "text-blue-600" :
              step.completed ? "text-green-600" :
              "text-gray-500"
            )}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-4",
              steps[index + 1].completed || currentStep === steps[index + 1].key
                ? "bg-green-600"
                : "bg-gray-300"
            )} />
          )}
        </div>
      ))}
    </div>
  )

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">姓名</Label>
          <Input 
            id="name" 
            value={basicInfo.name}
            onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="studentId">学号</Label>
          <Input 
            id="studentId" 
            value={basicInfo.studentId}
            onChange={(e) => setBasicInfo({...basicInfo, studentId: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="grade">年级</Label>
          <Input 
            id="grade" 
            value={basicInfo.grade}
            onChange={(e) => setBasicInfo({...basicInfo, grade: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="major">专业</Label>
          <Input 
            id="major" 
            value={basicInfo.major}
            onChange={(e) => setBasicInfo({...basicInfo, major: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="phone">联系电话</Label>
          <Input 
            id="phone" 
            value={basicInfo.phone}
            onChange={(e) => setBasicInfo({...basicInfo, phone: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="email">邮箱</Label>
          <Input 
            id="email" 
            type="email"
            value={basicInfo.email}
            onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})}
          />
        </div>
      </div>
    </div>
  )

  const renderCompetitions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">竞赛获奖信息</h3>
        <Button onClick={addCompetition} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          添加获奖
        </Button>
      </div>

      {competitions.map((competition, index) => (
        <Card key={competition.id} className="relative">
          <CardContent className="pt-6">
            {isEditingCompetition === competition.id ? (
              <div className="space-y-4">
                <div>
                  <Label>竞赛名称</Label>
                  <Input 
                    value={competition.name}
                    onChange={(e) => {
                      setCompetitions(prev => prev.map(c => 
                        c.id === competition.id ? {...c, name: e.target.value} : c
                      ))
                    }}
                    placeholder="请输入竞赛名称"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>级别</Label>
                    <Select 
                      value={competition.level}
                      onValueChange={(value) => {
                        setCompetitions(prev => prev.map(c => 
                          c.id === competition.id ? {...c, level: value} : c
                        ))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择级别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="国家级">国家级</SelectItem>
                        <SelectItem value="省级">省级</SelectItem>
                        <SelectItem value="校级">校级</SelectItem>
                        <SelectItem value="院级">院级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>奖项</Label>
                    <Select
                      value={competition.award}
                      onValueChange={(value) => {
                        setCompetitions(prev => prev.map(c => 
                          c.id === competition.id ? {...c, award: value} : c
                        ))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择奖项" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="特等奖">特等奖</SelectItem>
                        <SelectItem value="一等奖">一等奖</SelectItem>
                        <SelectItem value="二等奖">二等奖</SelectItem>
                        <SelectItem value="三等奖">三等奖</SelectItem>
                        <SelectItem value="优秀奖">优秀奖</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>时间</Label>
                    <Input 
                      type="month"
                      value={competition.date}
                      onChange={(e) => {
                        setCompetitions(prev => prev.map(c => 
                          c.id === competition.id ? {...c, date: e.target.value} : c
                        ))
                      }}
                    />
                  </div>
                  <div>
                    <Label>角色</Label>
                    <Select
                      value={competition.role}
                      onValueChange={(value) => {
                        setCompetitions(prev => prev.map(c => 
                          c.id === competition.id ? {...c, role: value} : c
                        ))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择角色" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="队长">队长</SelectItem>
                        <SelectItem value="队员">队员</SelectItem>
                        <SelectItem value="个人参赛">个人参赛</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingCompetition(null)}
                  >
                    取消
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setIsEditingCompetition(null)}
                  >
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{index + 1}. {competition.name}</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <div>级别: <span className="font-medium text-gray-900">{competition.level}</span></div>
                      <div>奖项: <span className="font-medium text-gray-900">{competition.award}</span></div>
                      <div>时间: <span className="font-medium text-gray-900">{competition.date}</span></div>
                      <div>角色: <span className="font-medium text-gray-900">{competition.role}</span></div>
                    </div>
                    
                    {competition.certificate ? (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{competition.certificate.name}</span>
                          {competition.certificate.status === 'verified' && (
                            <Badge variant="outline" className="text-green-600">
                              <FileCheck className="w-3 h-3 mr-1" />
                              已识别
                            </Badge>
                          )}
                        </div>
                        
                        {competition.ocrResults && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-1">OCR智能识别结果:</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={competition.ocrResults.nameVerified ? "default" : "secondary"}>
                                {competition.ocrResults.nameVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                竞赛名称{competition.ocrResults.nameVerified ? '已识别' : '未识别'}
                              </Badge>
                              <Badge variant={competition.ocrResults.levelVerified ? "default" : "secondary"}>
                                {competition.ocrResults.levelVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                                获奖等级{competition.ocrResults.levelVerified ? '已识别' : '未识别'}
                              </Badge>
                              <Badge variant={competition.ocrResults.dateVerified ? "default" : "secondary"}>
                                {competition.ocrResults.dateVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                {competition.ocrResults.dateVerified ? '日期已识别' : '请确认日期'}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <label className="block">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">拖拽文件到此处或点击上传</p>
                            <p className="text-xs text-gray-500 mt-1">支持格式: PDF, JPG, PNG (最大5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, competition.id)}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingCompetition(competition.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCompetition(competition.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {competitions.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <p>暂无竞赛获奖信息</p>
            <Button onClick={addCompetition} variant="outline" size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-1" />
              添加第一个获奖
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderResearchProjects = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">科研项目信息</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />
          添加项目
        </Button>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <p>暂无科研项目信息</p>
          <Button variant="outline" size="sm" className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            添加第一个项目
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderSocialPractice = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">社会实践信息</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />
          添加实践
        </Button>
      </div>
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <p>暂无社会实践信息</p>
          <Button variant="outline" size="sm" className="mt-2">
            <Plus className="w-4 h-4 mr-1" />
            添加第一个实践
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return renderBasicInfo()
      case 'competition':
        return renderCompetitions()
      case 'research':
        return renderResearchProjects()
      case 'social':
        return renderSocialPractice()
    }
  }

  const getNextStep = (current: FormStep): FormStep | null => {
    const stepOrder: FormStep[] = ['basic', 'competition', 'research', 'social']
    const currentIndex = stepOrder.indexOf(current)
    return currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : null
  }

  const getPreviousStep = (current: FormStep): FormStep | null => {
    const stepOrder: FormStep[] = ['basic', 'competition', 'research', 'social']
    const currentIndex = stepOrder.indexOf(current)
    return currentIndex > 0 ? stepOrder[currentIndex - 1] : null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>综合素质信息采集</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">完成度:</span>
                    <span className="font-semibold">{Math.round(calculateProgress())}%</span>
                  </div>
                  <Button variant="outline" onClick={saveProgress}>
                    <Save className="w-4 h-4 mr-1" />
                    暂存
                  </Button>
                </div>
              </div>
              <Progress value={calculateProgress()} className="mt-2" />
            </CardHeader>
            <CardContent>
              {renderStepIndicator()}
              
              <div className="mt-6">
                {renderCurrentStep()}
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    const prevStep = getPreviousStep(currentStep)
                    if (prevStep) setCurrentStep(prevStep)
                  }}
                  disabled={!getPreviousStep(currentStep)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  上一步
                </Button>
                
                <Button
                  variant="outline"
                  onClick={saveProgress}
                >
                  保存草稿
                </Button>

                <Button
                  onClick={() => {
                    const nextStep = getNextStep(currentStep)
                    if (nextStep) {
                      setCurrentStep(nextStep)
                    } else {
                      alert('提交成功！')
                    }
                  }}
                >
                  {getNextStep(currentStep) ? (
                    <>
                      下一步: {steps.find(s => s.key === getNextStep(currentStep))?.label}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    '提交'
                  )}
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