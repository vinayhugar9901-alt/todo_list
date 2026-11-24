import React, { useState } from 'react';
import {
  Check,
  Plus,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  AlertCircle,
} from 'lucide-react';
import { Project, Task, TaskPriority, TaskStatus } from '../types';
import { getOffsetDate } from '../data/initialData';
import { formatDueDate, PRIORITY_CONFIG, STATUS_CONFIG, sortTasks } from '../utils/taskHelpers';

interface BoardViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string | null;
  selectedTaskId: string | null;
  searchQuery: string;
  onSelectProject: (projectId: string | null) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onSelectTask: (taskId: string) => void;
  onQuickAddTask: (input: {
    title: string;
    projectId: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    focusToday: boolean;
  }) => void;
}

const COLUMNS: { status: TaskStatus; title: string; accent: string }[] = [
  { status: 'pending', title: 'Pending', accent: '#F59E0B' },
  { status: 'in_progress', title: 'In Progress', accent: '#2563EB' },
  { status: 'completed', title: 'Completed', accent: '#16A34A' },
];

export const BoardView: React.FC<BoardViewProps> = ({
  tasks,
  projects,
  selectedProjectId,
  selectedTaskId,
  searchQuery,
  onSelectProject,
  onToggleComplete,
  onUpdateStatus,
  onSelectTask,
  onQuickAddTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [columnInputs, setColumnInputs] = useState<Record<TaskStatus, string>>({
    pending: '',
    in_progress: '',
    completed: '',
  });
  const [addingColumn, setAddingColumn] = useState<TaskStatus | null>(null);

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const visibleTasks = tasks.filter((t) => {
    if (selectedProjectId && t.projectId !== selectedProjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleColumnAdd = (status: TaskStatus, e: React.FormEvent) => {
    e.preventDefault();
    const title = columnInputs[status].trim();
    if (!title) return;
    onQuickAddTask({
      title,
      projectId: selectedProjectId || projects[0]?.id || 'proj-platform',
      priority: 'medium',
      status,
      dueDate: getOffsetDate(0),
      focusToday: true,
    });
    setColumnInputs((prev) => ({ ...prev, [status]: '' }));
    setAddingColumn(null);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      {/* Header & Project Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Workflow Board
          </h2>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Drag tasks across columns or advance workflow status directly.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => onSelectProject(null)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedProjectId === null
                ? 'bg-[#0F172A] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            All Projects
          </button>
          {projects.map((proj) => {
            const active = selectedProjectId === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => onSelectProject(active ? null : proj.id)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#EEF2FF] text-[#3525CD] border border-[#C7D2FE]'
                    : 'bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: proj.color }}
                />
                <span>{proj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Workflow Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((col, colIndex) => {
          const colTasks = sortTasks(
            visibleTasks.filter((t) => t.status === col.status),
            'priority'
          );
          const statusMeta = STATUS_CONFIG[col.status];
          const isDropTarget = dragOverColumn === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(col.status);
              }}
              onDragLeave={() => {
                if (dragOverColumn === col.status) setDragOverColumn(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedTaskId) {
                  onUpdateStatus(draggedTaskId, col.status);
                }
                setDraggedTaskId(null);
                setDragOverColumn(null);
              }}
              className={`rounded-2xl p-3.5 transition-colors duration-150 border ${
                isDropTarget
                  ? 'bg-[#EEF2FF]/70 border-[#4F46E5]'
                  : 'bg-[#EFF4FF]/70 border-[#E2E8F0]'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: col.accent }}
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-bold text-[#0F172A]">{col.title}</h3>
                  <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAddingColumn((prev) => (prev === col.status ? null : col.status))
                  }
                  aria-label={`Add task to ${col.title}`}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Inline Column Add */}
              {addingColumn === col.status && (
                <form onSubmit={(e) => handleColumnAdd(col.status, e)} className="mb-3">
                  <div className="bg-white border border-[#4F46E5] rounded-xl p-2.5 shadow-xs space-y-2">
                    <input
                      type="text"
                      autoFocus
                      value={columnInputs[col.status]}
                      onChange={(e) =>
                        setColumnInputs((prev) => ({
                          ...prev,
                          [col.status]: e.target.value,
                        }))
                      }
                      placeholder={`New ${statusMeta.label.toLowerCase()} task...`}
                      className="w-full text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAddingColumn(null)}
                        className="px-2.5 py-1 text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#4F46E5] text-white text-xs font-semibold rounded-md hover:bg-[#3525CD] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Column Cards */}
              <div className="space-y-2.5 min-h-[140px]">
                {colTasks.length === 0 ? (
                  <div className="border border-dashed border-[#CBD5E1] rounded-xl py-8 px-4 text-center">
                    <p className="text-xs font-medium text-[#64748B]">
                      No {col.title.toLowerCase()} tasks
                    </p>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const proj = projectMap.get(task.projectId);
                    const dueInfo = formatDueDate(task.dueDate);
                    const priorityInfo = PRIORITY_CONFIG[task.priority];
                    const isCompleted = task.status === 'completed';
                    const doneSubtasks = task.subtasks.filter((s) => s.completed).length;

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTaskId(task.id)}
                        onDragEnd={() => {
                          setDraggedTaskId(null);
                          setDragOverColumn(null);
                        }}
                        className={`group bg-white rounded-xl border p-3.5 transition-all duration-150 cursor-grab active:cursor-grabbing ${
                          selectedTaskId === task.id
                            ? 'border-[#4F46E5] ring-1 ring-[#4F46E5]'
                            : 'border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] hover:border-[#CBD5E1] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(task.id);
                            }}
                            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer active:scale-90 ${
                              isCompleted
                                ? 'bg-[#16A34A] border-[#16A34A] text-white'
                                : 'bg-white border-[#CBD5E1] hover:border-[#4F46E5] text-transparent'
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.75]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectTask(task.id)}
                            className="flex-1 min-w-0 text-left cursor-pointer"
                          >
                            <p
                              className={`text-sm font-semibold leading-snug ${
                                isCompleted ? 'line-through text-[#64748B]' : 'text-[#1E293B]'
                              }`}
                            >
                              {task.title}
                            </p>
                          </button>
                        </div>

                        {/* Unboxed Metadata */}
                        <div className="mt-2.5 pl-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#64748B]">
                          {proj && (
                            <span className="inline-flex items-center gap-1 font-medium text-[#475569]">
                              <span
                                className="w-1.5 h-1.5 rounded-xs"
                                style={{ backgroundColor: proj.color }}
                              />
                              {proj.name}
                            </span>
                          )}
                          <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                          <span
                            className={`inline-flex items-center gap-1 tabular-nums ${
                              dueInfo.isOverdue && !isCompleted ? 'text-[#DC2626] font-medium' : ''
                            }`}
                          >
                            {dueInfo.isOverdue && !isCompleted ? (
                              <AlertCircle className="w-3 h-3" />
                            ) : (
                              <Calendar className="w-3 h-3" />
                            )}
                            {dueInfo.label}
                          </span>
                          <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                          <span className={`font-medium ${priorityInfo.textClass}`}>
                            {priorityInfo.label}
                          </span>
                          {task.subtasks.length > 0 && (
                            <>
                              <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
                              <span className="inline-flex items-center gap-1 tabular-nums">
                                <CheckSquare className="w-3 h-3" />
                                {doneSubtasks}/{task.subtasks.length}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Quick Column Move Controls (accessible keyboard/touch alternative to drag) */}
                        <div className="mt-2.5 pl-7 flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                          <button
                            type="button"
                            onClick={() => onSelectTask(task.id)}
                            className="text-[11px] font-semibold text-[#4F46E5] hover:underline cursor-pointer"
                          >
                            Inspect
                          </button>

                          <div className="flex items-center gap-1">
                            {colIndex > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateStatus(task.id, COLUMNS[colIndex - 1].status)
                                }
                                title={`Move to ${COLUMNS[colIndex - 1].title}`}
                                className="w-6 h-6 rounded flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {colIndex < COLUMNS.length - 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateStatus(task.id, COLUMNS[colIndex + 1].status)
                                }
                                title={`Move to ${COLUMNS[colIndex + 1].title}`}
                                className="w-6 h-6 rounded flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
