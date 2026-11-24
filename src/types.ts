export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export type NavView = 'focus' | 'board' | 'upcoming' | 'projects';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description: string;
  targetDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  dueDate: string; // YYYY-MM-DD
  subtasks: Subtask[];
  createdAt: string;
  focusToday: boolean;
  estimatedMinutes?: number;
}
