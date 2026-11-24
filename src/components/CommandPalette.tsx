import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Columns3,
  CalendarDays,
  FolderKanban,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { NavView, Project, Task } from '../types';
import { STATUS_CONFIG } from '../utils/taskHelpers';

interface CommandPaletteProps {
  tasks: Task[];
  projects: Project[];
  onClose: () => void;
  onSelectTask: (taskId: string) => void;
  onSelectView: (view: NavView) => void;
  onSelectProject: (projectId: string) => void;
  onQuickCreateFromQuery: (title: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  tasks,
  projects,
  onClose,
  onSelectTask,
  onSelectView,
  onSelectProject,
  onQuickCreateFromQuery,
}) => {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();
  const q = trimmed.toLowerCase();

  const matchingTasks = tasks
    .filter(
      (t) =>
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
    .slice(0, 6);

  const matchingProjects = projects.filter(
    (p) => !q || p.name.toLowerCase().includes(q)
  );

  const viewItems: { id: NavView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'focus', label: 'Go to My Focus', icon: CheckCircle2 },
    { id: 'board', label: 'Go to Workflow Board', icon: Columns3 },
    { id: 'upcoming', label: 'Go to Upcoming Schedule', icon: CalendarDays },
    { id: 'projects', label: 'Go to Projects', icon: FolderKanban },
  ];
  const views = viewItems.filter((v) => !q || v.label.toLowerCase().includes(q));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] p-4 bg-[#0F172A]/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-[0_20px_25px_-5px_rgba(15,23,42,0.15)] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-[#E2E8F0]">
          <Search className="w-4 h-4 text-[#64748B] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
            placeholder="Search tasks, jump to a view, or type to create..."
            className="w-full h-12 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[11px] font-mono text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {trimmed && (
            <button
              type="button"
              onClick={() => {
                onQuickCreateFromQuery(trimmed);
                onClose();
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-[#EEF2FF] hover:bg-[#E2DFFF] text-[#3525CD] text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Plus className="w-4 h-4 shrink-0" />
                <span className="truncate">Create task "{trimmed}"</span>
              </span>
              <span className="text-xs font-medium shrink-0">Today</span>
            </button>
          )}

          {matchingTasks.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#64748B]">
                Tasks
              </p>
              <div className="space-y-0.5">
                {matchingTasks.map((task) => {
                  const statusMeta = STATUS_CONFIG[task.status];
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => {
                        onSelectTask(task.id);
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-[#F8FAFC] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: statusMeta.dotColor }}
                        />
                        <span className="text-sm font-medium text-[#0F172A] truncate">
                          {task.title}
                        </span>
                      </div>
                      <span className="text-xs text-[#64748B] shrink-0">
                        {statusMeta.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matchingProjects.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#64748B]">
                Projects
              </p>
              <div className="space-y-0.5">
                {matchingProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      onSelectProject(project.id);
                      onClose();
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-[#F8FAFC] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium text-[#0F172A] truncate">
                        {project.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {views.length > 0 && (
            <div>
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#64748B]">
                Navigation
              </p>
              <div className="space-y-0.5">
                {views.map((view) => {
                  const Icon = view.icon;
                  return (
                    <button
                      key={view.id}
                      type="button"
                      onClick={() => {
                        onSelectView(view.id);
                        onClose();
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-[#F8FAFC] flex items-center gap-2.5 text-left text-sm font-medium text-[#334155] transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-[#64748B]" />
                      <span>{view.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
