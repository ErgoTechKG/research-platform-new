import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Search, 
  FileText, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Upload,
  Filter,
  UserCheck,
  Users,
  FileUp,
  Send,
  Eye
} from 'lucide-react';

interface Appeal {
  id: string;
  appealNumber: string;
  studentId: string;
  studentName: string;
  appealType: 'grade_dispute' | 'process_issue' | 'material_missing' | 'other';
  appealReason: string;
  attachments: Array<{
    name: string;
    url: string;
    uploadTime: string;
  }>;
  submitTime: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'need_supplement';
  reviewer?: string;
  reviewComment?: string;
  supplementRequest?: string;
  supplementAttachments?: Array<{
    name: string;
    url: string;
    uploadTime: string;
  }>;
}

interface AppealStatistics {
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  needSupplement: number;
  total: number;
}

const AppealManagement: React.FC = () => {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [filteredAppeals, setFilteredAppeals] = useState<Appeal[]>([]);
  const [statistics, setStatistics] = useState<AppealStatistics>({
    pending: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    needSupplement: 0,
    total: 0
  });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [showAppealDialog, setShowAppealDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [appealType, setAppealType] = useState<Appeal['appealType']>('grade_dispute');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'need_supplement'>('approve');
  const [supplementRequest, setSupplementRequest] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Get current user from AuthContext
  const { user } = useAuth();
  const currentUser = user || {
    id: 'U001',
    name: '张三',
    role: 'student'
  };

  useEffect(() => {
    loadMockData();
  }, []);

  useEffect(() => {
    filterAppealsData();
    calculateStatistics();
  }, [appeals, searchQuery, filterType, filterStatus, activeTab]);

  const loadMockData = () => {
    const mockAppeals: Appeal[] = [
      {
        id: '1',
        appealNumber: '#20251115001',
        studentId: 'S001',
        studentName: '陈某某',
        appealType: 'grade_dispute',
        appealReason: '省级竞赛获奖未被正确计入科技创新分数，我在2024年10月获得省级科技创新大赛二等奖，但在系统中未看到相应加分。',
        attachments: [
          { name: '获奖证书.pdf', url: '#', uploadTime: '2025-01-15 10:30:00' },
          { name: '项目证明.docx', url: '#', uploadTime: '2025-01-15 10:31:00' }
        ],
        submitTime: '2025-01-15 10:35:00',
        status: 'under_review',
        reviewer: '李教授'
      },
      {
        id: '2',
        appealNumber: '#20251115002',
        studentId: 'S002',
        studentName: '王某某',
        appealType: 'material_missing',
        appealReason: '提交材料时系统出现故障，导致部分社会实践材料未能成功上传。',
        attachments: [
          { name: '系统错误截图.png', url: '#', uploadTime: '2025-01-14 15:20:00' }
        ],
        submitTime: '2025-01-14 15:25:00',
        status: 'need_supplement',
        reviewer: '张教授',
        supplementRequest: '请补充提供社会实践证明材料'
      },
      {
        id: '3',
        appealNumber: '#20251115003',
        studentId: 'S003',
        studentName: '李某某',
        appealType: 'process_issue',
        appealReason: '评分流程存在问题，我的导师评价未被计入最终成绩。',
        attachments: [
          { name: '导师评价表.pdf', url: '#', uploadTime: '2025-01-13 09:15:00' }
        ],
        submitTime: '2025-01-13 09:20:00',
        status: 'approved',
        reviewer: '赵教授',
        reviewComment: '经核实，确实存在系统录入问题，已重新计算成绩。'
      },
      {
        id: '4',
        appealNumber: '#20251115004',
        studentId: 'S004',
        studentName: '张某某',
        appealType: 'other',
        appealReason: '申请查看详细评分细则和各项得分明细。',
        attachments: [],
        submitTime: '2025-01-12 14:30:00',
        status: 'rejected',
        reviewer: '钱教授',
        reviewComment: '评分细则已在系统中公示，请查看公告栏。'
      },
      {
        id: '5',
        appealNumber: '#20251115005',
        studentId: 'S005',
        studentName: '刘某某',
        appealType: 'grade_dispute',
        appealReason: '思想品德评分与预期不符，请重新审核。',
        attachments: [
          { name: '志愿服务证明.pdf', url: '#', uploadTime: '2025-01-16 11:00:00' }
        ],
        submitTime: '2025-01-16 11:05:00',
        status: 'pending'
      }
    ];

    setAppeals(mockAppeals);
  };

  const filterAppealsData = () => {
    let filtered = [...appeals];

    // Tab filter
    if (activeTab === 'my' && currentUser.role === 'student') {
      filtered = filtered.filter(appeal => appeal.studentId === currentUser.id);
    } else if (activeTab === 'review' && (currentUser.role === 'professor' || currentUser.role === 'admin')) {
      filtered = filtered.filter(appeal => appeal.reviewer === currentUser.name || appeal.status === 'pending');
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(appeal => 
        appeal.appealNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appeal.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appeal.appealReason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(appeal => appeal.appealType === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(appeal => appeal.status === filterStatus);
    }

    setFilteredAppeals(filtered);
  };

  const calculateStatistics = () => {
    const stats: AppealStatistics = {
      pending: appeals.filter(a => a.status === 'pending').length,
      underReview: appeals.filter(a => a.status === 'under_review').length,
      approved: appeals.filter(a => a.status === 'approved').length,
      rejected: appeals.filter(a => a.status === 'rejected').length,
      needSupplement: appeals.filter(a => a.status === 'need_supplement').length,
      total: appeals.length
    };
    setStatistics(stats);
  };

  const handleSubmitAppeal = async () => {
    if (!appealReason.trim()) {
      alert('请填写申诉理由');
      return;
    }

    try {
      const newAppeal: Appeal = {
        id: Date.now().toString(),
        appealNumber: `#2025111500${appeals.length + 1}`,
        studentId: currentUser.id,
        studentName: currentUser.name,
        appealType,
        appealReason,
        attachments: attachments.map(file => ({
          name: file.name,
          url: '#',
          uploadTime: new Date().toISOString()
        })),
        submitTime: new Date().toISOString(),
        status: 'pending'
      };

      setAppeals(prev => [newAppeal, ...prev]);
      setShowAppealDialog(false);
      resetAppealForm();
      alert('申诉已成功提交！');
    } catch (error) {
      alert('申诉提交失败，请重试');
    }
  };

  const handleReviewAppeal = async () => {
    if (!selectedAppeal) return;

    if (reviewAction === 'need_supplement' && !supplementRequest.trim()) {
      alert('请填写补充材料要求');
      return;
    }

    if (!reviewComment.trim() && reviewAction !== 'need_supplement') {
      alert('请填写处理意见');
      return;
    }

    try {
      const updatedAppeals = appeals.map(appeal => {
        if (appeal.id === selectedAppeal.id) {
          return {
            ...appeal,
            status: reviewAction === 'approve' ? 'approved' : 
                   reviewAction === 'reject' ? 'rejected' : 'need_supplement',
            reviewer: currentUser.name,
            reviewComment: reviewAction !== 'need_supplement' ? reviewComment : undefined,
            supplementRequest: reviewAction === 'need_supplement' ? supplementRequest : undefined
          } as Appeal;
        }
        return appeal;
      });

      setAppeals(updatedAppeals);
      setShowReviewDialog(false);
      resetReviewForm();
      alert('申诉处理成功！');
    } catch (error) {
      alert('处理失败，请重试');
    }
  };

  const resetAppealForm = () => {
    setAppealReason('');
    setAppealType('grade_dispute');
    setAttachments([]);
  };

  const resetReviewForm = () => {
    setReviewComment('');
    setReviewAction('approve');
    setSupplementRequest('');
    setSelectedAppeal(null);
  };

  const getStatusBadge = (status: Appeal['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: '待处理' },
      under_review: { color: 'bg-blue-100 text-blue-800', icon: UserCheck, text: '专家组复核中' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: '已接受' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: '已驳回' },
      need_supplement: { color: 'bg-orange-100 text-orange-800', icon: FileUp, text: '需补充材料' }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getAppealTypeText = (type: Appeal['appealType']) => {
    const typeMap = {
      grade_dispute: '科技创新分数异议',
      process_issue: '流程问题',
      material_missing: '材料缺失',
      other: '其他'
    };
    return typeMap[type];
  };

  const canSubmitAppeal = currentUser.role === 'student';
  const canReviewAppeal = currentUser.role === 'professor' || currentUser.role === 'admin';

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">申诉管理中心</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            待处理: <span className="font-medium text-orange-600">{statistics.pending}</span> | 
            已处理: <span className="font-medium text-green-600">{statistics.approved + statistics.rejected}</span>
          </div>
          {canSubmitAppeal && (
            <Button onClick={() => setShowAppealDialog(true)} className="bg-blue-500 hover:bg-blue-600">
              <MessageSquare className="mr-2 h-4 w-4" />
              提交申诉
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid w-full ${canSubmitAppeal && canReviewAppeal ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="all">全部申诉</TabsTrigger>
          {canSubmitAppeal && <TabsTrigger value="my">我的申诉</TabsTrigger>}
          {canReviewAppeal && <TabsTrigger value="review">待审核</TabsTrigger>}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                筛选条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="搜索申诉编号、姓名或理由..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="申诉类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="grade_dispute">科技创新分数异议</SelectItem>
                    <SelectItem value="process_issue">流程问题</SelectItem>
                    <SelectItem value="material_missing">材料缺失</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待处理</SelectItem>
                    <SelectItem value="under_review">专家组复核中</SelectItem>
                    <SelectItem value="approved">已接受</SelectItem>
                    <SelectItem value="rejected">已驳回</SelectItem>
                    <SelectItem value="need_supplement">需补充材料</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{statistics.pending}</div>
                <div className="text-sm text-gray-500">待处理</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.underReview}</div>
                <div className="text-sm text-gray-500">复核中</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.approved}</div>
                <div className="text-sm text-gray-500">已接受</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{statistics.rejected}</div>
                <div className="text-sm text-gray-500">已驳回</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{statistics.needSupplement}</div>
                <div className="text-sm text-gray-500">需补充</div>
              </CardContent>
            </Card>
          </div>

          {/* Appeals List */}
          <Card>
            <CardHeader>
              <CardTitle>申诉列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppeals.map((appeal) => (
                  <div key={appeal.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-sm">{appeal.appealNumber}</span>
                          <span className="font-medium">{appeal.studentName}</span>
                          <Badge variant="outline">{getAppealTypeText(appeal.appealType)}</Badge>
                          {getStatusBadge(appeal.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          提交时间: {appeal.submitTime}
                          {appeal.reviewer && <span> | 处理人: {appeal.reviewer}</span>}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedAppeal(appeal);
                            if (canReviewAppeal && (appeal.status === 'pending' || appeal.status === 'under_review')) {
                              setShowReviewDialog(true);
                            }
                          }}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          查看详情
                        </Button>
                        {canReviewAppeal && (appeal.status === 'pending' || appeal.status === 'under_review') && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedAppeal(appeal);
                              setShowReviewDialog(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            处理申诉
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-sm text-gray-700 line-clamp-2">{appeal.appealReason}</div>
                    </div>

                    {appeal.attachments.length > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>补充材料: </span>
                        {appeal.attachments.map((file, index) => (
                          <a key={index} href={file.url} className="text-blue-600 hover:underline">
                            {file.name}
                          </a>
                        ))}
                      </div>
                    )}

                    {appeal.status === 'need_supplement' && appeal.supplementRequest && (
                      <Alert className="bg-orange-50 border-orange-200">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          需补充材料: {appeal.supplementRequest}
                        </AlertDescription>
                      </Alert>
                    )}

                    {(appeal.status === 'approved' || appeal.status === 'rejected') && appeal.reviewComment && (
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="text-sm text-blue-700">
                          <strong>处理意见:</strong> {appeal.reviewComment}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {filteredAppeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暂无申诉记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Appeal Dialog */}
      <Dialog open={showAppealDialog} onOpenChange={setShowAppealDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>提交申诉</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">申诉类型 <span className="text-red-500">*</span></label>
              <Select value={appealType} onValueChange={(value: Appeal['appealType']) => setAppealType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade_dispute">科技创新分数异议</SelectItem>
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
                placeholder="请详细说明您的申诉理由和依据..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">补充材料</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">点击或拖拽文件到此处上传</p>
                <p className="text-xs text-gray-500 mt-1">支持 PDF、DOC、DOCX、PNG、JPG 格式</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachments(Array.from(e.target.files));
                    }
                  }}
                />
              </div>
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                申诉提交后，专家组将在3个工作日内进行审核。请确保提供的信息真实有效。
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
                <Send className="mr-2 h-4 w-4" />
                提交申诉
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Appeal Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>处理申诉</DialogTitle>
          </DialogHeader>
          {selectedAppeal && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sm">{selectedAppeal.appealNumber}</span>
                  <span className="font-medium">{selectedAppeal.studentName}</span>
                  <Badge variant="outline">{getAppealTypeText(selectedAppeal.appealType)}</Badge>
                </div>
                <div className="text-sm text-gray-600">提交时间: {selectedAppeal.submitTime}</div>
                <div className="mt-2">
                  <strong className="text-sm">申诉理由:</strong>
                  <div className="text-sm text-gray-700 mt-1">{selectedAppeal.appealReason}</div>
                </div>
                {selectedAppeal.attachments.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-sm">附件:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAppeal.attachments.map((file, index) => (
                        <a key={index} href={file.url} className="text-sm text-blue-600 hover:underline">
                          {file.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">处理决定 <span className="text-red-500">*</span></label>
                <Select value={reviewAction} onValueChange={(value: 'approve' | 'reject' | 'need_supplement') => setReviewAction(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">接受申诉</SelectItem>
                    <SelectItem value="reject">驳回申诉</SelectItem>
                    <SelectItem value="need_supplement">需要补充材料</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reviewAction === 'need_supplement' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium">补充材料要求 <span className="text-red-500">*</span></label>
                  <Textarea
                    value={supplementRequest}
                    onChange={(e) => setSupplementRequest(e.target.value)}
                    placeholder="请说明需要补充的材料..."
                    rows={4}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">处理意见 <span className="text-red-500">*</span></label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="请填写处理意见..."
                    rows={4}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleReviewAppeal}
                  disabled={
                    (reviewAction === 'need_supplement' && !supplementRequest.trim()) ||
                    (reviewAction !== 'need_supplement' && !reviewComment.trim())
                  }
                  className={
                    reviewAction === 'approve' ? 'bg-green-500 hover:bg-green-600' :
                    reviewAction === 'reject' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-orange-500 hover:bg-orange-600'
                  }
                >
                  {reviewAction === 'approve' && <CheckCircle className="mr-2 h-4 w-4" />}
                  {reviewAction === 'reject' && <XCircle className="mr-2 h-4 w-4" />}
                  {reviewAction === 'need_supplement' && <FileUp className="mr-2 h-4 w-4" />}
                  {reviewAction === 'approve' ? '接受申诉' :
                   reviewAction === 'reject' ? '驳回申诉' :
                   '要求补充材料'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppealManagement;