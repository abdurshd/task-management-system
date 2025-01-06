import { test, expect } from '@playwright/test';

test.describe('UserList', () => {
  test.describe('Admin role', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'meganlewis@example.com');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/users');
    });

    test('renders all users and enables invite', async ({ page }) => {
      // Check for actual users from user_list.json
      await expect(page.getByText('Jeffrey Villanueva')).toBeVisible();
      await expect(page.getByText('Brian Hartman')).toBeVisible();
      await expect(page.getByText('Julie Johnson')).toBeVisible();
      await expect(page.getByText('James Hanson')).toBeVisible();
      
      const inviteButton = page.getByRole('button', { name: /Invite User/i });
      await expect(inviteButton).toBeEnabled();
    });
  });

  test.describe('RegularUser role', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'morrislucas@example.org');
      await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
      await page.click('button:has-text("로그인")');
      await page.waitForURL('/dashboard/users');
    });

    test('shows only own user information', async ({ page }) => {
      // Check for Julie Johnson's info (morrislucas@example.org)
      await expect(page.getByText('Julie Johnson')).toBeVisible();
      await expect(page.getByText('Jeffrey Villanueva')).not.toBeVisible();
      await expect(page.getByText('Michelle Moreno DVM')).not.toBeVisible();
    });
  });
}); 