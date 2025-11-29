import React, { useState, useEffect } from 'react';
import { Project } from './types';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

const STORAGE_KEY = 'monarch_projects_v1';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load projects", e);
      }
    }
  }, []);

  // Save to local storage whenever projects change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'lastUpdated'>) => {
    const newProject: Project = {
      ...projectData,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: Date.now(),
    };
    setProjects([...projects, newProject]);
    setActiveProjectId(newProject.id); // Auto open
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (activeProjectId === id) setActiveProjectId(null);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="min-h-screen bg-white text-black p-4 lg:p-8 font-sans flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <div 
          className="cursor-pointer" 
          onClick={() => setActiveProjectId(null)}
        >
          <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Financial Modeling</div>
          <h1 className="text-xl font-black tracking-tighter uppercase">MONARCH</h1>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Powered by</div>
          <div className="font-bold text-xs">Google Gemini</div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        {activeProjectId && activeProject ? (
          <ProjectDetail 
            project={activeProject} 
            onUpdateProject={handleUpdateProject}
            onBack={() => setActiveProjectId(null)}
          />
        ) : (
          <ProjectList 
            projects={projects}
            onCreateProject={handleCreateProject}
            onOpenProject={setActiveProjectId}
            onDeleteProject={handleDeleteProject}
          />
        )}
      </div>
    </div>
  );
};

export default App;