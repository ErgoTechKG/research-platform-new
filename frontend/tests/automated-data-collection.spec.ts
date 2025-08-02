// Automated Data Collection Playwright E2E Tests
// Comprehensive tests for the automated data collection system functionality
// Tests data source management, extraction tasks, monitoring, quality checks, rate limits, and alerts

import { test, expect } from '@playwright/test'

test.describe('Automated Data Collection System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login and simulate admin authentication
    await page.goto('/login')
    
    // Simulate admin login - adjust based on actual auth implementation
    await page.fill('[data-testid="username"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password')
    await page.click('[data-testid="login-button"]')
    
    // Navigate to automated data collection page
    await page.goto('/automated-data-collection')
    await page.waitForLoadState('networkidle')
  })

  test('should display main page with overview cards', async ({ page }) => {
    // Check page title and header
    await expect(page).toHaveTitle(/自动化数据收集系统/)
    await expect(page.locator('h1')).toContainText('自动化数据收集系统')
    await expect(page.locator('p')).toContainText('定时数据抓取、多源整合、质量监控和自动化验证')
    
    // Verify overview cards are present
    await expect(page.locator('text=数据源总数')).toBeVisible()
    await expect(page.locator('text=运行中任务')).toBeVisible()
    await expect(page.locator('text=数据质量')).toBeVisible()
    await expect(page.locator('text=系统告警')).toBeVisible()
    
    // Check specific overview metrics
    await expect(page.locator('text=4')).toBeVisible() // Data source count
    await expect(page.locator('text=92.5%')).toBeVisible() // Data quality
  })

  test('should have working tab navigation', async ({ page }) => {
    // Verify all tabs are present
    await expect(page.locator('[role="tablist"]')).toBeVisible()
    
    const tabs = [
      '数据源管理',
      '抓取任务', 
      '流程监控',
      '质量检查',
      '速率管理',
      '系统告警'
    ]
    
    for (const tab of tabs) {
      await expect(page.locator(`text=${tab}`)).toBeVisible()
    }
    
    // Test tab switching
    await page.click('text=抓取任务')
    await expect(page.locator('text=数据抓取任务状态')).toBeVisible()
    
    await page.click('text=质量检查')
    await expect(page.locator('text=数据质量检查与验证')).toBeVisible()
    
    await page.click('text=数据源管理')
    await expect(page.locator('text=数据源配置管理')).toBeVisible()
  })

  test('should display and manage data sources', async ({ page }) => {
    // Navigate to data sources tab
    await page.click('text=数据源管理')
    
    // Check section title
    await expect(page.locator('text=数据源配置管理')).toBeVisible()
    
    // Verify data sources are displayed
    const dataSources = [
      '学生管理系统数据库',
      '课程评价API',
      '成绩导入文件',
      '外部系统FTP'
    ]
    
    for (const source of dataSources) {
      await expect(page.locator(`text=${source}`)).toBeVisible()
    }
    
    // Verify source status badges
    await expect(page.locator('text=运行中')).toBeVisible()
    await expect(page.locator('text=已停止')).toBeVisible()
    await expect(page.locator('text=错误')).toBeVisible()
    
    // Verify action buttons
    await expect(page.locator('text=手动触发')).toBeVisible()
    await expect(page.locator('text=编辑')).toBeVisible()
    
    // Test manual trigger functionality
    await page.click('button:has-text("手动触发"):first')
    // Should show alert or confirmation
  })

  test('should open new data source dialog', async ({ page }) => {
    // Click add data source button
    await page.click('text=添加数据源')
    
    // Verify dialog opened
    await expect(page.locator('text=配置新数据源')).toBeVisible()
    
    // Check form fields are present
    await expect(page.locator('input[placeholder="输入数据源名称"]')).toBeVisible()
    await expect(page.locator('text=数据源类型')).toBeVisible()
    await expect(page.locator('input[placeholder="输入连接URL或路径"]')).toBeVisible()
    await expect(page.locator('input[placeholder="0 */30 * * * *"]')).toBeVisible()
    await expect(page.locator('input[placeholder="1000"]')).toBeVisible()
    await expect(page.locator('textarea[placeholder="JSON格式的配置参数"]')).toBeVisible()
    
    // Test form interaction
    await page.fill('input[placeholder="输入数据源名称"]', '测试数据源')
    await page.fill('input[placeholder="输入连接URL或路径"]', 'https://test-api.example.com')
    
    // Test cancel button
    await page.click('text=取消')
    await expect(page.locator('text=配置新数据源')).not.toBeVisible()
  })

  test('should display extraction tasks with proper status', async ({ page }) => {
    // Navigate to tasks tab
    await page.click('text=抓取任务')
    
    // Check section title
    await expect(page.locator('text=数据抓取任务状态')).toBeVisible()
    
    // Verify tasks are displayed
    const tasks = [
      '学生基本信息同步',
      '课程评价数据抓取',
      '成绩文件处理',
      'FTP文件同步'
    ]
    
    for (const task of tasks) {
      await expect(page.locator(`text=${task}`)).toBeVisible()
    }
    
    // Verify task statuses
    await expect(page.locator('text=运行中')).toBeVisible()
    await expect(page.locator('text=已完成')).toBeVisible()
    await expect(page.locator('text=失败')).toBeVisible()
    await expect(page.locator('text=待执行')).toBeVisible()
    
    // Verify progress bars
    await expect(page.locator('[role="progressbar"]')).toHaveCount.toBeGreaterThan(3)
    
    // Verify task action buttons
    await expect(page.locator('text=暂停')).toBeVisible()
    
    // Test pause functionality
    await page.click('button:has-text("暂停"):first')
    // Should show confirmation or perform action
  })

  test('should show task error messages and validation status', async ({ page }) => {
    // Navigate to tasks tab
    await page.click('text=抓取任务')
    
    // Look for failed task with error messages
    await expect(page.locator('text=成绩文件处理')).toBeVisible()
    await expect(page.locator('text=失败')).toBeVisible()
    
    // Check error messages are displayed
    await expect(page.locator('text=错误信息:')).toBeVisible()
    await expect(page.locator('text=格式验证失败')).toBeVisible()
    await expect(page.locator('text=重复记录过多')).toBeVisible()
    await expect(page.locator('text=必填字段缺失')).toBeVisible()
    
    // Check validation status indicators
    await expect(page.locator('text=验证状态:')).toBeVisible()
    await expect(page.locator('text=通过')).toBeVisible()
    await expect(page.locator('text=失败')).toBeVisible()
  })

  test('should display monitoring dashboard with system metrics', async ({ page }) => {
    // Navigate to monitoring tab
    await page.click('text=流程监控')
    
    // Check section title
    await expect(page.locator('text=数据流监控面板')).toBeVisible()
    
    // Verify key metrics cards
    await expect(page.locator('text=今日数据量')).toBeVisible()
    await expect(page.locator('text=31,560')).toBeVisible()
    await expect(page.locator('text=条记录')).toBeVisible()
    
    await expect(page.locator('text=处理效率')).toBeVisible()
    await expect(page.locator('text=1,250')).toBeVisible()
    await expect(page.locator('text=条/分钟')).toBeVisible()
    
    await expect(page.locator('text=系统负载')).toBeVisible()
    await expect(page.locator('text=CPU使用率')).toBeVisible()
    await expect(page.locator('text=内存使用率')).toBeVisible()
    await expect(page.locator('text=网络带宽')).toBeVisible()
    
    // Verify data source activity status
    await expect(page.locator('text=数据源活动状态')).toBeVisible()
    
    // Verify processing statistics
    await expect(page.locator('text=处理统计')).toBeVisible()
    await expect(page.locator('text=成功处理')).toBeVisible()
    await expect(page.locator('text=验证失败')).toBeVisible()
    await expect(page.locator('text=格式错误')).toBeVisible()
    await expect(page.locator('text=重复数据')).toBeVisible()
  })

  test('should display quality metrics and validation rules', async ({ page }) => {
    // Navigate to quality tab
    await page.click('text=质量检查')
    
    // Check section title
    await expect(page.locator('text=数据质量检查与验证')).toBeVisible()
    
    // Verify quality metrics are displayed
    const qualityMetrics = [
      '数据完整性',
      '数据准确性', 
      '数据一致性',
      '重复率控制',
      '及时性指标',
      '异常值检测'
    ]
    
    for (const metric of qualityMetrics) {
      await expect(page.locator(`text=${metric}`)).toBeVisible()
    }
    
    // Verify percentage values and progress bars
    await expect(page.locator('text=96%')).toBeVisible()
    await expect(page.locator('text=92%')).toBeVisible()
    await expect(page.locator('text=88%')).toBeVisible()
    
    // Check validation rules section
    await expect(page.locator('text=验证规则配置')).toBeVisible()
    
    const validationRules = [
      '学号必填验证',
      '邮箱格式验证',
      '成绩范围验证',
      '学号唯一性验证',
      '选课逻辑验证'
    ]
    
    for (const rule of validationRules) {
      await expect(page.locator(`text=${rule}`)).toBeVisible()
    }
    
    // Verify rule type badges
    await expect(page.locator('text=必填')).toBeVisible()
    await expect(page.locator('text=格式')).toBeVisible()
    await expect(page.locator('text=范围')).toBeVisible()
    await expect(page.locator('text=唯一')).toBeVisible()
    await expect(page.locator('text=业务')).toBeVisible()
  })

  test('should show data cleaning statistics', async ({ page }) => {
    // Navigate to quality tab
    await page.click('text=质量检查')
    
    // Check data cleaning section
    await expect(page.locator('text=数据清洗统计')).toBeVisible()
    
    // Verify cleaning statistics
    await expect(page.locator('text=总记录数')).toBeVisible()
    await expect(page.locator('text=31,560')).toBeVisible()
    
    await expect(page.locator('text=清洗后保留')).toBeVisible()
    await expect(page.locator('text=28,235')).toBeVisible()
    
    await expect(page.locator('text=验证失败')).toBeVisible()
    await expect(page.locator('text=2,105')).toBeVisible()
    
    await expect(page.locator('text=重复删除')).toBeVisible()
    await expect(page.locator('text=1,220')).toBeVisible()
  })

  test('should display rate limit management for all sources', async ({ page }) => {
    // Navigate to rate limits tab
    await page.click('text=速率管理')
    
    // Check section title
    await expect(page.locator('text=API速率限制管理')).toBeVisible()
    
    // Verify data sources with rate limits are shown
    await expect(page.locator('text=学生管理系统数据库')).toBeVisible()
    await expect(page.locator('text=课程评价API')).toBeVisible()
    
    // Check rate limit metrics
    await expect(page.locator('text=每秒请求数')).toBeVisible()
    await expect(page.locator('text=每分钟请求数')).toBeVisible()
    await expect(page.locator('text=每小时请求数')).toBeVisible()
    
    // Verify progress bars for usage
    await expect(page.locator('[role="progressbar"]')).toHaveCount.toBeGreaterThan(6)
    
    // Check reset time information
    await expect(page.locator('text=下次重置时间:')).toBeVisible()
    await expect(page.locator('text=15:00:00')).toBeVisible()
    
    // Verify adjustment buttons
    await expect(page.locator('text=调整限制')).toBeVisible()
    
    // Check for rate limit warnings
    await expect(page.locator('text=即将达到速率限制')).toBeVisible()
  })

  test('should manage system alerts and notifications', async ({ page }) => {
    // Navigate to alerts tab
    await page.click('text=系统告警')
    
    // Check section title
    await expect(page.locator('text=系统监控告警')).toBeVisible()
    
    // Verify different alert types
    await expect(page.locator('text=FTP连接失败')).toBeVisible()
    await expect(page.locator('text=数据量异常')).toBeVisible()
    await expect(page.locator('text=定时任务完成')).toBeVisible()
    
    // Check alert type badges
    await expect(page.locator('text=错误')).toBeVisible()
    await expect(page.locator('text=警告')).toBeVisible()
    await expect(page.locator('text=信息')).toBeVisible()
    
    // Verify alert timestamps
    await expect(page.locator('text=14:32:00')).toBeVisible()
    await expect(page.locator('text=14:25:00')).toBeVisible()
    
    // Check action buttons
    await expect(page.locator('text=确认处理')).toBeVisible()
    await expect(page.locator('text=查看详情')).toBeVisible()
    
    // Test alert acknowledgment
    await page.click('button:has-text("确认处理"):first')
    // Should perform acknowledgment action
    
    // Check alert management controls
    await expect(page.locator('text=筛选')).toBeVisible()
    await expect(page.locator('text=刷新')).toBeVisible()
    await expect(page.locator('text=全部标记为已读')).toBeVisible()
  })

  test('should handle auto-refresh functionality', async ({ page }) => {
    // Check auto-refresh toggle
    await expect(page.locator('text=自动刷新')).toBeVisible()
    
    // Verify last update timestamp
    await expect(page.locator('text=最后更新:')).toBeVisible()
    
    // Test refresh button
    await page.click('text=立即刷新')
    
    // Auto-refresh should be enabled by default
    const autoRefreshSwitch = page.locator('input[type="checkbox"]').first()
    await expect(autoRefreshSwitch).toBeChecked()
    
    // Test toggling auto-refresh
    await page.click('text=自动刷新')
    await expect(autoRefreshSwitch).not.toBeChecked()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify main layout is still functional
    await expect(page.locator('h1')).toContainText('自动化数据收集系统')
    
    // Check that overview cards stack properly
    await expect(page.locator('text=数据源总数')).toBeVisible()
    await expect(page.locator('text=运行中任务')).toBeVisible()
    
    // Verify tabs are still accessible
    await expect(page.locator('[role="tablist"]')).toBeVisible()
    
    // Test tab switching on mobile
    await page.click('text=抓取任务')
    await expect(page.locator('text=数据抓取任务状态')).toBeVisible()
    
    // Verify touch-friendly button sizes
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    
    for (let i = 0; i < Math.min(3, buttonCount); i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        const box = await button.boundingBox()
        if (box) {
          expect(box.height).toBeGreaterThan(40) // Minimum touch target size
        }
      }
    }
  })

  test('should handle progress bar updates in real-time', async ({ page }) => {
    // Navigate to tasks tab
    await page.click('text=抓取任务')
    
    // Check for running task with progress
    await expect(page.locator('text=学生基本信息同步')).toBeVisible()
    await expect(page.locator('text=运行中')).toBeVisible()
    
    // Verify progress information
    await expect(page.locator('text=处理进度')).toBeVisible()
    await expect(page.locator('text=11,565 / 15,420 (75%)')).toBeVisible()
    
    // Check progress bar is displayed correctly
    const progressBars = page.locator('[role="progressbar"]')
    await expect(progressBars.first()).toBeVisible()
  })

  test('should validate data source configuration fields', async ({ page }) => {
    // Open new data source dialog
    await page.click('text=添加数据源')
    
    // Test form validation
    await page.click('text=保存配置')
    // Should show validation errors for empty required fields
    
    // Fill in some fields and test
    await page.fill('input[placeholder="输入数据源名称"]', '新测试数据源')
    await page.selectOption('select', 'database')
    await page.fill('input[placeholder="输入连接URL或路径"]', 'mysql://localhost:3306/test')
    await page.fill('input[placeholder="0 */30 * * * *"]', '0 */10 * * * *')
    await page.fill('input[placeholder="1000"]', '500')
    
    // Test save functionality
    await page.click('text=保存配置')
    // Should close dialog and add new source
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Navigate to tasks tab to see failed tasks
    await page.click('text=抓取任务')
    
    // Verify error handling for failed tasks
    await expect(page.locator('text=成绩文件处理')).toBeVisible()
    await expect(page.locator('text=失败')).toBeVisible()
    
    // Check error message display
    await expect(page.locator('text=错误信息:')).toBeVisible()
    await expect(page.locator('text=格式验证失败')).toBeVisible()
    
    // Navigate to data sources to see error status
    await page.click('text=数据源管理')
    await expect(page.locator('text=外部系统FTP')).toBeVisible()
    await expect(page.locator('text=错误')).toBeVisible()
    
    // Check error indicators
    await expect(page.locator('text=检测到 8 个错误')).toBeVisible()
  })

  test('should display schedule information correctly', async ({ page }) => {
    // Navigate to data sources
    await page.click('text=数据源管理')
    
    // Check schedule formatting
    await expect(page.locator('text=执行计划:')).toBeVisible()
    await expect(page.locator('text=每30分钟')).toBeVisible()
    await expect(page.locator('text=每10分钟')).toBeVisible()
    await expect(page.locator('text=每3小时')).toBeVisible()
    await expect(page.locator('text=每6小时')).toBeVisible()
    
    // Verify next sync times
    await expect(page.locator('text=下次同步:')).toBeVisible()
    await expect(page.locator('text=2024-01-15')).toBeVisible()
  })

  test('should show validation rule error counts', async ({ page }) => {
    // Navigate to quality tab
    await page.click('text=质量检查')
    
    // Check validation rules with error counts
    await expect(page.locator('text=学号必填验证')).toBeVisible()
    await expect(page.locator('text=错误数量: 5')).toBeVisible()
    
    await expect(page.locator('text=邮箱格式验证')).toBeVisible()
    await expect(page.locator('text=错误数量: 12')).toBeVisible()
    
    await expect(page.locator('text=成绩范围验证')).toBeVisible()
    await expect(page.locator('text=错误数量: 3')).toBeVisible()
    
    // Check disabled rule
    await expect(page.locator('text=选课逻辑验证')).toBeVisible()
    await expect(page.locator('text=错误数量: 0')).toBeVisible()
  })
})

