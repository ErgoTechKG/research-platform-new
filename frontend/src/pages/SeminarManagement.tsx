import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Plus, Upload, CheckCircle, AlertCircle, Users, MapPin, Clock, Video } from 'lucide-react'

interface Professor {
  id: string
  name: string
  lab: string
  selected: boolean
  pptStatus: 'uploaded' | 'uploading' | 'not-uploaded'
}

interface Seminar {
  id: string
  title: string
  date: string
  time: string
  location: string
  onlineEnabled: boolean
  totalSeats: number
  bookedSeats: number
  professors: Professor[]
}

export default function SeminarManagement() {
  const navigate = useNavigate()
  const [seminars, setSeminars] = useState<Seminar[]>([
    {
      id: '1',
      title: '2025年实验室轮转介绍会',
      date: '2025-08-20',
      time: '14:00-16:00',
      location: '教学楼A101',
      onlineEnabled: true,
      totalSeats: 30,
      bookedSeats: 25,
      professors: [
        { id: '1', name: '张教授', lab: 'AI实验室', selected: true, pptStatus: 'uploaded' },
        { id: '2', name: '李教授', lab: '生物实验室', selected: true, pptStatus: 'uploading' },
        { id: '3', name: '王教授', lab: '材料实验室', selected: false, pptStatus: 'not-uploaded' }
      ]
    }
  ])

  const [showNewSeminarForm, setShowNewSeminarForm] = useState(false)
  const [newSeminarData, setNewSeminarData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    onlineEnabled: false,
    totalSeats: 50
  })

  const handleProfessorToggle = (seminarId: string, professorId: string) => {
    setSeminars(prev => prev.map(seminar => {
      if (seminar.id === seminarId) {
        return {
          ...seminar,
          professors: seminar.professors.map(prof => 
            prof.id === professorId ? { ...prof, selected: !prof.selected } : prof
          )
        }
      }
      return seminar
    }))
  }

  const handlePPTUpload = (seminarId: string, professorId: string) => {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.ppt,.pptx,.pdf'
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // 模拟上传过程
        setSeminars(prev => prev.map(seminar => {
          if (seminar.id === seminarId) {
            return {
              ...seminar,
              professors: seminar.professors.map(prof => 
                prof.id === professorId ? { ...prof, pptStatus: 'uploading' } : prof
              )
            }
          }
          return seminar
        }))

        // 模拟上传完成
        setTimeout(() => {
          setSeminars(prev => prev.map(seminar => {
            if (seminar.id === seminarId) {
              return {
                ...seminar,
                professors: seminar.professors.map(prof => 
                  prof.id === professorId ? { ...prof, pptStatus: 'uploaded' } : prof
                )
              }
            }
            return seminar
          }))
        }, 2000)
      }
    }
    fileInput.click()
  }

  const handleCreateSeminar = () => {
    if (!newSeminarData.title || !newSeminarData.date || !newSeminarData.time || !newSeminarData.location) {
      alert('请填写所有必填字段')
      return
    }

    const newSeminar: Seminar = {
      id: Date.now().toString(),
      ...newSeminarData,
      bookedSeats: 0,
      professors: [
        { id: '1', name: '张教授', lab: 'AI实验室', selected: false, pptStatus: 'not-uploaded' },
        { id: '2', name: '李教授', lab: '生物实验室', selected: false, pptStatus: 'not-uploaded' },
        { id: '3', name: '王教授', lab: '材料实验室', selected: false, pptStatus: 'not-uploaded' },
        { id: '4', name: '陈教授', lab: '量子计算实验室', selected: false, pptStatus: 'not-uploaded' },
        { id: '5', name: '刘教授', lab: '数据科学实验室', selected: false, pptStatus: 'not-uploaded' }
      ]
    }

    setSeminars(prev => [...prev, newSeminar])
    setShowNewSeminarForm(false)
    setNewSeminarData({
      title: '',
      date: '',
      time: '',
      location: '',
      onlineEnabled: false,
      totalSeats: 50
    })
  }

  const getPPTStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'uploading':
        return <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-500" />
    }
  }

  const getPPTStatusText = (status: string) => {
    switch (status) {
      case 'uploaded':
        return '已上传'
      case 'uploading':
        return '上传中'
      default:
        return '未上传'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Intro Session 管理</h1>
            <Button onClick={() => setShowNewSeminarForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新建宣讲会
            </Button>
          </div>

          {/* 新建宣讲会表单 */}
          {showNewSeminarForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>新建宣讲会</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">宣讲会标题</Label>
                  <Input
                    id="title"
                    value={newSeminarData.title}
                    onChange={(e) => setNewSeminarData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="请输入宣讲会标题"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">日期</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newSeminarData.date}
                      onChange={(e) => setNewSeminarData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">时间</Label>
                    <Input
                      id="time"
                      value={newSeminarData.time}
                      onChange={(e) => setNewSeminarData(prev => ({ ...prev, time: e.target.value }))}
                      placeholder="例如: 14:00-16:00"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">地点</Label>
                  <Input
                    id="location"
                    value={newSeminarData.location}
                    onChange={(e) => setNewSeminarData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="请输入宣讲会地点"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalSeats">总座位数</Label>
                    <Input
                      id="totalSeats"
                      type="number"
                      value={newSeminarData.totalSeats}
                      onChange={(e) => setNewSeminarData(prev => ({ ...prev, totalSeats: parseInt(e.target.value) || 50 }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id="onlineEnabled"
                      checked={newSeminarData.onlineEnabled}
                      onCheckedChange={(checked) => 
                        setNewSeminarData(prev => ({ ...prev, onlineEnabled: checked as boolean }))
                      }
                    />
                    <label htmlFor="onlineEnabled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      启用线上直播
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateSeminar}>创建</Button>
                  <Button variant="outline" onClick={() => setShowNewSeminarForm(false)}>取消</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 宣讲会列表 */}
          {seminars.map((seminar) => (
            <Card key={seminar.id} className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{seminar.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{seminar.date} {seminar.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{seminar.location}</span>
                      {seminar.onlineEnabled && (
                        <>
                          <span>+</span>
                          <Video className="w-4 h-4" />
                          <span>线上直播</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">参与教授指定</h3>
                  <div className="space-y-3">
                    {seminar.professors.map((professor) => (
                      <div key={professor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`prof-${professor.id}`}
                            checked={professor.selected}
                            onCheckedChange={() => handleProfessorToggle(seminar.id, professor.id)}
                          />
                          <label
                            htmlFor={`prof-${professor.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {professor.name} - {professor.lab}
                          </label>
                        </div>
                        {professor.selected && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">PPT:</span>
                            <div className="flex items-center gap-1">
                              {getPPTStatusIcon(professor.pptStatus)}
                              <span className="text-sm">{getPPTStatusText(professor.pptStatus)}</span>
                            </div>
                            {professor.pptStatus !== 'uploaded' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePPTUpload(seminar.id, professor.id)}
                                disabled={professor.pptStatus === 'uploading'}
                              >
                                <Upload className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold">学生预约查看</span>
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {seminar.bookedSeats}/{seminar.totalSeats}人已预约
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(seminar.bookedSeats / seminar.totalSeats) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm">查看预约名单</Button>
                  <Button variant="outline" size="sm">导出签到表</Button>
                  <Button variant="outline" size="sm">编辑宣讲会</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {seminars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无宣讲会，点击"新建宣讲会"创建第一个宣讲会</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}