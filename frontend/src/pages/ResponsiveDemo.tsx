import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  ResponsiveGrid,
  MobileMenu,
  CollapsibleSection,
  ResponsiveTable,
  ResponsiveImage,
  TouchFriendlyButton,
  BreakpointIndicator
} from '@/components/ui/responsive';
import { 
  ResponsiveLayout,
  MobileBottomNavigation,
  ResponsiveCardGrid
} from '@/components/layout/ResponsiveLayout';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { 
  Home, 
  Settings, 
  User, 
  Bell, 
  Search,
  FileText,
  BarChart3,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Star,
  Heart,
  Share,
  Download
} from 'lucide-react';

const ResponsiveDemo: React.FC = () => {
  const { currentBreakpoint, isMobile, isTablet, isDesktop, windowWidth } = useBreakpoint();
  const [activeBottomNav, setActiveBottomNav] = useState('home');

  const navigationItems = [
    { id: 'home', label: '首页', icon: <Home className="h-4 w-4" />, href: '/' },
    { id: 'dashboard', label: '仪表盘', icon: <BarChart3 className="h-4 w-4" />, badge: 3 },
    { id: 'documents', label: '文档', icon: <FileText className="h-4 w-4" /> },
    { id: 'calendar', label: '日历', icon: <Calendar className="h-4 w-4" /> },
    { id: 'profile', label: '个人', icon: <User className="h-4 w-4" /> },
  ];

  const bottomNavItems = [
    { id: 'home', label: '首页', icon: <Home className="h-4 w-4" /> },
    { id: 'search', label: '搜索', icon: <Search className="h-4 w-4" /> },
    { id: 'notifications', label: '通知', icon: <Bell className="h-4 w-4" />, badge: 5 },
    { id: 'messages', label: '消息', icon: <Mail className="h-4 w-4" />, badge: 2 },
    { id: 'profile', label: '我的', icon: <User className="h-4 w-4" /> },
  ];

  const tableHeaders = ['姓名', '邮箱', '电话', '状态', '操作'];
  const tableRows = [
    ['张三', 'zhang@example.com', '13812345678', <Badge key="active">活跃</Badge>, <Button key="edit" size="sm">编辑</Button>],
    ['李四', 'li@example.com', '13887654321', <Badge key="inactive" variant="secondary">非活跃</Badge>, <Button key="edit" size="sm">编辑</Button>],
    ['王五', 'wang@example.com', '13898765432', <Badge key="active">活跃</Badge>, <Button key="edit" size="sm">编辑</Button>],
  ];

  const sampleCards = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `项目 ${i + 1}`,
    description: '这是一个示例项目的描述，展示响应式卡片布局的效果。',
    status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'pending' : 'completed',
    author: `用户${i + 1}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString('zh-CN'),
  }));

  const demoContent = (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-4xl font-bold">响应式设计演示</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          展示平台在不同设备和屏幕尺寸下的适配效果
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="outline">当前断点: {currentBreakpoint}</Badge>
          <Badge variant="outline">屏幕宽度: {windowWidth}px</Badge>
          <Badge variant="outline">设备类型: {isMobile ? '移动端' : isTablet ? '平板' : '桌面端'}</Badge>
        </div>
      </div>

      <Tabs defaultValue="layout" className="space-y-6">
        <TabsList className={cn(
          'grid w-full',
          isMobile ? 'grid-cols-2' : 'grid-cols-5'
        )}>
          <TabsTrigger value="layout">布局</TabsTrigger>
          <TabsTrigger value="grid">网格</TabsTrigger>
          {!isMobile && <TabsTrigger value="table">表格</TabsTrigger>}
          {!isMobile && <TabsTrigger value="images">图片</TabsTrigger>}
          <TabsTrigger value="interactions">交互</TabsTrigger>
        </TabsList>

        <TabsContent value="layout">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>响应式布局组件</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">移动端菜单</h3>
                  <MobileMenu
                    title="导航菜单"
                    trigger={<Button variant="outline">打开菜单</Button>}
                  >
                    <div className="space-y-2">
                      {navigationItems.map(item => (
                        <Button key={item.id} variant="ghost" className="w-full justify-start">
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      ))}
                    </div>
                  </MobileMenu>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">可折叠区域</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <CollapsibleSection title="基本信息" defaultOpen={true}>
                      <div className="space-y-3">
                        <Input placeholder="姓名" />
                        <Input placeholder="邮箱" />
                        <Input placeholder="电话" />
                      </div>
                    </CollapsibleSection>
                    
                    <CollapsibleSection title="详细信息" defaultOpen={!isMobile}>
                      <div className="space-y-3">
                        <Input placeholder="地址" />
                        <Input placeholder="公司" />
                        <Input placeholder="职位" />
                      </div>
                    </CollapsibleSection>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grid">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>响应式网格布局</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid
                  cols={{ xs: 1, sm: 2, md: 3, lg: 4, xl: 6 }}
                  gap={4}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <span className="text-primary font-semibold">{i + 1}</span>
                        </div>
                        <p className="text-sm font-medium">项目 {i + 1}</p>
                      </CardContent>
                    </Card>
                  ))}
                </ResponsiveGrid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>自适应卡片网格</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveCardGrid minCardWidth={250} gap={16}>
                  {sampleCards.slice(0, 6).map(card => (
                    <Card key={card.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {card.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant={card.status === 'active' ? 'default' : 'secondary'}
                          >
                            {card.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {card.date}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{card.author}</span>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ResponsiveCardGrid>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {!isMobile && (
          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>响应式表格</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveTable
                  headers={tableHeaders}
                  rows={tableRows}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!isMobile && (
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>响应式图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }, (_, i) => (
                    <ResponsiveImage
                      key={i}
                      src={`https://picsum.photos/400/300?random=${i}`}
                      alt={`示例图片 ${i + 1}`}
                      className="aspect-video"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="interactions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>触摸友好的交互</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">触摸友好按钮</h3>
                  <div className="flex flex-wrap gap-2">
                    <TouchFriendlyButton size="sm">小按钮</TouchFriendlyButton>
                    <TouchFriendlyButton size="md">中等按钮</TouchFriendlyButton>
                    <TouchFriendlyButton size="lg">大按钮</TouchFriendlyButton>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TouchFriendlyButton variant="secondary">次要按钮</TouchFriendlyButton>
                    <TouchFriendlyButton variant="outline">边框按钮</TouchFriendlyButton>
                    <TouchFriendlyButton variant="ghost">幽灵按钮</TouchFriendlyButton>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">移动端表单</h3>
                  <div className="space-y-3">
                    <Input 
                      placeholder="姓名" 
                      className={isMobile ? 'h-12 text-16px' : ''}
                    />
                    <Input 
                      type="email" 
                      placeholder="邮箱地址" 
                      className={isMobile ? 'h-12 text-16px' : ''}
                    />
                    <Input 
                      type="tel" 
                      placeholder="手机号码" 
                      className={isMobile ? 'h-12 text-16px' : ''}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">移动端操作卡片</h3>
                  <div className="space-y-3">
                    {sampleCards.slice(0, 3).map(card => (
                      <Card key={card.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <h4 className="font-medium">{card.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {card.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{card.status}</Badge>
                                <span className="text-xs text-muted-foreground">
                                  {card.author}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 ml-4">
                              <TouchFriendlyButton size="sm" variant="outline">
                                <Star className="h-4 w-4" />
                              </TouchFriendlyButton>
                              <TouchFriendlyButton size="sm" variant="outline">
                                <Download className="h-4 w-4" />
                              </TouchFriendlyButton>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Mobile Bottom Navigation Demo */}
      {isMobile && (
        <Card>
          <CardHeader>
            <CardTitle>移动端底部导航</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              底部导航栏已启用，可以看到页面底部的导航栏
            </p>
            <div className="text-xs text-muted-foreground">
              当前选中: {activeBottomNav}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {isDesktop ? (
        <ResponsiveLayout
          navigation={navigationItems.map(item => ({
            ...item,
            icon: item.icon,
          }))}
          header={
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-semibold">响应式设计演示</h1>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          }
        >
          {demoContent}
        </ResponsiveLayout>
      ) : (
        <div className="container mx-auto py-4 px-4 pb-20">
          {demoContent}
        </div>
      )}

      {/* Mobile bottom navigation */}
      <MobileBottomNavigation
        items={bottomNavItems}
        activeItem={activeBottomNav}
        onItemClick={setActiveBottomNav}
      />

      {/* Breakpoint indicator for development */}
      <BreakpointIndicator />
    </div>
  );
};

export default ResponsiveDemo;