test.describe('Automated Data Collection - Advanced Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="username"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password')
    await page.click('[data-testid="login-button"]')
    await page.goto('/automated-data-collection')
    await page.waitForLoadState('networkidle')
  })

  test('should handle data source type selection in dialog', async ({ page }) => {
    await page.click('text=添加数据源')
    
    // Test selecting different data source types
    await page.click('button[role="combobox"]')
    
    const sourceTypes = ['数据库', 'API接口', '本地文件', 'FTP服务器']
    for (const type of sourceTypes) {
      await expect(page.locator(`text=${type}`)).toBeVisible()
    }
    
    // Select a specific type
    await page.click('text=API接口')
    
    // Verify form adapts to selected type
    await expect(page.locator('input[placeholder="输入连接URL或路径"]')).toBeVisible()
  })

  test('should show detailed rate limit warnings', async ({ page }) => {
    await page.click('text=速率管理')
    
    // Look for rate limit warning
    await expect(page.locator('text=即将达到速率限制')).toBeVisible()
    
    // Check that high usage sources are highlighted
    const progressBars = page.locator('[role="progressbar"]')
    await expect(progressBars).toHaveCount.toBeGreaterThan(6)
    
    // Verify current usage is displayed
    await expect(page.locator('text=使用: 2340 / 10000')).toBeVisible()
  })

  test('should handle task pause and resume operations', async ({ page }) => {
    await page.click('text=抓取任务')
    
    // Find running task
    await expect(page.locator('text=学生基本信息同步')).toBeVisible()
    await expect(page.locator('text=运行中')).toBeVisible()
    
    // Test pause button
    const pauseButton = page.locator('button:has-text("暂停")').first()
    await expect(pauseButton).toBeVisible()
    await pauseButton.click()
    
    // After pausing, should show resume button
    // Note: This would require actual state management in implementation
  })

  test('should filter and manage system alerts', async ({ page }) => {
    await page.click('text=系统告警')
    
    // Check alert summary
    await expect(page.locator('text=显示最近 3 条告警')).toBeVisible()
    await expect(page.locator('text=未处理: 2 条')).toBeVisible()
    
    // Test alert management buttons
    await page.click('text=筛选')
    await page.click('text=刷新')
    
    // Test acknowledge all
    await page.click('text=全部标记为已读')
  })

  test('should display system performance metrics accurately', async ({ page }) => {
    await page.click('text=流程监控')
    
    // Verify performance metrics are realistic
    await expect(page.locator('text=31,560')).toBeVisible() // Today's data volume
    await expect(page.locator('text=1,250')).toBeVisible() // Processing efficiency
    
    // Check system load indicators
    await expect(page.locator('text=65%')).toBeVisible() // CPU usage
    await expect(page.locator('text=72%')).toBeVisible() // Memory usage
    await expect(page.locator('text=45%')).toBeVisible() // Network bandwidth
    
    // Verify processing statistics add up logically
    await expect(page.locator('text=28,235')).toBeVisible() // Successful
    await expect(page.locator('text=89.5%')).toBeVisible() // Success rate
  })

  test('should handle accessibility requirements', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.locator('[role="main"]')).toBeVisible()
    await expect(page.locator('[role="tablist"]')).toBeVisible()
    await expect(page.locator('[role="progressbar"]')).toHaveCount.toBeGreaterThan(3)
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Navigate through tabs with keyboard
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    
    // Check high contrast and readability
    const headings = page.locator('h1, h2, h3, h4')
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible()
    }
  })

  test('should validate cron expression format', async ({ page }) => {
    await page.click('text=添加数据源')
    
    // Test various cron expressions
    const cronField = page.locator('input[placeholder="0 */30 * * * *"]')
    
    // Valid expressions
    await cronField.fill('0 */15 * * * *')
    await cronField.fill('0 0 */2 * * *')
    await cronField.fill('0 30 9 * * MON-FRI')
    
    // Invalid expressions should be handled
    await cronField.fill('invalid cron')
    // Implementation should validate and show error
  })
})