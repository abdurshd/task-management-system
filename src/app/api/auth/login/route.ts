import { NextResponse } from 'next/server';
import userList from '@/data/user_list.json';

export async function POST(request: Request) {
  const { email } = await request.json();
  
  const user = userList.find(user => user.userEmail === email);
  
  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid credentials' }),
      { status: 401 }
    );
  }
  
  return NextResponse.json(user);
}