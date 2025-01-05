import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { z } from 'zod';

// Basic validation schema
const baseValidationSchema = z.object({
  taskName: z.string(),
  taskType: z.enum(['물품구매', '택배요청']),
  dueDate: z.string(),
  assignee: z.string(),
  reporter: z.string(),
  status: z.enum(['Created', 'In Progress', 'Done', 'Delayed']),
  taskDescription: z.string(),
  completedAt: z.null()
});

const purchaseValidationSchema = baseValidationSchema.extend({
  taskType: z.literal('물품구매'),
  itemName: z.string(),
  quantity: z.number()
});

const deliveryValidationSchema = baseValidationSchema.extend({
  taskType: z.literal('택배요청'),
  recipientName: z.string(),
  recipientPhone: z.string(),
  recipientAddress: z.string()
});

const taskValidationSchema = z.discriminatedUnion('taskType', [
  purchaseValidationSchema,
  deliveryValidationSchema
]);

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/task_list.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const tasks = JSON.parse(fileContents);
    
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received task data:', body);
    
    const validatedTask = taskValidationSchema.parse(body);
    console.log('Validated task:', validatedTask);
    
    const filePath = path.join(process.cwd(), 'src/data/task_list.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const tasks = JSON.parse(fileContents);
    
    const newTask = {
      ...validatedTask,
      createdAt: new Date().toISOString(),
    };
    
    tasks.unshift(newTask);
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf8');
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid task data', 
          details: error.errors,
          received: await request.json()
        }, 
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create task', details: error }, 
      { status: 500 }
    );
  }
} 