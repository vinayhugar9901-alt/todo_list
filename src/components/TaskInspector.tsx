import React, { useState } from 'react';
import {
  X,
  Check,
  Plus,
  Trash2,
  Calendar,
  Folder,
  Clock,
  Star,
} from 'lucide-react';
import { Project, Task, TaskPriority, TaskStatus } from '../types';
import { STATUS_CONFIG } from '../utils/taskHelpers';

interface TaskInspectorProps {
  task: Task;
  projects: Project[];
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskInspector: React.FC<TaskInspectorProps> = ({
  task,
  projects,
  onClose,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newSubtaskTitle.trim();
    if (!title) return;
    onUpdateTask(task.id, {
      subtasks: [
        ...task.subtasks,
        {
          id: `sub-${Date.now()}`,
          title,
          completed: false,
        },
      ],
    });
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    onUpdateTask(task.id, {
      subtasks: task.subtasks.map((s) =>
        s.id === subtaskId ? { ...s, completed: !s.completed } : s
      ),
    });
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    onUpdateTask(task.id, {
      subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
    });
  };

  return (
    <>
      {/* Backdrop on mobile/tablet/medium screens */}
      <div
        onClick={onClose}
        className="xl:hidden fixed inset-0 bg-[#0F172A]/40 z-30"
        aria-hidden="true"
      />

      <aside
        aria-label="Task Inspector"
        className="fixed xl:sticky top-0 right-0 z-40 xl:z-10 w-full max-w-[380px] xl:w-[380px] shrink-0 h-screen bg-white border-l border-[#E2E8F0] flex flex-col shadow-[0_20px_25px_-5px_rgba(15,23,42,0.10)] xl:shadow-none"
      >
        {/* Inspector Header */}
        <div className="h-16 px-5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
          <span className="text-xs font-bold uppercase tracking-[0.04em] text-[#64748B]">
            Task Details
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onUpdateTask(task.id, { focusToday: !task.focusToday })}
              title={task.focusToday ? 'Remove from My Focus' : 'Add to My Focus'}
              className={`h-8 px-2.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors cursor-pointer ${
                task.focusToday
                  ? 'bg-[#EEF2FF] border-[#C7D2FE] text-[#3525CD]'
                  : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${task.focusToday ? 'fill-[#4F46E5]' : ''}`} />
              <span>Focus</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close task details"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Inspector Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Editable Title */}
          <div>
            <label htmlFor="inspector-title" className="sr-only">
              Task Title
            </label>
            <textarea
              id="inspector-title"
              rows={2}
              value={task.title}
              onChange={(e) => onUpdateTask(task.id, { title: e.target.value })}
              className="w-full text-lg font-bold tracking-[-0.015em] text-[#0F172A] bg-transparent border border-transparent hover:border-[#E2E8F0] focus:border-[#4F46E5] focus:bg-white rounded-lg p-1.5 -m-1.5 resize-none focus:outline-none transition-colors"
            />
          </div>

          {/* Workflow Status Selector */}
          <div className="space-y-2">
            <span className="block text-xs font-semibold text-[#64748B]">Workflow Status</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['pending', 'in_progress', 'completed'] as TaskStatus[]).map((statusKey) => {
                const meta = STATUS_CONFIG[statusKey];
                const active = task.status === statusKey;
                return (
                  <button
                    key={statusKey}
                    type="button"
                    onClick={() => onUpdateTask(task.id, { status: statusKey })}
                    className={`h-9 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      active
                        ? `${meta.bgClass} ${meta.textClass} ${meta.borderClass} ring-1 ring-current`
                        : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: meta.dotColor }}
                    />
                    <span className="truncate">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metadata Fields */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>Project</span>
              </label>
              <select
                value={task.projectId}
                onChange={(e) => onUpdateTask(task.id, { projectId: e.target.value })}
                className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-1.5">
                <span>Priority</span>
              </label>
              <select
                value={task.priority}
                onChange={(e) =>
                  onUpdateTask(task.id, { priority: e.target.value as TaskPriority })
                }
                className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={task.dueDate}
                onChange={(e) => onUpdateTask(task.id, { dueDate: e.target.value })}
                className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Est. Minutes</span>
              </label>
              <input
                type="number"
                min={5}
                step={5}
                value={task.estimatedMinutes || ''}
                placeholder="30"
                onChange={(e) =>
                  onUpdateTask(task.id, {
                    estimatedMinutes: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="inspector-desc" className="block text-xs font-semibold text-[#64748B]">
              Notes & Context
            </label>
            <textarea
              id="inspector-desc"
              rows={4}
              value={task.description}
              onChange={(e) => onUpdateTask(task.id, { description: e.target.value })}
              placeholder="Add acceptance criteria, links, or execution notes..."
              className="w-full p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5] leading-relaxed resize-y"
            />
          </div>

          {/* Subtasks Checklist */}
          <div className="space-y-3 pt-2 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F172A]">Subtasks</span>
              <span className="text-xs font-semibold text-[#64748B] tabular-nums">
                {completedSubtasks}/{task.subtasks.length}
              </span>
            </div>

            {task.subtasks.length > 0 && (
              <div className="space-y-1.5">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(sub.id)}
                      aria-label={sub.completed ? 'Mark subtask incomplete' : 'Complete subtask'}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        sub.completed
                          ? 'bg-[#16A34A] border-[#16A34A] text-white'
                          : 'bg-white border-[#CBD5E1] hover:border-[#4F46E5] text-transparent'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </button>

                    <span
                      className={`flex-1 text-sm ${
                        sub.completed ? 'line-through text-[#64748B]' : 'text-[#1E293B]'
                      }`}
                    >
                      {sub.title}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      aria-label="Remove subtask"
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#DC2626] transition-opacity cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add a subtask step..."
                className="flex-1 h-9 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                aria-label="Add subtask"
                className="h-9 px-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] disabled:opacity-40 text-[#0F172A] text-xs font-semibold rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer Delete Action */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-semibold text-[#64748B] hover:text-[#DC2626] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Task</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs font-semibold text-[#DC2626]">Delete permanently?</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#475569] bg-white border border-[#E2E8F0] rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {!confirmDelete && (
            <span className="text-[11px] font-mono text-[#94A3B8] tabular-nums">
              Created {task.createdAt}
            </span>
          )}
        </div>
      </aside>
    </>
  );
};
