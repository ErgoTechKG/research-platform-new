import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Brain, TrendingUp, AlertTriangle, History, BarChart3, 
  Target, BookOpen, CheckCircle, XCircle, RefreshCw,
  Lightbulb, Users, Calendar, FileText, MessageSquare,
  PieChart, LineChart, Activity, Zap, Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HistoricalScore {
  id: string;
  studentName: string;
  assignmentTitle: string;
  score: number;
  evaluator: string;
  date: string;
  similarity: number;
  comments: string;
}

interface ScoreDistribution {
  range: string;
  count: number;
  percentage: number;
}

interface AnomalyDetection {
  id: string;
  type: 'outlier' | 'inconsistent' | 'clustered';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedScores: string[];
  recommendation: string;
}

interface ScoringPattern {
  evaluatorId: string;
  evaluatorName: string;
  averageScore: number;
  standardDeviation: number;
  totalAssignments: number;
  consistency: number;
}

interface Assignment {
  id: string;
  studentName: string;
  studentId: string;
  assignmentTitle: string;
  submittedAt: string;
  content: string;
  suggestedScore?: number;
  confidence?: number;
}

export default function AIScoringAssistant() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [activeTab, setActiveTab] = useState('historical');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [scoreComment, setScoreComment] = useState('');
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [filterEvaluator, setFilterEvaluator] = useState<string>('all');
  
  // Mock data
  const assignments: Assignment[] = [
    {
      id: '1',
      studentName: '王小明',
      studentId: '2024001',
      assignmentTitle: '实验报告3',
      submittedAt: '2024-10-15 08:30',
      content: '本次实验主要研究了...',
      suggestedScore: 88,
      confidence: 0.85
    },
    {
      id: '2',
      studentName: '李小红',
      studentId: '2024002',
      assignmentTitle: '实验报告3',
      submittedAt: '2024-10-15 09:15',
      content: '通过本次实验，我们深入了解了...',
      suggestedScore: 92,
      confidence: 0.92
    },
    {
      id: '3',
      studentName: '张小华',
      studentId: '2024003',
      assignmentTitle: '实验报告3',
      submittedAt: '2024-10-15 10:20',
      content: '实验过程中遇到了一些问题...',
      suggestedScore: 78,
      confidence: 0.76
    }
  ];
  
  const historicalScores: HistoricalScore[] = [
    {
      id: '1',
      studentName: '刘小刚',
      assignmentTitle: '实验报告3',
      score: 89,
      evaluator: '张教授',
      date: '2024-09-15',
      similarity: 0.85,
      comments: '实验设计合理，数据分析深入，结论准确。'
    },
    {
      id: '2',
      studentName: '陈小美',
      assignmentTitle: '实验报告3',
      score: 92,
      evaluator: '李教授',
      date: '2024-09-10',
      similarity: 0.82,
      comments: '优秀的实验报告，理论结合实践，思路清晰。'
    },
    {
      id: '3',
      studentName: '赵小强',
      assignmentTitle: '实验报告3',
      score: 85,
      evaluator: '王教授',
      date: '2024-09-08',
      similarity: 0.78,
      comments: '实验完成度良好，但分析部分可以更深入。'
    },
    {
      id: '4',
      studentName: '钱小花',
      assignmentTitle: '实验报告3',
      score: 76,
      evaluator: '张教授',
      date: '2024-09-05',
      similarity: 0.71,
      comments: '基本完成实验要求，但存在一些理解偏差。'
    }
  ];
  
  const scoreDistribution: ScoreDistribution[] = [
    { range: '90-100', count: 8, percentage: 20 },
    { range: '80-89', count: 18, percentage: 45 },
    { range: '70-79', count: 10, percentage: 25 },
    { range: '60-69', count: 3, percentage: 7.5 },
    { range: '0-59', count: 1, percentage: 2.5 }
  ];
  
  const anomalies: AnomalyDetection[] = [
    {
      id: '1',
      type: 'outlier',
      severity: 'medium',
      description: '张小华的分数明显低于同类作业平均水平',
      affectedScores: ['3'],
      recommendation: '建议重新检查评分标准或作业质量'
    },
    {
      id: '2',
      type: 'inconsistent',
      severity: 'low',
      description: '当前批次评分范围较为集中，可能存在评分标准偏严',
      affectedScores: ['1', '2'],
      recommendation: '参考历史数据调整评分尺度'
    }
  ];
  
  const scoringPatterns: ScoringPattern[] = [
    {
      evaluatorId: '1',
      evaluatorName: '张教授',
      averageScore: 84.5,
      standardDeviation: 8.2,
      totalAssignments: 45,
      consistency: 0.87
    },
    {
      evaluatorId: '2',
      evaluatorName: '李教授',
      averageScore: 87.2,
      standardDeviation: 6.8,
      totalAssignments: 38,
      consistency: 0.92
    },
    {
      evaluatorId: '3',
      evaluatorName: '王教授',
      averageScore: 82.1,
      standardDeviation: 9.5,
      totalAssignments: 52,
      consistency: 0.78
    }
  ];
  
  const selectedAssignmentData = assignments.find(a => a.id === selectedAssignment);
  
  // Filter historical scores based on similarity
  const filteredHistoricalScores = historicalScores
    .filter(score => {
      if (filterCourse !== 'all' && !score.assignmentTitle.includes(filterCourse)) return false;
      if (filterEvaluator !== 'all' && score.evaluator !== filterEvaluator) return false;
      return true;
    })
    .sort((a, b) => b.similarity - a.similarity);
  
  // Analyze assignment
  const analyzeAssignment = async () => {
    if (!selectedAssignment) return;
    
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setShowSuggestions(true);
  };
  
  // Get suggestion color based on confidence
  const getSuggestionColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-600';
    if (confidence >= 0.6) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  // Get anomaly severity color
  const getAnomalySeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <Brain className="w-6 h-6 text-blue-600" />
            <span>AI评分助手</span>
          </h1>
          <p className="text-gray-600 mt-1">智能评分辅助，提高评分一致性和准确性</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/batch-scoring')}
          >
            批量评分
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/multidimensional-scoring')}
          >
            单个评分
          </Button>
        </div>
      </div>
      
      {/* Assignment Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>选择作业</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label>待评分作业:</Label>
            <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="选择要评分的作业" />
              </SelectTrigger>
              <SelectContent>
                {assignments.map(assignment => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.studentName} - {assignment.assignmentTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={analyzeAssignment}
              disabled={!selectedAssignment || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  AI分析
                </>
              )}
            </Button>
          </div>
          
          {selectedAssignmentData && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{selectedAssignmentData.studentName} ({selectedAssignmentData.studentId})</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAssignmentData.assignmentTitle} - 提交时间: {selectedAssignmentData.submittedAt}
                  </p>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {selectedAssignmentData.content}
                  </p>
                </div>
                {selectedAssignmentData.suggestedScore && showSuggestions && (
                  <div className="text-right">
                    <Badge className={getSuggestionColor(selectedAssignmentData.confidence || 0)}>
                      AI建议: {selectedAssignmentData.suggestedScore}分
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      置信度: {((selectedAssignmentData.confidence || 0) * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* AI Assistant Tabs */}
      {selectedAssignment && (
        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="historical" className="flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>历史参考</span>
                </TabsTrigger>
                <TabsTrigger value="distribution" className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>分布分析</span>
                </TabsTrigger>
                <TabsTrigger value="anomaly" className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>异常检测</span>
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>智能建议</span>
                </TabsTrigger>
                <TabsTrigger value="consistency" className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>一致性检查</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Historical Reference */}
              <TabsContent value="historical" className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">相似作业历史评分</h3>
                  <div className="flex items-center space-x-2">
                    <Select value={filterEvaluator} onValueChange={setFilterEvaluator}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有评委</SelectItem>
                        <SelectItem value="张教授">张教授</SelectItem>
                        <SelectItem value="李教授">李教授</SelectItem>
                        <SelectItem value="王教授">王教授</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {filteredHistoricalScores.map(score => (
                    <div key={score.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">{score.studentName}</span>
                            <Badge variant="outline">{score.assignmentTitle}</Badge>
                            <span className="text-sm text-gray-500">{score.evaluator}</span>
                            <span className="text-sm text-gray-500">{score.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{score.comments}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="mb-1">
                            {score.score}分
                          </Badge>
                          <div className="text-xs text-gray-500">
                            相似度: {(score.similarity * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              {/* Score Distribution */}
              <TabsContent value="distribution" className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">当前批次评分分布</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      导出报告
                    </Button>
                    <Select defaultValue="current">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">当前批次</SelectItem>
                        <SelectItem value="semester">本学期</SelectItem>
                        <SelectItem value="historical">历史数据</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Distribution Chart */}
                  <div className="xl:col-span-2 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">分数段分布图</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {scoreDistribution.map(dist => (
                            <div key={dist.range} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{dist.range}分</span>
                                <span className="text-sm text-gray-600">
                                  {dist.count}人 ({dist.percentage}%)
                                </span>
                              </div>
                              <div className="relative">
                                <Progress value={dist.percentage} className="h-3" />
                                <div 
                                  className="absolute top-0 left-0 h-3 bg-blue-600 rounded-sm transition-all duration-500"
                                  style={{ width: `${dist.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">趋势对比</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span>与上批次对比</span>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-600">+2.1分</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>与学期平均对比</span>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <span className="text-blue-600">+0.8分</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>标准差变化</span>
                            <div className="flex items-center space-x-2">
                              <Activity className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-600">-1.2</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Statistics Panel */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">统计摘要</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">84.2</div>
                            <div className="text-xs text-gray-500">平均分</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">96</div>
                            <div className="text-xs text-gray-500">最高分</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">58</div>
                            <div className="text-xs text-gray-500">最低分</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">7.8</div>
                            <div className="text-xs text-gray-500">标准差</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex justify-between">
                            <span className="text-sm">评分数量:</span>
                            <span className="font-medium">40份</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">及格率:</span>
                            <span className="font-medium">97.5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">优秀率:</span>
                            <span className="font-medium">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">良好率:</span>
                            <span className="font-medium">45%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">质量评估</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">分布合理性</span>
                            <Badge variant="default" className="bg-green-600">优秀</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">区分度</span>
                            <Badge variant="default" className="bg-blue-600">良好</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">一致性</span>
                            <Badge variant="default" className="bg-green-600">高</Badge>
                          </div>
                        </div>
                        
                        <Alert className="mt-4">
                          <TrendingUp className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            当前批次分数分布较为正常，集中在80-89分段，符合一般评分规律。建议继续保持当前评分标准。
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Anomaly Detection */}
              <TabsContent value="anomaly" className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">异常评分检测</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新检测
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有异常</SelectItem>
                        <SelectItem value="high">高风险</SelectItem>
                        <SelectItem value="medium">中风险</SelectItem>
                        <SelectItem value="low">低风险</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">检测到异常</p>
                          <p className="text-2xl font-bold text-red-600">2</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">自动修正建议</p>
                          <p className="text-2xl font-bold text-blue-600">3</p>
                        </div>
                        <Lightbulb className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">检测精度</p>
                          <p className="text-2xl font-bold text-green-600">94%</p>
                        </div>
                        <Target className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-4">
                  {anomalies.map(anomaly => (
                    <Card key={anomaly.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {anomaly.type === 'outlier' && <TrendingUp className="w-5 h-5 text-red-600" />}
                            {anomaly.type === 'inconsistent' && <Activity className="w-5 h-5 text-yellow-600" />}
                            {anomaly.type === 'clustered' && <BarChart3 className="w-5 h-5 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{anomaly.description}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  影响评分: {anomaly.affectedScores.length}个
                                </p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  anomaly.severity === 'high' 
                                    ? 'border-red-200 text-red-700 bg-red-50' 
                                    : anomaly.severity === 'medium' 
                                    ? 'border-yellow-200 text-yellow-700 bg-yellow-50'
                                    : 'border-blue-200 text-blue-700 bg-blue-50'
                                }`}
                              >
                                {anomaly.severity === 'high' ? '高' : anomaly.severity === 'medium' ? '中' : '低'}风险
                              </Badge>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <p className="text-sm"><strong>建议:</strong> {anomaly.recommendation}</p>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">
                                检测类型: {
                                  anomaly.type === 'outlier' ? '异常值' :
                                  anomaly.type === 'inconsistent' ? '不一致' : '聚集性'
                                }
                              </span>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  查看详情
                                </Button>
                                <Button variant="outline" size="sm">
                                  应用建议
                                </Button>
                                <Button variant="outline" size="sm">
                                  忽略
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {anomalies.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">检测结果良好</h3>
                      <p className="text-gray-600">
                        当前未检测到明显的评分异常，评分质量良好。系统将持续监控评分质量。
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">检测设置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">异常值阈值</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strict">严格 (±1.5σ)</SelectItem>
                            <SelectItem value="medium">中等 (±2σ)</SelectItem>
                            <SelectItem value="loose">宽松 (±2.5σ)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">最小样本数</Label>
                        <Select defaultValue="10">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5个</SelectItem>
                            <SelectItem value="10">10个</SelectItem>
                            <SelectItem value="20">20个</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">检测频率</Label>
                        <Select defaultValue="realtime">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">实时</SelectItem>
                            <SelectItem value="batch">批次完成后</SelectItem>
                            <SelectItem value="manual">手动触发</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* AI Suggestions */}
              <TabsContent value="suggestions" className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">AI评分建议</h3>
                  {showSuggestions && selectedAssignmentData && (
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        重新分析
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        导出建议
                      </Button>
                    </div>
                  )}
                </div>
                
                {showSuggestions && selectedAssignmentData ? (
                  <div className="space-y-6">
                    {/* Main Suggestion Panel */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                      <Card className="xl:col-span-2">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Brain className="w-5 h-5 text-blue-600" />
                            <span>智能评分分析</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-center border-r border-gray-200 pr-6">
                              <div className="text-4xl font-bold text-blue-600 mb-2">
                                {selectedAssignmentData.suggestedScore}
                              </div>
                              <p className="text-sm text-gray-600 mb-3">AI建议分数</p>
                              <Badge className={getSuggestionColor(selectedAssignmentData.confidence || 0)}>
                                置信度: {((selectedAssignmentData.confidence || 0) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">建议区间:</span>
                                <span className="font-medium">85-92分</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">历史相似度:</span>
                                <span className="font-medium">87%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">质量评估:</span>
                                <Badge variant="outline" className="bg-green-50">良好</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">难度系数:</span>
                                <span className="font-medium">0.75</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">评分依据分析</h4>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">内容完整性: 优秀 (25/25分)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">技术准确性: 良好 (22/25分)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm">分析深度: 中等 (18/25分)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">表达清晰度: 良好 (23/25分)</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4" />
                              <span>对比分析</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">相似作业平均分</p>
                              <p className="text-xl font-bold text-gray-700">86.4分</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">班级平均分</p>
                              <p className="text-xl font-bold text-gray-700">84.2分</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500 mb-1">排名预估</p>
                              <p className="text-xl font-bold text-blue-600">前25%</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center space-x-2">
                              <Activity className="w-4 h-4" />
                              <span>风险评估</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">过高风险</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700">低</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">过低风险</span>
                                <Badge variant="outline" className="bg-green-50 text-green-700">低</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm">争议可能</span>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">中</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    {/* Detailed Suggestions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>智能评语建议</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="border rounded-lg p-3 bg-green-50">
                              <h4 className="font-medium text-green-800 mb-2">优点 (可直接使用)</h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                <li>• 实验设计思路清晰，符合科学研究规范</li>
                                <li>• 数据收集和处理方法得当，结果可信</li>
                                <li>• 图表制作规范，数据可视化效果良好</li>
                              </ul>
                            </div>
                            
                            <div className="border rounded-lg p-3 bg-yellow-50">
                              <h4 className="font-medium text-yellow-800 mb-2">改进建议 (需要调整)</h4>
                              <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• 结论部分的分析深度有待提升</li>
                                <li>• 建议增加与理论知识的联系</li>
                                <li>• 讨论部分可以更加深入</li>
                              </ul>
                            </div>
                            
                            <div className="border rounded-lg p-3 bg-blue-50">
                              <h4 className="font-medium text-blue-800 mb-2">综合评语模板</h4>
                              <p className="text-sm text-blue-700">
                                "该实验报告完成度良好，实验设计合理，数据分析方法得当。建议在结论部分加强理论分析，提升报告的学术深度。整体表现符合课程要求。"
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4" />
                            <span>评分建议与标准</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-3">维度评分建议</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">实验设计 (25%)</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={100} className="w-16 h-2" />
                                    <span className="text-sm font-medium">25分</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">数据分析 (25%)</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={88} className="w-16 h-2" />
                                    <span className="text-sm font-medium">22分</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">结论讨论 (25%)</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={72} className="w-16 h-2" />
                                    <span className="text-sm font-medium">18分</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm">报告质量 (25%)</span>
                                  <div className="flex items-center space-x-2">
                                    <Progress value={92} className="w-16 h-2" />
                                    <span className="text-sm font-medium">23分</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">历史对比参考</h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>• 同类型作业平均分: 86.4分</p>
                                <p>• 您的历史平均分: 84.8分</p>
                                <p>• 标准差范围: ±7.2分</p>
                                <p>• 建议调整: 无需调整</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Alert>
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        AI建议基于历史数据分析和作业质量评估，建议结合具体评分标准和教学目标进行最终决策。
                        系统置信度为{((selectedAssignmentData.confidence || 0) * 100).toFixed(0)}%，建议谨慎参考。
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">等待AI分析</h3>
                      <p className="text-gray-600 mb-4">
                        请先选择作业并点击"AI分析"获取智能评分建议。
                      </p>
                      <Button variant="outline" disabled={!selectedAssignment}>
                        开始分析
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Consistency Check */}
              <TabsContent value="consistency" className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">评分一致性分析</h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      导出分析报告
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">所有评委</SelectItem>
                        <SelectItem value="semester">本学期</SelectItem>
                        <SelectItem value="course">当前课程</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Overall Consistency Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">总体一致性</p>
                          <p className="text-2xl font-bold text-green-600">87%</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">评分偏差</p>
                          <p className="text-2xl font-bold text-blue-600">±2.1</p>
                        </div>
                        <Activity className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">校准建议</p>
                          <p className="text-2xl font-bold text-yellow-600">3</p>
                        </div>
                        <Target className="w-8 h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">质量评级</p>
                          <p className="text-2xl font-bold text-green-600">A</p>
                        </div>
                        <Star className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Evaluator Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">评委对比分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scoringPatterns.map((pattern, index) => (
                        <div key={pattern.evaluatorId} className="border rounded-lg p-4">
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">{pattern.evaluatorName}</h4>
                              <div className="flex items-center space-x-2">
                                <Progress value={pattern.consistency * 100} className="flex-1 h-2" />
                                <span className="text-sm font-medium">
                                  {(pattern.consistency * 100).toFixed(0)}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">一致性指数</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">平均分</p>
                                <p className="font-medium">{pattern.averageScore}分</p>
                              </div>
                              <div>
                                <p className="text-gray-600">标准差</p>
                                <p className="font-medium">{pattern.standardDeviation}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">评分数量</p>
                                <p className="font-medium">{pattern.totalAssignments}份</p>
                              </div>
                              <div>
                                <p className="text-gray-600">偏差程度</p>
                                <Badge variant="outline" className={
                                  pattern.standardDeviation < 7 ? 'bg-green-50 text-green-700' :
                                  pattern.standardDeviation < 9 ? 'bg-yellow-50 text-yellow-700' :
                                  'bg-red-50 text-red-700'
                                }>
                                  {pattern.standardDeviation < 7 ? '低' :
                                   pattern.standardDeviation < 9 ? '中' : '高'}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                查看详情
                              </Button>
                              {pattern.consistency < 0.8 && (
                                <Button variant="outline" size="sm" className="text-blue-600">
                                  校准建议
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Personal Consistency Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">您的评分模式分析</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">与团队平均的一致性</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={87} className="w-20 h-2" />
                            <span className="text-sm font-medium">87%</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">评分严格程度</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">适中</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">分数分布均匀性</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">良好</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm">时间一致性</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">稳定</Badge>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">历史趋势</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>• 过去3个月一致性提升了5%</p>
                            <p>• 评分标准相对稳定</p>
                            <p>• 与其他评委差异在合理范围内</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">校准建议</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            您的评分模式与团队整体保持良好一致性，建议继续保持当前标准。
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-3">
                          <div className="border rounded-lg p-3 bg-green-50">
                            <h4 className="font-medium text-green-800 mb-1">优势保持</h4>
                            <p className="text-sm text-green-700">
                              评分标准稳定，与历史数据一致性高
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-3 bg-yellow-50">
                            <h4 className="font-medium text-yellow-800 mb-1">改进空间</h4>
                            <p className="text-sm text-yellow-700">
                              可适当参考其他评委的评分标准，进一步提升一致性
                            </p>
                          </div>
                          
                          <div className="border rounded-lg p-3 bg-blue-50">
                            <h4 className="font-medium text-blue-800 mb-1">具体建议</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• 定期参与评分标准校准会议</li>
                              <li>• 关注异常评分的反馈和调整</li>
                              <li>• 保持与其他评委的沟通交流</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            查看校准指南
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            申请校准培训
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Consistency Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">一致性检查设置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">检查频率</Label>
                        <Select defaultValue="realtime">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">实时检查</SelectItem>
                            <SelectItem value="daily">每日检查</SelectItem>
                            <SelectItem value="weekly">每周检查</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">对比基准</Label>
                        <Select defaultValue="team">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="team">团队平均</SelectItem>
                            <SelectItem value="historical">历史数据</SelectItem>
                            <SelectItem value="standard">标准基准</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">警告阈值</Label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strict">严格 (±1σ)</SelectItem>
                            <SelectItem value="medium">中等 (±1.5σ)</SelectItem>
                            <SelectItem value="loose">宽松 (±2σ)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Scoring Panel */}
      {selectedAssignment && showSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>快速评分</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>评分 (0-100)</Label>
                  <Input
                    type="number"
                    value={currentScore}
                    onChange={(e) => setCurrentScore(parseInt(e.target.value) || 0)}
                    placeholder="输入分数"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>评语</Label>
                  <Textarea
                    value={scoreComment}
                    onChange={(e) => setScoreComment(e.target.value)}
                    placeholder="输入评语..."
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2">AI建议参考</h4>
                  <p className="text-sm text-blue-700">
                    建议分数: {selectedAssignmentData?.suggestedScore}分
                  </p>
                  <p className="text-sm text-blue-700">
                    置信度: {((selectedAssignmentData?.confidence || 0) * 100).toFixed(0)}%
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    保存草稿
                  </Button>
                  <Button>
                    确认评分
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}