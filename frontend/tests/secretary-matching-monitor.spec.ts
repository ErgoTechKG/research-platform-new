import { test, expect } from '@playwright/test';

test.describe('Secretary Matching Monitor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/secretary-matching-monitor?role=secretary');
  });

  test('should display the main dashboard interface', async ({ page }) => {
    // Check page title and main elements
    await expect(page.locator('h1')).toContainText('实验室轮转匹配监控台');
    await expect(page.locator('text=实时监控匹配进度和异常检测')).toBeVisible();
    
    // Check status badge
    await expect(page.locator('text=在线')).toBeVisible();
    await expect(page.locator('text=最后更新')).toBeVisible();
  });

  test('should display navigation tabs correctly', async ({ page }) => {
    // Check all main tabs
    await expect(page.locator('text=📊 概览')).toBeVisible();
    await expect(page.locator('text=🔍 分析')).toBeVisible();
    await expect(page.locator('text=⚠️ 警报')).toBeVisible();
    await expect(page.locator('text=📈 趋势')).toBeVisible();
    await expect(page.locator('text=🎯 干预')).toBeVisible();

    // Test tab switching
    await page.locator('text=🔍 分析').click();
    await expect(page.locator('text=详细分析')).toBeVisible();
    
    await page.locator('text=📊 概览').click();
    await expect(page.locator('text=实时匹配指标')).toBeVisible();
  });

  test('should display real-time matching metrics', async ({ page }) => {
    // Check matching metrics panel
    await expect(page.locator('text=实时匹配指标')).toBeVisible();
    await expect(page.locator('text=当前轮转周期')).toBeVisible();
    await expect(page.locator('text=Cycle 3 of 6')).toBeVisible();
    await expect(page.locator('text=剩余天数: 14')).toBeVisible();

    // Check matching statistics
    await expect(page.locator('text=匹配统计')).toBeVisible();
    await expect(page.locator('text=总学生数:')).toBeVisible();
    await expect(page.locator('text=247')).toBeVisible();
    await expect(page.locator('text=已匹配:')).toBeVisible();
    await expect(page.locator('text=234')).toBeVisible();
    await expect(page.locator('text=等待中:')).toBeVisible();
    await expect(page.locator('text=冲突:')).toBeVisible();

    // Check quality scores
    await expect(page.locator('text=质量评分')).toBeVisible();
    await expect(page.locator('text=满意度:')).toBeVisible();
    await expect(page.locator('text=效率:')).toBeVisible();
    await expect(page.locator('text=公平性:')).toBeVisible();
    await expect(page.locator('text=利用率:')).toBeVisible();
  });

  test('should display anomaly detection system', async ({ page }) => {
    // Check anomaly detection panel
    await expect(page.locator('text=异常检测系统')).toBeVisible();
    await expect(page.locator('text=活跃异常')).toBeVisible();

    // Check specific anomalies
    await expect(page.locator('text=Capacity Imbalance')).toBeVisible();
    await expect(page.locator('text=Lab A: 15 students / Lab B: 3')).toBeVisible();
    await expect(page.locator('text=Preference Conflict')).toBeVisible();
    await expect(page.locator('text=12 students unassigned')).toBeVisible();
    await expect(page.locator('text=Equipment Scheduling')).toBeVisible();
    await expect(page.locator('text=3 labs double-booked')).toBeVisible();

    // Check action buttons
    await expect(page.locator('button:has-text("Investigate")')).toBeVisible();
    await expect(page.locator('button:has-text("Auto-Balance")')).toBeVisible();
    await expect(page.locator('button:has-text("Review")')).toBeVisible();
    await expect(page.locator('button:has-text("Manual Assignment")')).toBeVisible();
  });

  test('should display quick intervention controls', async ({ page }) => {
    // Check intervention controls panel
    await expect(page.locator('text=快速干预控制')).toBeVisible();

    // Check algorithm controls
    await expect(page.locator('text=🔄 重新运行匹配算法')).toBeVisible();
    await expect(page.locator('button:has-text("立即执行")')).toBeVisible();
    await expect(page.locator('button:has-text("计划执行")')).toBeVisible();

    // Check notification controls
    await expect(page.locator('text=📧 发送通知')).toBeVisible();
    await expect(page.locator('button:has-text("学生")')).toBeVisible();
    await expect(page.locator('button:has-text("实验室")')).toBeVisible();
    await expect(page.locator('button:has-text("教师")')).toBeVisible();

    // Check emergency controls
    await expect(page.locator('text=🔒 紧急停止')).toBeVisible();
    await expect(page.locator('button:has-text("全部停止")')).toBeVisible();
    await expect(page.locator('button:has-text("暂停匹配")')).toBeVisible();

    // Check report generation
    await expect(page.locator('text=📊 生成报告')).toBeVisible();
    await expect(page.locator('button:has-text("当前状态")')).toBeVisible();
    await expect(page.locator('button:has-text("周报")')).toBeVisible();
  });

  test('should display laboratory capacity status', async ({ page }) => {
    // Check capacity status panel
    await expect(page.locator('text=实验室容量状态')).toBeVisible();

    // Check specific laboratories
    await expect(page.locator('text=Molecular Bio')).toBeVisible();
    await expect(page.locator('text=Microscopy')).toBeVisible();
    await expect(page.locator('text=Chemistry')).toBeVisible();
    await expect(page.locator('text=Biochemistry')).toBeVisible();
    await expect(page.locator('text=Microbiology')).toBeVisible();
    await expect(page.locator('text=Physics Lab')).toBeVisible();
    await expect(page.locator('text=Computer Sim')).toBeVisible();

    // Check utilization summary
    await expect(page.locator('text=总利用率:')).toBeVisible();
    await expect(page.locator('text=失衡实验室:')).toBeVisible();

    // Check balance actions
    await expect(page.locator('button:has-text("平衡")')).toBeVisible();
    await expect(page.locator('button:has-text("重新分配")')).toBeVisible();
  });

  test('should display student assignment visualization', async ({ page }) => {
    // Check assignment visualization panel
    await expect(page.locator('text=学生分配可视化')).toBeVisible();

    // Check week headers
    await expect(page.locator('text=Week 1')).toBeVisible();
    await expect(page.locator('text=Week 2')).toBeVisible();
    await expect(page.locator('text=Week 3')).toBeVisible();
    await expect(page.locator('text=Week 4')).toBeVisible();
    await expect(page.locator('text=Week 5')).toBeVisible();
    await expect(page.locator('text=Week 6')).toBeVisible();

    // Check action buttons
    await expect(page.locator('button:has-text("查看详情")')).toBeVisible();
    await expect(page.locator('button:has-text("下载排程")')).toBeVisible();
    await expect(page.locator('button:has-text("邮件学生")')).toBeVisible();
  });

  test('should display system performance monitoring', async ({ page }) => {
    // Check system performance panel
    await expect(page.locator('text=系统性能')).toBeVisible();

    // Check server status
    await expect(page.locator('text=服务器状态:')).toBeVisible();
    await expect(page.locator('text=响应时间:')).toBeVisible();
    await expect(page.locator('text=0.8s')).toBeVisible();
    await expect(page.locator('text=数据库:')).toBeVisible();
    await expect(page.locator('text=最后更新:')).toBeVisible();
    await expect(page.locator('text=算法:')).toBeVisible();

    // Check system action buttons
    await expect(page.locator('button:has-text("重启")')).toBeVisible();
    await expect(page.locator('button:has-text("诊断")')).toBeVisible();
  });

  test('should display historical comparison and trends', async ({ page }) => {
    // Check historical trends panel
    await expect(page.locator('text=历史对比趋势')).toBeVisible();
    await expect(page.locator('text=匹配成功率 (最近6个周期)')).toBeVisible();

    // Check cycle data
    await expect(page.locator('text=Cycle1:')).toBeVisible();
    await expect(page.locator('text=Cycle2:')).toBeVisible();
    await expect(page.locator('text=Cycle3:')).toBeVisible();
    await expect(page.locator('text=Cycle4:')).toBeVisible();
    await expect(page.locator('text=Cycle5:')).toBeVisible();
    await expect(page.locator('text=Cycle6:')).toBeVisible();

    // Check insights
    await expect(page.locator('text=关键见解:')).toBeVisible();
    await expect(page.locator('text=Cycle 3 达到性能峰值')).toBeVisible();
    await expect(page.locator('text=Cycle 5 出现容量问题')).toBeVisible();
    await expect(page.locator('text=趋势表明需要算法优化')).toBeVisible();

    // Check analysis buttons
    await expect(page.locator('button:has-text("详细分析")')).toBeVisible();
    await expect(page.locator('button:has-text("导出趋势")')).toBeVisible();
  });

  test('should handle refresh functionality', async ({ page }) => {
    // Check refresh button
    const refreshButton = page.locator('button:has-text("刷新")');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh button
    await refreshButton.click();
    
    // Button should be disabled while refreshing
    await expect(refreshButton).toBeDisabled();
    
    // Wait for refresh to complete
    await page.waitForTimeout(1100);
    
    // Button should be enabled again
    await expect(refreshButton).toBeEnabled();
  });

  test('should handle intervention actions', async ({ page }) => {
    // Test immediate execution
    const executeNowBtn = page.locator('button:has-text("立即执行")');
    await executeNowBtn.click();
    
    // Test scheduled execution
    const scheduleBtn = page.locator('button:has-text("计划执行")');
    await scheduleBtn.click();
    
    // Test notification buttons
    const studentsBtn = page.locator('button:has-text("学生")').first();
    await studentsBtn.click();
    
    const labsBtn = page.locator('button:has-text("实验室")').first();
    await labsBtn.click();
    
    // Test emergency stop
    const stopAllBtn = page.locator('button:has-text("全部停止")');
    await stopAllBtn.click();
    
    const pauseBtn = page.locator('button:has-text("暂停匹配")');
    await pauseBtn.click();
  });

  test('should handle anomaly actions', async ({ page }) => {
    // Test anomaly action buttons
    const investigateBtn = page.locator('button:has-text("Investigate")').first();
    if (await investigateBtn.isVisible()) {
      await investigateBtn.click();
    }
    
    const autoBalanceBtn = page.locator('button:has-text("Auto-Balance")').first();
    if (await autoBalanceBtn.isVisible()) {
      await autoBalanceBtn.click();
    }
    
    const reviewBtn = page.locator('button:has-text("Review")').first();
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
    }
  });

  test('should display status footer', async ({ page }) => {
    // Check status footer
    await expect(page.locator('text=最后刷新: 30秒前')).toBeVisible();
    await expect(page.locator('text=下次算法运行: 4小时')).toBeVisible();
    await expect(page.locator('text=警报数:')).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('text=实验室轮转匹配监控台')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 600 });
    await expect(page.locator('text=实验室轮转匹配监控台')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=实验室轮转匹配监控台')).toBeVisible();
    
    // Check that main content is still accessible
    await expect(page.locator('text=实时匹配指标')).toBeVisible();
    await expect(page.locator('text=异常检测系统')).toBeVisible();
  });

  test('should show proper role-based access for secretary', async ({ page }) => {
    // Secretary should see all monitoring functions
    await expect(page.locator('text=实时匹配指标')).toBeVisible();
    await expect(page.locator('text=异常检测系统')).toBeVisible();
    await expect(page.locator('text=快速干预控制')).toBeVisible();
    
    // Secretary should see intervention controls
    await expect(page.locator('button:has-text("立即执行")')).toBeVisible();
    await expect(page.locator('button:has-text("全部停止")')).toBeVisible();
    await expect(page.locator('button:has-text("暂停匹配")')).toBeVisible();
    
    // Secretary should see system monitoring
    await expect(page.locator('text=系统性能')).toBeVisible();
    await expect(page.locator('text=实验室容量状态')).toBeVisible();
    
    // Secretary should see reporting functions
    await expect(page.locator('button:has-text("当前状态")')).toBeVisible();
    await expect(page.locator('button:has-text("周报")')).toBeVisible();
  });

  test('should handle tab navigation correctly', async ({ page }) => {
    // Start on overview tab (default)
    await expect(page.locator('text=实时匹配指标')).toBeVisible();
    
    // Navigate to analytics tab
    await page.locator('button:has-text("🔍 分析")').click();
    await expect(page.locator('text=详细分析')).toBeVisible();
    await expect(page.locator('text=分析功能正在开发中')).toBeVisible();
    
    // Navigate to alerts tab
    await page.locator('button:has-text("⚠️ 警报")').click();
    await expect(page.locator('text=警报管理')).toBeVisible();
    await expect(page.locator('text=警报管理功能正在开发中')).toBeVisible();
    
    // Navigate to trends tab
    await page.locator('button:has-text("📈 趋势")').click();
    await expect(page.locator('text=趋势分析')).toBeVisible();
    await expect(page.locator('text=趋势分析功能正在开发中')).toBeVisible();
    
    // Navigate to interventions tab
    await page.locator('button:has-text("🎯 干预")').click();
    await expect(page.locator('text=干预历史')).toBeVisible();
    await expect(page.locator('text=干预历史功能正在开发中')).toBeVisible();
    
    // Navigate back to overview
    await page.locator('button:has-text("📊 概览")').click();
    await expect(page.locator('text=实时匹配指标')).toBeVisible();
  });
});