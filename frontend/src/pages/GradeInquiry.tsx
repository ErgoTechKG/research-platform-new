import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Download, FileText, BarChart, MessageSquare, History, 
  Trophy, TrendingUp, AlertCircle, CheckCircle, Clock,
  ChevronRight, Star, Award, Target, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface GradeItem {
  id: string;
  category: string;
  weight: number;
  score: number;
  maxScore: number;
  details?: {
    item: string;
    score: number;
    maxScore: number;
  }[];
}

interface CourseGrade {
  id: string;
  courseName: string;
  courseCode: string;
  semester: string;
  totalScore: number;
  grade: string;
  status: 'final' | 'preliminary' | 'pending';
  publishedDate?: string;
  instructor: string;
  gradeItems: GradeItem[];
  feedback?: string;
  improvements?: string[];
}

interface HistoricalGrade {
  semester: string;
  gpa: number;
  courses: {
    name: string;
    grade: string;
    score: number;
  }[];
}

export default function GradeInquiry() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('lab-rotation');
  const [showAppealDialog, setShowAppealDialog] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  
  // Mock data
  const currentGrades: Record<string, CourseGrade> = {
    'lab-rotation': {
      id: '1',
      courseName: '实验室轮转课程',
      courseCode: 'LAB001',
      semester: '2024秋季',
      totalScore: 87.4,
      grade: 'A-',
      status: 'final',
      publishedDate: '2024-10-15',
      instructor: '张教授',
      gradeItems: [
        {
          id: '1',
          category: '过程表现',
          weight: 30,
          score: 85,
          maxScore: 100,
          details: [
            { item: '出勤情况', score: 20, maxScore: 20 },
            { item: '任务完成质量', score: 35, maxScore: 40 },
            { item: '团队协作', score: 30, maxScore: 40 }
          ]
        },
        {
          id: '2',
          category: '海报质量',
          weight: 20,
          score: 90,
          maxScore: 100,
          details: [
            { item: '设计美观', score: 25, maxScore: 30 },
            { item: '内容完整', score: 35, maxScore: 40 },
            { item: '创新性', score: 30, maxScore: 30 }
          ]
        },
        {
          id: '3',
          category: '大报告内容',
          weight: 30,
          score: 88,
          maxScore: 100
        },
        {
          id: '4',
          category: '答辩表现',
          weight: 20,
          score: 92,
          maxScore: 100
        }
      ],
      feedback: '学生表现优秀，研究思路清晰，实验设计合理。海报设计有创意，答辩表现自信。建议在团队协作方面加强沟通能力，在研究深度上可以进一步提升。',
      improvements: [
        '加强团队协作中的沟通技巧',
        '深化研究内容的理论基础',
        '提高实验数据的分析能力'
      ]
    },
    'research-methods': {
      id: '2',
      courseName: '研究方法论',
      courseCode: 'RES201',
      semester: '2024秋季',
      totalScore: 91.5,
      grade: 'A',
      status: 'preliminary',
      instructor: '李教授',
      gradeItems: [
        {
          id: '1',
          category: '课堂参与',
          weight: 20,
          score: 95,
          maxScore: 100
        },
        {
          id: '2',
          category: '作业表现',
          weight: 30,
          score: 92,
          maxScore: 100
        },
        {
          id: '3',
          category: '期中考试',
          weight: 25,
          score: 88,
          maxScore: 100
        },
        {
          id: '4',
          category: '期末项目',
          weight: 25,
          score: 91,
          maxScore: 100
        }
      ],
      feedback: '学习态度认真，理解能力强，能够将理论知识应用于实践。'
    }
  };
  
  const historicalGrades: HistoricalGrade[] = [
    {
      semester: '2024春季',
      gpa: 3.8,
      courses: [
        { name: '高等数学II', grade: 'A', score: 93 },
        { name: '数据结构', grade: 'A-', score: 88 },
        { name: '概率论', grade: 'B+', score: 85 },
        { name: '专业英语', grade: 'A', score: 92 }
      ]
    },
    {
      semester: '2023秋季',
      gpa: 3.7,
      courses: [
        { name: '高等数学I', grade: 'A-', score: 89 },
        { name: '程序设计基础', grade: 'A', score: 94 },
        { name: '线性代数', grade: 'B+', score: 84 },
        { name: '大学物理', grade: 'A-', score: 87 }
      ]
    }
  ];
  
  const currentGrade = currentGrades[selectedCourse];
  
  // Calculate weighted total
  const calculateWeightedScore = (items: GradeItem[]) => {
    return items.reduce((total, item) => {
      return total + (item.score * item.weight / 100);
    }, 0);
  };
  
  // Submit appeal
  const submitAppeal = async () => {
    setIsSubmittingAppeal(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingAppeal(false);
    setShowAppealDialog(false);
    setAppealReason('');
    // Show success message
  };
  
  // Download transcript
  const downloadTranscript = (format: 'pdf' | 'excel') => {
    // Simulate download
    console.log(`Downloading transcript in ${format} format`);
    setShowDownloadDialog(false);
  };
  
  // Get grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final': return 'bg-green-100 text-green-800';
      case 'preliminary': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">成绩查询系统</h1>
          <p className="text-gray-600 mt-1">查看详细成绩和反馈信息</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowDownloadDialog(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            下载成绩单
          </Button>
        </div>
      </div>
      
      {/* Course Selection */}
      <Card>
        <CardHeader>
          <CardTitle>当前学期课程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(currentGrades).map(([key, course]) => (
              <div
                key={key}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCourse === key ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedCourse(key)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{course.courseName}</h3>
                    <p className="text-sm text-gray-600">{course.courseCode} · {course.instructor}</p>
                  </div>
                  <Badge className={getStatusColor(course.status)}>
                    {course.status === 'final' ? '已发布' : 
                     course.status === 'preliminary' ? '初步成绩' : '待发布'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-2xl font-bold">{course.totalScore}</span>
                      <span className="text-sm text-gray-600"> 分</span>
                    </div>
                    <Badge className={`${getGradeColor(course.grade)} px-3 py-1`}>
                      {course.grade}
                    </Badge>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Grade Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentGrade.courseName} - 成绩详情</CardTitle>
            {currentGrade.publishedDate && (
              <span className="text-sm text-gray-600">
                发布时间: {currentGrade.publishedDate}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breakdown" className="space-y-4">
            <TabsList>
              <TabsTrigger value="breakdown">分项成绩</TabsTrigger>
              <TabsTrigger value="feedback">评语反馈</TabsTrigger>
              <TabsTrigger value="history">历史记录</TabsTrigger>
              <TabsTrigger value="analysis">对比分析</TabsTrigger>
            </TabsList>
            
            <TabsContent value="breakdown" className="space-y-4">
              {/* Overall Score */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold">总分</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {currentGrade.totalScore}
                    </span>
                    <span className="text-gray-600">/ 100</span>
                  </div>
                </div>
                <Progress value={currentGrade.totalScore} className="h-3" />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-600">等级评定</span>
                  <Badge className={`${getGradeColor(currentGrade.grade)} px-3`}>
                    {currentGrade.grade}
                  </Badge>
                </div>
              </div>
              
              {/* Grade Items */}
              <div className="space-y-4">
                {currentGrade.gradeItems.map(item => (
                  <Card key={item.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-semibold">{item.category}</h4>
                          <p className="text-sm text-gray-600">权重: {item.weight}%</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{item.score}</div>
                          <div className="text-sm text-gray-600">/ {item.maxScore}</div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={(item.score / item.maxScore) * 100} 
                        className="h-2 mb-3" 
                      />
                      
                      {item.details && (
                        <div className="mt-4 space-y-2 border-t pt-3">
                          {item.details.map((detail, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{detail.item}</span>
                              <span className="font-medium">
                                {detail.score}/{detail.maxScore}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-4">
              {currentGrade.feedback && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">导师评语</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {currentGrade.feedback}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {currentGrade.improvements && currentGrade.improvements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>改进建议</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentGrade.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {/* Appeal Section */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  如对成绩有疑问，可在成绩发布后7个工作日内提出申诉。
                  <Button 
                    variant="link" 
                    className="p-0 h-auto ml-2"
                    onClick={() => setShowAppealDialog(true)}
                  >
                    提出申诉
                  </Button>
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              {historicalGrades.map((semester, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{semester.semester}</CardTitle>
                      <Badge variant="outline">
                        GPA: {semester.gpa}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {semester.courses.map((course, courseIdx) => (
                        <div key={courseIdx} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="font-medium">{course.name}</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-600">{course.score}分</span>
                            <Badge className={`${getGradeColor(course.grade)} px-2 py-0.5 text-xs`}>
                              {course.grade}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-4">
              {/* Performance Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">成绩对比分析</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">班级排名</span>
                      <Badge variant="default">前 15%</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">年级排名</span>
                      <Badge variant="default">前 20%</Badge>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">87.4</div>
                        <div className="text-sm text-gray-600">我的成绩</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">82.3</div>
                        <div className="text-sm text-gray-600">班级平均</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Strengths and Weaknesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">能力分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>优势项目</span>
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• 答辩表现 (92分) - 表达清晰，逻辑严密</li>
                        <li>• 海报设计 (90分) - 创意突出，视觉效果好</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>提升空间</span>
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• 团队协作 (75%) - 加强沟通技巧</li>
                        <li>• 理论深度 - 深化研究基础</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Appeal Dialog */}
      <Dialog open={showAppealDialog} onOpenChange={setShowAppealDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>成绩申诉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>申诉课程</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded">
                {currentGrade.courseName} ({currentGrade.courseCode})
              </div>
            </div>
            
            <div>
              <Label>当前成绩</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded">
                {currentGrade.totalScore}分 ({currentGrade.grade})
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">申诉理由</Label>
              <Textarea
                id="reason"
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="请详细说明申诉理由..."
                className="mt-1 min-h-[120px]"
              />
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                申诉将由课程负责人和教学委员会共同审核，审核结果将在5个工作日内通知。
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAppealDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={submitAppeal} 
              disabled={!appealReason.trim() || isSubmittingAppeal}
            >
              {isSubmittingAppeal ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  提交申诉
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Download Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>下载成绩单</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                成绩单将包含您所有已发布的课程成绩和评语信息。
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => downloadTranscript('pdf')}
              >
                <FileText className="w-4 h-4 mr-2" />
                下载 PDF 格式
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => downloadTranscript('excel')}
              >
                <BarChart className="w-4 h-4 mr-2" />
                下载 Excel 格式
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}