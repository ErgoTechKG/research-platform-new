import { test, expect } from '@playwright/test'

test.describe('Secretary Material Review System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the material review page with admin role
    await page.goto('/secretary-material-review?role=admin')
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="statistics-overview"]')
  })

  test('should display material review system interface', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('材料审核系统')
    
    // Check statistics overview
    await expect(page.locator('[data-testid="statistics-overview"]')).toBeVisible()
    
    // Check filters section
    await expect(page.locator('[data-testid="filters-section"]')).toBeVisible()
    
    // Check materials queue
    await expect(page.locator('[data-testid="materials-queue"]')).toBeVisible()
    
    // Check material details panel
    await expect(page.locator('[data-testid="material-details"]')).toBeVisible()
  })

  test('should filter materials by status', async ({ page }) => {
    // Open status filter
    await page.click('[data-testid="status-filter"]')
    
    // Select pending status
    await page.click('text=待审核')
    
    // Verify filtered results
    const materialItems = page.locator('[data-testid="material-item"]')
    await expect(materialItems).toHaveCount(1) // Assuming one pending item in mock data
  })

  test('should filter materials by type', async ({ page }) => {
    // Open type filter
    await page.click('[data-testid="type-filter"]')
    
    // Select research documents
    await page.click('text=研究文档')
    
    // Verify filtered results
    const materialItems = page.locator('[data-testid="material-item"]')
    await expect(materialItems.first()).toBeVisible()
  })

  test('should search materials', async ({ page }) => {
    // Enter search term
    await page.fill('[data-testid="search-input"]', '机器学习')
    
    // Wait for search results
    await page.waitForTimeout(500)
    
    // Verify search results
    const materialItems = page.locator('[data-testid="material-item"]')
    await expect(materialItems.first()).toContainText('机器学习')
  })

  test('should select and view material details', async ({ page }) => {
    // Click on first material item
    await page.click('[data-testid="material-item"]:first-child')
    
    // Verify material details are displayed
    await expect(page.locator('[data-testid="material-details"] h4')).toBeVisible()
    
    // Check OCR text area
    await expect(page.locator('[data-testid="ocr-text-area"]')).toBeVisible()
  })

  test('should process OCR on material', async ({ page }) => {
    // Select first material
    await page.click('[data-testid="material-item"]:first-child')
    
    // Click OCR process button
    await page.click('[data-testid="ocr-process-button"]')
    
    // Wait for OCR processing simulation
    await page.waitForTimeout(2500)
    
    // Verify OCR text is updated
    const ocrText = await page.locator('[data-testid="ocr-text-area"]').inputValue()
    expect(ocrText).toContain('OCR识别')
  })

  test('should approve material', async ({ page }) => {
    // Select first material
    await page.click('[data-testid="material-item"]:first-child')
    
    // Click approve button
    await page.click('[data-testid="approve-button"]')
    
    // Wait for status update
    await page.waitForTimeout(500)
    
    // Verify material is no longer selected
    await expect(page.locator('[data-testid="material-details"] h4')).not.toBeVisible()
  })

  test('should reject material', async ({ page }) => {
    // Select first material
    await page.click('[data-testid="material-item"]:first-child')
    
    // Click reject button
    await page.click('[data-testid="reject-button"]')
    
    // Wait for status update
    await page.waitForTimeout(500)
    
    // Verify material is no longer selected
    await expect(page.locator('[data-testid="material-details"] h4')).not.toBeVisible()
  })

  test('should select multiple materials for batch operations', async ({ page }) => {
    // Select multiple materials
    await page.check('[data-testid="material-checkbox"]:first-child')
    await page.check('[data-testid="material-checkbox"]:nth-child(2)')
    
    // Verify batch actions appear
    await expect(page.locator('[data-testid="batch-actions"]')).toBeVisible()
    
    // Check selected count
    await expect(page.locator('[data-testid="batch-actions"]')).toContainText('已选择 2 个材料')
  })

  test('should perform batch approval', async ({ page }) => {
    // Select multiple materials
    await page.check('[data-testid="material-checkbox"]:first-child')
    await page.check('[data-testid="material-checkbox"]:nth-child(2)')
    
    // Click batch approve
    await page.click('[data-testid="batch-approve"]')
    
    // Wait for batch operation
    await page.waitForTimeout(500)
    
    // Verify batch actions are hidden
    await expect(page.locator('[data-testid="batch-actions"]')).not.toBeVisible()
  })

  test('should clear material selection', async ({ page }) => {
    // Select multiple materials
    await page.check('[data-testid="material-checkbox"]:first-child')
    await page.check('[data-testid="material-checkbox"]:nth-child(2)')
    
    // Click clear selection
    await page.click('[data-testid="clear-selection"]')
    
    // Verify batch actions are hidden
    await expect(page.locator('[data-testid="batch-actions"]')).not.toBeVisible()
  })

  test('should display review statistics', async ({ page }) => {
    // Check review statistics section
    await expect(page.locator('[data-testid="review-statistics"]')).toBeVisible()
    
    // Verify statistics are displayed
    await expect(page.locator('[data-testid="review-statistics"]')).toContainText('批准率')
    await expect(page.locator('[data-testid="review-statistics"]')).toContainText('平均处理时间')
    await expect(page.locator('[data-testid="review-statistics"]')).toContainText('OCR准确率')
  })

  test('should restrict access for non-admin users', async ({ page }) => {
    // Navigate with student role
    await page.goto('/secretary-material-review?role=student')
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })
})