import React from 'react';
import { CalendarDays, AlertCircle } from 'lucide-react';
import { Project, Task, TaskStatus } from '../types';
import { getOffsetDate } from '../data/initialData';
import { sortTasks } from '../utils/taskHelpers';
import { TaskCard } from './TaskCard';

interface UpcomingViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  searchQuery: string;
  onToggleComplete: (taskId: string) => void;
  onCycleStatus: (taskId: string, nextStatus: TaskStatus) => void;
  onSelectTask: (taskId: string) => void;
  onOpenNewTask: () => void;
}

export const UpcomingView: React.FC<UpcomingViewProps> = ({
  tasks,
  projects,
  selectedProjectId,
  selectedTaskId,
  searchQuery,
  onToggleComplete,
  onCycleStatus,
  onSelectTask,
  onOpenNewTask,
}) => {
  const today = getOffsetDate(0);
  const tomorrow = getOffsetDate(1);
  const nextWeek = getOffsetDate(7);

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const filtered = sortTasks(
    tasks.filter((t) => {
      if (selectedProjectId && t.projectId !== selectedProjectId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        );
      }
      return true;
    }),
    'dueDate'
  );

  const overdue = filtered.filter((t) => t.dueDate < today && t.status !== 'completed');
  const dueToday = filtered.filter((t) => t.dueDate === today);
  const dueTomorrow = filtered.filter((t) => t.dueDate === tomorrow);
  const dueThisWeek = filtered.filter((t) => t.dueDate > tomorrow && t.dueDate <= nextWeek);
  const dueLater = filtered.filter((t) => t.dueDate > nextWeek);

  const buckets: {
    id: string;
    label: string;
    subtitle: string;
    items: Task[];
    isOverdue?: boolean;
  }[] = [
    {
      id: 'overdue',
      label: 'Overdue',
      subtitle: 'Requires immediate attention',
      items: overdue,
      isOverdue: true,
    },
    {
      id: 'today',
      label: 'Today',
      subtitle: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      items: dueToday,
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      subtitle: 'Next day queue',
      items: dueTomorrow,
    },
    {
      id: 'week',
      label: 'Next 7 Days',
      subtitle: 'Upcoming sprint horizon',
      items: dueThisWeek,
    },
    {
      id: 'later',
      label: 'Later',
      subtitle: 'Scheduled beyond this week',
      items: dueLater,
    },
  ].filter((b) => b.items.length > 0);

  return (
    <div className="max-w-[1040px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      <div className="flex items-end justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Upcoming Schedule
          </h2>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Chronological timeline across overdue, current, and upcoming milestones.
          </p>
        </div>
        <span className="text-xs font-semibold text-[#64748B] tabular-nums">
          {filtered.filter((t) => t.status !== 'completed').length} scheduled
        </span>
      </div>

      {buckets.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
          <div className="w-11 h-11 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-3">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#0F172A]">Schedule is clear</h3>
          <p className="mt-1 text-sm text-[#64748B]">
            No upcoming tasks match your current filters.
          </p>
          <button
            type="button"
            onClick={onOpenNewTask}
            className="mt-4 h-9 px-4 bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Schedule Task
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {buckets.map((bucket) => (
            <section key={bucket.id} className="space-y-3">
              <div className="flex items-baseline justify-between border-b border-[#E2E8F0] pb-2">
                <div className="flex items-center gap-2">
                  {bucket.isOverdue && (
                    <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                  )}
                  <h3
                    className={`text-sm font-bold ${
                      bucket.isOverdue ? 'text-[#DC2626]' : 'text-[#0F172A]'
                    }`}
                  >
                    {bucket.label}
                  </h3>
                  <span className="text-xs text-[#64748B]">· {bucket.subtitle}</span>
                </div>
                <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                  {bucket.items.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {bucket.items.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projectMap.get(task.projectId)}
                    isSelected={selectedTaskId === task.id}
                    onToggleComplete={onToggleComplete}
                    onCycleStatus={onCycleStatus}
                    onSelect={onSelectTask}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
