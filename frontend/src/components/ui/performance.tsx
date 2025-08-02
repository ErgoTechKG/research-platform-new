import React, { useState, useEffect, memo, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/loading';
import { 
  Activity, 
  Zap, 
  Clock, 
  Monitor, 
  Wifi, 
  HardDrive,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePerformance } from '@/hooks/usePerformance';

// Simple Chart Component (inline)
const SimpleChart: React.FC<{ data: any[] }> = ({ data }) => (
  <div className="h-32 w-full bg-muted rounded flex items-center justify-center">
    <span className="text-sm text-muted-foreground">简单图表组件</span>
  </div>
);


interface PerformanceCardProps {
  title: string;
  value: number | null;
  unit: string;
  threshold: { good: number; fair: number };
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = memo(({
  title,
  value,
  unit,
  threshold,
  icon,
  description,
  className
}) => {
  const getStatus = () => {
    if (value === null) return { status: 'unknown', color: 'gray' };
    if (value <= threshold.good) return { status: 'good', color: 'green' };
    if (value <= threshold.fair) return { status: 'fair', color: 'yellow' };
    return { status: 'poor', color: 'red' };
  };

  const { status, color } = getStatus();
  const statusLabels = {
    good: '优秀',
    fair: '需要改进',
    poor: '较差',
    unknown: '未知'
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value !== null ? `${value.toFixed(1)}${unit}` : '测量中...'}
        </div>
        <div className="flex items-center justify-between mt-2">
          <Badge 
            variant={status === 'good' ? 'default' : status === 'fair' ? 'secondary' : 'destructive'}
            className={cn(
              status === 'good' && 'bg-green-100 text-green-800',
              status === 'fair' && 'bg-yellow-100 text-yellow-800',
              status === 'poor' && 'bg-red-100 text-red-800'
            )}
          >
            {statusLabels[status as keyof typeof statusLabels]}
          </Badge>
          {status === 'good' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : status === 'poor' ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
});

PerformanceCard.displayName = 'PerformanceCard';

interface PerformanceDashboardProps {
  className?: string;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ className }) => {
  const { metrics, getPerformanceGrade, getRecommendations } = usePerformance();
  const grade = getPerformanceGrade();
  const recommendations = getRecommendations();

  return (
    <div className={cn('space-y-6', className)}>
      {/* Performance Grade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            性能评分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold">{grade.grade}</div>
              <div className="text-sm text-muted-foreground">
                综合评分: {grade.score.toFixed(0)}分
              </div>
            </div>
            <div className="text-right">
              <Progress value={grade.score} className="w-32" />
              <div className="text-xs text-muted-foreground mt-1">
                基于 Core Web Vitals
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PerformanceCard
          title="首次内容绘制"
          value={metrics.fcp ? metrics.fcp / 1000 : null}
          unit="s"
          threshold={{ good: 1.8, fair: 3.0 }}
          icon={<Zap className="h-4 w-4" />}
          description="页面首次渲染任何内容的时间"
        />
        
        <PerformanceCard
          title="最大内容绘制"
          value={metrics.lcp ? metrics.lcp / 1000 : null}
          unit="s"
          threshold={{ good: 2.5, fair: 4.0 }}
          icon={<Monitor className="h-4 w-4" />}
          description="页面主要内容完成渲染的时间"
        />
        
        <PerformanceCard
          title="首次输入延迟"
          value={metrics.fid}
          unit="ms"
          threshold={{ good: 100, fair: 300 }}
          icon={<Clock className="h-4 w-4" />}
          description="用户首次交互到浏览器响应的时间"
        />
        
        <PerformanceCard
          title="累积布局偏移"
          value={metrics.cls ? metrics.cls * 1000 : null}
          unit="‰"
          threshold={{ good: 100, fair: 250 }}
          icon={<TrendingDown className="h-4 w-4" />}
          description="页面加载过程中布局稳定性指标"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PerformanceCard
          title="首字节时间"
          value={metrics.ttfb ? metrics.ttfb / 1000 : null}
          unit="s"
          threshold={{ good: 0.8, fair: 1.8 }}
          icon={<Wifi className="h-4 w-4" />}
          description="服务器响应时间"
        />
        
        <PerformanceCard
          title="内存使用"
          value={metrics.memoryUsage}
          unit="MB"
          threshold={{ good: 30, fair: 50 }}
          icon={<HardDrive className="h-4 w-4" />}
          description="JavaScript堆内存使用量"
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">网络连接</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.connectionType || '未知'}
            </div>
            <Badge variant="outline" className="mt-2">
              连接类型
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>优化建议</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<ImageOptimizerProps> = memo(({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  if (error) {
    return (
      <div className={cn('bg-muted rounded flex items-center justify-center', className)}>
        <span className="text-muted-foreground text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn(
          'transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <Skeleton className="w-full h-32" />,
  className
}) => {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
};

interface PerformanceMonitorProps {
  onPerformanceChange?: (metrics: any) => void;
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onPerformanceChange,
  children
}) => {
  const { metrics } = usePerformance();

  useEffect(() => {
    onPerformanceChange?.(metrics);
  }, [metrics, onPerformanceChange]);

  // Add performance monitoring overlay in development
  if (import.meta.env.DEV) {
    return (
      <div className="relative">
        {children}
        <div className="fixed bottom-20 right-4 z-50 max-w-xs">
          <Card className="text-xs">
            <CardContent className="p-2">
              <div className="space-y-1">
                {metrics.fcp && (
                  <div>FCP: {(metrics.fcp / 1000).toFixed(2)}s</div>
                )}
                {metrics.lcp && (
                  <div>LCP: {(metrics.lcp / 1000).toFixed(2)}s</div>
                )}
                {metrics.memoryUsage && (
                  <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Code splitting utility
export function createAsyncComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return React.lazy(() => importFunc());
}

// Performance optimization HOC
export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const startTime = Date.now();
    
    useEffect(() => {
      const endTime = Date.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`Component ${componentName} took ${renderTime}ms to render`);
      }
    });

    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;
  return WrappedComponent;
}