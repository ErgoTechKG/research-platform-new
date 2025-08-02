import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/responsive-demo');
  });

  test('should display responsive demo page on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    
    await expect(page.locator('h1')).toContainText('响应式设计演示');
    await expect(page.locator('text=展示平台在不同设备和屏幕尺寸下的适配效果')).toBeVisible();
    
    // Should show desktop layout with sidebar
    await expect(page.locator('aside')).toBeVisible();
  });

  test('should adapt to mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await expect(page.locator('h1')).toContainText('响应式设计演示');
    
    // Should show mobile layout without sidebar
    await expect(page.locator('aside')).not.toBeVisible();
    
    // Should show mobile menu trigger
    await expect(page.locator('button').first()).toBeVisible(); // Menu button
    
    // Should show breakpoint indicator
    await expect(page.locator('text=当前断点: xs')).toBeVisible();
  });

  test('should adapt to tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    
    await expect(page.locator('h1')).toContainText('响应式设计演示');
    await expect(page.locator('text=当前断点: md')).toBeVisible();
  });

  test('should show different grid layouts on different screen sizes', async ({ page }) => {
    // Test desktop grid
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    
    await page.click('text=网格');
    
    // Should show more columns on desktop
    const gridItems = page.locator('[class*="grid"] > div').first();
    await expect(gridItems).toBeVisible();
    
    // Test mobile grid
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await page.click('text=网格');
    
    // Should show fewer columns on mobile
    await expect(gridItems).toBeVisible();
  });

  test('should show mobile menu functionality', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await page.click('text=布局');
    
    // Find and click mobile menu trigger
    const menuButton = page.locator('button:has-text("打开菜单")');
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Should show menu items
    await expect(page.locator('text=首页')).toBeVisible();
    await expect(page.locator('text=仪表盘')).toBeVisible();
    await expect(page.locator('text=文档')).toBeVisible();
  });

  test('should show collapsible sections on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await page.click('text=布局');
    
    // Should show collapsible sections
    await expect(page.locator('text=基本信息')).toBeVisible();
    await expect(page.locator('text=详细信息')).toBeVisible();
    
    // Test collapsing functionality
    const detailsSection = page.locator('text=详细信息').locator('..');
    await detailsSection.click();
  });

  test('should show responsive table on desktop and cards on mobile', async ({ page }) => {
    // Test desktop table
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    
    // Table tab should be visible on desktop
    await expect(page.locator('text=表格')).toBeVisible();
    await page.click('text=表格');
    
    // Should show table format
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("姓名")')).toBeVisible();
    
    // Test mobile cards
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Table tab should not be visible on mobile
    await expect(page.locator('text=表格')).not.toBeVisible();
  });

  test('should show touch-friendly interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await page.click('text=交互');
    
    // Should show touch-friendly buttons
    await expect(page.locator('text=触摸友好按钮')).toBeVisible();
    
    const touchButtons = page.locator('button:has-text("小按钮")');
    await expect(touchButtons).toBeVisible();
    
    // Buttons should have larger touch targets on mobile
    const buttonBox = await touchButtons.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Minimum touch target size
  });

  test('should show mobile bottom navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Should show bottom navigation
    const bottomNav = page.locator('[class*="fixed bottom-0"]');
    await expect(bottomNav).toBeVisible();
    
    // Should show navigation items
    await expect(page.locator('text=首页').last()).toBeVisible();
    await expect(page.locator('text=搜索').last()).toBeVisible();
    await expect(page.locator('text=通知').last()).toBeVisible();
    await expect(page.locator('text=消息').last()).toBeVisible();
    await expect(page.locator('text=我的').last()).toBeVisible();
    
    // Test navigation click
    await page.locator('text=搜索').last().click();
  });

  test('should hide bottom navigation on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    
    // Bottom navigation should not be visible on desktop
    const bottomNav = page.locator('[class*="fixed bottom-0"]');
    await expect(bottomNav).not.toBeVisible();
  });

  test('should show responsive card grid', async ({ page }) => {
    await page.click('text=网格');
    
    // Should show card grid
    await expect(page.locator('text=自适应卡片网格')).toBeVisible();
    
    const cards = page.locator('text=项目 1').locator('..');
    await expect(cards).toBeVisible();
    
    // Test responsive behavior by changing viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);
    
    // Cards should still be visible but in different layout
    await expect(cards).toBeVisible();
  });

  test('should handle form inputs properly on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    await page.click('text=交互');
    
    // Should show mobile-optimized form inputs
    const nameInput = page.locator('input[placeholder="姓名"]').last();
    await expect(nameInput).toBeVisible();
    
    // Input should have larger height on mobile
    const inputBox = await nameInput.boundingBox();
    expect(inputBox?.height).toBeGreaterThanOrEqual(48); // Larger touch target
    
    // Test input interaction
    await nameInput.fill('测试用户');
    await expect(nameInput).toHaveValue('测试用户');
  });

  test('should show responsive images when available', async ({ page }) => {
    // Only test on desktop where images tab is available
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.reload();
    
    if (await page.locator('text=图片').count() > 0) {
      await page.click('text=图片');
      
      // Should show responsive images
      await expect(page.locator('text=响应式图片')).toBeVisible();
      
      // Images should be visible
      const images = page.locator('img');
      if (await images.count() > 0) {
        await expect(images.first()).toBeVisible();
      }
    }
  });

  test('should show breakpoint indicators in development', async ({ page }) => {
    // Should show current breakpoint
    await expect(page.locator('text=当前断点:').first()).toBeVisible();
    await expect(page.locator('text=屏幕宽度:').first()).toBeVisible();
    await expect(page.locator('text=设备类型:').first()).toBeVisible();
    
    // Test different viewport sizes
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);
    await expect(page.locator('text=当前断点: xs')).toBeVisible();
    await expect(page.locator('text=设备类型: 移动端')).toBeVisible();
    
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    await expect(page.locator('text=当前断点: md')).toBeVisible();
    await expect(page.locator('text=设备类型: 平板')).toBeVisible();
    
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(100);
    await expect(page.locator('text=当前断点: xl')).toBeVisible();
    await expect(page.locator('text=设备类型: 桌面端')).toBeVisible();
  });

  test('should handle rapid viewport changes gracefully', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1280, height: 720 },  // Desktop
      { width: 414, height: 896 },   // Large mobile
      { width: 1920, height: 1080 }  // Large desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(100);
      
      // Page should remain functional
      await expect(page.locator('h1')).toContainText('响应式设计演示');
    }
  });

  test('should maintain functionality across different screen orientations', async ({ page }) => {
    // Test portrait mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toContainText('响应式设计演示');
    
    // Test landscape mobile
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator('h1')).toContainText('响应式设计演示');
    
    // Test portrait tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toContainText('响应式设计演示');
    
    // Test landscape tablet
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator('h1')).toContainText('响应式设计演示');
  });
});