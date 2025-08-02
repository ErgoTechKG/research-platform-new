import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { 
  Eye, Send, Plus, Settings, Target, Award, 
  BookOpen, Lightbulb, Users, CheckCircle, 
  AlertCircle, Edit, Trash2, Save, RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EvaluationDimension {
  id: string;
  name: string;
  weight: number;
  description?: string;
  criteria: EvaluationCriteria[];
}

interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

interface EvaluationPlan {
  id: string;
  name: string;
  target: string;
  period: string;
  status: 'draft' | 'published' | 'archived';
  dimensions: EvaluationDimension[];
  createdAt: string;
  publishedAt?: string;
}

export default function EvaluationPlanPublishing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentPlan, setCurrentPlan] = useState<EvaluationPlan>({
    id: '1',
    name: '综合素质评价方案',
    target: '2023级实验班',
    period: '2025学年',
    status: 'draft',
    createdAt: '2024-10-01',
    dimensions: [
      {
        id: '1',
        name: '思想品德',
        weight: 20,
        description: '评估学生的思想道德品质和社会责任感',
        criteria: [
          { id: '1', name: '社会实践参与度', weight: 40, description: '参与社会实践活动的积极程度' },
          { id: '2', name: '集体活动贡献', weight: 30, description: '在集体活动中的贡献和表现' },
          { id: '3', name: '导师评价', weight: 30, description: '导师对学生品德表现的评价' }
        ]
      },
      {
        id: '2',
        name: '课程成绩',
        weight: 40,
        description: '学生在各门课程中的学术表现',
        criteria: [
          { id: '1', name: '专业课程成绩', weight: 60, description: '专业核心课程的成绩表现' },
          { id: '2', name: '通识课程成绩', weight: 25, description: '通识教育课程的成绩表现' },
          { id: '3', name: '实践课程成绩', weight: 15, description: '实验实践课程的成绩表现' }
        ]
      },
      {
        id: '3',
        name: '科技创新',
        weight: 25,
        description: '学生在科技创新方面的能力和成果',
        criteria: [
          { id: '1', name: '科研项目参与', weight: 40, description: '参与科研项目的情况和贡献' },
          { id: '2', name: '学术竞赛获奖', weight: 35, description: '在各类学术竞赛中的获奖情况' },
          { id: '3', name: '创新作品发表', weight: 25, description: '创新作品、论文等的发表情况' }
        ]
      },
      {
        id: '4',
        name: '科研推进',
        weight: 15,
        description: '学生推进科研工作的能力和表现',
        criteria: [
          { id: '1', name: '研究能力', weight: 50, description: '独立进行研究工作的能力' },
          { id: '2', name: '团队协作', weight: 30, description: '在科研团队中的协作表现' },
          { id: '3', name: '学术交流', weight: 20, description: '参与学术交流活动的表现' }
        ]
      }
    ]
  });
  
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showCriteriaDialog, setShowCriteriaDialog] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [newCriteria, setNewCriteria] = useState({ name: '', weight: 0, description: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Calculate total weight
  const totalWeight = currentPlan.dimensions.reduce((sum, dim) => sum + dim.weight, 0);
  
  // Validate plan
  const validatePlan = () => {
    const errors: string[] = [];
    
    if (totalWeight !== 100) {
      errors.push(`评价维度权重总和必须为100%，当前为${totalWeight}%`);
    }
    
    currentPlan.dimensions.forEach(dim => {
      const criteriaTotal = dim.criteria.reduce((sum, criteria) => sum + criteria.weight, 0);
      if (criteriaTotal !== 100) {
        errors.push(`${dim.name}的细则权重总和必须为100%，当前为${criteriaTotal}%`);
      }
      if (dim.criteria.length === 0) {
        errors.push(`${dim.name}必须至少包含一个评价细则`);
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  // Update dimension weight
  const updateDimensionWeight = (dimensionId: string, weight: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(dim =>
        dim.id === dimensionId ? { ...dim, weight } : dim
      )
    }));
  };
  
  // Update criteria weight
  const updateCriteriaWeight = (dimensionId: string, criteriaId: string, weight: number) => {
    setCurrentPlan(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(dim =>
        dim.id === dimensionId
          ? {
              ...dim,
              criteria: dim.criteria.map(criteria =>
                criteria.id === criteriaId ? { ...criteria, weight } : criteria
              )
            }
          : dim
      )
    }));
  };
  
  // Add new criteria
  const addCriteria = () => {
    if (!selectedDimension || !newCriteria.name.trim()) return;
    
    const criteriaId = Date.now().toString();
    setCurrentPlan(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(dim =>
        dim.id === selectedDimension
          ? {
              ...dim,
              criteria: [...dim.criteria, { ...newCriteria, id: criteriaId }]
            }
          : dim
      )
    }));
    
    setNewCriteria({ name: '', weight: 0, description: '' });
    setShowCriteriaDialog(false);
  };
  
  // Remove criteria
  const removeCriteria = (dimensionId: string, criteriaId: string) => {
    setCurrentPlan(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(dim =>
        dim.id === dimensionId
          ? {
              ...dim,
              criteria: dim.criteria.filter(criteria => criteria.id !== criteriaId)
            }
          : dim
      )
    }));
  };
  
  // Publish plan
  const publishPlan = async () => {
    if (!validatePlan()) return;
    
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrentPlan(prev => ({
      ...prev,
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0]
    }));
    
    setIsPublishing(false);
    setShowPublishDialog(false);
  };
  
  // Get weight color
  const getWeightColor = (weight: number, total: number) => {
    const percentage = (weight / total) * 100;
    if (percentage > 50) return 'bg-blue-500';
    if (percentage > 30) return 'bg-green-500';
    if (percentage > 15) return 'bg-yellow-500';
    return 'bg-gray-500';
  };
  
  // Get dimension icon
  const getDimensionIcon = (name: string) => {
    switch (name) {
      case '思想品德': return <Users className="w-5 h-5" />;
      case '课程成绩': return <BookOpen className="w-5 h-5" />;
      case '科技创新': return <Lightbulb className="w-5 h-5" />;
      case '科研推进': return <Target className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">评价方案发布</h1>
          <p className="text-gray-600 mt-1">清晰展示评价维度和权重，配置和发布评价方案</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge 
            variant={currentPlan.status === 'published' ? 'default' : 'secondary'}
            className={
              currentPlan.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }
          >
            {currentPlan.status === 'published' ? '已发布' : '草稿'}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setShowPreviewDialog(true)}
          >
            <Eye className="w-4 h-4 mr-2" />
            预览
          </Button>
          <Button
            onClick={() => setShowPublishDialog(true)}
            disabled={currentPlan.status === 'published'}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            发布
          </Button>
        </div>
      </div>
      
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>方案名称</Label>
              <Input 
                value={currentPlan.name}
                onChange={(e) => setCurrentPlan(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>评价对象</Label>
              <Select value={currentPlan.target} onValueChange={(value) => setCurrentPlan(prev => ({ ...prev, target: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023级实验班">2023级实验班</SelectItem>
                  <SelectItem value="2024级实验班">2024级实验班</SelectItem>
                  <SelectItem value="全体研究生">全体研究生</SelectItem>
                  <SelectItem value="博士生">博士生</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>评价周期</Label>
              <Select value={currentPlan.period} onValueChange={(value) => setCurrentPlan(prev => ({ ...prev, period: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025学年">2025学年</SelectItem>
                  <SelectItem value="2024学年">2024学年</SelectItem>
                  <SelectItem value="2025春季学期">2025春季学期</SelectItem>
                  <SelectItem value="2025秋季学期">2025秋季学期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Weight Validation */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-1">
              {validationErrors.map((error, idx) => (
                <div key={idx} className="text-red-700">{error}</div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Dimension Weight Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>评价维度权重配置</span>
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/evaluation-standard-config')}
              >
                <Settings className="w-4 h-4 mr-2" />
                高级配置
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">总计:</span>
                <Badge 
                  variant={totalWeight === 100 ? 'default' : 'destructive'}
                  className={totalWeight === 100 ? 'bg-green-100 text-green-800' : ''}
                >
                  {totalWeight}%
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentPlan.dimensions.map((dimension) => (
              <div key={dimension.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getDimensionIcon(dimension.name)}
                    <div>
                      <h4 className="font-semibold">{dimension.name}</h4>
                      {dimension.description && (
                        <p className="text-sm text-gray-600">{dimension.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      value={dimension.weight}
                      onChange={(e) => updateDimensionWeight(dimension.id, parseInt(e.target.value) || 0)}
                      className="w-20 text-center"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${getWeightColor(dimension.weight, 100)}`}
                    style={{ width: `${Math.min(dimension.weight, 100)}%` }}
                  />
                </div>
                
                {/* Criteria Details */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">评价细则</h5>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDimension(dimension.id);
                        setShowCriteriaDialog(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      添加细则
                    </Button>
                  </div>
                  
                  {dimension.criteria.length > 0 ? (
                    <div className="space-y-2">
                      {dimension.criteria.map((criteria) => (
                        <div key={criteria.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{criteria.name}</span>
                            {criteria.description && (
                              <p className="text-xs text-gray-600 mt-1">{criteria.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={criteria.weight}
                              onChange={(e) => updateCriteriaWeight(dimension.id, criteria.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center text-sm"
                              min="0"
                              max="100"
                            />
                            <span className="text-xs">%</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCriteria(dimension.id, criteria.id)}
                              className="p-1 h-6 w-6 text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {/* Criteria weight validation */}
                      {(() => {
                        const criteriaTotal = dimension.criteria.reduce((sum, c) => sum + c.weight, 0);
                        return criteriaTotal !== 100 && (
                          <div className="text-xs text-red-600 mt-1">
                            细则权重总和应为100%，当前为{criteriaTotal}%
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic py-2">
                      暂无评价细则，请添加至少一个细则
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>评价方案预览</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Plan Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">方案名称:</span>
                <p className="font-semibold">{currentPlan.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">评价对象:</span>
                <p className="font-semibold">{currentPlan.target}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">评价周期:</span>
                <p className="font-semibold">{currentPlan.period}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">状态:</span>
                <Badge className={currentPlan.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {currentPlan.status === 'published' ? '已发布' : '草稿'}
                </Badge>
              </div>
            </div>
            
            {/* Dimensions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">评价维度及权重</h3>
              {currentPlan.dimensions.map((dimension) => (
                <Card key={dimension.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getDimensionIcon(dimension.name)}
                        <div>
                          <h4 className="font-semibold">{dimension.name}</h4>
                          {dimension.description && (
                            <p className="text-sm text-gray-600">{dimension.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        {dimension.weight}%
                      </Badge>
                    </div>
                    
                    {dimension.criteria.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">评价细则:</h5>
                        <div className="space-y-1">
                          {dimension.criteria.map((criteria) => (
                            <div key={criteria.id} className="flex justify-between items-start text-sm">
                              <div className="flex-1">
                                <span className="font-medium">• {criteria.name}</span>
                                {criteria.description && (
                                  <p className="text-gray-600 ml-2 mt-1">{criteria.description}</p>
                                )}
                              </div>
                              <span className="text-gray-600">({criteria.weight}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Publish Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>发布评价方案</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                发布后，评价方案将对所有相关人员可见，学生和评价专家可以开始评价过程。
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <p className="text-sm"><strong>方案名称:</strong> {currentPlan.name}</p>
              <p className="text-sm"><strong>评价对象:</strong> {currentPlan.target}</p>
              <p className="text-sm"><strong>评价周期:</strong> {currentPlan.period}</p>
              <p className="text-sm"><strong>维度数量:</strong> {currentPlan.dimensions.length}个</p>
            </div>
            
            {validationErrors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="text-red-700 font-medium">发布前请解决以下问题:</p>
                    {validationErrors.map((error, idx) => (
                      <div key={idx} className="text-red-700 text-sm">• {error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={publishPlan}
              disabled={validationErrors.length > 0 || isPublishing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  确认发布
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Criteria Dialog */}
      <Dialog open={showCriteriaDialog} onOpenChange={setShowCriteriaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加评价细则</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label>细则名称</Label>
              <Input
                value={newCriteria.name}
                onChange={(e) => setNewCriteria(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入细则名称"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>权重 (%)</Label>
              <Input
                type="number"
                value={newCriteria.weight}
                onChange={(e) => setNewCriteria(prev => ({ ...prev, weight: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
                max="100"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>描述 (可选)</Label>
              <Textarea
                value={newCriteria.description}
                onChange={(e) => setNewCriteria(prev => ({ ...prev, description: e.target.value }))}
                placeholder="请输入细则描述"
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowCriteriaDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={addCriteria}
              disabled={!newCriteria.name.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加细则
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}