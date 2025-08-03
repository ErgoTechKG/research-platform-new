import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Settings,
  BarChart3,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  UserCheck,
  X,
  Plus,
  FileText,
  Star
} from 'lucide-react';

interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  student: {
    name: string;
    email: string;
    phone: string;
    major: string;
    gpa: string;
  };
  status: 'scheduled' | 'confirmed' | 'pending' | 'cancelled' | 'completed';
  location: string;
  materials: {
    resume: boolean;
    transcript: boolean;
    statement: boolean;
    portfolio: boolean;
  };
  conflicts?: string[];
  evaluation?: {
    score: number;
    feedback: string;
    recommendation: 'accept' | 'reject' | 'waitlist';
  };
}

interface CalendarDay {
  date: number;
  hasInterview: boolean;
  hasConflict: boolean;
  isRecommended: boolean;
  interviews: InterviewSlot[];
}

const ProfessorInterviewScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<InterviewSlot | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [emailTemplate, setEmailTemplate] = useState(`亲爱的同学，

您的实验室轮转申请已通过初审，诚邀您参加面试。

面试时间：{date} {time}
面试地点：{location}
面试时长：约1小时

请提前15分钟到达，并携带相关材料。

祝好！
{professor}`);

  // Mock data for demonstration
  const [interviews, setInterviews] = useState<InterviewSlot[]>([
    {
      id: '1',
      date: '2024-03-26',
      time: '14:00',
      duration: 60,
      student: {
        name: '张小明',
        email: 'zhangxm@university.edu.cn',
        phone: '138****5678',
        major: '机器学习方向',
        gpa: '3.8'
      },
      status: 'pending',
      location: 'AI实验室205',
      materials: { resume: true, transcript: true, statement: true, portfolio: false },
      conflicts: []
    },
    {
      id: '2',
      date: '2024-03-28',
      time: '15:00',
      duration: 60,
      student: {
        name: '李华',
        email: 'lihua@university.edu.cn',
        phone: '139****1234',
        major: '计算机视觉',
        gpa: '3.9'
      },
      status: 'scheduled',
      location: 'AI实验室205',
      materials: { resume: true, transcript: true, statement: true, portfolio: true },
      conflicts: ['与王芳面试时间冲突']
    },
    {
      id: '3',
      date: '2024-03-25',
      time: '10:00',
      duration: 45,
      student: {
        name: '李华',
        email: 'lihua2@university.edu.cn',
        phone: '138****9999',
        major: '计算机视觉',
        gpa: '3.7'
      },
      status: 'completed',
      location: 'AI实验室205',
      materials: { resume: true, transcript: true, statement: true, portfolio: true },
      conflicts: [],
      evaluation: {
        score: 85,
        feedback: '学生基础很好，对研究方向有清晰认识，建议录取',
        recommendation: 'accept'
      }
    }
  ]);

  const [statistics, setStatistics] = useState({
    total: 42,
    completed: 18,
    pending: 24,
    confirmed: 18,
    cancelled: 3,
    avgDuration: 38,
    confirmationRate: 89.3,
    cancellationRate: 7.1,
    lateRate: 3.6
  });

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: CalendarDay[] = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayInterviews = interviews.filter(interview => interview.date === dateStr);
      
      days.push({
        date: i,
        hasInterview: dayInterviews.length > 0,
        hasConflict: dayInterviews.some(interview => interview.conflicts && interview.conflicts.length > 0),
        isRecommended: i === 1 && month === 3, // Mock recommended date
        interviews: dayInterviews
      });
    }
    
    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'confirmed': return '已确认';
      case 'pending': return '待确认';
      case 'cancelled': return '已取消';
      case 'scheduled': return '已安排';
      default: return status;
    }
  };

  const handleBatchInvite = () => {
    console.log('Sending batch invitations to:', selectedStudents);
    // Mock batch invitation logic
  };

  const handleAutoSchedule = () => {
    console.log('Auto-scheduling interviews for:', selectedStudents);
    // Mock auto-scheduling logic
  };

  const handleSyncCalendar = () => {
    console.log('Syncing with external calendars...');
    // Mock calendar sync logic
  };

  const handleConflictResolution = (interviewId: string, action: 'reschedule' | 'keep') => {
    console.log(`${action} conflict for interview:`, interviewId);
    // Mock conflict resolution logic
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filterStatus === 'all') return true;
    return interview.status === filterStatus;
  });

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              实验室轮转面试排期系统
            </h1>
            <p className="text-gray-600 mt-1">智能化面试安排和管理工具</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              统计
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </div>
        </div>

        {/* Control Panel */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.pending}</div>
                <div className="text-sm text-gray-600">待安排</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.completed}</div>
                <div className="text-sm text-gray-600">已安排</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">2</div>
                <div className="text-sm text-gray-600">冲突数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">6</div>
                <div className="text-sm text-gray-600">待发邀请</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAutoSchedule} className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                智能排期
              </Button>
              <Button onClick={handleBatchInvite} variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                批量邀请
              </Button>
              <Button onClick={handleSyncCalendar} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                同步日历
              </Button>
              <Button variant="outline" className="text-orange-600 border-orange-600">
                <AlertTriangle className="w-4 h-4 mr-2" />
                冲突检测
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                统计分析
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Conflict Detection and Batch Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Conflict Detection Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                冲突检测面板
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Serious Conflicts */}
              <div>
                <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  严重冲突 (需立即处理)
                </h4>
                <div className="bg-red-50 p-3 rounded-lg space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">3月28日 15:00-16:00</div>
                    <div className="text-gray-600">李华 vs 王芳 (同一时间段)</div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                        ⚡ 快速解决
                      </Button>
                      <Button size="sm" variant="outline">
                        📅 重新安排
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Potential Conflicts */}
              <div>
                <h4 className="font-medium text-yellow-600 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  潜在冲突 (建议调整)
                </h4>
                <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">3月29日 17:00-18:00</div>
                    <div className="text-gray-600">陈明面试时间过晚</div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        💡 建议调整
                      </Button>
                      <Button size="sm" variant="outline">
                        ✅ 保持不变
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendar Sync Status */}
              <div>
                <h4 className="font-medium mb-2">外部日历同步状态</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Google Calendar</span>
                    <Badge className="bg-green-100 text-green-800">✅ 已同步</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Outlook</span>
                    <Badge className="bg-green-100 text-green-800">✅ 已同步</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>企业微信</span>
                    <Badge className="bg-yellow-100 text-yellow-800">⏰ 同步中 (2分钟前)</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    立即同步
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-1" />
                    同步设置
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batch Operations Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                批量操作面板
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">已选择: 6位申请者</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">建议时间段</h4>
                  <div className="text-sm space-y-1">
                    <div>• 3月26日 上午: 4个空闲时段</div>
                    <div>• 3月27日 下午: 3个空闲时段</div>
                    <div>• 4月1日 全天: 8个空闲时段</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button onClick={handleBatchInvite} size="sm">
                    📧 发送邀请
                  </Button>
                  <Button onClick={handleAutoSchedule} size="sm" variant="outline">
                    📅 自动安排
                  </Button>
                  <Button size="sm" variant="outline">
                    ⏰ 统一时长
                  </Button>
                  <Button size="sm" variant="outline">
                    📋 批量备注
                  </Button>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">邮件模板</h4>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="text-sm font-medium mb-2">主题: 实验室轮转面试邀请</div>
                    <Textarea
                      value={emailTemplate}
                      onChange={(e) => setEmailTemplate(e.target.value)}
                      rows={4}
                      className="text-xs resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        📝 编辑模板
                      </Button>
                      <Button size="sm" variant="outline">
                        👁️ 预览
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Records Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              面试记录管理
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="completed" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="completed">已完成面试</TabsTrigger>
                <TabsTrigger value="today">今日面试安排</TabsTrigger>
              </TabsList>
              
              <TabsContent value="completed" className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">李华</h4>
                      <p className="text-sm text-gray-600">3月25日 10:00 | 用时: 45分钟 | 申请方向: 计算机视觉</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">评分: 85/100</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">专业基础:</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-1">90分</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">项目经验:</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4].map(i => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-3 h-3 text-gray-300" />
                        <span className="ml-1">80分</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">沟通表达:</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4].map(i => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-3 h-3 text-gray-300" />
                        <span className="ml-1">85分</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">学习意愿:</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-1">95分</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm"><strong>综合评语:</strong> 学生基础很好，对研究方向有清晰认识，建议录取</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">✅ 强烈推荐录取</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        📋 查看完整记录
                      </Button>
                      <Button size="sm" variant="outline">
                        📧 发送结果
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="today" className="space-y-3">
                {[
                  { time: '09:00-10:00', name: '陈明', status: '已确认', statusColor: 'bg-green-100 text-green-800' },
                  { time: '10:30-11:30', name: '王芳', status: '待确认', statusColor: 'bg-yellow-100 text-yellow-800' },
                  { time: '14:00-15:00', name: '赵六', status: '已确认', statusColor: 'bg-green-100 text-green-800' },
                  { time: '15:30-16:30', name: '刘七', status: '已取消', statusColor: 'bg-red-100 text-red-800' }
                ].map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{interview.time}</span>
                      <span>{interview.name}</span>
                      <Badge className={interview.statusColor}>{interview.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        📋 查看材料
                      </Button>
                      <Button size="sm" variant="outline">
                        📞 联系
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline">
                📊 生成报告
              </Button>
              <Button variant="outline">
                📤 导出数据
              </Button>
              <Button variant="outline">
                📧 批量通知
              </Button>
              <Button variant="outline">
                ⚙️ 面试设置
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              统计分析面板
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Interview Statistics */}
              <div>
                <h4 className="font-medium mb-3">面试效果统计</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>总面试数:</span>
                    <span className="font-medium">{statistics.total}场</span>
                  </div>
                  <div className="flex justify-between">
                    <span>已完成:</span>
                    <span className="font-medium">{statistics.completed}场 ({((statistics.completed / statistics.total) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>待进行:</span>
                    <span className="font-medium">{statistics.pending}场 ({((statistics.pending / statistics.total) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均用时:</span>
                    <span className="font-medium">{statistics.avgDuration}分钟</span>
                  </div>
                  <div className="flex justify-between">
                    <span>确认率:</span>
                    <span className="font-medium">{statistics.confirmationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>取消率:</span>
                    <span className="font-medium">{statistics.cancellationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>迟到率:</span>
                    <span className="font-medium">{statistics.lateRate}%</span>
                  </div>
                </div>
              </div>

              {/* Time Distribution */}
              <div>
                <h4 className="font-medium mb-3">时间分布分析</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>上午 (9-12点):</span>
                    <div className="flex-1 bg-gray-200 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{width: '40%'}}></div>
                    </div>
                    <span>40%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>下午 (2-5点):</span>
                    <div className="flex-1 bg-gray-200 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{width: '50%'}}></div>
                    </div>
                    <span>50%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>晚上 (6-8点):</span>
                    <div className="flex-1 bg-gray-200 rounded h-2">
                      <div className="bg-blue-500 h-2 rounded" style={{width: '20%'}}></div>
                    </div>
                    <span>20%</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="font-medium mb-2">完成率趋势</h5>
                  <div className="space-y-1 text-sm">
                    {[
                      {day: '周一', rate: 60},
                      {day: '周二', rate: 80},
                      {day: '周三', rate: 100},
                      {day: '周四', rate: 80},
                      {day: '周五', rate: 40}
                    ].map(item => (
                      <div key={item.day} className="flex items-center gap-2">
                        <span className="w-8">{item.day}:</span>
                        <div className="flex-1 bg-gray-200 rounded h-2">
                          <div className="bg-green-500 h-2 rounded" style={{width: `${item.rate}%`}}></div>
                        </div>
                        <span className="w-8 text-right">{item.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Optimization Suggestions */}
              <div>
                <h4 className="font-medium mb-3">优化建议</h4>
                <div className="space-y-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">增加下午时段</span>
                    </div>
                    <p className="text-gray-600">下午时段利用率高，建议增加更多面试安排</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium">优化邮件模板</span>
                    </div>
                    <p className="text-gray-600">提高邮件确认率，减少重复沟通</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="font-medium">提前3天发送邀请</span>
                    </div>
                    <p className="text-gray-600">给申请者更多准备时间，提高面试质量</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button variant="outline">
                📋 详细报告
              </Button>
              <Button variant="outline">
                📤 数据导出
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    日历视图
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[120px] text-center">
                      {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                        ${day.hasInterview ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}
                        ${day.hasConflict ? 'border-red-300 bg-red-50' : ''}
                        ${day.isRecommended ? 'border-green-300 bg-green-50' : ''}
                        hover:bg-gray-50
                      `}
                      onClick={() => {
                        if (day.interviews.length > 0) {
                          setSelectedSlot(day.interviews[0]);
                        }
                      }}
                    >
                      <div className="text-sm font-medium">{day.date}</div>
                      {day.interviews.map((interview, i) => (
                        <div key={i} className="text-xs mt-1 truncate">
                          <div className="font-medium">{interview.time}</div>
                          <div className="text-gray-600">{interview.student.name}</div>
                          {interview.conflicts && interview.conflicts.length > 0 && (
                            <div className="text-red-600 flex items-center">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              冲突
                            </div>
                          )}
                        </div>
                      ))}
                      {day.isRecommended && (
                        <div className="text-xs text-green-600 font-medium mt-1">建议排期</div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span>空闲时间</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span>已安排</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span>冲突时间</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span>建议时间</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interview Details Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  面试安排面板
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSlot ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedSlot.student.name}</h3>
                      <p className="text-gray-600">{selectedSlot.student.major}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{selectedSlot.date} {selectedSlot.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{selectedSlot.duration}分钟</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedSlot.student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{selectedSlot.student.email}</span>
                      </div>
                    </div>

                    <div>
                      <Badge className={getStatusColor(selectedSlot.status)}>
                        {getStatusText(selectedSlot.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">操作选项</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-1" />
                          重发邀请
                        </Button>
                        <Button size="sm" variant="outline">
                          <Clock className="w-4 h-4 mr-1" />
                          修改时间
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          电话确认
                        </Button>
                        <Button size="sm" variant="outline">
                          <X className="w-4 h-4 mr-1" />
                          取消面试
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">面试材料</h4>
                      <div className="space-y-1">
                        {Object.entries(selectedSlot.materials).map(([key, completed]) => (
                          <div key={key} className="flex items-center gap-2">
                            {completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-orange-600" />
                            )}
                            <span className="text-sm">
                              {key === 'resume' && '简历'}
                              {key === 'transcript' && '成绩单'}
                              {key === 'statement' && '个人陈述'}
                              {key === 'portfolio' && '作品集'}
                            </span>
                            {!completed && <span className="text-orange-600 text-xs">(待补充)</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedSlot.evaluation && (
                      <div className="space-y-2 border-t pt-4">
                        <h4 className="font-medium">面试评价</h4>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>评分: {selectedSlot.evaluation.score}/100</span>
                        </div>
                        <p className="text-sm text-gray-600">{selectedSlot.evaluation.feedback}</p>
                        <Badge className={
                          selectedSlot.evaluation.recommendation === 'accept' ? 'bg-green-100 text-green-800' :
                          selectedSlot.evaluation.recommendation === 'reject' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {selectedSlot.evaluation.recommendation === 'accept' && '强烈推荐录取'}
                          {selectedSlot.evaluation.recommendation === 'reject' && '不推荐录取'}
                          {selectedSlot.evaluation.recommendation === 'waitlist' && '候补名单'}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>选择日历中的面试安排</p>
                    <p className="text-sm">查看详细信息和操作选项</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorInterviewScheduler;