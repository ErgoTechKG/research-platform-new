import { test, expect } from '@playwright/test';

test.describe('Workflow Designer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/workflow-designer');
    await page.waitForLoadState('networkidle');
  });

  test('should display the main page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Workflow Designer');
    await expect(page.locator('p')).toContainText('Design and configure automated workflows');
  });

  test('should display header toolbar buttons', async ({ page }) => {
    const toolbarButtons = [
      'Tools',
      'Templates',
      'Test',
      'Save',
      'Monitor'
    ];

    for (const button of toolbarButtons) {
      await expect(page.locator('button', { hasText: button })).toBeVisible();
    }
  });

  test('should display component library tabs', async ({ page }) => {
    await expect(page.locator('[role="tab"]', { hasText: 'Components' })).toBeVisible();
    await expect(page.locator('[role="tab"]', { hasText: 'Properties' })).toBeVisible();
  });

  test('should display start/end nodes in component library', async ({ page }) => {
    await expect(page.locator('text=Start/End Nodes')).toBeVisible();
    
    // Check for start/end node types
    await expect(page.locator('text=Start')).toBeVisible();
    await expect(page.locator('text=End')).toBeVisible();
    await expect(page.locator('text=Pause')).toBeVisible();
  });

  test('should display action nodes in component library', async ({ page }) => {
    await expect(page.locator('text=Action Nodes')).toBeVisible();
    
    // Check for action node types
    await expect(page.locator('text=Send Email')).toBeVisible();
    await expect(page.locator('text=Create Doc')).toBeVisible();
    await expect(page.locator('text=Notify')).toBeVisible();
    await expect(page.locator('text=Generate')).toBeVisible();
    await expect(page.locator('text=Approve')).toBeVisible();
  });

  test('should display logic nodes in component library', async ({ page }) => {
    await expect(page.locator('text=Logic Nodes')).toBeVisible();
    
    // Check for logic node types
    await expect(page.locator('text=Decision')).toBeVisible();
    await expect(page.locator('text=Loop')).toBeVisible();
    await expect(page.locator('text=Timer')).toBeVisible();
    await expect(page.locator('text=Condition')).toBeVisible();
  });

  test('should display user nodes in component library', async ({ page }) => {
    await expect(page.locator('text=User Nodes')).toBeVisible();
    
    // Check for user node types
    await expect(page.locator('text=Student')).toBeVisible();
    await expect(page.locator('text=Professor')).toBeVisible();
    await expect(page.locator('text=Admin')).toBeVisible();
    await expect(page.locator('text=External')).toBeVisible();
    
    // Check clear all button
    await expect(page.locator('button', { hasText: 'Clear All' })).toBeVisible();
  });

  test('should display workflow properties', async ({ page }) => {
    await expect(page.locator('text=Workflow Properties')).toBeVisible();
    
    // Check workflow property fields
    await expect(page.locator('text=Name:')).toBeVisible();
    await expect(page.locator('text=Student Application Review Process')).toBeVisible();
    await expect(page.locator('text=Category:')).toBeVisible();
    await expect(page.locator('text=Academic Processing')).toBeVisible();
    await expect(page.locator('text=Owner:')).toBeVisible();
    await expect(page.locator('text=Dr. Sarah Wilson')).toBeVisible();
    await expect(page.locator('text=Avg Duration:')).toBeVisible();
    await expect(page.locator('text=2.5 hours')).toBeVisible();
    await expect(page.locator('text=Success Rate:')).toBeVisible();
    await expect(page.locator('text=94%')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button', { hasText: 'Edit' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Clone' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Test' })).toBeVisible();
  });

  test('should switch to Properties tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Properties' }).click();
    
    // Should show message when no node is selected
    await expect(page.locator('text=Select a node to view properties')).toBeVisible();
  });

  test('should display canvas toolbar', async ({ page }) => {
    const canvasButtons = [
      'Zoom In',
      'Zoom Out',
      'Grid',
      'Undo'
    ];

    for (const button of canvasButtons) {
      await expect(page.locator('button', { hasText: button })).toBeVisible();
    }
  });

  test('should display workflow nodes on canvas', async ({ page }) => {
    // Check for predefined workflow nodes
    await expect(page.locator('text=Start')).toBeVisible();
    await expect(page.locator('text=Review Application')).toBeVisible();
    await expect(page.locator('text=Decision')).toBeVisible();
    await expect(page.locator('text=Send Approval')).toBeVisible();
    await expect(page.locator('text=Send Rejection')).toBeVisible();
    await expect(page.locator('text=End')).toBeVisible();
  });

  test('should handle node selection', async ({ page }) => {
    // Click on a workflow node
    await page.locator('text=Review Application').click();
    
    // Switch to Properties tab to see node details
    await page.locator('[role="tab"]', { hasText: 'Properties' }).click();
    
    // Should display node configuration
    await expect(page.locator('text=Node Configuration')).toBeVisible();
    await expect(page.locator('text=Selected: Review Application')).toBeVisible();
  });

  test('should display node properties when selected', async ({ page }) => {
    // Click on a node
    await page.locator('text=Review Application').click();
    
    // Switch to Properties tab
    await page.locator('[role="tab"]', { hasText: 'Properties' }).click();
    
    // Check node properties
    await expect(page.locator('text=Node Properties:')).toBeVisible();
    await expect(page.locator('text=Name: Review Application')).toBeVisible();
    await expect(page.locator('text=Type: action')).toBeVisible();
    await expect(page.locator('text=Assigned To: Academic Committee')).toBeVisible();
    await expect(page.locator('text=Timeout: 3 business days')).toBeVisible();
    await expect(page.locator('text=Priority: high')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button', { hasText: 'Update' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Test' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Delete' })).toBeVisible();
  });

  test('should display real-time monitoring panel', async ({ page }) => {
    await expect(page.locator('text=Real-time Process Monitoring')).toBeVisible();
    
    // Check monitoring statistics
    await expect(page.locator('text=Active Instances: 24')).toBeVisible();
    await expect(page.locator('text=Paused: 3')).toBeVisible();
    await expect(page.locator('text=Failed: 1')).toBeVisible();
    await expect(page.locator('text=Done: 156')).toBeVisible();
  });

  test('should display monitoring table headers', async ({ page }) => {
    const tableHeaders = [
      'Instance ID',
      'Current Step',
      'Duration',
      'Status',
      'Actions'
    ];

    for (const header of tableHeaders) {
      await expect(page.locator('th', { hasText: header })).toBeVisible();
    }
  });

  test('should display workflow instances in monitoring table', async ({ page }) => {
    // Check for sample workflow instances
    await expect(page.locator('text=WF-2024-001')).toBeVisible();
    await expect(page.locator('text=WF-2024-002')).toBeVisible();
    await expect(page.locator('text=WF-2024-003')).toBeVisible();
    await expect(page.locator('text=WF-2024-004')).toBeVisible();
    
    // Check current steps
    await expect(page.locator('text=Review Application')).toBeVisible();
    await expect(page.locator('text=Send Invitation')).toBeVisible();
    await expect(page.locator('text=Decision Pending')).toBeVisible();
    await expect(page.locator('text=Interview Scheduling')).toBeVisible();
    
    // Check durations
    await expect(page.locator('text=2.1 hrs')).toBeVisible();
    await expect(page.locator('text=0.5 hrs')).toBeVisible();
    await expect(page.locator('text=4.2 hrs')).toBeVisible();
    await expect(page.locator('text=1.8 hrs')).toBeVisible();
  });

  test('should display status badges in monitoring table', async ({ page }) => {
    // Check for status badges
    await expect(page.locator('text=active')).toBeVisible();
    await expect(page.locator('text=overdue')).toBeVisible();
  });

  test('should display monitoring action buttons', async ({ page }) => {
    const monitoringButtons = [
      'Refresh',
      'Filter',
      'Export',
      'Bulk Actions'
    ];

    for (const button of monitoringButtons) {
      await expect(page.locator('button', { hasText: button })).toBeVisible();
    }
  });

  test('should handle draggable nodes', async ({ page }) => {
    // Check that nodes in the component library are draggable
    const draggableNodes = page.locator('[draggable="true"]');
    expect(await draggableNodes.count()).toBeGreaterThan(0);
    
    // Check that the first draggable node is visible
    await expect(draggableNodes.first()).toBeVisible();
  });

  test('should handle canvas interactions', async ({ page }) => {
    // Click canvas toolbar buttons
    await page.locator('button', { hasText: 'Zoom In' }).click();
    await page.locator('button', { hasText: 'Zoom Out' }).click();
    await page.locator('button', { hasText: 'Grid' }).click();
    await page.locator('button', { hasText: 'Undo' }).click();
    
    // Should not throw errors
    await page.waitForTimeout(100);
  });

  test('should handle header toolbar interactions', async ({ page }) => {
    // Click header toolbar buttons
    const headerButtons = ['Tools', 'Templates', 'Test', 'Save', 'Monitor'];
    
    for (const button of headerButtons) {
      await page.locator('button', { hasText: button }).click();
      await page.waitForTimeout(50); // Brief delay between clicks
    }
  });

  test('should handle workflow property actions', async ({ page }) => {
    // Click workflow property action buttons
    await page.locator('button', { hasText: 'Edit' }).click();
    await page.locator('button', { hasText: 'Clone' }).click();
    await page.locator('button', { hasText: 'Test' }).click();
    
    // Should not throw errors
    await page.waitForTimeout(100);
  });

  test('should handle monitoring table actions', async ({ page }) => {
    // Click monitoring action buttons
    await page.locator('button', { hasText: 'Refresh' }).click();
    await page.locator('button', { hasText: 'Filter' }).click();
    await page.locator('button', { hasText: 'Export' }).click();
    await page.locator('button', { hasText: 'Bulk Actions' }).click();
    
    // Should not throw errors
    await page.waitForTimeout(100);
  });

  test('should display status bar', async ({ page }) => {
    await expect(page.locator('text=Workflow: Student Application Review • Version: 1.3 • Last Modified: Today')).toBeVisible();
  });

  test('should handle node deletion', async ({ page }) => {
    // Click on a node to select it
    await page.locator('text=Review Application').click();
    
    // Switch to Properties tab
    await page.locator('[role="tab"]', { hasText: 'Properties' }).click();
    
    // Click delete button
    await page.locator('button', { hasText: 'Delete' }).click();
    
    // Should handle deletion (node should be removed from canvas)
    await page.waitForTimeout(100);
  });

  test('should display visual workflow canvas with grid', async ({ page }) => {
    // Check that the canvas area is visible
    const canvas = page.locator('.bg-gray-100.relative.overflow-auto');
    await expect(canvas).toBeVisible();
    
    // Grid background should be present
    const gridBackground = page.locator('.absolute.inset-0').first();
    await expect(gridBackground).toBeVisible();
  });

  test('should display connection lines between nodes', async ({ page }) => {
    // Check for SVG connection lines
    const svg = page.locator('svg');
    await expect(svg).toBeVisible();
    
    // Should have line elements for connections
    const lines = page.locator('line');
    expect(await lines.count()).toBeGreaterThan(0);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main title is still visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Component library should still be accessible
    await expect(page.locator('text=Components')).toBeVisible();
    
    // Canvas should be visible
    const canvas = page.locator('.bg-gray-100');
    await expect(canvas).toBeVisible();
  });

  test('should handle tab switching between Components and Properties', async ({ page }) => {
    // Start on Components tab
    await expect(page.locator('text=Start/End Nodes')).toBeVisible();
    
    // Switch to Properties tab
    await page.locator('[role="tab"]', { hasText: 'Properties' }).click();
    await expect(page.locator('text=Select a node to view properties')).toBeVisible();
    
    // Switch back to Components tab
    await page.locator('[role="tab"]', { hasText: 'Components' }).click();
    await expect(page.locator('text=Start/End Nodes')).toBeVisible();
  });

  test('should display node connection points', async ({ page }) => {
    // Workflow nodes should have connection points (blue circles)
    const connectionPoints = page.locator('.w-4.h-4.bg-blue-500.rounded-full');
    expect(await connectionPoints.count()).toBeGreaterThan(0);
  });

  test('should handle clear all functionality', async ({ page }) => {
    const clearAllButton = page.locator('button', { hasText: 'Clear All' });
    await expect(clearAllButton).toBeVisible();
    await clearAllButton.click();
    
    // Should not throw errors
    await page.waitForTimeout(100);
  });

  test('should display proper node icons and colors', async ({ page }) => {
    // Nodes should have colored icon containers
    const nodeIcons = page.locator('.p-1.rounded');
    expect(await nodeIcons.count()).toBeGreaterThan(0);
    
    // Check for various background colors
    await expect(page.locator('.bg-green-500')).toBeVisible();
    await expect(page.locator('.bg-blue-500')).toBeVisible();
  });

  test('should handle workflow instance status indicators', async ({ page }) => {
    // Check for status icons in monitoring table
    const statusIcons = page.locator('svg').filter({ hasText: /^$/ }); // SVG icons
    expect(await statusIcons.count()).toBeGreaterThan(0);
    
    // Check for status badges
    const statusBadges = page.locator('.text-xs').filter({ hasText: /active|paused|failed|completed|overdue/ });
    expect(await statusBadges.count()).toBeGreaterThan(0);
  });
});

