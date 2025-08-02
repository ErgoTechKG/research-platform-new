import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  LoadingSpinner, 
  Skeleton, 
  LoadingButton, 
  ProgressIndicator 
} from '@/components/ui/loading';
import { 
  FeedbackMessage, 
  EmptyState, 
  ConfirmationDialog, 
  NotificationCenter 
} from '@/components/ui/feedback';
import { 
  DragAndDrop, 
  HoverCard, 
  ClickAway, 
  AutoSave, 
  KeyboardShortcut, 
  FocusTrap 
} from '@/components/ui/interactive';
import { useToast } from '@/hooks/useToast';
import { FileText, Plus, Settings, Trash2, Download } from 'lucide-react';

const InteractionPatternsDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'success' as const,
      title: '保存成功',
      message: '您的更改已成功保存',
      timestamp: new Date(),
      read: false
    },
    {
      id: '2',
      type: 'warning' as const,
      message: '系统将在 5 分钟后进行维护',
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: '3',
      type: 'info' as const,
      message: '新功能上线：支持批量导入数据',
      timestamp: new Date(Date.now() - 600000),
      read: true
    }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaveValue, setAutoSaveValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFocusTrap, setShowFocusTrap] = useState(false);

  const { toast } = useToast();

  const handleLoadingAction = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    toast({
      title: '操作完成',
      description: '数据已成功处理',
      variant: 'success'
    });
  };

  const handleFileDrop = (files: File[]) => {
    toast({
      title: '文件上传',
      description: `已选择 ${files.length} 个文件`,
      variant: 'success'
    });
  };

  const handleAutoSave = async (value: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Auto-saved:', value);
  };

  const handleKeyboardShortcut = () => {
    toast({
      title: '快捷键触发',
      description: '您按下了 Ctrl+S',
      variant: 'info'
    });
  };

  const steps = ['基本信息', '详细配置', '确认提交', '完成'];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">交互设计模式演示</h1>
        <p className="text-muted-foreground">
          展示平台中的各种交互模式和反馈机制
        </p>
      </div>

      <Tabs defaultValue="feedback" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="feedback">即时反馈</TabsTrigger>
          <TabsTrigger value="loading">加载状态</TabsTrigger>
          <TabsTrigger value="interactions">交互操作</TabsTrigger>
          <TabsTrigger value="navigation">导航辅助</TabsTrigger>
          <TabsTrigger value="accessibility">无障碍</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>状态反馈消息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FeedbackMessage
                  type="success"
                  title="操作成功"
                  message="您的数据已成功保存到系统中"
                  action={{
                    label: '查看详情',
                    onClick: () => toast({ title: '查看详情', variant: 'info' })
                  }}
                />
                
                <FeedbackMessage
                  type="warning"
                  title="注意"
                  message="您有未保存的更改，离开页面前请保存"
                />
                
                <FeedbackMessage
                  type="error"
                  title="操作失败"
                  message="网络连接异常，请检查网络设置后重试"
                  action={{
                    label: '重试',
                    onClick: () => toast({ title: '正在重试...', variant: 'info' })
                  }}
                />
                
                <FeedbackMessage
                  type="info"
                  message="系统将在 30 分钟后进行例行维护"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>通知中心</CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationCenter
                  notifications={notifications}
                  onMarkAsRead={(id) => {
                    setNotifications(prev => 
                      prev.map(n => n.id === id ? { ...n, read: true } : n)
                    );
                  }}
                  onClearAll={() => setNotifications([])}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>空状态展示</CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={<FileText className="h-12 w-12" />}
                  title="暂无数据"
                  description="您还没有添加任何内容，点击下方按钮开始创建"
                  action={{
                    label: '开始创建',
                    onClick: () => toast({ title: '开始创建', variant: 'success' })
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="loading">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>加载状态指示器</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="md" />
                  <LoadingSpinner size="lg" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">骨架屏加载</p>
                  <Skeleton lines={3} />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">加载按钮</p>
                  <div className="flex gap-2">
                    <LoadingButton
                      loading={loading}
                      onClick={handleLoadingAction}
                      loadingText="处理中..."
                    >
                      开始处理
                    </LoadingButton>
                    <Button variant="outline" disabled={loading}>
                      取消
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>进度指示器</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressIndicator
                  steps={steps}
                  currentStep={currentStep}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    上一步
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    disabled={currentStep === steps.length - 1}
                  >
                    下一步
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interactions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>拖拽上传</CardTitle>
              </CardHeader>
              <CardContent>
                <DragAndDrop
                  onDrop={handleFileDrop}
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>悬停卡片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <HoverCard
                    trigger={
                      <Button variant="outline">悬停查看详情</Button>
                    }
                    content={
                      <div className="space-y-2">
                        <h4 className="font-semibold">详细信息</h4>
                        <p className="text-sm">这是一个悬停展示的详细信息卡片</p>
                        <Badge variant="secondary">标签示例</Badge>
                      </div>
                    }
                  />
                  
                  <HoverCard
                    trigger={
                      <Badge variant="outline" className="cursor-help">
                        悬停提示
                      </Badge>
                    }
                    content={
                      <div className="text-sm">
                        这是一个工具提示，解释某个概念或操作
                      </div>
                    }
                    side="top"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>自动保存</CardTitle>
              </CardHeader>
              <CardContent>
                <AutoSave
                  value={autoSaveValue}
                  onSave={handleAutoSave}
                  delay={1000}
                >
                  {({ value, onChange, saving, saved }) => (
                    <div className="space-y-2">
                      <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="开始输入，内容将自动保存..."
                        className="min-h-[100px]"
                      />
                      <div className="flex items-center gap-2 text-sm">
                        {saving && (
                          <>
                            <LoadingSpinner size="sm" />
                            <span className="text-muted-foreground">保存中...</span>
                          </>
                        )}
                        {saved && (
                          <span className="text-green-600">✓ 已保存</span>
                        )}
                      </div>
                    </div>
                  )}
                </AutoSave>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>点击外部关闭</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button onClick={() => setShowDropdown(!showDropdown)}>
                    {showDropdown ? '关闭下拉菜单' : '打开下拉菜单'}
                  </Button>
                  
                  {showDropdown && (
                    <ClickAway onClickAway={() => setShowDropdown(false)}>
                      <Card className="w-48">
                        <CardContent className="p-4 space-y-2">
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Settings className="h-4 w-4 mr-2" />
                            设置
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            下载
                          </Button>
                          <Separator />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full justify-start text-red-600"
                            onClick={() => setShowConfirm(true)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </Button>
                        </CardContent>
                      </Card>
                    </ClickAway>
                  )}
                </div>
              </CardContent>
            </Card>

            <ConfirmationDialog
              open={showConfirm}
              onOpenChange={setShowConfirm}
              title="确认删除"
              description="此操作无法撤销，确定要删除吗？"
              confirmText="确认删除"
              cancelText="取消"
              variant="destructive"
              onConfirm={() => {
                toast({
                  title: '已删除',
                  description: '项目已成功删除',
                  variant: 'success'
                });
                setShowDropdown(false);
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="navigation">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>键盘快捷键</CardTitle>
              </CardHeader>
              <CardContent>
                <KeyboardShortcut
                  combination={['ctrl', 's']}
                  onTrigger={handleKeyboardShortcut}
                >
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      按 <Badge variant="outline">Ctrl + S</Badge> 触发快捷键
                    </p>
                    <Input placeholder="在此输入内容，然后按 Ctrl+S" />
                  </div>
                </KeyboardShortcut>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>面包屑导航</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="flex" aria-label="面包屑">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Button variant="link" className="p-0 h-auto">
                        首页
                      </Button>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <span className="mx-2">/</span>
                        <Button variant="link" className="p-0 h-auto">
                          设计系统
                        </Button>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <span className="mx-2">/</span>
                        <span className="text-muted-foreground">交互模式</span>
                      </div>
                    </li>
                  </ol>
                </nav>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accessibility">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>焦点管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => setShowFocusTrap(!showFocusTrap)}>
                  {showFocusTrap ? '关闭焦点陷阱' : '打开焦点陷阱'}
                </Button>
                
                {showFocusTrap && (
                  <Card className="border-2 border-primary">
                    <CardContent className="p-4">
                      <FocusTrap active={showFocusTrap}>
                        <div className="space-y-4">
                          <h3 className="font-semibold">焦点陷阱演示</h3>
                          <p className="text-sm text-muted-foreground">
                            使用 Tab 键导航，焦点将被限制在此区域内
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm">按钮 1</Button>
                            <Button size="sm" variant="outline">按钮 2</Button>
                          </div>
                          <Input placeholder="输入框" />
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => setShowFocusTrap(false)}
                          >
                            关闭
                          </Button>
                        </div>
                      </FocusTrap>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>语义化标签</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div role="region" aria-labelledby="info-section">
                  <h3 id="info-section" className="font-semibold mb-2">信息区域</h3>
                  <p className="text-sm text-muted-foreground">
                    此区域使用了正确的 ARIA 标签，便于屏幕阅读器理解
                  </p>
                </div>
                
                <div role="alert" className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    这是一个重要提醒，使用了 role="alert" 属性
                  </p>
                </div>
                
                <Button
                  aria-describedby="button-help"
                  className="relative"
                >
                  可访问按钮
                </Button>
                <div id="button-help" className="text-xs text-muted-foreground">
                  此按钮有相关的帮助文本
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractionPatternsDemo;