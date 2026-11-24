import React, { useState } from 'react';
import {
  Plus,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Inbox,
} from 'lucide-react';
import { Project, Task, TaskPriority, TaskStatus } from '../types';
import { getOffsetDate } from '../data/initialData';
import { sortTasks } from '../utils/taskHelpers';
import { TaskCard } from './TaskCard';

interface FocusViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  searchQuery: string;
  onToggleComplete: (taskId: string) => void;
  onCycleStatus: (taskId: string, nextStatus: TaskStatus) => void;
  onSelectTask: (taskId: string) => void;
  onQuickAddTask: (input: {
    title: string;
    projectId: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    focusToday: boolean;
  }) => void;
  onClearFilters: () => void;
}

type StatusFilter = 'all' | TaskStatus;

export const FocusView: React.FC<FocusViewProps> = ({
  tasks,
  projects,
  selectedProjectId,
  selectedTaskId,
  searchQuery,
  onToggleComplete,
  onCycleStatus,
  onSelectTask,
  onQuickAddTask,
  onClearFilters,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate'>('priority');
  const [showCompletedSection, setShowCompletedSection] = useState(true);

  // Quick capture state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProjectId, setQuickProjectId] = useState(
    selectedProjectId || projects[0]?.id || 'proj-platform'
  );
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('medium');

  const todayDate = getOffsetDate(0);
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Base scope: if project selected or search active, show matching tasks; otherwise show focusToday or due today/overdue
  const scopedTasks = tasks.filter((task) => {
    if (selectedProjectId && task.projectId !== selectedProjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q)
      );
    }
    if (selectedProjectId) return true;
    return task.focusToday || task.dueDate <= todayDate;
  });

  const totalCount = scopedTasks.length;
  const completedCount = scopedTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = scopedTasks.filter((t) => t.status === 'in_progress').length;
  const pendingCount = scopedTasks.filter((t) => t.status === 'pending').length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = sortTasks(
    scopedTasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      return true;
    }),
    sortBy
  );

  const activeTasks = filteredTasks.filter((t) => t.status !== 'completed');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) return;
    onQuickAddTask({
      title: trimmed,
      projectId: selectedProjectId || quickProjectId,
      priority: quickPriority,
      status: 'pending',
      dueDate: todayDate,
      focusToday: true,
    });
    setQuickTitle('');
  };

  return (
    <div className="max-w-[1040px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header & Progress Summary */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div>
          <p className="text-xs font-semibold text-[#64748B] tracking-[0.02em]">
            {formattedToday}
          </p>
          <h2 className="mt-1 text-2xl md:text-[28px] font-bold tracking-[-0.02em] text-[#0F172A] text-balance">
            {selectedProjectId
              ? projectMap.get(selectedProjectId)?.name || 'Project Focus'
              : "Today's Execution Queue"}
          </h2>
        </div>

        {/* Clean inline tabular progress metrics */}
        <div className="flex flex-col sm:items-end gap-2 min-w-[240px]">
          <div className="flex items-center gap-4 text-xs text-[#475569] tabular-nums">
            <span>
              <strong className="font-bold text-[#0F172A]">{pendingCount}</strong> pending
            </span>
            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
            <span>
              <strong className="font-bold text-[#2563EB]">{inProgressCount}</strong> in progress
            </span>
            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
            <span>
              <strong className="font-bold text-[#16A34A]">{completedCount}/{totalCount}</strong> done
            </span>
          </div>
          <div className="w-full sm:w-64 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#16A34A] rounded-full transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      </section>

      {/* Quick Inline Capture */}
      <form
        onSubmit={handleQuickSubmit}
        className="bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] focus-within:ring-2 focus-within:ring-[#4F46E5] focus-within:border-[#4F46E5] transition-all duration-150"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <div className="flex items-center gap-2.5 flex-1 min-w-0 px-1">
            <Plus className="w-5 h-5 text-[#4F46E5] shrink-0" />
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Capture a priority task for today..."
              aria-label="Capture a priority task for today"
              className="w-full py-1.5 text-sm md:text-[15px] text-[#0F172A] placeholder:text-[#64748B] bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              {!selectedProjectId && (
                <select
                  value={quickProjectId}
                  onChange={(e) => setQuickProjectId(e.target.value)}
                  aria-label="Select project"
                  className="h-8 px-2.5 text-xs font-medium text-[#334155] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#4F46E5] cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
                aria-label="Select priority"
                className="h-8 px-2.5 text-xs font-medium text-[#334155] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#4F46E5] cursor-pointer"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!quickTitle.trim()}
              className="h-8 px-3.5 bg-[#4F46E5] hover:bg-[#3525CD] disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Add Task
            </button>
          </div>
        </div>
      </form>

      {/* Interactive Filter & Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Filter tasks by status"
          className="inline-flex items-center gap-1 p-1 bg-[#E2E8F0]/60 rounded-lg"
        >
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
            ] as const
          ).map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}
            aria-label="Filter by priority"
            className="h-9 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            type="button"
            onClick={() => setSortBy((prev) => (prev === 'priority' ? 'dueDate' : 'priority'))}
            className="h-9 px-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#334155] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Sort: {sortBy === 'priority' ? 'Priority' : 'Due Date'}</span>
          </button>
        </div>
      </div>

      {/* Task Stream */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center">
          <div className="w-11 h-11 rounded-full bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[#0F172A]">
            No tasks match this view
          </h3>
          <p className="mt-1 text-sm text-[#64748B] max-w-md mx-auto">
            Add a task above to schedule work for today, or reset your active filters to inspect the full queue.
          </p>
          {(statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery || selectedProjectId) && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setPriorityFilter('all');
                onClearFilters();
              }}
              className="mt-4 h-9 px-4 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#1E293B] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Tasks */}
          {statusFilter !== 'completed' && activeTasks.length > 0 && (
            <div className="space-y-2.5">
              {activeTasks.map((task) => (
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
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCompletedSection((prev) => !prev)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] mb-3 cursor-pointer"
              >
                {showCompletedSection ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Completed</span>
                <span className="tabular-nums text-[#94A3B8]">({completedTasks.length})</span>
              </button>

              {showCompletedSection && (
                <div className="space-y-2.5">
                  {completedTasks.map((task) => (
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
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
