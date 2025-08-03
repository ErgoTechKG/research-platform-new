import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Download, 
  FileText, 
  BarChart3, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Calendar,
  Settings,
  Eye,
  Edit3
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  status: 'connected' | 'error' | 'collecting';
  progress: number;
  lastUpdate: string;
  recordCount: number;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: string[];
  language: 'zh' | 'en' | 'both';
  format: string[];
}

interface GenerationProgress {
  phase: string;
  progress: number;
  message: string;
  estimatedTime: string;
}

const AnnualReportGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('collection');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [language, setLanguage] = useState<'zh' | 'en' | 'both'>('zh');
  const [autoCollecting, setAutoCollecting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress | null>(null);

  // Mock data for data sources
  const [dataSources] = useState<DataSource[]>([
    {
      id: 'academic',
      name: '学术数据系统',
      status: 'connected',
      progress: 100,
      lastUpdate: '2024-01-15 14:30',
      recordCount: 1285
    },
    {
      id: 'student',
      name: '学生信息系统',
      status: 'collecting',
      progress: 75,
      lastUpdate: '2024-01-15 14:25',
      recordCount: 892
    },
    {
      id: 'research',
      name: '科研管理系统',
      status: 'connected',
      progress: 100,
      lastUpdate: '2024-01-15 14:20',
      recordCount: 347
    },
    {
      id: 'finance',
      name: '财务管理系统',
      status: 'error',
      progress: 0,
      lastUpdate: '2024-01-15 12:00',
      recordCount: 0
    }
  ]);

  // Mock data for report templates
  const [reportTemplates] = useState<ReportTemplate[]>([
    {
      id: 'comprehensive',
      name: '年度综合报告',
      description: '完整的年度工作总结和数据分析报告',
      category: '综合报告',
      sections: ['执行摘要', '学术成果', '学生发展', '财务状况', '未来规划'],
      language: 'both',
      format: ['PDF', 'PPT', 'Word']
    },
    {
      id: 'performance',
      name: '绩效分析报告',
      description: '专注于关键绩效指标的分析报告',
      category: '专项报告',
      sections: ['KPI概览', '趋势分析', '对比分析', '改进建议'],
      language: 'both',
      format: ['PDF', 'PPT']
    },
    {
      id: 'executive',
      name: '执行摘要报告',
      description: '面向高层管理的精简报告',
      category: '摘要报告',
      sections: ['核心数据', '重要成果', '关键挑战', '战略建议'],
      language: 'both',
      format: ['PDF', 'PPT']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'collecting': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'collecting': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleAutoCollection = async () => {
    setAutoCollecting(true);
    // Simulate auto collection process
    setTimeout(() => {
      setAutoCollecting(false);
    }, 3000);
  };

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;
    
    setGenerating(true);
    const phases = [
      { phase: 'data_validation', message: '验证数据完整性...', progress: 20, time: '2分钟' },
      { phase: 'content_generation', message: '生成报告内容...', progress: 50, time: '3分钟' },
      { phase: 'formatting', message: '格式化报告...', progress: 75, time: '1分钟' },
      { phase: 'finalization', message: '完成报告生成...', progress: 100, time: '30秒' }
    ];

    for (let i = 0; i < phases.length; i++) {
      setGenerationProgress({
        ...phases[i],
        estimatedTime: phases[i].time
      });
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setGenerating(false);
    setGenerationProgress(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">年度报告生成器</h1>
          <p className="text-gray-600 mt-2">一键生成专业的年度报告，支持多格式导出和双语版本</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Globe className="h-4 w-4 mr-1" />
          智能报告系统
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collection">数据收集</TabsTrigger>
          <TabsTrigger value="template">模板选择</TabsTrigger>
          <TabsTrigger value="configuration">配置设置</TabsTrigger>
          <TabsTrigger value="generation">生成报告</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  自动数据收集
                </CardTitle>
                <Button 
                  onClick={handleAutoCollection}
                  disabled={autoCollecting}
                  className="flex items-center"
                >
                  {autoCollecting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {autoCollecting ? '收集中...' : '开始收集'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dataSources.map((source) => (
                  <Card key={source.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{source.name}</h3>
                        <Badge className={getStatusColor(source.status)}>
                          {getStatusIcon(source.status)}
                          <span className="ml-1">
                            {source.status === 'connected' ? '已连接' : 
                             source.status === 'collecting' ? '收集中' : '错误'}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>收集进度</span>
                          <span>{source.progress}%</span>
                        </div>
                        <Progress value={source.progress} className="h-2" />
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>记录数: {source.recordCount.toLocaleString()}</span>
                          <span>更新: {source.lastUpdate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  系统将自动整合跨系统数据，并进行智能清洗和验证。完整的数据收集通常需要5-10分钟。
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                报告模板选择
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">报告章节:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {template.sections.map((section, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>支持格式: {template.format.join(', ')}</span>
                          <span>
                            语言: {template.language === 'both' ? '中英双语' : 
                                   template.language === 'zh' ? '中文' : '英文'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  语言设置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>报告语言</Label>
                  <Select value={language} onValueChange={(value: 'zh' | 'en' | 'both') => setLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh">中文</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="both">中英双语</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>自动翻译</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <Label>本地化格式</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label>语言质量检查</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  报告配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="report-title">报告标题</Label>
                  <Input id="report-title" placeholder="输入报告标题" />
                </div>

                <div>
                  <Label htmlFor="report-period">报告期间</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择报告期间" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023年度</SelectItem>
                      <SelectItem value="2023-q4">2023年第四季度</SelectItem>
                      <SelectItem value="custom">自定义期间</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="report-notes">备注信息</Label>
                  <Textarea id="report-notes" placeholder="输入备注信息" rows={3} />
                </div>

                <div className="flex items-center justify-between">
                  <Label>包含敏感数据</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                报告生成
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!generating && !generationProgress ? (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">准备生成报告</h3>
                    <p className="text-gray-600">
                      已选择模板: {selectedTemplate ? reportTemplates.find(t => t.id === selectedTemplate)?.name : '未选择'}
                    </p>
                    <p className="text-gray-600">
                      语言设置: {language === 'both' ? '中英双语' : language === 'zh' ? '中文' : '英文'}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleGenerateReport}
                    disabled={!selectedTemplate}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    开始生成报告
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">正在生成报告...</h3>
                    <p className="text-gray-600">
                      {generationProgress?.message || '准备中...'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>生成进度</span>
                      <span>{generationProgress?.progress || 0}%</span>
                    </div>
                    <Progress value={generationProgress?.progress || 0} className="h-3" />
                    <div className="text-center text-sm text-gray-500">
                      预计剩余时间: {generationProgress?.estimatedTime || '计算中...'}
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Reports */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">已生成的报告</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium">2023年度综合报告 (中文版)</p>
                        <p className="text-sm text-gray-600">生成时间: 2024-01-15 15:30</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        预览
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium">2023年度综合报告 (PPT版)</p>
                        <p className="text-sm text-gray-600">生成时间: 2024-01-15 15:32</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        预览
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnualReportGenerator;