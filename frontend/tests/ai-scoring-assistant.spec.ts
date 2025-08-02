import { test, expect } from '@playwright/test';

test.describe('AI Scoring Assistant', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the AI Scoring Assistant page with test mode parameter
    await page.goto('http://localhost:5173/ai-scoring-assistant?role=professor');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should display the main AI Scoring Assistant interface', async ({ page }) => {
    // Check for main title
    await expect(page.locator('h1')).toContainText('AI评分助手');
    
    // Check for subtitle
    await expect(page.locator('p')).toContainText('智能评分辅助，提高评分一致性和准确性');
    
    // Check for navigation buttons
    await expect(page.locator('button', { hasText: '批量评分' })).toBeVisible();
    await expect(page.locator('button', { hasText: '单个评分' })).toBeVisible();
  });

  test('should handle assignment selection', async ({ page }) => {
    // Check for assignment selection
    const assignmentSelect = page.locator('select').first();
    await expect(assignmentSelect).toBeVisible();
    
    // Select an assignment
    await assignmentSelect.selectOption('1');
    
    // Check if assignment details are displayed
    await expect(page.locator('text=王小明')).toBeVisible();
    await expect(page.locator('text=实验报告3')).toBeVisible();
    
    // Check if AI analysis button is enabled
    const analyzeButton = page.locator('button', { hasText: 'AI分析' });
    await expect(analyzeButton).toBeEnabled();
  });

  test('should perform AI analysis', async ({ page }) => {
    // Select an assignment first
    await page.locator('select').first().selectOption('1');
    
    // Click AI analysis button
    const analyzeButton = page.locator('button', { hasText: 'AI分析' });
    await analyzeButton.click();
    
    // Check for loading state
    await expect(page.locator('text=分析中...')).toBeVisible();
    
    // Wait for analysis to complete and check for AI suggestions
    await expect(page.locator('text=AI建议: 88分')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=置信度: 85%')).toBeVisible();
  });

  test('should display historical reference tab', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Click on historical reference tab
    await page.locator('[data-testid="tab-historical"], button:has-text("历史参考")').first().click();
    
    // Check for historical data
    await expect(page.locator('text=相似作业历史评分')).toBeVisible();
    await expect(page.locator('text=刘小刚')).toBeVisible();
    await expect(page.locator('text=89分')).toBeVisible();
    await expect(page.locator('text=相似度: 85%')).toBeVisible();
    
    // Check for filter options
    await expect(page.locator('select').last()).toBeVisible();
  });

  test('should display score distribution analysis', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Click on distribution analysis tab
    await page.locator('button:has-text("分布分析")').click();
    
    // Check for distribution chart
    await expect(page.locator('text=当前批次评分分布')).toBeVisible();
    await expect(page.locator('text=分数段分布图')).toBeVisible();
    
    // Check for statistics
    await expect(page.locator('text=84.2')).toBeVisible(); // Average score
    await expect(page.locator('text=96')).toBeVisible(); // Max score
    await expect(page.locator('text=58')).toBeVisible(); // Min score
    await expect(page.locator('text=7.8')).toBeVisible(); // Standard deviation
    
    // Check for quality assessment
    await expect(page.locator('text=优秀')).toBeVisible();
    await expect(page.locator('text=良好')).toBeVisible();
  });

  test('should display anomaly detection', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Click on anomaly detection tab
    await page.locator('button:has-text("异常检测")').click();
    
    // Check for anomaly detection interface
    await expect(page.locator('text=异常评分检测')).toBeVisible();
    
    // Check for anomaly statistics
    await expect(page.locator('text=检测到异常')).toBeVisible();
    await expect(page.locator('text=2')).toBeVisible();
    
    // Check for specific anomalies
    await expect(page.locator('text=张小华的分数明显低于同类作业平均水平')).toBeVisible();
    await expect(page.locator('text=中风险')).toBeVisible();
    
    // Check for detection settings
    await expect(page.locator('text=检测设置')).toBeVisible();
    await expect(page.locator('text=异常值阈值')).toBeVisible();
  });

  test('should display AI suggestions with detailed analysis', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Click on suggestions tab
    await page.locator('button:has-text("智能建议")').click();
    
    // Check for AI suggestions interface
    await expect(page.locator('text=AI评分建议')).toBeVisible();
    await expect(page.locator('text=智能评分分析')).toBeVisible();
    
    // Check for suggested score
    await expect(page.locator('text=88')).toBeVisible();
    await expect(page.locator('text=AI建议分数')).toBeVisible();
    
    // Check for evaluation criteria
    await expect(page.locator('text=内容完整性: 优秀')).toBeVisible();
    await expect(page.locator('text=技术准确性: 良好')).toBeVisible();
    
    // Check for intelligent comments
    await expect(page.locator('text=智能评语建议')).toBeVisible();
    await expect(page.locator('text=实验设计思路清晰')).toBeVisible();
    
    // Check for dimensional scoring
    await expect(page.locator('text=维度评分建议')).toBeVisible();
    await expect(page.locator('text=实验设计 (25%)')).toBeVisible();
  });

  test('should display consistency checker', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Click on consistency check tab
    await page.locator('button:has-text("一致性检查")').click();
    
    // Check for consistency analysis interface
    await expect(page.locator('text=评分一致性分析')).toBeVisible();
    
    // Check for overall metrics
    await expect(page.locator('text=总体一致性')).toBeVisible();
    await expect(page.locator('text=87%')).toBeVisible();
    
    // Check for evaluator comparison
    await expect(page.locator('text=评委对比分析')).toBeVisible();
    await expect(page.locator('text=张教授')).toBeVisible();
    await expect(page.locator('text=李教授')).toBeVisible();
    await expect(page.locator('text=王教授')).toBeVisible();
    
    // Check for personal analysis
    await expect(page.locator('text=您的评分模式分析')).toBeVisible();
    await expect(page.locator('text=与团队平均的一致性')).toBeVisible();
    
    // Check for calibration suggestions
    await expect(page.locator('text=校准建议')).toBeVisible();
    await expect(page.locator('text=优势保持')).toBeVisible();
  });

  test('should handle quick scoring panel', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Check for quick scoring panel
    await expect(page.locator('text=快速评分')).toBeVisible();
    
    // Check for score input
    const scoreInput = page.locator('input[type="number"]').first();
    await expect(scoreInput).toBeVisible();
    await scoreInput.fill('85');
    
    // Check for comment textarea
    const commentArea = page.locator('textarea').first();
    await expect(commentArea).toBeVisible();
    await commentArea.fill('作业完成质量良好，建议在分析深度上进一步提升。');
    
    // Check for AI suggestion reference
    await expect(page.locator('text=AI建议参考')).toBeVisible();
    await expect(page.locator('text=建议分数: 88分')).toBeVisible();
    
    // Check for action buttons
    await expect(page.locator('button', { hasText: '保存草稿' })).toBeVisible();
    await expect(page.locator('button', { hasText: '确认评分' })).toBeVisible();
  });

  test('should handle responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Check if content is still accessible in mobile view
    await page.locator('select').first().selectOption('1');
    await expect(page.locator('text=王小明')).toBeVisible();
  });

  test('should export reports and data', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Test distribution export
    await page.locator('button:has-text("分布分析")').click();
    await expect(page.locator('button', { hasText: '导出报告' })).toBeVisible();
    
    // Test suggestions export
    await page.locator('button:has-text("智能建议")').click();
    await expect(page.locator('button', { hasText: '导出建议' })).toBeVisible();
    
    // Test consistency export
    await page.locator('button:has-text("一致性检查")').click();
    await expect(page.locator('button', { hasText: '导出分析报告' })).toBeVisible();
  });

  test('should handle error states and edge cases', async ({ page }) => {
    // Test without selecting assignment
    const analyzeButton = page.locator('button', { hasText: 'AI分析' });
    await expect(analyzeButton).toBeDisabled();
    
    // Test empty state for suggestions
    await page.locator('button:has-text("智能建议")').click();
    await expect(page.locator('text=等待AI分析')).toBeVisible();
    await expect(page.locator('text=请先选择作业并点击"AI分析"获取智能评分建议')).toBeVisible();
  });

  test('should maintain state when switching tabs', async ({ page }) => {
    // Select an assignment and analyze
    await page.locator('select').first().selectOption('1');
    await page.locator('button', { hasText: 'AI分析' }).click();
    
    // Wait for analysis to complete
    await page.waitForTimeout(2500);
    
    // Switch between tabs and verify content persists
    await page.locator('button:has-text("分布分析")').click();
    await expect(page.locator('text=当前批次评分分布')).toBeVisible();
    
    await page.locator('button:has-text("历史参考")').click();
    await expect(page.locator('text=相似作业历史评分')).toBeVisible();
    
    await page.locator('button:has-text("智能建议")').click();
    await expect(page.locator('text=88')).toBeVisible(); // AI suggested score should still be there
  });

  test('should handle accessibility requirements', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h3')).toBeVisible();
    
    // Check for proper labels
    await expect(page.locator('label')).toHaveCount({ min: 1 });
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check for ARIA labels and roles
    const tabsContainer = page.locator('[role="tablist"]');
    if (await tabsContainer.count() > 0) {
      await expect(tabsContainer).toBeVisible();
    }
  });

  test('should integrate with batch scoring workflow', async ({ page }) => {
    // Check navigation to batch scoring
    await page.locator('button', { hasText: '批量评分' }).click();
    await expect(page).toHaveURL('http://localhost:5173/batch-scoring');
    
    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('http://localhost:5173/ai-scoring-assistant');
    
    // Check navigation to single scoring
    await page.locator('button', { hasText: '单个评分' }).click();
    await expect(page).toHaveURL('http://localhost:5173/multidimensional-scoring');
  });
});