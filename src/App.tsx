/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { NavView, Project, Task, TaskPriority, TaskStatus } from './types';
import { getOffsetDate, INITIAL_PROJECTS, INITIAL_TASKS } from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FocusView } from './components/FocusView';
import { BoardView } from './components/BoardView';
import { UpcomingView } from './components/UpcomingView';
import { ProjectsView } from './components/ProjectsView';
import { TaskInspector } from './components/TaskInspector';
import { NewTaskModal } from './components/NewTaskModal';
import { CommandPalette } from './components/CommandPalette';

const STORAGE_KEYS = {
  TASKS: 'kinetic_clarity_tasks_v1',
  PROJECTS: 'kinetic_clarity_projects_v1',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadStored<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS)
  );

  const [activeView, setActiveView] = useState<NavView>('focus');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Persist tasks and projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // Ignore quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch {
      // Ignore quota errors
    }
  }, [projects]);

  // Global keyboard shortcuts (Cmd/Ctrl+K for Command Palette)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isCommandOpen) setIsCommandOpen(false);
        else if (isNewTaskOpen) setIsNewTaskOpen(false);
        else if (selectedTaskId) setSelectedTaskId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandOpen, isNewTaskOpen, selectedTaskId]);

  const todayDate = getOffsetDate(0);
  const focusCount = tasks.filter(
    (t) => t.status !== 'completed' && (t.focusToday || t.dueDate <= todayDate)
  ).length;
  const upcomingCount = tasks.filter((t) => t.status !== 'completed').length;

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null;
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const nextStatus: TaskStatus =
          task.status === 'completed' ? 'pending' : 'completed';
        return { ...task, status: nextStatus };
      })
    );
  };

  const handleUpdateStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  const handleCreateTask = (input: {
    title: string;
    description?: string;
    projectId: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
    focusToday: boolean;
    estimatedMinutes?: number;
  }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: input.title,
      description: input.description || '',
      status: input.status,
      priority: input.priority,
      projectId: input.projectId,
      dueDate: input.dueDate,
      focusToday: input.focusToday,
      estimatedMinutes: input.estimatedMinutes,
      createdAt: getOffsetDate(0),
      subtasks: [],
    };
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
  };

  const handleCreateProject = (input: {
    name: string;
    description: string;
    color: string;
    targetDate: string;
  }) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: input.name,
      description: input.description,
      color: input.color,
      targetDate: input.targetDate,
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const handleResetWorkspace = () => {
    setTasks(INITIAL_TASKS);
    setProjects(INITIAL_PROJECTS);
    setSelectedProjectId(null);
    setSelectedTaskId(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex">
      {/* Persistent Left Navigation Rail (Desktop & Tablet) */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        focusCount={focusCount}
        upcomingCount={upcomingCount}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onResetWorkspace={handleResetWorkspace}
      />

      {/* Center Working Canvas */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <TopBar
          activeView={activeView}
          selectedProject={selectedProject}
          onClearProject={() => setSelectedProjectId(null)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenCommandPalette={() => setIsCommandOpen(true)}
          onOpenNewTask={() => setIsNewTaskOpen(true)}
        />

        <main className="flex-1 pb-24 md:pb-10">
          {activeView === 'focus' && (
            <FocusView
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              selectedTaskId={selectedTaskId}
              searchQuery={searchQuery}
              onToggleComplete={handleToggleComplete}
              onCycleStatus={handleUpdateStatus}
              onSelectTask={(id) =>
                setSelectedTaskId((prev) => (prev === id ? null : id))
              }
              onQuickAddTask={handleCreateTask}
              onClearFilters={() => {
                setSelectedProjectId(null);
                setSearchQuery('');
              }}
            />
          )}

          {activeView === 'board' && (
            <BoardView
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              selectedTaskId={selectedTaskId}
              searchQuery={searchQuery}
              onSelectProject={setSelectedProjectId}
              onToggleComplete={handleToggleComplete}
              onUpdateStatus={handleUpdateStatus}
              onSelectTask={(id) =>
                setSelectedTaskId((prev) => (prev === id ? null : id))
              }
              onQuickAddTask={handleCreateTask}
            />
          )}

          {activeView === 'upcoming' && (
            <UpcomingView
              tasks={tasks}
              projects={projects}
              selectedProjectId={selectedProjectId}
              selectedTaskId={selectedTaskId}
              searchQuery={searchQuery}
              onToggleComplete={handleToggleComplete}
              onCycleStatus={handleUpdateStatus}
              onSelectTask={(id) =>
                setSelectedTaskId((prev) => (prev === id ? null : id))
              }
              onOpenNewTask={() => setIsNewTaskOpen(true)}
            />
          )}

          {activeView === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onOpenProject={(projectId) => {
                setSelectedProjectId(projectId);
                setActiveView('focus');
              }}
              onCreateProject={handleCreateProject}
            />
          )}
        </main>
      </div>

      {/* Collapsible 380px Right Inspection Drawer */}
      {selectedTask && (
        <TaskInspector
          task={selectedTask}
          projects={projects}
          onClose={() => setSelectedTaskId(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Mobile Glass Bottom Navigation with Centered FAB */}
      <MobileBottomNav
        activeView={activeView}
        onSelectView={(view) => {
          setSelectedProjectId(null);
          setActiveView(view);
        }}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
      />

      {/* New Task Modal */}
      {isNewTaskOpen && (
        <NewTaskModal
          projects={projects}
          defaultProjectId={selectedProjectId}
          onClose={() => setIsNewTaskOpen(false)}
          onCreateTask={handleCreateTask}
        />
      )}

      {/* Command Palette (⌘K) */}
      {isCommandOpen && (
        <CommandPalette
          tasks={tasks}
          projects={projects}
          onClose={() => setIsCommandOpen(false)}
          onSelectTask={(id) => setSelectedTaskId(id)}
          onSelectView={(view) => {
            setSelectedProjectId(null);
            setActiveView(view);
          }}
          onSelectProject={(projId) => {
            setSelectedProjectId(projId);
            setActiveView('focus');
          }}
          onQuickCreateFromQuery={(title) =>
            handleCreateTask({
              title,
              projectId: selectedProjectId || projects[0]?.id || 'proj-platform',
              priority: 'medium',
              status: 'pending',
              dueDate: todayDate,
              focusToday: true,
            })
          }
        />
      )}
    </div>
  );
}
