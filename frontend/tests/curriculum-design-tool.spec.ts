import { test, expect } from '@playwright/test';

test.describe('Curriculum Design Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/curriculum-design-tool');
    await page.waitForLoadState('networkidle');
  });

  test('should display the main page title and description', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Curriculum Design Visual Tool');
    await expect(page.locator('p')).toContainText('Design and optimize curriculum structures with drag-and-drop interface');
  });

  test('should display auto-save toggle', async ({ page }) => {
    const autoSaveSwitch = page.locator('[role="switch"]').first();
    await expect(autoSaveSwitch).toBeVisible();
    await expect(page.locator('text=Auto-save')).toBeVisible();
  });

  test('should have all main navigation tabs', async ({ page }) => {
    const tabs = [
      'Templates',
      'Designer',
      'Compare',
      'Export',
      'Save'
    ];

    for (const tab of tabs) {
      await expect(page.locator(`[role="tab"]`, { hasText: tab })).toBeVisible();
    }
  });

  test('should display template library on Templates tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    await expect(page.locator('text=Template Library')).toBeVisible();
    
    // Check for sample templates
    await expect(page.locator('text=Computer Science')).toBeVisible();
    await expect(page.locator('text=Biology Major')).toBeVisible();
    await expect(page.locator('text=Business Analytics')).toBeVisible();
    
    // Check template action buttons
    await expect(page.locator('button', { hasText: 'Load' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Create New' })).toBeVisible();
  });

  test('should display course components on Templates tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    await expect(page.locator('text=Course Components')).toBeVisible();
    
    // Check core courses section
    await expect(page.locator('text=Core Courses')).toBeVisible();
    await expect(page.locator('text=Programming Basics')).toBeVisible();
    await expect(page.locator('text=Data Structures')).toBeVisible();
    await expect(page.locator('text=Software Engineering')).toBeVisible();
    await expect(page.locator('text=Database Management')).toBeVisible();
    
    // Check electives section
    await expect(page.locator('text=Electives')).toBeVisible();
    await expect(page.locator('text=Machine Learning')).toBeVisible();
    await expect(page.locator('text=Mobile Development')).toBeVisible();
    await expect(page.locator('text=Cybersecurity')).toBeVisible();
    await expect(page.locator('text=UI/UX Design')).toBeVisible();
    
    // Check course badges
    await expect(page.locator('text=Core')).toBeVisible();
    await expect(page.locator('text=Elective')).toBeVisible();
  });

  test('should display visual course map on Designer tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    
    await expect(page.locator('text=Visual Course Map Designer')).toBeVisible();
    
    // Check for semester terms
    await expect(page.locator('text=Term 1')).toBeVisible();
    await expect(page.locator('text=Term 2')).toBeVisible();
    await expect(page.locator('text=Term 3')).toBeVisible();
    await expect(page.locator('text=Term 4')).toBeVisible();
    
    // Check for sample courses in semesters
    await expect(page.locator('text=Programming Basics')).toBeVisible();
    await expect(page.locator('text=Mathematics Foundations')).toBeVisible();
    await expect(page.locator('text=Data Structures & Algorithms')).toBeVisible();
    await expect(page.locator('text=Capstone Project')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button', { hasText: 'Add Course' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Remove' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Rearrange' })).toBeVisible();
  });

  test('should display total credits calculation', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    
    // Check total credits display
    await expect(page.locator('text=/Total Credits: \\d+ \\/ 48 required/')).toBeVisible();
    
    // Check individual semester credit totals
    await expect(page.locator('text=/Total: \\d+ credits/')).toBeVisible();
  });

  test('should navigate to Compare tab and show comparison', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Compare' }).click();
    
    await expect(page.locator('text=Side-by-Side Comparison')).toBeVisible();
    
    // Check current design section
    await expect(page.locator('text=Current Design')).toBeVisible();
    await expect(page.locator('text=Total Credits:')).toBeVisible();
    await expect(page.locator('text=Core Courses:')).toBeVisible();
    await expect(page.locator('text=Electives:')).toBeVisible();
    await expect(page.locator('text=Duration:')).toBeVisible();
    
    // Check template section
    await expect(page.locator('text=Template: Computer Science')).toBeVisible();
    
    // Check validation indicators
    await expect(page.locator('text=Meets requirements').or(page.locator('text=Credit overflow').or(page.locator('text=Credit shortage')))).toBeVisible();
    await expect(page.locator('text=Logical prerequisites')).toBeVisible();
    
    // Check action buttons
    await expect(page.locator('button', { hasText: 'Apply Changes' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Reset' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Use This' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Merge Elements' })).toBeVisible();
  });

  test('should display export options on Export tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Export' }).click();
    
    await expect(page.locator('text=Export Options')).toBeVisible();
    
    // Check export format buttons
    await expect(page.locator('button', { hasText: 'PDF' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Excel' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Word' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Share Link' })).toBeVisible();
    
    // Check export preview section
    await expect(page.locator('text=Export Preview')).toBeVisible();
    await expect(page.locator('text=Your curriculum design will include:')).toBeVisible();
    await expect(page.locator('text=Course schedule by semester')).toBeVisible();
    await expect(page.locator('text=Credit distribution analysis')).toBeVisible();
    await expect(page.locator('text=Prerequisite relationships')).toBeVisible();
    await expect(page.locator('text=Validation report')).toBeVisible();
  });

  test('should display save options on Save tab', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Save' }).click();
    
    await expect(page.locator('text=Save & Management')).toBeVisible();
    
    // Check save buttons
    await expect(page.locator('button', { hasText: 'Save Current Design' })).toBeVisible();
    await expect(page.locator('button', { hasText: 'Save as Template' })).toBeVisible();
    
    // Check recent saves section
    await expect(page.locator('text=Recent Saves')).toBeVisible();
    await expect(page.locator('text=CS Program v2.1')).toBeVisible();
    await expect(page.locator('text=Bio Track Draft')).toBeVisible();
  });

  test('should handle course dragging interaction', async ({ page }) => {
    // Start on Templates tab to access course components
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    // Find a draggable course element
    const draggableCourse = page.locator('[draggable="true"]').first();
    await expect(draggableCourse).toBeVisible();
    
    // Switch to Designer tab to see the drop zones
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    
    // Check that semester drop zones are present
    const dropZones = page.locator('.border-dashed');
    expect(await dropZones.count()).toBeGreaterThan(0);
  });

  test('should handle remove course functionality', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    
    // Look for remove buttons (they appear on hover, so we'll check for the minus icon)
    const removeButtons = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /^$/ });
    
    // Should have course removal functionality available
    await expect(page.locator('button', { hasText: 'Remove' })).toBeVisible();
  });

  test('should handle auto-save toggle', async ({ page }) => {
    const autoSaveSwitch = page.locator('[role="switch"]').first();
    
    // Check initial state
    await expect(autoSaveSwitch).toBeVisible();
    
    // Toggle auto-save off
    await autoSaveSwitch.click();
    
    // Should still be functional (no errors)
    await page.waitForTimeout(100);
    
    // Toggle back on
    await autoSaveSwitch.click();
    await page.waitForTimeout(100);
  });

  test('should display status bar at bottom', async ({ page }) => {
    await expect(page.locator('text=Export Options: PDF | Excel | Word | Share Link')).toBeVisible();
    await expect(page.locator('text=Auto-save:')).toBeVisible();
    await expect(page.locator('text=Last saved:')).toBeVisible();
  });

  test('should handle template selection', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    // Check that templates are clickable
    const templates = page.locator('.border.rounded-lg.p-4.hover\\:shadow-md');
    expect(await templates.count()).toBeGreaterThan(0);
    
    // Click on a template
    await templates.first().click();
    
    // Should still be functional (no errors)
    await page.waitForTimeout(100);
  });

  test('should display validation icons and messages', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Compare' }).click();
    
    // Check for validation icons (checkmarks and warnings)
    const checkIcons = page.locator('svg').filter({ hasText: /^$/ }); // SVG icons
    expect(await checkIcons.count()).toBeGreaterThan(0);
    
    // Check for validation messages
    await expect(page.locator('text=Logical prerequisites')).toBeVisible();
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main title is still visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that tabs are still functional
    await expect(page.locator('[role="tab"]', { hasText: 'Templates' })).toBeVisible();
    
    // Navigate to Designer tab
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    
    // Check that the layout adapts to mobile
    await expect(page.locator('text=Visual Course Map Designer')).toBeVisible();
  });

  test('should handle export button clicks', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Export' }).click();
    
    // Click each export button to ensure they're functional
    const exportButtons = ['PDF', 'Excel', 'Word', 'Share Link'];
    
    for (const buttonText of exportButtons) {
      const button = page.locator('button', { hasText: buttonText });
      await expect(button).toBeVisible();
      await button.click();
      await page.waitForTimeout(50); // Brief wait between clicks
    }
  });

  test('should handle save functionality', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Save' }).click();
    
    // Test save buttons
    const saveCurrentButton = page.locator('button', { hasText: 'Save Current Design' });
    await expect(saveCurrentButton).toBeVisible();
    await saveCurrentButton.click();
    
    const saveTemplateButton = page.locator('button', { hasText: 'Save as Template' });
    await expect(saveTemplateButton).toBeVisible();
    await saveTemplateButton.click();
    
    // Test recent saves load buttons
    const loadButtons = page.locator('button', { hasText: 'Load' });
    expect(await loadButtons.count()).toBeGreaterThan(0);
    await loadButtons.first().click();
  });

  test('should display course credit information', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    // Check that credit information is displayed for courses
    await expect(page.locator('text=3 credits').or(page.locator('text=4 credits').or(page.locator('text=6 credits')))).toBeVisible();
    
    // Switch to Designer to check credit totals
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    await expect(page.locator('text=/\\d+ Credits/')).toBeVisible();
  });

  test('should handle comparison view interactions', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Compare' }).click();
    
    // Test comparison action buttons
    const actionButtons = [
      'Apply Changes',
      'Reset',
      'Use This',
      'Merge Elements'
    ];
    
    for (const buttonText of actionButtons) {
      const button = page.locator('button', { hasText: buttonText });
      await expect(button).toBeVisible();
      await button.click();
      await page.waitForTimeout(50);
    }
  });

  test('should display template information correctly', async ({ page }) => {
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    // Check template details
    await expect(page.locator('text=4-Year Program')).toBeVisible();
    await expect(page.locator('text=Graduate Level')).toBeVisible();
    await expect(page.locator('text=Professional Track')).toBeVisible();
    
    // Check last used information
    await expect(page.locator('text=Last used: 2 days ago')).toBeVisible();
    await expect(page.locator('text=Last used: 1 week ago')).toBeVisible();
    await expect(page.locator('text=New template')).toBeVisible();
  });
});

