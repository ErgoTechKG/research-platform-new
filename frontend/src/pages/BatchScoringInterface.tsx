import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { 
  Calculator, Send, Eye, X, Filter, Users, Calendar,
  FileText, CheckCircle, AlertCircle, Clock, MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Assignment {
  id: string;
  studentName: string;
  studentId: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'ungraded' | 'graded' | 'pending';
  currentScore?: number;
  group?: string;
}

interface CommentTemplate {
  id: string;
  name: string;
  content: string;
}

export default function BatchScoringInterface() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAssignments, setSelectedAssignments] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterTimeRange, setFilterTimeRange] = useState<string>('all');
  const [scoringMode, setScoringMode] = useState<'unified' | 'range'>('unified');
  const [unifiedScore, setUnifiedScore] = useState<number>(85);
  const [minScore, setMinScore] = useState<number>(85);
  const [maxScore, setMaxScore] = useState<number>(95);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sendNotification, setSendNotification] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mock data
  const assignments: Assignment[] = [
    { 
      id: '1', 
      studentName: '王小明', 
      studentId: '2024001',
      assignmentTitle: '实验报告3',
      submittedAt: '10-15 08:30',
      status: 'ungraded',
      group: 'A组'
    },
    { 
      id: '2', 
      studentName: '李小红', 
      studentId: '2024002',
      assignmentTitle: '实验报告3',
      submittedAt: '10-15 09:15',
      status: 'ungraded',
      group: 'A组'
    },
    { 
      id: '3', 
      studentName: '张小华', 
      studentId: '2024003',
      assignmentTitle: '实验报告3',
      submittedAt: '10-15 10:20',
      status: 'ungraded',
      group: 'B组'
    },
    { 
      id: '4', 
      studentName: '刘小刚', 
      studentId: '2024004',
      assignmentTitle: '实验报告3',
      submittedAt: '10-14 14:30',
      status: 'graded',
      currentScore: 88,
      group: 'B组'
    },
    { 
      id: '5', 
      studentName: '陈小美', 
      studentId: '2024005',
      assignmentTitle: '实验报告3',
      submittedAt: '10-14 16:45',
      status: 'ungraded',
      group: 'C组'
    },
    { 
      id: '6', 
      studentName: '赵小强', 
      studentId: '2024006',
      assignmentTitle: '实验报告3',
      submittedAt: '10-13 11:20',
      status: 'graded',
      currentScore: 92,
      group: 'C组'
    },
  ];
  
  const commentTemplates: CommentTemplate[] = [
    { id: '1', name: '良好完成，继续努力', content: '作业完成质量良好，继续保持并努力提升。' },
    { id: '2', name: '优秀表现', content: '作业完成出色，展现了深入的理解和思考。' },
    { id: '3', name: '需要改进', content: '作业基本完成，但仍有改进空间，请注意以下几点...' },
    { id: '4', name: '请补充完善', content: '作业内容不够完整，请补充相关内容后重新提交。' },
  ];
  
  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    if (filterStatus !== 'all' && assignment.status !== filterStatus) return false;
    if (filterGroup !== 'all' && assignment.group !== filterGroup) return false;
    if (filterTimeRange === 'thisWeek') {
      // Simple check for this week (in real app, use proper date comparison)
      const date = assignment.submittedAt.split(' ')[0];
      const day = parseInt(date.split('-')[1]);
      if (day < 13 || day > 15) return false;
    }
    return true;
  });
  
  // Get unique groups
  const groups = Array.from(new Set(assignments.map(a => a.group).filter(Boolean)));
  
  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedAssignments(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  // Select all
  const selectAll = () => {
    if (selectedAssignments.length === filteredAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(filteredAssignments.map(a => a.id));
    }
  };
  
  // Generate preview scores
  const generatePreviewScores = () => {
    return selectedAssignments.map(id => {
      const assignment = assignments.find(a => a.id === id);
      if (!assignment) return null;
      
      let score: number;
      if (scoringMode === 'unified') {
        score = unifiedScore;
      } else {
        // Random score in range for preview
        score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
      }
      
      return {
        ...assignment,
        previewScore: score,
        comment: commentTemplates.find(t => t.id === selectedTemplate)?.content || ''
      };
    }).filter(Boolean);
  };
  
  // Process batch scoring
  const processBatchScoring = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setShowPreview(false);
    setShowSuccess(true);
    setSelectedAssignments([]);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const selectedCount = selectedAssignments.length;
  const previewData = showPreview ? generatePreviewScores() : [];
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">批量评分操作</h1>
          <p className="text-gray-600 mt-1">快速高效地为多个作业评分</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="px-3 py-1">
            已选: {selectedCount}个作业
          </Badge>
          <Button
            variant="outline"
            onClick={() => navigate('/multidimensional-scoring')}
          >
            单个评分
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>筛选作业</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="selectAll"
                checked={selectedCount === filteredAssignments.length && selectedCount > 0}
                onCheckedChange={selectAll}
              />
              <Label htmlFor="selectAll" className="cursor-pointer">
                全选
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="ungraded">未评分</SelectItem>
                <SelectItem value="graded">已评分</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterTimeRange} onValueChange={setFilterTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有时间</SelectItem>
                <SelectItem value="thisWeek">本周提交</SelectItem>
                <SelectItem value="lastWeek">上周提交</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterGroup} onValueChange={setFilterGroup}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有小组</SelectItem>
                {groups.map(group => (
                  <SelectItem key={group} value={group!}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Assignment List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredAssignments.map(assignment => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedAssignments.includes(assignment.id)}
                    onCheckedChange={() => toggleSelection(assignment.id)}
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{assignment.studentName}</span>
                      <span className="text-sm text-gray-500">({assignment.studentId})</span>
                      {assignment.group && (
                        <Badge variant="outline" className="text-xs">
                          {assignment.group}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{assignment.assignmentTitle}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>提交: {assignment.submittedAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {assignment.status === 'graded' ? (
                    <Badge variant="default" className="bg-green-600">
                      已评分: {assignment.currentScore}分
                    </Badge>
                  ) : (
                    <Badge variant="secondary">未评分</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Batch Scoring Settings */}
      {selectedCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>批量评分设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scoring Mode */}
            <div className="space-y-3">
              <Label>评分模式</Label>
              <RadioGroup value={scoringMode} onValueChange={(value: 'unified' | 'range') => setScoringMode(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unified" id="unified" />
                  <Label htmlFor="unified" className="cursor-pointer">
                    统一分数
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="range" id="range" />
                  <Label htmlFor="range" className="cursor-pointer">
                    区间分数
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Score Settings */}
            <div className="space-y-3">
              <Label>分数设置</Label>
              {scoringMode === 'unified' ? (
                <div className="flex items-center space-x-2">
                  <span>统一分数:</span>
                  <Input
                    type="number"
                    value={unifiedScore}
                    onChange={(e) => setUnifiedScore(parseInt(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    max="100"
                  />
                  <span>分</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>分数范围:</span>
                  <Input
                    type="number"
                    value={minScore}
                    onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    max="100"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    value={maxScore}
                    onChange={(e) => setMaxScore(parseInt(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    max="100"
                  />
                  <span>分</span>
                </div>
              )}
            </div>
            
            {/* Comment Template */}
            <div className="space-y-3">
              <Label>评语模板</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="选择评语模板" />
                </SelectTrigger>
                <SelectContent>
                  {commentTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Notification */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification"
                checked={sendNotification}
                onCheckedChange={(checked) => setSendNotification(!!checked)}
              />
              <Label htmlFor="notification" className="cursor-pointer">
                发送成绩通知
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Actions */}
      {selectedCount > 0 && (
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedAssignments([])}
          >
            <X className="w-4 h-4 mr-2" />
            取消选择
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            预览结果
          </Button>
          <Button
            onClick={() => setShowPreview(true)}
            disabled={!selectedTemplate || (scoringMode === 'range' && minScore > maxScore)}
          >
            <Calculator className="w-4 h-4 mr-2" />
            确认评分
          </Button>
        </div>
      )}
      
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>评分预览</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                请确认以下评分信息，提交后将批量更新所有选中的作业成绩。
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              {previewData.map((item: any) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        {item.studentName} ({item.studentId})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.assignmentTitle} - 提交时间: {item.submittedAt}
                      </div>
                      {item.comment && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">评语:</span> {item.comment}
                        </div>
                      )}
                    </div>
                    <Badge variant="default" className="bg-blue-600">
                      {item.previewScore}分
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {sendNotification && (
              <Alert>
                <Send className="h-4 w-4" />
                <AlertDescription>
                  评分完成后将自动发送成绩通知给所有学生。
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              返回修改
            </Button>
            <Button onClick={processBatchScoring} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Calculator className="w-4 h-4 mr-2 animate-spin" />
                  处理中...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  确认提交
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Success Message */}
      {showSuccess && (
        <Alert className="fixed bottom-4 right-4 w-96 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            成功为 {previewData.length} 个作业完成评分！
            {sendNotification && ' 成绩通知已发送。'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}