import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Eye, Check, X, Clock, Download } from 'lucide-react'

interface StudentApplication {
  id: string
  name: string
  preferenceOrder: number
  gpa: number
  applicationReason: string
  status: 'pending' | 'accepted' | 'rejected' | 'hold'
  selected: boolean
}

export default function MentorScreening() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [selectAll, setSelectAll] = useState(false)
  const [applications, setApplications] = useState<StudentApplication[]>([
    {
      id: '1',
      name: '王小明',
      preferenceOrder: 1,
      gpa: 3.8,
      applicationReason: '对深度学习很感兴趣，希望加入您的AI实验室进行研究学习。',
      status: 'pending',
      selected: false
    },
    {
      id: '2',
      name: '李小红',
      preferenceOrder: 2,
      gpa: 3.6,
      applicationReason: '希望学习计算机视觉技术，对您的研究方向非常感兴趣。',
      status: 'pending',
      selected: false
    },
    {
      id: '3',
      name: '张三',
      preferenceOrder: 1,
      gpa: 3.9,
      applicationReason: '在本科阶段就对人工智能产生浓厚兴趣，发表过相关论文。',
      status: 'accepted',
      selected: false
    },
    {
      id: '4',
      name: '李四',
      preferenceOrder: 1,
      gpa: 3.7,
      applicationReason: '参加过多个AI项目，具有丰富的实践经验。',
      status: 'hold',
      selected: false
    },
    {
      id: '5',
      name: '王五',
      preferenceOrder: 3,
      gpa: 3.5,
      applicationReason: '对机器学习算法有深入研究，希望进一步提升。',
      status: 'rejected',
      selected: false
    }
  ])

  // 统计数据
  const totalApplications = applications.length
  const processedApplications = applications.filter(app => app.status !== 'pending').length
  const holdApplications = applications.filter(app => app.status === 'hold').length
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length
  const quotaUsed = acceptedApplications
  const totalQuota = 5

  // 根据筛选条件过滤申请
  const filteredApplications = applications.filter(app => {
    switch (filter) {
      case 'firstChoice':
        return app.preferenceOrder === 1
      case 'pending':
        return app.status === 'pending'
      case 'accepted':
        return app.status === 'accepted'
      case 'rejected':
        return app.status === 'rejected'
      default:
        return true
    }
  })

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setApplications(applications.map(app => ({
      ...app,
      selected: checked && filteredApplications.some(f => f.id === app.id)
    })))
  }

  const handleSelectApplication = (id: string, checked: boolean) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, selected: checked } : app
    ))
  }

  const handleStatusChange = (id: string, status: StudentApplication['status']) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, status } : app
    ))
  }

  const handleBatchOperation = (operation: string) => {
    const selectedApps = applications.filter(app => app.selected)
    if (selectedApps.length === 0) {
      alert('请先选择要操作的申请')
      return
    }

    switch (operation) {
      case 'accept':
        if (quotaUsed + selectedApps.filter(app => app.status !== 'accepted').length > totalQuota) {
          alert('超出名额限制')
          return
        }
        setApplications(applications.map(app =>
          app.selected ? { ...app, status: 'accepted', selected: false } : app
        ))
        break
      case 'reject':
        setApplications(applications.map(app =>
          app.selected ? { ...app, status: 'rejected', selected: false } : app
        ))
        break
      case 'hold':
        setApplications(applications.map(app =>
          app.selected ? { ...app, status: 'hold', selected: false } : app
        ))
        break
    }
    setSelectAll(false)
  }

  const handleConfirmSelection = () => {
    const acceptedStudents = applications.filter(app => app.status === 'accepted')
    console.log('确认选择的学生:', acceptedStudents)
    alert(`已确认选择 ${acceptedStudents.length} 名学生`)
  }

  const handleExportList = () => {
    const acceptedStudents = applications.filter(app => app.status === 'accepted')
    const csvContent = `姓名,志愿顺序,GPA,申请理由\n` +
      acceptedStudents.map(app => 
        `${app.name},第${app.preferenceOrder}志愿,${app.gpa},"${app.applicationReason}"`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', '录取名单.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: StudentApplication['status']) => {
    switch (status) {
      case 'accepted':
        return <span className="text-green-600 font-medium">已接受</span>
      case 'rejected':
        return <span className="text-red-600 font-medium">已拒绝</span>
      case 'hold':
        return <span className="text-yellow-600 font-medium">待定</span>
      default:
        return <span className="text-gray-600 font-medium">待处理</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>学生申请管理</span>
                <div className="text-sm font-normal text-gray-600">
                  收到申请: {totalApplications} | 已处理: {processedApplications} | 待定: {holdApplications}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 筛选标签 */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  全部
                </Button>
                <Button
                  variant={filter === 'firstChoice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('firstChoice')}
                >
                  第一志愿
                </Button>
                <Button
                  variant={filter === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('pending')}
                >
                  待处理
                </Button>
                <Button
                  variant={filter === 'accepted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('accepted')}
                >
                  已接受
                </Button>
                <Button
                  variant={filter === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('rejected')}
                >
                  已拒绝
                </Button>
              </div>

              {/* 批量操作 */}
              <div className="flex items-center gap-4 mb-4">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <Select onValueChange={handleBatchOperation}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="批量操作" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accept">批量接受</SelectItem>
                    <SelectItem value="reject">批量拒绝</SelectItem>
                    <SelectItem value="hold">批量待定</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 申请列表 */}
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application.id}
                    className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={application.selected}
                        onCheckedChange={(checked) => 
                          handleSelectApplication(application.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{application.name}</span>
                            <span className="text-sm text-gray-600">
                              第{application.preferenceOrder}志愿
                            </span>
                            <span className="text-sm text-gray-600">
                              GPA: {application.gpa}
                            </span>
                            {getStatusBadge(application.status)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          申请理由: {application.applicationReason}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/student-detail/${application.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            查看详情
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            disabled={application.status === 'accepted'}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            接受
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600 hover:text-yellow-700"
                            onClick={() => handleStatusChange(application.id, 'hold')}
                            disabled={application.status === 'hold'}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            待定
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            disabled={application.status === 'rejected'}
                          >
                            <X className="w-4 h-4 mr-1" />
                            拒绝
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 底部操作栏 */}
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <div className="text-sm text-gray-600">
                  名额使用: {quotaUsed}/{totalQuota}
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleConfirmSelection}>
                    确认选择
                  </Button>
                  <Button variant="outline" onClick={handleExportList}>
                    <Download className="w-4 h-4 mr-1" />
                    导出名单
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