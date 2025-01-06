import { test, expect } from '@playwright/test';

test.describe('Store Integration Tests', () => {
  // Auth Store Tests
  test.describe('Auth Store', () => {
    test('successfully logs in and persists session', async ({ page, context }) => {
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'meganlewis@example.com');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.getByRole('button', { name: /로그인/i }).click();
      
      // Wait for navigation and network idle
      await page.waitForURL('/dashboard/users', { waitUntil: 'networkidle' });
      
      // Wait for cookie to be set (retry a few times if needed)
      let userCookie;
      for (let i = 0; i < 3; i++) {
        const cookies = await context.cookies();
        userCookie = cookies.find(c => c.name === 'user');
        if (userCookie) break;
        await page.waitForTimeout(500); // Wait 500ms between attempts
      }
      
      expect(userCookie).toBeTruthy();
      
      // Verify redirect to dashboard
      await expect(page).toHaveURL('/dashboard/users');
      
      // Verify user info is displayed
      await expect(page.getByText('Megan Lewis')).toBeVisible();
    });

    test('successfully logs out', async ({ page, context }) => {
      const adminUser = {
        userName: "Jeffrey Villanueva",
        userEmail: "eobrien@example.org",
        userRole: "Admin"
      };
      
      // Set initial cookie
      await context.addCookies([{
        name: 'user',
        value: JSON.stringify(adminUser),
        domain: 'localhost',
        path: '/'
      }]);
      
      await page.goto('/dashboard/users');
      
      // Click user menu button and wait for dropdown
    await page.getByTestId('user-menu-button').click();
    await page.waitForSelector('[role="menuitem"]', { state: 'visible' });
    
    // Click logout with a more specific selector and force option
    await page.getByRole('menuitem', { name: 'Log out' }).click({ force: true });
    
    // Wait for and click confirm in dialog
    await page.waitForSelector('button[role="button"]', { state: 'visible' });
    await page.getByRole('button', { name: 'Log out' }).click();
      
      // Verify cookie was cleared
      const cookies = await context.cookies();
      const userCookie = cookies.find(c => c.name === 'user');
      expect(userCookie).toBeFalsy();
      
      // Verify redirect to login
      await expect(page).toHaveURL('/');
    });
  });

  // Task Store Tests
  test.describe('Task Store', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'admin@example.com');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'password123');
      await page.click('button:has-text("로그인")');
    });

    test('successfully creates purchase task', async ({ page }) => {
      await page.goto('/dashboard/tasks');
      await page.click('button:has-text("Create Task")');
      
      // Fill purchase task form
      await page.fill('[placeholder="테스크 이름을 입력해주세요"]', 'New Purchase Task');
      
      // Use more specific selector for task type
      const taskTypeSelect = page.getByRole('combobox', { name: /테스크 유형/i });
      await taskTypeSelect.click();
      await page.getByRole('option', { name: '물품구매' }).click();
      
      await page.getByLabel(/물품명/i).fill('Test Item');
      await page.getByLabel(/물품 갯수/i).fill('5');
      
      // Set assignee
      const assigneeSelect = page.getByLabel(/담당자 지정/i);
      await assigneeSelect.click();
      await page.getByRole('option', { name: 'Julie Johnson' }).click();
      
      // Submit form
      await page.getByRole('button', { name: /Create/i }).click();
      
      // Verify success toast
      await expect(page.getByRole('status')).toContainText('Task created successfully');
    });

    test('successfully creates delivery task', async ({ page }) => {
      await page.goto('/dashboard/tasks');
      await page.click('button:has-text("Create Task")');

      // Fill delivery task form
      await page.fill('[placeholder="테스크 이름을 입력해주세요"]', 'New Delivery Task');
      await page.getByLabel(/테스크 유형/i).click();
      await page.getByText('택배요청').click();
      await page.getByLabel(/받는사람 이름/i).fill('John Doe');
      await page.getByLabel(/받는사람 전화번호/i).fill('+8210-1234-5678');
      await page.getByLabel(/받는사람 주소/i).fill('서울시 강남구 테헤란로 123');
      await page.getByLabel(/담당자 지정/i).click();
      await page.getByRole('option').first().click();

      // Submit form
      await page.click('button:has-text("Create")');

      // Verify success
      await expect(page.getByText('Task created successfully')).toBeVisible();
      await expect(page.getByText('New Delivery Task')).toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
      await page.goto('/dashboard/tasks');
      await page.click('button:has-text("Create Task")');

      // Try to submit empty form
      await page.click('button:has-text("Create")');

      // Verify validation messages
      await expect(page.getByText('테스크 이름을 입력해주세요')).toBeVisible();
      await expect(page.getByText('담당자를 선택해주세요')).toBeVisible();
    });

    test('filters tasks by status', async ({ page }) => {
      await page.goto('/dashboard/tasks');
      
      // Apply status filter
      await page.getByRole('button', { name: /Status/i }).click();
      await page.getByText('Created').click();
      
      // Verify filtered results
      await expect(page.getByText(/In Progress/i)).not.toBeVisible();
      await expect(page.getByText(/Done/i)).not.toBeVisible();
    });

    test('filters tasks by search term and field', async ({ page }) => {
      await page.goto('/dashboard/tasks');
      
      // Select search field
      await page.getByRole('combobox').click();
      await page.getByText('Task Name').click();
      
      // Perform search
      await page.getByPlaceholder('Search').fill('Task 1');
      
      // Verify filtered results show Task 1 but not Task 2
      await expect(page.getByText('Task 100')).toBeVisible();
      await expect(page.getByText('Task 3')).not.toBeVisible();

      // Change search field to Reporter
      await page.getByRole('combobox').click(); 
      await page.getByText('Reporter').click();

      // Search by reporter
      await page.getByPlaceholder('Search').fill('Jeffrey Villanueva');

      // Verify filtered results show tasks with that reporter
      await expect(page.getByText('Jeffrey Villanueva')).toBeVisible();
    });
  });

  // User Store Tests
  test.describe('User Store', () => {
    test.describe('Role-based Access', () => {
      test('admin sees all users', async ({ page }) => {
        // Login as admin
        await page.goto('/');
        await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'meganlewis@example.com');
        await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
        await page.click('button:has-text("로그인")');
        
        await page.goto('/dashboard/users');
        
        // Verify all user types are visible
        await expect(page.getByText('Admin User')).toBeVisible();
        await expect(page.getByText('Prime User')).toBeVisible();
        await expect(page.getByText('Regular User')).toBeVisible();
        await expect(page.getByText('Viewer User')).toBeVisible();
      });

      test('regular user sees only self', async ({ page }) => {
        // Login as regular user
        await page.goto('/');
        await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'morrislucas@example.org');
        await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
        await page.click('button:has-text("로그인")');
        
        await page.goto('/dashboard/users');
        
        // Verify only self is visible
        await expect(page.getByText('Regular User')).toBeVisible();
        await expect(page.getByText('Admin User')).not.toBeVisible();
        await expect(page.getByText('Prime User')).not.toBeVisible();
      });
    });

    test.describe('Assignee List Generation', () => {
      test('shows correct assignee options based on role', async ({ page }) => {
        const roleTests = [
          {
            role: 'Admin',
            email: 'meganlewis@example.com',
            canSee: ['Jeffrey Villanueva', 'Brian Hartman', 'Julie Johnson', 'James Hanson', 'Michelle Moreno DVM']
          },
          {
            role: 'PrimeUser',
            email: 'emma78@example.net',
            canSee: ['Michelle Moreno DVM', 'Julie Johnson', 'James Hanson']
          },
          {
            role: 'RegularUser',
            email: 'morrislucas@example.org',
            canSee: ['Julie Johnson']
          }
        ];

        for (const { role, email, canSee } of roleTests) {
        await page.goto('/');
        await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', email);
        await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
        await page.click('button:has-text("로그인")');
        
        await page.goto('/dashboard/tasks');
        await page.click('button:has-text("Create Task")');
        
        await page.getByLabel(/담당자 지정/i).click();
        
        for (const userName of canSee) {
        await expect(page.getByText(userName)).toBeVisible();
        }                         
          
        // Click user menu button and wait for dropdown
        await page.getByTestId('user-menu-button').click();
        await page.waitForSelector('[role="menuitem"]', { state: 'visible' });
        
        // Click logout with a more specific selector and force option
        await page.getByRole('menuitem', { name: 'Log out' }).click({ force: true });
        
        // Wait for and click confirm in dialog
        await page.waitForSelector('button[role="button"]', { state: 'visible' });
        await page.getByRole('button', { name: 'Log out' }).click();
        }
      });
    });
  });
}); 