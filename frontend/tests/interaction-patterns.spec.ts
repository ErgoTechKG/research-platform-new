import { test, expect } from '@playwright/test';

test.describe('Interaction Patterns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/interaction-patterns');
  });

  test('should display interaction patterns demo page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('交互设计模式演示');
    await expect(page.locator('text=展示平台中的各种交互模式和反馈机制')).toBeVisible();
  });

  test('should have all interaction pattern tabs', async ({ page }) => {
    const tabs = ['即时反馈', '加载状态', '交互操作', '导航辅助', '无障碍'];
    
    for (const tab of tabs) {
      await expect(page.locator(`text=${tab}`)).toBeVisible();
    }
  });

  test('should display feedback messages correctly', async ({ page }) => {
    await page.click('text=即时反馈');
    
    // Check different feedback message types
    await expect(page.locator('text=操作成功')).toBeVisible();
    await expect(page.locator('text=注意')).toBeVisible();
    await expect(page.locator('text=操作失败')).toBeVisible();
    
    // Test feedback action buttons
    const viewDetailsButton = page.locator('button:has-text("查看详情")');
    if (await viewDetailsButton.count() > 0) {
      await viewDetailsButton.click();
    }
    
    const retryButton = page.locator('button:has-text("重试")');
    if (await retryButton.count() > 0) {
      await retryButton.click();
    }
  });

  test('should display notification center', async ({ page }) => {
    await page.click('text=即时反馈');
    
    await expect(page.locator('text=通知')).toBeVisible();
    await expect(page.locator('text=保存成功')).toBeVisible();
    await expect(page.locator('text=系统将在 5 分钟后进行维护')).toBeVisible();
    
    // Test mark as read functionality
    const firstNotification = page.locator('[role="alert"]').first();
    if (await firstNotification.count() > 0) {
      await firstNotification.click();
    }
    
    // Test clear all button
    const clearAllButton = page.locator('button:has-text("清空所有")');
    if (await clearAllButton.count() > 0) {
      await clearAllButton.click();
    }
  });

  test('should display empty state correctly', async ({ page }) => {
    await page.click('text=即时反馈');
    
    await expect(page.locator('text=暂无数据')).toBeVisible();
    await expect(page.locator('text=您还没有添加任何内容')).toBeVisible();
    
    const createButton = page.locator('button:has-text("开始创建")');
    await expect(createButton).toBeVisible();
    await createButton.click();
  });

  test('should display loading states', async ({ page }) => {
    await page.click('text=加载状态');
    
    // Check loading spinners
    const spinners = page.locator('[role="status"]');
    await expect(spinners.first()).toBeVisible();
    
    // Check skeleton loading
    await expect(page.locator('text=骨架屏加载')).toBeVisible();
    
    // Test loading button
    const processingButton = page.locator('button:has-text("开始处理")');
    await expect(processingButton).toBeVisible();
    await processingButton.click();
    
    // Should show loading state
    await expect(page.locator('text=处理中...')).toBeVisible();
  });

  test('should display progress indicator', async ({ page }) => {
    await page.click('text=加载状态');
    
    await expect(page.locator('text=基本信息')).toBeVisible();
    await expect(page.locator('text=详细配置')).toBeVisible();
    await expect(page.locator('text=确认提交')).toBeVisible();
    await expect(page.locator('text=完成')).toBeVisible();
    
    // Test navigation buttons
    const nextButton = page.locator('button:has-text("下一步")');
    const prevButton = page.locator('button:has-text("上一步")');
    
    await nextButton.click();
    await nextButton.click();
    await prevButton.click();
  });

  test('should handle drag and drop interaction', async ({ page }) => {
    await page.click('text=交互操作');
    
    await expect(page.locator('text=拖拽文件到此处或点击选择文件')).toBeVisible();
    
    // Test click to select files
    const dropZone = page.locator('text=拖拽文件到此处或点击选择文件').locator('..');
    await dropZone.click();
  });

  test('should display hover cards', async ({ page }) => {
    await page.click('text=交互操作');
    
    const hoverTrigger = page.locator('button:has-text("悬停查看详情")');
    await expect(hoverTrigger).toBeVisible();
    
    // Test hover interaction
    await hoverTrigger.hover();
    await page.waitForTimeout(500); // Wait for hover delay
    
    const tooltipTrigger = page.locator('text=悬停提示');
    await expect(tooltipTrigger).toBeVisible();
    await tooltipTrigger.hover();
  });

  test('should handle auto-save functionality', async ({ page }) => {
    await page.click('text=交互操作');
    
    const textarea = page.locator('textarea[placeholder*="开始输入"]');
    await expect(textarea).toBeVisible();
    
    // Test auto-save
    await textarea.fill('测试自动保存功能');
    
    // Should show saving indicator
    await expect(page.locator('text=保存中...')).toBeVisible({ timeout: 2000 });
    
    // Should show saved indicator
    await expect(page.locator('text=已保存')).toBeVisible({ timeout: 3000 });
  });

  test('should handle click away interaction', async ({ page }) => {
    await page.click('text=交互操作');
    
    const dropdownButton = page.locator('button:has-text("打开下拉菜单")');
    await expect(dropdownButton).toBeVisible();
    await dropdownButton.click();
    
    // Should show dropdown
    await expect(page.locator('text=设置')).toBeVisible();
    await expect(page.locator('text=下载')).toBeVisible();
    
    // Click outside to close
    await page.click('h1'); // Click on title to trigger click away
    
    // Dropdown should be closed
    await expect(page.locator('text=设置')).not.toBeVisible();
  });

  test('should handle confirmation dialog', async ({ page }) => {
    await page.click('text=交互操作');
    
    // Open dropdown first
    const dropdownButton = page.locator('button:has-text("打开下拉菜单")');
    await dropdownButton.click();
    
    // Click delete button
    const deleteButton = page.locator('button:has-text("删除")');
    await deleteButton.click();
    
    // Should show confirmation dialog
    await expect(page.locator('text=确认删除')).toBeVisible();
    await expect(page.locator('text=此操作无法撤销，确定要删除吗？')).toBeVisible();
    
    // Test cancel
    const cancelButton = page.locator('button:has-text("取消")');
    await cancelButton.click();
    
    // Dialog should be closed
    await expect(page.locator('text=确认删除')).not.toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    await page.click('text=导航辅助');
    
    await expect(page.locator('text=Ctrl + S')).toBeVisible();
    
    const input = page.locator('input[placeholder*="在此输入内容"]');
    await expect(input).toBeVisible();
    
    // Focus on input and trigger keyboard shortcut
    await input.focus();
    await page.keyboard.press('Control+KeyS');
    
    // Should show toast notification (might need to check for it)
  });

  test('should display breadcrumb navigation', async ({ page }) => {
    await page.click('text=导航辅助');
    
    await expect(page.locator('text=首页')).toBeVisible();
    await expect(page.locator('text=设计系统')).toBeVisible();
    await expect(page.locator('text=交互模式')).toBeVisible();
    
    // Test breadcrumb links
    const homeLink = page.locator('button:has-text("首页")');
    await homeLink.click();
  });

  test('should handle focus trap', async ({ page }) => {
    await page.click('text=无障碍');
    
    const focusTrapButton = page.locator('button:has-text("打开焦点陷阱")');
    await expect(focusTrapButton).toBeVisible();
    await focusTrapButton.click();
    
    // Should show focus trap area
    await expect(page.locator('text=焦点陷阱演示')).toBeVisible();
    await expect(page.locator('text=使用 Tab 键导航')).toBeVisible();
    
    // Test tab navigation within focus trap
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Close focus trap
    const closeButton = page.locator('button:has-text("关闭")').last();
    await closeButton.click();
    
    // Focus trap should be closed
    await expect(page.locator('text=焦点陷阱演示')).not.toBeVisible();
  });

  test('should display accessibility features', async ({ page }) => {
    await page.click('text=无障碍');
    
    // Check semantic labels
    await expect(page.locator('text=信息区域')).toBeVisible();
    await expect(page.locator('[role="region"]')).toBeVisible();
    await expect(page.locator('[role="alert"]')).toBeVisible();
    
    // Check ARIA described button
    await expect(page.locator('button:has-text("可访问按钮")')).toBeVisible();
    await expect(page.locator('text=此按钮有相关的帮助文本')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    
    // Check if page is still functional on mobile
    await expect(page.locator('h1')).toContainText('交互设计模式演示');
    
    // Check if tabs are accessible on mobile
    await page.click('text=即时反馈');
    await expect(page.locator('text=状态反馈消息')).toBeVisible();
  });

  test('should handle rapid interactions', async ({ page }) => {
    await page.click('text=加载状态');
    
    // Rapidly click next/previous buttons
    const nextButton = page.locator('button:has-text("下一步")');
    const prevButton = page.locator('button:has-text("上一步")');
    
    for (let i = 0; i < 3; i++) {
      await nextButton.click();
      await page.waitForTimeout(100);
    }
    
    for (let i = 0; i < 2; i++) {
      await prevButton.click();
      await page.waitForTimeout(100);
    }
    
    // Should handle rapid clicks gracefully
    await expect(nextButton).toBeVisible();
    await expect(prevButton).toBeVisible();
  });
});