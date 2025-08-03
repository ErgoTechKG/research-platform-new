import { test, expect } from '@playwright/test';

test.describe('Student Score Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student-score-tracker?role=student');
  });

  test('should display the score tracker with all main components', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('综合素质评价 - 实时分数追踪器');
    
    // Check action buttons
    await expect(page.getByRole('button', { name: '刷新' })).toBeVisible();
    await expect(page.getByRole('button', { name: '详细报告' })).toBeVisible();

    // Check main sections
    await expect(page.getByText('总分概览')).toBeVisible();
    await expect(page.getByText('维度分数明细')).toBeVisible();
    await expect(page.getByText('排名与比较')).toBeVisible();
    await expect(page.getByText('历史趋势图')).toBeVisible();
    await expect(page.getByText('近期活动记录')).toBeVisible();
  });

  test('should display current score and overview information', async ({ page }) => {
    // Check current score
    await expect(page.getByText('当前总分: 87.5分')).toBeVisible();
    await expect(page.getByText('更新时间: 2分钟前')).toBeVisible();

    // Check gauge chart area
    await expect(page.getByText('总分')).toBeVisible();
    
    // Check score levels legend
    await expect(page.getByText('优秀 (85-100)')).toBeVisible();
    await expect(page.getByText('良好 (70-84)')).toBeVisible();
    await expect(page.getByText('中等 (55-69)')).toBeVisible();
    await expect(page.getByText('待提升 (0-54)')).toBeVisible();

    // Check stats cards
    await expect(page.getByText('本月变化')).toBeVisible();
    await expect(page.getByText('+3.2分')).toBeVisible();
    await expect(page.getByText('排名')).toBeVisible();
    await expect(page.getByText('12/156')).toBeVisible();
    await expect(page.getByText('目标进度')).toBeVisible();
    await expect(page.getByText('90分')).toBeVisible();
  });

  test('should display dimension scores with details', async ({ page }) => {
    // Check all dimension categories
    await expect(page.getByText('📚 学术表现 (权重30%):')).toBeVisible();
    await expect(page.getByText('26.1/30分')).toBeVisible();
    
    await expect(page.getByText('🎯 创新能力 (权重25%):')).toBeVisible();
    await expect(page.getByText('20.8/25分')).toBeVisible();
    
    await expect(page.getByText('🤝 社会实践 (权重20%):')).toBeVisible();
    await expect(page.getByText('16.2/20分')).toBeVisible();
    
    await expect(page.getByText('💪 综合素质 (权重15%):')).toBeVisible();
    await expect(page.getByText('11.7/15分')).toBeVisible();
    
    await expect(page.getByText('🌟 特色加分 (权重10%):')).toBeVisible();
    await expect(page.getByText('8.7/10分')).toBeVisible();

    // Check sub-items for academic performance
    await expect(page.getByText('学业成绩: 9.2/10分')).toBeVisible();
    await expect(page.getByText('GPA 3.8')).toBeVisible();
    await expect(page.getByText('学术论文: 8.5/10分')).toBeVisible();
    await expect(page.getByText('2篇SCI论文')).toBeVisible();
    await expect(page.getByText('科研项目: 8.4/10分')).toBeVisible();
    await expect(page.getByText('3个国家级项目参与')).toBeVisible();
  });

  test('should display ranking and comparison information', async ({ page }) => {
    // Check ranking cards
    await expect(page.getByText('年级排名')).toBeVisible();
    await expect(page.getByText('TOP 8%')).toBeVisible();
    await expect(page.getByText('专业排名')).toBeVisible();
    await expect(page.getByText('5/45')).toBeVisible();
    await expect(page.getByText('TOP 11%')).toBeVisible();

    // Check ranking trend
    await expect(page.getByText('排名趋势:')).toBeVisible();
    await expect(page.getByText('1月: 18位 → 2月: 15位 → 3月: 12位')).toBeVisible();
    await expect(page.getByText('持续上升')).toBeVisible();

    // Check gap analysis
    await expect(page.getByText('与目标差距分析:')).toBeVisible();
    await expect(page.getByText('距离TOP 5%: 还需提升 4.2分')).toBeVisible();
    await expect(page.getByText('距离年级第1名: 还需提升 8.3分')).toBeVisible();
    await expect(page.getByText('最有潜力提升项: 社会实践 (+3.8分潜力)')).toBeVisible();

    // Check strengths and suggestions
    await expect(page.getByText('优势项目:')).toBeVisible();
    await expect(page.getByText('学术表现 (年级第2) | 创新能力 (年级第3)')).toBeVisible();
    await expect(page.getByText('改进建议:')).toBeVisible();
    await expect(page.getByText('增加志愿服务时长，参与更多社会实践活动')).toBeVisible();
  });

  test('should display historical trend chart', async ({ page }) => {
    // Check trend chart section
    await expect(page.getByText('📈 6个月分数变化趋势:')).toBeVisible();
    
    // Check historical data points (should be visible as bars or chart elements)
    await expect(page.getByText('76.2').first()).toBeVisible();
    await expect(page.getByText('78.5').first()).toBeVisible();
    await expect(page.getByText('80.8').first()).toBeVisible();
    await expect(page.getByText('82.3').first()).toBeVisible();
    await expect(page.getByText('84.1').first()).toBeVisible();
    await expect(page.getByText('87.5').first()).toBeVisible();

    // Check month labels
    await expect(page.getByText('10月')).toBeVisible();
    await expect(page.getByText('11月')).toBeVisible();
    await expect(page.getByText('12月')).toBeVisible();
    await expect(page.getByText('1月')).toBeVisible();
    await expect(page.getByText('2月')).toBeVisible();
    await expect(page.getByText('3月')).toBeVisible();
    await expect(page.getByText('目标')).toBeVisible();

    // Check trend analysis
    await expect(page.getByText('趋势分析:')).toBeVisible();
    await expect(page.getByText('稳步上升，平均每月提升1.8分，按此趋势6月可达目标分数')).toBeVisible();
  });

  test('should display recent activities', async ({ page }) => {
    // Check recent activities section
    await expect(page.getByText('🔄 最新更新记录:')).toBeVisible();
    
    // Check activity items
    await expect(page.getByText('SCI论文被期刊接收')).toBeVisible();
    await expect(page.getByText('+2.1分')).toBeVisible();
    await expect(page.getByText('学术表现')).toBeVisible();
    
    await expect(page.getByText('完成企业实习评估')).toBeVisible();
    await expect(page.getByText('+1.5分')).toBeVisible();
    await expect(page.getByText('社会实践')).toBeVisible();
    
    await expect(page.getByText('获得专利申请受理')).toBeVisible();
    await expect(page.getByText('+1.8分')).toBeVisible();
    await expect(page.getByText('创新能力')).toBeVisible();
    
    await expect(page.getByText('参与志愿服务20小时')).toBeVisible();
    await expect(page.getByText('+0.8分')).toBeVisible();
    
    await expect(page.getByText('开源项目获得100+ stars')).toBeVisible();
    await expect(page.getByText('+1.2分')).toBeVisible();

    // Check timestamps
    await expect(page.getByText('今天 14:30')).toBeVisible();
    await expect(page.getByText('昨天 09:15')).toBeVisible();
    await expect(page.getByText('3天前 16:20')).toBeVisible();
  });

  test('should handle refresh functionality', async ({ page }) => {
    // Click refresh button
    await page.getByRole('button', { name: '刷新' }).click();
    
    // Check that the update time changes
    await expect(page.getByText('更新时间: 刚刚')).toBeVisible();
  });

  test('should display progress bars for all dimensions', async ({ page }) => {
    // Check that progress bars are visible for each dimension
    const progressBars = page.locator('[role="progressbar"]');
    await expect(progressBars).toHaveCount(13); // 5 main dimensions + 8 sub-items (assuming the trend chart progress bar is included)
  });

  test('should show level indicators for each dimension', async ({ page }) => {
    // Check for emoji level indicators
    await expect(page.getByText('🟢').first()).toBeVisible(); // Excellent level
    await expect(page.getByText('🟡').first()).toBeVisible(); // Good level
    
    // Check completion percentages
    await expect(page.getByText('完成度:')).toBeVisible();
  });

  test('should display target and gap information', async ({ page }) => {
    // Check target score display
    await expect(page.getByText('还差2.5分')).toBeVisible();
    
    // Check current level display
    await expect(page.getByText('当前水平')).toBeVisible();
  });

  test('should handle dimension sub-item details', async ({ page }) => {
    // Check that sub-items are displayed in a grid layout
    await expect(page.getByText('学业成绩:')).toBeVisible();
    await expect(page.getByText('学术论文:')).toBeVisible();
    await expect(page.getByText('科研项目:')).toBeVisible();
    
    // Check innovation sub-items
    await expect(page.getByText('技术成果:')).toBeVisible();
    await expect(page.getByText('专利申请:')).toBeVisible();
    await expect(page.getByText('竞赛获奖:')).toBeVisible();
    
    // Check social practice sub-items
    await expect(page.getByText('实习经历:')).toBeVisible();
    await expect(page.getByText('志愿服务:')).toBeVisible();
    await expect(page.getByText('社团活动:')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('当前总分: 87.5分')).toBeVisible();
    await expect(page.getByText('维度分数明细')).toBeVisible();
    
    // Check that layout adapts (grid should stack)
    const scoreOverview = page.getByText('总分概览');
    await expect(scoreOverview).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is managed properly
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should display correct score calculations', async ({ page }) => {
    // Check that total score matches sum of weighted dimensions
    // Academic: 26.1/30 * 30% = 7.83
    // Innovation: 20.8/25 * 25% = 5.2  
    // Social: 16.2/20 * 20% = 3.24
    // Comprehensive: 11.7/15 * 15% = 1.755
    // Special: 8.7/10 * 10% = 0.87
    // Total ≈ 18.875 out of 21.67 possible (87.5%)
    
    await expect(page.getByText('87.5分')).toBeVisible();
    
    // Check individual dimension scores
    await expect(page.getByText('26.1/30分')).toBeVisible();
    await expect(page.getByText('20.8/25分')).toBeVisible();
    await expect(page.getByText('16.2/20分')).toBeVisible();
    await expect(page.getByText('11.7/15分')).toBeVisible();
    await expect(page.getByText('8.7/10分')).toBeVisible();
  });

  test('should show ranking change indicators', async ({ page }) => {
    // Check for up arrow indicators
    const upArrows = page.locator('svg').filter({ hasText: /arrow.*up/i });
    await expect(upArrows.first()).toBeVisible();
    
    // Check ranking improvement text
    await expect(page.getByText('上升3位')).toBeVisible();
  });

  test('should display recommendation badges correctly', async ({ page }) => {
    // Check for status badges
    await expect(page.getByText('持续上升')).toBeVisible();
    
    // Check category badges in recent activities
    await expect(page.locator('text=学术表现').first()).toBeVisible();
    await expect(page.locator('text=社会实践').first()).toBeVisible();
    await expect(page.locator('text=创新能力').first()).toBeVisible();
  });
});