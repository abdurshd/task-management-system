import { NextResponse } from 'next/server';
import userList from '@/data/user_list.json';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const user = userList.find(user => user.userEmail.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 401 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400 }
    );
  }
}