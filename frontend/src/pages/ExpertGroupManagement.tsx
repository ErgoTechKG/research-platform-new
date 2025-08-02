import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Users, UserPlus, Send, FileDown, Settings, Check, Clock,
  Mail, Phone, User, Briefcase, Filter, Search, AlertCircle,
  CheckCircle, X, Edit2, Trash2, UserCheck, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Expert {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  role: 'leader' | 'member';
  responsibilities: string[];
  status: 'confirmed' | 'pending' | 'declined';
  invitedAt: string;
  confirmedAt?: string;
}

interface ExpertGroup {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  totalExperts: number;
  confirmedExperts: number;
  experts: Expert[];
}

export default function ExpertGroupManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedGroup, setSelectedGroup] = useState<string>('current');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showBatchAssign, setShowBatchAssign] = useState(false);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // Mock data
  const [expertGroups] = useState<ExpertGroup[]>([
    {
      id: 'current',
      name: '当前评审专家组',
      description: '2024年春季学期综合素质评价专家组',
      createdAt: '2024-01-15',
      totalExperts: 5,
      confirmedExperts: 4,
      experts: [
        {
          id: '1',
          name: '张教授',
          title: '教授',
          department: '计算机科学系',
          email: 'zhang@university.edu',
          phone: '13800138001',
          role: 'leader',
          responsibilities: ['科技创新评审'],
          status: 'confirmed',
          invitedAt: '2024-01-15',
          confirmedAt: '2024-01-16'
        },
        {
          id: '2',
          name: '李教授',
          title: '教授',
          department: '物理系',
          email: 'li@university.edu',
          phone: '13800138002',
          role: 'member',
          responsibilities: ['科研推进评审'],
          status: 'confirmed',
          invitedAt: '2024-01-15',
          confirmedAt: '2024-01-16'
        },
        {
          id: '3',
          name: '王教授',
          title: '副教授',
          department: '数学系',
          email: 'wang@university.edu',
          phone: '13800138003',
          role: 'member',
          responsibilities: ['思想品德评审'],
          status: 'pending',
          invitedAt: '2024-01-15'
        },
        {
          id: '4',
          name: '陈教授',
          title: '教授',
          department: '化学系',
          email: 'chen@university.edu',
          phone: '13800138004',
          role: 'member',
          responsibilities: ['科技创新评审', '科研推进评审'],
          status: 'confirmed',
          invitedAt: '2024-01-15',
          confirmedAt: '2024-01-17'
        },
        {
          id: '5',
          name: '刘教授',
          title: '副教授',
          department: '生物系',
          email: 'liu@university.edu',
          phone: '13800138005',
          role: 'member',
          responsibilities: ['思想品德评审'],
          status: 'confirmed',
          invitedAt: '2024-01-15',
          confirmedAt: '2024-01-17'
        }
      ]
    }
  ]);
  
  const currentGroup = expertGroups.find(g => g.id === selectedGroup);
  
  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    phone: '',
    role: 'member' as 'leader' | 'member',
    responsibilities: [] as string[]
  });
  
  // Available responsibilities
  const availableResponsibilities = [
    '科技创新评审',
    '科研推进评审',
    '思想品德评审',
    '社会实践评审',
    '团队协作评审'
  ];
  
  // Evaluation rules
  const [evaluationRules, setEvaluationRules] = useState({
    minExperts: 3,
    requireLeaderApproval: true,
    allowConflictOfInterest: false,
    blindReview: false,
    consensusRequired: true,
    maxScoreDifference: 10
  });
  
  // Filter experts
  const filteredExperts = currentGroup?.experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || expert.status === filterStatus;
    const matchesRole = filterRole === 'all' || expert.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  }) || [];
  
  // Toggle expert selection
  const toggleExpertSelection = (expertId: string) => {
    setSelectedExperts(prev =>
      prev.includes(expertId)
        ? prev.filter(id => id !== expertId)
        : [...prev, expertId]
    );
  };
  
  // Select all experts
  const selectAllExperts = () => {
    if (selectedExperts.length === filteredExperts.length) {
      setSelectedExperts([]);
    } else {
      setSelectedExperts(filteredExperts.map(e => e.id));
    }
  };
  
  // Send invitation
  const sendInvitation = async () => {
    if (!inviteForm.name || !inviteForm.email || inviteForm.responsibilities.length === 0) {
      alert('请填写完整的专家信息并选择至少一项评审责任');
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Sending invitation to:', inviteForm);
    setShowInviteDialog(false);
    setInviteForm({
      name: '',
      title: '',
      department: '',
      email: '',
      phone: '',
      role: 'member',
      responsibilities: []
    });
  };
  
  // Batch assign tasks
  const batchAssignTasks = async (responsibilities: string[]) => {
    if (selectedExperts.length === 0) {
      alert('请先选择要分配任务的专家');
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Assigning tasks to experts:', selectedExperts, responsibilities);
    setShowBatchAssign(false);
    setSelectedExperts([]);
  };
  
  // Export expert list
  const exportExpertList = () => {
    const data = currentGroup?.experts.map(expert => ({
      姓名: expert.name,
      职称: expert.title,
      部门: expert.department,
      邮箱: expert.email,
      电话: expert.phone,
      角色: expert.role === 'leader' ? '组长' : '成员',
      评审责任: expert.responsibilities.join('、'),
      状态: expert.status === 'confirmed' ? '已确认' : expert.status === 'pending' ? '待确认' : '已拒绝'
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert_group_${Date.now()}.csv`;
    a.click();
  };
  
  // Save evaluation rules
  const saveEvaluationRules = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving evaluation rules:', evaluationRules);
    setShowRulesDialog(false);
  };
  
  // Get status badge
  const getStatusBadge = (status: Expert['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">已确认</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">待确认</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800">已拒绝</Badge>;
    }
  };
  
  // Get role badge
  const getRoleBadge = (role: Expert['role']) => {
    if (role === 'leader') {
      return <Badge className="bg-purple-100 text-purple-800">组长</Badge>;
    }
    return <Badge variant="outline">成员</Badge>;
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">专家组管理</h1>
          <p className="text-gray-600 mt-1">管理评审专家组成员，分配评审任务和权限</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/evaluation-plan-publishing')}
          >
            返回评价管理
          </Button>
        </div>
      </div>
      
      {/* Group Overview */}
      {currentGroup && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{currentGroup.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{currentGroup.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{currentGroup.confirmedExperts}/{currentGroup.totalExperts}</p>
                <p className="text-sm text-gray-600">专家确认</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
      
      {/* Actions Bar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索专家姓名或部门..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有状态</SelectItem>
              <SelectItem value="confirmed">已确认</SelectItem>
              <SelectItem value="pending">待确认</SelectItem>
              <SelectItem value="declined">已拒绝</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有角色</SelectItem>
              <SelectItem value="leader">组长</SelectItem>
              <SelectItem value="member">成员</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                邀请专家
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>邀请新专家</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>姓名</Label>
                  <Input
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="请输入专家姓名"
                  />
                </div>
                <div>
                  <Label>职称</Label>
                  <Input
                    value={inviteForm.title}
                    onChange={(e) => setInviteForm({ ...inviteForm, title: e.target.value })}
                    placeholder="请输入职称"
                  />
                </div>
                <div>
                  <Label>部门</Label>
                  <Input
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    placeholder="请输入所属部门"
                  />
                </div>
                <div>
                  <Label>邮箱</Label>
                  <Input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="请输入邮箱地址"
                  />
                </div>
                <div>
                  <Label>电话</Label>
                  <Input
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    placeholder="请输入联系电话"
                  />
                </div>
                <div>
                  <Label>角色分配</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value) => setInviteForm({ ...inviteForm, role: value as 'leader' | 'member' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leader">组长</SelectItem>
                      <SelectItem value="member">成员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>评审责任</Label>
                  <div className="space-y-2 mt-2">
                    {availableResponsibilities.map(resp => (
                      <div key={resp} className="flex items-center space-x-2">
                        <Checkbox
                          checked={inviteForm.responsibilities.includes(resp)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setInviteForm({
                                ...inviteForm,
                                responsibilities: [...inviteForm.responsibilities, resp]
                              });
                            } else {
                              setInviteForm({
                                ...inviteForm,
                                responsibilities: inviteForm.responsibilities.filter(r => r !== resp)
                              });
                            }
                          }}
                        />
                        <Label className="font-normal cursor-pointer">{resp}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={sendInvitation}>
                    <Send className="w-4 h-4 mr-2" />
                    发送邀请
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {selectedExperts.length > 0 && (
            <Dialog open={showBatchAssign} onOpenChange={setShowBatchAssign}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  批量分配任务 ({selectedExperts.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>批量分配评审任务</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    为选中的 {selectedExperts.length} 位专家分配评审任务
                  </p>
                  <div>
                    <Label>选择评审任务</Label>
                    <div className="space-y-2 mt-2">
                      {availableResponsibilities.map(resp => (
                        <div key={resp} className="flex items-center space-x-2">
                          <Checkbox id={resp} />
                          <Label htmlFor={resp} className="font-normal cursor-pointer">
                            {resp}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowBatchAssign(false)}>
                      取消
                    </Button>
                    <Button onClick={() => batchAssignTasks([])}>
                      确认分配
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Dialog open={showRulesDialog} onOpenChange={setShowRulesDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                设置评审规则
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>评审规则设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>最少评审专家数</Label>
                  <Input
                    type="number"
                    value={evaluationRules.minExperts}
                    onChange={(e) => setEvaluationRules({
                      ...evaluationRules,
                      minExperts: parseInt(e.target.value) || 0
                    })}
                    min="1"
                    max="10"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={evaluationRules.requireLeaderApproval}
                      onCheckedChange={(checked) => setEvaluationRules({
                        ...evaluationRules,
                        requireLeaderApproval: checked as boolean
                      })}
                    />
                    <Label className="font-normal">需要组长最终审批</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={evaluationRules.blindReview}
                      onCheckedChange={(checked) => setEvaluationRules({
                        ...evaluationRules,
                        blindReview: checked as boolean
                      })}
                    />
                    <Label className="font-normal">启用盲审模式</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={evaluationRules.consensusRequired}
                      onCheckedChange={(checked) => setEvaluationRules({
                        ...evaluationRules,
                        consensusRequired: checked as boolean
                      })}
                    />
                    <Label className="font-normal">需要达成共识</Label>
                  </div>
                </div>
                <div>
                  <Label>最大分数差异</Label>
                  <Input
                    type="number"
                    value={evaluationRules.maxScoreDifference}
                    onChange={(e) => setEvaluationRules({
                      ...evaluationRules,
                      maxScoreDifference: parseInt(e.target.value) || 0
                    })}
                    min="0"
                    max="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    专家评分差异超过此值时需要重新评审
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowRulesDialog(false)}>
                    取消
                  </Button>
                  <Button onClick={saveEvaluationRules}>
                    保存规则
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={exportExpertList}>
            <FileDown className="w-4 h-4 mr-2" />
            导出名单
          </Button>
        </div>
      </div>
      
      {/* Expert List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              当前专家组 ({currentGroup?.confirmedExperts}/{currentGroup?.totalExperts}人)
            </CardTitle>
            {filteredExperts.length > 0 && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedExperts.length === filteredExperts.length}
                  onCheckedChange={selectAllExperts}
                />
                <Label className="font-normal cursor-pointer">全选</Label>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredExperts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无符合条件的专家
            </div>
          ) : (
            filteredExperts.map(expert => (
              <Card key={expert.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={selectedExperts.includes(expert.id)}
                      onCheckedChange={() => toggleExpertSelection(expert.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <h3 className="font-medium text-lg">{expert.name}</h3>
                        {getRoleBadge(expert.role)}
                        {getStatusBadge(expert.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4" />
                          <span>{expert.title} - {expert.department}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{expert.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{expert.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>邀请时间: {expert.invitedAt}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-1">负责评审:</p>
                        <div className="flex flex-wrap gap-2">
                          {expert.responsibilities.map((resp, idx) => (
                            <Badge key={idx} variant="secondary">
                              {resp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {expert.status === 'confirmed' && (
                      <div className="text-right text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        已确认
                        {expert.confirmedAt && (
                          <p className="text-xs text-gray-500">{expert.confirmedAt}</p>
                        )}
                      </div>
                    )}
                    {expert.status === 'pending' && (
                      <Button size="sm" variant="outline">
                        <Send className="w-3 h-3 mr-1" />
                        重发邀请
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}