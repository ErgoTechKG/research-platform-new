import { test, expect } from '@playwright/test'

test.describe('LLM Report Generation System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/llm-report-generation')
    await page.waitForLoadState('networkidle')
  })

  test('should display page title and main components', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('LLM智能报告生成系统')
    
    // Check description
    await expect(page.locator('p').first()).toContainText('基于大语言模型的智能报告生成')
    
    // Check tabs
    await expect(page.locator('[role="tablist"]')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'AI生成' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '模板管理' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '批量生成' })).toBeVisible()
    await expect(page.getByRole('tab', { name: '历史记录' })).toBeVisible()
  })

  test('should allow LLM provider selection', async ({ page }) => {
    // Check LLM provider cards are visible
    await expect(page.getByText('OpenAI GPT-4')).toBeVisible()
    await expect(page.getByText('Anthropic Claude 3')).toBeVisible()
    await expect(page.getByText('Google Gemini Pro')).toBeVisible()
    
    // Check default selection (GPT-4 should be selected)
    const gptCard = page.locator('.border-blue-500').first()
    await expect(gptCard).toContainText('OpenAI GPT-4')
    
    // Select Claude 3
    await page.getByText('Anthropic Claude 3').click()
    
    // Verify Claude 3 is now selected
    const claudeCard = page.locator('.border-blue-500').first()
    await expect(claudeCard).toContainText('Anthropic Claude 3')
  })

  test('should allow template selection and configuration', async ({ page }) => {
    // Check template cards are visible
    await expect(page.getByText('AI深度学术分析报告')).toBeVisible()
    await expect(page.getByText('智能教学质量报告')).toBeVisible()
    
    // Select first template
    await page.getByText('AI深度学术分析报告').click()
    
    // Check report configuration section appears
    await expect(page.getByText('报告配置')).toBeVisible()
    await expect(page.getByPlaceholder('输入报告标题...')).toBeVisible()
    await expect(page.getByPlaceholder('输入报告描述...')).toBeVisible()
    
    // Fill in basic configuration
    await page.getByPlaceholder('输入报告标题...').fill('测试报告标题')
    await page.getByPlaceholder('输入报告描述...').fill('这是一个测试报告描述')
    
    // Check template variables
    await expect(page.getByText('分析时间段')).toBeVisible()
    await expect(page.getByText('分析深度')).toBeVisible()
  })

  test('should configure AI parameters', async ({ page }) => {
    // Check AI parameters section
    await expect(page.getByText('AI参数设置')).toBeVisible()
    
    // Check sliders are present
    await expect(page.getByText('创造性')).toBeVisible()
    await expect(page.getByText('最大长度')).toBeVisible()
    
    // Check content review checkbox
    const reviewCheckbox = page.getByText('内容审核').locator('..').locator('button[role="checkbox"]')
    await expect(reviewCheckbox).toBeVisible()
    
    // Toggle content review
    await reviewCheckbox.click()
    await reviewCheckbox.click() // Toggle back
  })

  test('should configure output formats', async ({ page }) => {
    // Select a template first
    await page.getByText('AI深度学术分析报告').click()
    
    // Check output format section
    await expect(page.getByText('输出格式')).toBeVisible()
    
    // Check format options
    await expect(page.getByText('PDF')).toBeVisible()
    await expect(page.getByText('WORD')).toBeVisible()
    await expect(page.getByText('HTML')).toBeVisible()
    await expect(page.getByText('EXCEL')).toBeVisible()
    
    // Toggle HTML format
    await page.getByText('HTML').locator('..').click()
    
    // Toggle EXCEL format
    await page.getByText('EXCEL').locator('..').click()
  })

  test('should generate report with progress tracking', async ({ page }) => {
    // Select template and configure
    await page.getByText('AI深度学术分析报告').click()
    await page.getByPlaceholder('输入报告标题...').fill('自动化测试报告')
    
    // Fill template variables
    const timeRangeSelect = page.locator('button').filter({ hasText: '选择分析时间段' }).first()
    await timeRangeSelect.click()
    await page.getByText('本月').click()
    
    const depthSelect = page.locator('button').filter({ hasText: '选择分析深度' }).first()
    await depthSelect.click()
    await page.getByText('详细').click()
    
    // Click generate button
    await page.getByRole('button', { name: '开始AI生成' }).click()
    
    // Check progress tracking appears
    await expect(page.getByText('生成中...')).toBeVisible()
    await expect(page.locator('[role="progressbar"]')).toBeVisible()
    
    // Check various generation stages appear
    const possibleStages = [
      '数据分析中...',
      '生成报告大纲...',
      'AI内容生成中...',
      '图表自动生成...',
      '内容质量检查...',
      '格式化报告...',
      '生成多格式文件...'
    ]
    
    let stageFound = false
    for (const stage of possibleStages) {
      try {
        await expect(page.getByText(stage)).toBeVisible({ timeout: 1000 })
        stageFound = true
        break
      } catch (e) {
        // Continue to next stage
      }
    }
    expect(stageFound).toBe(true)
    
    // Wait for completion (should happen within 10 seconds based on simulation)
    await page.waitForSelector('text=自动化测试报告', { timeout: 15000 })
  })

  test('should display and manage generated reports in history', async ({ page }) => {
    // Navigate to history tab
    await page.getByRole('tab', { name: '历史记录' }).click()
    
    // Check history content
    await expect(page.getByText('生成历史')).toBeVisible()
    
    // Check sample reports are displayed
    await expect(page.getByText('2024年10月AI深度学术分析报告')).toBeVisible()
    await expect(page.getByText('教学质量智能分析报告')).toBeVisible()
    
    // Check status badges
    await expect(page.getByText('已完成')).toBeVisible()
    await expect(page.getByText('审核中')).toBeVisible()
    
    // Check quality ratings
    await expect(page.getByText('优秀')).toBeVisible()
    await expect(page.getByText('良好')).toBeVisible()
    
    // Check action buttons for completed reports
    await expect(page.getByRole('button', { name: '预览' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: '下载' }).first()).toBeVisible()
    
    // Check review buttons for reports under review
    await expect(page.getByRole('button', { name: '审核' })).toBeVisible()
    await expect(page.getByRole('button', { name: '通过' })).toBeVisible()
  })

  test('should manage report templates', async ({ page }) => {
    // Navigate to templates tab
    await page.getByRole('tab', { name: '模板管理' }).click()
    
    // Check template management interface
    await expect(page.getByText('报告模板管理')).toBeVisible()
    await expect(page.getByRole('button', { name: '创建新模板' })).toBeVisible()
    
    // Check template cards
    await expect(page.getByText('AI深度学术分析报告')).toBeVisible()
    await expect(page.getByText('智能教学质量报告')).toBeVisible()
    
    // Check template badges
    await expect(page.getByText('系统')).toBeVisible()
    
    // Check template actions
    await expect(page.getByRole('button', { name: '编辑' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: '复制' }).first()).toBeVisible()
    
    // Check template stats
    await expect(page.getByText('章节')).toBeVisible()
    await expect(page.getByText('次使用')).toBeVisible()
  })

  test('should display batch generation tasks', async ({ page }) => {
    // Navigate to batch tab
    await page.getByRole('tab', { name: '批量生成' }).click()
    
    // Check batch generation interface
    await expect(page.getByText('批量生成任务')).toBeVisible()
    await expect(page.getByRole('button', { name: '新建批量任务' })).toBeVisible()
    
    // Check sample batch task
    await expect(page.getByText('智能教学质量报告')).toBeVisible()
    await expect(page.getByText('运行中')).toBeVisible()
    
    // Check progress information
    await expect(page.getByText('计算机学院, 机械学院, 电气学院')).toBeVisible()
    await expect(page.getByText('2/3')).toBeVisible()
    
    // Check task actions
    await expect(page.getByRole('button', { name: '查看' })).toBeVisible()
    await expect(page.getByRole('button', { name: '暂停' })).toBeVisible()
  })

  test('should handle form validation', async ({ page }) => {
    // Select template
    await page.getByText('AI深度学术分析报告').click()
    
    // Try to generate without title
    const generateButton = page.getByRole('button', { name: '开始AI生成' })
    await expect(generateButton).toBeDisabled()
    
    // Fill title
    await page.getByPlaceholder('输入报告标题...').fill('测试标题')
    
    // Button should now be enabled
    await expect(generateButton).toBeEnabled()
  })

  test('should display AI tips and recent activity', async ({ page }) => {
    // Check AI tips alert
    await expect(page.getByText('AI生成提示')).toBeVisible()
    await expect(page.getByText('选择合适的LLM模型和模板')).toBeVisible()
    
    // Check recent activity section
    await expect(page.getByText('最近生成')).toBeVisible()
    await expect(page.getByText('查看全部历史')).toBeVisible()
    
    // Check quality indicators in recent activity
    await expect(page.locator('.text-green-600')).toBeVisible() // Excellent quality
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check main components are still visible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByRole('tablist')).toBeVisible()
    
    // Check template cards stack vertically
    const templateCards = page.locator('.border-gray-200')
    await expect(templateCards.first()).toBeVisible()
  })

  test('should handle navigation between tabs', async ({ page }) => {
    // Start on AI generation tab (default)
    await expect(page.getByRole('tabpanel')).toContainText('LLM模型选择')
    
    // Navigate to templates tab
    await page.getByRole('tab', { name: '模板管理' }).click()
    await expect(page.getByRole('tabpanel')).toContainText('报告模板管理')
    
    // Navigate to batch tab
    await page.getByRole('tab', { name: '批量生成' }).click()
    await expect(page.getByRole('tabpanel')).toContainText('批量生成任务')
    
    // Navigate to history tab
    await page.getByRole('tab', { name: '历史记录' }).click()
    await expect(page.getByRole('tabpanel')).toContainText('生成历史')
    
    // Navigate back to generation tab
    await page.getByRole('tab', { name: 'AI生成' }).click()
    await expect(page.getByRole('tabpanel')).toContainText('LLM模型选择')
  })

  test('should filter history reports by status', async ({ page }) => {
    // Navigate to history tab
    await page.getByRole('tab', { name: '历史记录' }).click()
    
    // Check filter dropdown
    const filterDropdown = page.getByRole('combobox')
    await expect(filterDropdown).toBeVisible()
    
    // Open filter dropdown
    await filterDropdown.click()
    
    // Check filter options
    await expect(page.getByText('全部状态')).toBeVisible()
    await expect(page.getByText('已完成')).toBeVisible()
    await expect(page.getByText('审核中')).toBeVisible()
    await expect(page.getByText('失败')).toBeVisible()
    
    // Select completed filter
    await page.getByRole('option', { name: '已完成' }).click()
  })

  test('should display LLM provider status correctly', async ({ page }) => {
    // Check active providers have "可用" badge
    const gptCard = page.locator('div').filter({ hasText: 'OpenAI GPT-4' }).first()
    await expect(gptCard.getByText('可用')).toBeVisible()
    
    const claudeCard = page.locator('div').filter({ hasText: 'Anthropic Claude 3' }).first()
    await expect(claudeCard.getByText('可用')).toBeVisible()
    
    // Check inactive provider has "维护中" badge and is disabled
    const geminiCard = page.locator('div').filter({ hasText: 'Google Gemini Pro' }).first()
    await expect(geminiCard.getByText('维护中')).toBeVisible()
    
    // Inactive provider should not be selectable
    await geminiCard.click()
    const activeProvider = page.locator('.border-blue-500').first()
    await expect(activeProvider).not.toContainText('Google Gemini Pro')
  })
})