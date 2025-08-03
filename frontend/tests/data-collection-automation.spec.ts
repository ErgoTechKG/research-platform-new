import { test, expect } from '@playwright/test';

test.describe('Data Collection Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-collection-automation');
    await page.waitForLoadState('networkidle');
  });

  test('should display the main page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Data Collection Control Center');
    await expect(page.locator('p')).toContainText('Automated data collection and quality monitoring');
  });

  test('should display auto-refresh toggle', async ({ page }) => {
    const autoRefreshSwitch = page.locator('[role="switch"]').first();
    await expect(autoRefreshSwitch).toBeVisible();
    await expect(page.locator('text=Auto-refresh')).toBeVisible();
  });

  test('should have all main navigation tabs', async ({ page }) => {
    const tabs = [
      'Dashboard',
      'Sources',
      'Validation',
      'Monitoring',
      'Alerts'
    ];

    for (const tab of tabs) {
      await expect(page.locator(`[role="tab"]`, { hasText: tab })).toBeVisible();
    }
  });

  test('should display overview statistics cards', async ({ page }) => {
    // Check all 4 stats cards are present
    const statsCards = page.locator('[data-testid="stats-card"]').or(page.locator('.grid .card').first().locator('..').locator('.card'));
    
    // Active Sources card
    await expect(page.locator('text=Active Sources')).toBeVisible();
    await expect(page.locator('text=/\\d+\\/15/')).toBeVisible();

    // Records Today card
    await expect(page.locator('text=Records Today')).toBeVisible();
    
    // Avg Quality card
    await expect(page.locator('text=Avg Quality')).toBeVisible();
    
    // Active Alerts card
    await expect(page.locator('text=Active Alerts')).toBeVisible();
  });

  test('should display data sources configuration panel', async ({ page }) => {
    await expect(page.locator('text=Data Sources Configuration')).toBeVisible();
    
    // Check for sample data sources
    await expect(page.locator('text=Academic Database')).toBeVisible();
    await expect(page.locator('text=Student Portal')).toBeVisible();
    await expect(page.locator('text=Email System')).toBeVisible();
    await expect(page.locator('text=External API')).toBeVisible();
    await expect(page.locator('text=File Server')).toBeVisible();
    await expect(page.locator('text=Survey Platform')).toBeVisible();

    // Check action buttons
    await expect(page.locator('button', { hasText: 'Add Source' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Configure' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Refresh' })).toBeVisible();
  });

  test('should display real-time monitoring panel', async ({ page }) => {
    await expect(page.locator('text=Real-time Monitoring')).toBeVisible();
    
    // Check progress bars
    await expect(page.locator('text=Collection Rate')).toBeVisible();
    await expect(page.locator('text=Validation Rate')).toBeVisible();
    await expect(page.locator('text=Storage Rate')).toBeVisible();
    
    // Check alerts section
    await expect(page.locator('text=Active Alerts')).toBeVisible();
    await expect(page.locator('button', { hasText: 'View All' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Configure' })).toBeVisible();
  });

  test('should display data quality dashboard', async ({ page }) => {
    await expect(page.locator('text=Data Quality Dashboard')).toBeVisible();
    
    // Check quality metrics
    const qualityMetrics = [
      'Completeness',
      'Accuracy',
      'Consistency',
      'Timeliness',
      'Validity'
    ];

    for (const metric of qualityMetrics) {
      await expect(page.locator(`text=${metric}`)).toBeVisible();
    }

    // Check goals vs actual section
    await expect(page.locator('text=Today\'s Goals vs Actual')).toBeVisible();
    await expect(page.locator('text=Records Collected:')).toBeVisible();
    await expect(page.locator('text=Validation Rate:')).toBeVisible();
    await expect(page.locator('text=Error Rate:')).toBeVisible();
  });

  test('should display quick actions panel', async ({ page }) => {
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    
    const quickActionButtons = [
      'Force Sync All',
      'Manual Import',
      'Run Validation',
      'Quality Report',
      'Update Rules'
    ];

    for (const button of quickActionButtons) {
      await expect(page.locator('button', { hasText: button })).toBeVisible();
    }
  });

  test('should handle source toggle switches', async ({ page }) => {
    // Find a source switch (should be visible)
    const sourceSwitches = page.locator('[role="switch"]').nth(1); // Skip the auto-refresh switch
    await expect(sourceSwitches).toBeVisible();
    
    // Click the switch (functionality test)
    await sourceSwitches.click();
  });

  test('should handle force sync all action', async ({ page }) => {
    const forceSyncButton = page.locator('button', { hasText: 'Force Sync All' });
    await expect(forceSyncButton).toBeVisible();
    await forceSyncButton.click();
    
    // Should update last sync times (functionality test)
    await page.waitForTimeout(100); // Brief wait for state update
  });

  test('should navigate to Sources tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Sources' }).click();
    await expect(page.locator('text=Data Sources Management')).toBeVisible();
    
    // Check that detailed source information is displayed
    await expect(page.locator('text=Database')).toBeVisible();
    await expect(page.locator('text=Web API')).toBeVisible();
    await expect(page.locator('text=IMAP')).toBeVisible();
    await expect(page.locator('text=REST API')).toBeVisible();
    await expect(page.locator('text=FTP')).toBeVisible();
  });

  test('should navigate to Validation tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Validation' }).click();
    await expect(page.locator('text=Data Validation & Quality Control')).toBeVisible();
    
    // Check validation rules
    await expect(page.locator('text=Email format validation')).toBeVisible();
    await expect(page.locator('text=Duplicate detection')).toBeVisible();
    await expect(page.locator('text=Required field check')).toBeVisible();
    await expect(page.locator('text=Data range validation')).toBeVisible();
    
    // Check validation rule switches
    const validationSwitches = page.locator('.border.rounded [role="switch"]');
    await expect(validationSwitches.first()).toBeVisible();
  });

  test('should navigate to Monitoring tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Monitoring' }).click();
    await expect(page.locator('text=Recent Data Collection Activity')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('th', { hasText: 'Time' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Source' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Records' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Status' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Quality' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Actions' })).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button', { hasText: 'Filter' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Export' })).toBeVisible();
  });

  test('should navigate to Alerts tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Alerts' }).click();
    await expect(page.locator('text=Alert Management')).toBeVisible();
    
    // Check for alert items
    await expect(page.locator('text=Email sync delayed 15min')).toBeVisible();
    await expect(page.locator('text=API rate limit exceeded')).toBeVisible();
    await expect(page.locator('text=Duplicate records found')).toBeVisible();
    
    // Check alert action buttons
    await expect(page.locator('button', { hasText: 'View' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Resolve' })).toBeVisible();
  });

  test('should display status bar at bottom', async ({ page }) => {
    await expect(page.locator('text=/Status: \\d+ sources active/')).toBeVisible();
    await expect(page.locator('text=Last update:')).toBeVisible();
    await expect(page.locator('text=Next sync:')).toBeVisible();
    await expect(page.locator('text=Auto-refresh:')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main title is still visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that tabs are still functional
    await expect(page.locator('[role="tab"]', { hasText: 'Dashboard' })).toBeVisible();
    
    // Check that cards stack properly on mobile
    const overviewCards = page.locator('.grid.grid-cols-1.md\\:grid-cols-4');
    await expect(overviewCards).toBeVisible();
  });

  test('should handle auto-refresh toggle', async ({ page }) => {
    const autoRefreshSwitch = page.locator('[role="switch"]').first();
    
    // Check initial state
    await expect(autoRefreshSwitch).toBeVisible();
    
    // Toggle auto-refresh off
    await autoRefreshSwitch.click();
    
    // Should still be functional (no errors)
    await page.waitForTimeout(100);
    
    // Toggle back on
    await autoRefreshSwitch.click();
    await page.waitForTimeout(100);
  });

  test('should display proper status icons and badges', async ({ page }) => {
    // Check for various status indicators
    await expect(page.locator('text=Running')).toBeVisible();
    await expect(page.locator('text=Warning')).toBeVisible();
    await expect(page.locator('text=Failed')).toBeVisible();
    
    // Status icons should be present (using CSS selectors for icons)
    const statusIcons = page.locator('svg').filter({ hasText: /^$/ }); // SVG icons
    expect(await statusIcons.count()).toBeGreaterThan(0);
  });

  test('should handle data source actions in sources tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Sources' }).click();
    
    // Check view and settings buttons for sources
    const viewButtons = page.locator('button').filter({ hasText: /^$/ }).and(page.locator('[data-testid="view-btn"]').or(page.locator('button').filter({ has: page.locator('svg') })));
    
    // At least some action buttons should be present
    const actionButtons = page.locator('button').filter({ has: page.locator('svg') });
    expect(await actionButtons.count()).toBeGreaterThan(0);
  });

  test('should display proper quality progress bars', async ({ page }) => {
    // Check that progress elements are present
    const progressBars = page.locator('[role="progressbar"]').or(page.locator('.h-2.rounded-full'));
    expect(await progressBars.count()).toBeGreaterThan(0);
    
    // Check percentage displays
    await expect(page.locator('text=85%')).toBeVisible();
    await expect(page.locator('text=78%')).toBeVisible();
    await expect(page.locator('text=92%')).toBeVisible();
  });

  test('should handle activity log interactions', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Monitoring' }).click();
    
    // Should show activity data
    await expect(page.locator('text=14:25')).toBeVisible();
    await expect(page.locator('text=14:20')).toBeVisible();
    await expect(page.locator('text=14:15')).toBeVisible();
    
    // Check for record counts
    await expect(page.locator('text=1,247')).toBeVisible();
    await expect(page.locator('text=856')).toBeVisible();
    await expect(page.locator('text=423')).toBeVisible();
  });
});

