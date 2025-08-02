import { test, expect } from '@playwright/test'

test.describe('Professor Availability System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the professor availability page as a student
    await page.goto('/professor-availability?role=student')
    await page.waitForLoadState('networkidle')
  })

  test('should display professor availability page correctly', async ({ page }) => {
    // Check page title and main elements
    await expect(page.locator('h1')).toContainText('教授时间安排查看')
    await expect(page.locator('text=查看教授可用时间并进行预约')).toBeVisible()
    
    // Check professor selection dropdown
    await expect(page.locator('[role="combobox"]').first()).toBeVisible()
    
    // Check view toggle buttons
    await expect(page.getByText('📊 周视图')).toBeVisible()
    await expect(page.getByText('📅 月视图')).toBeVisible()
  })

  test('should show professor status and information', async ({ page }) => {
    // Check that professor information is displayed
    await expect(page.locator('text=张教授 (计算机科学)')).toBeVisible()
    await expect(page.locator('text=科研楼A座 305办公室')).toBeVisible()
    
    // Check status indicator
    await expect(page.locator('text=在线')).toBeVisible()
    await expect(page.locator('text=更新于2分钟前')).toBeVisible()
  })

  test('should display weekly calendar with time slots', async ({ page }) => {
    // Check calendar header
    await expect(page.locator('text=本周时间安排')).toBeVisible()
    
    // Check time slots are displayed
    await expect(page.locator('text=08:00')).toBeVisible()
    await expect(page.locator('text=09:00')).toBeVisible()
    await expect(page.locator('text=17:00')).toBeVisible()
    
    // Check weekdays are displayed
    await expect(page.locator('text=周一')).toBeVisible()
    await expect(page.locator('text=周二')).toBeVisible()
    await expect(page.locator('text=周日')).toBeVisible()
    
    // Check availability status indicators
    await expect(page.locator('text=可用').first()).toBeVisible()
    await expect(page.locator('text=忙碌').first()).toBeVisible()
    await expect(page.locator('text=会议中').first()).toBeVisible()
  })

  test('should show color legend for availability status', async ({ page }) => {
    // Check legend items
    await expect(page.locator('text=可用时间')).toBeVisible()
    await expect(page.locator('text=忙碌状态')).toBeVisible()
    await expect(page.locator('text=会议中/不可用')).toBeVisible()
    await expect(page.locator('text=已预约')).toBeVisible()
    await expect(page.locator('text=午休')).toBeVisible()
  })

  test('should allow professor selection', async ({ page }) => {
    // Click professor selection dropdown
    await page.locator('[role="combobox"]').first().click()
    
    // Check professor options are available
    await expect(page.locator('text=张教授 (计算机科学)')).toBeVisible()
    await expect(page.locator('text=李教授 (人工智能)')).toBeVisible()
    await expect(page.locator('text=王教授 (软件工程)')).toBeVisible()
    
    // Select a different professor
    await page.locator('text=李教授 (人工智能)').click()
    
    // Verify professor selection changed
    await expect(page.locator('text=李教授 (人工智能)').first()).toBeVisible()
  })

  test('should toggle between week and month view', async ({ page }) => {
    // Initially should be in week view
    await expect(page.getByRole('button', { name: '📊 周视图' })).toHaveClass(/bg-primary/)
    
    // Click month view
    await page.getByRole('button', { name: '📅 月视图' }).click()
    
    // Check month view is active
    await expect(page.getByRole('button', { name: '📅 月视图' })).toHaveClass(/bg-primary/)
    
    // Switch back to week view
    await page.getByRole('button', { name: '📊 周视图' }).click()
    await expect(page.getByRole('button', { name: '📊 周视图' })).toHaveClass(/bg-primary/)
  })

  test('should open booking panel when clicking available time slot', async ({ page }) => {
    // Find and click an available time slot (green button)
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Check booking panel appears
    await expect(page.locator('text=快速预约')).toBeVisible()
    await expect(page.locator('text=选中时间')).toBeVisible()
    await expect(page.locator('text=会面主题 (必填)')).toBeVisible()
  })

  test('should validate booking form', async ({ page }) => {
    // Click an available time slot
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Try to submit without required fields
    const confirmButton = page.getByRole('button', { name: '确认预约' })
    await expect(confirmButton).toBeDisabled()
    
    // Fill in required subject field
    await page.locator('#subject').fill('研究进度讨论')
    await expect(confirmButton).toBeEnabled()
    
    // Fill optional description
    await page.locator('#description').fill('讨论本周研究进展和下周计划')
    
    // Change duration
    await page.locator('text=60分钟').click()
    await page.locator('text=90分钟').click()
  })

  test('should handle booking submission', async ({ page }) => {
    // Mock the alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('预约已提交')
      await dialog.accept()
    })
    
    // Click an available time slot
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Fill booking form
    await page.locator('#subject').fill('研究进度讨论')
    await page.locator('#description').fill('讨论本周研究进展')
    
    // Submit booking
    await page.getByRole('button', { name: '确认预约' }).click()
    
    // Booking panel should close after submission
    await expect(page.locator('text=快速预约')).not.toBeVisible()
  })

  test('should toggle reminder settings', async ({ page }) => {
    // Click an available time slot
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Check reminder toggles
    const emailToggle = page.locator('text=邮件提醒: 提前15分钟').locator('..').locator('[role="switch"]')
    const smsToggle = page.locator('text=短信提醒: 提前30分钟').locator('..').locator('[role="switch"]')
    const pushToggle = page.locator('text=推送通知: 提前5分钟').locator('..').locator('[role="switch"]')
    
    // Toggle settings
    await emailToggle.click()
    await smsToggle.click()
    await pushToggle.click()
    
    // Verify they can be toggled back
    await emailToggle.click()
    await smsToggle.click()
    await pushToggle.click()
  })

  test('should display upcoming appointments', async ({ page }) => {
    // Check upcoming appointments section
    await expect(page.locator('text=我的预约记录')).toBeVisible()
    await expect(page.locator('text=即将到来的预约')).toBeVisible()
    
    // Check specific appointments
    await expect(page.locator('text=今天 15:00-16:00')).toBeVisible()
    await expect(page.locator('text=李教授')).toBeVisible()
    await expect(page.locator('text=实验室B201')).toBeVisible()
    await expect(page.locator('text=论文开题讨论')).toBeVisible()
    await expect(page.locator('text=✅ 已确认')).toBeVisible()
    
    // Check action buttons
    await expect(page.getByRole('button', { name: '📱 发送消息' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: '📋 查看详情' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: '⏰ 修改时间' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: '❌ 取消预约' }).first()).toBeVisible()
  })

  test('should display appointment statistics', async ({ page }) => {
    // Check appointment history statistics
    await expect(page.locator('text=历史预约: 本月已完成 8次会面')).toBeVisible()
    await expect(page.locator('text=平均时长 45分钟')).toBeVisible()
    await expect(page.locator('text=满意度 4.9/5.0')).toBeVisible()
  })

  test('should show multi-professor comparison', async ({ page }) => {
    // Check multi-professor comparison section
    await expect(page.locator('text=多教授时间对比')).toBeVisible()
    await expect(page.locator('text=对比教授:')).toBeVisible()
    
    // Check comparison dropdowns
    const comparisonDropdowns = page.locator('[role="combobox"]')
    await expect(comparisonDropdowns).toHaveCount(4) // 1 main + 3 comparison
    
    // Check common available times
    await expect(page.locator('text=共同可用时间')).toBeVisible()
    await expect(page.locator('text=周二 14:00-15:00 (3位教授都有空)')).toBeVisible()
    await expect(page.locator('text=周四 11:00-12:00 (3位教授都有空)')).toBeVisible()
    
    // Check comparison action buttons
    await expect(page.getByRole('button', { name: '📅 群体会议预约' })).toBeVisible()
    await expect(page.getByRole('button', { name: '📊 查看详细对比' })).toBeVisible()
    await expect(page.getByRole('button', { name: '💾 保存对比方案' })).toBeVisible()
  })

  test('should cancel booking', async ({ page }) => {
    // Click an available time slot
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Check booking panel is open
    await expect(page.locator('text=快速预约')).toBeVisible()
    
    // Click cancel button
    await page.getByRole('button', { name: '取消' }).click()
    
    // Booking panel should close
    await expect(page.locator('text=快速预约')).not.toBeVisible()
  })

  test('should not allow clicking unavailable time slots', async ({ page }) => {
    // Find unavailable slots (should be disabled)
    const unavailableSlots = page.locator('button').filter({ hasText: '🔴不可用' })
    const firstUnavailable = unavailableSlots.first()
    
    if (await firstUnavailable.count() > 0) {
      await expect(firstUnavailable).toBeDisabled()
      
      // Try clicking it
      await firstUnavailable.click({ force: true })
      
      // Booking panel should not appear
      await expect(page.locator('text=快速预约')).not.toBeVisible()
    }
  })

  test('should show booking time and professor details', async ({ page }) => {
    // Click an available time slot
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Check booking details are shown
    await expect(page.locator('text=选中时间')).toBeVisible()
    await expect(page.locator('text=教授和地点')).toBeVisible()
    await expect(page.locator('text=张教授')).toBeVisible()
    await expect(page.locator('text=科研楼A座 305办公室')).toBeVisible()
  })

  test('should save draft and use templates', async ({ page }) => {
    // Click an available time slot
    const availableSlot = page.locator('button').filter({ hasText: '🟢可用' }).first()
    await availableSlot.click()
    
    // Fill some data
    await page.locator('#subject').fill('研究讨论')
    
    // Test save draft button
    await expect(page.getByRole('button', { name: '💾 保存草稿' })).toBeVisible()
    
    // Test template selection button
    await expect(page.getByRole('button', { name: '📋 模板选择' })).toBeVisible()
  })
})

