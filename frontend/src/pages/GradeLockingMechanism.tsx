import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Lock, 
  Unlock, 
  Shield, 
  History, 
  FileText, 
  Settings, 
  User, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Upload
} from 'lucide-react';

interface GradeLockRecord {
  id: string;
  studentId: string;
  studentName: string;
  lockStatus: 'locked' | 'unlocked' | 'pending_unlock';
  lockedBy: string;
  lockTime: string;
  lockReason: string;
  unlockRequester?: string;
  unlockReason?: string;
  unlockTime?: string;
  version: number;
}

interface ModificationLog {
  id: string;
  studentId: string;
  studentName: string;
  operation: 'lock' | 'unlock' | 'modify' | 'backup' | 'restore';
  operator: string;
  timestamp: string;
  description: string;
  oldValue?: any;
  newValue?: any;
}

interface BackupRecord {
  id: string;
  backupTime: string;
  operator: string;
  recordCount: number;
  status: 'completed' | 'failed' | 'in_progress';
  filePath?: string;
}

interface LockStrategy {
  id: string;
  name: string;
  description: string;
  autoLockConditions: string[];
  requiredApprovers: string[];
  lockDuration?: number; // in hours
  isActive: boolean;
}

const GradeLockingMechanism: React.FC = () => {
  const [lockRecords, setLockRecords] = useState<GradeLockRecord[]>([]);
  const [modificationLogs, setModificationLogs] = useState<ModificationLog[]>([]);
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>([]);
  const [lockStrategies, setLockStrategies] = useState<LockStrategy[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<GradeLockRecord | null>(null);
  const [unlockReason, setUnlockReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('lock-management');

  // Mock current user - in real implementation, this would come from auth context
  const currentUser = {
    id: '1',
    name: '张老师',
    role: 'secretary',
    permissions: ['lock_grades', 'unlock_grades', 'view_logs', 'manage_strategies']
  };

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock grade lock records
    const mockLockRecords: GradeLockRecord[] = [
      {
        id: '1',
        studentId: 'S001',
        studentName: '王明',
        lockStatus: 'locked',
        lockedBy: '李老师',
        lockTime: '2024-01-15 14:30:00',
        lockReason: '成绩确认完成，防止误操作修改',
        version: 2
      },
      {
        id: '2',
        studentId: 'S002',
        studentName: '张丽',
        lockStatus: 'unlocked',
        lockedBy: '李老师',
        lockTime: '2024-01-15 14:32:00',
        lockReason: '成绩确认完成',
        unlockRequester: '张老师',
        unlockReason: '发现成绩录入错误，需要修正',
        unlockTime: '2024-01-16 09:15:00',
        version: 3
      },
      {
        id: '3',
        studentId: 'S003',
        studentName: '李华',
        lockStatus: 'pending_unlock',
        lockedBy: '李老师',
        lockTime: '2024-01-15 14:35:00',
        lockReason: '成绩确认完成',
        unlockRequester: '王老师',
        unlockReason: '学生申诉，需要重新评分',
        version: 1
      }
    ];
    setLockRecords(mockLockRecords);

    // Mock modification logs
    const mockLogs: ModificationLog[] = [
      {
        id: '1',
        studentId: 'S001',
        studentName: '王明',
        operation: 'lock',
        operator: '李老师',
        timestamp: '2024-01-15 14:30:00',
        description: '锁定学生成绩'
      },
      {
        id: '2',
        studentId: 'S002',
        studentName: '张丽',
        operation: 'unlock',
        operator: '张老师',
        timestamp: '2024-01-16 09:15:00',
        description: '解锁学生成绩用于修正'
      }
    ];
    setModificationLogs(mockLogs);

    // Mock backup records
    const mockBackups: BackupRecord[] = [
      {
        id: '1',
        backupTime: '2024-01-15 23:00:00',
        operator: '系统自动',
        recordCount: 150,
        status: 'completed',
        filePath: '/backups/grades_20240115.json'
      },
      {
        id: '2',
        backupTime: '2024-01-14 23:00:00',
        operator: '系统自动',
        recordCount: 148,
        status: 'completed',
        filePath: '/backups/grades_20240114.json'
      }
    ];
    setBackupRecords(mockBackups);

    // Mock lock strategies
    const mockStrategies: LockStrategy[] = [
      {
        id: '1',
        name: '自动锁定策略',
        description: '当所有评分完成且经过专家审核后自动锁定',
        autoLockConditions: ['所有维度评分完成', '专家组审核通过', '无异常检测'],
        requiredApprovers: ['专家组长', '系统管理员'],
        isActive: true
      },
      {
        id: '2',
        name: '期末锁定策略',
        description: '期末成绩发布前自动锁定所有成绩',
        autoLockConditions: ['到达锁定时间', '成绩审核完成'],
        requiredApprovers: ['教务处长'],
        lockDuration: 72,
        isActive: true
      }
    ];
    setLockStrategies(mockStrategies);
  };

  const handleLockGrade = async (recordId: string, reason: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLockRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              lockStatus: 'locked', 
              lockedBy: currentUser.name,
              lockTime: new Date().toISOString(),
              lockReason: reason,
              version: record.version + 1
            }
          : record
      ));

      // Add to modification log
      const record = lockRecords.find(r => r.id === recordId);
      if (record) {
        const newLog: ModificationLog = {
          id: Date.now().toString(),
          studentId: record.studentId,
          studentName: record.studentName,
          operation: 'lock',
          operator: currentUser.name,
          timestamp: new Date().toISOString(),
          description: `锁定成绩: ${reason}`
        };
        setModificationLogs(prev => [newLog, ...prev]);
      }

      alert('成绩锁定成功！');
    } catch (error) {
      alert('锁定失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestUnlock = async (record: GradeLockRecord) => {
    if (!unlockReason.trim()) {
      alert('请填写解锁原因');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLockRecords(prev => prev.map(r => 
        r.id === record.id 
          ? { 
              ...r, 
              lockStatus: 'pending_unlock',
              unlockRequester: currentUser.name,
              unlockReason: unlockReason,
              version: r.version + 1
            }
          : r
      ));

      // Add to modification log
      const newLog: ModificationLog = {
        id: Date.now().toString(),
        studentId: record.studentId,
        studentName: record.studentName,
        operation: 'unlock',
        operator: currentUser.name,
        timestamp: new Date().toISOString(),
        description: `申请解锁: ${unlockReason}`
      };
      setModificationLogs(prev => [newLog, ...prev]);

      setShowUnlockDialog(false);
      setUnlockReason('');
      setSelectedRecord(null);
      alert('解锁申请已提交，等待审批');
    } catch (error) {
      alert('申请提交失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproveUnlock = async (recordId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLockRecords(prev => prev.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              lockStatus: 'unlocked',
              unlockTime: new Date().toISOString(),
              version: record.version + 1
            }
          : record
      ));

      // Add to modification log
      const record = lockRecords.find(r => r.id === recordId);
      if (record) {
        const newLog: ModificationLog = {
          id: Date.now().toString(),
          studentId: record.studentId,
          studentName: record.studentName,
          operation: 'unlock',
          operator: currentUser.name,
          timestamp: new Date().toISOString(),
          description: '批准解锁申请'
        };
        setModificationLogs(prev => [newLog, ...prev]);
      }

      alert('解锁申请已批准');
    } catch (error) {
      alert('操作失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackupGrades = async () => {
    setIsProcessing(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBackup: BackupRecord = {
        id: Date.now().toString(),
        backupTime: new Date().toISOString(),
        operator: currentUser.name,
        recordCount: lockRecords.length,
        status: 'completed',
        filePath: `/backups/grades_${new Date().toISOString().split('T')[0]}.json`
      };
      
      setBackupRecords(prev => [newBackup, ...prev]);
      alert('备份创建成功！');
    } catch (error) {
      alert('备份失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const getLockStatusBadge = (status: string) => {
    switch (status) {
      case 'locked':
        return <Badge className="bg-red-100 text-red-800"><Lock className="w-3 h-3 mr-1" />已锁定</Badge>;
      case 'unlocked':
        return <Badge className="bg-green-100 text-green-800"><Unlock className="w-3 h-3 mr-1" />未锁定</Badge>;
      case 'pending_unlock':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />待解锁</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'lock':
        return <Lock className="w-4 h-4 text-red-500" />;
      case 'unlock':
        return <Unlock className="w-4 h-4 text-green-500" />;
      case 'modify':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'backup':
        return <Download className="w-4 h-4 text-purple-500" />;
      case 'restore':
        return <Upload className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">成绩锁定机制</h1>
        <div className="space-x-2">
          <Button onClick={handleBackupGrades} disabled={isProcessing}>
            <Download className="mr-2 h-4 w-4" />
            创建备份
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            策略配置
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lock-management">锁定管理</TabsTrigger>
          <TabsTrigger value="modification-logs">修改日志</TabsTrigger>
          <TabsTrigger value="backup-restore">备份恢复</TabsTrigger>
          <TabsTrigger value="lock-strategies">锁定策略</TabsTrigger>
        </TabsList>

        <TabsContent value="lock-management" className="space-y-4">
          {/* Permission Alert */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              当前用户权限：{currentUser.permissions.join('、')}
            </AlertDescription>
          </Alert>

          {/* Lock Records Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                成绩锁定状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lockRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{record.studentName}</span>
                          <span className="text-sm text-gray-500">({record.studentId})</span>
                          {getLockStatusBadge(record.lockStatus)}
                          <Badge variant="outline">v{record.version}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>锁定人：{record.lockedBy} | 锁定时间：{record.lockTime}</div>
                          <div>锁定原因：{record.lockReason}</div>
                          {record.unlockRequester && (
                            <div className="text-orange-600">
                              解锁申请人：{record.unlockRequester} | 申请原因：{record.unlockReason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-x-2">
                        {record.lockStatus === 'unlocked' && (
                          <Button
                            size="sm"
                            onClick={() => handleLockGrade(record.id, '手动锁定')}
                            disabled={isProcessing}
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            锁定
                          </Button>
                        )}
                        {record.lockStatus === 'locked' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRecord(record);
                              setShowUnlockDialog(true);
                            }}
                            disabled={isProcessing}
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            申请解锁
                          </Button>
                        )}
                        {record.lockStatus === 'pending_unlock' && (
                          <div className="space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveUnlock(record.id)}
                              disabled={isProcessing}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              批准
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isProcessing}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              拒绝
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modification-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                修改日志记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modificationLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getOperationIcon(log.operation)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{log.studentName}</span>
                        <span className="text-sm text-gray-500">({log.studentId})</span>
                        <Badge variant="outline">{log.operation}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>操作人：{log.operator} | 时间：{log.timestamp}</div>
                        <div>描述：{log.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup-restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" />
                备份恢复管理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    自动备份：每日23:00 | 保留30天
                  </span>
                  <Button size="sm" variant="outline">
                    配置备份策略
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {backupRecords.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">备份 {backup.id}</span>
                          <Badge className={
                            backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                            backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {backup.status === 'completed' ? '已完成' : 
                             backup.status === 'failed' ? '失败' : '进行中'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          时间：{backup.backupTime} | 操作人：{backup.operator} | 记录数：{backup.recordCount}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          下载
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-1" />
                          恢复
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lock-strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                锁定策略配置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lockStrategies.map((strategy) => (
                  <div key={strategy.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium">{strategy.name}</span>
                          <Badge className={strategy.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {strategy.isActive ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">触发条件：</span>
                            {strategy.autoLockConditions.join('、')}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">审批人员：</span>
                            {strategy.requiredApprovers.join('、')}
                          </div>
                          {strategy.lockDuration && (
                            <div className="text-sm">
                              <span className="font-medium">锁定时长：</span>
                              {strategy.lockDuration}小时
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          编辑
                        </Button>
                        <Button size="sm" variant={strategy.isActive ? "destructive" : "default"}>
                          {strategy.isActive ? '禁用' : '启用'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  添加新策略
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Unlock Request Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申请解锁成绩</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRecord && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{selectedRecord.studentName} ({selectedRecord.studentId})</div>
                <div className="text-sm text-gray-600 mt-1">
                  当前状态：{getLockStatusBadge(selectedRecord.lockStatus)}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">解锁原因 <span className="text-red-500">*</span></label>
              <Textarea
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="请详细说明需要解锁的原因..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUnlockDialog(false)}>
                取消
              </Button>
              <Button 
                onClick={() => selectedRecord && handleRequestUnlock(selectedRecord)}
                disabled={isProcessing || !unlockReason.trim()}
              >
                提交申请
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GradeLockingMechanism;