import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  PerformanceDashboard,
  OptimizedImage,
  LazyComponent,
  PerformanceMonitor,
  createAsyncComponent,
  withPerformanceTracking
} from '@/components/ui/performance';
import { LoadingSpinner, Skeleton } from '@/components/ui/loading';
import { usePerformance } from '@/hooks/usePerformance';
import { 
  Gauge, 
  Zap, 
  Database, 
  Image as ImageIcon, 
  Code, 
  Network,
  RefreshCw,
  Download,
  Upload,
  Clock,
  MemoryStick,
  Cpu
} from 'lucide-react';

// Async component for code splitting demo
const AsyncHeavyComponent = createAsyncComponent(
  () => import('../components/charts/SimpleChart').then(module => ({ 
    default: withPerformanceTracking(module.SimpleChart, 'AsyncHeavyComponent')
  }))
);

const PerformanceDemo: React.FC = () => {
  const { metrics, getPerformanceGrade, measureCoreWebVitals } = usePerformance();
  const [simulatingLoad, setSimulatingLoad] = useState(false);
  const [heavyData, setHeavyData] = useState<number[]>([]);
  const [bundleSize, setBundleSize] = useState<number>(0);
  const [networkRequests, setNetworkRequests] = useState<any[]>([]);

  // Simulate heavy computation
  const simulateHeavyComputation = useCallback(() => {
    setSimulatingLoad(true);
    
    // Simulate heavy work
    setTimeout(() => {
      const data = Array.from({ length: 1000 }, (_, i) => Math.sin(i / 100) * 100);
      setHeavyData(data);
      setSimulatingLoad(false);
    }, 2000);
  }, []);

  // Memoized expensive calculation
  const expensiveCalculation = useMemo(() => {
    if (heavyData.length === 0) return 0;
    return heavyData.reduce((sum, value) => sum + Math.abs(value), 0) / heavyData.length;
  }, [heavyData]);

  // Calculate bundle size estimation
  useEffect(() => {
    // Estimate bundle size based on DOM elements
    const elements = document.querySelectorAll('*').length;
    const scripts = document.querySelectorAll('script').length;
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]').length;
    
    // Rough estimation
    const estimatedSize = (elements * 0.1) + (scripts * 10) + (styles * 5);
    setBundleSize(estimatedSize);
  }, []);

  // Monitor network requests
  useEffect(() => {
    const requests: any[] = [];
    
    // Mock some network requests for demo
    const mockRequests = [
      { url: '/api/dashboard', method: 'GET', size: 15.2, time: 234 },
      { url: '/api/users', method: 'GET', size: 8.7, time: 156 },
      { url: '/api/analytics', method: 'POST', size: 3.4, time: 89 },
      { url: '/assets/image.jpg', method: 'GET', size: 245.6, time: 567 },
    ];
    
    setNetworkRequests(mockRequests);
  }, []);

  const grade = getPerformanceGrade();

  const optimizationTechniques = [
    {
      category: '代码优化',
      techniques: [
        { name: '代码分割', description: '按需加载组件，减少初始包体积', implemented: true },
        { name: '懒加载', description: '延迟加载非关键资源', implemented: true },
        { name: 'Tree Shaking', description: '移除未使用的代码', implemented: true },
        { name: '压缩混淆', description: '压缩JavaScript和CSS文件', implemented: true },
      ]
    },
    {
      category: '资源优化',
      techniques: [
        { name: '图片优化', description: '使用WebP格式，响应式图片', implemented: true },
        { name: 'CDN加速', description: '使用内容分发网络', implemented: false },
        { name: '资源预加载', description: '预加载关键资源', implemented: true },
        { name: 'HTTP/2', description: '使用HTTP/2协议', implemented: false },
      ]
    },
    {
      category: '渲染优化',
      techniques: [
        { name: 'React.memo', description: '避免不必要的重新渲染', implemented: true },
        { name: 'useMemo', description: '缓存昂贵的计算结果', implemented: true },
        { name: 'useCallback', description: '缓存函数引用', implemented: true },
        { name: '虚拟滚动', description: '只渲染可见区域的内容', implemented: false },
      ]
    },
    {
      category: '缓存策略',
      techniques: [
        { name: '浏览器缓存', description: '设置合适的缓存头', implemented: true },
        { name: 'Service Worker', description: '实现离线缓存', implemented: false },
        { name: '数据缓存', description: '缓存API响应数据', implemented: false },
        { name: '组件缓存', description: '缓存组件渲染结果', implemented: true },
      ]
    }
  ];

  return (
    <PerformanceMonitor>
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl md:text-4xl font-bold">性能优化演示</h1>
          <p className="text-muted-foreground">
            展示平台的性能优化策略和监控功能
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={measureCoreWebVitals} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              重新测量
            </Button>
            <Button onClick={simulateHeavyComputation} disabled={simulatingLoad}>
              {simulatingLoad ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Cpu className="h-4 w-4 mr-2" />
              )}
              模拟重计算
            </Button>
          </div>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="metrics">性能指标</TabsTrigger>
            <TabsTrigger value="optimization">优化策略</TabsTrigger>
            <TabsTrigger value="monitoring">实时监控</TabsTrigger>
            <TabsTrigger value="bundle">包体分析</TabsTrigger>
            <TabsTrigger value="network">网络分析</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <PerformanceDashboard />
          </TabsContent>

          <TabsContent value="optimization">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>优化技术实现状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {optimizationTechniques.map((category) => (
                      <div key={category.category} className="space-y-4">
                        <h3 className="text-lg font-semibold">{category.category}</h3>
                        <div className="space-y-3">
                          {category.techniques.map((technique) => (
                            <div key={technique.name} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium">{technique.name}</h4>
                                <p className="text-sm text-muted-foreground">{technique.description}</p>
                              </div>
                              <Badge 
                                variant={technique.implemented ? 'default' : 'secondary'}
                                className={technique.implemented ? 'bg-green-100 text-green-800' : ''}
                              >
                                {technique.implemented ? '已实现' : '待实现'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>代码分割演示</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    点击下方按钮动态加载图表组件，演示代码分割效果
                  </p>
                  <LazyComponent fallback={<Skeleton className="w-full h-64" />}>
                    <AsyncHeavyComponent 
                      data={[
                        { name: '1月', value: 400 },
                        { name: '2月', value: 300 },
                        { name: '3月', value: 500 },
                        { name: '4月', value: 200 },
                        { name: '5月', value: 600 },
                      ]}
                    />
                  </LazyComponent>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>图片优化演示</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }, (_, i) => (
                      <OptimizedImage
                        key={i}
                        src={`https://picsum.photos/300/200?random=${i}`}
                        alt={`优化图片 ${i + 1}`}
                        className="aspect-video rounded-lg"
                        priority={i < 2}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>计算优化演示</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>昂贵计算结果 (useMemo):</span>
                    <Badge variant="outline">
                      {heavyData.length > 0 ? expensiveCalculation.toFixed(2) : '暂无数据'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>数据点数量:</span>
                    <Badge variant="outline">{heavyData.length.toLocaleString()}</Badge>
                  </div>
                  {simulatingLoad && (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm">正在处理大量数据...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>实时性能监控</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">
                        {metrics.pageLoad ? (metrics.pageLoad / 1000).toFixed(2) : '--'}s
                      </div>
                      <div className="text-sm text-muted-foreground">页面加载时间</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <MemoryStick className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">
                        {metrics.memoryUsage ? metrics.memoryUsage.toFixed(1) : '--'}MB
                      </div>
                      <div className="text-sm text-muted-foreground">内存使用</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <Network className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold">
                        {metrics.connectionType || '--'}
                      </div>
                      <div className="text-sm text-muted-foreground">连接类型</div>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <Gauge className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <div className="text-2xl font-bold">{grade.grade}</div>
                      <div className="text-sm text-muted-foreground">性能评级</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>核心 Web 指标趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>首次内容绘制 (FCP)</span>
                        <span>{metrics.fcp ? (metrics.fcp / 1000).toFixed(2) + 's' : '--'}</span>
                      </div>
                      <Progress 
                        value={metrics.fcp ? Math.min((1800 / metrics.fcp) * 100, 100) : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>最大内容绘制 (LCP)</span>
                        <span>{metrics.lcp ? (metrics.lcp / 1000).toFixed(2) + 's' : '--'}</span>
                      </div>
                      <Progress 
                        value={metrics.lcp ? Math.min((2500 / metrics.lcp) * 100, 100) : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>首次输入延迟 (FID)</span>
                        <span>{metrics.fid ? metrics.fid.toFixed(0) + 'ms' : '--'}</span>
                      </div>
                      <Progress 
                        value={metrics.fid ? Math.min((100 / metrics.fid) * 100, 100) : 0} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>累积布局偏移 (CLS)</span>
                        <span>{metrics.cls ? (metrics.cls * 1000).toFixed(0) + '‰' : '--'}</span>
                      </div>
                      <Progress 
                        value={metrics.cls ? Math.min((0.1 / metrics.cls) * 100, 100) : 0} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bundle">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>包体积分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">估算包体积</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>估算总大小:</span>
                          <Badge variant="outline">{bundleSize.toFixed(1)} KB</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>DOM 元素数量:</span>
                          <Badge variant="outline">{document.querySelectorAll('*').length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>脚本文件数量:</span>
                          <Badge variant="outline">{document.querySelectorAll('script').length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>样式文件数量:</span>
                          <Badge variant="outline">{document.querySelectorAll('style, link[rel="stylesheet"]').length}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">优化建议</h3>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          ✅ 代码分割已启用
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          ✅ 懒加载已实现
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                          ⚠️ 可考虑使用 CDN 加速
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          💡 建议启用 gzip 压缩
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="network">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>网络请求分析</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {networkRequests.map((request, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={request.method === 'GET' ? 'default' : 'secondary'}>
                            {request.method}
                          </Badge>
                          <span className="font-mono text-sm">{request.url}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {request.size} KB
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {request.time} ms
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>网络优化状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">已实现的优化</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>HTTP/2 多路复用</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>资源预加载</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>图片懒加载</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">待优化项目</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>CDN 部署</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>Service Worker</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span>API 响应缓存</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PerformanceMonitor>
  );
};

export default PerformanceDemo;