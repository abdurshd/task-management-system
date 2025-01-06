import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set up admin state
  await page.goto('http://localhost:3000/');
  await page.fill('[placeholder="이메일 주소를 입력해 주세요."]', 'meganlewis@example.com');
  await page.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
  await page.click('button:has-text("로그인")');
  await page.context().storageState({ path: 'playwright/.auth/admin.json' });

  // Set up other roles
  const roleEmails = {
    PrimeUser: 'emma78@example.net',
    RegularUser: 'morrislucas@example.org',
    Viewer: 'nlynch@example.org'
  };

  for (const [role, email] of Object.entries(roleEmails)) {
    const rolePage = await browser.newPage();
    await rolePage.goto('http://localhost:3000/');
    await rolePage.fill('[placeholder="이메일 주소를 입력해 주세요."]', email);
    await rolePage.fill('[placeholder="비밀번호를 입력해 주세요."]', 'anyPassword123');
    await rolePage.click('button:has-text("로그인")');
    await rolePage.context().storageState({ path: `playwright/.auth/${role}.json` });
    await rolePage.close();
  }

  await browser.close();
}

export default globalSetup; 