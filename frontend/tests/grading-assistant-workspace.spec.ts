import { test, expect } from '@playwright/test'

test.describe('Grading Assistant Workspace', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the grading assistant workspace page as a professor
    await page.goto('/grading-assistant-workspace?role=professor')
    await page.waitForLoadState('networkidle')
  })

  test('should display grading assistant workspace correctly', async ({ page }) => {
    // Check page title and main elements
    await expect(page.locator('h1')).toContainText('增强阅卷助手工作区')
    await expect(page.locator('text=高效的批量阅卷工作环境')).toBeVisible()
    
    // Check header buttons
    await expect(page.getByRole('button', { name: '设置' })).toBeVisible()
    await expect(page.getByRole('button', { name: '统计' })).toBeVisible()
    await expect(page.getByRole('button', { name: '帮助' })).toBeVisible()
  })

  test('should show grading console with progress and controls', async ({ page }) => {
    // Check grading console elements
    await expect(page.locator('text=阅卷控制台')).toBeVisible()
    await expect(page.locator('text=当前任务: 高等数学期中考试')).toBeVisible()
    await expect(page.locator('text=进度: 1/2 (50%)')).toBeVisible()
    
    // Check navigation buttons
    await expect(page.getByRole('button', { name: 'Prev' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible()
    await expect(page.getByRole('button', { name: '搜索' })).toBeVisible()
    await expect(page.getByRole('button', { name: '模板' })).toBeVisible()
    
    // Check keyboard shortcuts info
    await expect(page.locator('text=快捷键: [1-5]评分 [Space]下一题 [B]返回 [T]模板 [S]保存 [C]评论')).toBeVisible()
  })

  test('should display student information and answers', async ({ page }) => {
    // Check student info
    await expect(page.locator('text=学生: 张三 (2021001)')).toBeVisible()
    await expect(page.locator('text=题目: 第1题 (20分)')).toBeVisible()
    await expect(page.locator('text=已评分')).toBeVisible()
    
    // Check student answer section
    await expect(page.locator('text=学生答案')).toBeVisible()
    await expect(page.locator('text=参考答案')).toBeVisible()
    
    // Check that answers are displayed
    await expect(page.locator('text=解: 设函数f(x)=x²+2x+1')).toBeVisible()
    await expect(page.locator('text=标准解答:')).toBeVisible()
  })

  test('should show grading template library', async ({ page }) => {
    // Check template library
    await expect(page.locator('text=评分模板库')).toBeVisible()
    await expect(page.locator('text=常用模板')).toBeVisible()
    
    // Check template items
    await expect(page.locator('text=完全正确')).toBeVisible()
    await expect(page.locator('text=部分正确')).toBeVisible()
    await expect(page.locator('text=错误解答')).toBeVisible()
    await expect(page.locator('text=参考答案')).toBeVisible()
    
    // Check template shortcuts
    await expect(page.locator('text=T1')).toBeVisible()
    await expect(page.locator('text=T2')).toBeVisible()
  })

  test('should handle grading input and controls', async ({ page }) => {
    // Check current grading section
    await expect(page.locator('text=当前评分')).toBeVisible()
    
    // Check score input
    const scoreInput = page.locator('input[type="number"]').first()
    await expect(scoreInput).toBeVisible()
    await expect(scoreInput).toHaveValue('18')
    
    // Check star rating display
    const stars = page.locator('.text-yellow-400')
    await expect(stars).toHaveCount(4) // Should show 4 stars for score 18/20
    
    // Check comment textarea
    const commentTextarea = page.locator('textarea')
    await expect(commentTextarea).toBeVisible()
    await expect(commentTextarea).toHaveValue('解题思路正确，步骤完整，仅在最后计算有小错误')
    
    // Check grading action buttons
    await expect(page.getByRole('button', { name: '保存' })).toBeVisible()
    await expect(page.getByRole('button', { name: '应用模板' })).toBeVisible()
    await expect(page.getByRole('button', { name: '重置' })).toBeVisible()
  })

  test('should update score and recalculate star rating', async ({ page }) => {
    // Change score
    const scoreInput = page.locator('input[type="number"]').first()
    await scoreInput.fill('20')
    
    // Check that star rating updates (should show 5 stars for perfect score)
    await page.waitForTimeout(100) // Allow for state update
    const filledStars = page.locator('.text-yellow-400.fill-current')
    await expect(filledStars).toHaveCount(5)
    
    // Check rating text updates
    await expect(page.locator('text=优秀')).toBeVisible()
  })

  test('should handle tag selection', async ({ page }) => {
    // Check existing tags
    await expect(page.locator('.bg-primary').filter({ hasText: '思路正确' })).toBeVisible()
    await expect(page.locator('.bg-primary').filter({ hasText: '计算错误' })).toBeVisible()
    
    // Click on an unselected tag
    await page.locator('text=步骤完整').click()
    
    // Check that tag becomes selected
    await expect(page.locator('.bg-primary').filter({ hasText: '步骤完整' })).toBeVisible()
    
    // Click on a selected tag to deselect
    await page.locator('text=思路正确').click()
    
    // Check that tag becomes unselected
    await expect(page.locator('.border').filter({ hasText: '思路正确' })).toBeVisible()
  })

  test('should apply grading template', async ({ page }) => {
    // Click on a template
    await page.locator('text=完全正确').click()
    
    // Check that score and comment are updated
    await expect(page.locator('input[type="number"]').first()).toHaveValue('20')
    await expect(page.locator('textarea')).toHaveValue('解题思路正确，步骤完整，答案准确')
  })

  test('should navigate between assignments', async ({ page }) => {
    // Initially on first assignment
    await expect(page.locator('text=学生: 张三 (2021001)')).toBeVisible()
    
    // Click next button
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Should show second assignment
    await expect(page.locator('text=学生: 李四 (2021002)')).toBeVisible()
    await expect(page.locator('text=待评分')).toBeVisible()
    
    // Check that score is reset for ungraded assignment
    await expect(page.locator('input[type="number"]').first()).toHaveValue('0')
    
    // Click previous button
    await page.getByRole('button', { name: 'Prev' }).click()
    
    // Should return to first assignment
    await expect(page.locator('text=学生: 张三 (2021001)')).toBeVisible()
  })

  test('should show historical grading reference', async ({ page }) => {
    // Check historical reference section
    await expect(page.locator('text=历史评分参考')).toBeVisible()
    await expect(page.locator('text=类似题目历史评分分布:')).toBeVisible()
    
    // Check score distribution bars
    await expect(page.locator('text=20分:')).toBeVisible()
    await expect(page.locator('text=18分:')).toBeVisible()
    await expect(page.locator('text=32%')).toBeVisible()
    await expect(page.locator('text=48%')).toBeVisible()
    
    // Check recommendation
    await expect(page.locator('text=建议评分: 18分 (±1分)')).toBeVisible()
    
    // Check action buttons
    await expect(page.getByRole('button', { name: '查看趋势' })).toBeVisible()
    await expect(page.getByRole('button', { name: '更新参考' })).toBeVisible()
  })

  test('should display consistency checker', async ({ page }) => {
    // Check consistency checker section
    await expect(page.locator('text=一致性检查器')).toBeVisible()
    await expect(page.locator('text=评分一致性分析')).toBeVisible()
    
    // Check consistency issues
    await expect(page.locator('text=发现潜在不一致:')).toBeVisible()
    await expect(page.locator('text=第3题: 当前17分，历史平均19分')).toBeVisible()
    await expect(page.locator('text=建议重新审查评分标准')).toBeVisible()
    await expect(page.locator('text=学生王五: 各题分差较大')).toBeVisible()
    
    // Check action buttons
    await expect(page.getByRole('button', { name: '调整标准' })).toBeVisible()
    await expect(page.getByRole('button', { name: '详细报告' })).toBeVisible()
  })

  test('should handle batch operations', async ({ page }) => {
    // Check batch operations panel
    await expect(page.locator('text=批量操作面板')).toBeVisible()
    await expect(page.locator('text=批量操作工具:')).toBeVisible()
    
    // Check batch operation buttons
    await expect(page.getByRole('button', { name: '批量打标签' })).toBeVisible()
    await expect(page.getByRole('button', { name: '批量评语' })).toBeVisible()
    await expect(page.getByRole('button', { name: '统计分析' })).toBeVisible()
    await expect(page.getByRole('button', { name: '导出成绩' })).toBeVisible()
    
    // Check fast mode toggles
    await expect(page.locator('text=自动保存')).toBeVisible()
    await expect(page.locator('text=跳过已评')).toBeVisible()
    await expect(page.locator('text=仅显示异常')).toBeVisible()
    await expect(page.locator('text=智能推荐')).toBeVisible()
    
    // Check that auto-save is enabled by default
    const autoSaveSwitch = page.locator('input[id="auto-save"]')
    await expect(autoSaveSwitch).toBeChecked()
  })

  test('should toggle fast mode settings', async ({ page }) => {
    // Toggle skip graded setting
    await page.locator('label[for="skip-graded"]').click()
    
    // Check that it becomes checked
    const skipGradedSwitch = page.locator('input[id="skip-graded"]')
    await expect(skipGradedSwitch).toBeChecked()
    
    // Toggle show anomalies setting
    await page.locator('label[for="show-anomalies"]').click()
    
    // Check that it becomes checked
    const showAnomaliesSwitch = page.locator('input[id="show-anomalies"]')
    await expect(showAnomaliesSwitch).toBeChecked()
  })

  test('should display statistics panel', async ({ page }) => {
    // Check statistics panel
    await expect(page.locator('text=评分统计面板')).toBeVisible()
    await expect(page.locator('text=本次阅卷统计:')).toBeVisible()
    
    // Check statistics values
    await expect(page.locator('text=已评')).toBeVisible()
    await expect(page.locator('text=待评')).toBeVisible()
    await expect(page.locator('text=分钟/份')).toBeVisible()
    await expect(page.locator('text=今日进度')).toBeVisible()
    
    // Check efficiency information
    await expect(page.locator('text=效率趋势: 比上次快15%')).toBeVisible()
    await expect(page.locator('text=预计完成时间: 明天下午3点')).toBeVisible()
    
    // Check recommendation
    await expect(page.locator('text=建议: 当前效率良好，建议保持当前节奏完成阅卷任务')).toBeVisible()
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Navigate to second assignment (ungraded)
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Test number key shortcuts for scoring
    await page.keyboard.press('5')
    await expect(page.locator('input[type="number"]').first()).toHaveValue('20')
    
    await page.keyboard.press('4')
    await expect(page.locator('input[type="number"]').first()).toHaveValue('16')
    
    await page.keyboard.press('3')
    await expect(page.locator('input[type="number"]').first()).toHaveValue('12')
    
    await page.keyboard.press('2')
    await expect(page.locator('input[type="number"]').first()).toHaveValue('8')
    
    await page.keyboard.press('1')
    await expect(page.locator('input[type="number"]').first()).toHaveValue('4')
  })

  test('should save grading data', async ({ page }) => {
    // Navigate to second assignment
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Set score and comment
    await page.locator('input[type="number"]').first().fill('15')
    await page.locator('textarea').fill('解题思路基本正确，但存在计算错误')
    
    // Add tags
    await page.locator('text=步骤完整').click()
    await page.locator('text=计算错误').click()
    
    // Save the grading
    await page.getByRole('button', { name: '保存' }).click()
    
    // Navigate back and forth to verify data persistence
    await page.getByRole('button', { name: 'Prev' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    
    // Check that data was saved
    await expect(page.locator('input[type="number"]').first()).toHaveValue('15')
    await expect(page.locator('textarea')).toHaveValue('解题思路基本正确，但存在计算错误')
    await expect(page.locator('text=已评分')).toBeVisible()
  })

  test('should handle progress updates', async ({ page }) => {
    // Check initial progress
    await expect(page.locator('text=进度: 1/2 (50%)')).toBeVisible()
    
    // Navigate to second assignment and grade it
    await page.getByRole('button', { name: 'Next' }).click()
    await page.keyboard.press('4') // Set score to 16
    await page.getByRole('button', { name: '保存' }).click()
    
    // Progress should update
    await expect(page.locator('text=进度: 2/2 (100%)')).toBeVisible()
    
    // Statistics should update
    await expect(page.locator('text=已评').locator('..').locator('.text-2xl')).toContainText('2')
    await expect(page.locator('text=待评').locator('..').locator('.text-2xl')).toContainText('0')
  })
})

test.describe('Grading Assistant Workspace - Access Control', () => {
  test('should redirect non-professor users', async ({ page }) => {
    // Try to access as student
    await page.goto('/grading-assistant-workspace?role=student')
    await page.waitForLoadState('networkidle')
    
    // Should be redirected to dashboard or show access denied
    await expect(page.url()).not.toContain('/grading-assistant-workspace')
  })

  test('should redirect unauthenticated users', async ({ page }) => {
    // Access without role parameter (simulating unauthenticated)
    await page.goto('/grading-assistant-workspace')
    await page.waitForLoadState('networkidle')
    
    // Should be redirected to login
    await expect(page.url()).toContain('/login')
  })
})

test.describe('Grading Assistant Workspace - Responsive Design', () => {
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/grading-assistant-workspace?role=professor')
    await page.waitForLoadState('networkidle')
    
    // Check main elements are still visible
    await expect(page.locator('h1')).toContainText('增强阅卷助手工作区')
    await expect(page.locator('text=阅卷控制台')).toBeVisible()
    
    // Check that layout adapts to mobile
    const mainGrid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-3')
    await expect(mainGrid).toBeVisible()
  })

  test('should be responsive on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/grading-assistant-workspace?role=professor')
    await page.waitForLoadState('networkidle')
    
    // Check layout adapts properly
    await expect(page.locator('h1')).toContainText('增强阅卷助手工作区')
    await expect(page.locator('text=评分模板库')).toBeVisible()
    await expect(page.locator('text=当前评分')).toBeVisible()
  })
})