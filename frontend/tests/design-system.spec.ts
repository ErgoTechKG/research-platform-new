import { test, expect } from '@playwright/test';

test.describe('Design System Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/design-system');
  });

  test('should display design system demo page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('设计系统组件库');
    await expect(page.locator('text=Research Platform Design System')).toBeVisible();
  });

  test('should have all design system tabs', async ({ page }) => {
    const tabs = ['色彩系统', '字体系统', '间距系统', '基础组件', '业务组件', '交互模式'];
    
    for (const tab of tabs) {
      await expect(page.locator(`text=${tab}`)).toBeVisible();
    }
  });

  test('should display color system correctly', async ({ page }) => {
    await page.click('text=色彩系统');
    
    // Check primary color system
    await expect(page.locator('text=主色调系统')).toBeVisible();
    
    // Check semantic colors
    await expect(page.locator('text=语义化色彩')).toBeVisible();
    await expect(page.locator('text=success')).toBeVisible();
    await expect(page.locator('text=warning')).toBeVisible();
    await expect(page.locator('text=danger')).toBeVisible();
  });

  test('should display typography system', async ({ page }) => {
    await page.click('text=字体系统');
    
    await expect(page.locator('text=字体大小')).toBeVisible();
    await expect(page.locator('text=字重系统')).toBeVisible();
    
    // Check if font size examples are displayed
    await expect(page.locator('text=快速的棕色狐狸跳过懒惰的狗').first()).toBeVisible();
  });

  test('should display spacing system', async ({ page }) => {
    await page.click('text=间距系统');
    
    await expect(page.locator('text=间距系统')).toBeVisible();
    
    // Check if spacing examples are displayed
    const spacingCards = page.locator('[style*="width:"][style*="height:"]');
    await expect(spacingCards.first()).toBeVisible();
  });

  test('should display basic components', async ({ page }) => {
    await page.click('text=基础组件');
    
    await expect(page.locator('text=按钮组件')).toBeVisible();
    await expect(page.locator('text=标签组件')).toBeVisible();
    
    // Check button variants
    await expect(page.locator('button:has-text("Primary")')).toBeVisible();
    await expect(page.locator('button:has-text("Secondary")')).toBeVisible();
    await expect(page.locator('button:has-text("Outline")')).toBeVisible();
    await expect(page.locator('button:has-text("Ghost")')).toBeVisible();
    await expect(page.locator('button:has-text("Destructive")')).toBeVisible();
    
    // Check button sizes
    await expect(page.locator('button:has-text("Small")')).toBeVisible();
    await expect(page.locator('button:has-text("Default")')).toBeVisible();
    await expect(page.locator('button:has-text("Large")')).toBeVisible();
  });

  test('should display business components', async ({ page }) => {
    await page.click('text=业务组件');
    
    // Check if mentor card is displayed
    await expect(page.locator('text=导师卡片组件')).toBeVisible();
    await expect(page.locator('text=张教授')).toBeVisible();
    await expect(page.locator('text=人工智能实验室')).toBeVisible();
    
    // Check if course card is displayed
    await expect(page.locator('text=课程卡片组件')).toBeVisible();
    await expect(page.locator('text=深度学习理论与实践')).toBeVisible();
    
    // Check if match selector is displayed
    await expect(page.locator('text=双选匹配器')).toBeVisible();
    await expect(page.locator('text=可选导师')).toBeVisible();
    await expect(page.locator('text=我的志愿')).toBeVisible();
    
    // Check if task board is displayed
    await expect(page.locator('text=任务看板')).toBeVisible();
    await expect(page.locator('text=待开始')).toBeVisible();
    await expect(page.locator('text=进行中')).toBeVisible();
    await expect(page.locator('text=已完成')).toBeVisible();
    
    // Check if scoring component is displayed
    await expect(page.locator('text=评分组件')).toBeVisible();
    await expect(page.locator('text=创新性')).toBeVisible();
    await expect(page.locator('text=技术质量')).toBeVisible();
  });

  test('should display interaction patterns', async ({ page }) => {
    await page.click('text=交互模式');
    
    await expect(page.locator('text=交互模式演示')).toBeVisible();
    await expect(page.locator('text=悬停效果')).toBeVisible();
    await expect(page.locator('text=加载状态')).toBeVisible();
    await expect(page.locator('text=状态反馈')).toBeVisible();
    
    // Check status feedback messages
    await expect(page.locator('text=操作成功！数据已保存。')).toBeVisible();
    await expect(page.locator('text=警告：请检查输入内容。')).toBeVisible();
    await expect(page.locator('text=错误：操作失败，请重试。')).toBeVisible();
  });

  test('should allow interaction with mentor card', async ({ page }) => {
    await page.click('text=业务组件');
    
    // Check if mentor cards have interactive elements
    const applyButton = page.locator('button:has-text("申请加入")').first();
    const detailsButton = page.locator('button:has-text("查看详情")').first();
    
    await expect(applyButton).toBeVisible();
    await expect(detailsButton).toBeVisible();
    
    // Test hover effects (visual check)
    await applyButton.hover();
    await detailsButton.hover();
  });

  test('should allow interaction with match selector', async ({ page }) => {
    await page.click('text=业务组件');
    
    // Check if match selector has search functionality
    const searchInput = page.locator('input[placeholder="搜索导师..."]');
    await expect(searchInput).toBeVisible();
    
    // Test search functionality
    await searchInput.fill('张');
    await expect(page.locator('text=张教授')).toBeVisible();
    
    // Check selection buttons
    const selectButtons = page.locator('button').filter({ hasText: /→/ });
    await expect(selectButtons.first()).toBeVisible();
  });

  test('should display task board correctly', async ({ page }) => {
    await page.click('text=业务组件');
    
    // Check task board columns
    await expect(page.locator('text=待开始')).toBeVisible();
    await expect(page.locator('text=进行中')).toBeVisible();
    await expect(page.locator('text=待审核')).toBeVisible();
    await expect(page.locator('text=已完成')).toBeVisible();
    
    // Check task cards
    await expect(page.locator('text=完成文献调研报告')).toBeVisible();
    await expect(page.locator('text=数据预处理')).toBeVisible();
    await expect(page.locator('text=模型训练')).toBeVisible();
    
    // Check add task buttons
    const addTaskButtons = page.locator('button:has-text("添加任务")');
    await expect(addTaskButtons.first()).toBeVisible();
  });

  test('should allow interaction with scoring component', async ({ page }) => {
    await page.click('text=业务组件');
    
    // Check scoring sliders
    const sliders = page.locator('[role="slider"]');
    await expect(sliders.first()).toBeVisible();
    
    // Check star ratings
    const stars = page.locator('[class*="star"]');
    if (await stars.count() > 0) {
      await stars.first().hover();
    }
    
    // Check comment textareas
    const commentAreas = page.locator('textarea[placeholder*="评价意见"]');
    await expect(commentAreas.first()).toBeVisible();
    
    // Test textarea interaction
    await commentAreas.first().fill('测试评价意见');
    await expect(commentAreas.first()).toHaveValue('测试评价意见');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Check if page is still functional on mobile
    await expect(page.locator('h1')).toContainText('设计系统组件库');
    
    // Check if tabs are accessible on mobile
    await page.click('text=业务组件');
    await expect(page.locator('text=导师卡片组件')).toBeVisible();
  });

  test('should handle tab navigation correctly', async ({ page }) => {
    // Test tab navigation
    const tabs = ['色彩系统', '字体系统', '间距系统', '基础组件', '业务组件', '交互模式'];
    
    for (const tab of tabs) {
      await page.click(`text=${tab}`);
      // Wait for content to load
      await page.waitForTimeout(100);
      
      // Verify tab is active (this might need adjustment based on actual styling)
      const tabElement = page.locator(`text=${tab}`).first();
      await expect(tabElement).toBeVisible();
    }
  });
});