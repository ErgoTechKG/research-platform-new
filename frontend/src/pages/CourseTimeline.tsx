import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Circle, Zap, MapPin } from 'lucide-react'

interface MilestoneEvent {
  id: string
  title: string
  week: number
  status: 'completed' | 'in-progress' | 'pending'
  description?: string
}

export default function CourseTimeline() {
  const [currentWeek, setCurrentWeek] = useState(4)
  const totalWeeks = 8
  const progressPercentage = (currentWeek / totalWeeks) * 100

  const milestones: MilestoneEvent[] = [
    { id: '1', title: '项目启动会', week: 1, status: 'completed', description: '确定研究方向和目标' },
    { id: '2', title: '文献综述提交', week: 2, status: 'completed', description: '提交相关文献调研报告' },
    { id: '3', title: '中期汇报', week: 3, status: 'completed', description: '汇报研究进展和初步成果' },
    { id: '4', title: '实验数据收集', week: 4, status: 'in-progress', description: '第4-6周进行实验和数据收集' },
    { id: '5', title: '成果海报制作', week: 7, status: 'pending', description: '制作研究成果展示海报' },
    { id: '6', title: '终期答辩', week: 8, status: 'pending', description: '最终成果展示和答辩' }
  ]

  // 模拟时间推进（实际应用中可能来自后端）
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWeek(prev => {
        if (prev >= totalWeeks) {
          clearInterval(timer)
          return prev
        }
        return prev
      })
    }, 5000)
    return () => clearInterval(timer)
  }, [totalWeeks])

  const getEventIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
      default:
        return <Circle className="w-5 h-5 text-gray-400" />
    }
  }

  const getEventStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'in-progress':
        return '进行中'
      default:
        return '未开始'
    }
  }

  const getNodeStatus = (week: number) => {
    if (week < currentWeek) return 'completed'
    if (week === currentWeek) return 'current'
    return 'pending'
  }

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'current':
        return 'bg-blue-500'
      default:
        return 'bg-gray-300'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>轮转进度时间轴</CardTitle>
                <div className="text-lg font-semibold text-gray-700">
                  第{currentWeek}周/{totalWeeks}周
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 时间轴可视化 */}
              <div className="mb-8">
                <div className="relative">
                  {/* 背景进度条 */}
                  <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full" />
                  
                  {/* 当前进度条 */}
                  <div 
                    className="absolute top-4 left-0 h-2 bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                  
                  {/* 时间节点 */}
                  <div className="relative flex justify-between pt-1">
                    {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => {
                      const status = getNodeStatus(week)
                      const milestone = milestones.find(m => m.week === week)
                      
                      return (
                        <div key={week} className="flex flex-col items-center relative">
                          {/* 当前位置指示器 */}
                          {status === 'current' && (
                            <div className="absolute -top-8 flex items-center">
                              <MapPin className="w-5 h-5 text-blue-500" />
                              <span className="text-sm text-blue-500 ml-1">当前位置</span>
                            </div>
                          )}
                          
                          {/* 节点 */}
                          <div className={`w-8 h-8 rounded-full ${getNodeColor(status)} flex items-center justify-center text-white font-semibold text-sm relative z-10`}>
                            {week}
                          </div>
                          
                          {/* 周标签 */}
                          <span className="text-xs text-gray-600 mt-2">第{week}周</span>
                          
                          {/* 里程碑标签 */}
                          {milestone && (
                            <div className="absolute top-12 w-24 text-center">
                              <p className="text-xs text-gray-700 font-medium">{milestone.title}</p>
                              {milestone.status === 'completed' && (
                                <p className="text-xs text-green-600 mt-1">(已完成)</p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* 里程碑事件列表 */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold mb-4">里程碑事件:</h3>
                <div className="space-y-3">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="mr-3 mt-0.5">
                        {getEventIcon(milestone.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {milestone.title} (第{milestone.week}周)
                          </h4>
                          <span className={`text-sm ${
                            milestone.status === 'completed' ? 'text-green-600' : 
                            milestone.status === 'in-progress' ? 'text-yellow-600' : 
                            'text-gray-500'
                          }`}>
                            {getEventStatusText(milestone.status)}
                            {milestone.status === 'in-progress' && milestone.week < 7 && ' ← 进行中'}
                          </span>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 进度统计 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">课程总进度</p>
                    <p className="text-2xl font-bold text-blue-900">{progressPercentage.toFixed(0)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-700">已完成里程碑</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {milestones.filter(m => m.status === 'completed').length}/{milestones.length}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}