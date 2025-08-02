import { test, expect } from '@playwright/test';

test.describe('Accessibility Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/accessibility-demo');
  });

  test('should display accessibility demo page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('无障碍功能演示');
    await expect(page.locator('text=展示平台的无障碍设计和多语言支持功能')).toBeVisible();
  });

  test('should have skip links', async ({ page }) => {
    // Focus on the first skip link
    await page.keyboard.press('Tab');
    
    // Check if skip link is visible when focused
    const skipLink = page.locator('text=跳转到主要内容');
    await expect(skipLink).toBeFocused();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check for proper heading structure
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    await expect(h1).toHaveCount(1); // Should have only one h1
    await expect(h2.first()).toBeVisible();
    await expect(h3.first()).toBeVisible();
    
    // Check heading content
    await expect(h1).toContainText('无障碍功能演示');
    await expect(h2.first()).toContainText('功能分类');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through the navigation items
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Play button
    
    // Should be able to navigate to main content
    const playButton = page.locator('button:has-text("播放欢迎消息")');
    await expect(playButton).toBeFocused();
    
    // Continue tabbing through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should reach the feature cards
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have accessibility panel', async ({ page }) => {
    await expect(page.locator('text=无障碍设置')).toBeVisible();
    
    // Click to open accessibility panel
    await page.click('text=无障碍设置');
    
    // Should show accessibility options
    await expect(page.locator('text=高对比度')).toBeVisible();
    await expect(page.locator('text=减少动画')).toBeVisible();
    await expect(page.locator('text=字体大小')).toBeVisible();
    await expect(page.locator('text=屏幕阅读器优化')).toBeVisible();
    await expect(page.locator('text=键盘导航')).toBeVisible();
  });

  test('should toggle high contrast mode', async ({ page }) => {
    // Open accessibility panel
    await page.click('text=无障碍设置');
    
    // Toggle high contrast
    const highContrastSwitch = page.locator('#high-contrast');
    await highContrastSwitch.click();
    
    // Check if high contrast class is applied
    const root = page.locator('html');
    await expect(root).toHaveClass(/high-contrast/);
  });

  test('should change font size', async ({ page }) => {
    // Open accessibility panel
    await page.click('text=无障碍设置');
    
    // Click on large font size
    await page.click('button:has-text("大")');
    
    // Check if font size class is applied
    const root = page.locator('html');
    await expect(root).toHaveClass(/font-large/);
  });

  test('should display WCAG compliance features', async ({ page }) => {
    await page.click('text=WCAG 合规');
    
    // Check color contrast section
    await expect(page.locator('text=颜色对比度')).toBeVisible();
    await expect(page.locator('text=对比度: 4.5:1')).toBeVisible();
    
    // Check keyboard navigation section
    await expect(page.locator('text=键盘导航演示')).toBeVisible();
    
    // Check progress indicator
    await expect(page.locator('text=进度指示器')).toBeVisible();
    
    // Check semantic HTML section
    await expect(page.locator('text=语义化 HTML')).toBeVisible();
  });

  test('should have accessible form with proper labels and errors', async ({ page }) => {
    await page.click('text=表单无障碍');
    
    // Check form labels
    await expect(page.locator('label[for="name"]')).toContainText('姓名');
    await expect(page.locator('label[for="email"]')).toContainText('邮箱地址');
    await expect(page.locator('label[for="feedback"]')).toContainText('反馈内容');
    
    // Test form validation
    await page.click('button:has-text("提交反馈")');
    
    // Should show error messages
    await expect(page.locator('text=姓名是必填项')).toBeVisible();
    await expect(page.locator('text=邮箱是必填项')).toBeVisible();
    await expect(page.locator('text=反馈内容是必填项')).toBeVisible();
    
    // Error messages should have proper ARIA attributes
    const nameError = page.locator('#name-error');
    await expect(nameError).toHaveAttribute('role', 'alert');
  });

  test('should fill and submit form successfully', async ({ page }) => {
    await page.click('text=表单无障碍');
    
    // Fill form fields
    await page.fill('#name', '测试用户');
    await page.fill('#email', 'test@example.com');
    await page.fill('#feedback', '这是一个测试反馈，测试表单的无障碍功能。');
    
    // Select radio option
    await page.click('label[for="pref-email"]');
    
    // Check checkbox
    await page.click('#newsletter');
    
    // Submit form
    await page.click('button:has-text("提交反馈")');
    
    // Should show success message
    await expect(page.locator('text=表单提交成功！感谢您的反馈。')).toBeVisible();
  });

  test('should have navigation aids', async ({ page }) => {
    await page.click('text=导航辅助');
    
    // Check breadcrumb navigation
    await expect(page.locator('nav[aria-label="面包屑导航"]')).toBeVisible();
    await expect(page.locator('text=首页')).toBeVisible();
    await expect(page.locator('[aria-current="page"]')).toContainText('无障碍功能');
    
    // Check landmarks section
    await expect(page.locator('text=页面结构地标')).toBeVisible();
    await expect(page.locator('text=主要地标')).toBeVisible();
    await expect(page.locator('text=ARIA 地标')).toBeVisible();
    
    // Test skip to content button
    await page.click('button:has-text("演示跳转到主内容")');
  });

  test('should have multimedia accessibility features', async ({ page }) => {
    await page.click('text=多媒体支持');
    
    // Check media controls
    await expect(page.locator('text=媒体控制器')).toBeVisible();
    await expect(page.locator('button[aria-label="播放/暂停"]')).toBeVisible();
    await expect(page.locator('button[aria-label="下一首"]')).toBeVisible();
    await expect(page.locator('button[aria-label="静音"]')).toBeVisible();
    
    // Check captions support
    await expect(page.locator('text=字幕和转录支持')).toBeVisible();
    await expect(page.locator('button:has-text("开启字幕")')).toBeVisible();
    await expect(page.locator('button:has-text("音频描述")')).toBeVisible();
    
    // Check alternative content
    await expect(page.locator('text=替代内容')).toBeVisible();
    await expect(page.locator('text=图片替代文本')).toBeVisible();
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    // Check for ARIA landmarks
    await expect(page.locator('main')).toHaveAttribute('id', 'main-content');
    await expect(page.locator('nav[aria-label="无障碍功能导航"]')).toBeVisible();
    
    // Check for ARIA labels
    const tabList = page.locator('[role="tablist"]');
    await expect(tabList).toHaveAttribute('aria-label', '无障碍功能标签');
    
    // Check for live regions
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion.first()).toBeInViewport();
  });

  test('should announce messages to screen readers', async ({ page }) => {
    // Click the welcome message button
    await page.click('button:has-text("播放欢迎消息")');
    
    // Should create a live region for the announcement
    // Note: This is hard to test directly, but we can check that the notification appears
    await expect(page.locator('text=欢迎来到无障碍功能演示页面')).toBeVisible();
  });

  test('should have proper focus management', async ({ page }) => {
    // Test focus trap functionality would require more complex testing
    // For now, we'll test basic focus behavior
    
    // Tab to accessibility panel
    await page.click('text=无障碍设置');
    
    // Should be able to tab through the panel controls
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should support color blind users', async ({ page }) => {
    await page.click('text=WCAG 合规');
    
    // Check for different contrast levels
    await expect(page.locator('text=标准对比度文本')).toBeVisible();
    await expect(page.locator('text=次要文本')).toBeVisible();
    await expect(page.locator('text=高对比度文本')).toBeVisible();
    
    // Colors should not be the only way to convey information
    // Status should be indicated by text as well as color
    await expect(page.locator('text=对比度: 4.5:1')).toBeVisible();
    await expect(page.locator('text=对比度: 3:1')).toBeVisible();
    await expect(page.locator('text=对比度: 7:1')).toBeVisible();
  });

  test('should have accessible progress indicators', async ({ page }) => {
    await page.click('text=WCAG 合规');
    
    // Check progress bar
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute('aria-valuenow');
    await expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    await expect(progressBar).toHaveAttribute('aria-valuemax', '100');
  });

  test('should work with screen reader simulation', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    
    // Page should still be functional
    await expect(page.locator('h1')).toContainText('无障碍功能演示');
    
    // Test with high contrast preference
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.reload();
    
    // Page should adapt to preferences
    await expect(page.locator('h1')).toContainText('无障碍功能演示');
  });

  test('should maintain accessibility across different viewport sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should maintain keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Should maintain proper heading structure
    await expect(page.locator('h1')).toContainText('无障碍功能演示');
    
    // Accessibility panel should still be accessible
    await expect(page.locator('text=无障碍设置')).toBeVisible();
  });

  test('should have semantic HTML structure', async ({ page }) => {
    // Check for proper HTML5 semantic elements
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('section').first()).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
    
    // Check for proper form structure
    await page.click('text=表单无障碍');
    await expect(page.locator('fieldset').first()).toBeVisible();
    await expect(page.locator('legend').first()).toBeVisible();
  });
});