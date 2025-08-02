import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, Upload, Download, Filter, Edit, Eye, Check, X } from 'lucide-react'

interface Mentor {
  id: string
  name: string
  photo: string
  lab: string
  researchAreas: string[]
  studentCapacity: string
  confirmed: boolean
}

export default function MentorManagement() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: '1',
      name: '张教授',
      photo: '/placeholder-avatar.jpg',
      lab: '人工智能实验室',
      researchAreas: ['深度学习', '计算机视觉'],
      studentCapacity: '3-5人',
      confirmed: true
    },
    {
      id: '2',
      name: '李教授',
      photo: '/placeholder-avatar.jpg',
      lab: '生物信息学实验室',
      researchAreas: ['基因组学', '蛋白质组学'],
      studentCapacity: '2-4人',
      confirmed: false
    },
    {
      id: '3',
      name: '王教授',
      photo: '/placeholder-avatar.jpg',
      lab: '机器人实验室',
      researchAreas: ['机器人控制', '人机交互'],
      studentCapacity: '4-6人',
      confirmed: true
    },
    {
      id: '4',
      name: '陈教授',
      photo: '/placeholder-avatar.jpg',
      lab: '量子计算实验室',
      researchAreas: ['量子算法', '量子纠错'],
      studentCapacity: '2-3人',
      confirmed: false
    },
    {
      id: '5',
      name: '刘教授',
      photo: '/placeholder-avatar.jpg',
      lab: '数据科学实验室',
      researchAreas: ['大数据分析', '机器学习'],
      studentCapacity: '5-7人',
      confirmed: true
    }
  ])

  // 计算统计数据
  const totalMentors = mentors.length
  const totalCapacity = mentors.reduce((sum, mentor) => {
    const [min, max] = mentor.studentCapacity.match(/\d+/g)?.map(Number) || [0, 0]
    return sum + max
  }, 0)
  const assignedStudents = 0 // 这里应该从实际数据中计算

  // 过滤导师列表
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.researchAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'confirmed' && mentor.confirmed) ||
                         (filterStatus === 'pending' && !mentor.confirmed)
    
    return matchesSearch && matchesFilter
  })

  const handleBatchImport = () => {
    // 创建一个隐藏的文件输入元素
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv,.xlsx'
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        console.log('导入文件:', file.name)
        alert(`正在导入文件: ${file.name}`)
      }
    }
    fileInput.click()
  }

  const handleExport = () => {
    console.log('导出导师名单')
    alert('导师名单已导出')
  }

  const handleViewDetails = (mentor: Mentor) => {
    console.log('查看导师详情:', mentor)
    alert(`查看 ${mentor.name} 的详细信息`)
  }

  const handleEdit = (mentor: Mentor) => {
    console.log('编辑导师信息:', mentor)
    alert(`编辑 ${mentor.name} 的信息`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 标题和操作栏 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">导师资源管理</h1>
            <div className="flex gap-2">
              <Button onClick={handleBatchImport} variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                批量导入
              </Button>
              <Button onClick={handleExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                导出名单
              </Button>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="confirmed">已确认</SelectItem>
                  <SelectItem value="pending">待确认</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalMentors}</div>
                <div className="text-sm text-gray-600">总导师数</div>
              </div>
              <div className="border-l border-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalCapacity}</div>
                <div className="text-sm text-gray-600">可接收学生</div>
              </div>
              <div className="border-l border-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-green-600">{assignedStudents}</div>
                <div className="text-sm text-gray-600">已分配</div>
              </div>
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="搜索导师姓名、实验室或研究方向..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 导师卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-500">👤</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-center">{mentor.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{mentor.lab}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">研究方向:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {mentor.researchAreas.map((area, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">可带学生:</span>
                    <span className="font-medium">{mentor.studentCapacity}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">状态:</span>
                    <span className={`flex items-center ${mentor.confirmed ? 'text-green-600' : 'text-orange-600'}`}>
                      {mentor.confirmed ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          已确认
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          待确认
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(mentor)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      查看详情
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(mentor)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      编辑
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 空状态 */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">没有找到符合条件的导师</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}