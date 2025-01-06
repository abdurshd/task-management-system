import { test, expect } from '@playwright/test';

test.describe('Login Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // Basic Login Tests
  test('displays login form correctly', async ({ page }) => {
    await expect(page.getByPlaceholder(/이메일 주소를 입력해 주세요./i)).toBeVisible();
    await expect(page.getByPlaceholder(/비밀번호를 입력해 주세요./i)).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인/i })).toBeVisible();
  });

  test('shows validation errors for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /로그인/i }).click();
    
    await expect(page.getByText(/이메일을 입력해주세요/i)).toBeVisible();
    await expect(page.getByText(/비밀번호를 입력해주세요/i)).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'invalid@example.com');
    await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'wrongpassword');
    await page.getByRole('button', { name: /로그인/i }).click();
    
    await expect(page.getByText(/로그인에 실패했습니다/i)).toBeVisible();
  });

  // Role-based Routing Tests
  test.describe('role-based routing', () => {
    const roleTests = [
      { role: 'Admin', email: 'meganlewis@example.com', expectedPath: '/dashboard/users' },
      { role: 'PrimeUser', email: 'emma78@example.net', expectedPath: '/dashboard/users' },
      { role: 'RegularUser', email: 'morrislucas@example.org', expectedPath: '/dashboard/users' },
      { role: 'Viewer', email: 'nlynch@example.org', expectedPath: '/dashboard/tasks' },
    ];

    for (const { role, email, expectedPath } of roleTests) {
      test(`redirects ${role} to ${expectedPath}`, async ({ page }) => {
        await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', email);
        await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
        await page.getByRole('button', { name: /로그인/i }).click();
        
        await expect(page).toHaveURL(expectedPath);
      });
    }
  });

  // Session Management Tests
  test('maintains session after page reload', async ({ page, context }) => {
    const adminUser = {
      userName: "Jeffrey Villanueva",
      userEmail: "eobrien@example.org",
      userRole: "Admin"
    };
    
    // Set cookie
    await context.addCookies([{
      name: 'user',
      value: JSON.stringify(adminUser),
      domain: 'localhost',
      path: '/'
    }]);
    
    await page.goto('/dashboard/users');
    await expect(page).toHaveURL('/dashboard/users');
    
    // Reload page
    await page.reload();
    
    // Verify still logged in
    await expect(page).toHaveURL('/dashboard/users');
    await expect(page.getByText('Jeffrey Villanueva')).toBeVisible();
  });

  test('clears session on logout', async ({ page, context }) => {
    const adminUser = {
      userName: "Jeffrey Villanueva",
      userEmail: "eobrien@example.org",
      userRole: "Admin"
    };
    
    // Set cookie
    await context.addCookies([{
      name: 'user',
      value: JSON.stringify(adminUser),
      domain: 'localhost',
      path: '/'
    }]);
    
    await page.goto('/dashboard/users');
    
    // Click user menu button (the rounded button with user icon)
    await page.locator('button.rounded-full').click();
      
    // Click logout in dropdown
    await page.getByText('Log out').click();
    
    // Confirm logout in dialog
    await page.getByRole('button', { name: 'Log out' }).click();
    
    // Verify redirect to login
    await expect(page).toHaveURL('/');
    
    // Try accessing protected route
    await page.goto('/dashboard/users');
    
    // Verify redirect back to login
    await expect(page).toHaveURL('/');
  });

  // Security Tests
  test('prevents access to protected routes when not logged in', async ({ page }) => {
    // Try accessing protected routes
    const protectedRoutes = ['/dashboard/users', '/dashboard/tasks'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL('/');
    }
  });
}); 