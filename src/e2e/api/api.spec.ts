import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  // Task API Tests
  test.describe('Task API', () => {
    test.describe('GET /api/tasks', () => {
      test('returns tasks for regular user', async ({ request, context }) => {
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

        const response = await request.get('/api/tasks');
        
        const tasks = await response.json();
        expect(Array.isArray(tasks)).toBeTruthy();
        
        // Verify at least one task exists for Julie Johnson
        expect(tasks.some((task: any) => 
          task.reporter === 'Julie Johnson' || task.assignee === 'Julie Johnson'
        )).toBeTruthy();
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
        
        const task = await response.json();
        expect(task.taskName).toBe('New Task');
      });
    });
  });

  // User API Tests
  test.describe('User API', () => {
    test.describe('GET /api/users', () => {
      test('returns users for admin', async ({ request, context }) => {
        const adminUser = {
          userName: "Megan Lewis",
          userEmail: "meganlewis@example.com",
          userRole: "Admin"
        };
        
        await context.addCookies([{
          name: 'user',
          value: JSON.stringify(adminUser),
          domain: 'localhost',
          path: '/'
        }]);

        const response = await request.get('/api/users');
        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);
        
        // Verify some known users exist
        const userNames = users.map((u: any) => u.userName);
        expect(userNames).toContain('Jeffrey Villanueva');
        expect(userNames).toContain('Julie Johnson');
      });

      test('returns users for regular user', async ({ request, context }) => {
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
        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        
        // Regular users should only see themselves
        expect(users.length).toBe(1);
        expect(users[0].userName).toBe('Julie Johnson');
      });
    });
  });
}); 