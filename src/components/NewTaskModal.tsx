import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Project, TaskPriority, TaskStatus } from '../types';
import { getOffsetDate } from '../data/initialData';

interface NewTaskModalProps {
  projects: Project[];
  defaultProjectId?: string | null;
  onClose: () => void;
  onCreateTask: (input: {
    title: string;
    description: string;
    projectId: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    focusToday: boolean;
    estimatedMinutes?: number;
  }) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  projects,
  defaultProjectId,
  onClose,
  onCreateTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(
    defaultProjectId || projects[0]?.id || 'proj-platform'
  );
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState(getOffsetDate(0));
  const [focusToday, setFocusToday] = useState(true);
  const [estimatedMinutes, setEstimatedMinutes] = useState('30');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      projectId,
      priority,
      status,
      dueDate,
      focusToday,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_20px_25px_-5px_rgba(15,23,42,0.12),0_8px_10px_-6px_rgba(15,23,42,0.08)] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 id="new-task-modal-title" className="text-base font-bold text-[#0F172A]">
            New Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="new-task-title" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Task Title
            </label>
            <input
              id="new-task-title"
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be accomplished?"
              className="w-full h-11 px-3.5 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
          </div>

          <div>
            <label htmlFor="new-task-desc" className="block text-xs font-semibold text-[#475569] mb-1.5">
              Description
            </label>
            <textarea
              id="new-task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional context, links, or checklist details..."
              className="w-full p-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#334155] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={focusToday}
                onChange={(e) => setFocusToday(e.target.checked)}
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#4F46E5] focus:ring-[#4F46E5]"
              />
              <span>Pin to My Focus queue</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-[#64748B]">Est. min:</label>
              <input
                type="number"
                min={5}
                step={5}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-16 h-8 px-2 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm font-semibold text-[#1E293B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="h-10 px-5 bg-[#4F46E5] hover:bg-[#3525CD] disabled:opacity-40 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
