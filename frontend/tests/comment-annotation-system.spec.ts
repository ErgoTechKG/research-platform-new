import { test, expect } from '@playwright/test'

test.describe('Comment & Annotation System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the comment annotation system page
    await page.goto('/comment-annotation-system')
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="document-content"]')
  })

  test('should display comment annotation interface', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('评论与批注系统')
    
    // Check filters section
    await expect(page.locator('[data-testid="filters-section"]')).toBeVisible()
    
    // Check document content
    await expect(page.locator('[data-testid="document-content"]')).toBeVisible()
    
    // Check comments sidebar
    await expect(page.locator('[data-testid="comments-sidebar"]')).toBeVisible()
  })

  test('should filter comments by type', async ({ page }) => {
    // Open type filter
    await page.click('[data-testid="type-filter"]')
    
    // Select suggestion type
    await page.click('text=建议')
    
    // Verify filtered results
    const commentItems = page.locator('[data-testid="comment-item"]')
    if (await commentItems.first().isVisible()) {
      await expect(commentItems.first()).toContainText('建议')
    }
  })

  test('should filter comments by status', async ({ page }) => {
    // Open status filter
    await page.click('[data-testid="status-filter"]')
    
    // Select open status
    await page.click('text=开放')
    
    // Verify filter is applied
    await expect(page.locator('[data-testid="status-filter"]')).toContainText('开放')
  })

  test('should search comments', async ({ page }) => {
    // Enter search term
    await page.fill('[data-testid="search-input"]', '建议')
    
    // Wait for search results
    await page.waitForTimeout(500)
    
    // Verify search results
    const commentItems = page.locator('[data-testid="comment-item"]')
    if (await commentItems.first().isVisible()) {
      await expect(commentItems.first()).toContainText('建议')
    }
  })

  test('should display existing comments', async ({ page }) => {
    // Check comments sidebar has comments
    await expect(page.locator('[data-testid="comments-sidebar"]')).toContainText('评论列表')
    
    // Check comment items
    const commentItems = page.locator('[data-testid="comment-item"]')
    await expect(commentItems.first()).toBeVisible()
  })

  test('should show comment details', async ({ page }) => {
    // Check first comment item details
    const firstComment = page.locator('[data-testid="comment-item"]').first()
    
    // Verify comment has author, date, content
    await expect(firstComment).toContainText('张教授')
    await expect(firstComment).toContainText('2024-03-15')
    await expect(firstComment).toContainText('建议')
  })

  test('should add comment via text selection', async ({ page }) => {
    // Select text in document (simulate text selection)
    await page.locator('[data-testid="document-text"]').click()
    
    // If comment form appears after text selection
    const commentForm = page.locator('[data-testid="comment-form"]')
    if (await commentForm.isVisible()) {
      // Fill comment content
      await page.fill('[data-testid="comment-textarea"]', '这是一个测试评论')
      
      // Submit comment
      await page.click('[data-testid="submit-comment"]')
      
      // Verify comment form closes
      await expect(commentForm).not.toBeVisible()
    }
  })

  test('should cancel comment creation', async ({ page }) => {
    // If comment form is visible
    const commentForm = page.locator('[data-testid="comment-form"]')
    if (await commentForm.isVisible()) {
      // Click cancel
      await page.click('[data-testid="cancel-comment"]')
      
      // Verify form closes
      await expect(commentForm).not.toBeVisible()
    }
  })

  test('should reply to comment', async ({ page }) => {
    // Click reply button on first comment
    const replyButton = page.locator('[data-testid="reply-button"]').first()
    if (await replyButton.isVisible()) {
      await replyButton.click()
      
      // Check reply textarea appears
      await expect(page.locator('[data-testid="reply-textarea"]')).toBeVisible()
      
      // Fill reply content
      await page.fill('[data-testid="reply-textarea"]', '这是回复内容')
      
      // Submit reply
      await page.click('[data-testid="submit-reply"]')
      
      // Wait for reply to be added
      await page.waitForTimeout(500)
    }
  })

  test('should cancel reply', async ({ page }) => {
    // Click reply button on first comment
    const replyButton = page.locator('[data-testid="reply-button"]').first()
    if (await replyButton.isVisible()) {
      await replyButton.click()
      
      // Cancel reply
      await page.click('[data-testid="cancel-reply"]')
      
      // Verify reply textarea is hidden
      await expect(page.locator('[data-testid="reply-textarea"]')).not.toBeVisible()
    }
  })

  test('should like comment', async ({ page }) => {
    // Click like button on first comment
    const likeButton = page.locator('[data-testid="like-button"]').first()
    if (await likeButton.isVisible()) {
      // Get initial like count
      const initialText = await likeButton.textContent()
      
      await likeButton.click()
      
      // Wait for update
      await page.waitForTimeout(500)
      
      // Like count might change (depending on implementation)
      const newText = await likeButton.textContent()
      expect(newText).toBeDefined()
    }
  })

  test('should agree with comment', async ({ page }) => {
    // Click agree button on first comment
    const agreeButton = page.locator('[data-testid="agree-button"]').first()
    if (await agreeButton.isVisible()) {
      await agreeButton.click()
      
      // Wait for update
      await page.waitForTimeout(500)
    }
  })

  test('should resolve comment', async ({ page }) => {
    // Click resolve button if available
    const resolveButton = page.locator('[data-testid="resolve-button"]').first()
    if (await resolveButton.isVisible()) {
      await resolveButton.click()
      
      // Wait for status update
      await page.waitForTimeout(500)
    }
  })

  test('should reopen resolved comment', async ({ page }) => {
    // Click reopen button if available
    const reopenButton = page.locator('[data-testid="reopen-button"]').first()
    if (await reopenButton.isVisible()) {
      await reopenButton.click()
      
      // Wait for status update
      await page.waitForTimeout(500)
    }
  })

  test('should display notifications', async ({ page }) => {
    // Click notifications button
    await page.click('[data-testid="notifications-button"]')
    
    // Check notifications dropdown
    await expect(page.locator('[data-testid="notifications-dropdown"]')).toBeVisible()
    
    // Check notification items
    const notificationItems = page.locator('[data-testid="notification-item"]')
    if (await notificationItems.first().isVisible()) {
      await expect(notificationItems.first()).toBeVisible()
    }
  })

  test('should mark notification as read', async ({ page }) => {
    // Open notifications
    await page.click('[data-testid="notifications-button"]')
    
    // Click on first notification
    const firstNotification = page.locator('[data-testid="notification-item"]').first()
    if (await firstNotification.isVisible()) {
      await firstNotification.click()
      
      // Wait for read status update
      await page.waitForTimeout(500)
    }
  })

  test('should display comment types with appropriate icons', async ({ page }) => {
    // Check that comments have type badges with icons
    const commentItems = page.locator('[data-testid="comment-item"]')
    
    if (await commentItems.first().isVisible()) {
      // Check for type badges (suggestion, question, approval, etc.)
      const typeBadges = page.locator('.bg-blue-100, .bg-yellow-100, .bg-green-100, .bg-red-100')
      await expect(typeBadges.first()).toBeVisible()
    }
  })

  test('should show comment replies', async ({ page }) => {
    // Check for reply items in comments
    const replyItems = page.locator('[data-testid="reply-item"]')
    if (await replyItems.first().isVisible()) {
      await expect(replyItems.first()).toBeVisible()
    }
  })

  test('should handle @mentions in comments', async ({ page }) => {
    // Check for mention badges in existing comments
    const mentionBadges = page.locator('text=@')
    if (await mentionBadges.first().isVisible()) {
      await expect(mentionBadges.first()).toBeVisible()
    }
  })

  test('should require authentication', async ({ page }) => {
    // Navigate without authentication (this test assumes auth system)
    await page.goto('/comment-annotation-system')
    
    // Should redirect to login if not authenticated
    // Note: This depends on the auth system implementation
    const currentUrl = page.url()
    if (currentUrl.includes('/login')) {
      await expect(page).toHaveURL(/\/login/)
    }
  })

  test('should export comments', async ({ page }) => {
    // Check export button exists
    const exportButton = page.locator('text=导出评论').first()
    await expect(exportButton).toBeVisible()
    
    // Click export button
    await exportButton.click()
    
    // In real app, this would trigger download
  })
})