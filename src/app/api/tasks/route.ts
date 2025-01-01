import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/task_list.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const tasks = JSON.parse(fileContents);
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error reading tasks:', error);
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 });
  }
} 