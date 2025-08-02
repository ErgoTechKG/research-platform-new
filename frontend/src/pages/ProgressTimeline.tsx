import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tooltip } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  PlayCircle, 
  Clock,
  MapPin,
  TrendingUp,
  FileText,
  Users,
  Target
} from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  week: number
  status: 'completed' | 'current' | 'upcoming'
  type: 'meeting' | 'submission' | 'presentation' | 'experiment' | 'deadline'
  date?: Date
  details?: string
}

interface TimelineWeek {
  weekNumber: number
  status: 'completed' | 'current' | 'upcoming'
  milestones: Milestone[]
}

const ProgressTimeline = () => {
  const [currentWeek, setCurrentWeek] = useState(4)
  const [totalWeeks] = useState(8)
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false)

  // Mock timeline data
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      title: '项目启动会',
      description: '轮转课程项目启动和任务分配',
      week: 1,
      status: 'completed',
      type: 'meeting',
      date: new Date('2024-01-15'),
      details: '参与导师介绍研究方向，明确轮转期间的学习目标和任务安排。'
    },
    {
      id: '2',
      title: '文献综述提交',
      description: '提交相关领域文献综述报告',
      week: 2,
      status: 'completed',
      type: 'submission',
      date: new Date('2024-01-22'),
      details: '完成至少20篇相关文献的调研，形成3000字左右的综述报告。'
    },
    {
      id: '3',
      title: '中期汇报',
      description: '项目进展情况中期汇报',
      week: 3,
      status: 'completed',
      type: 'presentation',
      date: new Date('2024-01-29'),
      details: '向导师和实验室成员汇报前期学习成果和研究进展。'
    },
    {
      id: '4',
      title: '实验数据收集',
      description: '开始核心实验数据收集工作',
      week: 4,
      status: 'current',
      type: 'experiment',
      date: new Date('2024-02-05'),
      details: '根据研究计划开展实验，收集关键数据，预计持续2-3周。'
    },
    {
      id: '5',
      title: '数据分析完成',
      description: '完成实验数据的初步分析',
      week: 6,
      status: 'upcoming',
      type: 'deadline',
      date: new Date('2024-02-19'),
      details: '运用统计方法和相关软件完成数据分析，形成初步结论。'
    },
    {
      id: '6',
      title: '成果海报制作',
      description: '制作轮转成果展示海报',
      week: 7,
      status: 'upcoming',
      type: 'submission',
      date: new Date('2024-02-26'),
      details: '设计并制作学术海报，准备在实验室内部或学院内展示。'
    },
    {
      id: '7',
      title: '终期答辩',
      description: '轮转课程终期答辩展示',
      week: 8,
      status: 'upcoming',
      type: 'presentation',
      date: new Date('2024-03-05'),
      details: '向评审委员会展示轮转期间的学习成果和研究收获。'
    }
  ])

  // Generate timeline weeks
  const timelineWeeks: TimelineWeek[] = Array.from({ length: totalWeeks }, (_, index) => {
    const weekNumber = index + 1
    const weekMilestones = milestones.filter(m => m.week === weekNumber)
    
    let status: 'completed' | 'current' | 'upcoming'
    if (weekNumber < currentWeek) {
      status = 'completed'
    } else if (weekNumber === currentWeek) {
      status = 'current'
    } else {
      status = 'upcoming'
    }

    return {
      weekNumber,
      status,
      milestones: weekMilestones
    }
  })

  // Calculate progress percentage
  const progressPercentage = Math.round((currentWeek / totalWeeks) * 100)
  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const totalMilestones = milestones.length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'current':
        return <PlayCircle className="w-4 h-4 text-blue-600" />
      case 'upcoming':
        return <Circle className="w-4 h-4 text-gray-400" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getMilestoneTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="w-4 h-4" />
      case 'submission':
        return <FileText className="w-4 h-4" />
      case 'presentation':
        return <Target className="w-4 h-4" />
      case 'experiment':
        return <TrendingUp className="w-4 h-4" />
      case 'deadline':
        return <Clock className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'current':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-gray-100 text-gray-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'current':
        return '进行中'
      case 'upcoming':
        return '未开始'
      default:
        return '未知'
    }
  }

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setShowMilestoneDialog(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-8 h-8 mr-3" />
                轮转进度时间轴
              </h1>
              <p className="mt-2 text-gray-600">跟踪轮转课程的进度和重要里程碑</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">第{currentWeek}周/{totalWeeks}周</div>
              <div className="text-sm text-gray-500">当前进度 {progressPercentage}%</div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">整体进度</p>
                  <p className="text-2xl font-bold text-blue-600">{progressPercentage}%</p>
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <Progress value={progressPercentage} className="mt-4" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已完成里程碑</p>
                  <p className="text-2xl font-bold text-green-600">{completedMilestones}/{totalMilestones}</p>
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">当前周次</p>
                  <p className="text-2xl font-bold text-purple-600">第{currentWeek}周</p>
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>进度时间轴</CardTitle>
            <CardDescription>
              水平时间轴显示轮转课程各周进度和关键节点
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Desktop Timeline */}
              <div className="hidden md:block">
                <div className="flex items-center justify-between mb-8">
                  {timelineWeeks.map((week, index) => (
                    <div key={week.weekNumber} className="flex flex-col items-center">
                      {/* Week Label */}
                      <div className="text-xs text-gray-500 mb-2">第{week.weekNumber}周</div>
                      
                      {/* Timeline Node */}
                      <div className="relative">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          week.status === 'completed' ? 'bg-green-500 border-green-500' :
                          week.status === 'current' ? 'bg-blue-500 border-blue-500' :
                          'bg-white border-gray-300'
                        }`}>
                          {week.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                          {week.status === 'current' && (
                            <PlayCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        
                        {/* Connection Line */}
                        {index < timelineWeeks.length - 1 && (
                          <div className={`absolute top-3 left-6 w-24 h-0.5 ${
                            week.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                      
                      {/* Milestones for this week */}
                      {week.milestones.length > 0 && (
                        <div className="mt-4 space-y-1">
                          {week.milestones.map((milestone) => (
                            <button
                              key={milestone.id}
                              onClick={() => handleMilestoneClick(milestone)}
                              className="block text-xs text-center p-2 bg-white rounded border hover:shadow-md transition-shadow max-w-24"
                            >
                              <div className="flex items-center justify-center mb-1">
                                {getMilestoneTypeIcon(milestone.type)}
                              </div>
                              <div className="truncate">{milestone.title}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Timeline */}
              <div className="md:hidden space-y-4">
                {timelineWeeks.map((week) => (
                  <div key={week.weekNumber} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        week.status === 'completed' ? 'bg-green-500 border-green-500' :
                        week.status === 'current' ? 'bg-blue-500 border-blue-500' :
                        'bg-white border-gray-300'
                      }`}>
                        {getStatusIcon(week.status)}
                      </div>
                      {week.weekNumber < totalWeeks && (
                        <div className={`w-0.5 h-8 ${
                          week.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">第{week.weekNumber}周</h3>
                        <Badge className={getStatusBadgeColor(week.status)}>
                          {getStatusLabel(week.status)}
                        </Badge>
                      </div>
                      {week.milestones.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {week.milestones.map((milestone) => (
                            <button
                              key={milestone.id}
                              onClick={() => handleMilestoneClick(milestone)}
                              className="w-full text-left p-3 bg-white rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center space-x-2">
                                {getMilestoneTypeIcon(milestone.type)}
                                <span className="font-medium">{milestone.title}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestones Summary */}
        <Card>
          <CardHeader>
            <CardTitle>里程碑事件</CardTitle>
            <CardDescription>
              轮转课程的关键节点和任务
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMilestoneClick(milestone)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(milestone.status)}
                      {getMilestoneTypeIcon(milestone.type)}
                    </div>
                    <div>
                      <h3 className="font-medium">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">第{milestone.week}周</div>
                    <Badge className={getStatusBadgeColor(milestone.status)}>
                      {getStatusLabel(milestone.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestone Detail Dialog */}
        <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedMilestone && getMilestoneTypeIcon(selectedMilestone.type)}
                <span>{selectedMilestone?.title}</span>
              </DialogTitle>
              <DialogDescription>
                第{selectedMilestone?.week}周 • {selectedMilestone?.date?.toLocaleDateString('zh-CN')}
              </DialogDescription>
            </DialogHeader>
            {selectedMilestone && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">状态</label>
                  <div className="mt-1">
                    <Badge className={getStatusBadgeColor(selectedMilestone.status)}>
                      {getStatusLabel(selectedMilestone.status)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">描述</label>
                  <p className="mt-1 text-sm text-gray-600">{selectedMilestone.description}</p>
                </div>
                {selectedMilestone.details && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">详细说明</label>
                    <p className="mt-1 text-sm text-gray-600">{selectedMilestone.details}</p>
                  </div>
                )}
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={() => setShowMilestoneDialog(false)}>
                    关闭
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ProgressTimeline