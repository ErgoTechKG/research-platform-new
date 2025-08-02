import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Download, RefreshCw, AlertTriangle, Users, Award } from 'lucide-react';
import { Progress } from '../components/ui/progress';

interface GradeLevel {
  level: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
}

interface AnomalyStudent {
  id: string;
  name: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
}

interface CalculationRule {
  component: string;
  weight: number;
}

const GradePreview: React.FC = () => {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [selectedAnomalies, setSelectedAnomalies] = useState<string[]>([]);

  // Mock data - in real implementation, this would come from API
  const calculationRules: CalculationRule[] = [
    { component: '思想品德', weight: 20 },
    { component: '课程成绩', weight: 40 },
    { component: '科技创新', weight: 25 },
    { component: '科研推进', weight: 15 }
  ];

  const gradeLevels: GradeLevel[] = [
    { level: 'A级', range: '90-100', count: 15, percentage: 25, color: '#10b981' },
    { level: 'B级', range: '80-89', count: 28, percentage: 47, color: '#3b82f6' },
    { level: 'C级', range: '70-79', count: 12, percentage: 20, color: '#f59e0b' },
    { level: 'D级', range: '60-69', count: 5, percentage: 8, color: '#ef4444' }
  ];

  const anomalies: AnomalyStudent[] = [
    { id: '1', name: '王某某', issue: '科技创新维度异常高(>95)', severity: 'high' },
    { id: '2', name: '李某某', issue: '各维度差异过大(>30分)', severity: 'medium' },
    { id: '3', name: '张某某', issue: '缺少科研推进成绩', severity: 'high' }
  ];

  const totalStudents = gradeLevels.reduce((sum, level) => sum + level.count, 0);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    // Simulate recalculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRecalculating(false);
    alert('成绩重新计算完成！');
  };

  const handleExport = () => {
    // In real implementation, this would trigger file download
    const data = {
      calculationRules,
      gradeLevels,
      anomalies,
      exportTime: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade-preview-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMarkProcessed = (anomalyId: string) => {
    setSelectedAnomalies(prev => 
      prev.includes(anomalyId) 
        ? prev.filter(id => id !== anomalyId)
        : [...prev, anomalyId]
    );
  };

  const getMaxPercentage = () => Math.max(...gradeLevels.map(level => level.percentage));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">综合素质评价 - 成绩核算</h1>
        <div className="space-x-2">
          <Button 
            onClick={handleRecalculate}
            disabled={isRecalculating}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
            重新计算
          </Button>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
        </div>
      </div>

      {/* Calculation Rules Preview */}
      <Card>
        <CardHeader>
          <CardTitle>计算规则预览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-medium text-center">
              {calculationRules.map((rule, index) => (
                <span key={rule.component}>
                  {rule.component}({rule.weight}%)
                  {index < calculationRules.length - 1 ? ' + ' : ' = '}
                </span>
              ))}
              总分(100%)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Distribution Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            成绩分布统计
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalStudents}</div>
                <div className="text-sm text-gray-500">总人数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((gradeLevels[0].count / totalStudents) * 100)}%
                </div>
                <div className="text-sm text-gray-500">优秀率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(((gradeLevels[0].count + gradeLevels[1].count) / totalStudents) * 100)}%
                </div>
                <div className="text-sm text-gray-500">良好以上</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((gradeLevels[3].count / totalStudents) * 100)}%
                </div>
                <div className="text-sm text-gray-500">待提升</div>
              </div>
            </div>

            {/* Visual Chart */}
            <div className="space-y-4">
              {gradeLevels.map((level) => (
                <div key={level.level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium w-12">{level.level}</span>
                      <span className="text-sm text-gray-500">({level.range})</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{level.count}人</span>
                      <span className="text-sm text-gray-500">{level.percentage}%</span>
                    </div>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-8">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full flex items-center justify-center text-white font-medium transition-all duration-500"
                      style={{
                        width: `${(level.percentage / getMaxPercentage()) * 100}%`,
                        backgroundColor: level.color
                      }}
                    >
                      {level.percentage > 10 && `${level.percentage}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <AlertTriangle className="mr-2 h-5 w-5" />
              异常提示
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                发现{anomalies.length}名学生分数异常，请仔细核查：
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              {anomalies.map((anomaly) => (
                <div
                  key={anomaly.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedAnomalies.includes(anomaly.id) 
                      ? 'bg-gray-50 border-gray-300' 
                      : anomaly.severity === 'high' 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{anomaly.name}</span>
                    <span className="text-sm text-gray-600">- {anomaly.issue}</span>
                  </div>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`查看${anomaly.name}的详细信息`)}
                    >
                      查看详情
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedAnomalies.includes(anomaly.id) ? "default" : "outline"}
                      onClick={() => handleMarkProcessed(anomaly.id)}
                    >
                      {selectedAnomalies.includes(anomaly.id) ? '已处理' : '标记已处理'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>批量操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                批量成绩查看
              </Button>
              <Button className="w-full" variant="outline">
                分数调整预览
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>导出选项</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                导出Excel报表
              </Button>
              <Button className="w-full" variant="outline">
                生成PDF报告
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GradePreview;