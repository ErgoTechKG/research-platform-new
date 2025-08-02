import { test, expect } from '@playwright/test'

test.describe('Realtime Data Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard and login as admin
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should display dashboard navigation and access realtime data dashboard', async ({ page }) => {
    // Verify we're on the dashboard page
    await expect(page.locator('h1')).toContainText('欢迎回来')

    // Find and click the realtime data dashboard card
    const realtimeDashboardCard = page.locator('text=实时数据仪表盘').locator('..')
    await expect(realtimeDashboardCard).toBeVisible()
    await realtimeDashboardCard.click()

    // Verify navigation to realtime data dashboard
    await expect(page).toHaveURL(/.*realtime-data-dashboard/)
    await expect(page.locator('h1')).toContainText('实时数据可视化仪表盘')
  })

  test('should display all main dashboard components', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Check dashboard header
    await expect(page.locator('h1')).toContainText('实时数据可视化仪表盘')
    
    // Check connection status
    await expect(page.locator('text=已连接')).toBeVisible()
    
    // Check KPI metrics cards
    await expect(page.locator('text=活跃用户数')).toBeVisible()
    await expect(page.locator('text=任务完成率')).toBeVisible()
    await expect(page.locator('text=平均响应时间')).toBeVisible()
    await expect(page.locator('text=数据处理量')).toBeVisible()
    await expect(page.locator('text=系统健康度')).toBeVisible()
    await expect(page.locator('text=预警数量')).toBeVisible()

    // Check tab navigation
    await expect(page.getByRole('tab', { name: '概览' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '趋势分析' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '实时监控' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '异常预警' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '报告分析' })).toBeVisible()
  })

  test('should switch between dashboard tabs', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Test switching to trends analysis tab
    await page.click('text=趋势分析')
    await expect(page.locator('text=用户活跃度趋势')).toBeVisible()
    await expect(page.locator('text=资源使用分布')).toBeVisible()

    // Test switching to realtime monitoring tab
    await page.click('text=实时监控')
    await expect(page.locator('text=CPU使用率')).toBeVisible()
    await expect(page.locator('text=内存使用率')).toBeVisible()
    await expect(page.locator('text=响应时间')).toBeVisible()
    await expect(page.locator('text=在线用户')).toBeVisible()

    // Test switching to alerts tab
    await page.click('text=异常预警')
    await expect(page.locator('text=异常预警中心')).toBeVisible()

    // Test switching to reports tab
    await page.click('text=报告分析')
    await expect(page.locator('text=日报')).toBeVisible()
    await expect(page.locator('text=周报')).toBeVisible()
    await expect(page.locator('text=月报')).toBeVisible()
  })

  test('should display and interact with charts', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Check for chart containers in overview tab
    await expect(page.locator('text=系统趋势分析')).toBeVisible()
    await expect(page.locator('svg')).toBeVisible()

    // Switch to trends analysis tab and check charts
    await page.click('text=趋势分析')
    await expect(page.locator('text=用户活跃度趋势')).toBeVisible()
    await expect(page.locator('text=资源使用分布')).toBeVisible()
    
    // Verify SVG charts are present
    const charts = page.locator('svg')
    await expect(charts).toHaveCount(3) // Should have multiple charts
  })

  test('should have functional control buttons', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Test time range selector
    await page.click('[role="combobox"]:has-text("最近24小时")')
    await expect(page.locator('text=最近1小时')).toBeVisible()
    await expect(page.locator('text=最近7天')).toBeVisible()
    await page.press('body', 'Escape')

    // Test auto refresh toggle
    const autoRefreshSwitch = page.locator('text=自动刷新').locator('..')
    await expect(autoRefreshSwitch).toBeVisible()

    // Test refresh button
    const refreshButton = page.locator('button:has-text("刷新")')
    await expect(refreshButton).toBeVisible()

    // Test settings button
    const settingsButton = page.locator('button:has-text("设置")')
    await expect(settingsButton).toBeVisible()
    await settingsButton.click()
    await expect(page.locator('text=仪表盘设置')).toBeVisible()
    await page.press('body', 'Escape')

    // Test export button
    const exportButton = page.locator('button:has-text("导出")')
    await expect(exportButton).toBeVisible()

    // Test fullscreen button
    const fullscreenButton = page.locator('button').filter({ has: page.locator('svg') }).last()
    await expect(fullscreenButton).toBeVisible()
  })

  test('should display KPI metrics with proper values and trends', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Check for KPI metric values
    await expect(page.locator('text=1247')).toBeVisible() // Active users
    await expect(page.locator('text=89.2')).toBeVisible() // Completion rate
    await expect(page.locator('text=245')).toBeVisible() // Response time
    await expect(page.locator('text=2.4TB')).toBeVisible() // Data processing
    await expect(page.locator('text=98.5')).toBeVisible() // System health
    await expect(page.locator('text=3')).toBeVisible() // Alert count

    // Check for trend indicators
    await expect(page.locator('text=+12.5%')).toBeVisible()
    await expect(page.locator('text=+3.2%')).toBeVisible()
    await expect(page.locator('text=-15ms')).toBeVisible()

    // Check for target badges
    await expect(page.locator('text=达标')).toHaveCount(3)
  })

  test('should display realtime monitoring with gauge charts', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Switch to realtime monitoring tab
    await page.click('text=实时监控')

    // Check for gauge chart labels
    await expect(page.locator('text=CPU使用率')).toBeVisible()
    await expect(page.locator('text=内存使用率')).toBeVisible()
    await expect(page.locator('text=响应时间')).toBeVisible()
    await expect(page.locator('text=在线用户')).toBeVisible()

    // Check for gauge values
    await expect(page.locator('text=68.0')).toBeVisible() // CPU
    await expect(page.locator('text=45.0')).toBeVisible() // Memory
    await expect(page.locator('text=245.0')).toBeVisible() // Response time
    await expect(page.locator('text=1247.0')).toBeVisible() // Online users

    // Check for real-time activity feed
    await expect(page.locator('text=实时活动流')).toBeVisible()
  })

  test('should handle alerts and anomaly detection', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Switch to alerts tab
    await page.click('text=异常预警')

    // Check for alert center
    await expect(page.locator('text=异常预警中心')).toBeVisible()

    // Check for mock alerts
    await expect(page.locator('text=系统负载异常')).toBeVisible()
    await expect(page.locator('text=数据同步延迟')).toBeVisible()
    await expect(page.locator('text=定期备份完成')).toBeVisible()

    // Check for acknowledge buttons
    const acknowledgeButtons = page.locator('button:has-text("确认")')
    await expect(acknowledgeButtons).toHaveCount(2) // Only unacknowledged alerts should have buttons
  })

  test('should be responsive and work on different screen sizes', async ({ page }) => {
    await page.goto('http://localhost:5174/realtime-data-dashboard')
    await page.waitForLoadState('networkidle')

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('h1')).toContainText('实时数据可视化仪表盘')
    
    // KPI cards should still be visible but rearranged
    await expect(page.locator('text=活跃用户数')).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.locator('text=系统趋势分析')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.locator('text=系统趋势分析')).toBeVisible()
  })
})