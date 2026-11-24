import React from 'react';
import {
  CheckCircle2,
  Columns3,
  CalendarDays,
  FolderKanban,
  Plus,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { NavView, Project } from '../types';

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  focusCount: number;
  upcomingCount: number;
  onOpenNewTask: () => void;
  onResetWorkspace: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  projects,
  selectedProjectId,
  onSelectProject,
  focusCount,
  upcomingCount,
  onOpenNewTask,
  onResetWorkspace,
}) => {
  const navItems: {
    id: NavView;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'focus', label: 'My Focus', icon: CheckCircle2, count: focusCount },
    { id: 'board', label: 'Workflow Board', icon: Columns3 },
    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays, count: upcomingCount },
    { id: 'projects', label: 'Projects', icon: FolderKanban, count: projects.length },
  ];

  return (
    <aside
      aria-label="Workspace Navigation"
      className="hidden md:flex md:w-16 lg:w-[260px] shrink-0 flex-col bg-white border-r border-[#E2E8F0] h-screen sticky top-0 select-none transition-[width] duration-150"
    >
      {/* Brand Zone */}
      <div className="h-16 px-3 lg:px-5 flex items-center justify-center lg:justify-start border-b border-[#E2E8F0]">
        <button
          type="button"
          onClick={() => {
            onSelectProject(null);
            onSelectView('focus');
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#4F46E5] rounded-lg p-1"
        >
          <span className="w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Layers className="w-4 h-4" />
          </span>
          <span className="hidden lg:inline text-[17px] font-bold tracking-[-0.02em] text-[#0F172A] whitespace-nowrap">
            Kinetic Clarity
          </span>
        </button>
      </div>

      {/* Primary CTA */}
      <div className="px-3 lg:px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onOpenNewTask}
          title="New Task (N)"
          className="w-full h-10 bg-[#4F46E5] hover:bg-[#3525CD] active:scale-[0.98] text-white rounded-lg font-semibold text-sm flex items-center justify-center lg:justify-start lg:px-3.5 gap-2 transition-all duration-150 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline whitespace-nowrap">New Task</span>
        </button>
      </div>

      {/* Main Nav Links */}
      <nav className="px-2 lg:px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id && selectedProjectId === null;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectProject(null);
                onSelectView(item.id);
              }}
              title={item.label}
              className={`w-full min-h-[40px] px-2.5 lg:px-3 py-2 rounded-lg flex items-center justify-center lg:justify-between text-sm font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#3525CD] font-semibold'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-[18px] h-[18px] shrink-0 ${
                    isActive ? 'text-[#4F46E5]' : 'text-[#64748B]'
                  }`}
                />
                <span className="hidden lg:inline truncate whitespace-nowrap">{item.label}</span>
              </span>
              {typeof item.count === 'number' && (
                <span
                  className={`hidden lg:inline text-xs font-semibold tabular-nums ${
                    isActive ? 'text-[#4F46E5]' : 'text-[#64748B]'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="hidden lg:block mx-4 my-2 border-t border-[#E2E8F0]" />

      {/* Projects Quick Filter (Desktop expanded) */}
      <div className="hidden lg:flex flex-col flex-1 overflow-y-auto px-3 py-2">
        <div className="px-3 pb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B] tracking-[0.02em]">
            Projects
          </span>
          {selectedProjectId && (
            <button
              type="button"
              onClick={() => onSelectProject(null)}
              className="text-xs font-medium text-[#4F46E5] hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-0.5">
          {projects.map((project) => {
            const isSelected = selectedProjectId === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => {
                  onSelectProject(isSelected ? null : project.id);
                  if (activeView === 'projects') {
                    onSelectView('focus');
                  }
                }}
                className={`w-full min-h-[38px] px-3 py-1.5 rounded-lg flex items-center gap-2.5 text-sm transition-colors duration-150 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#4F46E5] ${
                  isSelected
                    ? 'bg-[#EEF2FF] text-[#3525CD] font-semibold'
                    : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: project.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{project.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Reset */}
      <div className="mt-auto p-3 lg:p-4 border-t border-[#E2E8F0] flex items-center justify-center lg:justify-between">
        <div className="hidden lg:flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#E2DFFF] text-[#3323CC] font-bold text-xs flex items-center justify-center shrink-0">
            VH
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#0F172A] truncate">Product Workspace</p>
            <p className="text-[11px] text-[#64748B] truncate">Local synced</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onResetWorkspace}
          title="Reset workspace to sample data"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