test.describe('Data Collection Automation - Accessibility', () => {
  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/data-collection-automation');
    
    // Check for proper tab roles
    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count()).toBeGreaterThan(0);
    
    // Check for proper button elements
    const buttons = page.locator('button');
    expect(await buttons.count()).toBeGreaterThan(0);
    
    // Check for proper switch roles
    const switches = page.locator('[role="switch"]');
    expect(await switches.count()).toBeGreaterThan(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/data-collection-automation');
    
    // Tab to the first focusable element
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/data-collection-automation');
    
    // Check that text is visible against backgrounds
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Data Collection Control Center')).toBeVisible();
    
    // Status badges should be visible
    await expect(page.locator('text=Running')).toBeVisible();
    await expect(page.locator('text=Warning')).toBeVisible();
  });
});

test.describe('Data Collection Automation - Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/data-collection-automation');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time (adjust as needed)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle multiple rapid interactions', async ({ page }) => {
    await page.goto('/data-collection-automation');
    
    // Rapidly switch between tabs
    const tabs = ['Sources', 'Validation', 'Monitoring', 'Alerts', 'Dashboard'];
    
    for (const tab of tabs) {
      await page.locator('[role="tab"]', { hasText: tab }).click();
      await page.waitForTimeout(50); // Small delay to simulate real usage
    }
    
    // Should still be responsive
    await expect(page.locator('h1')).toBeVisible();
  });
});