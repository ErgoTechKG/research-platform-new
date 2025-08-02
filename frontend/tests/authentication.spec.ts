import { test, expect } from '@playwright/test'

test.describe('Authentication System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test.describe('User Registration', () => {
    test('should display registration form correctly', async ({ page }) => {
      await page.goto('/register')
      
      // Check page title and form elements
      await expect(page.getByText('加入科研实验班')).toBeVisible()
      await expect(page.getByText('申请注册账户')).toBeVisible()
      
      // Check form fields
      await expect(page.getByLabel('姓名')).toBeVisible()
      await expect(page.getByLabel('学号')).toBeVisible()
      await expect(page.getByLabel('华科邮箱')).toBeVisible()
      await expect(page.getByLabel('密码')).toBeVisible()
      await expect(page.getByLabel('确认密码')).toBeVisible()
      await expect(page.getByLabel('申请角色')).toBeVisible()
      await expect(page.getByLabel('院系')).toBeVisible()
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto('/register')
      
      // Try to submit empty form
      await page.getByRole('button', { name: '提交注册申请' }).click()
      
      // Should show validation message
      await expect(page.getByText('请输入姓名')).toBeVisible()
    })

    test('should validate email format', async ({ page }) => {
      await page.goto('/register')
      
      await page.getByLabel('姓名').fill('测试用户')
      await page.getByLabel('学号').fill('D202377777')
      await page.getByLabel('华科邮箱').fill('invalid-email')
      await page.getByLabel('密码').fill('password123')
      await page.getByLabel('确认密码').fill('password123')
      await page.getByRole('button', { name: '提交注册申请' }).click()
      
      await expect(page.getByText('邮箱格式不正确')).toBeVisible()
    })

    test('should validate HUST email domain', async ({ page }) => {
      await page.goto('/register')
      
      await page.getByLabel('姓名').fill('测试用户')
      await page.getByLabel('学号').fill('D202377777')
      await page.getByLabel('华科邮箱').fill('test@gmail.com')
      await page.getByLabel('密码').fill('password123')
      await page.getByLabel('确认密码').fill('password123')
      await page.getByRole('button', { name: '提交注册申请' }).click()
      
      await expect(page.getByText(/请使用华中科技大学邮箱/)).toBeVisible()
    })

    test('should validate password strength', async ({ page }) => {
      await page.goto('/register')
      
      await page.getByLabel('密码').fill('weak')
      
      // Should show password strength indicator
      await expect(page.getByText('弱')).toBeVisible()
    })

    test('should validate password confirmation', async ({ page }) => {
      await page.goto('/register')
      
      await page.getByLabel('密码').fill('password123')
      await page.getByLabel('确认密码').fill('different123')
      
      await expect(page.getByText('密码不匹配')).toBeVisible()
    })

    test('should validate student ID format', async ({ page }) => {
      await page.goto('/register')
      
      await page.getByLabel('姓名').fill('测试用户')
      await page.getByLabel('学号').fill('invalid-id')
      await page.getByLabel('华科邮箱').fill('test@hust.edu.cn')
      await page.getByRole('button', { name: '提交注册申请' }).click()
      
      await expect(page.getByText(/学号格式不正确/)).toBeVisible()
    })

    test('should submit valid registration form', async ({ page }) => {
      await page.goto('/register')
      
      await page.getByLabel('姓名').fill('测试用户')
      await page.getByLabel('学号').fill('D202377777')
      await page.getByLabel('华科邮箱').fill('test@hust.edu.cn')
      await page.getByLabel('密码').fill('Password123!')
      await page.getByLabel('确认密码').fill('Password123!')
      
      // Select role
      await page.getByLabel('申请角色').click()
      await page.getByRole('option', { name: '学生' }).click()
      
      await page.getByLabel('院系').fill('机械科学与工程学院')
      
      await page.getByRole('button', { name: '提交注册申请' }).click()
      
      // Should show success message
      await expect(page.getByText(/注册申请已提交/)).toBeVisible()
    })
  })

  test.describe('User Login', () => {
    test('should display login form correctly', async ({ page }) => {
      await page.goto('/login')
      
      await expect(page.getByText('科研实验班管理平台')).toBeVisible()
      await expect(page.getByText('欢迎登录')).toBeVisible()
      await expect(page.getByLabel('邮箱/学号')).toBeVisible()
      await expect(page.getByLabel('密码')).toBeVisible()
      await expect(page.getByText('记住我')).toBeVisible()
      await expect(page.getByText('忘记密码？')).toBeVisible()
    })

    test('should validate required login fields', async ({ page }) => {
      await page.goto('/login')
      
      await page.getByRole('button', { name: '登录' }).click()
      
      // HTML5 validation should prevent submission
      const emailInput = page.getByLabel('邮箱/学号')
      await expect(emailInput).toBeFocused()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login')
      
      await page.getByLabel('邮箱/学号').fill('invalid@hust.edu.cn')
      await page.getByLabel('密码').fill('wrongpassword')
      await page.getByRole('button', { name: '登录' }).click()
      
      await expect(page.getByText(/邮箱或密码错误/)).toBeVisible()
    })

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('/login')
      
      await page.getByLabel('邮箱/学号').fill('test@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByRole('button', { name: '登录' }).click()
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/)
    })

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/login')
      
      const passwordInput = page.getByLabel('密码')
      const toggleButton = page.locator('button').filter({ has: page.locator('[data-testid="eye-icon"]') }).first()
      
      await passwordInput.fill('testpassword')
      
      // Initially password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password')
      
      // Click toggle button
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'text')
      
      // Click again to hide
      await toggleButton.click()
      await expect(passwordInput).toHaveAttribute('type', 'password')
    })

    test('should remember login state', async ({ page }) => {
      await page.goto('/login')
      
      await page.getByLabel('邮箱/学号').fill('test@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByText('记住我').click()
      await page.getByRole('button', { name: '登录' }).click()
      
      // Wait for redirect
      await page.waitForURL(/.*dashboard/)
      
      // Reload page
      await page.reload()
      
      // Should still be logged in
      await expect(page).toHaveURL(/.*dashboard/)
    })
  })

  test.describe('Forgot Password', () => {
    test('should display forgot password form', async ({ page }) => {
      await page.goto('/forgot-password')
      
      await expect(page.getByText('忘记密码')).toBeVisible()
      await expect(page.getByText('输入您的邮箱地址，我们将发送验证码给您')).toBeVisible()
      await expect(page.getByLabel('邮箱地址')).toBeVisible()
    })

    test('should validate email in forgot password', async ({ page }) => {
      await page.goto('/forgot-password')
      
      await page.getByRole('button', { name: '发送验证码' }).click()
      await expect(page.getByText('请输入邮箱地址')).toBeVisible()
      
      await page.getByLabel('邮箱地址').fill('invalid-email')
      await page.getByRole('button', { name: '发送验证码' }).click()
      await expect(page.getByText('邮箱格式不正确')).toBeVisible()
    })

    test('should proceed to verification step', async ({ page }) => {
      await page.goto('/forgot-password')
      
      await page.getByLabel('邮箱地址').fill('test@hust.edu.cn')
      await page.getByRole('button', { name: '发送验证码' }).click()
      
      // Should show verification code step
      await expect(page.getByText('验证您的邮箱')).toBeVisible()
      await expect(page.getByText(/我们已向.*发送了验证码/)).toBeVisible()
      await expect(page.getByLabel('验证码')).toBeVisible()
    })

    test('should validate verification code', async ({ page }) => {
      await page.goto('/forgot-password')
      
      // Go through email step
      await page.getByLabel('邮箱地址').fill('test@hust.edu.cn')
      await page.getByRole('button', { name: '发送验证码' }).click()
      
      // Try invalid verification code
      await page.getByLabel('验证码').fill('000000')
      await page.getByRole('button', { name: '验证' }).click()
      
      await expect(page.getByText('验证码不正确')).toBeVisible()
    })

    test('should proceed to reset password step', async ({ page }) => {
      await page.goto('/forgot-password')
      
      // Go through email step
      await page.getByLabel('邮箱地址').fill('test@hust.edu.cn')
      await page.getByRole('button', { name: '发送验证码' }).click()
      
      // Enter correct verification code
      await page.getByLabel('验证码').fill('123456')
      await page.getByRole('button', { name: '验证' }).click()
      
      // Should show reset password step
      await expect(page.getByText('重置密码')).toBeVisible()
      await expect(page.getByLabel('新密码')).toBeVisible()
      await expect(page.getByLabel('确认密码')).toBeVisible()
    })

    test('should complete password reset', async ({ page }) => {
      await page.goto('/forgot-password')
      
      // Go through all steps
      await page.getByLabel('邮箱地址').fill('test@hust.edu.cn')
      await page.getByRole('button', { name: '发送验证码' }).click()
      
      await page.getByLabel('验证码').fill('123456')
      await page.getByRole('button', { name: '验证' }).click()
      
      await page.getByLabel('新密码').fill('newpassword123')
      await page.getByLabel('确认密码').fill('newpassword123')
      await page.getByRole('button', { name: '重置密码' }).click()
      
      // Should show success message
      await expect(page.getByText('密码重置成功')).toBeVisible()
      await expect(page.getByRole('link', { name: '立即登录' })).toBeVisible()
    })
  })

  test.describe('User Profile Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.getByLabel('邮箱/学号').fill('test@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByRole('button', { name: '登录' }).click()
      await page.waitForURL(/.*dashboard/)
      
      // Navigate to profile
      await page.goto('/profile')
    })

    test('should display user profile correctly', async ({ page }) => {
      await expect(page.getByText('个人中心')).toBeVisible()
      await expect(page.getByText('基本信息')).toBeVisible()
      await expect(page.getByText('安全设置')).toBeVisible()
      await expect(page.getByText('权限信息')).toBeVisible()
    })

    test('should update basic information', async ({ page }) => {
      // Fill in profile form
      await page.getByLabel('姓名').fill('Updated Name')
      await page.getByLabel('联系电话').fill('13800138000')
      
      await page.getByRole('button', { name: '保存更改' }).click()
      
      // Should show success message
      await expect(page.getByText('个人信息更新成功')).toBeVisible()
    })

    test('should change password', async ({ page }) => {
      // Go to security tab
      await page.getByRole('tab', { name: '安全设置' }).click()
      
      await page.getByLabel('当前密码').fill('password123')
      await page.getByLabel('新密码').fill('newpassword123')
      await page.getByLabel('确认新密码').fill('newpassword123')
      
      await page.getByRole('button', { name: '修改密码' }).click()
      
      // Should show success message
      await expect(page.getByText('密码修改成功')).toBeVisible()
    })

    test('should display user permissions', async ({ page }) => {
      // Go to permissions tab
      await page.getByRole('tab', { name: '权限信息' }).click()
      
      await expect(page.getByText('当前角色')).toBeVisible()
      await expect(page.getByText('权限列表')).toBeVisible()
    })
  })

  test.describe('User Management (Admin)', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/login')
      await page.getByLabel('邮箱/学号').fill('admin@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByRole('button', { name: '登录' }).click()
      await page.waitForURL(/.*dashboard/)
      
      // Navigate to user management
      await page.goto('/user-management')
    })

    test('should display user management interface', async ({ page }) => {
      await expect(page.getByText('用户管理')).toBeVisible()
      await expect(page.getByText('管理系统中的所有用户账户')).toBeVisible()
      await expect(page.getByRole('button', { name: '添加用户' })).toBeVisible()
    })

    test('should filter users by role', async ({ page }) => {
      // Use role filter
      await page.getByLabel('角色筛选').click()
      await page.getByRole('option', { name: '学生' }).click()
      
      // Should filter the table
      await expect(page.getByText('学生')).toBeVisible()
    })

    test('should search users', async ({ page }) => {
      await page.getByLabel('搜索用户').fill('张三')
      
      // Should filter results
      await expect(page.getByText('张三')).toBeVisible()
    })

    test('should create new user', async ({ page }) => {
      await page.getByRole('button', { name: '添加用户' }).click()
      
      // Fill create form
      await page.getByLabel('姓名').fill('新用户')
      await page.getByLabel('邮箱').fill('newuser@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByLabel('院系').fill('机械科学与工程学院')
      
      await page.getByRole('button', { name: '创建用户' }).click()
      
      // Should show success message
      await expect(page.getByText('用户创建成功')).toBeVisible()
    })
  })

  test.describe('Route Protection', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      await page.goto('/profile')
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/)
    })

    test('should show permission denied for unauthorized routes', async ({ page }) => {
      // Login as student
      await page.goto('/login')
      await page.getByLabel('邮箱/学号').fill('student@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByRole('button', { name: '登录' }).click()
      
      // Try to access admin-only route
      await page.goto('/user-management')
      
      // Should show permission denied
      await expect(page.getByText(/您没有访问此页面的权限/)).toBeVisible()
    })
  })

  test.describe('Test Mode Functionality', () => {
    test('should display test mode indicator', async ({ page }) => {
      // Assuming test mode is enabled
      await page.goto('/')
      
      // Should show test mode indicator
      await expect(page.getByText('测试模式')).toBeVisible()
    })

    test('should allow role switching in test mode', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('邮箱/学号').fill('test@hust.edu.cn')
      await page.getByLabel('密码').fill('password123')
      await page.getByRole('button', { name: '登录' }).click()
      
      // Should show role switcher
      if (await page.getByText('切换角色').isVisible()) {
        await page.getByText('切换角色').click()
        await page.getByRole('option', { name: '教授' }).click()
        
        // Should switch to professor role
        await expect(page.getByText('教授')).toBeVisible()
      }
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      
      await page.goto('/login')
      
      // Form should be responsive
      await expect(page.getByText('科研实验班管理平台')).toBeVisible()
      await expect(page.getByLabel('邮箱/学号')).toBeVisible()
      await expect(page.getByLabel('密码')).toBeVisible()
    })

    test('should work on tablet devices', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      
      await page.goto('/register')
      
      // Form should be responsive
      await expect(page.getByText('加入科研实验班')).toBeVisible()
      await expect(page.getByLabel('姓名')).toBeVisible()
    })
  })
})