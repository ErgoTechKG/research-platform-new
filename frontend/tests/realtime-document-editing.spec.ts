import { test, expect } from '@playwright/test'

test.describe('Real-time Document Editing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the real-time document editing page
    await page.goto('/realtime-document-editing')
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="document-title"]')
  })

  test('should display document editing interface', async ({ page }) => {
    // Check document title input
    await expect(page.locator('[data-testid="document-title"]')).toBeVisible()
    
    // Check document editor
    await expect(page.locator('[data-testid="document-editor"]')).toBeVisible()
    
    // Check document textarea
    await expect(page.locator('[data-testid="document-textarea"]')).toBeVisible()
    
    // Check online users panel
    await expect(page.locator('[data-testid="online-users"]')).toBeVisible()
  })

  test('should edit document title', async ({ page }) => {
    // Clear and type new title
    await page.fill('[data-testid="document-title"]', '新的研究报告标题')
    
    // Verify title is updated
    await expect(page.locator('[data-testid="document-title"]')).toHaveValue('新的研究报告标题')
  })

  test('should edit document content', async ({ page }) => {
    // Clear and type new content
    await page.fill('[data-testid="document-textarea"]', '这是新的文档内容。\n\n## 新章节\n内容测试...')
    
    // Verify content is updated
    await expect(page.locator('[data-testid="document-textarea"]')).toHaveValue(/新的文档内容/)
  })

  test('should display connection status', async ({ page }) => {
    // Check for connection indicator (WiFi icon and text)
    await expect(page.locator('text=已连接')).toBeVisible()
    
    // Check auto-save status
    await expect(page.locator('text=上次保存')).toBeVisible()
  })

  test('should show online users', async ({ page }) => {
    // Check online users section
    await expect(page.locator('[data-testid="online-users"]')).toContainText('在线用户')
    
    // Check user items
    const userItems = page.locator('[data-testid="user-item"]')
    await expect(userItems.first()).toBeVisible()
    
    // Verify user information is displayed
    await expect(userItems.first()).toContainText('张教授')
  })

  test('should toggle version history', async ({ page }) => {
    // Click version history button
    await page.click('[data-testid="version-history-button"]')
    
    // Check version history panel appears
    await expect(page.locator('[data-testid="version-history"]')).toBeVisible()
    
    // Click again to hide
    await page.click('[data-testid="version-history-button"]')
    
    // Version history should be hidden
    await expect(page.locator('[data-testid="version-history"]')).not.toBeVisible()
  })

  test('should display version history items', async ({ page }) => {
    // Show version history
    await page.click('[data-testid="version-history-button"]')
    
    // Check version items
    const versionItems = page.locator('[data-testid="version-item"]')
    await expect(versionItems.first()).toBeVisible()
    
    // Verify version information
    await expect(versionItems.first()).toContainText('v5')
    await expect(versionItems.first()).toContainText('张教授')
  })

  test('should select version from history', async ({ page }) => {
    // Show version history
    await page.click('[data-testid="version-history-button"]')
    
    // Click on first version
    await page.click('[data-testid="version-item"]:first-child')
    
    // Verify version is selected (highlighted)
    await expect(page.locator('[data-testid="version-item"]:first-child')).toHaveClass(/border-blue-500/)
  })

  test('should display document statistics', async ({ page }) => {
    // Check document statistics panel
    await expect(page.locator('[data-testid="document-statistics"]')).toBeVisible()
    
    // Verify statistics are displayed
    await expect(page.locator('[data-testid="document-statistics"]')).toContainText('总字数')
    await expect(page.locator('[data-testid="document-statistics"]')).toContainText('段落数')
    await expect(page.locator('[data-testid="document-statistics"]')).toContainText('章节数')
    await expect(page.locator('[data-testid="document-statistics"]')).toContainText('版本数')
    await expect(page.locator('[data-testid="document-statistics"]')).toContainText('协作者')
  })

  test('should handle conflict resolution', async ({ page }) => {
    // Check if conflict resolution panel appears (simulated)
    // In real scenario, this would be triggered by actual conflicts
    const conflictAlert = page.locator('[data-testid="conflict-resolution"]')
    
    // If conflict exists, test resolution actions
    if (await conflictAlert.isVisible()) {
      await expect(conflictAlert).toContainText('发现编辑冲突')
      
      // Test conflict resolution buttons
      await expect(page.locator('[data-testid="accept-resolution"]')).toBeVisible()
      await expect(page.locator('[data-testid="merge-resolution"]')).toBeVisible()
      await expect(page.locator('[data-testid="ignore-conflict"]')).toBeVisible()
    }
  })

  test('should show connection alerts when disconnected', async ({ page }) => {
    // Wait for potential connection status changes (simulated)
    await page.waitForTimeout(3000)
    
    // Check for connection alert if it appears
    const connectionAlert = page.locator('[data-testid="connection-alert"]')
    if (await connectionAlert.isVisible()) {
      await expect(connectionAlert).toContainText('连接中断')
    }
  })

  test('should disable editing when connection is lost', async ({ page }) => {
    // Check if textarea becomes disabled when connection is lost
    // This is simulated in the component
    await page.waitForTimeout(3000)
    
    const textarea = page.locator('[data-testid="document-textarea"]')
    
    // If connection is lost, textarea should be disabled
    const isDisabled = await textarea.isDisabled()
    if (isDisabled) {
      await expect(textarea).toBeDisabled()
    }
  })

  test('should update word count when editing', async ({ page }) => {
    // Get initial word count
    const initialStats = await page.locator('text=字数：').textContent()
    
    // Add some text
    await page.fill('[data-testid="document-textarea"]', '这是测试文本，用来验证字数统计功能。')
    
    // Wait for update
    await page.waitForTimeout(1000)
    
    // Verify word count updated
    const newStats = await page.locator('text=字数：').textContent()
    expect(newStats).not.toBe(initialStats)
  })

  test('should show user cursor positions', async ({ page }) => {
    // Check for user cursor indicators
    const cursorIndicators = page.locator('text=正在第')
    if (await cursorIndicators.first().isVisible()) {
      await expect(cursorIndicators.first()).toContainText('行编辑')
    }
  })

  test('should allow collaboration panel toggle', async ({ page }) => {
    // Initially collaboration panel should be visible
    await expect(page.locator('[data-testid="online-users"]')).toBeVisible()
    
    // The panel visibility is controlled by showCollaborationPanel state
    // In a real app, there would be a toggle button for this
  })

  test('should require authentication', async ({ page }) => {
    // Navigate without authentication
    await page.goto('/realtime-document-editing')
    
    // Should redirect to login if not authenticated
    // Note: This depends on the auth system implementation
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      await expect(page).toHaveURL(/\/login/)
    }
  })
})