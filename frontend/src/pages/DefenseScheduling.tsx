import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Calendar, MapPin, Users, Clock, Download, Video, FileText, ArrowRight, Monitor, Mic } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface DefenseSession {
  id: string;
  studentName: string;
  topic: string;
  time: string;
  duration: number;
  isCurrentUser?: boolean;
}

interface Committee {
  id: string;
  name: string;
  role: 'chair' | 'member';
  institution?: string;
}

export default function DefenseScheduling() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showMockDefense, setShowMockDefense] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'offline' | 'online' | 'hybrid'>('hybrid');
  const [showCommitteeDialog, setShowCommitteeDialog] = useState(false);
  
  const myDefenseInfo = {
    date: '2025-10-15',
    time: '14:30-15:00',
    location: '理学楼 A301',
    onlineRoom: 'https://meeting.example.com/defense-room-123',
    mode: 'hybrid' as const,
    requirements: '15分钟展示 + 10分钟问答',
  };
  
  const committees: Committee[] = [
    { id: '1', name: '张教授', role: 'chair', institution: '华中科技大学' },
    { id: '2', name: '李教授', role: 'member', institution: '武汉大学' },
    { id: '3', name: '王教授', role: 'member', institution: '华中科技大学' },
  ];
  
  const defenseSessions: DefenseSession[] = [
    { id: '1', studentName: '王小明', topic: '深度学习在医学图像中的应用', time: '13:30', duration: 30 },
    { id: '2', studentName: '李小红', topic: '基因编辑技术研究', time: '14:00', duration: 30 },
    { id: '3', studentName: '我', topic: '新材料合成与表征', time: '14:30', duration: 30, isCurrentUser: true },
    { id: '4', studentName: '陈小华', topic: '量子计算算法优化', time: '15:00', duration: 30 },
  ];
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'online':
        return <Monitor className="w-4 h-4" />;
      case 'offline':
        return <MapPin className="w-4 h-4" />;
      case 'hybrid':
        return (
          <div className="flex space-x-1">
            <MapPin className="w-4 h-4" />
            <Monitor className="w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };
  
  const getModeText = (mode: string) => {
    switch (mode) {
      case 'online':
        return '纯线上';
      case 'offline':
        return '纯线下';
      case 'hybrid':
        return '线下 + 线上混合';
      default:
        return '';
    }
  };
  
  const handleJoinOnline = () => {
    window.open(myDefenseInfo.onlineRoom, '_blank');
  };
  
  const handleDownloadGuide = () => {
    const content = `答辩须知

时间：${myDefenseInfo.date} ${myDefenseInfo.time}
地点：${myDefenseInfo.location}
形式：${getModeText(myDefenseInfo.mode)}
要求：${myDefenseInfo.requirements}

注意事项：
1. 请提前15分钟到场准备
2. 准备好PPT和相关材料
3. 确保设备正常工作
4. 答辩时间严格控制在规定范围内`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '答辩须知.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleExportSchedule = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Research Platform//Defense Schedule//CN
BEGIN:VEVENT
UID:defense-${Date.now()}@research-platform
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20251015T063000Z
DTEND:20251015T070000Z
SUMMARY:硕士研究生答辩 - 新材料合成与表征
LOCATION:${myDefenseInfo.location}
DESCRIPTION:${myDefenseInfo.requirements}\\n评委：${committees.map(c => c.name).join('、')}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '答辩日程.ics';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const isSecretaryOrAdmin = user?.role === 'admin';
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">答辩安排</h1>
        <Button variant="outline" onClick={handleExportSchedule}>
          <Download className="w-4 h-4 mr-2" />
          导出日程
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>我的答辩信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="font-medium">时间:</span>
              <span>{myDefenseInfo.date} {myDefenseInfo.time}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="font-medium">地点:</span>
              <span>{myDefenseInfo.location} / 在线会议室</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {getModeIcon(myDefenseInfo.mode)}
              <span className="font-medium">形式:</span>
              <span>{getModeText(myDefenseInfo.mode)}</span>
              {isSecretaryOrAdmin && (
                <Select value={selectedMode} onValueChange={(value: any) => setSelectedMode(value)}>
                  <SelectTrigger className="w-40 ml-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">纯线下</SelectItem>
                    <SelectItem value="online">纯线上</SelectItem>
                    <SelectItem value="hybrid">混合模式</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="flex items-start space-x-2">
              <Users className="w-5 h-5 text-gray-600 mt-0.5" />
              <span className="font-medium">评委:</span>
              <div className="flex flex-wrap gap-2">
                {committees.map((committee) => (
                  <Badge
                    key={committee.id}
                    variant={committee.role === 'chair' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => isSecretaryOrAdmin && setShowCommitteeDialog(true)}
                  >
                    {committee.name}
                    {committee.role === 'chair' && '(主席)'}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium">要求:</span>
              <span>{myDefenseInfo.requirements}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleJoinOnline}>
              <Video className="w-4 h-4 mr-2" />
              加入在线会议
            </Button>
            <Button variant="outline" onClick={handleDownloadGuide}>
              <FileText className="w-4 h-4 mr-2" />
              下载答辩须知
            </Button>
            <Button variant="outline" onClick={() => setShowMockDefense(true)}>
              <Mic className="w-4 h-4 mr-2" />
              模拟答辩
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>答辩顺序</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {defenseSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  session.isCurrentUser
                    ? 'bg-blue-50 border-2 border-blue-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-gray-700">{session.time}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{session.studentName}</span>
                      <span className="text-gray-600">-</span>
                      <span className="text-gray-700">{session.topic}</span>
                      {session.isCurrentUser && (
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                </div>
                {isSecretaryOrAdmin && (
                  <Button variant="ghost" size="sm">
                    编辑
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showMockDefense} onOpenChange={setShowMockDefense}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>模拟答辩</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              模拟答辩功能可以帮助您熟悉答辩流程，测试设备，练习演讲。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium">功能特点：</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>测试摄像头和麦克风</li>
                <li>练习屏幕共享</li>
                <li>计时功能，掌控节奏</li>
                <li>录制回放，改进表现</li>
              </ul>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowMockDefense(false)}>
                取消
              </Button>
              <Button onClick={() => {
                setShowMockDefense(false);
                alert('模拟答辩功能即将开启...');
              }}>
                开始模拟
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {isSecretaryOrAdmin && (
        <Dialog open={showCommitteeDialog} onOpenChange={setShowCommitteeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>评委管理</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                {committees.map((committee) => (
                  <div key={committee.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{committee.name}</div>
                      <div className="text-sm text-gray-500">{committee.institution}</div>
                    </div>
                    <Select value={committee.role} onValueChange={() => {}}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chair">主席</SelectItem>
                        <SelectItem value="member">成员</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline">
                添加评委
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}