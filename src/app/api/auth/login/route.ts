import { NextResponse } from 'next/server';
import userList from '@/data/user_list.json';
import { cookies } from 'next/headers';

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
    
    
    response.cookies.set({
      name: 'user',
      value: JSON.stringify(user),
      httpOnly: false, 
      secure: false,   
      sameSite: 'lax',
      path: '/',
      maxAge: 7200
    });
    
    return response;
  } catch (error: unknown) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400 }
    );
  }
}