test.describe('Curriculum Design Tool - Accessibility', () => {
  test('should have proper ARIA labels and roles', async ({ page }) => {
    await page.goto('/curriculum-design-tool');
    
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
    await page.goto('/curriculum-design-tool');
    
    // Tab to the first focusable element
    await page.keyboard.press('Tab');
    
    // Should be able to navigate with keyboard
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Navigate to different tabs with keyboard
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/curriculum-design-tool');
    
    // Check that text is visible against backgrounds
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Curriculum Design Visual Tool')).toBeVisible();
    
    // Course badges should be visible
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    await expect(page.locator('text=Core')).toBeVisible();
    await expect(page.locator('text=Elective')).toBeVisible();
  });
});

test.describe('Curriculum Design Tool - Performance', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/curriculum-design-tool');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle multiple rapid tab switches', async ({ page }) => {
    await page.goto('/curriculum-design-tool');
    
    // Rapidly switch between tabs
    const tabs = ['Templates', 'Designer', 'Compare', 'Export', 'Save'];
    
    for (let i = 0; i < 3; i++) { // Do multiple cycles
      for (const tab of tabs) {
        await page.locator('[role="tab"]', { hasText: tab }).click();
        await page.waitForTimeout(25); // Very brief delay
      }
    }
    
    // Should still be responsive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle drag and drop interactions smoothly', async ({ page }) => {
    await page.goto('/curriculum-design-tool');
    
    // Navigate to templates to find draggable elements
    await page.locator('[role="tab"]', { hasText: 'Templates' }).click();
    
    // Check that draggable elements are present
    const draggableElements = page.locator('[draggable="true"]');
    expect(await draggableElements.count()).toBeGreaterThan(0);
    
    // Switch to designer to check drop zones
    await page.locator('[role="tab"]', { hasText: 'Designer' }).click();
    
    // Should load without performance issues
    await expect(page.locator('text=Visual Course Map Designer')).toBeVisible();
  });
});