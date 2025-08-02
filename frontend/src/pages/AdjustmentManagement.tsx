import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  UserX, 
  UserPlus, 
  ArrowRightLeft, 
  AlertCircle, 
  CheckCircle,
  Search,
  Info,
  History
} from 'lucide-react'

interface UnmatchedStudent {
  id: string
  name: string
  gpa: number
  originalPreferences: string[]
  rejectionReasons: string[]
  status: 'pending' | 'reassigned' | 'manual'
}

interface AvailableSlot {
  id: string
  mentorName: string
  lab: string
  remainingQuota: number
  specializations: string[]
}

interface AdjustmentRecord {
  id: string
  timestamp: string
  studentName: string
  fromStatus: string
  toMentor: string
  type: 'auto' | 'manual'
  reason: string
}

export default function AdjustmentManagement() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<string>('')
  
  const [unmatchedStudents, setUnmatchedStudents] = useState<UnmatchedStudent[]>([
    {
      id: '1',
      name: '王小明',
      gpa: 3.5,
      originalPreferences: ['张教授', '李教授', '赵教授'],
      rejectionReasons: ['名额已满', '方向不匹配', '名额已满'],
      status: 'pending'
    },
    {
      id: '2',
      name: '李小红',
      gpa: 3.3,
      originalPreferences: ['陈教授', '王教授', '刘教授'],
      rejectionReasons: ['GPA不符合要求', '名额已满', '方向不匹配'],
      status: 'pending'
    },
    {
      id: '3',
      name: '张三',
      gpa: 3.2,
      originalPreferences: ['赵教授', '钱教授', '孙教授'],
      rejectionReasons: ['名额已满', '名额已满', '未提交申请'],
      status: 'reassigned'
    },
    {
      id: '4',
      name: '李四',
      gpa: 3.4,
      originalPreferences: ['周教授', '吴教授', '郑教授'],
      rejectionReasons: ['方向不匹配', '名额已满', 'GPA不符合要求'],
      status: 'pending'
    },
    {
      id: '5',
      name: '王五',
      gpa: 3.1,
      originalPreferences: ['冯教授', '陈教授', '褚教授'],
      rejectionReasons: ['名额已满', '名额已满', '方向不匹配'],
      status: 'manual'
    }
  ])

  const [availableSlots] = useState<AvailableSlot[]>([
    {
      id: '1',
      mentorName: '钱教授',
      lab: '数据科学实验室',
      remainingQuota: 2,
      specializations: ['机器学习', '数据挖掘']
    },
    {
      id: '2',
      mentorName: '孙教授',
      lab: '系统工程实验室',
      remainingQuota: 1,
      specializations: ['控制系统', '优化算法']
    },
    {
      id: '3',
      mentorName: '周教授',
      lab: '网络安全实验室',
      remainingQuota: 1,
      specializations: ['网络安全', '密码学']
    },
    {
      id: '4',
      mentorName: '吴教授',
      lab: '软件工程实验室',
      remainingQuota: 3,
      specializations: ['软件架构', '云计算']
    }
  ])

  const [adjustmentRecords, setAdjustmentRecords] = useState<AdjustmentRecord[]>([
    {
      id: '1',
      timestamp: '2024-03-10 14:30',
      studentName: '张三',
      fromStatus: '未匹配',
      toMentor: '钱教授',
      type: 'auto',
      reason: '二次分配算法匹配'
    },
    {
      id: '2',
      timestamp: '2024-03-10 15:15',
      studentName: '王五',
      fromStatus: '未匹配',
      toMentor: '孙教授',
      type: 'manual',
      reason: '秘书手动调整'
    }
  ])

  // 统计数据
  const pendingCount = unmatchedStudents.filter(s => s.status === 'pending').length
  const reassignedCount = unmatchedStudents.filter(s => s.status === 'reassigned').length
  const manualCount = unmatchedStudents.filter(s => s.status === 'manual').length
  const totalSlots = availableSlots.reduce((sum, slot) => sum + slot.remainingQuota, 0)

  // 过滤学生
  const filteredStudents = unmatchedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.status.includes(searchTerm.toLowerCase())
  )

  // 执行二次分配算法
  const handleAutoAssignment = () => {
    const pendingStudents = unmatchedStudents.filter(s => s.status === 'pending')
    const availableSlotsClone = [...availableSlots]
    const newRecords: AdjustmentRecord[] = []
    
    pendingStudents.forEach(student => {
      // 简单的匹配算法：按GPA和剩余名额分配
      const suitableSlot = availableSlotsClone
        .filter(slot => slot.remainingQuota > 0)
        .sort((a, b) => b.remainingQuota - a.remainingQuota)[0]
      
      if (suitableSlot) {
        suitableSlot.remainingQuota--
        
        setUnmatchedStudents(prev => 
          prev.map(s => 
            s.id === student.id 
              ? { ...s, status: 'reassigned' as const }
              : s
          )
        )
        
        newRecords.push({
          id: `${Date.now()}-${student.id}`,
          timestamp: new Date().toLocaleString('zh-CN'),
          studentName: student.name,
          fromStatus: '未匹配',
          toMentor: suitableSlot.mentorName,
          type: 'auto',
          reason: '二次分配算法匹配'
        })
      }
    })
    
    setAdjustmentRecords(prev => [...prev, ...newRecords])
    alert(`自动分配完成，成功分配 ${newRecords.length} 名学生`)
  }

  // 手动调整
  const handleManualAssignment = () => {
    if (!selectedStudent || !selectedMentor) {
      alert('请选择学生和导师')
      return
    }
    
    const student = unmatchedStudents.find(s => s.id === selectedStudent)
    const mentor = availableSlots.find(s => s.id === selectedMentor)
    
    if (!student || !mentor) return
    
    if (mentor.remainingQuota <= 0) {
      alert('该导师名额已满')
      return
    }
    
    setUnmatchedStudents(prev =>
      prev.map(s =>
        s.id === selectedStudent
          ? { ...s, status: 'manual' as const }
          : s
      )
    )
    
    setAdjustmentRecords(prev => [...prev, {
      id: `${Date.now()}`,
      timestamp: new Date().toLocaleString('zh-CN'),
      studentName: student.name,
      fromStatus: '未匹配',
      toMentor: mentor.mentorName,
      type: 'manual',
      reason: '秘书手动调整'
    }])
    
    setSelectedStudent(null)
    setSelectedMentor('')
    alert('手动调整成功')
  }

  // 确认最终结果
  const handleFinalConfirmation = () => {
    const unassigned = unmatchedStudents.filter(s => s.status === 'pending').length
    if (unassigned > 0) {
      if (!window.confirm(`还有 ${unassigned} 名学生未分配，确定要确认最终结果吗？`)) {
        return
      }
    }
    
    console.log('最终调剂结果:', {
      students: unmatchedStudents,
      records: adjustmentRecords
    })
    
    alert('调剂结果已确认，即将发布最终匹配结果')
    navigate('/matching-results')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reassigned':
        return <span className="text-green-600 font-medium">已重新分配</span>
      case 'manual':
        return <span className="text-blue-600 font-medium">手动调整</span>
      default:
        return <span className="text-yellow-600 font-medium">待调剂</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">调剂管理系统</h1>
            <Button onClick={() => navigate('/matching-visualization')}>
              返回匹配流程
            </Button>
          </div>

          {/* 统计概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">待调剂学生</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  </div>
                  <UserX className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">已重新分配</p>
                    <p className="text-2xl font-bold text-green-600">{reassignedCount}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">手动调整</p>
                    <p className="text-2xl font-bold text-blue-600">{manualCount}</p>
                  </div>
                  <ArrowRightLeft className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">剩余名额</p>
                    <p className="text-2xl font-bold text-purple-600">{totalSlots}</p>
                  </div>
                  <UserPlus className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 待调剂学生池 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>待调剂学生池</span>
                    <Button onClick={handleAutoAssignment} size="sm">
                      <UserPlus className="w-4 h-4 mr-1" />
                      执行二次分配
                    </Button>
                  </CardTitle>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="text"
                        placeholder="搜索学生姓名或状态..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        className={`border rounded-lg p-4 ${
                          selectedStudent === student.id ? 'border-blue-500 bg-blue-50' : ''
                        } ${student.status !== 'pending' ? 'opacity-60' : ''} cursor-pointer`}
                        onClick={() => student.status === 'pending' && setSelectedStudent(student.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <p className="text-sm text-gray-600">GPA: {student.gpa}</p>
                            {getStatusBadge(student.status)}
                          </div>
                          {student.status === 'pending' && (
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">原始志愿：</p>
                          <div className="space-y-1">
                            {student.originalPreferences.map((pref, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-center justify-between">
                                <span>{index + 1}. {pref}</span>
                                <span className="text-red-500 text-xs">{student.rejectionReasons[index]}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧操作面板 */}
            <div className="space-y-6">
              {/* 可用名额 */}
              <Card>
                <CardHeader>
                  <CardTitle>可用名额</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`border rounded-lg p-3 ${
                          selectedMentor === slot.id ? 'border-blue-500 bg-blue-50' : ''
                        } ${slot.remainingQuota === 0 ? 'opacity-50' : 'cursor-pointer'}`}
                        onClick={() => slot.remainingQuota > 0 && setSelectedMentor(slot.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{slot.mentorName}</h5>
                            <p className="text-sm text-gray-600">{slot.lab}</p>
                          </div>
                          <span className={`text-lg font-bold ${
                            slot.remainingQuota > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {slot.remainingQuota}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {slot.specializations.map((spec, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 手动调整 */}
              <Card>
                <CardHeader>
                  <CardTitle>手动调整</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        选中学生
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md min-h-[40px]">
                        {selectedStudent ? 
                          unmatchedStudents.find(s => s.id === selectedStudent)?.name :
                          <span className="text-gray-400">请从左侧选择学生</span>
                        }
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        选中导师
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md min-h-[40px]">
                        {selectedMentor ? 
                          availableSlots.find(s => s.id === selectedMentor)?.mentorName :
                          <span className="text-gray-400">请从上方选择导师</span>
                        }
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleManualAssignment}
                      disabled={!selectedStudent || !selectedMentor}
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      执行手动调整
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 最终确认 */}
              <Card>
                <CardHeader>
                  <CardTitle>最终确认</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800">确认前请检查：</p>
                          <ul className="mt-1 text-yellow-700 space-y-1">
                            <li>• 所有待调剂学生已处理</li>
                            <li>• 调剂结果符合规则</li>
                            <li>• 导师名额分配合理</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={handleFinalConfirmation}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      确认调剂结果
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 调剂记录 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                调剂记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">时间</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">学生</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">原状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">分配给</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">类型</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">原因</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adjustmentRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.timestamp}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.studentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.fromStatus}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{record.toMentor}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            record.type === 'auto' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {record.type === 'auto' ? '自动' : '手动'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{record.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}