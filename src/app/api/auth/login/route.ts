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
    
    const response = NextResponse.json(user);
    
    // Set the user cookie
    response.cookies.set({
      name: 'user',
      value: JSON.stringify(user),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'lax',
      path: '/'
    });
    
    return response;
  } catch (error: unknown) {
    // console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400 }
    );
  }
}