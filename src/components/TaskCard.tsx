import React from 'react';
import {
  Check,
  Calendar,
  AlertCircle,
  ChevronRight,
  Clock,
  CheckSquare,
  ArrowRightCircle,
} from 'lucide-react';
import { Project, Task, TaskStatus } from '../types';
import {
  formatDueDate,
  getNextStatus,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from '../utils/taskHelpers';

interface TaskCardProps {
  task: Task;
  project?: Project;
  isSelected: boolean;
  onToggleComplete: (taskId: string) => void;
  onCycleStatus: (taskId: string, nextStatus: TaskStatus) => void;
  onSelect: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  project,
  isSelected,
  onToggleComplete,
  onCycleStatus,
  onSelect,
}) => {
  const isCompleted = task.status === 'completed';
  const dueInfo = formatDueDate(task.dueDate);
  const priorityInfo = PRIORITY_CONFIG[task.priority];
  const statusInfo = STATUS_CONFIG[task.status];
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  return (
    <div
      className={`group bg-white rounded-2xl border p-4 transition-all duration-150 ${
        isSelected
          ? 'border-[#4F46E5] ring-1 ring-[#4F46E5] shadow-[0_4px_12px_rgba(79,70,229,0.08)]'
          : 'border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(15,23,42,0.05),0_1px_2px_-1px_rgba(15,23,42,0.05)] hover:border-[#CBD5E1] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07),0_2px_4px_-2px_rgba(15,23,42,0.05)]'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Tactile rounded-full checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task.id);
          }}
          aria-label={isCompleted ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] active:scale-90 ${
            isCompleted
              ? 'bg-[#16A34A] border-[#16A34A] text-white animate-check-snap'
              : 'bg-white border-[#CBD5E1] hover:border-[#4F46E5] text-transparent'
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[2.75]" />
        </button>

        {/* Main Content — clickable to open Inspector */}
        <button
          type="button"
          onClick={() => onSelect(task.id)}
          className="flex-1 min-w-0 text-left cursor-pointer focus-visible:outline-none"
        >
          <p
            className={`text-[15px] font-semibold leading-snug transition-colors duration-150 ${
              isCompleted ? 'line-through text-[#64748B]' : 'text-[#1E293B] group-hover:text-[#0F172A]'
            }`}
          >
            {task.title}
          </p>

          {/* Clean unboxed metadata row with typographic separators */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#64748B]">
            {project && (
              <span className="inline-flex items-center gap-1.5 font-medium text-[#475569]">
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />
                {project.name}
              </span>
            )}

            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>

            <span
              className={`inline-flex items-center gap-1 tabular-nums font-medium ${
                dueInfo.isOverdue && !isCompleted
                  ? 'text-[#DC2626]'
                  : dueInfo.isToday && !isCompleted
                  ? 'text-[#3525CD]'
                  : 'text-[#64748B]'
              }`}
            >
              {dueInfo.isOverdue && !isCompleted ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Calendar className="w-3.5 h-3.5 shrink-0" />
              )}
              {dueInfo.isOverdue && !isCompleted ? `Overdue (${dueInfo.label})` : dueInfo.label}
            </span>

            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>

            <span className={`inline-flex items-center gap-1 font-medium ${priorityInfo.textClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotClass}`} aria-hidden="true" />
              {priorityInfo.label} priority
            </span>

            {task.subtasks.length > 0 && (
              <>
                <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <CheckSquare className="w-3.5 h-3.5" />
                  {completedSubtasks}/{task.subtasks.length} subtasks
                </span>
              </>
            )}

            {task.estimatedMinutes && (
              <>
                <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <Clock className="w-3.5 h-3.5" />
                  {task.estimatedMinutes}m
                </span>
              </>
            )}
          </div>
        </button>

        {/* Right Interactive Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Functional Status Action Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCycleStatus(task.id, getNextStatus(task.status));
            }}
            title={`Status: ${statusInfo.label} (click to advance)`}
            className={`hidden sm:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border text-xs font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${statusInfo.bgClass} ${statusInfo.textClass} ${statusInfo.borderClass} hover:opacity-90`}
          >
            <ArrowRightCircle className="w-3.5 h-3.5" />
            <span>{statusInfo.label}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelect(task.id)}
            aria-label={`Inspect "${task.title}"`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] group-hover:text-[#475569] hover:bg-[#F1F5F9] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
