import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, Filter, Plus, GripVertical } from 'lucide-react'

interface Mentor {
  id: string
  name: string
  lab: string
  matchScore: number
  researchAreas: string[]
}

interface Preference {
  order: number
  mentor: Mentor | null
}

export default function StudentPreference() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [applicationReason, setApplicationReason] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  const [availableMentors] = useState<Mentor[]>([
    { id: '1', name: '张教授', lab: 'AI实验室', matchScore: 92, researchAreas: ['深度学习', '计算机视觉'] },
    { id: '2', name: '李教授', lab: '生物实验室', matchScore: 85, researchAreas: ['基因组学', '蛋白质组学'] },
    { id: '3', name: '王教授', lab: '材料实验室', matchScore: 78, researchAreas: ['新材料', '纳米技术'] },
    { id: '4', name: '陈教授', lab: '化学实验室', matchScore: 78, researchAreas: ['有机化学', '催化反应'] },
    { id: '5', name: '刘教授', lab: '物理实验室', matchScore: 72, researchAreas: ['量子物理', '凝聚态物理'] },
    { id: '6', name: '赵教授', lab: '机器人实验室', matchScore: 88, researchAreas: ['机器人控制', '人工智能'] }
  ])

  const [preferences, setPreferences] = useState<Preference[]>([
    { order: 1, mentor: null },
    { order: 2, mentor: null },
    { order: 3, mentor: null }
  ])

  const [draggedMentor, setDraggedMentor] = useState<Mentor | null>(null)
  const [draggedFromPreference, setDraggedFromPreference] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // 过滤导师列表
  const filteredMentors = availableMentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.researchAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // 检查是否已经被选择
    const isSelected = preferences.some(pref => pref.mentor?.id === mentor.id)
    
    return matchesSearch && !isSelected
  })

  // 自动保存
  useEffect(() => {
    const timer = setTimeout(() => {
      if (preferences.some(p => p.mentor !== null) || applicationReason) {
        setIsSaving(true)
        // 模拟保存
        setTimeout(() => {
          setIsSaving(false)
          console.log('自动保存完成', { preferences, applicationReason })
        }, 1000)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [preferences, applicationReason])

  const handleDragStart = (e: React.DragEvent, mentor: Mentor, fromPreference?: number) => {
    setDraggedMentor(mentor)
    if (fromPreference !== undefined) {
      setDraggedFromPreference(fromPreference)
    }
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (!draggedMentor) return

    const newPreferences = [...preferences]

    // 如果是从志愿列表拖动
    if (draggedFromPreference !== null) {
      // 交换位置
      const targetMentor = newPreferences[targetIndex].mentor
      newPreferences[targetIndex].mentor = draggedMentor
      newPreferences[draggedFromPreference].mentor = targetMentor
    } else {
      // 从可选列表添加
      newPreferences[targetIndex].mentor = draggedMentor
    }

    setPreferences(newPreferences)
    setDraggedMentor(null)
    setDraggedFromPreference(null)
  }

  const handleAddMentor = (mentor: Mentor) => {
    const firstEmpty = preferences.findIndex(p => p.mentor === null)
    if (firstEmpty !== -1) {
      const newPreferences = [...preferences]
      newPreferences[firstEmpty].mentor = mentor
      setPreferences(newPreferences)
    }
  }

  const handleRemoveMentor = (index: number) => {
    const newPreferences = [...preferences]
    newPreferences[index].mentor = null
    setPreferences(newPreferences)
  }

  const handleSaveAndContinue = () => {
    if (!preferences[0].mentor) {
      alert('请至少选择第一志愿')
      return
    }
    if (!applicationReason.trim()) {
      alert('请填写第一志愿申请理由')
      return
    }
    
    console.log('保存志愿', { preferences, applicationReason })
    alert('志愿保存成功！')
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">填报导师志愿</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">步骤 2/3</span>
              <Button onClick={handleSaveAndContinue} disabled={isSaving}>
                {isSaving ? '保存中...' : '保存并继续'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 可选导师列表 */}
            <Card>
              <CardHeader>
                <CardTitle>可选导师列表</CardTitle>
                <div className="mt-4 space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="搜索导师姓名、实验室或研究方向..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowFilter(!showFilter)}
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, mentor)}
                      className="p-4 bg-white border rounded-lg cursor-move hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{mentor.name}</h4>
                            <span className="text-sm text-gray-600">- {mentor.lab}</span>
                          </div>
                          <div className="mt-1">
                            <span className="text-sm text-green-600 font-medium">
                              匹配度: {mentor.matchScore}%
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {mentor.researchAreas.map((area, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAddMentor(mentor)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 志愿序列 */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>我的志愿序列</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">提示：拖拽调整顺序</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {preferences.map((pref, index) => (
                      <div
                        key={pref.order}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                          dragOverIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-700">第{pref.order}志愿</span>
                          {pref.mentor && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveMentor(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                        {pref.mentor ? (
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, pref.mentor!, index)}
                            className="mt-2 p-3 bg-white rounded border cursor-move"
                          >
                            <div className="flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium">
                                  {pref.mentor.name} - {pref.mentor.lab}
                                </div>
                                <div className="text-sm text-gray-600">
                                  匹配度: {pref.mentor.matchScore}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-center text-gray-400 py-4">
                            [空]
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 申请理由 */}
              {preferences[0].mentor && (
                <Card>
                  <CardHeader>
                    <CardTitle>申请理由（第一志愿）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={applicationReason}
                      onChange={(e) => setApplicationReason(e.target.value)}
                      placeholder="请详细说明选择该导师的原因..."
                      maxLength={500}
                      className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 text-right text-sm text-gray-600">
                      字数: {applicationReason.length}/500
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