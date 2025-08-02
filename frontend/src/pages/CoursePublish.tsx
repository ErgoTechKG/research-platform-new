import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function CoursePublish() {
  const navigate = useNavigate()
  const [courseName, setCourseName] = useState('')
  const [courseGoal, setCourseGoal] = useState('')
  const [duration, setDuration] = useState('8')
  const [targetAudience, setTargetAudience] = useState('sophomore')
  const [assessmentMethods, setAssessmentMethods] = useState({
    processEvaluation: true,
    posterPresentation: true,
    finalReport: true
  })
  const [publishTime, setPublishTime] = useState('')
  const [publishChannels, setPublishChannels] = useState({
    systemNotification: true,
    email: true,
    wechat: false
  })
  const [targetGroup, setTargetGroup] = useState('all-experimental-students')

  const handleSaveDraft = () => {
    const formData = {
      courseName,
      courseGoal,
      duration,
      targetAudience,
      assessmentMethods,
      publishTime,
      publishChannels,
      targetGroup,
      status: 'draft'
    }
    console.log('保存草稿:', formData)
    alert('草稿已保存')
  }

  const handleSaveAsTemplate = () => {
    const formData = {
      courseName,
      courseGoal,
      duration,
      targetAudience,
      assessmentMethods,
      publishChannels,
      targetGroup
    }
    console.log('保存为模板:', formData)
    alert('已保存为模板')
  }

  const handlePublishNow = () => {
    if (!courseName || !courseGoal || !publishTime) {
      alert('请填写必填字段')
      return
    }
    const formData = {
      courseName,
      courseGoal,
      duration,
      targetAudience,
      assessmentMethods,
      publishTime,
      publishChannels,
      targetGroup,
      status: 'published'
    }
    console.log('立即发布:', formData)
    alert('课程已发布')
    navigate('/dashboard')
  }

  const handleSchedulePublish = () => {
    if (!courseName || !courseGoal || !publishTime) {
      alert('请填写必填字段')
      return
    }
    const formData = {
      courseName,
      courseGoal,
      duration,
      targetAudience,
      assessmentMethods,
      publishTime,
      publishChannels,
      targetGroup,
      status: 'scheduled'
    }
    console.log('定时发布:', formData)
    alert(`课程将于 ${publishTime} 发布`)
    navigate('/dashboard')
  }

  const handlePreview = () => {
    console.log('预览功能')
    alert('预览功能开发中')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">发布实验室轮转课程</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview}>预览</Button>
              <Button variant="outline" onClick={handleSaveDraft}>保存草稿</Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>基础信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="courseName">课程名称</Label>
                <Input
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="请输入课程名称"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="courseGoal">课程目标</Label>
                <textarea
                  id="courseGoal"
                  value={courseGoal}
                  onChange={(e) => setCourseGoal(e.target.value)}
                  placeholder="请输入课程目标..."
                  className="mt-1 w-full min-h-[120px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">时长</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-20"
                    />
                    <span className="text-gray-600">周</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetAudience">参与对象</Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger id="targetAudience" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sophomore">本科二年级</SelectItem>
                      <SelectItem value="junior">本科三年级</SelectItem>
                      <SelectItem value="senior">本科四年级</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>考核方式</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="processEvaluation"
                      checked={assessmentMethods.processEvaluation}
                      onCheckedChange={(checked) => 
                        setAssessmentMethods(prev => ({ ...prev, processEvaluation: checked as boolean }))
                      }
                    />
                    <label htmlFor="processEvaluation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      过程评价
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="posterPresentation"
                      checked={assessmentMethods.posterPresentation}
                      onCheckedChange={(checked) => 
                        setAssessmentMethods(prev => ({ ...prev, posterPresentation: checked as boolean }))
                      }
                    />
                    <label htmlFor="posterPresentation" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      海报展示
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="finalReport"
                      checked={assessmentMethods.finalReport}
                      onCheckedChange={(checked) => 
                        setAssessmentMethods(prev => ({ ...prev, finalReport: checked as boolean }))
                      }
                    />
                    <label htmlFor="finalReport" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      大报告
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>发布设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="publishTime">发布时间</Label>
                <Input
                  id="publishTime"
                  type="datetime-local"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>发布渠道</Label>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="systemNotification"
                      checked={publishChannels.systemNotification}
                      onCheckedChange={(checked) => 
                        setPublishChannels(prev => ({ ...prev, systemNotification: checked as boolean }))
                      }
                    />
                    <label htmlFor="systemNotification" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      系统通知
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email"
                      checked={publishChannels.email}
                      onCheckedChange={(checked) => 
                        setPublishChannels(prev => ({ ...prev, email: checked as boolean }))
                      }
                    />
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      邮件
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wechat"
                      checked={publishChannels.wechat}
                      onCheckedChange={(checked) => 
                        setPublishChannels(prev => ({ ...prev, wechat: checked as boolean }))
                      }
                    />
                    <label htmlFor="wechat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      微信群
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="targetGroup">目标受众</Label>
                <Select value={targetGroup} onValueChange={setTargetGroup}>
                  <SelectTrigger id="targetGroup" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-experimental-students">全体实验班学生</SelectItem>
                    <SelectItem value="selected-students">部分学生</SelectItem>
                    <SelectItem value="specific-grade">特定年级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>取消</Button>
            <Button variant="outline" onClick={handleSaveAsTemplate}>保存为模板</Button>
            <Button onClick={handlePublishNow}>立即发布</Button>
            <Button variant="secondary" onClick={handleSchedulePublish}>定时发布</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}