import React from 'react';
import { Search, Plus, Layers, X } from 'lucide-react';
import { NavView, Project } from '../types';

interface TopBarProps {
  activeView: NavView;
  selectedProject: Project | null;
  onClearProject: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onOpenCommandPalette: () => void;
  onOpenNewTask: () => void;
}

const VIEW_TITLES: Record<NavView, string> = {
  focus: 'My Focus',
  board: 'Workflow Board',
  upcoming: 'Upcoming Schedule',
  projects: 'Projects',
};

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  selectedProject,
  onClearProject,
  searchQuery,
  onSearchChange,
  onOpenCommandPalette,
  onOpenNewTask,
}) => {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Brand on mobile + Contextual Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="md:hidden w-8 h-8 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="text-base md:text-lg font-bold tracking-[-0.015em] text-[#0F172A] whitespace-nowrap truncate">
            {VIEW_TITLES[activeView]}
          </h1>
          {selectedProject && (
            <>
              <span className="text-[#94A3B8] text-sm" aria-hidden="true">/</span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[#3525CD] truncate">
                <span
                  className="w-2 h-2 rounded-sm shrink-0"
                  style={{ backgroundColor: selectedProject.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{selectedProject.name}</span>
                <button
                  type="button"
                  onClick={onClearProject}
                  aria-label="Clear project filter"
                  className="p-0.5 rounded hover:bg-[#EEF2FF] text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right: Encapsulated Search Bar + Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex items-center">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="w-40 sm:w-56 lg:w-72 h-10 pl-9 pr-14 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] transition-shadow duration-150"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2.5 p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              title="Open Command Palette (⌘K)"
              className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono font-medium text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] rounded absolute right-2.5 hover:text-[#0F172A] hover:border-[#CBD5E1] transition-colors cursor-pointer"
            >
              ⌘K
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenNewTask}
          className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 bg-[#4F46E5] hover:bg-[#3525CD] active:scale-[0.98] text-white text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
};
