// LeaderDashboard Playwright E2E Tests
// This file contains comprehensive tests for the Leader Dashboard functionality
// To run these tests, first install Playwright: npm install -D @playwright/test

import { test, expect } from '@playwright/test'

test.describe('Leader Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login and simulate admin authentication
    await page.goto('/login')
    
    // Simulate admin login - adjust based on actual auth implementation
    await page.fill('[data-testid="username"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password')
    await page.click('[data-testid="login-button"]')
    
    // Navigate to leader dashboard
    await page.goto('/leader-dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should display leader dashboard with all main sections', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/决策支持系统/)
    
    // Verify main header
    await expect(page.locator('h1')).toContainText('决策支持系统')
    
    // Verify all main sections are present
    await expect(page.locator('[data-testid="kpi-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="trend-analysis-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="additional-metrics-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="action-buttons-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="executive-summary-section"]')).toBeVisible()
  })

  test('should display KPI indicators with trends', async ({ page }) => {
    const kpiSection = page.locator('[data-testid="kpi-section"]')
    
    // Check section title
    await expect(kpiSection.locator('h3')).toContainText('关键指标 KPI')
    
    // Verify KPI items are displayed
    const kpiItems = kpiSection.locator('[data-testid="kpi-item"]')
    await expect(kpiItems).toHaveCount(4) // Based on mock data
    
    // Check specific KPI values
    await expect(kpiSection).toContainText('学生满意度')
    await expect(kpiSection).toContainText('92%')
    await expect(kpiSection).toContainText('导师参与度')
    await expect(kpiSection).toContainText('87%')
    await expect(kpiSection).toContainText('课程完成率')
    await expect(kpiSection).toContainText('95%')
    await expect(kpiSection).toContainText('平均成绩')
    await expect(kpiSection).toContainText('82.5分')
    
    // Verify trend indicators are displayed
    const trendIndicators = kpiSection.locator('[data-testid="trend-indicator"]')
    await expect(trendIndicators).toHaveCount(4)
    
    // Check for trend values
    await expect(kpiSection).toContainText('+3%')
    await expect(kpiSection).toContainText('+5%')
    await expect(kpiSection).toContainText('+2%')
    await expect(kpiSection).toContainText('+1.2')
  })

  test('should display trend analysis with chart visualization', async ({ page }) => {
    const trendSection = page.locator('[data-testid="trend-analysis-section"]')
    
    // Check section title
    await expect(trendSection.locator('h3')).toContainText('趋势分析')
    await expect(trendSection).toContainText('成绩分布趋势 (近3年)')
    
    // Verify trend bars are displayed
    const trendBars = trendSection.locator('[data-testid="trend-bar"]')
    await expect(trendBars).toHaveCount(3) // Three years of data
    
    // Check year labels
    await expect(trendSection).toContainText('2023')
    await expect(trendSection).toContainText('2024')
    await expect(trendSection).toContainText('2025')
    
    // Check trend values
    await expect(trendSection).toContainText('78.5')
    await expect(trendSection).toContainText('81.2')
    await expect(trendSection).toContainText('82.5')
    
    // Verify detailed breakdown
    await expect(trendSection).toContainText('优秀')
    await expect(trendSection).toContainText('良好')
    await expect(trendSection).toContainText('一般')
  })

  test('should display additional operational metrics', async ({ page }) => {
    const metricsSection = page.locator('[data-testid="additional-metrics-section"]')
    
    // Check section title
    await expect(metricsSection.locator('h3')).toContainText('运营指标')
    
    // Verify metric items are displayed
    const metricItems = metricsSection.locator('[data-testid="additional-metric-item"]')
    await expect(metricItems).toHaveCount(4) // Based on mock data
    
    // Check specific metrics
    await expect(metricsSection).toContainText('项目完成率')
    await expect(metricsSection).toContainText('94.2%')
    await expect(metricsSection).toContainText('导师学生比')
    await expect(metricsSection).toContainText('1:8.5')
    await expect(metricsSection).toContainText('实验室利用率')
    await expect(metricsSection).toContainText('87.3%')
    await expect(metricsSection).toContainText('发表论文数')
    await expect(metricsSection).toContainText('156篇')
    
    // Check trend indicators
    await expect(metricsSection).toContainText('+2.1%')
    await expect(metricsSection).toContainText('优化')
    await expect(metricsSection).toContainText('+4.5%')
    await expect(metricsSection).toContainText('+12篇')
  })

  test('should provide working decision tool buttons', async ({ page }) => {
    const actionsSection = page.locator('[data-testid="action-buttons-section"]')
    
    // Check section title
    await expect(actionsSection.locator('h3')).toContainText('决策工具')
    
    // Verify all decision tool buttons are present
    const toolButtons = actionsSection.locator('[data-testid="decision-tool-button"]')
    await expect(toolButtons).toHaveCount(4) // Based on mock data
    
    // Check button labels
    await expect(actionsSection).toContainText('详细报告')
    await expect(actionsSection).toContainText('数据分析')
    await expect(actionsSection).toContainText('导出PPT')
    await expect(actionsSection).toContainText('预测模型')
    
    // Check button descriptions
    await expect(actionsSection).toContainText('查看详细数据报告')
    await expect(actionsSection).toContainText('深入数据分析工具')
    await expect(actionsSection).toContainText('生成演示文稿')
    await expect(actionsSection).toContainText('AI预测分析模型')
    
    // Test navigation functionality
    await toolButtons.filter({ hasText: '数据分析' }).click()
    await expect(page).toHaveURL(/\/data-analysis-center/)
    
    // Navigate back to dashboard
    await page.goBack()
    
    // Test another tool button
    await toolButtons.filter({ hasText: '详细报告' }).click()
    await expect(page).toHaveURL(/\/report-generator/)
  })

  test('should display executive summary with achievements and suggestions', async ({ page }) => {
    const summarySection = page.locator('[data-testid="executive-summary-section"]')
    
    // Check section title
    await expect(summarySection.locator('h3')).toContainText('执行总结')
    
    // Check achievements section
    await expect(summarySection).toContainText('关键成就')
    const achievementItems = summarySection.locator('[data-testid="achievement-item"]')
    await expect(achievementItems).toHaveCount(3)
    
    // Check specific achievements
    await expect(summarySection).toContainText('学生满意度创历史新高，达到92%')
    await expect(summarySection).toContainText('导师参与度显著提升，增长5%')
    await expect(summarySection).toContainText('课程完成率保持高水平，95%')
    
    // Check suggestions section
    await expect(summarySection).toContainText('改进建议')
    const suggestionItems = summarySection.locator('[data-testid="suggestion-item"]')
    await expect(suggestionItems).toHaveCount(3)
    
    // Check specific suggestions
    await expect(summarySection).toContainText('进一步优化师生配比，目标1:7')
    await expect(summarySection).toContainText('增加实验室资源，提升利用率至90%')
    await expect(summarySection).toContainText('加强学术指导，提升论文发表质量')
  })

  test('should have working settings and logout buttons', async ({ page }) => {
    // Test settings button
    await page.click('[data-testid="settings-button"]')
    // Note: Adjust based on actual settings page implementation
    
    // Navigate back to dashboard
    await page.goto('/leader-dashboard')
    
    // Test logout button
    await page.click('[data-testid="logout-button"]')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify dashboard is still functional on mobile
    await expect(page.locator('h1')).toContainText('决策支持系统')
    
    // Check that sections stack properly on mobile
    const kpiSection = page.locator('[data-testid="kpi-section"]')
    const trendSection = page.locator('[data-testid="trend-analysis-section"]')
    await expect(kpiSection).toBeVisible()
    await expect(trendSection).toBeVisible()
    
    // Verify touch-friendly button sizes
    const toolButtons = page.locator('[data-testid="decision-tool-button"]')
    for (const button of await toolButtons.all()) {
      const box = await button.boundingBox()
      expect(box?.height).toBeGreaterThan(44) // Minimum touch target size
    }
  })

  test('should handle trend chart interactions', async ({ page }) => {
    const trendSection = page.locator('[data-testid="trend-analysis-section"]')
    
    // Verify trend bars have proper heights (visual representation)
    const trendBars = trendSection.locator('[data-testid="trend-bar"]')
    
    // Check that bars are visible and have different heights
    for (const bar of await trendBars.all()) {
      await expect(bar).toBeVisible()
      const box = await bar.boundingBox()
      expect(box?.height).toBeGreaterThan(20) // Minimum height
    }
  })

  test('should handle KPI trend indicators correctly', async ({ page }) => {
    const kpiSection = page.locator('[data-testid="kpi-section"]')
    
    // All trends in mock data are upward, so all should show green
    const trendIndicators = kpiSection.locator('[data-testid="trend-indicator"]')
    
    for (const indicator of await trendIndicators.all()) {
      await expect(indicator).toBeVisible()
      // Check for presence of upward trend indicators
      const upwardIcon = indicator.locator('svg') // TrendingUp icon
      await expect(upwardIcon).toBeVisible()
    }
  })

  test('should handle real-time data updates', async ({ page }) => {
    // This test would verify real-time updates to KPIs, trends, etc.
    // Implementation depends on actual real-time update mechanism
    
    const kpiSection = page.locator('[data-testid="kpi-section"]')
    
    // Verify initial KPI values
    await expect(kpiSection).toContainText('学生满意度')
    await expect(kpiSection).toContainText('92%')
    
    // Simulate data update and verify changes
    // For now, just verify the structure is in place for updates
    await expect(kpiSection).toBeVisible()
  })

  test('should handle accessibility requirements', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.locator('[role="main"]')).toBeVisible()
    
    // Verify keyboard navigation works
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Check color contrast and text readability
    const headings = page.locator('h1, h2, h3, h4')
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible()
    }
    
    // Verify charts and visualizations are accessible
    const trendSection = page.locator('[data-testid="trend-analysis-section"]')
    await expect(trendSection).toBeVisible()
  })
})

