# Task Management System

A role-based task management system built with Next.js 15, TypeScript, and shadcn/ui.

## Features

- Role-based access control (Admin, PrimeUser, RegularUser, Viewer)
- User authentication via email
- Task management with filtering and search capabilities
- Dynamic form rendering based on task types
- Responsive design using shadcn/ui components

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand (State Management)
- React Hook Form (Form Management)
- Zod (Form Validation)
- Playwright (E2E Testing)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/abdurshd/task-management-system.git
cd task-management-system
```

2. Install dependencies:

```bash
npm install
```

3. Install shadcn/ui components:

```bash
npx shadcn@latest init
```

4. Add the required shadcn/ui components:

```bash
npx shadcn@latest add button card dialog form input table select toast
```

5. Create the `.env.local` file:

```bash
touch .env.local
```

6. Start the development server:

```bash
npm run dev
```

To run tests, ensure that the Playwright browser is installed. While tests automatically install the required browser, you can install it manually to save time:

```sh
cd frontend
npx playwright install
```

Run E2E tests:

```sh
cd frontend
npm run test
npm run test:ui # Displays UI during test execution
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── dashboard/
│   │   ├── tasks/
│   │   └── users/
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── tasks/
│   ├── users/
│   └── ui/
├── lib/
│   ├── store/
│   ├── types/
│   ├── utils/
│   └── validations/
└── data/
    ├── task_list.json
    └── user_list.json
```

## Test Cases

### Login Page

1. **Invalid Email Test**
   - Navigate to the login page.
   - Enter a non-existent email.
   - Verify that an error message is displayed.

2. **Valid Login Test**
   - Enter an existing email.
   - Verify successful login and correct dashboard routing.

3. **Field Validation Test**
   - Leave the email field empty.
   - Verify that the login button is disabled.

4. **Role-Based Rendering Test**
   - Log in with an Admin account.
   - Verify that the Admin dashboard is displayed.

### User List Page

1. **Role Filter Test**
   - Log in with an Admin account.
   - Apply the PrimeUser filter.
   - Verify that the filtered results are displayed correctly.

2. **Dynamic Options Test**
   - Verify that the dropdown shows roles only for existing users.

3. **User Search Test**
   - Search for a specific user.
   - Verify that the search results are accurate.

4. **Access Control Test**
   - Log in as a RegularUser.
   - Verify that only restricted views are accessible.

### Task List Page

1. **Task Filter Test**
   - Apply a status filter.
   - Verify that the filtered tasks are displayed correctly.

2. **Role-Based Visibility Test**
   - Log in as a Viewer.
   - Verify that only assigned tasks are visible.

3. **Task Search Test**
   - Search for a specific task.
   - Verify that the search results are accurate.

4. **Task Creation Button Test**
   - Verify button visibility based on roles.

### Task Creation

1. **Role-Based Access Test**
   - Verify form access based on roles.

2. **Field Validation Test**
   - Submit the form with empty fields.
   - Verify that validation errors are shown correctly.

3. **Dynamic Fields Test**
   - Select different task types.
   - Verify that the form fields update correctly.

4. **Assignment Role Verification Test**
   - Verify that the correct assignment options are shown based on roles.

## Running Tests

1. Install an E2E testing tool like Cypress:

```bash
npm install cypress
```

2. Launch Cypress to run tests:

```bash
npx cypress open
```

3. Select the desired test file in the Cypress UI to execute.

4. Verify that all test cases pass successfully.

## API Routes

The application uses Next.js API routes for data handling:

- `/api/auth/login` - Handles user authentication
- `/api/users` - Manages users
- `/api/tasks` - Manages tasks

## State Management

Zustand is used to manage the following state stores:

- **AuthStore**: Handles user authentication and roles
- **TaskStore**: Manages task lists and operations
- **UserStore**: Manages user lists and operations

