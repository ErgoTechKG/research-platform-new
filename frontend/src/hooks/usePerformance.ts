import { useState, useEffect, useCallback, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  domLoad: number | null; // DOM Load Time
  pageLoad: number | null; // Page Load Time
  memoryUsage: number | null; // Memory Usage
  connectionType: string | null; // Connection Type
}

interface PerformanceEntry {
  timestamp: number;
  url: string;
  metrics: PerformanceMetrics;
  userAgent: string;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domLoad: null,
    pageLoad: null,
    memoryUsage: null,
    connectionType: null,
  });

  const [performanceEntries, setPerformanceEntries] = useState<PerformanceEntry[]>([]);
  const observerRef = useRef<PerformanceObserver | null>(null);

  // Measure Core Web Vitals
  const measureCoreWebVitals = useCallback(() => {
    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;
    if (fcpEntry) {
      setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          if (lastEntry) {
            setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observerRef.current = lcpObserver;
      } catch (error) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart && entry.startTime) {
              const fid = entry.processingStart - entry.startTime;
              setMetrics(prev => ({ ...prev, fid }));
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let cls = 0;
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          });
          setMetrics(prev => ({ ...prev, cls }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observer not supported');
      }
    }

    // Navigation Timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.fetchStart;
      const domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart;
      const pageLoad = navigation.loadEventEnd - navigation.fetchStart;

      setMetrics(prev => ({
        ...prev,
        ttfb,
        domLoad,
        pageLoad,
      }));
    }

    // Memory Usage
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // Convert to MB
      }));
    }

    // Connection Type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setMetrics(prev => ({
        ...prev,
        connectionType: connection.effectiveType || connection.type,
      }));
    }
  }, []);

  // Save performance entry
  const savePerformanceEntry = useCallback(() => {
    const entry: PerformanceEntry = {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: { ...metrics },
      userAgent: navigator.userAgent,
    };

    setPerformanceEntries(prev => {
      const newEntries = [...prev, entry];
      // Keep only the last 50 entries
      return newEntries.slice(-50);
    });

    // Save to localStorage
    try {
      localStorage.setItem('performance-entries', JSON.stringify([entry]));
    } catch (error) {
      console.warn('Failed to save performance entry');
    }
  }, [metrics]);

  // Get performance grade
  const getPerformanceGrade = useCallback(() => {
    let score = 0;
    let totalChecks = 0;

    // FCP (Good: <1.8s, Needs improvement: 1.8s-3s, Poor: >3s)
    if (metrics.fcp !== null) {
      totalChecks++;
      if (metrics.fcp < 1800) score += 100;
      else if (metrics.fcp < 3000) score += 50;
    }

    // LCP (Good: <2.5s, Needs improvement: 2.5s-4s, Poor: >4s)
    if (metrics.lcp !== null) {
      totalChecks++;
      if (metrics.lcp < 2500) score += 100;
      else if (metrics.lcp < 4000) score += 50;
    }

    // FID (Good: <100ms, Needs improvement: 100ms-300ms, Poor: >300ms)
    if (metrics.fid !== null) {
      totalChecks++;
      if (metrics.fid < 100) score += 100;
      else if (metrics.fid < 300) score += 50;
    }

    // CLS (Good: <0.1, Needs improvement: 0.1-0.25, Poor: >0.25)
    if (metrics.cls !== null) {
      totalChecks++;
      if (metrics.cls < 0.1) score += 100;
      else if (metrics.cls < 0.25) score += 50;
    }

    if (totalChecks === 0) return { grade: 'N/A', score: 0, color: 'gray' };

    const averageScore = score / totalChecks;
    
    if (averageScore >= 80) return { grade: 'A', score: averageScore, color: 'green' };
    if (averageScore >= 60) return { grade: 'B', score: averageScore, color: 'yellow' };
    if (averageScore >= 40) return { grade: 'C', score: averageScore, color: 'orange' };
    return { grade: 'D', score: averageScore, color: 'red' };
  }, [metrics]);

  // Performance optimization recommendations
  const getRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    if (metrics.fcp && metrics.fcp > 3000) {
      recommendations.push('优化首次内容绘制时间：减少关键资源大小，启用资源预加载');
    }

    if (metrics.lcp && metrics.lcp > 4000) {
      recommendations.push('优化最大内容绘制时间：优化图片加载，减少服务器响应时间');
    }

    if (metrics.fid && metrics.fid > 300) {
      recommendations.push('优化首次输入延迟：减少主线程阻塞，优化JavaScript执行');
    }

    if (metrics.cls && metrics.cls > 0.25) {
      recommendations.push('优化累积布局偏移：为图片和视频设置尺寸属性，避免动态内容插入');
    }

    if (metrics.ttfb && metrics.ttfb > 1000) {
      recommendations.push('优化服务器响应时间：使用CDN，优化服务器性能');
    }

    if (metrics.memoryUsage && metrics.memoryUsage > 50) {
      recommendations.push('优化内存使用：清理未使用的变量，避免内存泄漏');
    }

    return recommendations;
  }, [metrics]);

  useEffect(() => {
    // Initial measurement
    measureCoreWebVitals();

    // Measure after page load
    if (document.readyState === 'complete') {
      setTimeout(measureCoreWebVitals, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(measureCoreWebVitals, 1000);
      });
    }

    // Load saved performance entries
    try {
      const saved = localStorage.getItem('performance-entries');
      if (saved) {
        const entries = JSON.parse(saved);
        setPerformanceEntries(entries);
      }
    } catch (error) {
      console.warn('Failed to load performance entries');
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [measureCoreWebVitals]);

  return {
    metrics,
    performanceEntries,
    getPerformanceGrade,
    getRecommendations,
    savePerformanceEntry,
    measureCoreWebVitals,
  };
}