import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Navigate, useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  Bell, 
  Mail, 
  MessageSquare,
  CheckCircle,
  Clock4,
  AlertCircle,
  Phone,
  Users,
  BookOpen
} from 'lucide-react'

// Mock data for professors
const professors = [
  {
    id: 1,
    name: '张教授',
    department: '计算机科学',
    office: '科研楼A座 305办公室',
    status: 'online',
    lastUpdated: '2分钟前'
  },
  {
    id: 2,
    name: '李教授',
    department: '人工智能',
    office: '实验室B201',
    status: 'busy',
    lastUpdated: '5分钟前'
  },
  {
    id: 3,
    name: '王教授',
    department: '软件工程',
    office: '科研楼C座 201办公室',
    status: 'offline',
    lastUpdated: '30分钟前'
  }
]

// Time slots with availability status
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00'
]

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

// Mock availability data
const mockAvailability = {
  1: { // Zhang Professor
    '周一': ['available', 'available', 'booked', 'booked', 'break', 'break', 'available', 'available', 'busy', 'busy'],
    '周二': ['meeting', 'meeting', 'available', 'available', 'break', 'break', 'meeting', 'meeting', 'available', 'available'],
    '周三': ['available', 'booked', 'booked', 'available', 'break', 'break', 'available', 'available', 'meeting', 'meeting'],
    '周四': ['busy', 'busy', 'available', 'available', 'break', 'break', 'available', 'available', 'booked', 'booked'],
    '周五': ['available', 'available', 'meeting', 'meeting', 'break', 'break', 'available', 'booked', 'booked', 'available'],
    '周六': ['unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable'],
    '周日': ['unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable', 'unavailable']
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-500 hover:bg-green-600'
    case 'busy': return 'bg-orange-500'
    case 'meeting': return 'bg-red-500'
    case 'booked': return 'bg-blue-500'
    case 'break': return 'bg-gray-400'
    case 'unavailable': return 'bg-gray-300'
    default: return 'bg-gray-300'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available': return '🟢'
    case 'busy': return '🟡'
    case 'meeting': return '🔴'
    case 'booked': return '🔵'
    case 'break': return '🔴'
    case 'unavailable': return '🔴'
    default: return '⚫'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'available': return '可用'
    case 'busy': return '忙碌'
    case 'meeting': return '会议中'
    case 'booked': return '已预约'
    case 'break': return '午休'
    case 'unavailable': return '不可用'
    default: return '未知'
  }
}