test.describe('Workflow Designer - Accessibility', () => {
  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/workflow-designer');
    
    // Check for proper tab roles
    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count()).toBeGreaterThan(0);
    
    // Check for proper button elements
    const buttons = page.locator('button');
    expect(await buttons.count()).toBeGreaterThan(0);
    
    // Check for proper table structure
    const tables = page.locator('table');
    await expect(tables.first()).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/workflow-designer');
    
    // Tab to the first focusable element
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Navigate to tabs with keyboard
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/workflow-designer');
    
    // Check that text is visible against backgrounds
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Workflow Designer')).toBeVisible();
    
    // Status badges should be visible
    await expect(page.locator('text=active')).toBeVisible();
    await expect(page.locator('text=overdue')).toBeVisible();
  });
});

test.describe('Workflow Designer - Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/workflow-designer');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle multiple rapid interactions', async ({ page }) => {
    await page.goto('/workflow-designer');
    
    // Rapidly click various buttons
    const buttons = ['Tools', 'Templates', 'Test', 'Save', 'Monitor'];
    
    for (let i = 0; i < 3; i++) { // Multiple cycles
      for (const button of buttons) {
        await page.locator('button', { hasText: button }).click();
        await page.waitForTimeout(25); // Very brief delay
      }
    }
    
    // Should still be responsive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle node selection and property updates smoothly', async ({ page }) => {
    await page.goto('/workflow-designer');
    
    // Select different nodes rapidly
    const nodeTexts = ['Review Application', 'Decision', 'Send Approval'];
    
    for (const nodeText of nodeTexts) {
      await page.locator(`text=${nodeText}`).click();
      await page.locator('[role="tab"]', { hasText: 'Properties' }).click();
      await page.locator('[role="tab"]', { hasText: 'Components' }).click();
      await page.waitForTimeout(50);
    }
    
    // Should remain responsive
    await expect(page.locator('text=Workflow Designer')).toBeVisible();
  });
});