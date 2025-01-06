import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  // Task API Tests
  test.describe('Task API', () => {
    test.describe('GET /api/tasks', () => {
      test('returns all tasks for admin', async ({ request, context }) => {
        const adminUser = {
          userName: "Jeffrey Villanueva",
          userEmail: "eobrien@example.org",
          userRole: "Admin"
        };
        
        // Set cookie before request
        await context.addCookies([{
          name: 'user',
          value: JSON.stringify(adminUser),
          domain: 'localhost',
          path: '/'
        }]);

        const response = await request.get('/api/tasks');
        
        expect(response.ok()).toBeTruthy();
        const tasks = await response.json();
        expect(Array.isArray(tasks)).toBeTruthy();
        expect(tasks.length).toBeGreaterThan(0);
      });
    });

    test.describe('POST /api/tasks', () => {
      test('successfully creates task', async ({ request }) => {
        const response = await request.post('/api/tasks', {
          data: {
            taskName: 'New Task',
            taskType: '물품구매',
            dueDate: new Date().toISOString(),
            assignee: 'John Doe',
            reporter: 'Jane Smith',
            status: 'Created',
            taskDescription: 'Test task description',
            completedAt: null,
            itemName: 'Test Item',
            quantity: 1
          }
        });
        
        expect(response.ok()).toBeTruthy();
        const task = await response.json();
        expect(task.taskName).toBe('New Task');
      });
    });
  });

  // User API Tests
  test.describe('User API', () => {
    test.describe('GET /api/users', () => {
      test('returns all users for admin', async ({ request, context }) => {
        const adminUser = {
          userName: "Jeffrey Villanueva",
          userEmail: "eobrien@example.org",
          userRole: "Admin"
        };
        
        await context.addCookies([{
          name: 'user',
          value: JSON.stringify(adminUser),
          domain: 'localhost',
          path: '/'
        }]);

        const response = await request.get('/api/users');
        
        expect(response.ok()).toBeTruthy();
        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);
      });

      test('returns only self for regular user', async ({ request, context }) => {
        const regularUser = {
          userName: "Julie Johnson",
          userEmail: "morrislucas@example.org",
          userRole: "RegularUser"
        };
        
        await context.addCookies([{
          name: 'user',
          value: JSON.stringify(regularUser),
          domain: 'localhost',
          path: '/'
        }]);

        const response = await request.get('/api/users');
        
        expect(response.ok()).toBeTruthy();
        const users = await response.json();
        expect(users.length).toBe(1);
        expect(users[0].userName).toBe('Julie Johnson');
      });
    });
  });
}); 