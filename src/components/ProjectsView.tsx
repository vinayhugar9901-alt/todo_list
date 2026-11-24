import React, { useState } from 'react';
import { Plus, ArrowRight, Calendar, FolderPlus } from 'lucide-react';
import { Project, Task } from '../types';
import { getOffsetDate } from '../data/initialData';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: (project: {
    name: string;
    description: string;
    color: string;
    targetDate: string;
  }) => void;
}

const PROJECT_COLORS = ['#4F46E5', '#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#0F172A'];

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onOpenProject,
  onCreateProject,
}) => {
  const [showCreator, setShowCreator] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [targetDate, setTargetDate] = useState(getOffsetDate(14));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject({
      name: name.trim(),
      description: description.trim() || 'Active workspace initiative.',
      color,
      targetDate,
    });
    setName('');
    setDescription('');
    setShowCreator(false);
  };

  return (
    <div className="max-w-[1140px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Projects
          </h2>
          <p className="mt-0.5 text-sm text-[#64748B]">
            Track initiative cadence, completion ratios, and open deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreator((prev) => !prev)}
          className="h-10 px-4 bg-[#4F46E5] hover:bg-[#3525CD] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Inline Project Creator */}
      {showCreator && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] space-y-4"
        >
          <h3 className="text-base font-bold text-[#0F172A]">Create Project Workspace</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mobile App v3 Rollout"
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief scope or outcome summary"
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">Color</span>
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Select color ${c}`}
                  className={`w-6 h-6 rounded-md transition-transform cursor-pointer ${
                    color === c ? 'ring-2 ring-offset-2 ring-[#4F46E5] scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreator(false)}
                className="h-9 px-3.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-semibold text-[#475569] hover:text-[#0F172A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 bg-[#4F46E5] hover:bg-[#3525CD] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => {
          const projTasks = tasks.filter((t) => t.projectId === project.id);
          const done = projTasks.filter((t) => t.status === 'completed').length;
          const active = projTasks.filter((t) => t.status === 'in_progress').length;
          const pending = projTasks.filter((t) => t.status === 'pending').length;
          const pct = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project.id)}
              className="group text-left bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(15,23,42,0.07)] transition-all duration-150 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: project.color }}
                      aria-hidden="true"
                    />
                    <h3 className="text-base font-bold text-[#0F172A] truncate group-hover:text-[#3525CD] transition-colors">
                      {project.name}
                    </h3>
                  </div>

                  <span className="text-xs font-semibold text-[#64748B] tabular-nums shrink-0">
                    {pct}%
                  </span>
                </div>

                <p className="mt-2 text-sm text-[#475569] line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F1F5F9] space-y-3">
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: project.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <div className="flex items-center gap-2 tabular-nums">
                    <span>{pending} pending</span>
                    <span aria-hidden="true">·</span>
                    <span>{active} active</span>
                    <span aria-hidden="true">·</span>
                    <span>{done} done</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-[#4F46E5]">
                    <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="text-[#64748B] tabular-nums mr-1">{project.targetDate}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