test.describe('Professor Availability - Access Control', () => {
  test('should redirect non-student users', async ({ page }) => {
    // Try to access as professor
    await page.goto('/professor-availability?role=professor')
    await page.waitForLoadState('networkidle')
    
    // Should be redirected to dashboard or show access denied
    await expect(page.url()).not.toContain('/professor-availability')
  })

  test('should redirect unauthenticated users', async ({ page }) => {
    // Access without role parameter (simulating unauthenticated)
    await page.goto('/professor-availability')
    await page.waitForLoadState('networkidle')
    
    // Should be redirected to login or dashboard
    await expect(page.url()).toContain('/login')
  })
})

test.describe('Professor Availability - Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/professor-availability?role=student')
    await page.waitForLoadState('networkidle')
    
    // Check main elements are still visible
    await expect(page.locator('h1')).toContainText('教授时间安排查看')
    await expect(page.locator('text=本周时间安排')).toBeVisible()
    
    // Check calendar table is horizontally scrollable
    const calendarTable = page.locator('table').first()
    await expect(calendarTable).toBeVisible()
  })

  test('should be responsive on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/professor-availability?role=student')
    await page.waitForLoadState('networkidle')
    
    // Check layout adapts properly
    await expect(page.locator('h1')).toContainText('教授时间安排查看')
    await expect(page.locator('text=本周时间安排')).toBeVisible()
  })
})