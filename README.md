# Task Management System

A role-based task management system built with Next.js 14, TypeScript, and shadcn/ui.

## Features

- Role-based access control (Admin, PrimeUser, RegularUser, Viewer)
- User authentication with email
- Task management with filtering and search capabilities
- Dynamic form rendering based on task type
- Responsive design with shadcn/ui components

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand (State Management)
- React Hook Form (Form Management)
- Zod (Form Validation)

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

4. Install required shadcn/ui components:

```bash
npx shadcn@latest add button card dialog form input table select toast
```

5. Create a `.env.local` file:

```bash
touch .env.local
```

6. Start the development server:
```bash
npm run dev
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

1. Invalid Email Test
   - Navigate to login page
   - Enter non-existing email
   - Verify error message display

2. Valid Login Test
   - Enter existing email
   - Verify successful login and correct dashboard routing

3. Field Validation Test
   - Leave email field empty
   - Verify login button remains disabled

4. Role-based Rendering Test
   - Login with admin account
   - Verify admin dashboard display

### User List Page

1. Role Filter Test
   - Login as admin
   - Apply PrimeUser filter
   - Verify filtered display

2. Dynamic Options Test
   - Verify dropdown only shows roles with users

3. User Search Test
   - Search for specific user
   - Verify search results

4. Access Control Test
   - Login as RegularUser
   - Verify limited view access

### Task List Page

1. Task Filter Test
   - Apply status filter
   - Verify filtered tasks

2. Role-based Visibility Test
   - Login as viewer
   - Verify only assigned tasks visible

3. Task Search Test
   - Search for specific task
   - Verify search results

4. Create Task Button Test
   - Verify button visibility based on role

### Task Creation

1. Role-based Access Test
   - Verify form access based on role

2. Field Validation Test
   - Submit form with empty fields
   - Verify validation behavior

3. Dynamic Fields Test
   - Select different task types
   - Verify form field updates

4. Assignee Role Check Test
   - Verify correct assignee options based on role


## API Routes

The application uses Next.js API routes to handle data:

- `/api/auth/login` - Handle user authentication
- `/api/users` - User management
- `/api/tasks` - Task management

## State Management

Using Zustand for state management with the following stores:

- AuthStore: Handles user authentication and role management
- TaskStore: Manages task list and operations
- UserStore: Manages user list and operations
