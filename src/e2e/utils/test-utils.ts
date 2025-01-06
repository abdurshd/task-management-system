import { test as base, expect, Page } from '@playwright/test';

// Extend the base test with custom fixtures
export const test = base.extend({
  // Add a fixture for authenticated page
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/admin.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

// Custom expect matchers
export { expect };

// Helper functions
export const loginAs = async (page: Page, role: 'Admin' | 'PrimeUser' | 'RegularUser' | 'Viewer') => {
  const userEmails = {
    Admin: 'meganlewis@example.com',
    PrimeUser: 'emma78@example.net',
    RegularUser: 'morrislucas@example.org',
    Viewer: 'nlynch@example.org'
  };

  await page.goto('/');
  await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', userEmails[role]);
  await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
  await page.click('button:has-text("로그인")');
};

export const waitForToast = async (page: Page, message: string) => {
  await expect(page.getByText(message)).toBeVisible();
}; 