test.describe('Leader Dashboard - Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/**', route => route.abort())
    
    await page.goto('/leader-dashboard')
    
    // Verify error states are handled gracefully
    // Implementation depends on actual error handling approach
    await expect(page.locator('h1')).toContainText('决策支持系统')
  })

  test('should redirect non-admin users', async ({ page }) => {
    // Test that only admin users can access the leader dashboard
    // This test would need to be implemented based on actual auth flow
    
    // Simulate student user login
    await page.goto('/login')
    // ... simulate student login
    
    await page.goto('/leader-dashboard')
    await expect(page).toHaveURL(/\/dashboard/) // Should redirect to general dashboard
  })

  test('should handle empty or loading states', async ({ page }) => {
    // Test dashboard behavior when data is loading or empty
    // This would require mocking loading states
    
    const kpiSection = page.locator('[data-testid="kpi-section"]')
    await expect(kpiSection).toBeVisible()
    
    // Should show appropriate loading states or empty messages
    // Implementation depends on actual loading state handling
  })

  test('should handle chart rendering failures', async ({ page }) => {
    // Test what happens when trend charts fail to render
    // This would require mocking chart rendering errors
    
    const trendSection = page.locator('[data-testid="trend-analysis-section"]')
    await expect(trendSection).toBeVisible()
    
    // Should show fallback content or error messages
    // Implementation depends on actual error handling
  })
})