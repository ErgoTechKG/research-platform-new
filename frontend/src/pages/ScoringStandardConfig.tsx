import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Settings, Save, FileDown, FileUp, Plus, Trash2, 
  Copy, Eye, History, AlertCircle, CheckCircle,
  Calculator, Layout, Layers
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ScoreItem {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  subItems?: ScoreItem[];
}

interface ScoringTemplate {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  items: ScoreItem[];
}

export default function ScoringStandardConfig() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mock templates
  const [templates, setTemplates] = useState<ScoringTemplate[]>([
    {
      id: '1',
      name: '默认评分标准',
      description: '适用于大多数实验室轮转课程的标准评分模板',
      isDefault: true,
      createdBy: '系统',
      createdAt: '2024-01-01',
      items: [
        {
          id: '1',
          name: '过程表现',
          weight: 30,
          maxScore: 100,
          subItems: [
            { id: '1-1', name: '出勤情况', weight: 25, maxScore: 100 },
            { id: '1-2', name: '实验态度', weight: 25, maxScore: 100 },
            { id: '1-3', name: '团队协作', weight: 25, maxScore: 100 },
            { id: '1-4', name: '进度把控', weight: 25, maxScore: 100 },
          ]
        },
        {
          id: '2',
          name: '海报质量',
          weight: 20,
          maxScore: 100,
          subItems: [
            { id: '2-1', name: '设计美观', weight: 30, maxScore: 100 },
            { id: '2-2', name: '内容完整', weight: 40, maxScore: 100 },
            { id: '2-3', name: '创新性', weight: 30, maxScore: 100 },
          ]
        },
        {
          id: '3',
          name: '大报告内容',
          weight: 30,
          maxScore: 100,
          subItems: [
            { id: '3-1', name: '文献综述', weight: 20, maxScore: 100 },
            { id: '3-2', name: '研究方法', weight: 25, maxScore: 100 },
            { id: '3-3', name: '数据分析', weight: 30, maxScore: 100 },
            { id: '3-4', name: '结论讨论', weight: 25, maxScore: 100 },
          ]
        },
        {
          id: '4',
          name: '答辩表现',
          weight: 20,
          maxScore: 100,
          subItems: [
            { id: '4-1', name: '表达清晰', weight: 35, maxScore: 100 },
            { id: '4-2', name: '回答准确', weight: 35, maxScore: 100 },
            { id: '4-3', name: '时间控制', weight: 30, maxScore: 100 },
          ]
        }
      ]
    }
  ]);
  
  const [currentItems, setCurrentItems] = useState<ScoreItem[]>([]);
  
  // Load template
  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentItems([...template.items]);
      setTemplateName(template.name);
      setTemplateDescription(template.description);
    }
  };
  
  // Calculate total weight
  const calculateTotalWeight = (items: ScoreItem[]): number => {
    return items.reduce((sum, item) => sum + item.weight, 0);
  };
  
  // Validate sub-items weight
  const validateSubItemsWeight = (subItems?: ScoreItem[]): boolean => {
    if (!subItems || subItems.length === 0) return true;
    return calculateTotalWeight(subItems) === 100;
  };
  
  // Add new item
  const addItem = () => {
    const newItem: ScoreItem = {
      id: Date.now().toString(),
      name: '新评分项',
      weight: 0,
      maxScore: 100,
      subItems: []
    };
    setCurrentItems([...currentItems, newItem]);
  };
  
  // Add sub-item
  const addSubItem = (parentId: string) => {
    const newItems = currentItems.map(item => {
      if (item.id === parentId) {
        const newSubItem: ScoreItem = {
          id: `${parentId}-${Date.now()}`,
          name: '新子项',
          weight: 0,
          maxScore: 100
        };
        return {
          ...item,
          subItems: [...(item.subItems || []), newSubItem]
        };
      }
      return item;
    });
    setCurrentItems(newItems);
  };
  
  // Update item
  const updateItem = (id: string, field: keyof ScoreItem, value: any) => {
    const newItems = currentItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.map(subItem => 
            subItem.id === id ? { ...subItem, [field]: value } : subItem
          )
        };
      }
      return item;
    });
    setCurrentItems(newItems);
  };
  
  // Delete item
  const deleteItem = (id: string) => {
    const newItems = currentItems.filter(item => item.id !== id);
    setCurrentItems(newItems);
  };
  
  // Delete sub-item
  const deleteSubItem = (parentId: string, subId: string) => {
    const newItems = currentItems.map(item => {
      if (item.id === parentId) {
        return {
          ...item,
          subItems: item.subItems?.filter(sub => sub.id !== subId)
        };
      }
      return item;
    });
    setCurrentItems(newItems);
  };
  
  // Save template
  const saveTemplate = async () => {
    if (!templateName) {
      alert('请输入模板名称');
      return;
    }
    
    if (calculateTotalWeight(currentItems) !== 100) {
      alert('一级评分项权重总和必须为100%');
      return;
    }
    
    const invalidSubItems = currentItems.some(item => 
      item.subItems && item.subItems.length > 0 && !validateSubItemsWeight(item.subItems)
    );
    
    if (invalidSubItems) {
      alert('所有子项权重总和必须为100%');
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTemplate: ScoringTemplate = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      isDefault: false,
      createdBy: user?.name || '未知',
      createdAt: new Date().toLocaleDateString(),
      items: currentItems
    };
    
    setTemplates([...templates, newTemplate]);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Export template
  const exportTemplate = () => {
    const exportData = {
      name: templateName,
      description: templateDescription,
      items: currentItems,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.name
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scoring_template_${Date.now()}.json`;
    a.click();
  };
  
  // Import template
  const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setTemplateName(data.name || '导入的模板');
        setTemplateDescription(data.description || '');
        setCurrentItems(data.items || []);
      } catch (error) {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };
  
  const totalWeight = calculateTotalWeight(currentItems);
  const isWeightValid = totalWeight === 100;
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">评分标准配置</h1>
          <p className="text-gray-600 mt-1">设置和管理实验室轮转课程的评分标准模板</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/multidimensional-scoring')}
          >
            返回评分
          </Button>
        </div>
      </div>
      
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>选择模板</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedTemplate} onValueChange={(value) => {
              setSelectedTemplate(value);
              if (value !== 'new') {
                loadTemplate(value);
              } else {
                setCurrentItems([]);
                setTemplateName('');
                setTemplateDescription('');
              }
            }}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="选择已有模板或创建新模板" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">+ 创建新模板</SelectItem>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} {template.isDefault && '(默认)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  历史版本
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>历史版本</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {templates.map(template => (
                    <div key={template.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            创建者: {template.createdBy} | 创建时间: {template.createdAt}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            loadTemplate(template.id);
                            setShowHistory(false);
                          }}
                        >
                          使用
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Template Info */}
          {(selectedTemplate || currentItems.length > 0) && (
            <div className="space-y-4">
              <div>
                <Label>模板名称</Label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="请输入模板名称"
                />
              </div>
              <div>
                <Label>模板描述</Label>
                <Input
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="请输入模板描述"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Weight Configuration */}
      {(selectedTemplate || currentItems.length > 0) && (
        <>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>权重配置</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${isWeightValid ? 'text-green-600' : 'text-red-600'}`}>
                    总权重: {totalWeight}%
                  </span>
                  <Button size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" />
                    添加评分项
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isWeightValid && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    一级评分项权重总和必须为100%，当前为{totalWeight}%
                  </AlertDescription>
                </Alert>
              )}
              
              {currentItems.map((item, index) => {
                const subWeight = calculateTotalWeight(item.subItems || []);
                const isSubWeightValid = validateSubItemsWeight(item.subItems);
                
                return (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-4">
                      {/* Main Item */}
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Layers className="w-4 h-4 text-gray-400" />
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              placeholder="评分项名称"
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label>权重:</Label>
                          <Input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateItem(item.id, 'weight', parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                            max="100"
                          />
                          <span>%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label>满分:</Label>
                          <Input
                            type="number"
                            value={item.maxScore}
                            onChange={(e) => updateItem(item.id, 'maxScore', parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                          />
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Sub Items */}
                      {item.subItems && item.subItems.length > 0 && (
                        <div className="ml-8 space-y-2">
                          {!isSubWeightValid && (
                            <p className="text-sm text-red-600">
                              子项权重总和: {subWeight}% (必须为100%)
                            </p>
                          )}
                          {item.subItems.map(subItem => (
                            <div key={subItem.id} className="flex items-center space-x-4">
                              <Input
                                value={subItem.name}
                                onChange={(e) => updateItem(subItem.id, 'name', e.target.value)}
                                placeholder="子项名称"
                                className="flex-1"
                              />
                              <div className="flex items-center space-x-2">
                                <Label className="text-sm">权重:</Label>
                                <Input
                                  type="number"
                                  value={subItem.weight}
                                  onChange={(e) => updateItem(subItem.id, 'weight', parseInt(e.target.value) || 0)}
                                  className="w-16"
                                  min="0"
                                  max="100"
                                />
                                <span className="text-sm">%</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteSubItem(item.id, subItem.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="ml-8">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addSubItem(item.id)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          添加子项
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    预览
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>评分标准预览</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">{templateName || '未命名模板'}</h3>
                      <p className="text-sm text-gray-600 mb-4">{templateDescription}</p>
                      {currentItems.map(item => (
                        <div key={item.id} className="mb-4">
                          <div className="flex justify-between font-medium">
                            <span>{item.name}</span>
                            <span>{item.weight}% (满分: {item.maxScore})</span>
                          </div>
                          {item.subItems && item.subItems.length > 0 && (
                            <div className="ml-4 mt-2 space-y-1">
                              {item.subItems.map(subItem => (
                                <div key={subItem.id} className="flex justify-between text-sm text-gray-600">
                                  <span>• {subItem.name}</span>
                                  <span>{subItem.weight}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={exportTemplate}>
                <FileDown className="w-4 h-4 mr-2" />
                导出
              </Button>
              
              <label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={importTemplate}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <span>
                    <FileUp className="w-4 h-4 mr-2" />
                    导入
                  </span>
                </Button>
              </label>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentItems([]);
                  setTemplateName('');
                  setTemplateDescription('');
                  setSelectedTemplate('');
                }}
              >
                取消
              </Button>
              <Button
                onClick={saveTemplate}
                disabled={isSaving || !isWeightValid}
              >
                {isSaving ? (
                  <>
                    <Calculator className="w-4 h-4 mr-2 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    保存模板
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Success Message */}
          {showSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                评分标准模板已成功保存！
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}