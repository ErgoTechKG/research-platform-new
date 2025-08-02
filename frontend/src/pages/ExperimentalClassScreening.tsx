import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { Switch } from '../components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Filter, 
  Download, 
  Eye, 
  Settings, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  FileDown,
  History,
  BarChart3,
  Calculator,
  UserCheck
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  studentId: string;
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D';
  totalScore: number;
  dimensions: {
    moralCharacter: number;
    courseGrade: number;
    techInnovation: number;
    researchProgress: number;
  };
  rank: number;
  selected: boolean;
  standbyOrder?: number;
}

interface ScreeningCriteria {
  minGrade: string;
  maxStudents: number;
  standbyRatio: number; // percentage of standby students
  autoCutoff: boolean;
  cutoffScore?: number;
  priorityDimensions: string[];
}

interface ScreeningResult {
  selected: Student[];
  standby: Student[];
  notSelected: Student[];
  timestamp: string;
  criteria: ScreeningCriteria;
}

interface ScreeningHistory {
  id: string;
  timestamp: string;
  operator: string;
  criteria: ScreeningCriteria;
  results: {
    selectedCount: number;
    standbyCount: number;
    notSelectedCount: number;
  };
  status: 'draft' | 'confirmed' | 'published';
}

const ExperimentalClassScreening: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [screeningCriteria, setScreeningCriteria] = useState<ScreeningCriteria>({
    minGrade: 'B+',
    maxStudents: 30,
    standbyRatio: 20,
    autoCutoff: true,
    priorityDimensions: ['techInnovation', 'researchProgress']
  });
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [isScreening, setIsScreening] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<ScreeningHistory[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('screening');

  const canScreen = user?.role === 'admin' || user?.role === 'professor';

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock student data
    const mockStudents: Student[] = [
      {
        id: '1',
        name: '王明',
        studentId: '2023001',
        grade: 'A',
        totalScore: 92.5,
        dimensions: {
          moralCharacter: 95,
          courseGrade: 90,
          techInnovation: 94,
          researchProgress: 91
        },
        rank: 1,
        selected: false
      },
      {
        id: '2',
        name: '李红',
        studentId: '2023002',
        grade: 'A',
        totalScore: 90.8,
        dimensions: {
          moralCharacter: 88,
          courseGrade: 92,
          techInnovation: 91,
          researchProgress: 90
        },
        rank: 2,
        selected: false
      },
      {
        id: '3',
        name: '张华',
        studentId: '2023003',
        grade: 'A-',
        totalScore: 88.2,
        dimensions: {
          moralCharacter: 90,
          courseGrade: 85,
          techInnovation: 89,
          researchProgress: 88
        },
        rank: 3,
        selected: false
      },
      {
        id: '4',
        name: '陈伟',
        studentId: '2023004',
        grade: 'A-',
        totalScore: 87.5,
        dimensions: {
          moralCharacter: 85,
          courseGrade: 88,
          techInnovation: 90,
          researchProgress: 86
        },
        rank: 4,
        selected: false
      },
      {
        id: '5',
        name: '刘军',
        studentId: '2023005',
        grade: 'B+',
        totalScore: 85.0,
        dimensions: {
          moralCharacter: 82,
          courseGrade: 86,
          techInnovation: 87,
          researchProgress: 84
        },
        rank: 5,
        selected: false
      },
      {
        id: '6',
        name: '赵丽',
        studentId: '2023006',
        grade: 'B+',
        totalScore: 84.3,
        dimensions: {
          moralCharacter: 86,
          courseGrade: 83,
          techInnovation: 85,
          researchProgress: 83
        },
        rank: 6,
        selected: false
      },
      {
        id: '7',
        name: '孙志',
        studentId: '2023007',
        grade: 'B+',
        totalScore: 82.7,
        dimensions: {
          moralCharacter: 80,
          courseGrade: 84,
          techInnovation: 83,
          researchProgress: 82
        },
        rank: 7,
        selected: false
      },
      {
        id: '8',
        name: '周梅',
        studentId: '2023008',
        grade: 'B',
        totalScore: 80.1,
        dimensions: {
          moralCharacter: 78,
          courseGrade: 81,
          techInnovation: 82,
          researchProgress: 79
        },
        rank: 8,
        selected: false
      },
      {
        id: '9',
        name: '吴敏',
        studentId: '2023009',
        grade: 'B',
        totalScore: 78.5,
        dimensions: {
          moralCharacter: 76,
          courseGrade: 79,
          techInnovation: 80,
          researchProgress: 77
        },
        rank: 9,
        selected: false
      },
      {
        id: '10',
        name: '郑涛',
        studentId: '2023010',
        grade: 'B',
        totalScore: 77.2,
        dimensions: {
          moralCharacter: 75,
          courseGrade: 78,
          techInnovation: 78,
          researchProgress: 76
        },
        rank: 10,
        selected: false
      }
    ];
    setStudents(mockStudents);

    // Mock screening history
    const mockHistory: ScreeningHistory[] = [
      {
        id: '1',
        timestamp: '2025-01-10 14:30:00',
        operator: '王主任',
        criteria: {
          minGrade: 'B+',
          maxStudents: 25,
          standbyRatio: 20,
          autoCutoff: true,
          priorityDimensions: ['techInnovation']
        },
        results: {
          selectedCount: 25,
          standbyCount: 5,
          notSelectedCount: 15
        },
        status: 'published'
      },
      {
        id: '2',
        timestamp: '2025-01-15 10:00:00',
        operator: '李教授',
        criteria: {
          minGrade: 'A-',
          maxStudents: 30,
          standbyRatio: 15,
          autoCutoff: false,
          cutoffScore: 85,
          priorityDimensions: ['researchProgress', 'techInnovation']
        },
        results: {
          selectedCount: 28,
          standbyCount: 4,
          notSelectedCount: 13
        },
        status: 'draft'
      }
    ];
    setHistory(mockHistory);
  };

  const runScreening = async () => {
    setIsScreening(true);
    setShowPreview(false);
    
    // Simulate screening process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter students based on criteria
    let eligibleStudents = students.filter(student => {
      const gradeOrder = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D'];
      const minGradeIndex = gradeOrder.indexOf(screeningCriteria.minGrade);
      const studentGradeIndex = gradeOrder.indexOf(student.grade);
      return studentGradeIndex <= minGradeIndex;
    });

    // Apply cutoff score if enabled
    if (!screeningCriteria.autoCutoff && screeningCriteria.cutoffScore) {
      eligibleStudents = eligibleStudents.filter(
        student => student.totalScore >= screeningCriteria.cutoffScore
      );
    }

    // Sort by priority dimensions
    eligibleStudents.sort((a, b) => {
      if (screeningCriteria.priorityDimensions.length > 0) {
        for (const dim of screeningCriteria.priorityDimensions) {
          const aDim = a.dimensions[dim as keyof typeof a.dimensions];
          const bDim = b.dimensions[dim as keyof typeof b.dimensions];
          if (aDim !== bDim) return bDim - aDim;
        }
      }
      return b.totalScore - a.totalScore;
    });

    // Select students
    const selectedCount = Math.min(screeningCriteria.maxStudents, eligibleStudents.length);
    const standbyCount = Math.ceil(selectedCount * (screeningCriteria.standbyRatio / 100));
    
    const selected = eligibleStudents.slice(0, selectedCount);
    const standby = eligibleStudents.slice(selectedCount, selectedCount + standbyCount);
    const notSelected = students.filter(
      student => !selected.includes(student) && !standby.includes(student)
    );

    // Add standby order
    standby.forEach((student, index) => {
      student.standbyOrder = index + 1;
    });

    const result: ScreeningResult = {
      selected,
      standby,
      notSelected,
      timestamp: new Date().toISOString(),
      criteria: screeningCriteria
    };

    setScreeningResult(result);
    setIsScreening(false);
    setShowPreview(true);
  };

  const confirmScreening = () => {
    if (!screeningResult) return;

    const newHistory: ScreeningHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('zh-CN'),
      operator: user?.name || '系统',
      criteria: screeningResult.criteria,
      results: {
        selectedCount: screeningResult.selected.length,
        standbyCount: screeningResult.standby.length,
        notSelectedCount: screeningResult.notSelected.length
      },
      status: 'confirmed'
    };

    setHistory(prev => [newHistory, ...prev]);
    setShowPreview(false);
    alert('筛选结果已确认！');
  };

  const exportResults = () => {
    if (!screeningResult) return;

    const data = {
      exportTime: new Date().toLocaleString('zh-CN'),
      criteria: screeningResult.criteria,
      results: {
        selected: screeningResult.selected.map(s => ({
          rank: s.rank,
          studentId: s.studentId,
          name: s.name,
          grade: s.grade,
          totalScore: s.totalScore,
          status: '已入选'
        })),
        standby: screeningResult.standby.map(s => ({
          rank: s.rank,
          studentId: s.studentId,
          name: s.name,
          grade: s.grade,
          totalScore: s.totalScore,
          status: `候补第${s.standbyOrder}位`
        })),
        notSelected: screeningResult.notSelected.map(s => ({
          rank: s.rank,
          studentId: s.studentId,
          name: s.name,
          grade: s.grade,
          totalScore: s.totalScore,
          status: '未入选'
        }))
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experimental-class-screening-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDimensionLabel = (key: string) => {
    const labels: Record<string, string> = {
      moralCharacter: '思想品德',
      courseGrade: '课程成绩',
      techInnovation: '科技创新',
      researchProgress: '科研推进'
    };
    return labels[key] || key;
  };

  const getGradeBadge = (grade: string) => {
    const colorMap: Record<string, string> = {
      'A': 'bg-green-500',
      'A-': 'bg-green-400',
      'B+': 'bg-blue-500',
      'B': 'bg-blue-400',
      'B-': 'bg-blue-300',
      'C+': 'bg-yellow-500',
      'C': 'bg-yellow-400',
      'D': 'bg-red-500'
    };

    return (
      <Badge className={`text-white ${colorMap[grade] || 'bg-gray-500'}`}>
        {grade}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', text: '草稿' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: '已确认' },
      published: { color: 'bg-green-100 text-green-800', text: '已发布' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">实验班筛选工具</h1>
        <div className="flex items-center space-x-4">
          {screeningResult && showPreview && (
            <Button onClick={exportResults} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              导出结果
            </Button>
          )}
          {canScreen && (
            <Button 
              onClick={runScreening} 
              disabled={isScreening}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isScreening ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  筛选中...
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4" />
                  开始筛选
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screening">筛选配置</TabsTrigger>
          <TabsTrigger value="preview">结果预览</TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
        </TabsList>

        <TabsContent value="screening" className="space-y-4">
          {/* Screening Criteria Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                筛选条件设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">最低等级要求</label>
                  <Select 
                    value={screeningCriteria.minGrade} 
                    onValueChange={(value) => setScreeningCriteria(prev => ({ ...prev, minGrade: value }))}
                    disabled={!canScreen}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">最大录取人数</label>
                  <Input
                    type="number"
                    value={screeningCriteria.maxStudents}
                    onChange={(e) => setScreeningCriteria(prev => ({ 
                      ...prev, 
                      maxStudents: parseInt(e.target.value) || 0 
                    }))}
                    min={1}
                    max={100}
                    disabled={!canScreen}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  候补比例: <span className="font-bold">{screeningCriteria.standbyRatio}%</span>
                </label>
                <Slider
                  value={[screeningCriteria.standbyRatio]}
                  onValueChange={(value) => setScreeningCriteria(prev => ({ 
                    ...prev, 
                    standbyRatio: value[0] 
                  }))}
                  max={50}
                  step={5}
                  disabled={!canScreen}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={screeningCriteria.autoCutoff}
                    onCheckedChange={(checked) => setScreeningCriteria(prev => ({ 
                      ...prev, 
                      autoCutoff: checked 
                    }))}
                    disabled={!canScreen}
                  />
                  <label className="text-sm font-medium">自动分数线</label>
                </div>

                {!screeningCriteria.autoCutoff && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">最低分数线</label>
                    <Input
                      type="number"
                      value={screeningCriteria.cutoffScore || ''}
                      onChange={(e) => setScreeningCriteria(prev => ({ 
                        ...prev, 
                        cutoffScore: parseFloat(e.target.value) || undefined 
                      }))}
                      min={0}
                      max={100}
                      step={0.5}
                      disabled={!canScreen}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">优先考虑维度 (按顺序)</label>
                <div className="space-y-2">
                  {['techInnovation', 'researchProgress', 'courseGrade', 'moralCharacter'].map(dim => (
                    <label key={dim} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={screeningCriteria.priorityDimensions.includes(dim)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setScreeningCriteria(prev => ({
                              ...prev,
                              priorityDimensions: [...prev.priorityDimensions, dim]
                            }));
                          } else {
                            setScreeningCriteria(prev => ({
                              ...prev,
                              priorityDimensions: prev.priorityDimensions.filter(d => d !== dim)
                            }));
                          }
                        }}
                        disabled={!canScreen}
                      />
                      <span className="text-sm">{getDimensionLabel(dim)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Student Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                当前学生统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{students.length}</div>
                  <div className="text-sm text-gray-500">总人数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {students.filter(s => s.grade === 'A' || s.grade === 'A-').length}
                  </div>
                  <div className="text-sm text-gray-500">A级学生</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {students.filter(s => s.grade.startsWith('B')).length}
                  </div>
                  <div className="text-sm text-gray-500">B级学生</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {students.filter(s => s.totalScore >= 85).length}
                  </div>
                  <div className="text-sm text-gray-500">85分以上</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {screeningResult && showPreview ? (
            <>
              {/* Screening Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      筛选结果摘要
                    </div>
                    <Button onClick={confirmScreening} className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      确认结果
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {screeningResult.selected.length}
                      </div>
                      <div className="text-sm text-gray-600">已入选</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600">
                        {screeningResult.standby.length}
                      </div>
                      <div className="text-sm text-gray-600">候补名单</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl font-bold text-gray-600">
                        {screeningResult.notSelected.length}
                      </div>
                      <div className="text-sm text-gray-600">未入选</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="mr-2 h-5 w-5" />
                    已入选学生名单
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                      <div>排名</div>
                      <div>学号</div>
                      <div>姓名</div>
                      <div>等级</div>
                      <div>总分</div>
                      <div>状态</div>
                    </div>
                    {screeningResult.selected.map((student) => (
                      <div key={student.id} className="grid grid-cols-6 gap-4 p-3 border rounded-lg">
                        <div className="font-medium">#{student.rank}</div>
                        <div className="font-mono text-sm">{student.studentId}</div>
                        <div>{student.name}</div>
                        <div>{getGradeBadge(student.grade)}</div>
                        <div className="font-medium">{student.totalScore}</div>
                        <Badge className="bg-green-100 text-green-800">已入选</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Standby Students */}
              {screeningResult.standby.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      候补名单
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                        <div>排名</div>
                        <div>学号</div>
                        <div>姓名</div>
                        <div>等级</div>
                        <div>总分</div>
                        <div>候补顺序</div>
                      </div>
                      {screeningResult.standby.map((student) => (
                        <div key={student.id} className="grid grid-cols-6 gap-4 p-3 border rounded-lg">
                          <div className="font-medium">#{student.rank}</div>
                          <div className="font-mono text-sm">{student.studentId}</div>
                          <div>{student.name}</div>
                          <div>{getGradeBadge(student.grade)}</div>
                          <div className="font-medium">{student.totalScore}</div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            候补第{student.standbyOrder}位
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                请先配置筛选条件并运行筛选，查看结果预览。
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                筛选历史记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{record.timestamp}</span>
                          <span className="text-sm text-gray-500">操作人: {record.operator}</span>
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          筛选条件: 最低{record.criteria.minGrade}级 | 
                          最多{record.criteria.maxStudents}人 | 
                          候补{record.criteria.standbyRatio}%
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedHistoryId(record.id)}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        查看详情
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-700">{record.results.selectedCount}</div>
                        <div className="text-gray-600">已入选</div>
                      </div>
                      <div className="text-center p-2 bg-yellow-50 rounded">
                        <div className="font-medium text-yellow-700">{record.results.standbyCount}</div>
                        <div className="text-gray-600">候补</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-700">{record.results.notSelectedCount}</div>
                        <div className="text-gray-600">未入选</div>
                      </div>
                    </div>

                    {record.status === 'draft' && (
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                          发布
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {history.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无筛选历史记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress Dialog */}
      {isScreening && (
        <Dialog open={isScreening}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>正在筛选...</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Progress value={66} />
              <p className="text-sm text-gray-600 text-center">
                正在根据设定条件筛选实验班学生，请稍候...
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ExperimentalClassScreening;