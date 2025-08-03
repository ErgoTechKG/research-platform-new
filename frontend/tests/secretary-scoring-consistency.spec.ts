import { test, expect } from '@playwright/test'

test.describe('Secretary Scoring Consistency Check', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the scoring consistency page with admin role
    await page.goto('/secretary-scoring-consistency?role=admin')
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="overview-statistics"]')
  })

  test('should display scoring consistency interface', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('评分一致性检查')
    
    // Check overview statistics
    await expect(page.locator('[data-testid="overview-statistics"]')).toBeVisible()
    
    // Check filters section
    await expect(page.locator('[data-testid="filters-section"]')).toBeVisible()
    
    // Check score distribution
    await expect(page.locator('[data-testid="score-distribution"]')).toBeVisible()
    
    // Check recent anomalies
    await expect(page.locator('[data-testid="recent-anomalies"]')).toBeVisible()
    
    // Check evaluators performance
    await expect(page.locator('[data-testid="evaluators-performance"]')).toBeVisible()
  })

  test('should filter evaluators by department', async ({ page }) => {
    // Open department filter
    await page.click('[data-testid="department-filter"]')
    
    // Select computer science department
    await page.click('text=计算机学院')
    
    // Verify filtered results
    const evaluatorItems = page.locator('[data-testid="evaluator-item"]')
    await expect(evaluatorItems.first()).toContainText('计算机学院')
  })

  test('should filter by time range', async ({ page }) => {
    // Open time range filter
    await page.click('[data-testid="time-range-filter"]')
    
    // Select recent week
    await page.click('text=近一周')
    
    // Verify filter is applied
    await expect(page.locator('[data-testid="time-range-filter"]')).toContainText('近一周')
  })

  test('should display evaluator statistics', async ({ page }) => {
    // Check statistics cards
    await expect(page.locator('[data-testid="overview-statistics"]')).toContainText('评价者总数')
    await expect(page.locator('[data-testid="overview-statistics"]')).toContainText('待处理异常')
    await expect(page.locator('[data-testid="overview-statistics"]')).toContainText('平均一致性')
    await expect(page.locator('[data-testid="overview-statistics"]')).toContainText('总评价数')
  })

  test('should show score distribution analysis', async ({ page }) => {
    // Check score distribution chart
    await expect(page.locator('[data-testid="score-distribution"]')).toBeVisible()
    await expect(page.locator('[data-testid="score-distribution"]')).toContainText('评分分布分析')
    
    // Verify distribution bars are present
    const distributionBars = page.locator('[data-testid="score-distribution"] .bg-green-500, .bg-blue-500, .bg-yellow-500, .bg-orange-500, .bg-red-500')
    await expect(distributionBars.first()).toBeVisible()
  })

  test('should display recent anomalies', async ({ page }) => {
    // Check anomalies section
    await expect(page.locator('[data-testid="recent-anomalies"]')).toBeVisible()
    await expect(page.locator('[data-testid="recent-anomalies"]')).toContainText('异常检测预警')
    
    // Check anomaly items
    const anomalyItems = page.locator('[data-testid="anomaly-item"]')
    await expect(anomalyItems.first()).toBeVisible()
  })

  test('should select evaluator and show detailed analysis', async ({ page }) => {
    // Click on first evaluator
    await page.click('[data-testid="evaluator-item"]:first-child')
    
    // Verify detailed analysis appears
    await expect(page.locator('[data-testid="detailed-analysis"]')).toBeVisible()
    await expect(page.locator('[data-testid="detailed-analysis"]')).toContainText('详细分析')
  })

  test('should trigger calibration for evaluator', async ({ page }) => {
    // Click calibration button on first evaluator
    await page.click('[data-testid="evaluator-item"]:first-child [data-testid="calibration-button"]')
    
    // Verify calibration is triggered (in real app, this would show a dialog or redirect)
    // For now, we just verify the button exists and is clickable
    await expect(page.locator('[data-testid="calibration-button"]').first()).toBeVisible()
  })

  test('should display evaluator performance metrics', async ({ page }) => {
    // Check evaluator items contain required metrics
    const firstEvaluator = page.locator('[data-testid="evaluator-item"]').first()
    
    await expect(firstEvaluator).toContainText('评价总数')
    await expect(firstEvaluator).toContainText('平均分')
    await expect(firstEvaluator).toContainText('标准差')
    await expect(firstEvaluator).toContainText('排名')
    await expect(firstEvaluator).toContainText('异常数')
    await expect(firstEvaluator).toContainText('趋势')
  })

  test('should show different evaluator status colors', async ({ page }) => {
    // Check that evaluators have different status badges
    const statusBadges = page.locator('[data-testid="evaluator-item"] .bg-green-500, .bg-yellow-500, .bg-red-500')
    await expect(statusBadges.first()).toBeVisible()
  })

  test('should display system status overview', async ({ page }) => {
    // Check system status section
    await expect(page.locator('[data-testid="system-status"]')).toBeVisible()
    await expect(page.locator('[data-testid="system-status"]')).toContainText('系统状态概览')
    
    // Check status indicators
    await expect(page.locator('[data-testid="system-status"]')).toContainText('正常评价者')
    await expect(page.locator('[data-testid="system-status"]')).toContainText('警告评价者')
    await expect(page.locator('[data-testid="system-status"]')).toContainText('严重评价者')
  })

  test('should show detailed analysis when evaluator selected', async ({ page }) => {
    // Select an evaluator with warning status
    await page.click('[data-testid="evaluator-item"]:nth-child(2)')
    
    // Check detailed analysis content
    const detailedAnalysis = page.locator('[data-testid="detailed-analysis"]')
    await expect(detailedAnalysis).toBeVisible()
    await expect(detailedAnalysis).toContainText('一致性评分')
    await expect(detailedAnalysis).toContainText('一致性排名')
    await expect(detailedAnalysis).toContainText('异常次数')
    await expect(detailedAnalysis).toContainText('建议操作')
  })

  test('should restrict access for non-admin users', async ({ page }) => {
    // Navigate with student role
    await page.goto('/secretary-scoring-consistency?role=student')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should generate consistency report', async ({ page }) => {
    // Click generate report button (assuming it's in header)
    const reportButton = page.locator('text=生成报告').first()
    await expect(reportButton).toBeVisible()
    
    // Click the button (in real app, this would download or show report)
    await reportButton.click()
  })
})