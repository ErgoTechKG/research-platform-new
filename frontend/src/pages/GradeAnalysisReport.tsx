import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Download, FileText, BarChart3, TrendingUp, Users, 
  Target, AlertTriangle, CheckCircle, Calendar,
  PieChart, Activity, Award, Zap, RefreshCw,
  Brain, Clock, Filter, Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GradeStatistics {
  totalStudents: number;
  averageScore: number;
  passRate: number;
  excellentRate: number;
  distribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  trendData: {
    period: string;
    averageScore: number;
    passRate: number;
  }[];
}

interface CourseComparison {
  courseName: string;
  courseCode: string;
  semester: string;
  averageScore: number;
  passRate: number;
  studentCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface AnomalyData {
  type: 'low_score' | 'high_variance' | 'grade_gap';
  description: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  affectedCount: number;
}

interface ReportConfig {
  reportType: string;
  timeRange: {
    start: string;
    end: string;
  };
  includeSections: {
    executiveSummary: boolean;
    courseCompletion: boolean;
    gradeAnalysis: boolean;
    teacherWorkload: boolean;
    recommendations: boolean;
    detailedData: boolean;
  };
  outputFormats: {
    pdf: boolean;
    word: boolean;
    excel: boolean;
    ppt: boolean;
  };
}

export default function GradeAnalysisReport() {
  const { user } = useAuth();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('current-semester');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: '月度教学质量报告',
    timeRange: {
      start: '2025-10-01',
      end: '2025-10-31'
    },
    includeSections: {
      executiveSummary: true,
      courseCompletion: true,
      gradeAnalysis: true,
      teacherWorkload: true,
      recommendations: true,
      detailedData: false
    },
    outputFormats: {
      pdf: true,
      word: true,
      excel: false,
      ppt: true
    }
  });
  
  // Mock data
  const gradeStatistics: GradeStatistics = {
    totalStudents: 284,
    averageScore: 83.7,
    passRate: 92.3,
    excellentRate: 35.6,
    distribution: [
      { grade: 'A', count: 65, percentage: 22.9 },
      { grade: 'A-', count: 36, percentage: 12.7 },
      { grade: 'B+', count: 42, percentage: 14.8 },
      { grade: 'B', count: 58, percentage: 20.4 },
      { grade: 'B-', count: 35, percentage: 12.3 },
      { grade: 'C+', count: 26, percentage: 9.2 },
      { grade: 'C', count: 15, percentage: 5.3 },
      { grade: 'F', count: 7, percentage: 2.5 }
    ],
    trendData: [
      { period: '2024春', averageScore: 81.2, passRate: 89.5 },
      { period: '2024夏', averageScore: 82.8, passRate: 91.2 },
      { period: '2024秋', averageScore: 83.7, passRate: 92.3 }
    ]
  };
  
  const courseComparisons: CourseComparison[] = [
    {
      courseName: '实验室轮转课程',
      courseCode: 'LAB001',
      semester: '2024秋',
      averageScore: 85.4,
      passRate: 95.8,
      studentCount: 67,
      trend: 'up'
    },
    {
      courseName: '研究方法论',
      courseCode: 'RES201',
      semester: '2024秋',
      averageScore: 82.1,
      passRate: 89.2,
      studentCount: 89,
      trend: 'stable'
    },
    {
      courseName: '学术写作',
      courseCode: 'ACA301',
      semester: '2024秋',
      averageScore: 81.9,
      passRate: 91.5,
      studentCount: 78,
      trend: 'down'
    },
    {
      courseName: '数据分析',
      courseCode: 'DAT401',
      semester: '2024秋',
      averageScore: 84.6,
      passRate: 93.4,
      studentCount: 50,
      trend: 'up'
    }
  ];
  
  const anomalies: AnomalyData[] = [
    {
      type: 'low_score',
      description: '实验室轮转课程中发现7名学生成绩低于60分',
      severity: 'high',
      recommendation: '建议安排额外辅导和补考机会',
      affectedCount: 7
    },
    {
      type: 'high_variance',
      description: '数据分析课程成绩分布方差较大，存在两极分化现象',
      severity: 'medium',
      recommendation: '调整教学方法，加强基础知识巩固',
      affectedCount: 15
    },
    {
      type: 'grade_gap',
      description: '学术写作课程男女学生成绩差异显著',
      severity: 'medium',
      recommendation: '分析性别差异原因，优化教学内容',
      affectedCount: 23
    }
  ];
  
  // Generate report
  const generateReport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingReport(false);
    setShowReportDialog(false);
    console.log('Report generated with config:', reportConfig);
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">成绩分析报告</h1>
          <p className="text-gray-600 mt-1">自动生成统计分析，提供全面的成绩分析和报告功能</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-semester">本学期</SelectItem>
              <SelectItem value="last-semester">上学期</SelectItem>
              <SelectItem value="current-year">本学年</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowReportDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            智能报告生成器
          </Button>
        </div>
      </div>
      
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{gradeStatistics.totalStudents}</p>
                <p className="text-gray-600 text-sm">总学生数</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{gradeStatistics.averageScore}</p>
                <p className="text-gray-600 text-sm">平均分</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{gradeStatistics.passRate}%</p>
                <p className="text-gray-600 text-sm">通过率</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{gradeStatistics.excellentRate}%</p>
                <p className="text-gray-600 text-sm">优秀率</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="distribution">成绩分布</TabsTrigger>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="comparison">对比分析</TabsTrigger>
          <TabsTrigger value="anomalies">异常检测</TabsTrigger>
          <TabsTrigger value="insights">智能洞察</TabsTrigger>
        </TabsList>
        
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>成绩分布</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gradeStatistics.distribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="outline" 
                          className={`w-8 justify-center ${
                            item.grade.startsWith('A') ? 'border-green-500 text-green-700' :
                            item.grade.startsWith('B') ? 'border-blue-500 text-blue-700' :
                            item.grade.startsWith('C') ? 'border-yellow-500 text-yellow-700' :
                            'border-red-500 text-red-700'
                          }`}
                        >
                          {item.grade}
                        </Badge>
                        <span className="text-sm">{item.count} 人</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.grade.startsWith('A') ? 'bg-green-500' :
                              item.grade.startsWith('B') ? 'bg-blue-500' :
                              item.grade.startsWith('C') ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Score Range Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>分数段分析</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">90-100分 (优秀)</span>
                      <span className="text-sm">65人 (22.9%)</span>
                    </div>
                    <Progress value={22.9} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">80-89分 (良好)</span>
                      <span className="text-sm">136人 (47.9%)</span>
                    </div>
                    <Progress value={47.9} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">70-79分 (中等)</span>
                      <span className="text-sm">61人(21.5%)</span>
                    </div>
                    <Progress value={21.5} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">60-69分 (及格)</span>
                      <span className="text-sm">15人 (5.3%)</span>
                    </div>
                    <Progress value={5.3} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">0-59分 (不及格)</span>
                      <span className="text-sm">7人 (2.5%)</span>
                    </div>
                    <Progress value={2.5} className="h-2 bg-red-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>成绩趋势分析</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Trend Chart Placeholder */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">成绩趋势图表</p>
                    <p className="text-sm text-gray-400">显示最近三个学期的平均分和通过率变化</p>
                  </div>
                </div>
                
                {/* Trend Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {gradeStatistics.trendData.map((period, idx) => (
                    <Card key={idx} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{period.period}</h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">平均分</span>
                              <span className="font-medium">{period.averageScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">通过率</span>
                              <span className="font-medium">{period.passRate}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>课程对比分析</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseComparisons.map((course, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{course.courseName}</h4>
                        <p className="text-sm text-gray-600">{course.courseCode} · {course.semester}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(course.trend)}
                        <Badge variant="outline">{course.studentCount}人</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">平均分</span>
                          <span className="font-semibold">{course.averageScore}</span>
                        </div>
                        <Progress value={course.averageScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">通过率</span>
                          <span className="font-semibold">{course.passRate}%</span>
                        </div>
                        <Progress value={course.passRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>异常数据检测</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly, idx) => (
                  <Alert key={idx} className={`${getSeverityColor(anomaly.severity)} border-l-4`}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{anomaly.description}</p>
                          <Badge variant="outline" className="ml-2">
                            影响 {anomaly.affectedCount} 人
                          </Badge>
                        </div>
                        <p className="text-sm">
                          <strong>建议措施:</strong> {anomaly.recommendation}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>AI 智能洞察</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h5 className="font-semibold text-blue-800 mb-1">教学质量评估</h5>
                    <p className="text-sm text-blue-700">
                      本学期整体教学质量良好，平均分比上学期提升1.9分，通过率提升2.8%。
                      建议继续保持现有教学模式，适当增加实践环节。
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <h5 className="font-semibold text-green-800 mb-1">优势发现</h5>
                    <p className="text-sm text-green-700">
                      实验室轮转课程表现突出，学生满意度高，建议将该课程的教学方法推广到其他课程。
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <h5 className="font-semibold text-yellow-800 mb-1">改进建议</h5>
                    <p className="text-sm text-yellow-700">
                      数据分析课程成绩分化明显，建议开设先修班或基础辅导班，帮助基础薄弱的学生。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>关键指标监控</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">教学目标完成度</span>
                      <span className="text-sm font-semibold">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">学生满意度</span>
                      <span className="text-sm font-semibold">4.7/5.0</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">课程难度适配性</span>
                      <span className="text-sm font-semibold">88.5%</span>
                    </div>
                    <Progress value={88.5} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">教学资源利用率</span>
                      <span className="text-sm font-semibold">91.3%</span>
                    </div>
                    <Progress value={91.3} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Report Generation Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>智能报告生成器</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>报告类型</Label>
                <Select 
                  value={reportConfig.reportType} 
                  onValueChange={(value) => setReportConfig(prev => ({...prev, reportType: value}))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="月度教学质量报告">月度教学质量报告</SelectItem>
                    <SelectItem value="学期成绩分析报告">学期成绩分析报告</SelectItem>
                    <SelectItem value="课程对比分析报告">课程对比分析报告</SelectItem>
                    <SelectItem value="学生发展报告">学生发展报告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>时间范围</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input 
                    type="date" 
                    className="border rounded px-2 py-1 text-sm"
                    value={reportConfig.timeRange.start}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev, 
                      timeRange: {...prev.timeRange, start: e.target.value}
                    }))}
                  />
                  <input 
                    type="date" 
                    className="border rounded px-2 py-1 text-sm"
                    value={reportConfig.timeRange.end}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev, 
                      timeRange: {...prev.timeRange, end: e.target.value}
                    }))}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium">包含内容</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {Object.entries({
                  executiveSummary: '执行摘要 (AI自动生成)',
                  courseCompletion: '课程完成情况统计',
                  gradeAnalysis: '学生成绩分析',
                  teacherWorkload: '导师工作量统计',
                  recommendations: '问题与建议 (AI分析)',
                  detailedData: '详细数据附录'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={reportConfig.includeSections[key as keyof typeof reportConfig.includeSections]}
                      onCheckedChange={(checked) => setReportConfig(prev => ({
                        ...prev,
                        includeSections: {
                          ...prev.includeSections,
                          [key]: checked as boolean
                        }
                      }))}
                    />
                    <Label htmlFor={key} className="text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium">输出格式</Label>
              <div className="flex space-x-4 mt-3">
                {Object.entries({
                  pdf: 'PDF',
                  word: 'Word',
                  excel: 'Excel',
                  ppt: 'PPT'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={reportConfig.outputFormats[key as keyof typeof reportConfig.outputFormats]}
                      onCheckedChange={(checked) => setReportConfig(prev => ({
                        ...prev,
                        outputFormats: {
                          ...prev.outputFormats,
                          [key]: checked as boolean
                        }
                      }))}
                    />
                    <Label htmlFor={key} className="text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                报告生成通常需要2-5分钟，生成完成后将自动下载到您的设备。
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowReportDialog(false)}>
              取消
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                预览报告
              </Button>
              <Button 
                onClick={generateReport}
                disabled={isGeneratingReport}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGeneratingReport ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    生成报告
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}