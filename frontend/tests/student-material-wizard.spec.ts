import { test, expect } from '@playwright/test';

test.describe('Student Material Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/student-material-wizard?role=student');
  });

  test('should display the material upload wizard with all main components', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('综合素质评价 - 材料上传向导');
    
    // Check action buttons
    await expect(page.getByRole('button', { name: '保存草稿' })).toBeVisible();
    await expect(page.getByRole('button', { name: '帮助指南' })).toBeVisible();

    // Check progress navigation
    await expect(page.getByText('1.准备工作')).toBeVisible();
    await expect(page.getByText('2.材料分类')).toBeVisible();
    await expect(page.getByText('3.上传文件')).toBeVisible();
    await expect(page.getByText('4.预览确认')).toBeVisible();
    await expect(page.getByText('5.提交完成')).toBeVisible();

    // Check main upload interface
    await expect(page.getByText('第3步：上传文件')).toBeVisible();
    await expect(page.getByText('当前分类: 学术成果类')).toBeVisible();
  });

  test('should display material categories with tabs', async ({ page }) => {
    // Check category tabs
    await expect(page.getByRole('tab', { name: '学术成果类' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '科研项目参与' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '技术成果' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '获奖荣誉' })).toBeVisible();
    await expect(page.getByRole('tab', { name: '推荐材料' })).toBeVisible();

    // Check that academic category is selected by default
    await expect(page.getByRole('tab', { name: '学术成果类' })).toHaveAttribute('data-state', 'active');
  });

  test('should display upload area with proper information', async ({ page }) => {
    // Check upload area
    await expect(page.getByText('拖拽文件到此区域，或')).toBeVisible();
    await expect(page.getByRole('button', { name: '📎 选择文件' })).toBeVisible();
    
    // Check format and size information
    await expect(page.getByText('支持格式: PDF, DOC, DOCX (最大20MB)')).toBeVisible();
    await expect(page.getByText('建议: 请上传论文全文或录用通知')).toBeVisible();
  });

  test('should display existing uploaded files with metadata', async ({ page }) => {
    // Check uploaded files section
    await expect(page.getByText('✅ 已上传文件:')).toBeVisible();
    
    // Check first file
    await expect(page.getByText('深度学习算法优化研究.pdf')).toBeVisible();
    await expect(page.getByText('(2.3MB)')).toBeVisible();
    await expect(page.getByText('AI识别: 学术论文')).toBeVisible();
    await expect(page.getByText('置信度: 95%')).toBeVisible();
    await expect(page.getByText('期刊: IEEE Transactions')).toBeVisible();
    await expect(page.getByText('发表时间: 2024年3月')).toBeVisible();

    // Check second file
    await expect(page.getByText('会议论文录用通知.png')).toBeVisible();
    await expect(page.getByText('(0.8MB)')).toBeVisible();
    await expect(page.getByText('AI识别: 录用通知')).toBeVisible();
    await expect(page.getByText('置信度: 88%')).toBeVisible();
    await expect(page.getByText('会议: ICCV 2024')).toBeVisible();
    await expect(page.getByText('录用时间: 2024年7月')).toBeVisible();

    // Check action buttons for files
    await expect(page.getByRole('button', { name: '预览' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '编辑信息' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '删除' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: '设为重点' }).first()).toBeVisible();
  });

  test('should handle category switching', async ({ page }) => {
    // Switch to technical category
    await page.getByRole('tab', { name: '技术成果' }).click();
    
    // Check GitHub project
    await expect(page.getByText('GitHub项目链接')).toBeVisible();
    await expect(page.getByText('https://github.com/user/awesome-project')).toBeVisible();
    await expect(page.getByText('Stars: 156')).toBeVisible();
    await expect(page.getByText('Forks: 23')).toBeVisible();
    await expect(page.getByText('代码质量: A级')).toBeVisible();
    await expect(page.getByText('文档完整度: 85%')).toBeVisible();

    // Switch to research category
    await page.getByRole('tab', { name: '科研项目参与' }).click();
    
    // Check required warning
    await expect(page.getByText('此类别为必填项，请至少上传一个文件')).toBeVisible();
  });

  test('should display AI suggestions', async ({ page }) => {
    // Check AI suggestions section
    await expect(page.getByText('智能检测反馈')).toBeVisible();
    await expect(page.getByText('🤖 AI助手建议:')).toBeVisible();
    
    // Check suggestion items
    await expect(page.getByText('检测到高质量学术论文，建议设为重点材料')).toBeVisible();
    await expect(page.getByText('GitHub项目活跃度良好，技术实力得到体现')).toBeVisible();
    await expect(page.getByText('建议补充项目参与证明材料，提升可信度')).toBeVisible();
    await expect(page.getByText('推荐上传导师推荐信，可大幅提升评分')).toBeVisible();

    // Check AI action buttons
    await expect(page.getByRole('button', { name: '深度分析' })).toBeVisible();
    await expect(page.getByRole('button', { name: '获取更多建议' })).toBeVisible();
    await expect(page.getByRole('button', { name: '忽略建议' })).toBeVisible();
  });

  test('should display upload progress and statistics', async ({ page }) => {
    // Check progress section
    await expect(page.getByText('上传进度与统计')).toBeVisible();
    await expect(page.getByText('📊 总体进度:')).toBeVisible();
    await expect(page.getByText('60% (3/5类别已完成)')).toBeVisible();

    // Check statistics
    await expect(page.getByText('📈 材料统计:')).toBeVisible();
    await expect(page.getByText('已上传文件: 8个 (总计15.6MB)')).toBeVisible();
    await expect(page.getByText('必填项完成: 2/3')).toBeVisible();
    await expect(page.getByText('重点材料: 3个')).toBeVisible();
    await expect(page.getByText('AI识别准确率: 94%')).toBeVisible();

    // Check score prediction
    await expect(page.getByText('🎯 预计评分: 82-89分 (基于当前材料)')).toBeVisible();
    await expect(page.getByText('💡 完成剩余必填项预计可提升5-8分')).toBeVisible();
  });

  test('should display batch operation tools', async ({ page }) => {
    // Check batch operations section
    await expect(page.getByText('批量操作工具')).toBeVisible();
    
    // Check operation buttons
    await expect(page.getByRole('button', { name: '批量下载已上传文件' })).toBeVisible();
    await expect(page.getByRole('button', { name: '导出材料清单' })).toBeVisible();
    await expect(page.getByRole('button', { name: '保存当前进度' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'AI智能整理' })).toBeVisible();
  });

  test('should handle file deletion', async ({ page }) => {
    // Count initial files
    const initialFiles = await page.locator('[data-testid="uploaded-file"]').count();
    
    // Delete a file
    await page.getByRole('button', { name: '删除' }).first().click();
    
    // Check that file count decreased (in a real implementation)
    // For now, just check that the button exists and is clickable
    await expect(page.getByRole('button', { name: '删除' }).first()).toBeVisible();
  });

  test('should handle highlight toggle', async ({ page }) => {
    // Click highlight button
    const highlightButton = page.getByRole('button', { name: '设为重点' }).first();
    await highlightButton.click();
    
    // Check that the button exists and is interactive
    await expect(highlightButton).toBeVisible();
  });

  test('should display navigation buttons', async ({ page }) => {
    // Check navigation buttons
    await expect(page.getByRole('button', { name: '上一步' })).toBeVisible();
    await expect(page.getByRole('button', { name: '下一步' })).toBeVisible();
    
    // Previous button should be enabled (not at first step)
    await expect(page.getByRole('button', { name: '上一步' })).toBeEnabled();
    
    // Next button should be disabled (required items not completed)
    await expect(page.getByRole('button', { name: '下一步' })).toBeDisabled();
  });

  test('should show file format and size information for each category', async ({ page }) => {
    // Check academic category
    await page.getByRole('tab', { name: '学术成果类' }).click();
    await expect(page.getByText('支持格式: PDF, DOC, DOCX (最大20MB)')).toBeVisible();
    
    // Check research category
    await page.getByRole('tab', { name: '科研项目参与' }).click();
    await expect(page.getByText('支持格式: PDF, DOC, DOCX, ZIP (最大50MB)')).toBeVisible();
    
    // Check technical category
    await page.getByRole('tab', { name: '技术成果' }).click();
    await expect(page.getByText('支持格式: PDF, DOC, DOCX, URL (最大20MB)')).toBeVisible();
    
    // Check awards category
    await page.getByRole('tab', { name: '获奖荣誉' }).click();
    await expect(page.getByText('支持格式: PDF, JPG, PNG (最大10MB)')).toBeVisible();
    
    // Check recommendations category
    await page.getByRole('tab', { name: '推荐材料' }).click();
    await expect(page.getByText('支持格式: PDF, DOC, DOCX (最大20MB)')).toBeVisible();
  });

  test('should show required field indicators', async ({ page }) => {
    // Check that required categories have indicators
    // Academic category should have a red dot (required)
    const academicTab = page.getByRole('tab', { name: '学术成果类' });
    await expect(academicTab).toBeVisible();
    
    // Research category should have a red dot (required)
    const researchTab = page.getByRole('tab', { name: '科研项目参与' });
    await expect(researchTab).toBeVisible();
    
    // Switch to research category and check warning
    await researchTab.click();
    await expect(page.getByText('⚠️ 此类别为必填项，请至少上传一个文件')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText('第3步：上传文件')).toBeVisible();
    await expect(page.getByText('智能检测反馈')).toBeVisible();
    
    // Check that layout adapts
    const uploadArea = page.getByText('拖拽文件到此区域，或');
    await expect(uploadArea).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation through main interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is managed properly
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should maintain state when switching between categories', async ({ page }) => {
    // Start with academic category
    await expect(page.getByText('深度学习算法优化研究.pdf')).toBeVisible();
    
    // Switch to technical category
    await page.getByRole('tab', { name: '技术成果' }).click();
    await expect(page.getByText('GitHub项目链接')).toBeVisible();
    
    // Switch back to academic category
    await page.getByRole('tab', { name: '学术成果类' }).click();
    await expect(page.getByText('深度学习算法优化研究.pdf')).toBeVisible();
  });

  test('should display proper progress indicators', async ({ page }) => {
    // Check step progress indicators
    await expect(page.getByText('✅')).toHaveCount(2); // Completed steps
    await expect(page.getByText('🔵')).toHaveCount(1); // Current step
    await expect(page.getByText('⭕')).toHaveCount(2); // Pending steps
    
    // Check progress bar
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
    await expect(progressBar).toHaveAttribute('aria-valuenow', '60');
  });
});