import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  Download, 
  FileText, 
  MessageSquare, 
  Clock, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Calendar,
  Filter
} from 'lucide-react';

interface AnnouncementRecord {
  id: string;
  studentId: string;
  studentName: string; // Privacy protected (e.g., "王*明")
  maskedStudentId: string; // Privacy protected (e.g., "2023****")
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'D';
  selectionStatus: 'selected' | 'standby' | 'not_selected';
  standbyPosition?: number;
  canAppeal: boolean;
}

interface AppealRecord {
  id: string;
  studentId: string;
  studentName: string;
  currentGrade: string;
  appealReason: string;
  appealType: 'grade_dispute' | 'process_issue' | 'material_missing' | 'other';
  submitTime: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  reviewComment?: string;
}

interface AnnouncementPeriod {
  startDate: string;
  endDate: string;
  appealDeadline: string;
  isActive: boolean;
  daysRemaining: number;
}

const GradeAnnouncementSystem: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [appeals, setAppeals] = useState<AppealRecord[]>([]);
  const [announcementPeriod, setAnnouncementPeriod] = useState<AnnouncementPeriod | null>(null);
  const [searchType, setSearchType] = useState<'name' | 'id' | 'grade'>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAppealDialog, setShowAppealDialog] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [appealType, setAppealType] = useState<AppealRecord['appealType']>('grade_dispute');
  const [selectedRecord, setSelectedRecord] = useState<AnnouncementRecord | null>(null);
  const [showEvaluationCriteria, setShowEvaluationCriteria] = useState(false);
  const [activeTab, setActiveTab] = useState('announcement');

  // Mock current user - in real implementation, this would come from auth context
  const currentUser = {
    id: 'S001',
    name: '张三',
    role: 'student'
  };

  useEffect(() => {
    loadMockData();
  }, []);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchQuery, searchType]);

  const loadMockData = () => {
    // Mock announcement data with privacy protection
    const mockAnnouncements: AnnouncementRecord[] = [
      {
        id: '1',
        studentId: 'S001',
        studentName: '王*明',
        maskedStudentId: '2023****',
        grade: 'A',
        selectionStatus: 'selected',
        canAppeal: true
      },
      {
        id: '2',
        studentId: 'S002',
        studentName: '李*红',
        maskedStudentId: '2023****',
        grade: 'A-',
        selectionStatus: 'selected',
        canAppeal: true
      },
      {
        id: '3',
        studentId: 'S003',
        studentName: '张*华',
        maskedStudentId: '2023****',
        grade: 'B+',
        selectionStatus: 'standby',
        standbyPosition: 3,
        canAppeal: true
      },
      {
        id: '4',
        studentId: 'S004',
        studentName: '陈*',
        maskedStudentId: '2023****',
        grade: 'B',
        selectionStatus: 'not_selected',
        canAppeal: true
      },
      {
        id: '5',
        studentId: 'S005',
        studentName: '刘*军',
        maskedStudentId: '2023****',
        grade: 'B-',
        selectionStatus: 'not_selected',
        canAppeal: true
      },
      {
        id: '6',
        studentId: 'S006',
        studentName: '赵*丽',
        maskedStudentId: '2023****',
        grade: 'A',
        selectionStatus: 'selected',
        canAppeal: true
      }
    ];
    setAnnouncements(mockAnnouncements);

    // Mock announcement period
    const mockPeriod: AnnouncementPeriod = {
      startDate: '2025-01-15',
      endDate: '2025-01-22',
      appealDeadline: '2025-01-20 17:00:00',
      isActive: true,
      daysRemaining: 3
    };
    setAnnouncementPeriod(mockPeriod);

    // Mock appeal records
    const mockAppeals: AppealRecord[] = [
      {
        id: '1',
        studentId: 'S007',
        studentName: '孙*志',
        currentGrade: 'B+',
        appealReason: '我认为我的科技创新项目评分过低，请重新评估',
        appealType: 'grade_dispute',
        submitTime: '2025-01-18 14:30:00',
        status: 'pending'
      },
      {
        id: '2',
        studentId: 'S008',
        studentName: '周*梅',
        currentGrade: 'B',
        appealReason: '提交材料时系统故障，部分材料未能成功上传',
        appealType: 'material_missing',
        submitTime: '2025-01-17 16:45:00',
        status: 'under_review',
        reviewComment: '正在核实材料上传记录'
      }
    ];
    setAppeals(mockAppeals);
  };

  const filterAnnouncements = () => {
    if (!searchQuery.trim()) {
      setFilteredAnnouncements(announcements);
      return;
    }

    const filtered = announcements.filter(record => {
      switch (searchType) {
        case 'name':
          return record.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        case 'id':
          return record.maskedStudentId.includes(searchQuery) || record.studentId.includes(searchQuery);
        case 'grade':
          return record.grade.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return true;
      }
    });
    setFilteredAnnouncements(filtered);
  };

  const handleSubmitAppeal = async () => {
    if (!appealReason.trim()) {
      alert('请填写申诉理由');
      return;
    }

    try {
      const newAppeal: AppealRecord = {
        id: Date.now().toString(),
        studentId: currentUser.id,
        studentName: currentUser.name,
        currentGrade: selectedRecord?.grade || '',
        appealReason,
        appealType,
        submitTime: new Date().toISOString(),
        status: 'pending'
      };

      setAppeals(prev => [newAppeal, ...prev]);
      setShowAppealDialog(false);
      setAppealReason('');
      setSelectedRecord(null);
      alert('申诉已提交成功，我们将在3个工作日内处理');
    } catch (error) {
      alert('申诉提交失败，请重试');
    }
  };

  const handleDownloadList = () => {
    // In real implementation, this would generate and download the actual file
    const data = {
      title: '2025年度综合素质评价结果公示',
      announcementPeriod,
      results: announcements.map(record => ({
        maskedStudentId: record.maskedStudentId,
        studentName: record.studentName,
        grade: record.grade,
        selectionStatus: record.selectionStatus,
        standbyPosition: record.standbyPosition
      })),
      exportTime: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade-announcement-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSelectionStatusBadge = (status: string, position?: number) => {
    switch (status) {
      case 'selected':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />已入选</Badge>;
      case 'standby':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />候补第{position}位</Badge>;
      case 'not_selected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />未入选</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
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

  const getAppealStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">待处理</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-800">审理中</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">已批准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">已驳回</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const evaluationCriteria = [
    { dimension: '思想品德', weight: '20%', description: '包括政治表现、道德修养、社会责任感等' },
    { dimension: '课程成绩', weight: '40%', description: '各门课程的学业成绩综合表现' },
    { dimension: '科技创新', weight: '25%', description: '科研项目、创新竞赛、专利发明等' },
    { dimension: '科研推进', weight: '15%', description: '学术论文、研究报告、实验贡献等' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">2025年度综合素质评价结果公示</h1>
        <div className="flex items-center space-x-4">
          {announcementPeriod && (
            <div className="text-sm text-gray-600">
              公示期剩余：<span className="font-medium text-orange-600">{announcementPeriod.daysRemaining}天</span>
            </div>
          )}
          <Button onClick={handleDownloadList}>
            <Download className="mr-2 h-4 w-4" />
            下载公示名单
          </Button>
        </div>
      </div>

      {/* Announcement Period Info */}
      {announcementPeriod && (
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            公示期：{announcementPeriod.startDate} 至 {announcementPeriod.endDate} | 
            申诉截止时间：{announcementPeriod.appealDeadline}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcement">公示结果</TabsTrigger>
          <TabsTrigger value="appeals">申诉管理</TabsTrigger>
        </TabsList>

        <TabsContent value="announcement" className="space-y-4">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                查询方式
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Select value={searchType} onValueChange={(value: 'name' | 'id' | 'grade') => setSearchType(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">按姓名</SelectItem>
                    <SelectItem value="id">按学号</SelectItem>
                    <SelectItem value="grade">按等级</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={
                    searchType === 'name' ? '输入姓名关键字...' :
                    searchType === 'id' ? '输入学号...' :
                    '输入等级 (A, B+, B, 等)...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  公示结果 (仅显示等级)
                </div>
                <div className="text-sm text-gray-500">
                  共 {filteredAnnouncements.length} 条记录
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                  <div>学号</div>
                  <div>姓名</div>
                  <div>等级</div>
                  <div>是否入选实验班</div>
                </div>

                {/* Data Rows */}
                {filteredAnnouncements.map((record) => (
                  <div key={record.id} className="grid grid-cols-4 gap-4 p-3 border rounded-lg hover:bg-gray-50">
                    <div className="font-mono text-sm">{record.maskedStudentId}</div>
                    <div>{record.studentName}</div>
                    <div>{getGradeBadge(record.grade)}</div>
                    <div>{getSelectionStatusBadge(record.selectionStatus, record.standbyPosition)}</div>
                  </div>
                ))}

                {filteredAnnouncements.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    未找到匹配的记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {
                const userRecord = announcements.find(r => r.studentId === currentUser.id);
                if (userRecord && userRecord.canAppeal) {
                  setSelectedRecord(userRecord);
                  setShowAppealDialog(true);
                } else {
                  alert('您暂时无法申诉或申诉期已过');
                }
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              我要申诉
            </Button>
            
            <Button variant="outline" onClick={() => setShowEvaluationCriteria(true)}>
              <FileText className="mr-2 h-4 w-4" />
              查看评价标准
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="appeals" className="space-y-4">
          {/* Appeals Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{appeals.filter(a => a.status === 'pending').length}</div>
                <div className="text-sm text-gray-500">待处理</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{appeals.filter(a => a.status === 'under_review').length}</div>
                <div className="text-sm text-gray-500">审理中</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{appeals.filter(a => a.status === 'approved').length}</div>
                <div className="text-sm text-gray-500">已批准</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{appeals.filter(a => a.status === 'rejected').length}</div>
                <div className="text-sm text-gray-500">已驳回</div>
              </CardContent>
            </Card>
          </div>

          {/* Appeals List */}
          <Card>
            <CardHeader>
              <CardTitle>申诉记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appeals.map((appeal) => (
                  <div key={appeal.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{appeal.studentName}</span>
                          <span className="text-sm text-gray-500">当前等级: {appeal.currentGrade}</span>
                          {getAppealStatusBadge(appeal.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          申诉类型: {
                            appeal.appealType === 'grade_dispute' ? '成绩争议' :
                            appeal.appealType === 'process_issue' ? '流程问题' :
                            appeal.appealType === 'material_missing' ? '材料缺失' :
                            '其他'
                          }
                        </div>
                        <div className="text-sm text-gray-600">
                          提交时间: {appeal.submitTime}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-700">{appeal.appealReason}</div>
                    </div>
                    {appeal.reviewComment && (
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-blue-700">
                          <strong>处理意见:</strong> {appeal.reviewComment}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {appeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无申诉记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appeal Dialog */}
      <Dialog open={showAppealDialog} onOpenChange={setShowAppealDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>提交申诉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRecord && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">当前信息</div>
                <div className="text-sm text-gray-600 mt-1">
                  学号: {selectedRecord.maskedStudentId} | 等级: {selectedRecord.grade} | 
                  状态: {selectedRecord.selectionStatus === 'selected' ? '已入选' : 
                         selectedRecord.selectionStatus === 'standby' ? `候补第${selectedRecord.standbyPosition}位` : '未入选'}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">申诉类型</label>
              <Select value={appealType} onValueChange={(value: AppealRecord['appealType']) => setAppealType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade_dispute">成绩争议</SelectItem>
                  <SelectItem value="process_issue">流程问题</SelectItem>
                  <SelectItem value="material_missing">材料缺失</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">申诉理由 <span className="text-red-500">*</span></label>
              <Textarea
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder="请详细说明您申诉的理由和依据，我们将认真审核您的申请..."
                rows={6}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                申诉提交后，我们将在3个工作日内进行审核。请确保提供的信息真实有效。
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAppealDialog(false)}>
                取消
              </Button>
              <Button 
                onClick={handleSubmitAppeal}
                disabled={!appealReason.trim()}
              >
                提交申诉
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Evaluation Criteria Dialog */}
      <Dialog open={showEvaluationCriteria} onOpenChange={setShowEvaluationCriteria}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>综合素质评价标准</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              综合素质评价采用多维度评价体系，各维度权重和具体标准如下：
            </div>
            
            <div className="space-y-4">
              {evaluationCriteria.map((criteria, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">{criteria.dimension}</h3>
                    <Badge variant="outline">{criteria.weight}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{criteria.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">等级划分标准</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <div>A级 (90-100分): 优秀，全面发展且在某些方面表现突出</div>
                <div>A-级 (85-89分): 良好，各方面表现均衡且较为优秀</div>
                <div>B+级 (80-84分): 良好，大部分方面表现良好</div>
                <div>B级 (75-79分): 合格，基本达到要求</div>
                <div>B-级 (70-74分): 基本合格，个别方面需要改进</div>
                <div>C级 (60-69分): 待提升，需要重点关注和指导</div>
                <div>D级 (60分以下): 不合格，需要重新评价</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeAnnouncementSystem;