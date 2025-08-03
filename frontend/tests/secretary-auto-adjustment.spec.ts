import { test, expect } from '@playwright/test';

test.describe('Secretary Auto-Adjustment System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/secretary-auto-adjustment?role=secretary');
  });

  test('should display the auto-adjustment console with all main components', async ({ page }) => {
    // Check header
    await expect(page.locator('h1')).toContainText('Laboratory Rotation Auto-adjustment Console');
    
    // Check status badges
    await expect(page.getByText('Auto-adjustment: ON')).toBeVisible();
    await expect(page.getByText('Last Run: 2 minutes ago')).toBeVisible();
    await expect(page.getByText('Next Scheduled: 15:30')).toBeVisible();

    // Check tabs
    await expect(page.getByRole('tab', { name: 'Rules' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Adjustments' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Results' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'History' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Notifications' })).toBeVisible();
  });

  test('should display and manage adjustment rules', async ({ page }) => {
    // Should be on rules tab by default
    await expect(page.getByText('Adjustment Rules Configuration')).toBeVisible();
    
    // Check rule items
    await expect(page.getByText('Capacity Balancing')).toBeVisible();
    await expect(page.getByText('Preference Optimization')).toBeVisible();
    await expect(page.getByText('Equipment Availability')).toBeVisible();
    await expect(page.getByText('Faculty Workload Balancing')).toBeVisible();
    await expect(page.getByText('Time Slot Optimization')).toBeVisible();

    // Check rule status indicators
    await expect(page.locator('[data-testid="rule-status-active"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="rule-status-warning"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="rule-status-disabled"]').first()).toBeVisible();

    // Test toggle rule
    const firstRuleSwitch = page.locator('button[role="switch"]').first();
    const isChecked = await firstRuleSwitch.getAttribute('aria-checked');
    await firstRuleSwitch.click();
    await expect(firstRuleSwitch).toHaveAttribute('aria-checked', isChecked === 'true' ? 'false' : 'true');

    // Check manual override controls
    await expect(page.getByText('Manual Override Controls')).toBeVisible();
    await expect(page.getByText('Emergency Adjustments')).toBeVisible();
    await expect(page.getByText('Algorithm Parameters')).toBeVisible();
  });

  test('should display real-time adjustment status', async ({ page }) => {
    await page.getByRole('tab', { name: 'Adjustments' }).click();
    
    // Check adjustment status
    await expect(page.getByText('Real-time Adjustment Status')).toBeVisible();
    await expect(page.getByText('Running')).toBeVisible();
    await expect(page.getByText('67%')).toBeVisible();
    await expect(page.getByText('Started: 14:23')).toBeVisible();
    await expect(page.getByText('ETA: 8 minutes')).toBeVisible();

    // Check statistics
    await expect(page.getByText('Students Affected: 42')).toBeVisible();
    await expect(page.getByText('Labs Modified: 6')).toBeVisible();
    await expect(page.getByText('Conflicts Resolved: 8')).toBeVisible();
    await expect(page.getByText('New Conflicts: 2')).toBeVisible();

    // Check quality metrics
    await expect(page.getByText('Overall Satisfaction: 89%')).toBeVisible();
    await expect(page.getByText('Efficiency Gain: +12%')).toBeVisible();
    await expect(page.getByText('Fairness Score: 91%')).toBeVisible();

    // Check adjustment visualization
    await expect(page.getByText('Adjustment Visualization')).toBeVisible();
    await expect(page.getByText('Before → After Changes')).toBeVisible();
    await expect(page.getByText('Lab A: 12→15 (+3)')).toBeVisible();
    await expect(page.getByText('Lab B: 23→20 (-3)')).toBeVisible();

    // Test process control buttons
    await expect(page.getByRole('button', { name: 'Force Complete' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Force Complete' })).toBeEnabled();
  });

  test('should display adjustment results and analytics', async ({ page }) => {
    await page.getByRole('tab', { name: 'Results' }).click();
    
    // Check key metrics
    await expect(page.getByText('94.3%')).toBeVisible();
    await expect(page.getByText('Average Success Rate')).toBeVisible();
    await expect(page.getByText('8.2')).toBeVisible();
    await expect(page.getByText('Avg Duration (min)')).toBeVisible();

    // Check insights
    await expect(page.getByText('Key Insights')).toBeVisible();
    await expect(page.getByText('Average success rate: 94.3%')).toBeVisible();
    await expect(page.getByText('Peak efficiency during manual overrides')).toBeVisible();
    await expect(page.getByText('Equipment issues cause most adjustment delays')).toBeVisible();

    // Check action buttons
    await expect(page.getByRole('button', { name: 'Detailed Report' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export Data' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule Analysis' })).toBeVisible();
  });

  test('should display adjustment history', async ({ page }) => {
    await page.getByRole('tab', { name: 'History' }).click();
    
    // Check history table
    await expect(page.getByText('Adjustment History & Analytics')).toBeVisible();
    await expect(page.getByText('Recent Adjustments (Last 7 Days)')).toBeVisible();
    
    // Check table headers
    await expect(page.getByText('Date/Time')).toBeVisible();
    await expect(page.getByText('Trigger')).toBeVisible();
    await expect(page.getByText('Changes')).toBeVisible();
    await expect(page.getByText('Success')).toBeVisible();
    await expect(page.getByText('Duration')).toBeVisible();
    await expect(page.getByText('Actions')).toBeVisible();

    // Check history entries
    await expect(page.getByText('08/02 14:23')).toBeVisible();
    await expect(page.getByText('Capacity Alert')).toBeVisible();
    await expect(page.getByText('Manual Override')).toBeVisible();
    await expect(page.getByText('Preference Opt')).toBeVisible();
    await expect(page.getByText('Equipment Issue')).toBeVisible();

    // Check success badges
    await expect(page.locator('text=95%').first()).toBeVisible();
    await expect(page.locator('text=100%').first()).toBeVisible();
  });

  test('should display notification center', async ({ page }) => {
    await page.getByRole('tab', { name: 'Notifications' }).click();
    
    // Check notification center
    await expect(page.getByText('Notification Center')).toBeVisible();
    await expect(page.getByText('Pending Notifications')).toBeVisible();

    // Check notification categories
    await expect(page.getByText('Students (18)')).toBeVisible();
    await expect(page.getByText('Faculty (4)')).toBeVisible();
    await expect(page.getByText('Labs (2)')).toBeVisible();

    // Check notification details
    await expect(page.getByText('Schedule changes: 15')).toBeVisible();
    await expect(page.getByText('Lab assignments: 3')).toBeVisible();
    await expect(page.getByText('Capacity changes: 2')).toBeVisible();
    await expect(page.getByText('Equipment updates: 2')).toBeVisible();

    // Check action buttons
    await expect(page.getByRole('button', { name: 'Send All' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule Batch' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Preview' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Configure Rules' })).toBeVisible();
  });

  test('should handle manual override controls', async ({ page }) => {
    // Check emergency controls
    await expect(page.getByText('Emergency Adjustments')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Execute' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Schedule' })).toBeVisible();

    // Check notification controls
    await expect(page.getByText('Notify All Stakeholders')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Students' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Faculty' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Labs' })).toBeVisible();

    // Test lock controls
    await expect(page.getByText('Lock Current Assignments')).toBeVisible();
    const lockButton = page.getByRole('button', { name: 'Apply Lock' });
    await expect(lockButton).toBeVisible();
    await lockButton.click();
    await expect(page.getByRole('button', { name: 'Remove Lock' })).toBeVisible();

    // Check algorithm parameters
    await expect(page.getByText('Algorithm Parameters')).toBeVisible();
    await expect(page.getByText('Optimization level:')).toBeVisible();
    await expect(page.getByText('Max iterations:')).toBeVisible();
    await expect(page.getByText('Convergence:')).toBeVisible();
  });

  test('should handle algorithm parameter updates', async ({ page }) => {
    // Test optimization level dropdown
    const optimizationSelect = page.getByRole('combobox').filter({ hasText: 'High' });
    await optimizationSelect.click();
    await page.getByRole('option', { name: 'Medium' }).click();
    await expect(optimizationSelect).toContainText('Medium');

    // Test max iterations input
    const iterationsInput = page.getByRole('spinbutton').nth(0);
    await iterationsInput.fill('2000');
    await expect(iterationsInput).toHaveValue('2000');

    // Test convergence input
    const convergenceInput = page.getByRole('spinbutton').nth(1);
    await convergenceInput.fill('0.005');
    await expect(convergenceInput).toHaveValue('0.005');

    // Test update button
    await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reset to Default' })).toBeVisible();
  });

  test('should handle process control actions', async ({ page }) => {
    await page.getByRole('tab', { name: 'Adjustments' }).click();
    
    // Test pause action
    const pauseButton = page.getByRole('button').filter({ hasText: /pause/i });
    await pauseButton.click();
    
    // Test stop action
    const stopButton = page.getByRole('button').filter({ hasText: /square/i });
    await stopButton.click();
    
    // Test force complete action
    const forceCompleteButton = page.getByRole('button', { name: 'Force Complete' });
    await forceCompleteButton.click();
  });

  test('should display status footer information', async ({ page }) => {
    // Check footer status
    const footer = page.locator('.bg-white.rounded-lg.shadow-sm.border.p-4').last();
    await expect(footer.getByText('Auto-adjustment: ON')).toBeVisible();
    await expect(footer.getByText('Last Run: 2 minutes ago')).toBeVisible();
    await expect(footer.getByText('Next Scheduled: 15:30')).toBeVisible();
    await expect(footer.getByText('Notifications: 24 pending')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('tablist')).toBeVisible();
    await expect(page.getByText('Adjustment Rules Configuration')).toBeVisible();
    
    // Check that cards stack vertically
    const cards = page.locator('.grid.grid-cols-1.lg\\:grid-cols-2');
    await expect(cards).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test enter key on focused elements
    await page.keyboard.press('Enter');
    
    // Check that focus is managed properly
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should maintain state across tab switches', async ({ page }) => {
    // Toggle a rule in Rules tab
    const firstRuleSwitch = page.locator('button[role="switch"]').first();
    const initialState = await firstRuleSwitch.getAttribute('aria-checked');
    await firstRuleSwitch.click();
    
    // Switch to another tab and back
    await page.getByRole('tab', { name: 'History' }).click();
    await page.getByRole('tab', { name: 'Rules' }).click();
    
    // Check that the state is maintained
    const newState = await firstRuleSwitch.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });
});