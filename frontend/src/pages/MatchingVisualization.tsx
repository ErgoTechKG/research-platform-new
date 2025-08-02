import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Play, RefreshCw, CheckCircle, AlertCircle, Users, UserCheck, UserX, Shuffle } from 'lucide-react'

interface MatchingStage {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  count?: number
  percentage?: number
}

interface MatchingFlow {
  studentSubmissions: number
  acceptedMatches: number
  rejectedApplications: number
  pendingAdjustment: number
  finalMatches: number
}

export default function MatchingVisualization() {
  const navigate = useNavigate()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStage, setCurrentStage] = useState(0)
  
  const [matchingData, setMatchingData] = useState<MatchingFlow>({
    studentSubmissions: 48,
    acceptedMatches: 0,
    rejectedApplications: 0,
    pendingAdjustment: 0,
    finalMatches: 0
  })

  const [stages, setStages] = useState<MatchingStage[]>([
    {
      id: 'submission',
      name: '学生提交志愿',
      description: '学生填报导师志愿，每人可选3个志愿',
      status: 'completed',
      count: 48,
      percentage: 100
    },
    {
      id: 'aggregation',
      name: '系统汇总数据',
      description: '系统整理学生志愿数据，生成申请列表',
      status: 'pending',
      count: 0,
      percentage: 0
    },
    {
      id: 'review',
      name: '导师查看申请',
      description: '导师查看收到的学生申请',
      status: 'pending',
      count: 0,
      percentage: 0
    },
    {
      id: 'decision',
      name: '导师决策',
      description: '导师对申请进行接受/拒绝决策',
      status: 'pending',
      count: 0,
      percentage: 0
    },
    {
      id: 'matching',
      name: '生成初步匹配结果',
      description: '根据双方选择生成匹配结果',
      status: 'pending',
      count: 0,
      percentage: 0
    },
    {
      id: 'adjustment',
      name: '二次调剂',
      description: '对未匹配学生进行调剂',
      status: 'pending',
      count: 0,
      percentage: 0
    },
    {
      id: 'confirmation',
      name: '秘书确认',
      description: '秘书确认最终匹配结果',
      status: 'pending',
      count: 0,
      percentage: 0
    },
    {
      id: 'publish',
      name: '发布最终结果',
      description: '发布并通知所有相关人员',
      status: 'pending',
      count: 0,
      percentage: 0
    }
  ])

  // 模拟匹配流程
  useEffect(() => {
    if (!isRunning) return

    const timer = setTimeout(() => {
      if (currentStage < stages.length - 1) {
        const newStages = [...stages]
        const nextStage = currentStage + 1
        
        // 更新当前阶段状态
        newStages[currentStage].status = 'completed'
        newStages[nextStage].status = 'in-progress'
        
        // 模拟数据变化
        switch (nextStage) {
          case 1: // 系统汇总
            newStages[nextStage].percentage = 100
            newStages[nextStage].count = 48
            break
          case 2: // 导师查看
            newStages[nextStage].percentage = 100
            newStages[nextStage].count = 15 // 15个导师
            break
          case 3: // 导师决策
            newStages[nextStage].percentage = 100
            setMatchingData({
              ...matchingData,
              acceptedMatches: 35,
              rejectedApplications: 13
            })
            break
          case 4: // 生成匹配
            newStages[nextStage].percentage = 100
            newStages[nextStage].count = 35
            break
          case 5: // 二次调剂
            newStages[nextStage].percentage = 100
            newStages[nextStage].count = 8 // 8个学生需要调剂
            setMatchingData({
              ...matchingData,
              acceptedMatches: 35,
              rejectedApplications: 13,
              pendingAdjustment: 8,
              finalMatches: 43
            })
            break
          case 6: // 秘书确认
            newStages[nextStage].percentage = 100
            break
          case 7: // 发布结果
            newStages[nextStage].percentage = 100
            newStages[nextStage].status = 'completed'
            setIsRunning(false)
            break
        }
        
        setStages(newStages)
        setCurrentStage(nextStage)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [isRunning, currentStage, stages, matchingData])

  const handleStartMatching = () => {
    setIsRunning(true)
    setCurrentStage(0)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCurrentStage(0)
    setMatchingData({
      studentSubmissions: 48,
      acceptedMatches: 0,
      rejectedApplications: 0,
      pendingAdjustment: 0,
      finalMatches: 0
    })
    setStages(stages.map((stage, index) => ({
      ...stage,
      status: index === 0 ? 'completed' : 'pending',
      percentage: index === 0 ? 100 : 0,
      count: index === 0 ? 48 : 0
    })))
  }

  const getStageIcon = (stage: MatchingStage) => {
    switch (stage.id) {
      case 'submission':
        return <Users className="w-5 h-5" />
      case 'aggregation':
        return <RefreshCw className="w-5 h-5" />
      case 'review':
      case 'decision':
        return <UserCheck className="w-5 h-5" />
      case 'matching':
        return <Shuffle className="w-5 h-5" />
      case 'adjustment':
        return <UserX className="w-5 h-5" />
      case 'confirmation':
      case 'publish':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white'
      case 'in-progress':
        return 'bg-blue-500 text-white animate-pulse'
      case 'pending':
        return 'bg-gray-200 text-gray-600'
      default:
        return 'bg-gray-200 text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">双选匹配算法可视化</h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStartMatching}
                disabled={isRunning}
              >
                <Play className="w-4 h-4 mr-1" />
                {isRunning ? '运行中...' : '开始匹配'}
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                重置
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 匹配流程 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>匹配流程</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stages.map((stage, index) => (
                      <div key={stage.id} className="relative">
                        {index < stages.length - 1 && (
                          <div
                            className={`absolute left-6 top-12 w-0.5 h-16 ${
                              stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          />
                        )}
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${getStageColor(
                              stage.status
                            )}`}
                          >
                            {getStageIcon(stage)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                            {stage.status !== 'pending' && stage.percentage !== undefined && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {stage.count !== undefined && `${stage.count} 项`}
                                  </span>
                                  <span className="text-gray-600">{stage.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                      stage.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${stage.percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 实时统计 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>实时统计</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">学生提交志愿</span>
                      <span className="font-semibold">{matchingData.studentSubmissions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">接受匹配</span>
                      <span className="font-semibold text-green-600">
                        {matchingData.acceptedMatches}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">拒绝申请</span>
                      <span className="font-semibold text-red-600">
                        {matchingData.rejectedApplications}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">待调剂</span>
                      <span className="font-semibold text-yellow-600">
                        {matchingData.pendingAdjustment}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900 font-semibold">最终匹配</span>
                        <span className="font-bold text-lg">{matchingData.finalMatches}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>匹配成功率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {matchingData.studentSubmissions > 0
                        ? Math.round((matchingData.finalMatches / matchingData.studentSubmissions) * 100)
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-gray-600">
                      {matchingData.finalMatches} / {matchingData.studentSubmissions} 学生成功匹配
                    </p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-sm">直接匹配成功</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span className="text-sm">调剂后匹配</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-sm">未能匹配</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {currentStage === stages.length - 1 && !isRunning && (
                <Card>
                  <CardHeader>
                    <CardTitle>操作选项</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button className="w-full" onClick={() => navigate('/matching-results')}>
                        查看详细结果
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => navigate('/adjustment-management')}
                      >
                        管理调剂流程
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}