import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Users,
  Clock,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  History,
  Download,
  Send,
  Shield,
  Eye
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  finalScore: number;
  grade: string;
  dimensions: {
    moral: number;
    course: number;
    innovation: number;
    research: number;
  };
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  reviewers: string[];
  votes: {
    approve: number;
    reject: number;
    abstain: number;
  };
}

interface ReviewComment {
  id: string;
  studentId: string;
  reviewer: string;
  timestamp: Date;
  comment: string;
  vote: 'approve' | 'reject' | 'abstain';
}

interface ReviewHistory {
  id: string;
  action: string;
  reviewer: string;
  timestamp: Date;
  details: string;
}

const ReviewConfirmationProcess: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('review');
  const [reviewComments, setReviewComments] = useState<ReviewComment[]>([]);
  const [currentComment, setCurrentComment] = useState('');
  const [currentVote, setCurrentVote] = useState<'approve' | 'reject' | 'abstain'>('approve');
  const [reviewHistory, setReviewHistory] = useState<ReviewHistory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data
  useEffect(() => {
    const mockStudents: Student[] = [
      {
        id: '1',
        name: '王某某',
        studentId: 'S001',
        class: '计算机科学与技术1班',
        finalScore: 92.5,
        grade: 'A',
        dimensions: { moral: 95, course: 90, innovation: 94, research: 91 },
        status: 'pending',
        reviewers: ['张教授', '李教授', '王教授'],
        votes: { approve: 0, reject: 0, abstain: 0 }
      },
      {
        id: '2',
        name: '李某某',
        studentId: 'S002',
        class: '计算机科学与技术1班',
        finalScore: 85.3,
        grade: 'B',
        dimensions: { moral: 88, course: 82, innovation: 86, research: 85 },
        status: 'reviewing',
        reviewers: ['张教授', '李教授', '王教授'],
        votes: { approve: 2, reject: 0, abstain: 1 }
      },
      {
        id: '3',
        name: '张某某',
        studentId: 'S003',
        class: '计算机科学与技术2班',
        finalScore: 78.6,
        grade: 'C',
        dimensions: { moral: 80, course: 75, innovation: 79, research: 80 },
        status: 'approved',
        reviewers: ['张教授', '李教授', '王教授'],
        votes: { approve: 3, reject: 0, abstain: 0 }
      }
    ];

    const mockComments: ReviewComment[] = [
      {
        id: '1',
        studentId: '2',
        reviewer: '张教授',
        timestamp: new Date('2025-08-01T10:00:00'),
        comment: '各项成绩均衡，符合培养要求。',
        vote: 'approve'
      },
      {
        id: '2',
        studentId: '2',
        reviewer: '李教授',
        timestamp: new Date('2025-08-01T11:00:00'),
        comment: '科研推进方面还有提升空间，但整体表现良好。',
        vote: 'approve'
      }
    ];

    const mockHistory: ReviewHistory[] = [
      {
        id: '1',
        action: '开始审核',
        reviewer: '系统',
        timestamp: new Date('2025-08-01T09:00:00'),
        details: '综合成绩计算完成，进入专家审核阶段'
      },
      {
        id: '2',
        action: '投票',
        reviewer: '张教授',
        timestamp: new Date('2025-08-01T10:00:00'),
        details: '对李某某投票：通过'
      }
    ];

    setStudents(mockStudents);
    setReviewComments(mockComments);
    setReviewHistory(mockHistory);
  }, []);

  const handleVote = (studentId: string) => {
    if (!currentComment.trim()) {
      alert('请填写审核意见');
      return;
    }

    const newComment: ReviewComment = {
      id: Date.now().toString(),
      studentId,
      reviewer: '当前专家',
      timestamp: new Date(),
      comment: currentComment,
      vote: currentVote
    };

    setReviewComments([...reviewComments, newComment]);
    
    // Update student votes
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updatedVotes = { ...student.votes };
        updatedVotes[currentVote]++;
        return {
          ...student,
          votes: updatedVotes,
          status: updatedVotes.approve >= 2 ? 'approved' : 'reviewing'
        };
      }
      return student;
    }));

    // Add to history
    const newHistory: ReviewHistory = {
      id: Date.now().toString(),
      action: '投票',
      reviewer: '当前专家',
      timestamp: new Date(),
      details: `对${students.find(s => s.id === studentId)?.name}投票：${
        currentVote === 'approve' ? '通过' : currentVote === 'reject' ? '不通过' : '弃权'
      }`
    };
    setReviewHistory([...reviewHistory, newHistory]);

    setCurrentComment('');
    alert('投票成功！');
  };

  const handleBatchConfirm = async () => {
    if (selectedStudents.length === 0) {
      alert('请选择需要批量确认的学生');
      return;
    }

    setIsSubmitting(true);
    // Simulate batch confirmation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStudents(prev => prev.map(student => {
      if (selectedStudents.includes(student.id)) {
        return { ...student, status: 'approved' };
      }
      return student;
    }));

    setSelectedStudents([]);
    setIsSubmitting(false);
    alert(`已批量确认${selectedStudents.length}名学生的成绩`);
  };

  const generateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalStudents: students.length,
      approved: students.filter(s => s.status === 'approved').length,
      rejected: students.filter(s => s.status === 'rejected').length,
      pending: students.filter(s => s.status === 'pending').length,
      reviewing: students.filter(s => s.status === 'reviewing').length,
      students,
      comments: reviewComments,
      history: reviewHistory
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'reviewing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-50';
      case 'B':
        return 'text-blue-600 bg-blue-50';
      case 'C':
        return 'text-yellow-600 bg-yellow-50';
      case 'D':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const approvalRate = students.filter(s => s.status === 'approved').length / students.length * 100;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">审核确认流程</h1>
        <div className="space-x-2">
          <Button onClick={generateReport}>
            <Download className="mr-2 h-4 w-4" />
            生成报告
          </Button>
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            查看历史
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">待审核</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">需要专家组审核</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">审核中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {students.filter(s => s.status === 'reviewing').length}
            </div>
            <p className="text-xs text-muted-foreground">正在收集投票</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">已通过</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {students.filter(s => s.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">通过率: {approvalRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">专家组</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground">参与审核专家</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="review">成绩审核</TabsTrigger>
          <TabsTrigger value="comments">审核意见</TabsTrigger>
          <TabsTrigger value="history">审核历史</TabsTrigger>
        </TabsList>

        <TabsContent value="review" className="space-y-4">
          {/* Batch Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">批量操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  已选择 {selectedStudents.length} 名学生
                </div>
                <div className="space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedStudents(students.map(s => s.id))}
                  >
                    全选
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedStudents([])}
                  >
                    取消选择
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleBatchConfirm}
                    disabled={selectedStudents.length === 0 || isSubmitting}
                  >
                    批量确认
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                    />
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(student.status)}
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <span className="text-sm text-gray-500">{student.studentId}</span>
                        <Badge className={getGradeColor(student.grade)}>
                          {student.grade}级
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">班级：</span>{student.class}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">最终成绩：</span>
                            <span className="text-lg font-bold text-blue-600">{student.finalScore}</span>
                          </p>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">各维度成绩：</p>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            <span>思想品德: {student.dimensions.moral}</span>
                            <span>课程成绩: {student.dimensions.course}</span>
                            <span>科技创新: {student.dimensions.innovation}</span>
                            <span>科研推进: {student.dimensions.research}</span>
                          </div>
                        </div>
                      </div>

                      {/* Voting Status */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">投票情况</span>
                          <span className="text-xs text-gray-500">
                            需要至少2票通过
                          </span>
                        </div>
                        <div className="flex space-x-4 text-sm">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 text-green-500 mr-1" />
                            <span>通过: {student.votes.approve}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsDown className="h-4 w-4 text-red-500 mr-1" />
                            <span>不通过: {student.votes.reject}</span>
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-gray-500 mr-1" />
                            <span>弃权: {student.votes.abstain}</span>
                          </div>
                        </div>
                        <Progress 
                          value={(student.votes.approve / 2) * 100} 
                          className="mt-2" 
                        />
                      </div>

                      {/* Review Section */}
                      {student.status === 'pending' || student.status === 'reviewing' ? (
                        <div className="space-y-3">
                          <div>
                            <Label>审核意见</Label>
                            <Textarea
                              placeholder="请输入您的审核意见..."
                              value={currentComment}
                              onChange={(e) => setCurrentComment(e.target.value)}
                              className="mt-1"
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>投票决定</Label>
                            <RadioGroup 
                              value={currentVote} 
                              onValueChange={(value) => setCurrentVote(value as any)}
                              className="flex space-x-4 mt-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="approve" id="approve" />
                                <Label htmlFor="approve" className="cursor-pointer">
                                  通过
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="reject" id="reject" />
                                <Label htmlFor="reject" className="cursor-pointer">
                                  不通过
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="abstain" id="abstain" />
                                <Label htmlFor="abstain" className="cursor-pointer">
                                  弃权
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <Button 
                            onClick={() => handleVote(student.id)}
                            className="w-full"
                          >
                            <Send className="mr-2 h-4 w-4" />
                            提交审核意见
                          </Button>
                        </div>
                      ) : (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            该学生成绩已通过审核确认
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                审核意见记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewComments.map((comment) => (
                  <div key={comment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{comment.reviewer}</span>
                        <Badge variant={comment.vote === 'approve' ? 'default' : 'destructive'}>
                          {comment.vote === 'approve' ? '通过' : 
                           comment.vote === 'reject' ? '不通过' : '弃权'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {comment.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      学生: {students.find(s => s.id === comment.studentId)?.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                审核历史记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviewHistory.map((history) => (
                  <div key={history.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                    <div className="mt-1">
                      <Shield className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{history.action}</span>
                        <span className="text-xs text-gray-500">
                          {history.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{history.details}</p>
                      <p className="text-xs text-gray-500">操作人: {history.reviewer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewConfirmationProcess;