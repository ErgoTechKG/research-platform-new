import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Settings, Save, RefreshCw, Check, X, Copy, 
  FileText, ChevronRight, AlertCircle, Sparkles,
  BarChart3, PieChart, Target, Lock, Unlock,
  Download, Upload, Edit2, Plus, Minus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface WeightDimension {
  id: string;
  name: string;
  weight: number;
  locked?: boolean;
  color: string;
  description?: string;
  subDimensions?: WeightDimension[];
}

interface WeightTemplate {
  id: string;
  name: string;
  description: string;
  dimensions: WeightDimension[];
  type: 'default' | 'custom';
}

export default function EvaluationStandardConfig() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [dimensions, setDimensions] = useState<WeightDimension[]>([
    { id: '1', name: '思想品德', weight: 20, color: 'bg-purple-500', description: '评估学生的思想道德品质和社会责任感' },
    { id: '2', name: '课程成绩', weight: 40, color: 'bg-blue-500', description: '学生在各门课程中的学术表现' },
    { id: '3', name: '科技创新', weight: 25, color: 'bg-green-500', description: '学生在科技创新方面的能力和成果' },
    { id: '4', name: '科研推进', weight: 15, color: 'bg-yellow-500', description: '学生推进科研工作的能力和表现' }
  ]);
  
  const [templates] = useState<WeightTemplate[]>([
    {
      id: '1',
      name: '综合素质标准',
      description: '适用于全面评价学生综合素质',
      type: 'default',
      dimensions: [
        { id: '1', name: '思想品德', weight: 20, color: 'bg-purple-500' },
        { id: '2', name: '课程成绩', weight: 40, color: 'bg-blue-500' },
        { id: '3', name: '科技创新', weight: 25, color: 'bg-green-500' },
        { id: '4', name: '科研推进', weight: 15, color: 'bg-yellow-500' }
      ]
    },
    {
      id: '2',
      name: '学术导向型',
      description: '重点关注学术成绩和科研能力',
      type: 'default',
      dimensions: [
        { id: '1', name: '思想品德', weight: 10, color: 'bg-purple-500' },
        { id: '2', name: '课程成绩', weight: 50, color: 'bg-blue-500' },
        { id: '3', name: '科技创新', weight: 20, color: 'bg-green-500' },
        { id: '4', name: '科研推进', weight: 20, color: 'bg-yellow-500' }
      ]
    },
    {
      id: '3',
      name: '创新能力型',
      description: '侧重创新思维和实践能力',
      type: 'default',
      dimensions: [
        { id: '1', name: '思想品德', weight: 15, color: 'bg-purple-500' },
        { id: '2', name: '课程成绩', weight: 30, color: 'bg-blue-500' },
        { id: '3', name: '科技创新', weight: 35, color: 'bg-green-500' },
        { id: '4', name: '科研推进', weight: 20, color: 'bg-yellow-500' }
      ]
    }
  ]);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [activeTab, setActiveTab] = useState('visual');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Calculate total weight
  const totalWeight = dimensions.reduce((sum, dim) => sum + dim.weight, 0);
  
  // Update dimension weight
  const updateWeight = (id: string, newWeight: number) => {
    const dimension = dimensions.find(d => d.id === id);
    if (dimension?.locked) return;
    
    setDimensions(prev => prev.map(dim => 
      dim.id === id ? { ...dim, weight: Math.max(0, Math.min(100, newWeight)) } : dim
    ));
  };
  
  // Normalize weights to 100%
  const normalizeWeights = () => {
    const total = dimensions.reduce((sum, dim) => sum + dim.weight, 0);
    if (total === 0) return;
    
    setDimensions(prev => prev.map(dim => ({
      ...dim,
      weight: Math.round((dim.weight / total) * 100)
    })));
  };
  
  // Lock/unlock dimension
  const toggleLock = (id: string) => {
    setDimensions(prev => prev.map(dim => 
      dim.id === id ? { ...dim, locked: !dim.locked } : dim
    ));
  };
  
  // Apply template
  const applyTemplate = (template: WeightTemplate) => {
    setDimensions(template.dimensions.map(dim => ({ ...dim, locked: false })));
    setShowTemplateDialog(false);
  };
  
  // Save as template
  const saveAsTemplate = () => {
    if (!templateName.trim()) return;
    
    // In real implementation, this would save to backend
    console.log('Saving template:', {
      name: templateName,
      description: templateDescription,
      dimensions: dimensions
    });
    
    setShowSaveDialog(false);
    setTemplateName('');
    setTemplateDescription('');
  };
  
  // Add dimension
  const addDimension = () => {
    const newId = Date.now().toString();
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-indigo-500', 'bg-pink-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setDimensions(prev => [...prev, {
      id: newId,
      name: '新维度',
      weight: 0,
      color: randomColor,
      description: ''
    }]);
  };
  
  // Remove dimension
  const removeDimension = (id: string) => {
    setDimensions(prev => prev.filter(dim => dim.id !== id));
  };
  
  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setIsDragging(true);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const draggedDimension = dimensions[draggedIndex];
    const newDimensions = [...dimensions];
    
    // Remove dragged item
    newDimensions.splice(draggedIndex, 1);
    
    // Insert at new position
    newDimensions.splice(dropIndex, 0, draggedDimension);
    
    setDimensions(newDimensions);
    setIsDragging(false);
    setDraggedIndex(null);
  };
  
  // Export configuration
  const exportConfig = () => {
    const config = {
      dimensions,
      totalWeight,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-config-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">评价标准配置</h1>
          <p className="text-gray-600 mt-1">可视化权重设置界面，提供直观的评价标准配置和管理功能</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/evaluation-plan-publishing')}
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            返回发布页面
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="visual">可视化配置</TabsTrigger>
          <TabsTrigger value="templates">标准模板</TabsTrigger>
          <TabsTrigger value="advanced">高级设置</TabsTrigger>
        </TabsList>
        
        {/* Visual Configuration Tab */}
        <TabsContent value="visual" className="space-y-6">
          {/* Weight Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>权重总览</span>
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={normalizeWeights}
                    disabled={totalWeight === 100}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    自动归一化
                  </Button>
                  <Badge 
                    variant={totalWeight === 100 ? 'default' : 'destructive'}
                    className={totalWeight === 100 ? 'bg-green-100 text-green-800' : ''}
                  >
                    总计: {totalWeight}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Pie Chart Visualization */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-64 h-64">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {(() => {
                      let cumulativePercentage = 0;
                      return dimensions.map((dim, index) => {
                        const percentage = (dim.weight / Math.max(totalWeight, 1)) * 100;
                        const startAngle = (cumulativePercentage / 100) * 360;
                        const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
                        
                        const start = polarToCartesian(50, 50, 45, startAngle);
                        const end = polarToCartesian(50, 50, 45, endAngle);
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        
                        const pathData = [
                          `M 50 50`,
                          `L ${start.x} ${start.y}`,
                          `A 45 45 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
                          'Z'
                        ].join(' ');
                        
                        cumulativePercentage += percentage;
                        
                        return (
                          <path
                            key={dim.id}
                            d={pathData}
                            fill={`hsl(${index * 90}, 70%, 50%)`}
                            stroke="white"
                            strokeWidth="1"
                            className="transition-all hover:opacity-80 cursor-pointer"
                          />
                        );
                      });
                    })()}
                  </svg>
                  
                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-full w-32 h-32 shadow-inner flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-8 h-8 mx-auto text-gray-400 mb-1" />
                        <div className="text-2xl font-bold">{totalWeight}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-4">
                {dimensions.map((dim, index) => (
                  <div key={dim.id} className="flex items-center space-x-3">
                    <div 
                      className={`w-4 h-4 rounded`}
                      style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                    />
                    <span className="font-medium">{dim.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {dim.weight}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Dimension Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>维度权重配置</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addDimension}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加维度
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dimensions.map((dimension, index) => (
                  <div
                    key={dimension.id}
                    draggable={!dimension.locked}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={cn(
                      "border rounded-lg p-4 transition-all",
                      isDragging && draggedIndex === index && "opacity-50",
                      dimension.locked ? "bg-gray-50" : "hover:shadow-md cursor-move"
                    )}
                  >
                    <div className="space-y-4">
                      {/* Dimension Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${dimension.color}`} />
                          <Input
                            value={dimension.name}
                            onChange={(e) => {
                              setDimensions(prev => prev.map(dim =>
                                dim.id === dimension.id ? { ...dim, name: e.target.value } : dim
                              ));
                            }}
                            disabled={dimension.locked}
                            className="font-semibold border-0 p-0 h-auto text-base focus:ring-0"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleLock(dimension.id)}
                          >
                            {dimension.locked ? (
                              <Lock className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Unlock className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeDimension(dimension.id)}
                            disabled={dimension.locked}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Weight Slider */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">权重</Label>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateWeight(dimension.id, dimension.weight - 5)}
                              disabled={dimension.locked}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              type="number"
                              value={dimension.weight}
                              onChange={(e) => updateWeight(dimension.id, parseInt(e.target.value) || 0)}
                              disabled={dimension.locked}
                              className="w-16 text-center h-8"
                              min="0"
                              max="100"
                            />
                            <span className="text-sm">%</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateWeight(dimension.id, dimension.weight + 5)}
                              disabled={dimension.locked}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <Slider
                          value={[dimension.weight]}
                          onValueChange={([value]) => updateWeight(dimension.id, value)}
                          disabled={dimension.locked}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        
                        {/* Visual Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${dimension.color} h-2 rounded-full transition-all`}
                            style={{ width: `${dimension.weight}%` }}
                          />
                        </div>
                      </div>
                      
                      {/* Description */}
                      <Textarea
                        value={dimension.description || ''}
                        onChange={(e) => {
                          setDimensions(prev => prev.map(dim =>
                            dim.id === dimension.id ? { ...dim, description: e.target.value } : dim
                          ));
                        }}
                        disabled={dimension.locked}
                        placeholder="添加维度描述..."
                        className="resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Weight validation alert */}
              {totalWeight !== 100 && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    权重总和应为100%，当前为{totalWeight}%。点击"自动归一化"按钮可自动调整。
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateDialog(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    选择模板
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveDialog(true)}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存为模板
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportConfig}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    导出配置
                  </Button>
                </div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={totalWeight !== 100}
                >
                  <Check className="w-4 h-4 mr-2" />
                  保存配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{template.name}</span>
                    {template.type === 'default' && (
                      <Badge variant="secondary">预设</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  
                  {/* Template Preview */}
                  <div className="space-y-2 mb-4">
                    {template.dimensions.map((dim) => (
                      <div key={dim.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded ${dim.color}`} />
                          <span className="text-sm">{dim.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{dim.weight}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => applyTemplate(template)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    应用此模板
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Advanced Settings Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>高级设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>权重精度</Label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">整数</SelectItem>
                    <SelectItem value="0.1">一位小数</SelectItem>
                    <SelectItem value="0.01">两位小数</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>权重调整步长</Label>
                <Select defaultValue="5">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>启用多级维度</Label>
                  <p className="text-sm text-gray-600 mt-1">允许为每个维度添加子维度</p>
                </div>
                <Button variant="outline" size="sm">
                  启用
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>权重验证规则</Label>
                  <p className="text-sm text-gray-600 mt-1">自定义权重验证规则</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  配置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>选择评价标准模板</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4 max-h-96 overflow-y-auto">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => applyTemplate(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{template.name}</h4>
                  {template.type === 'default' && (
                    <Badge variant="secondary">预设</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="flex items-center space-x-4">
                  {template.dimensions.map((dim) => (
                    <div key={dim.id} className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded ${dim.color}`} />
                      <span className="text-xs">{dim.name}</span>
                      <span className="text-xs text-gray-500">({dim.weight}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存为模板</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <Label>模板名称</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="请输入模板名称"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>模板描述</Label>
              <Textarea
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="请输入模板描述"
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label>预览</Label>
              <div className="mt-2 space-y-2 p-3 bg-gray-50 rounded">
                {dimensions.map((dim) => (
                  <div key={dim.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${dim.color}`} />
                      <span className="text-sm">{dim.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{dim.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={saveAsTemplate}
              disabled={!templateName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              保存模板
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function for polar to cartesian conversion
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}