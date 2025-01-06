import { test, expect } from '@playwright/test';

test.describe('TaskList', () => {
  // Admin Role Tests
  test.describe('Admin role', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'meganlewis@example.com');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
    });

    test('renders all tasks for admin user', async ({ page }) => {
      // Check for tasks that exist in task_list.json
      await expect(page.getByText('Task 21')).toBeVisible();
      await expect(page.getByText('Task 74')).toBeVisible();
      await expect(page.getByRole('button', { name: /테스크 생성/i })).toBeEnabled();
    });

  });

  // PrimeUser Role Tests
  test.describe('PrimeUser role', () => {
    test.beforeEach(async ({ page }) => {
      // Login as prime user
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'emma78@example.net');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
    });

    test('renders all tasks for prime user', async ({ page }) => {
      await expect(page.getByText('Test Task 1')).toBeVisible();
      await expect(page.getByText('Test Task 2')).toBeVisible();
    });

    test('allows task creation', async ({ page }) => {
      const createButton = page.getByRole('button', { name: /테스크 생성/i });
      await expect(createButton).toBeEnabled();
    });
  });

  // RegularUser Role Tests
  test.describe('RegularUser role', () => {
    test.beforeEach(async ({ page }) => {
      // Login as regular user
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'morrislucas@example.org');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
    });

    test('shows only tasks created or assigned to the user', async ({ page }) => {
      // Julie Johnson's tasks from task_list.json
      await expect(page.getByText('Task 46')).toBeVisible(); // Assigned to Julie
      await expect(page.getByText('Task 56')).toBeVisible(); // Reported by Julie
      await expect(page.getByText('Task 74')).not.toBeVisible(); // Not related to Julie
    });
  });

  // Viewer Role Tests
  test.describe('Viewer role', () => {
    test.beforeEach(async ({ page }) => {
      // Login as viewer
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'nlynch@example.org');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
    });

    test('shows only assigned tasks', async ({ page }) => {
      // James Hanson's tasks from task_list.json
      await expect(page.getByText('Task 16')).not.toBeVisible(); // Not assigned to James
      await expect(page.getByText('Task 30')).not.toBeVisible(); // Not assigned to James
      await expect(page.getByText('Task 74')).not.toBeVisible(); // Not related to James
    });

    test('disables task creation', async ({ page }) => {
      const createButton = page.getByRole('button', { name: /테스크 생성/i });
      await expect(createButton).toBeDisabled();
    });
  });

  // Search and Filter Tests
  test.describe('Search and filter functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'eobrien@example.org');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
    });

    test('filters tasks by search term', async ({ page }) => {
      const searchInput = page.getByPlaceholder('Search');
      await searchInput.fill('Test Task 1');
      await expect(page.getByText('Test Task 1')).toBeVisible();
      await expect(page.getByText('Test Task 2')).not.toBeVisible();
    });

    test('changes search field', async ({ page }) => {
      const searchFieldSelect = page.getByRole('combobox');
      await searchFieldSelect.click();
      await page.getByText('담당자').click();
      
      // Verify the search field changed by checking if searching by reporter works
      const searchInput = page.getByPlaceholder('Search');
      await searchInput.fill('Admin User');
      await expect(page.getByText('Test Task 1')).toBeVisible();
    });
  });
}); 