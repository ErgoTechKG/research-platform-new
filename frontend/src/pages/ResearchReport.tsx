import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Edit, Circle, Clock, Upload, FileText, Check, AlertCircle, History, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';

interface ReportSection {
  id: string;
  title: string;
  required: boolean;
  status: 'completed' | 'editing' | 'pending';
  wordCount: number;
  content: string;
}

interface Version {
  id: string;
  timestamp: Date;
  sections: ReportSection[];
  totalWordCount: number;
  version: string;
}

export default function ResearchReport() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [sections, setSections] = useState<ReportSection[]>([
    { id: '1', title: '研究背景', required: true, status: 'completed', wordCount: 1200, content: '' },
    { id: '2', title: '文献综述', required: true, status: 'completed', wordCount: 1500, content: '' },
    { id: '3', title: '研究方法', required: true, status: 'editing', wordCount: 800, content: '' },
    { id: '4', title: '实验过程', required: true, status: 'pending', wordCount: 0, content: '' },
    { id: '5', title: '结果分析', required: true, status: 'pending', wordCount: 0, content: '' },
    { id: '6', title: '结论与展望', required: true, status: 'pending', wordCount: 0, content: '' },
    { id: '7', title: '参考文献', required: true, status: 'editing', wordCount: 0, content: '' },
    { id: '8', title: '附录', required: false, status: 'pending', wordCount: 0, content: '' },
  ]);
  
  const [referenceCount, setReferenceCount] = useState(15);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [saveTime, setSaveTime] = useState<Date | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState<Record<string, string>>({});
  const [versions, setVersions] = useState<Version[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000),
      sections: sections,
      totalWordCount: 3500,
      version: 'v1.0'
    }
  ]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  const totalWordCount = sections.reduce((sum, section) => sum + section.wordCount, 0);
  const requiredWordCount = 10000;
  const completionPercentage = Math.min(Math.round((totalWordCount / requiredWordCount) * 100), 100);
  
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 3);
  deadline.setHours(deadline.getHours() + 12);
  
  const calculateTimeRemaining = () => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}天${hours}小时`;
  };
  
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000);
    return () => clearInterval(timer);
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'editing':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'editing':
        return '编辑中...';
      case 'pending':
        return '待填写';
      default:
        return '';
    }
  };
  
  const handleSectionEdit = (sectionId: string) => {
    setEditingSection(sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setSectionContent({
        ...sectionContent,
        [sectionId]: section.content
      });
    }
  };
  
  const handleSectionSave = (sectionId: string) => {
    const content = sectionContent[sectionId] || '';
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, content, wordCount, status: 'completed' } 
        : section
    ));
    setEditingSection(null);
  };
  
  const handleSectionCancel = () => {
    setEditingSection(null);
  };
  
  const saveVersion = () => {
    const newVersion: Version = {
      id: String(versions.length + 1),
      timestamp: new Date(),
      sections: [...sections],
      totalWordCount,
      version: `v1.${versions.length}`
    };
    setVersions([...versions, newVersion]);
  };
  
  const restoreVersion = (version: Version) => {
    setSections(version.sections);
    setShowVersionHistory(false);
  };
  
  const handleImportWord = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert('Word文档导入功能已启用');
      }
    };
    input.click();
  };
  
  const handleAutoFormat = () => {
    alert('自动排版功能已应用');
  };
  
  const handleCheckFormat = () => {
    alert('格式检查完成：发现2个格式问题需要修正');
  };
  
  const handleSaveDraft = () => {
    saveVersion();
    setIsDraftSaved(true);
    setSaveTime(new Date());
    setTimeout(() => setIsDraftSaved(false), 3000);
  };
  
  const handleSubmit = () => {
    if (completionPercentage < 100) {
      alert('请完成所有必填项后再提交');
      return;
    }
    alert('研究报告已成功提交');
  };
  
  if (user?.role !== 'student') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">只有学生可以访问研究报告提交系统</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">提交研究报告</CardTitle>
          <Badge variant="destructive" className="text-sm">
            <Clock className="w-4 h-4 mr-1" />
            截止: {timeRemaining}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">报告结构（必填项标*）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map(section => (
                <div key={section.id}>
                  <div
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSectionEdit(section.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">{section.id}.</span>
                      <span className="font-medium">
                        {section.title}
                        {section.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(section.status)}
                        <span className="text-sm text-gray-500">{getStatusText(section.status)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {section.wordCount > 0 && (
                        <span className="text-sm text-gray-500">{section.wordCount}字</span>
                      )}
                      {section.id === '7' && (
                        <Badge variant="outline" className="text-sm">
                          {referenceCount}/10条
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {editingSection === section.id && (
                    <div className="mt-3 p-4 border rounded-lg bg-gray-50">
                      <Textarea
                        value={sectionContent[section.id] || ''}
                        onChange={(e) => setSectionContent({
                          ...sectionContent,
                          [section.id]: e.target.value
                        })}
                        placeholder={`请输入${section.title}内容...`}
                        className="min-h-[200px] mb-3"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={handleSectionCancel}>
                          取消
                        </Button>
                        <Button size="sm" onClick={() => handleSectionSave(section.id)}>
                          保存
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">完成度:</span>
              <span className="text-sm text-gray-600">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">字数统计:</span>
              <span className="text-sm text-gray-600">
                {totalWordCount.toLocaleString()} / {requiredWordCount.toLocaleString()}字
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleImportWord}>
              <Upload className="w-4 h-4 mr-2" />
              导入Word
            </Button>
            <Button variant="outline" onClick={handleAutoFormat}>
              <FileText className="w-4 h-4 mr-2" />
              自动排版
            </Button>
            <Button variant="outline" onClick={handleCheckFormat}>
              <AlertCircle className="w-4 h-4 mr-2" />
              检查格式
            </Button>
            <Button variant="outline" onClick={() => setShowVersionHistory(true)}>
              <History className="w-4 h-4 mr-2" />
              版本历史
            </Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              保存草稿
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={completionPercentage < 100}
              className="ml-auto"
            >
              提交
            </Button>
          </div>
          
          {isDraftSaved && saveTime && (
            <div className="text-sm text-green-600 text-center">
              草稿已保存于 {saveTime.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>版本历史</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {versions.map((version) => (
                <Card key={version.id} className="cursor-pointer hover:bg-gray-50" onClick={() => restoreVersion(version)}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{version.version}</h4>
                        <p className="text-sm text-gray-500">
                          {version.timestamp.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          字数: {version.totalWordCount.toLocaleString()}字
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        恢复此版本
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}