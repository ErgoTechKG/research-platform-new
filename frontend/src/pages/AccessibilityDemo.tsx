import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  AccessibilityPanel,
  SkipLink,
  LiveRegion,
  AccessibleHeading,
  Focusable,
  StatusMessage,
  AccessibleProgressBar
} from '@/components/ui/accessibility';
import { useAccessibility } from '@/hooks/useAccessibility';
import { 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Keyboard, 
  Volume2,
  Play,
  Pause,
  SkipForward,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

const AccessibilityDemo: React.FC = () => {
  const { announceToScreenReader, skipToContent } = useAccessibility();
  const [currentDemo, setCurrentDemo] = useState('');
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    preferences: '',
    newsletter: false
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => (prev + 10) % 101);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    announceToScreenReader(message);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = '姓名是必填项';
    }
    
    if (!formData.email.trim()) {
      errors.email = '邮箱是必填项';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.feedback.trim()) {
      errors.feedback = '反馈内容是必填项';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addNotification('表单提交成功！感谢您的反馈。');
      // Reset form
      setFormData({
        name: '',
        email: '',
        feedback: '',
        preferences: '',
        newsletter: false
      });
    } else {
      addNotification('表单包含错误，请检查并重新提交。');
    }
  };

  const demoSections = [
    {
      id: 'visual',
      title: '视觉无障碍',
      icon: <Eye className="h-4 w-4" />,
      description: '针对视觉障碍用户的功能',
    },
    {
      id: 'auditory',
      title: '听觉无障碍',
      icon: <Ear className="h-4 w-4" />,
      description: '针对听觉障碍用户的功能',
    },
    {
      id: 'motor',
      title: '运动无障碍',
      icon: <Hand className="h-4 w-4" />,
      description: '针对运动障碍用户的功能',
    },
    {
      id: 'cognitive',
      title: '认知无障碍',
      icon: <Brain className="h-4 w-4" />,
      description: '针对认知障碍用户的功能',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Skip Links */}
      <SkipLink href="#main-content">跳转到主要内容</SkipLink>
      <SkipLink href="#navigation">跳转到导航</SkipLink>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto py-8 px-4 space-y-8" tabIndex={-1}>
        <div className="text-center space-y-4">
          <AccessibleHeading level={1}>
            无障碍功能演示
          </AccessibleHeading>
          <p className="text-muted-foreground text-lg">
            展示平台的无障碍设计和多语言支持功能
          </p>
          <Button onClick={() => addNotification('欢迎来到无障碍功能演示页面')}>
            <Volume2 className="h-4 w-4 mr-2" />
            播放欢迎消息
          </Button>
        </div>

        {/* Live Region for Notifications */}
        {notifications.map((notification, index) => (
          <LiveRegion key={index}>
            {notification}
          </LiveRegion>
        ))}

        {/* Status Messages */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-40 space-y-2 max-w-sm">
            {notifications.map((notification, index) => (
              <StatusMessage key={index} type="info" className="animate-in slide-in-from-right">
                {notification}
              </StatusMessage>
            ))}
          </div>
        )}

        <nav id="navigation" aria-label="无障碍功能导航">
          <AccessibleHeading level={2}>功能分类</AccessibleHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {demoSections.map((section) => (
              <Focusable
                key={section.id}
                role="button"
                aria-label={`切换到${section.title}演示`}
                className="cursor-pointer"
                onFocus={() => setCurrentDemo(section.id)}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      {section.icon}
                    </div>
                    <AccessibleHeading level={3} className="text-lg">
                      {section.title}
                    </AccessibleHeading>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  </CardContent>
                </Card>
              </Focusable>
            ))}
          </div>
        </nav>

        <Tabs defaultValue="wcag" className="space-y-6">
          <TabsList 
            className="grid w-full grid-cols-2 md:grid-cols-4"
            aria-label="无障碍功能标签"
          >
            <TabsTrigger value="wcag">WCAG 合规</TabsTrigger>
            <TabsTrigger value="forms">表单无障碍</TabsTrigger>
            <TabsTrigger value="navigation">导航辅助</TabsTrigger>
            <TabsTrigger value="multimedia">多媒体支持</TabsTrigger>
          </TabsList>

          <TabsContent value="wcag" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WCAG 2.1 AA 标准演示</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Contrast */}
                <section aria-labelledby="contrast-heading">
                  <AccessibleHeading level={3} id="contrast-heading">
                    颜色对比度
                  </AccessibleHeading>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Card className="bg-background border-2">
                      <CardContent className="p-4 text-center">
                        <p className="text-foreground">标准对比度文本</p>
                        <Badge variant="outline">对比度: 4.5:1</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted">
                      <CardContent className="p-4 text-center">
                        <p className="text-muted-foreground">次要文本</p>
                        <Badge variant="secondary">对比度: 3:1</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-primary">
                      <CardContent className="p-4 text-center">
                        <p className="text-primary-foreground">高对比度文本</p>
                        <Badge variant="outline" className="bg-background text-foreground">
                          对比度: 7:1
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator />

                {/* Keyboard Navigation */}
                <section aria-labelledby="keyboard-heading">
                  <AccessibleHeading level={3} id="keyboard-heading">
                    键盘导航演示
                  </AccessibleHeading>
                  <p className="text-sm text-muted-foreground mb-4">
                    使用 Tab 键可以在以下元素间导航：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button tabIndex={0}>按钮 1</Button>
                    <Button variant="outline" tabIndex={0}>按钮 2</Button>
                    <Button variant="secondary" tabIndex={0}>按钮 3</Button>
                    <Input placeholder="可聚焦输入框" className="w-40" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    使用 Shift + Tab 可以反向导航
                  </p>
                </section>

                <Separator />

                {/* Progress Indicator */}
                <section aria-labelledby="progress-heading">
                  <AccessibleHeading level={3} id="progress-heading">
                    进度指示器
                  </AccessibleHeading>
                  <AccessibleProgressBar
                    value={progress}
                    label="演示进度"
                    className="mt-4"
                  />
                </section>

                <Separator />

                {/* Semantic HTML */}
                <section aria-labelledby="semantic-heading">
                  <AccessibleHeading level={3} id="semantic-heading">
                    语义化 HTML
                  </AccessibleHeading>
                  <div className="space-y-4">
                    <article className="border rounded-lg p-4">
                      <header>
                        <AccessibleHeading level={4}>文章标题</AccessibleHeading>
                        <p className="text-sm text-muted-foreground">
                          发布时间: <time dateTime="2024-01-01">2024年1月1日</time>
                        </p>
                      </header>
                      <p className="mt-2">
                        这是一个使用语义化 HTML 标签的文章示例，包含正确的标题层级、时间标签等。
                      </p>
                      <footer className="mt-2 text-sm text-muted-foreground">
                        作者: 示例作者
                      </footer>
                    </article>
                  </div>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>无障碍表单演示</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">基本信息</legend>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="required">
                        姓名 <span aria-label="必填项">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        aria-required="true"
                        aria-invalid={!!formErrors.name}
                        aria-describedby={formErrors.name ? "name-error" : "name-help"}
                      />
                      <p id="name-help" className="text-xs text-muted-foreground">
                        请输入您的真实姓名
                      </p>
                      {formErrors.name && (
                        <p id="name-error" className="text-xs text-destructive" role="alert">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="required">
                        邮箱地址 <span aria-label="必填项">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        aria-required="true"
                        aria-invalid={!!formErrors.email}
                        aria-describedby={formErrors.email ? "email-error" : "email-help"}
                      />
                      <p id="email-help" className="text-xs text-muted-foreground">
                        我们将使用此邮箱与您联系
                      </p>
                      {formErrors.email && (
                        <p id="email-error" className="text-xs text-destructive" role="alert">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold">偏好设置</legend>
                    
                    <div className="space-y-2">
                      <Label>通知偏好</Label>
                      <RadioGroup
                        value={formData.preferences}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, preferences: value }))}
                        aria-labelledby="preferences-label"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="pref-email" />
                          <Label htmlFor="pref-email">仅邮件通知</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="sms" id="pref-sms" />
                          <Label htmlFor="pref-sms">仅短信通知</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="pref-both" />
                          <Label htmlFor="pref-both">邮件和短信</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="pref-none" />
                          <Label htmlFor="pref-none">不接收通知</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, newsletter: !!checked }))
                        }
                      />
                      <Label htmlFor="newsletter">订阅新闻通讯</Label>
                    </div>
                  </fieldset>

                  <div className="space-y-2">
                    <Label htmlFor="feedback" className="required">
                      反馈内容 <span aria-label="必填项">*</span>
                    </Label>
                    <Textarea
                      id="feedback"
                      value={formData.feedback}
                      onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                      placeholder="请输入您的反馈..."
                      aria-required="true"
                      aria-invalid={!!formErrors.feedback}
                      aria-describedby={formErrors.feedback ? "feedback-error" : "feedback-help"}
                      rows={4}
                    />
                    <p id="feedback-help" className="text-xs text-muted-foreground">
                      请详细描述您的反馈内容，至少 10 个字符
                    </p>
                    {formErrors.feedback && (
                      <p id="feedback-error" className="text-xs text-destructive" role="alert">
                        {formErrors.feedback}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      提交反馈
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          name: '',
                          email: '',
                          feedback: '',
                          preferences: '',
                          newsletter: false
                        });
                        setFormErrors({});
                        addNotification('表单已重置');
                      }}
                    >
                      重置表单
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>导航辅助功能</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section aria-labelledby="breadcrumb-heading">
                  <AccessibleHeading level={3} id="breadcrumb-heading">
                    面包屑导航
                  </AccessibleHeading>
                  <nav aria-label="面包屑导航">
                    <ol className="flex items-center space-x-2 text-sm">
                      <li><a href="/" className="hover:underline">首页</a></li>
                      <li aria-hidden="true">›</li>
                      <li><a href="/demos" className="hover:underline">演示页面</a></li>
                      <li aria-hidden="true">›</li>
                      <li aria-current="page" className="text-muted-foreground">无障碍功能</li>
                    </ol>
                  </nav>
                </section>

                <Separator />

                <section aria-labelledby="landmarks-heading">
                  <AccessibleHeading level={3} id="landmarks-heading">
                    页面结构地标
                  </AccessibleHeading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">主要地标</h4>
                        <ul className="text-sm space-y-1">
                          <li><code>&lt;header&gt;</code> - 页面头部</li>
                          <li><code>&lt;nav&gt;</code> - 导航区域</li>
                          <li><code>&lt;main&gt;</code> - 主要内容</li>
                          <li><code>&lt;aside&gt;</code> - 侧边栏</li>
                          <li><code>&lt;footer&gt;</code> - 页面底部</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">ARIA 地标</h4>
                        <ul className="text-sm space-y-1">
                          <li><code>role="banner"</code> - 页面标题</li>
                          <li><code>role="navigation"</code> - 导航</li>
                          <li><code>role="main"</code> - 主内容</li>
                          <li><code>role="complementary"</code> - 补充内容</li>
                          <li><code>role="contentinfo"</code> - 页面信息</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <Separator />

                <section aria-labelledby="skip-links-heading">
                  <AccessibleHeading level={3} id="skip-links-heading">
                    跳转链接
                  </AccessibleHeading>
                  <p className="text-sm text-muted-foreground mb-4">
                    按 Tab 键可以看到页面顶部的跳转链接，帮助键盘用户快速导航到主要内容区域。
                  </p>
                  <Button onClick={skipToContent} variant="outline">
                    <Keyboard className="h-4 w-4 mr-2" />
                    演示跳转到主内容
                  </Button>
                </section>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="multimedia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>多媒体无障碍支持</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <section aria-labelledby="media-controls-heading">
                  <AccessibleHeading level={3} id="media-controls-heading">
                    媒体控制器
                  </AccessibleHeading>
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">音频播放器演示</h4>
                      <Badge variant="outline">可访问</Badge>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button size="sm" aria-label="播放/暂停">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" aria-label="下一首">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-medium">示例音频文件</div>
                        <AccessibleProgressBar
                          value={45}
                          label="播放进度"
                          showPercentage={false}
                        />
                      </div>
                      <Button size="sm" variant="outline" aria-label="静音">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </section>

                <Separator />

                <section aria-labelledby="captions-heading">
                  <AccessibleHeading level={3} id="captions-heading">
                    字幕和转录支持
                  </AccessibleHeading>
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <h4 className="font-medium mb-4">视频播放器演示</h4>
                    <div className="aspect-video bg-background rounded border mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">视频播放区域</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        开启字幕
                      </Button>
                      <Button size="sm" variant="outline">
                        音频描述
                      </Button>
                      <Button size="sm" variant="outline">
                        手语翻译
                      </Button>
                      <Button size="sm" variant="outline">
                        转录文本
                      </Button>
                    </div>
                  </div>
                </section>

                <Separator />

                <section aria-labelledby="alternatives-heading">
                  <AccessibleHeading level={3} id="alternatives-heading">
                    替代内容
                  </AccessibleHeading>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">图片替代文本</h4>
                        <div className="space-y-2">
                          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              [图片: 无障碍设计示意图]
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            alt="一个展示网页无障碍设计原则的示意图，包含键盘导航、屏幕阅读器支持等元素"
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">长描述</h4>
                        <div className="space-y-2">
                          <div className="w-full h-32 bg-muted rounded flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              [复杂图表]
                            </span>
                          </div>
                          <Button size="sm" variant="outline">
                            查看详细描述
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Accessibility Panel */}
      <AccessibilityPanel />
    </div>
  );
};

export default AccessibilityDemo;