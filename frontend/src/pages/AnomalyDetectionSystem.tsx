import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  FileText,
  Filter,
  Download,
  RefreshCw,
  Clock,
  User
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Anomaly {
  id: string;
  studentId: string;
  studentName: string;
  type: 'high_score' | 'dimension_variance' | 'missing_data' | 'sudden_change' | 'outlier';
  severity: 'critical' | 'high' | 'medium' | 'low';
  dimension: string;
  score: number;
  expectedRange: { min: number; max: number };
  deviation: number;
  cause: string;
  suggestion: string;
  detectedAt: Date;
  status: 'pending' | 'reviewing' | 'resolved' | 'false_positive';
  reviewer?: string;
  reviewNote?: string;
}

interface AnomalyStatistics {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
  resolutionRate: number;
  averageResolutionTime: number;
}

const AnomalyDetectionSystem: React.FC = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [filteredAnomalies, setFilteredAnomalies] = useState<Anomaly[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statistics, setStatistics] = useState<AnomalyStatistics>({
    total: 0,
    byType: {},
    bySeverity: {},
    byStatus: {},
    resolutionRate: 0,
    averageResolutionTime: 0
  });

  // Mock data generation
  useEffect(() => {
    const mockAnomalies: Anomaly[] = [
      {
        id: '1',
        studentId: 'S001',
        studentName: '王某某',
        type: 'high_score',
        severity: 'critical',
        dimension: '科技创新',
        score: 98,
        expectedRange: { min: 60, max: 95 },
        deviation: 3,
        cause: '单项得分异常高，超出预期范围',
        suggestion: '请核查该学生科技创新项目的真实性和评分标准',
        detectedAt: new Date('2025-08-01'),
        status: 'pending'
      },
      {
        id: '2',
        studentId: 'S002',
        studentName: '李某某',
        type: 'dimension_variance',
        severity: 'high',
        dimension: '全部维度',
        score: 75,
        expectedRange: { min: 70, max: 85 },
        deviation: 35,
        cause: '各维度分数差异过大（最高95，最低60）',
        suggestion: '建议复核各维度评分，确保评分标准一致',
        detectedAt: new Date('2025-08-01'),
        status: 'reviewing',
        reviewer: '张老师'
      },
      {
        id: '3',
        studentId: 'S003',
        studentName: '张某某',
        type: 'missing_data',
        severity: 'high',
        dimension: '科研推进',
        score: 0,
        expectedRange: { min: 60, max: 90 },
        deviation: -60,
        cause: '缺少必要的评分数据',
        suggestion: '请联系相关导师补充科研推进评分',
        detectedAt: new Date('2025-07-30'),
        status: 'resolved',
        reviewer: '李老师',
        reviewNote: '已补充评分'
      },
      {
        id: '4',
        studentId: 'S004',
        studentName: '刘某某',
        type: 'sudden_change',
        severity: 'medium',
        dimension: '课程成绩',
        score: 95,
        expectedRange: { min: 70, max: 80 },
        deviation: 15,
        cause: '相比历史成绩有突然大幅提升',
        suggestion: '核查是否有特殊原因导致成绩提升',
        detectedAt: new Date('2025-07-29'),
        status: 'false_positive',
        reviewer: '王老师',
        reviewNote: '学生参加了暑期强化班，成绩提升合理'
      },
      {
        id: '5',
        studentId: 'S005',
        studentName: '陈某某',
        type: 'outlier',
        severity: 'low',
        dimension: '思想品德',
        score: 65,
        expectedRange: { min: 75, max: 95 },
        deviation: -10,
        cause: '分数低于同组平均值2个标准差',
        suggestion: '检查是否有遗漏的加分项',
        detectedAt: new Date('2025-08-02'),
        status: 'pending'
      }
    ];

    setAnomalies(mockAnomalies);
    setFilteredAnomalies(mockAnomalies);
    calculateStatistics(mockAnomalies);
  }, []);

  // Filter anomalies based on selections
  useEffect(() => {
    let filtered = anomalies;

    if (selectedType !== 'all') {
      filtered = filtered.filter(a => a.type === selectedType);
    }
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(a => a.severity === selectedSeverity);
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }

    setFilteredAnomalies(filtered);
  }, [anomalies, selectedType, selectedSeverity, selectedStatus]);

  const calculateStatistics = (anomaliesList: Anomaly[]) => {
    const stats: AnomalyStatistics = {
      total: anomaliesList.length,
      byType: {},
      bySeverity: {},
      byStatus: {},
      resolutionRate: 0,
      averageResolutionTime: 0
    };

    anomaliesList.forEach(anomaly => {
      // Count by type
      stats.byType[anomaly.type] = (stats.byType[anomaly.type] || 0) + 1;
      // Count by severity
      stats.bySeverity[anomaly.severity] = (stats.bySeverity[anomaly.severity] || 0) + 1;
      // Count by status
      stats.byStatus[anomaly.status] = (stats.byStatus[anomaly.status] || 0) + 1;
    });

    const resolved = anomaliesList.filter(a => a.status === 'resolved' || a.status === 'false_positive').length;
    stats.resolutionRate = anomaliesList.length > 0 ? (resolved / anomaliesList.length) * 100 : 0;
    stats.averageResolutionTime = 48; // Mock: 48 hours average

    setStatistics(stats);
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    alert('异常检测分析完成！发现5个新的异常情况。');
  };

  const handleUpdateStatus = (anomalyId: string, newStatus: Anomaly['status']) => {
    setAnomalies(prev => prev.map(a => 
      a.id === anomalyId ? { ...a, status: newStatus, reviewer: '当前用户' } : a
    ));
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      high_score: '异常高分',
      dimension_variance: '维度差异',
      missing_data: '数据缺失',
      sudden_change: '突变异常',
      outlier: '离群值'
    };
    return labels[type] || type;
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'warning',
      low: 'secondary'
    };
    return colors[severity] || 'default';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'false_positive':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'reviewing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      statistics,
      anomalies: filteredAnomalies,
      filters: { type: selectedType, severity: selectedSeverity, status: selectedStatus }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anomaly-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">异常检测系统</h1>
        <div className="space-x-2">
          <Button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            运行分析
          </Button>
          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            导出报告
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">总异常数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              待处理: {statistics.byStatus['pending'] || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">严重程度分布</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-red-600">严重</span>
                <span>{statistics.bySeverity['critical'] || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-orange-600">高</span>
                <span>{statistics.bySeverity['high'] || 0}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-yellow-600">中</span>
                <span>{statistics.bySeverity['medium'] || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">解决率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.resolutionRate.toFixed(1)}%</div>
            <Progress value={statistics.resolutionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">平均处理时间</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageResolutionTime}h</div>
            <p className="text-xs text-muted-foreground">较上周 -12%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            筛选条件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">异常类型</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="high_score">异常高分</SelectItem>
                  <SelectItem value="dimension_variance">维度差异</SelectItem>
                  <SelectItem value="missing_data">数据缺失</SelectItem>
                  <SelectItem value="sudden_change">突变异常</SelectItem>
                  <SelectItem value="outlier">离群值</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">严重程度</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等级</SelectItem>
                  <SelectItem value="critical">严重</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">处理状态</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="reviewing">审核中</SelectItem>
                  <SelectItem value="resolved">已解决</SelectItem>
                  <SelectItem value="false_positive">误报</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly List */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">异常列表</TabsTrigger>
          <TabsTrigger value="analysis">原因分析</TabsTrigger>
          <TabsTrigger value="trends">趋势图表</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredAnomalies.map((anomaly) => (
            <Card key={anomaly.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(anomaly.status)}
                      <h3 className="font-semibold text-lg">{anomaly.studentName}</h3>
                      <Badge variant={getSeverityColor(anomaly.severity) as any}>
                        {anomaly.severity === 'critical' ? '严重' : 
                         anomaly.severity === 'high' ? '高' :
                         anomaly.severity === 'medium' ? '中' : '低'}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(anomaly.type)}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">维度：</span>{anomaly.dimension}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">分数：</span>
                          <span className="text-red-600 font-bold">{anomaly.score}</span>
                          <span className="text-gray-500"> (预期: {anomaly.expectedRange.min}-{anomaly.expectedRange.max})</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">偏差：</span>
                          {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">检测时间：</span>
                          {anomaly.detectedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>原因：</strong>{anomaly.cause}
                      </AlertDescription>
                    </Alert>

                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-sm">
                        <Activity className="inline h-4 w-4 mr-1 text-blue-600" />
                        <span className="font-medium">建议：</span>{anomaly.suggestion}
                      </p>
                    </div>

                    {anomaly.reviewer && (
                      <div className="text-sm text-gray-600 mb-2">
                        <User className="inline h-4 w-4 mr-1" />
                        <span className="font-medium">处理人：</span>{anomaly.reviewer}
                        {anomaly.reviewNote && <span> - {anomaly.reviewNote}</span>}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 space-y-2">
                    {anomaly.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(anomaly.id, 'reviewing')}
                        >
                          开始审核
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateStatus(anomaly.id, 'false_positive')}
                        >
                          标记误报
                        </Button>
                      </>
                    )}
                    {anomaly.status === 'reviewing' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(anomaly.id, 'resolved')}
                        >
                          标记解决
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                        >
                          添加备注
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      查看详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>异常原因分布分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">评分标准不一致</span>
                    <span className="text-sm text-gray-500">35%</span>
                  </div>
                  <Progress value={35} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">数据录入错误</span>
                    <span className="text-sm text-gray-500">25%</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">系统计算异常</span>
                    <span className="text-sm text-gray-500">20%</span>
                  </div>
                  <Progress value={20} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">特殊情况</span>
                    <span className="text-sm text-gray-500">15%</span>
                  </div>
                  <Progress value={15} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">其他原因</span>
                    <span className="text-sm text-gray-500">5%</span>
                  </div>
                  <Progress value={5} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>改进建议</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertDescription>
                    <strong>1. 统一评分标准：</strong>建议制定更详细的评分细则，减少主观判断差异
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <strong>2. 加强数据验证：</strong>在数据录入时增加实时验证，减少录入错误
                  </AlertDescription>
                </Alert>
                <Alert>
                  <AlertDescription>
                    <strong>3. 定期培训：</strong>对评分人员进行定期培训，确保理解评分标准
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>异常检测趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-medium">异常数量呈下降趋势</p>
                  <p className="text-sm text-gray-500">较上月减少23%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>按时间分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>本周</span>
                    <span className="font-medium">12个</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>上周</span>
                    <span className="font-medium">18个</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>本月</span>
                    <span className="font-medium">45个</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>上月</span>
                    <span className="font-medium">58个</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>按维度分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>科技创新</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>课程成绩</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>科研推进</span>
                    <span className="font-medium">23%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>思想品德</span>
                    <span className="font-medium">24%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnomalyDetectionSystem;