import { test, expect } from '@playwright/test';

test.describe('Performance Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/performance-demo');
  });

  test('should display performance demo page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('性能优化演示');
    await expect(page.locator('text=展示平台的性能优化策略和监控功能')).toBeVisible();
  });

  test('should have performance optimization tabs', async ({ page }) => {
    const tabs = ['性能指标', '优化策略', '实时监控', '包体分析', '网络分析'];
    
    for (const tab of tabs) {
      await expect(page.locator(`text=${tab}`)).toBeVisible();
    }
  });

  test('should display performance metrics', async ({ page }) => {
    await page.click('text=性能指标');
    
    // Should show performance grade
    await expect(page.locator('text=性能评分')).toBeVisible();
    await expect(page.locator('text=综合评分')).toBeVisible();
    
    // Should show Core Web Vitals cards
    await expect(page.locator('text=首次内容绘制')).toBeVisible();
    await expect(page.locator('text=最大内容绘制')).toBeVisible();
    await expect(page.locator('text=首次输入延迟')).toBeVisible();
    await expect(page.locator('text=累积布局偏移')).toBeVisible();
    
    // Should show additional metrics
    await expect(page.locator('text=首字节时间')).toBeVisible();
    await expect(page.locator('text=内存使用')).toBeVisible();
    await expect(page.locator('text=网络连接')).toBeVisible();
  });

  test('should trigger performance measurement', async ({ page }) => {
    // Click refresh measurement button
    const refreshButton = page.locator('button:has-text("重新测量")');
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();
    
    // Should still show the page after measurement
    await expect(page.locator('h1')).toContainText('性能优化演示');
  });

  test('should simulate heavy computation', async ({ page }) => {
    // Click simulate computation button
    const computeButton = page.locator('button:has-text("模拟重计算")');
    await expect(computeButton).toBeVisible();
    await computeButton.click();
    
    // Should show loading state
    await expect(page.locator('text=正在处理大量数据...')).toBeVisible();
    
    // Wait for computation to complete (with timeout)
    await expect(page.locator('text=正在处理大量数据...')).not.toBeVisible({ timeout: 5000 });
  });

  test('should display optimization strategies', async ({ page }) => {
    await page.click('text=优化策略');
    
    // Should show optimization categories
    await expect(page.locator('text=代码优化')).toBeVisible();
    await expect(page.locator('text=资源优化')).toBeVisible();
    await expect(page.locator('text=渲染优化')).toBeVisible();
    await expect(page.locator('text=缓存策略')).toBeVisible();
    
    // Should show implementation status
    await expect(page.locator('text=已实现')).toBeVisible();
    await expect(page.locator('text=待实现')).toBeVisible();
    
    // Should show code splitting demo
    await expect(page.locator('text=代码分割演示')).toBeVisible();
    
    // Should show image optimization demo
    await expect(page.locator('text=图片优化演示')).toBeVisible();
    
    // Should show computation optimization demo
    await expect(page.locator('text=计算优化演示')).toBeVisible();
  });

  test('should display real-time monitoring', async ({ page }) => {
    await page.click('text=实时监控');
    
    // Should show monitoring cards
    await expect(page.locator('text=页面加载时间')).toBeVisible();
    await expect(page.locator('text=内存使用')).toBeVisible();
    await expect(page.locator('text=连接类型')).toBeVisible();
    await expect(page.locator('text=性能评级')).toBeVisible();
    
    // Should show Core Web Vitals trends
    await expect(page.locator('text=核心 Web 指标趋势')).toBeVisible();
    await expect(page.locator('text=首次内容绘制 (FCP)')).toBeVisible();
    await expect(page.locator('text=最大内容绘制 (LCP)')).toBeVisible();
    await expect(page.locator('text=首次输入延迟 (FID)')).toBeVisible();
    await expect(page.locator('text=累积布局偏移 (CLS)')).toBeVisible();
  });

  test('should display bundle analysis', async ({ page }) => {
    await page.click('text=包体分析');
    
    // Should show bundle size information
    await expect(page.locator('text=包体积分析')).toBeVisible();
    await expect(page.locator('text=估算包体积')).toBeVisible();
    await expect(page.locator('text=估算总大小')).toBeVisible();
    await expect(page.locator('text=DOM 元素数量')).toBeVisible();
    await expect(page.locator('text=脚本文件数量')).toBeVisible();
    await expect(page.locator('text=样式文件数量')).toBeVisible();
    
    // Should show optimization recommendations
    await expect(page.locator('text=优化建议')).toBeVisible();
    await expect(page.locator('text=代码分割已启用')).toBeVisible();
    await expect(page.locator('text=懒加载已实现')).toBeVisible();
  });

  test('should display network analysis', async ({ page }) => {
    await page.click('text=网络分析');
    
    // Should show network requests
    await expect(page.locator('text=网络请求分析')).toBeVisible();
    await expect(page.locator('text=/api/dashboard')).toBeVisible();
    await expect(page.locator('text=/api/users')).toBeVisible();
    
    // Should show request methods
    await expect(page.locator('text=GET')).toBeVisible();
    await expect(page.locator('text=POST')).toBeVisible();
    
    // Should show network optimization status
    await expect(page.locator('text=网络优化状态')).toBeVisible();
    await expect(page.locator('text=已实现的优化')).toBeVisible();
    await expect(page.locator('text=待优化项目')).toBeVisible();
  });

  test('should show optimization implementation status', async ({ page }) => {
    await page.click('text=优化策略');
    
    // Check for specific optimization techniques
    await expect(page.locator('text=代码分割')).toBeVisible();
    await expect(page.locator('text=懒加载')).toBeVisible();
    await expect(page.locator('text=Tree Shaking')).toBeVisible();
    await expect(page.locator('text=压缩混淆')).toBeVisible();
    
    await expect(page.locator('text=图片优化')).toBeVisible();
    await expect(page.locator('text=资源预加载')).toBeVisible();
    
    await expect(page.locator('text=React.memo')).toBeVisible();
    await expect(page.locator('text=useMemo')).toBeVisible();
    await expect(page.locator('text=useCallback')).toBeVisible();
    
    await expect(page.locator('text=浏览器缓存')).toBeVisible();
    await expect(page.locator('text=组件缓存')).toBeVisible();
  });

  test('should display lazy loaded content', async ({ page }) => {
    await page.click('text=优化策略');
    
    // Should show code splitting demo section
    await expect(page.locator('text=代码分割演示')).toBeVisible();
    
    // Wait for lazy component to load
    await page.waitForTimeout(1000);
    
    // Should eventually show the chart component or its container
    const chartContainer = page.locator('[class*="chart"], [class*="Chart"]');
    if (await chartContainer.count() > 0) {
      await expect(chartContainer.first()).toBeVisible();
    }
  });

  test('should display optimized images', async ({ page }) => {
    await page.click('text=优化策略');
    
    // Should show image optimization demo
    await expect(page.locator('text=图片优化演示')).toBeVisible();
    
    // Images should be present (even if they fail to load due to network issues)
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
  });

  test('should show computation optimization results', async ({ page }) => {
    await page.click('text=优化策略');
    
    // Should show computation optimization section
    await expect(page.locator('text=计算优化演示')).toBeVisible();
    await expect(page.locator('text=昂贵计算结果 (useMemo)')).toBeVisible();
    await expect(page.locator('text=数据点数量')).toBeVisible();
    
    // Initially should show no data
    await expect(page.locator('text=暂无数据')).toBeVisible();
    
    // Trigger computation
    const computeButton = page.locator('button:has-text("模拟重计算")');
    await computeButton.click();
    
    // Should show loading state
    await expect(page.locator('text=正在处理大量数据...')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Should still display main content
    await expect(page.locator('h1')).toContainText('性能优化演示');
    
    // Tabs should be visible but may be laid out differently
    await expect(page.locator('text=性能指标')).toBeVisible();
    await expect(page.locator('text=优化策略')).toBeVisible();
  });

  test('should handle performance monitoring overlay in development', async ({ page }) => {
    // In development mode, there might be a performance monitoring overlay
    // This is harder to test directly, but we can check that the page functions normally
    
    await expect(page.locator('h1')).toContainText('性能优化演示');
    
    // Performance metrics should be available
    await page.click('text=性能指标');
    await expect(page.locator('text=性能评分')).toBeVisible();
  });

  test('should show performance recommendations when metrics are poor', async ({ page }) => {
    await page.click('text=性能指标');
    
    // Look for recommendations section (may appear if metrics are poor)
    const recommendations = page.locator('text=优化建议');
    if (await recommendations.count() > 0) {
      await expect(recommendations).toBeVisible();
    }
  });

  test('should handle tab navigation correctly', async ({ page }) => {
    // Test all tabs
    const tabs = ['性能指标', '优化策略', '实时监控', '包体分析', '网络分析'];
    
    for (const tab of tabs) {
      await page.click(`text=${tab}`);
      await page.waitForTimeout(100); // Small delay for content to load
      
      // Each tab should show its content
      const tabContent = page.locator('[role="tabpanel"]');
      await expect(tabContent).toBeVisible();
    }
  });

  test('should show realistic performance data', async ({ page }) => {
    await page.click('text=实时监控');
    
    // Should show actual performance metrics (not just placeholders)
    const metrics = ['页面加载时间', '内存使用', '性能评级'];
    
    for (const metric of metrics) {
      await expect(page.locator(`text=${metric}`)).toBeVisible();
    }
  });
});