import React from 'react';
import { CheckCircle2, Columns3, CalendarDays, FolderKanban, Plus } from 'lucide-react';
import { NavView } from '../types';

interface MobileBottomNavProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  onOpenNewTask: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onSelectView,
  onOpenNewTask,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white/85 backdrop-blur-md border-t border-[#E2E8F0] px-2 flex items-center justify-around shadow-[0_-4px_16px_rgba(15,23,42,0.06)]"
    >
      <button
        type="button"
        onClick={() => onSelectView('focus')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[11px] font-semibold transition-colors ${
          activeView === 'focus' ? 'text-[#4F46E5]' : 'text-[#64748B]'
        }`}
      >
        <CheckCircle2 className="w-5 h-5 mb-0.5" />
        <span>Focus</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectView('board')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[11px] font-semibold transition-colors ${
          activeView === 'board' ? 'text-[#4F46E5]' : 'text-[#64748B]'
        }`}
      >
        <Columns3 className="w-5 h-5 mb-0.5" />
        <span>Board</span>
      </button>

      {/* Centered Primary FAB */}
      <button
        type="button"
        onClick={onOpenNewTask}
        aria-label="Add new task"
        className="w-12 h-12 -mt-5 rounded-full bg-[#4F46E5] hover:bg-[#3525CD] active:scale-95 text-white flex items-center justify-center shadow-[0_8px_16px_rgba(79,70,229,0.3)] transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={() => onSelectView('upcoming')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[11px] font-semibold transition-colors ${
          activeView === 'upcoming' ? 'text-[#4F46E5]' : 'text-[#64748B]'
        }`}
      >
        <CalendarDays className="w-5 h-5 mb-0.5" />
        <span>Schedule</span>
      </button>

      <button
        type="button"
        onClick={() => onSelectView('projects')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[11px] font-semibold transition-colors ${
          activeView === 'projects' ? 'text-[#4F46E5]' : 'text-[#64748B]'
        }`}
      >
        <FolderKanban className="w-5 h-5 mb-0.5" />
        <span>Projects</span>
      </button>
    </nav>
  );
};
