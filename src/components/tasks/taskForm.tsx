import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskStore } from '@/lib/store/task-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectItem, SelectContent } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';


const baseSchema = z.object({
  taskName: z.string().min(1, 'Task name is required'),
  taskType: z.enum(['물품구매', '택배요청']),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  assignee: z.string().min(1, 'Assignee is required'),
});

const purchaseSchema = baseSchema.extend({
  taskType: z.literal('물품구매'),
  itemName: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const deliverySchema = baseSchema.extend({
  taskType: z.literal('택배요청'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientPhone: z.string().regex(/^\+82 010-\d{4}-\d{4}$/, 'Invalid phone format'),
  recipientAddress: z.string().min(1, 'Address is required'),
});

const taskSchema = z.discriminatedUnion('taskType', [
  purchaseSchema,
  deliverySchema,
]);

export function TaskForm() {
  const { user } = useAuthStore();
  const { createTask, isLoading } = useTaskStore();
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskType: '물품구매' as const,
      taskName: '',
      dueDate: '',
      assignee: '',
      itemName: '',
      quantity: 1,
      recipientName: '',
      recipientPhone: '+82 010-',
      recipientAddress: '',
    },
  });
  
  const taskType = form.watch('taskType');

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      await createTask({
        ...data,
        reporter: user!.userName,
        status: 'Created',
        taskDescription: `[${data.taskType}] ${data.taskName}`,
        completedAt: null
      });
      toast({ title: 'Task created successfully' });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({ 
        title: 'Failed to create task',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <TaskFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectContent>
                  <SelectItem value="물품구매">물품구매</SelectItem>
                  <SelectItem value="택배요청">택배요청</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Common Fields */}
        <FormField
          control={form.control}
          name="taskName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional Fields */}
        {taskType === '물품구매' ? (
          <>
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+82 010-0000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Task'}
        </Button>
      </form>
    </Form>
  );
}

function TaskFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-2/3" />
    </div>
  );
}