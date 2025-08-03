import { test, expect } from '@playwright/test';

test.describe('Professor Interview Scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/professor-interview-scheduler?role=professor');
  });

  test('should display the main interface correctly', async ({ page }) => {
    // Check page title and main elements
    await expect(page.locator('h1')).toContainText('实验室轮转面试排期系统');
    await expect(page.locator('text=智能化面试安排和管理工具')).toBeVisible();
    
    // Check control panel statistics
    await expect(page.locator('text=待安排')).toBeVisible();
    await expect(page.locator('text=已安排')).toBeVisible();
    await expect(page.locator('text=冲突数')).toBeVisible();
    await expect(page.locator('text=待发邀请')).toBeVisible();
  });

  test('should display control panel buttons and actions', async ({ page }) => {
    // Check main action buttons in control panel
    await expect(page.locator('button:has-text("智能排期")')).toBeVisible();
    await expect(page.locator('button:has-text("批量邀请")')).toBeVisible();
    await expect(page.locator('button:has-text("同步日历")')).toBeVisible();
    await expect(page.locator('button:has-text("冲突检测")')).toBeVisible();
    await expect(page.locator('button:has-text("统计分析")')).toBeVisible();

    // Test clicking buttons (should not throw errors)
    await page.locator('button:has-text("智能排期")').click();
    await page.locator('button:has-text("批量邀请")').click();
    await page.locator('button:has-text("同步日历")').click();
  });

  test('should display calendar view with navigation', async ({ page }) => {
    // Check calendar header
    await expect(page.locator('text=日历视图')).toBeVisible();
    
    // Check month navigation
    const monthDisplay = page.locator('text=2024年').first();
    await expect(monthDisplay).toBeVisible();
    
    // Check navigation buttons
    const prevButton = page.locator('button').filter({ hasText: '❮' }).first();
    const nextButton = page.locator('button').filter({ hasText: '❯' }).first();
    
    if (await prevButton.isVisible()) {
      await prevButton.click();
    }
    if (await nextButton.isVisible()) {
      await nextButton.click();
    }

    // Check day names
    await expect(page.locator('text=周一')).toBeVisible();
    await expect(page.locator('text=周二')).toBeVisible();
    await expect(page.locator('text=周三')).toBeVisible();
  });

  test('should display calendar legend and time slots', async ({ page }) => {
    // Check calendar legend
    await expect(page.locator('text=空闲时间')).toBeVisible();
    await expect(page.locator('text=已安排')).toBeVisible();
    await expect(page.locator('text=冲突时间')).toBeVisible();
    await expect(page.locator('text=建议时间')).toBeVisible();

    // Check for calendar days (should have numbers)
    const calendarGrid = page.locator('.grid.grid-cols-7').last();
    await expect(calendarGrid).toBeVisible();
  });

  test('should show interview details panel', async ({ page }) => {
    // Check interview details panel
    await expect(page.locator('text=面试安排面板')).toBeVisible();
    
    // Try clicking on a calendar day with interview to select it
    const calendarDay = page.locator('.grid.grid-cols-7 > div').filter({ hasText: '26' }).first();
    if (await calendarDay.isVisible()) {
      await calendarDay.click();
    }
    
    // Check if interview details are displayed or placeholder text
    const panelContent = page.locator('text=面试安排面板').locator('..').locator('..');
    await expect(panelContent).toBeVisible();
  });

  test('should display conflict detection panel', async ({ page }) => {
    // Check conflict detection panel title
    await expect(page.locator('text=冲突检测面板')).toBeVisible();
    
    // Check serious conflicts section
    await expect(page.locator('text=严重冲突 (需立即处理)')).toBeVisible();
    
    // Check potential conflicts section
    await expect(page.locator('text=潜在冲突 (建议调整)')).toBeVisible();
    
    // Check calendar sync status
    await expect(page.locator('text=外部日历同步状态')).toBeVisible();
    await expect(page.locator('text=Google Calendar')).toBeVisible();
    await expect(page.locator('text=Outlook')).toBeVisible();
    await expect(page.locator('text=企业微信')).toBeVisible();

    // Check sync buttons
    await expect(page.locator('button:has-text("立即同步")')).toBeVisible();
    await expect(page.locator('button:has-text("同步设置")')).toBeVisible();
  });

  test('should display batch operations panel', async ({ page }) => {
    // Check batch operations panel
    await expect(page.locator('text=批量操作面板')).toBeVisible();
    
    // Check selected applicants info
    await expect(page.locator('text=已选择: 6位申请者')).toBeVisible();
    
    // Check suggested time slots
    await expect(page.locator('text=建议时间段')).toBeVisible();
    await expect(page.locator('text=3月26日 上午')).toBeVisible();
    await expect(page.locator('text=3月27日 下午')).toBeVisible();
    
    // Check batch operation buttons
    await expect(page.locator('button:has-text("发送邀请")')).toBeVisible();
    await expect(page.locator('button:has-text("自动安排")')).toBeVisible();
    await expect(page.locator('button:has-text("统一时长")')).toBeVisible();
    await expect(page.locator('button:has-text("批量备注")')).toBeVisible();
    
    // Check email template section
    await expect(page.locator('text=邮件模板')).toBeVisible();
    await expect(page.locator('text=主题: 实验室轮转面试邀请')).toBeVisible();
    
    // Test template editing
    const templateTextarea = page.locator('textarea').first();
    await expect(templateTextarea).toBeVisible();
    
    await expect(page.locator('button:has-text("编辑模板")')).toBeVisible();
    await expect(page.locator('button:has-text("预览")')).toBeVisible();
  });

  test('should display interview records management', async ({ page }) => {
    // Check interview records panel
    await expect(page.locator('text=面试记录管理')).toBeVisible();
    
    // Check tabs
    await expect(page.locator('text=已完成面试')).toBeVisible();
    await expect(page.locator('text=今日面试安排')).toBeVisible();
    
    // Test tab switching
    const todayTab = page.locator('button:has-text("今日面试安排")');
    await todayTab.click();
    
    // Check today's interviews
    await expect(page.locator('text=09:00-10:00')).toBeVisible();
    await expect(page.locator('text=陈明')).toBeVisible();
    await expect(page.locator('text=已确认')).toBeVisible();
    
    // Switch back to completed interviews
    const completedTab = page.locator('button:has-text("已完成面试")');
    await completedTab.click();
    
    // Check completed interview details
    await expect(page.locator('text=李华')).toBeVisible();
    await expect(page.locator('text=评分: 85/100')).toBeVisible();
    await expect(page.locator('text=专业基础')).toBeVisible();
    await expect(page.locator('text=项目经验')).toBeVisible();
    await expect(page.locator('text=沟通表达')).toBeVisible();
    await expect(page.locator('text=学习意愿')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button:has-text("生成报告")')).toBeVisible();
    await expect(page.locator('button:has-text("导出数据")')).toBeVisible();
    await expect(page.locator('button:has-text("批量通知")')).toBeVisible();
    await expect(page.locator('button:has-text("面试设置")')).toBeVisible();
  });

  test('should display statistics and analytics panel', async ({ page }) => {
    // Check statistics panel
    await expect(page.locator('text=统计分析面板')).toBeVisible();
    
    // Check interview statistics
    await expect(page.locator('text=面试效果统计')).toBeVisible();
    await expect(page.locator('text=总面试数:')).toBeVisible();
    await expect(page.locator('text=42场')).toBeVisible();
    await expect(page.locator('text=已完成:')).toBeVisible();
    await expect(page.locator('text=待进行:')).toBeVisible();
    await expect(page.locator('text=平均用时:')).toBeVisible();
    await expect(page.locator('text=确认率:')).toBeVisible();
    await expect(page.locator('text=取消率:')).toBeVisible();
    await expect(page.locator('text=迟到率:')).toBeVisible();
    
    // Check time distribution analysis
    await expect(page.locator('text=时间分布分析')).toBeVisible();
    await expect(page.locator('text=上午 (9-12点):')).toBeVisible();
    await expect(page.locator('text=下午 (2-5点):')).toBeVisible();
    await expect(page.locator('text=晚上 (6-8点):')).toBeVisible();
    
    // Check completion rate trends
    await expect(page.locator('text=完成率趋势')).toBeVisible();
    await expect(page.locator('text=周一:')).toBeVisible();
    await expect(page.locator('text=周二:')).toBeVisible();
    await expect(page.locator('text=周三:')).toBeVisible();
    
    // Check optimization suggestions
    await expect(page.locator('text=优化建议')).toBeVisible();
    await expect(page.locator('text=增加下午时段')).toBeVisible();
    await expect(page.locator('text=优化邮件模板')).toBeVisible();
    await expect(page.locator('text=提前3天发送邀请')).toBeVisible();
    
    // Check report buttons
    await expect(page.locator('button:has-text("详细报告")')).toBeVisible();
    await expect(page.locator('button:has-text("数据导出")')).toBeVisible();
  });

  test('should handle interactive elements correctly', async ({ page }) => {
    // Test conflict resolution buttons
    const quickResolveBtn = page.locator('button:has-text("⚡ 快速解决")');
    if (await quickResolveBtn.isVisible()) {
      await quickResolveBtn.click();
    }
    
    const rescheduleBtn = page.locator('button:has-text("📅 重新安排")');
    if (await rescheduleBtn.isVisible()) {
      await rescheduleBtn.click();
    }
    
    // Test batch operation buttons
    const sendInviteBtn = page.locator('button:has-text("📧 发送邀请")');
    if (await sendInviteBtn.isVisible()) {
      await sendInviteBtn.click();
    }
    
    const autoScheduleBtn = page.locator('button:has-text("📅 自动安排")');
    if (await autoScheduleBtn.isVisible()) {
      await autoScheduleBtn.click();
    }
    
    // Test sync buttons
    const syncNowBtn = page.locator('button:has-text("立即同步")');
    if (await syncNowBtn.isVisible()) {
      await syncNowBtn.click();
    }
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('text=实验室轮转面试排期系统')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 600 });
    await expect(page.locator('text=实验室轮转面试排期系统')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('text=实验室轮转面试排期系统')).toBeVisible();
    
    // Check that main content is still accessible
    await expect(page.locator('text=日历视图')).toBeVisible();
    await expect(page.locator('text=面试安排面板')).toBeVisible();
  });

  test('should validate form inputs and interactions', async ({ page }) => {
    // Test email template editing
    const emailTemplateTextarea = page.locator('textarea');
    if (await emailTemplateTextarea.isVisible()) {
      await emailTemplateTextarea.fill('Test email template content');
      const value = await emailTemplateTextarea.inputValue();
      expect(value).toBe('Test email template content');
    }
    
    // Test that buttons are clickable and don't cause errors
    const actionButtons = [
      'button:has-text("编辑模板")',
      'button:has-text("预览")',
      'button:has-text("查看材料")',
      'button:has-text("联系")'
    ];
    
    for (const buttonSelector of actionButtons) {
      const button = page.locator(buttonSelector).first();
      if (await button.isVisible()) {
        await button.click();
        // Wait a bit to ensure no errors occur
        await page.waitForTimeout(100);
      }
    }
  });

  test('should show proper role-based access for professor', async ({ page }) => {
    // Professor should see all management functions
    await expect(page.locator('button:has-text("智能排期")')).toBeVisible();
    await expect(page.locator('button:has-text("批量邀请")')).toBeVisible();
    await expect(page.locator('button:has-text("同步日历")')).toBeVisible();
    await expect(page.locator('button:has-text("冲突检测")')).toBeVisible();
    
    // Professor should see interview evaluation features
    await expect(page.locator('text=面试记录管理')).toBeVisible();
    await expect(page.locator('text=统计分析面板')).toBeVisible();
    
    // Professor should see conflict resolution options
    await expect(page.locator('text=严重冲突 (需立即处理)')).toBeVisible();
    await expect(page.locator('text=潜在冲突 (建议调整)')).toBeVisible();
  });
});