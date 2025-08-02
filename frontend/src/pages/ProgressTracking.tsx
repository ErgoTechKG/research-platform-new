import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Calendar, Clock, FileText, MessageCircle, Upload, Play, CheckCircle, ChevronRight, Plus, CalendarDays } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'pending' | 'in-progress' | 'completed'
  deadline?: string
  progress?: number
  score?: number
  subtasks?: Subtask[]
  timeSpent?: number
  estimatedTime?: number
}

interface Subtask {
  id: string
  title: string
  completed: boolean
}

export default function ProgressTracking() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showCalendarView, setShowCalendarView] = useState(false)
  const [newNote, setNewNote] = useState('')
  
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: '文献调研',
      status: 'pending',
      deadline: '9/1',
    },
    {
      id: '2',
      title: '实验设计',
      status: 'in-progress',
      progress: 40,
      timeSpent: 12,
      estimatedTime: 30,
      subtasks: [
        { id: '1', title: '确定实验目标', completed: true },
        { id: '2', title: '选择实验方法', completed: true },
        { id: '3', title: '设计实验流程', completed: false },
        { id: '4', title: '准备实验材料', completed: false }
      ]
    },
    {
      id: '3',
      title: '开题报告',
      status: 'completed',
      score: 85
    },
    {
      id: '4',
      title: '数据分析',
      status: 'pending',
      deadline: '9/5',
    },
    {
      id: '5',
      title: '周报撰写',
      status: 'in-progress',
      progress: 70,
      timeSpent: 5,
      estimatedTime: 7
    }
  ])

  // 计算本周总进度
  const calculateWeeklyProgress = () => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'completed').length
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
    
    let progressSum = completedTasks * 100
    inProgressTasks.forEach(task => {
      progressSum += (task.progress || 0)
    })
    
    return Math.round(progressSum / totalTasks)
  }

  // 渲染任务卡片
  const renderTaskCard = (task: Task) => {
    const getStatusColor = () => {
      switch (task.status) {
        case 'pending': return 'bg-gray-100'
        case 'in-progress': return 'bg-blue-50'
        case 'completed': return 'bg-green-50'
      }
    }

    const getActionButton = () => {
      switch (task.status) {
        case 'pending':
          return (
            <Button size="sm" className="w-full">
              <Play className="w-4 h-4 mr-1" />
              开始
            </Button>
          )
        case 'in-progress':
          return (
            <Button size="sm" variant="outline" className="w-full">
              <ChevronRight className="w-4 h-4 mr-1" />
              继续
            </Button>
          )
        case 'completed':
          return (
            <div className="text-center">
              <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <span className="text-lg font-semibold text-green-600">{task.score}分</span>
            </div>
          )
      }
    }

    return (
      <Card
        key={task.id}
        className={`${getStatusColor()} cursor-pointer transition-all hover:shadow-md`}
        onClick={() => setSelectedTask(task)}
      >
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
          {task.deadline && (
            <p className="text-sm text-gray-600 mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />
              截止: {task.deadline}
            </p>
          )}
          {task.progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>进度</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
          {task.score !== undefined && (
            <p className="text-sm text-gray-600 mb-2">已评分</p>
          )}
          <div className="mt-3">
            {getActionButton()}
          </div>
        </CardContent>
      </Card>
    )
  }

  // 渲染任务详情
  const renderTaskDetail = () => {
    if (!selectedTask || selectedTask.status !== 'in-progress') return null

    const completedSubtasks = selectedTask.subtasks?.filter(st => st.completed).length || 0
    const totalSubtasks = selectedTask.subtasks?.length || 0
    const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">本周重点任务：{selectedTask.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 进度追踪 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">进度追踪</span>
              <span className="text-sm text-gray-600">{selectedTask.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all flex items-center justify-end pr-2"
                style={{ width: `${selectedTask.progress || 0}%` }}
              >
                {(selectedTask.progress || 0) > 20 && (
                  <span className="text-[10px] text-white font-medium">
                    {selectedTask.progress}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>
                <Clock className="w-3 h-3 inline mr-1" />
                已用时间: {selectedTask.timeSpent || 0}小时
              </span>
              <span>预计剩余: {(selectedTask.estimatedTime || 0) - (selectedTask.timeSpent || 0)}小时</span>
            </div>
          </div>

          {/* 子任务清单 */}
          {selectedTask.subtasks && (
            <div className="mb-6">
              <h4 className="font-medium mb-3">子任务清单:</h4>
              <div className="space-y-2">
                {selectedTask.subtasks.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={(checked) => {
                        // 更新子任务状态
                        console.log('Toggle subtask:', subtask.id, checked)
                      }}
                    />
                    <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-sm text-gray-600">
                完成度: {completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setNewNote(newNote ? '' : '开始添加笔记...')}
            >
              <FileText className="w-4 h-4 mr-1" />
              添加笔记
            </Button>
            <Button size="sm" variant="outline">
              <Upload className="w-4 h-4 mr-1" />
              上传文件
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircle className="w-4 h-4 mr-1" />
              请求指导
            </Button>
          </div>

          {/* 笔记输入区 */}
          {newNote !== '' && (
            <div className="mt-4 space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="在这里添加你的笔记..."
                rows={4}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => {
                  console.log('Save note:', newNote)
                  setNewNote('')
                }}>
                  保存笔记
                </Button>
                <Button size="sm" variant="outline" onClick={() => setNewNote('')}>
                  取消
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const weeklyProgress = calculateWeeklyProgress()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">我的任务看板</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">本周进度:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${weeklyProgress}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{weeklyProgress}%</span>
                </div>
              </div>
              <Button
                size="sm"
                variant={showCalendarView ? "default" : "outline"}
                onClick={() => setShowCalendarView(!showCalendarView)}
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                日历视图
              </Button>
            </div>
          </div>

          {/* 看板区域 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 待开始 */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                待开始
                <span className="ml-2 text-sm text-gray-500">
                  ({tasks.filter(t => t.status === 'pending').length})
                </span>
              </h3>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'pending').map(renderTaskCard)}
              </div>
            </div>

            {/* 进行中 */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                进行中
                <span className="ml-2 text-sm text-gray-500">
                  ({tasks.filter(t => t.status === 'in-progress').length})
                </span>
              </h3>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'in-progress').map(renderTaskCard)}
              </div>
            </div>

            {/* 已完成 */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                已完成
                <span className="ml-2 text-sm text-gray-500">
                  ({tasks.filter(t => t.status === 'completed').length})
                </span>
              </h3>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'completed').map(renderTaskCard)}
              </div>
            </div>
          </div>

          {/* 任务详情 */}
          {renderTaskDetail()}

          {/* 日历视图（简化版） */}
          {showCalendarView && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>任务日历</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>日历视图开发中...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}