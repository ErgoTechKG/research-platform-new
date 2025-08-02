import { test, expect } from '@playwright/test'

test.describe('Predictive Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174/predictive-analytics')
    await page.waitForLoadState('networkidle')
  })

  test('should display main predictive analytics interface', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('学生表现预测分析')
    
    // Check subtitle
    await expect(page.locator('text=基于机器学习的智能预测分析系统')).toBeVisible()

    // Check model selector
    await expect(page.locator('[role="combobox"]').first()).toBeVisible()
    
    // Check timeframe selector
    await expect(page.locator('[role="combobox"]').nth(1)).toBeVisible()

    // Check retrain button
    await expect(page.locator('button:has-text("重新训练")')).toBeVisible()

    // Check export button
    await expect(page.locator('button:has-text("导出报告")')).toBeVisible()
  })

  test('should display prediction model status cards', async ({ page }) => {
    // Check for model status cards
    await expect(page.locator('text=神经网络')).toBeVisible()
    await expect(page.locator('text=随机森林')).toBeVisible()
    await expect(page.locator('text=决策树')).toBeVisible()

    // Check accuracy percentages
    await expect(page.locator('text=87.5%')).toBeVisible()
    await expect(page.locator('text=82.3%')).toBeVisible()
    await expect(page.locator('text=79.8%')).toBeVisible()

    // Check status badges
    await expect(page.locator('text=运行中')).toHaveCount(2)
    await expect(page.locator('text=训练中')).toBeVisible()
  })

  test('should navigate between different analysis tabs', async ({ page }) => {
    // Check main tabs
    await expect(page.getByRole('tab', { name: '学生表现预测' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '资源需求预测' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '风险评估' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '模型管理' })).toBeVisible()

    // Test student performance prediction tab (default)
    await expect(page.locator('text=成绩趋势预测')).toBeVisible()
    await expect(page.locator('text=风险分布')).toBeVisible()
    await expect(page.locator('text=学生个体预测结果')).toBeVisible()

    // Switch to resource demand prediction
    await page.click('text=资源需求预测')
    await expect(page.locator('text=资源需求趋势')).toBeVisible()
    await expect(page.locator('text=资源状态监控')).toBeVisible()

    // Switch to risk assessment
    await page.click('text=风险评估')
    await expect(page.locator('text=学术风险')).toBeVisible()
    await expect(page.locator('text=管理风险')).toBeVisible()
    await expect(page.locator('text=系统风险')).toBeVisible()
    await expect(page.locator('text=风险详细分析')).toBeVisible()

    // Switch to model management
    await page.click('text=模型管理')
    await expect(page.locator('text=模型性能对比')).toBeVisible()
    await expect(page.locator('text=训练历史')).toBeVisible()
    await expect(page.locator('text=模型配置')).toBeVisible()
  })

  test('should display student performance predictions with details', async ({ page }) => {
    // Should be on student performance tab by default
    await expect(page.locator('text=学生个体预测结果')).toBeVisible()

    // Check for student data in table
    await expect(page.locator('text=张同学')).toBeVisible()
    await expect(page.locator('text=李同学')).toBeVisible()
    await expect(page.locator('text=王同学')).toBeVisible()

    // Check for prediction data
    await expect(page.locator('text=ST001')).toBeVisible()
    await expect(page.locator('text=ST002')).toBeVisible()
    await expect(page.locator('text=ST003')).toBeVisible()

    // Check risk level badges
    await expect(page.locator('text=低风险')).toBeVisible()
    await expect(page.locator('text=高风险')).toBeVisible()
    await expect(page.locator('text=中风险')).toBeVisible()

    // Check confidence percentages
    await expect(page.locator('text=89%')).toBeVisible()
    await expect(page.locator('text=76%')).toBeVisible()
    await expect(page.locator('text=81%')).toBeVisible()
  })

  test('should show resource demand predictions', async ({ page }) => {
    await page.click('text=资源需求预测')
    
    // Check resource names
    await expect(page.locator('text=实验室A')).toBeVisible()
    await expect(page.locator('text=多媒体教室')).toBeVisible()
    await expect(page.locator('text=图书馆研讨室')).toBeVisible()
    await expect(page.locator('text=导师资源')).toBeVisible()

    // Check usage percentages
    await expect(page.locator('text=当前使用率: 75%')).toBeVisible()
    await expect(page.locator('text=预测使用率: 88%')).toBeVisible()

    // Check demand level badges
    await expect(page.locator('text=需求高')).toBeVisible()
    await expect(page.locator('text=需求中')).toBeVisible()
    await expect(page.locator('text=需求紧急')).toBeVisible()
  })

  test('should display risk assessment with detailed analysis', async ({ page }) => {
    await page.click('text=风险评估')

    // Check risk summary cards
    await expect(page.locator('text=学术风险').locator('..').locator('text=高')).toBeVisible()
    await expect(page.locator('text=管理风险').locator('..').locator('text=中')).toBeVisible()
    await expect(page.locator('text=系统风险').locator('..').locator('text=低')).toBeVisible()

    // Check detailed risk analysis
    await expect(page.locator('text=学生挂科风险')).toBeVisible()
    await expect(page.locator('text=资源冲突风险')).toBeVisible()
    await expect(page.locator('text=系统性能风险')).toBeVisible()

    // Check risk categories
    await expect(page.locator('text=学术')).toBeVisible()
    await expect(page.locator('text=管理')).toBeVisible()
    await expect(page.locator('text=系统')).toBeVisible()

    // Check mitigation measures
    await expect(page.locator('text=缓解措施')).toBeVisible()
    await expect(page.locator('text=提供额外辅导')).toBeVisible()
  })

  test('should show model management features', async ({ page }) => {
    await page.click('text=模型管理')

    // Check model performance comparison
    await expect(page.locator('text=学生成绩预测模型 v2.1')).toBeVisible()
    await expect(page.locator('text=资源需求预测模型 v1.8')).toBeVisible()
    await expect(page.locator('text=风险评估模型 v1.5')).toBeVisible()

    // Check algorithm types
    await expect(page.locator('text=神经网络')).toBeVisible()
    await expect(page.locator('text=随机森林')).toBeVisible()
    await expect(page.locator('text=决策树')).toBeVisible()

    // Check training history
    await expect(page.locator('text=训练历史')).toBeVisible()
    await expect(page.locator('text=2024-02-01')).toBeVisible()
    await expect(page.locator('text=增加新特征，性能提升2%')).toBeVisible()

    // Check model configuration
    await expect(page.locator('text=模型配置')).toBeVisible()
    await expect(page.locator('text=数据分割比例')).toBeVisible()
    await expect(page.locator('text=训练参数')).toBeVisible()
    await expect(page.locator('text=特征工程')).toBeVisible()
  })

  test('should have functional controls', async ({ page }) => {
    // Test model selector
    await page.click('[role="combobox"]').first()
    await expect(page.locator('text=学生成绩预测模型 v2.1')).toBeVisible()
    await expect(page.locator('text=资源需求预测模型 v1.8')).toBeVisible()
    await page.press('body', 'Escape')

    // Test timeframe selector  
    await page.click('[role="combobox"]').nth(1)
    await expect(page.locator('text=本周')).toBeVisible()
    await expect(page.locator('text=本月')).toBeVisible()
    await expect(page.locator('text=本学期')).toBeVisible()
    await expect(page.locator('text=本年度')).toBeVisible()
    await page.press('body', 'Escape')

    // Test retrain button
    const retrainButton = page.locator('button:has-text("重新训练")')
    await expect(retrainButton).toBeVisible()
    await expect(retrainButton).not.toBeDisabled()

    // Test export button
    const exportButton = page.locator('button:has-text("导出报告")')
    await expect(exportButton).toBeVisible()
  })

  test('should display charts and visualizations', async ({ page }) => {
    // Check for SVG charts in student performance tab
    const charts = page.locator('svg')
    await expect(charts).toHaveCount(3) // Should have trend chart, pie chart, and progress bars

    // Switch to resource demand tab and check charts
    await page.click('text=资源需求预测')
    await expect(page.locator('svg')).toHaveCount(4) // Resource trend chart + progress bars

    // Check for chart legends and labels
    await expect(page.locator('text=实验室需求')).toBeVisible()
    await expect(page.locator('text=教室需求')).toBeVisible()
  })

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1')).toContainText('学生表现预测分析')
    
    // Main content should still be accessible
    await expect(page.getByRole('tab', { name: '学生表现预测' })).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('text=成绩趋势预测')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('text=风险分布')).toBeVisible()
  })
})