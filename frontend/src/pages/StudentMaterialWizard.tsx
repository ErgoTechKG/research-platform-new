import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Download,
  Save,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Bot,
  Github,
  ExternalLink,
  Search,
  Lightbulb,
  X,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  Target
} from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  confidence: number;
  category: string;
  metadata: {
    journal?: string;
    publishDate?: string;
    conference?: string;
    acceptDate?: string;
    projectName?: string;
    githubUrl?: string;
    stars?: number;
    forks?: number;
    codeQuality?: string;
    docCompleteness?: number;
  };
  isHighlight: boolean;
  isRequired?: boolean;
}

interface MaterialCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  files: UploadedFile[];
  supportedFormats: string[];
  maxSize: string;
  suggestions: string[];
}

interface WizardStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
}

const StudentMaterialWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(2); // Start at step 3 (upload files) as shown in UI
  const [selectedCategory, setSelectedCategory] = useState('academic');

  const wizardSteps: WizardStep[] = [
    { id: 'preparation', title: '1.准备工作', status: 'completed' },
    { id: 'classification', title: '2.材料分类', status: 'completed' },
    { id: 'upload', title: '3.上传文件', status: 'current' },
    { id: 'preview', title: '4.预览确认', status: 'pending' },
    { id: 'submit', title: '5.提交完成', status: 'pending' }
  ];

  const [materialCategories, setMaterialCategories] = useState<MaterialCategory[]>([
    {
      id: 'academic',
      name: '学术成果类',
      description: '论文发表、学术会议等',
      required: true,
      completed: true,
      supportedFormats: ['PDF', 'DOC', 'DOCX'],
      maxSize: '20MB',
      suggestions: ['请上传论文全文或录用通知'],
      files: [
        {
          id: '1',
          name: '深度学习算法优化研究.pdf',
          size: '2.3MB',
          type: '学术论文',
          confidence: 95,
          category: 'academic',
          metadata: {
            journal: 'IEEE Transactions',
            publishDate: '2024年3月'
          },
          isHighlight: true
        },
        {
          id: '2',
          name: '会议论文录用通知.png',
          size: '0.8MB',
          type: '录用通知',
          confidence: 88,
          category: 'academic',
          metadata: {
            conference: 'ICCV 2024',
            acceptDate: '2024年7月'
          },
          isHighlight: false
        }
      ]
    },
    {
      id: 'research',
      name: '科研项目参与',
      description: '项目参与证明、结题报告等',
      required: true,
      completed: false,
      supportedFormats: ['PDF', 'DOC', 'DOCX', 'ZIP'],
      maxSize: '50MB',
      suggestions: ['项目证明、结题报告、参与证明等'],
      files: []
    },
    {
      id: 'technical',
      name: '技术成果',
      description: '开源项目、技术专利等',
      required: false,
      completed: true,
      supportedFormats: ['PDF', 'DOC', 'DOCX', 'URL'],
      maxSize: '20MB',
      suggestions: ['GitHub项目链接、技术专利证书等'],
      files: [
        {
          id: '3',
          name: 'GitHub项目链接',
          size: 'N/A',
          type: 'GitHub项目',
          confidence: 92,
          category: 'technical',
          metadata: {
            githubUrl: 'https://github.com/user/awesome-project',
            stars: 156,
            forks: 23,
            codeQuality: 'A级',
            docCompleteness: 85
          },
          isHighlight: true
        }
      ]
    },
    {
      id: 'awards',
      name: '获奖荣誉',
      description: '竞赛获奖、荣誉证书等',
      required: false,
      completed: false,
      supportedFormats: ['PDF', 'JPG', 'PNG'],
      maxSize: '10MB',
      suggestions: ['获奖证书、荣誉证明等'],
      files: []
    },
    {
      id: 'recommendations',
      name: '推荐材料',
      description: '导师推荐信、专家评价等',
      required: false,
      completed: false,
      supportedFormats: ['PDF', 'DOC', 'DOCX'],
      maxSize: '20MB',
      suggestions: ['导师推荐信、专家评价等'],
      files: []
    }
  ]);

  const [aiSuggestions] = useState([
    { type: 'success', message: '检测到高质量学术论文，建议设为重点材料' },
    { type: 'success', message: 'GitHub项目活跃度良好，技术实力得到体现' },
    { type: 'warning', message: '建议补充项目参与证明材料，提升可信度' },
    { type: 'info', message: '推荐上传导师推荐信，可大幅提升评分' }
  ]);

  const [uploadStats] = useState({
    totalProgress: 60,
    completedCategories: 3,
    totalCategories: 5,
    uploadedFiles: 8,
    totalSize: '15.6MB',
    requiredCompleted: 2,
    requiredTotal: 3,
    highlightFiles: 3,
    aiAccuracy: 94,
    estimatedScore: '82-89',
    improvementPotential: '5-8'
  });

  const handleFileUpload = useCallback((categoryId: string, files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
        type: 'Unknown',
        confidence: 0,
        category: categoryId,
        metadata: {},
        isHighlight: false
      };

      // Simulate AI recognition
      setTimeout(() => {
        setMaterialCategories(prev => 
          prev.map(cat => 
            cat.id === categoryId 
              ? { 
                  ...cat, 
                  files: [...cat.files, { 
                    ...newFile, 
                    type: 'AI识别中...', 
                    confidence: Math.floor(Math.random() * 20) + 80 
                  }] 
                }
              : cat
          )
        );
      }, 1000);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileUpload(categoryId, files);
  }, [handleFileUpload]);

  const toggleHighlight = (categoryId: string, fileId: string) => {
    setMaterialCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              files: cat.files.map(file =>
                file.id === fileId
                  ? { ...file, isHighlight: !file.isHighlight }
                  : file
              )
            }
          : cat
      )
    );
  };

  const deleteFile = (categoryId: string, fileId: string) => {
    setMaterialCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              files: cat.files.filter(file => file.id !== fileId)
            }
          : cat
      )
    );
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'current':
        return '🔵';
      case 'pending':
        return '⭕';
      default:
        return '⭕';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const currentCategory = materialCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Upload className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  综合素质评价 - 材料上传向导
                </h1>
                <p className="text-gray-600 mt-1">
                  通过智能向导，轻松上传评价材料
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                帮助指南
              </Button>
            </div>
          </div>
        </div>

        {/* Progress Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {wizardSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStepIcon(step.status)}</span>
                    <span className={`font-medium ${
                      step.status === 'current' ? 'text-blue-600' : 
                      step.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Upload Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  第3步：上传文件
                </CardTitle>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span>📋</span>
                  当前分类: {currentCategory?.name} ({materialCategories.filter(c => c.completed).length}/{materialCategories.length}完成)
                </p>
              </CardHeader>
              <CardContent>
                {/* Category Tabs */}
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    {materialCategories.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="relative"
                      >
                        {category.name}
                        {category.required && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {materialCategories.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="space-y-4">
                      {/* Upload Area */}
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, category.id)}
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          📄 拖拽文件到此区域，或 
                          <Button 
                            variant="outline" 
                            className="ml-2"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = category.supportedFormats.map(f => `.${f.toLowerCase()}`).join(',');
                              input.onchange = (e) => {
                                const target = e.target as HTMLInputElement;
                                handleFileUpload(category.id, target.files);
                              };
                              input.click();
                            }}
                          >
                            📎 选择文件
                          </Button>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          📋 支持格式: {category.supportedFormats.join(', ')} (最大{category.maxSize})
                        </p>
                        <p className="text-sm text-blue-600">
                          💡 建议: {category.suggestions.join('、')}
                        </p>
                        {category.required && category.files.length === 0 && (
                          <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              ⚠️ 此类别为必填项，请至少上传一个文件
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Uploaded Files */}
                      {category.files.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium">✅ 已上传文件:</h4>
                          {category.files.map((file) => (
                            <Card key={file.id} className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 mt-1" />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{file.name}</span>
                                        <span className="text-sm text-gray-500">({file.size})</span>
                                        {file.isHighlight && (
                                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                                            ⭐ 重点
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Bot className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm">
                                          AI识别: {file.type} | 📊 置信度: {file.confidence}%
                                        </span>
                                      </div>
                                      {file.metadata.journal && (
                                        <p className="text-sm text-gray-600">
                                          📝 期刊: {file.metadata.journal} | 📅 发表时间: {file.metadata.publishDate}
                                        </p>
                                      )}
                                      {file.metadata.conference && (
                                        <p className="text-sm text-gray-600">
                                          📝 会议: {file.metadata.conference} | 📅 录用时间: {file.metadata.acceptDate}
                                        </p>
                                      )}
                                      {file.metadata.githubUrl && (
                                        <div className="space-y-1">
                                          <p className="text-sm text-gray-600">
                                            🔗 {file.metadata.githubUrl}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            ⭐ Stars: {file.metadata.stars} | 🍴 Forks: {file.metadata.forks}
                                          </p>
                                          <p className="text-sm text-gray-600">
                                            📊 代码质量: {file.metadata.codeQuality} | 📝 文档完整度: {file.metadata.docCompleteness}%
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {file.metadata.githubUrl ? '访问' : '预览'}
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                                    <Edit className="h-3 w-3" />
                                    编辑信息
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="flex items-center gap-1"
                                    onClick={() => deleteFile(category.id, file.id)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    删除
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant={file.isHighlight ? "default" : "outline"}
                                    className="flex items-center gap-1"
                                    onClick={() => toggleHighlight(category.id, file.id)}
                                  >
                                    <Star className="h-3 w-3" />
                                    设为重点
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Suggestions and Progress */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  智能检测反馈
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-medium">🤖 AI助手建议:</h4>
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {getSuggestionIcon(suggestion.type)}
                      <p className="text-sm text-gray-700">{suggestion.message}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    深度分析
                  </Button>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" />
                    获取更多建议
                  </Button>
                  <Button size="sm" variant="ghost" className="flex items-center gap-1">
                    <X className="h-3 w-3" />
                    忽略建议
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upload Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  上传进度与统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>📊 总体进度:</span>
                    <span>{uploadStats.totalProgress}% ({uploadStats.completedCategories}/{uploadStats.totalCategories}类别已完成)</span>
                  </div>
                  <Progress value={uploadStats.totalProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">📈 材料统计:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>• 已上传文件:</span>
                      <span>{uploadStats.uploadedFiles}个 (总计{uploadStats.totalSize})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 必填项完成:</span>
                      <span>{uploadStats.requiredCompleted}/{uploadStats.requiredTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 重点材料:</span>
                      <span>{uploadStats.highlightFiles}个</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• AI识别准确率:</span>
                      <span>{uploadStats.aiAccuracy}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">🎯 预计评分: {uploadStats.estimatedScore}分 (基于当前材料)</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    💡 完成剩余必填项预计可提升{uploadStats.improvementPotential}分
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Batch Operations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  批量操作工具
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  批量下载已上传文件
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  导出材料清单
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  保存当前进度
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bot className="h-4 w-4 mr-2" />
                  AI智能整理
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            上一步
          </Button>
          <Button 
            className="flex items-center gap-2"
            disabled={uploadStats.requiredCompleted < uploadStats.requiredTotal}
          >
            下一步
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentMaterialWizard;