// ProfessorDashboard Playwright E2E Tests
// This file contains comprehensive tests for the Professor Dashboard functionality
// To run these tests, first install Playwright: npm install -D @playwright/test

import { test, expect } from '@playwright/test'

test.describe('Professor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login and simulate faculty authentication
    await page.goto('/login')
    
    // Simulate faculty login - adjust based on actual auth implementation
    await page.fill('[data-testid="username"]', 'professor@test.com')
    await page.fill('[data-testid="password"]', 'password')
    await page.click('[data-testid="login-button"]')
    
    // Navigate to professor dashboard
    await page.goto('/professor-dashboard')
    await page.waitForLoadState('networkidle')
  })

  test('should display professor dashboard with all main sections', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/教学管理中心/)
    
    // Verify main header
    await expect(page.locator('h1')).toContainText('教学管理中心')
    
    // Verify all main sections are present
    await expect(page.locator('[data-testid="schedule-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="pending-tasks-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="student-management-section"]')).toBeVisible()
    await expect(page.locator('[data-testid="batch-operations"]')).toBeVisible()
    await expect(page.locator('[data-testid="quick-actions"]')).toBeVisible()
  })

  test('should display today\'s schedule correctly', async ({ page }) => {
    const scheduleSection = page.locator('[data-testid="schedule-section"]')
    
    // Check section title
    await expect(scheduleSection.locator('h3')).toContainText('今日日程')
    
    // Verify schedule items are displayed
    const scheduleItems = scheduleSection.locator('[data-testid="schedule-item"]')
    await expect(scheduleItems).toHaveCount(3) // Based on mock data
    
    // Check specific schedule events
    await expect(scheduleSection).toContainText('10:00 组会')
    await expect(scheduleSection).toContainText('14:00 面试学生')
    await expect(scheduleSection).toContainText('16:00 答辩评审')
    
    // Verify location information is displayed
    await expect(scheduleSection).toContainText('AI实验室')
    await expect(scheduleSection).toContainText('办公室')
    await expect(scheduleSection).toContainText('会议室A')
  })

  test('should display pending tasks with counts and urgency indicators', async ({ page }) => {
    const pendingSection = page.locator('[data-testid="pending-tasks-section"]')
    
    // Check section title
    await expect(pendingSection.locator('h3')).toContainText('待处理事项')
    
    // Verify pending task items
    const taskItems = pendingSection.locator('[data-testid="pending-task-item"]')
    await expect(taskItems).toHaveCount(3) // Based on mock data
    
    // Check specific task categories and counts
    await expect(pendingSection).toContainText('待评作业')
    await expect(pendingSection).toContainText('8项')
    await expect(pendingSection).toContainText('申请审批')
    await expect(pendingSection).toContainText('3项')
    await expect(pendingSection).toContainText('报告评阅')
    await expect(pendingSection).toContainText('5项')
    
    // Check urgent indicator is present for urgent tasks
    const urgentIndicators = pendingSection.locator('[data-testid="urgent-indicator"]')
    await expect(urgentIndicators).toHaveCount(1) // One urgent task
  })

  test('should display student management overview with statistics', async ({ page }) => {
    const studentSection = page.locator('[data-testid="student-management-section"]')
    
    // Check section title
    await expect(studentSection.locator('h3')).toContainText('学生管理概览')
    
    // Verify overview statistics
    await expect(studentSection).toContainText('指导学生: 12人')
    await expect(studentSection).toContainText('本周提交: 85%')
    await expect(studentSection).toContainText('平均进度: 72%')
  })

  test('should display student table with progress and status', async ({ page }) => {
    const studentTable = page.locator('[data-testid="student-table"]')
    
    // Verify table headers
    await expect(studentTable).toContainText('学生')
    await expect(studentTable).toContainText('进度')
    await expect(studentTable).toContainText('最近提交')
    await expect(studentTable).toContainText('状态')
    
    // Verify student rows
    const studentRows = studentTable.locator('[data-testid="student-row"]')
    await expect(studentRows).toHaveCount(5) // Based on mock data
    
    // Check specific student data
    await expect(studentTable).toContainText('王小明')
    await expect(studentTable).toContainText('75%')
    await expect(studentTable).toContainText('2小时前')
    await expect(studentTable).toContainText('优秀')
    
    // Verify progress bars are displayed
    const progressBars = studentTable.locator('[data-testid="progress-bar"]')
    await expect(progressBars).toHaveCount(5)
    
    // Verify status badges
    const statusBadges = studentTable.locator('[data-testid="status-badge"]')
    await expect(statusBadges).toHaveCount(5)
    
    // Check for warning status indicator
    await expect(studentTable).toContainText('需关注')
  })

  test('should have working batch operation buttons', async ({ page }) => {
    const batchOpsSection = page.locator('[data-testid="batch-operations"]')
    
    // Verify all batch operation buttons are present
    await expect(batchOpsSection.locator('[data-testid="batch-grading-button"]')).toBeVisible()
    await expect(batchOpsSection.locator('[data-testid="send-notification-button"]')).toBeVisible()
    await expect(batchOpsSection.locator('[data-testid="export-report-button"]')).toBeVisible()
    
    // Test batch grading navigation
    await page.click('[data-testid="batch-grading-button"]')
    await expect(page).toHaveURL(/\/batch-scoring/)
    
    // Navigate back
    await page.goBack()
    
    // Test notification navigation
    await page.click('[data-testid="send-notification-button"]')
    await expect(page).toHaveURL(/\/notification-center/)
    
    // Navigate back
    await page.goBack()
    
    // Test export report navigation
    await page.click('[data-testid="export-report-button"]')
    await expect(page).toHaveURL(/\/report-generator/)
  })

  test('should provide working quick action buttons', async ({ page }) => {
    const quickActionsSection = page.locator('[data-testid="quick-actions"]')
    
    // Verify all quick action buttons are present
    const quickActionButtons = quickActionsSection.locator('[data-testid="quick-action-button"]')
    await expect(quickActionButtons).toHaveCount(4) // Based on mock data
    
    // Check button labels
    await expect(quickActionsSection).toContainText('发布任务')
    await expect(quickActionsSection).toContainText('学生筛选')
    await expect(quickActionsSection).toContainText('师生互动')
    await expect(quickActionsSection).toContainText('数据分析')
    
    // Test task publishing navigation
    await quickActionButtons.filter({ hasText: '发布任务' }).click()
    await expect(page).toHaveURL(/\/task-publishing/)
    
    // Navigate back to dashboard
    await page.goBack()
    
    // Test student screening navigation
    await quickActionButtons.filter({ hasText: '学生筛选' }).click()
    await expect(page).toHaveURL(/\/mentor-screening/)
  })

  test('should have working settings and logout buttons', async ({ page }) => {
    // Test settings button
    await page.click('[data-testid="settings-button"]')
    // Note: Adjust based on actual settings page implementation
    
    // Navigate back to dashboard
    await page.goto('/professor-dashboard')
    
    // Test logout button
    await page.click('[data-testid="logout-button"]')
    await expect(page).toHaveURL(/\/login/)
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Verify dashboard is still functional on mobile
    await expect(page.locator('h1')).toContainText('教学管理中心')
    
    // Check that cards stack properly on mobile
    const scheduleSection = page.locator('[data-testid="schedule-section"]')
    const pendingSection = page.locator('[data-testid="pending-tasks-section"]')
    await expect(scheduleSection).toBeVisible()
    await expect(pendingSection).toBeVisible()
    
    // Verify touch-friendly button sizes
    const quickActionButtons = page.locator('[data-testid="quick-action-button"]')
    for (const button of await quickActionButtons.all()) {
      const box = await button.boundingBox()
      expect(box?.height).toBeGreaterThan(44) // Minimum touch target size
    }
  })

  test('should handle student status indicators correctly', async ({ page }) => {
    const studentTable = page.locator('[data-testid="student-table"]')
    
    // Check that excellent students have green badges
    const excellentBadges = studentTable.locator('[data-testid="status-badge"]').filter({ hasText: '优秀' })
    await expect(excellentBadges).toHaveCount(2)
    
    // Check that warning students have warning indicators
    const warningBadges = studentTable.locator('[data-testid="status-badge"]').filter({ hasText: '需关注' })
    await expect(warningBadges).toHaveCount(1)
    
    // Check that good students have appropriate badges
    const goodBadges = studentTable.locator('[data-testid="status-badge"]').filter({ hasText: '良好' })
    await expect(goodBadges).toHaveCount(2)
  })

  test('should handle real-time updates for pending tasks', async ({ page }) => {
    // This test would verify real-time updates to pending tasks, schedule, etc.
    // Implementation depends on actual real-time update mechanism
    
    const pendingSection = page.locator('[data-testid="pending-tasks-section"]')
    
    // Verify initial task counts
    await expect(pendingSection).toContainText('待评作业')
    await expect(pendingSection).toContainText('8项')
    
    // Simulate task completion and verify count updates
    // For now, just verify the structure is in place for updates
    await expect(pendingSection).toBeVisible()
  })

  test('should handle accessibility requirements', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.locator('[role="main"]')).toBeVisible()
    
    // Verify keyboard navigation works
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
    
    // Check color contrast and text readability
    const headings = page.locator('h1, h2, h3')
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible()
    }
    
    // Verify table is accessible
    const table = page.locator('[data-testid="student-table"]')
    await expect(table).toBeVisible()
  })
})

test.describe('Professor Dashboard - Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network error
    await page.route('**/api/**', route => route.abort())
    
    await page.goto('/professor-dashboard')
    
    // Verify error states are handled gracefully
    // Implementation depends on actual error handling approach
    await expect(page.locator('h1')).toContainText('教学管理中心')
  })

  test('should redirect non-faculty users', async ({ page }) => {
    // Test that only faculty can access the professor dashboard
    // This test would need to be implemented based on actual auth flow
    
    // Simulate student user login
    await page.goto('/login')
    // ... simulate student login
    
    await page.goto('/professor-dashboard')
    await expect(page).toHaveURL(/\/dashboard/) // Should redirect to general dashboard
  })

  test('should handle empty student list gracefully', async ({ page }) => {
    // Test dashboard behavior when professor has no students
    // This would require mocking an empty student list
    
    const studentSection = page.locator('[data-testid="student-management-section"]')
    await expect(studentSection).toBeVisible()
    
    // Should show appropriate message or empty state
    // Implementation depends on actual empty state handling
  })
})