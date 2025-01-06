import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'src/data/user_list.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(fileContents);

    // Get user from cookies
    const cookies = request.headers.get('cookie');
    const userCookie = cookies?.split(';').find(c => c.trim().startsWith('user='));
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filter users based on role
    let filteredUsers = users;
    if (user.userRole === 'RegularUser') {
      filteredUsers = users.filter((u: any) => u.userName === user.userName);
    } else if (user.userRole === 'Viewer') {
      filteredUsers = users.filter((u: any) => u.userName === user.userName);
    }

    return NextResponse.json(filteredUsers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
} 