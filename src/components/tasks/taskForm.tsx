import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTaskStore } from '@/lib/store/task-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUserStore } from '@/lib/store/user-store';
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
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { toast } from '@/hooks/use-toast';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { cn } from '@/lib/utils';
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useEffect, useState } from 'react';
import { TaskStatus } from '@/lib/types/task';


const baseSchema = z.object({
  taskName: z.string().min(1, '테스크 이름을 입력해주세요'),
  taskType: z.enum(['물품구매', '택배요청']),
  dueDate: z.string(),
  assignee: z.string().min(1, '담당자를 선택해주세요'),
  reporter: z.string(),
  taskDescription: z.string(),
  status: z.literal('Created'),
  completedAt: z.null()
});

const purchaseSchema = baseSchema.extend({
  taskType: z.literal('물품구매'),
  itemName: z.string().min(1, '물품명을 입력해주세요'),
  quantity: z.number().min(1, '물품 갯수를 입력해주세요'),
});

const deliverySchema = baseSchema.extend({
  taskType: z.literal('택배요청'),
  recipientName: z.string().min(1, '받는사람 이름을 입력해주세요'),
  recipientPhone: z.string().regex(/^\+8210-\d{4}-\d{4}$/, '전화번호 형식이 올바르지 않습니다. +8210-0000-0000 형식으로 입력해주세요.'),
  recipientAddress: z.string().min(1, '주소를 입력해주세요'),
});

const taskSchema = z.discriminatedUnion('taskType', [
  purchaseSchema,
  deliverySchema,
]);

export function TaskForm({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore();
  const { assignees, fetchUsers } = useUserStore();
  const { createTask, isLoading } = useTaskStore();
  const { handleError } = useErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      taskType: '물품구매' as const,
      taskName: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      assignee: '',
      reporter: user?.userName || '',
      status: 'Created' as const,
      taskDescription: '',
      completedAt: null,
      itemName: '',
      quantity: 1
    },
  });
  
  const taskType = form.watch('taskType');
  

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    try {
      setIsSubmitting(true);
      const baseTaskData = {
        taskName: data.taskName,
        taskType: data.taskType,
        dueDate: data.dueDate,
        assignee: data.assignee,
        reporter: user?.userName || '',
        status: 'Created' as const,
        taskDescription: `[${data.taskType}] ${data.taskName}`,
        completedAt: null
      };

      const taskData = data.taskType === '물품구매' 
        ? {
            ...baseTaskData,
            itemName: data.itemName,
            quantity: data.quantity
          }
        : {
            ...baseTaskData,
            recipientName: data.recipientName,
            recipientPhone: data.recipientPhone,
            recipientAddress: data.recipientAddress
          };

      await createTask(taskData);
      toast({ title: 'Task created successfully', variant: 'success' });
      form.reset();
      onClose();
    } catch (error) {
      toast({ 
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onClose();
  };

  if (isLoading) {
    return <TaskFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reporter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>생성자 (Reporter)</FormLabel>
              <FormControl>
                <Input {...field} disabled value={user?.userName || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taskName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="테스크 이름을 입력해주세요" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>담당자 지정</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="담당자를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignees.map((assignee) => (
                      <SelectItem 
                        key={assignee.userName} 
                        value={assignee.userName}
                      >
                        {assignee.userName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>테스크 유형</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="테스크 유형을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="물품구매">물품구매</SelectItem>
                  <SelectItem value="택배요청">택배요청</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {taskType === '물품구매' ? (
          <>
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>물품명</FormLabel>
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
                  <FormLabel>물품 갯수</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                      placeholder="물품 갯수를 입력해주세요"
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
                  <FormLabel>받는사람 이름</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="받는사람 이름을 입력해주세요" />
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
                  <FormLabel>받는사람 전화번호</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="+8210-0000-0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>받는사람 주소</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>날짜를 선택해주세요</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-auto p-0" 
                    align="start"
                    side="bottom" 
                    sideOffset={4}
                    avoidCollisions={true}
                  >
                    <Calendar 
                      {...field}
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const koreanDateString = format(date, 'yyyy-MM-dd');
                          field.onChange(koreanDateString);
                        }
                      }}
                      mode="single"
                      initialFocus
                      className="p-2"
                      locale={ko}
                      fromDate={new Date(2025, 0, 1)}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant={'outline'} onClick={handleCancel}>
            {'Cancel'}
          </Button>
          <Button type="submit" disabled={isLoading || isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
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