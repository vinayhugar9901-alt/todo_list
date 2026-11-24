import { Task, TaskPriority, TaskStatus } from '../types';
import { getOffsetDate } from '../data/initialData';

export const STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
    dotColor: string;
  }
> = {
  pending: {
    label: 'Pending',
    textClass: 'text-[#B45309]',
    bgClass: 'bg-[#FEF3C7]',
    borderClass: 'border-[#FDE68A]',
    dotColor: '#F59E0B',
  },
  in_progress: {
    label: 'In Progress',
    textClass: 'text-[#1D4ED8]',
    bgClass: 'bg-[#DBEAFE]',
    borderClass: 'border-[#BFDBFE]',
    dotColor: '#2563EB',
  },
  completed: {
    label: 'Completed',
    textClass: 'text-[#15803D]',
    bgClass: 'bg-[#DCFCE7]',
    borderClass: 'border-[#BBF7D0]',
    dotColor: '#16A34A',
  },
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    weight: number;
    textClass: string;
    dotClass: string;
  }
> = {
  urgent: {
    label: 'Urgent',
    weight: 4,
    textClass: 'text-[#B91C1C]',
    dotClass: 'bg-[#DC2626]',
  },
  high: {
    label: 'High',
    weight: 3,
    textClass: 'text-[#C2410C]',
    dotClass: 'bg-[#EA580C]',
  },
  medium: {
    label: 'Medium',
    weight: 2,
    textClass: 'text-[#475569]',
    dotClass: 'bg-[#64748B]',
  },
  low: {
    label: 'Low',
    weight: 1,
    textClass: 'text-[#64748B]',
    dotClass: 'bg-[#94A3B8]',
  },
};

export function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isToday: boolean } {
  const today = getOffsetDate(0);
  const tomorrow = getOffsetDate(1);
  const yesterday = getOffsetDate(-1);

  if (dateStr === today) {
    return { label: 'Today', isOverdue: false, isToday: true };
  }
  if (dateStr === tomorrow) {
    return { label: 'Tomorrow', isOverdue: false, isToday: false };
  }
  if (dateStr === yesterday) {
    return { label: 'Yesterday', isOverdue: true, isToday: false };
  }

  const isOverdue = dateStr < today;
  const [year, month, day] = dateStr.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  const formatted = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return { label: formatted, isOverdue, isToday: false };
}

export function sortTasks(tasks: Task[], sortBy: 'priority' | 'dueDate'): Task[] {
  return [...tasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const diff = PRIORITY_CONFIG[b.priority].weight - PRIORITY_CONFIG[a.priority].weight;
      if (diff !== 0) return diff;
      return a.dueDate.localeCompare(b.dueDate);
    }
    const dateDiff = a.dueDate.localeCompare(b.dueDate);
    if (dateDiff !== 0) return dateDiff;
    return PRIORITY_CONFIG[b.priority].weight - PRIORITY_CONFIG[a.priority].weight;
  });
}

export function getNextStatus(current: TaskStatus): TaskStatus {
  if (current === 'pending') return 'in_progress';
  if (current === 'in_progress') return 'completed';
  return 'pending';
}
