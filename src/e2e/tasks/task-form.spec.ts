import { test, expect } from '@playwright/test';

test.describe('TaskForm', () => {
  test.describe('Admin role', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'meganlewis@example.com');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
      await page.getByRole('button', { name: /Create Task/i }).click();
    });

    test('can assign tasks to any user', async ({ page }) => {
      const assigneeSelect = page.getByLabel(/담당자 지정/i);
      await assigneeSelect.click();
      
      // Check if all user types are available
      await expect(page.getByText('Brian Hartman')).toBeVisible();
      await expect(page.getByText('Michelle Moreno DVM')).toBeVisible();
      await expect(page.getByText('Julie Johnson')).toBeVisible();
      await expect(page.getByText('James Hanson')).toBeVisible();
    });

    test('can create purchase task type', async ({ page }) => {
      // Select purchase task type
      await page.getByLabel(/Task Type/i).click();
      await page.getByText('물품구매').click();
      
      // Fill purchase-specific fields
      await page.getByLabel(/물품명/i).fill('Test Item');
      await page.getByLabel(/물품 갯수/i).fill('5');
      
      // Verify fields are visible
      await expect(page.getByLabel(/물품명/i)).toBeVisible();
      await expect(page.getByLabel(/물품 갯수/i)).toBeVisible();
    });

    test('can create delivery task type', async ({ page }) => {
      // Select delivery task type
      await page.getByLabel(/Task Type/i).click();
      await page.getByText('택배요청').click();
      
      // Fill delivery-specific fields
      await page.getByLabel(/받는사람 이름/i).fill('Test Recipient');
      await page.getByLabel(/받는사람 전화번호/i).fill('+8210-1234-5678');
      await page.getByLabel(/받는사람 주소/i).fill('서울시 강남구 테헤란로 123');
      
      // Verify fields are visible
      await expect(page.getByLabel(/받는사람 이름/i)).toBeVisible();
      await expect(page.getByLabel(/받는사람 전화번호/i)).toBeVisible();
      await expect(page.getByLabel(/받는사람 주소/i)).toBeVisible();
    });
  });

  test.describe('PrimeUser role', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'emma78@example.net');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
      await page.getByRole('button', { name: /Create Task/i }).click();
    });

    test('can assign tasks to non-admin users', async ({ page }) => {
      const assigneeSelect = page.getByLabel(/담당자 지정/i);
      await assigneeSelect.click();
      
      // Check correct user visibility
      await expect(page.getByText('Michelle Moreno DVM')).toBeVisible();
      await expect(page.getByText('Julie Johnson')).toBeVisible();
      await expect(page.getByText('James Hanson')).toBeVisible();
      await expect(page.getByText('Brian Hartman')).not.toBeVisible();
    });
  });

  test.describe('RegularUser role', () => {
    test.beforeEach(async ({ page }) => {
      // Increase timeout for this specific hook
      test.slow();
      
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'morrislucas@example.org');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      
      // Wait for navigation to complete
      await page.waitForURL('/dashboard/tasks', { waitUntil: 'networkidle' });
      
      // Wait for the create task button to be visible before clicking
      await page.waitForSelector('button:has-text("Create Task")', { state: 'visible' });
      await page.getByRole('button', { name: /Create Task/i }).click();
      
      // Wait for the form dialog to be visible
      await page.waitForSelector('form', { state: 'visible' });
    });

    test('can only assign tasks to self', async ({ page }) => {
      const assigneeSelect = page.getByLabel(/담당자 지정/i);
      await assigneeSelect.click();
      
      // Check only Julie Johnson (self) is visible
      await expect(page.getByText('Julie Johnson')).toBeVisible();
      await expect(page.getByText('Jeffrey Villanueva')).not.toBeVisible();
      await expect(page.getByText('Michelle Moreno DVM')).not.toBeVisible();
    });

    test('reporter field is automatically set to self', async ({ page }) => {
      const reporterField = page.getByLabel(/담당자 지정/i);
      await expect(reporterField).toHaveValue('Julie Johnson');
      await expect(reporterField).toBeDisabled();
    });

    test('validates required fields', async ({ page }) => {
      // Try to submit empty form
      await page.click('button:has-text("Create")');
      
      // Check for validation messages
      await expect(page.getByText(/테스크 이름을 입력해주세요/i)).toBeVisible();
      await expect(page.getByText(/테스크 유형을 선택해주세요/i)).toBeVisible();
    });
  });

  // Form Validation Tests
  test.describe('Form validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'eobrien@example.org');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/tasks');
      await page.getByRole('button', { name: /Create Task/i }).click();
    });

    test('validates phone number format', async ({ page }) => {
      // Select delivery task type
      await page.getByLabel(/Task Type/i).click();
      await page.getByText('택배요청').click();
      
      // Enter invalid phone number
      await page.getByLabel(/받는사람 전화번호/i).fill('invalid-phone');
      
      // Check for validation message
      await expect(page.getByText(/전화번호 형식이 올바르지 않습니다./i)).toBeVisible();
    });

    test('validates address format', async ({ page }) => {
      // Select delivery task type
      await page.getByLabel(/Task Type/i).click();
      await page.getByText('택배요청').click();
      
      // Enter invalid address
      await page.getByLabel(/받는사람 주소/i).fill('invalid address');
      
      // Check for validation message
      await expect(page.getByText(/주소 형태가 아닙니다./i)).toBeVisible();
    });
  });
}); 