const ProfessorAvailability = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // State management
  const [selectedProfessor, setSelectedProfessor] = useState(professors[0])
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ day: string, time: string } | null>(null)
  const [bookingData, setBookingData] = useState({
    subject: '',
    description: '',
    duration: '60',
    emailReminder: true,
    smsReminder: true,
    pushNotification: true
  })

  // Redirect to login if not authenticated or not a student
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'student') {
    return <Navigate to="/dashboard" replace />
  }

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      professor: '李教授',
      time: '今天 15:00-16:00',
      location: '实验室B201',
      subject: '论文开题讨论',
      status: 'confirmed'
    },
    {
      id: 2,
      professor: '张教授',
      time: '明天 10:00-11:00',
      location: '科研楼A305',
      subject: '研究进度讨论',
      status: 'pending'
    }
  ]

  const handleTimeSlotClick = (day: string, timeIndex: number) => {
    const time = timeSlots[timeIndex]
    const availability = mockAvailability[selectedProfessor.id]?.[day]?.[timeIndex]
    
    if (availability === 'available') {
      setSelectedTimeSlot({ day, time })
    }
  }

  const handleBookingSubmit = () => {
    if (!selectedTimeSlot || !bookingData.subject) {
      return
    }
    
    // Mock booking logic
    alert(`预约已提交!\n时间: ${selectedTimeSlot.day} ${selectedTimeSlot.time}\n教授: ${selectedProfessor.name}\n主题: ${bookingData.subject}`)
    setSelectedTimeSlot(null)
    setBookingData({
      subject: '',
      description: '',
      duration: '60',
      emailReminder: true,
      smsReminder: true,
      pushNotification: true
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-8 h-8" />
                教授时间安排查看
              </h1>
              <p className="text-gray-600 mt-2">查看教授可用时间并进行预约</p>
            </div>
            <div className="flex gap-4">
              <Select value={selectedProfessor.id.toString()} onValueChange={(value) => {
                const prof = professors.find(p => p.id.toString() === value)
                if (prof) setSelectedProfessor(prof)
              }}>
                <SelectTrigger className="w-48">
                  <User className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="选择教授" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id.toString()}>
                      {prof.name} ({prof.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button 
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  onClick={() => setViewMode('week')}
                >
                  📊 周视图
                </Button>
                <Button 
                  variant={viewMode === 'month' ? 'default' : 'outline'}
                  onClick={() => setViewMode('month')}
                >
                  📅 月视图
                </Button>
              </div>
            </div>
          </div>

          {/* Professor Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">{selectedProfessor.name} ({selectedProfessor.department})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-gray-600">{selectedProfessor.office}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedProfessor.status === 'online' ? 'bg-green-500' : 
                    selectedProfessor.status === 'busy' ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-600">
                    {selectedProfessor.status === 'online' ? '在线' : 
                     selectedProfessor.status === 'busy' ? '忙碌' : '离线'} 
                    (更新于{selectedProfessor.lastUpdated})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card>
            <CardHeader>
              <CardTitle>本周时间安排 (2024年1月15日 - 1月21日)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 bg-gray-50 text-left">时间</th>
                      {weekDays.map((day) => (
                        <th key={day} className="border p-2 bg-gray-50 text-center min-w-[120px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time, timeIndex) => (
                      <tr key={time}>
                        <td className="border p-2 font-medium bg-gray-50">{time}</td>
                        {weekDays.map((day) => {
                          const availability = mockAvailability[selectedProfessor.id]?.[day]?.[timeIndex] || 'unavailable'
                          const isClickable = availability === 'available'
                          
                          return (
                            <td key={day} className="border p-1">
                              <button
                                className={`w-full h-12 rounded text-white text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                                  getStatusColor(availability)
                                } ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={() => handleTimeSlotClick(day, timeIndex)}
                                disabled={!isClickable}
                              >
                                {getStatusIcon(availability)}
                                {getStatusText(availability)}
                              </button>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>可用时间</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>忙碌状态</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>会议中/不可用</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>已预约</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded"></div>
                  <span>午休</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Booking Panel */}
          {selectedTimeSlot && (
            <Card>
              <CardHeader>
                <CardTitle>快速预约</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">选中时间</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedTimeSlot.day} {selectedTimeSlot.time}-{
                        timeSlots[timeSlots.indexOf(selectedTimeSlot.time) + 1] || '18:00'
                      }</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">教授和地点</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4" />
                      <span>{selectedProfessor.name}</span>
                      <span>|</span>
                      <MapPin className="w-4 h-4" />
                      <span>{selectedProfessor.office}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subject">会面主题 (必填)</Label>
                    <Input
                      id="subject"
                      value={bookingData.subject}
                      onChange={(e) => setBookingData({ ...bookingData, subject: e.target.value })}
                      placeholder="研究进度讨论"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">详细说明 (选填)</Label>
                    <Textarea
                      id="description"
                      value={bookingData.description}
                      onChange={(e) => setBookingData({ ...bookingData, description: e.target.value })}
                      placeholder="请描述会面的具体内容..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">预计时长</Label>
                      <Select value={bookingData.duration} onValueChange={(value) => setBookingData({ ...bookingData, duration: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30分钟</SelectItem>
                          <SelectItem value="60">60分钟</SelectItem>
                          <SelectItem value="90">90分钟</SelectItem>
                          <SelectItem value="120">120分钟</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>提醒设置</Label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>邮件提醒: 提前15分钟</span>
                      </div>
                      <Switch
                        checked={bookingData.emailReminder}
                        onCheckedChange={(checked) => setBookingData({ ...bookingData, emailReminder: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>短信提醒: 提前30分钟</span>
                      </div>
                      <Switch
                        checked={bookingData.smsReminder}
                        onCheckedChange={(checked) => setBookingData({ ...bookingData, smsReminder: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <span>推送通知: 提前5分钟</span>
                      </div>
                      <Switch
                        checked={bookingData.pushNotification}
                        onCheckedChange={(checked) => setBookingData({ ...bookingData, pushNotification: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleBookingSubmit}
                      disabled={!bookingData.subject}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      确认预约
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTimeSlot(null)}
                    >
                      取消
                    </Button>
                    <Button variant="outline">
                      💾 保存草稿
                    </Button>
                    <Button variant="outline">
                      📋 模板选择
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* My Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>我的预约记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock4 className="w-5 h-5" />
                    即将到来的预约
                  </h3>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{appointment.professor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.location}</span>
                            </div>
                          </div>
                          <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                            {appointment.status === 'confirmed' ? '✅ 已确认' : '⏳ 待确认'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm">主题: {appointment.subject}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Bell className="w-4 h-4" />
                          <span>{appointment.status === 'confirmed' ? '提醒已设置' : '等待教授回复'}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            📱 发送消息
                          </Button>
                          <Button size="sm" variant="outline">
                            📋 查看详情
                          </Button>
                          <Button size="sm" variant="outline">
                            ⏰ 修改时间
                          </Button>
                          <Button size="sm" variant="outline">
                            ❌ 取消预约
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📊 历史预约: 本月已完成 8次会面</span>
                    <span>平均时长 45分钟</span>
                    <span>满意度 4.9/5.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Professor Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>多教授时间对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label>对比教授:</Label>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {professors.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="2">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {professors.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {professors.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id.toString()}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    + 添加
                  </Button>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    共同可用时间
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>周二 14:00-15:00 (3位教授都有空)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>周四 11:00-12:00 (3位教授都有空)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>周五 09:00-10:00 (张教授、王教授有空)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">
                    📅 群体会议预约
                  </Button>
                  <Button variant="outline">
                    📊 查看详细对比
                  </Button>
                  <Button variant="outline">
                    💾 保存对比方案
                  </Button>
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

export default ProfessorAvailability