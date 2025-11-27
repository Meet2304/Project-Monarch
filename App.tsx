import React, { useState, useEffect } from 'react';
import { Project } from './types';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import { getProjects, saveProject, deleteProjectFromDb } from './services/firebaseConfig';
import { db } from './services/firebaseConfig';
import { AlertTriangle, Database } from 'lucide-react';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  // Load from Firebase
  useEffect(() => {
    const loadData = async () => {
      // Check if db is initialized (not null)
      if (!db) {
        setDbError(true);
        setLoading(false);
        return;
      }
      
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'lastUpdated'>) => {
    const newProject: Project = {
      ...projectData,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: Date.now(),
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    await saveProject(newProject);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    // Optimistic UI update
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    // Save to DB
    await saveProject(updatedProject);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) setActiveProjectId(null);
      await deleteProjectFromDb(id);
    }
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
        <div className="text-xs font-bold uppercase tracking-widest">Loading Monarch...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 lg:p-8 font-sans flex flex-col">
      {dbError && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 mb-6 flex flex-col sm:flex-row items-start gap-4">
          <Database className="shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold uppercase text-xs tracking-wider mb-1">Database Connection Required</h3>
            <p className="text-sm mb-2">
              To save your projects securely, MONARCH needs to connect to Firebase.
            </p>
            <ol className="list-decimal ml-4 text-xs space-y-1 font-mono text-orange-900/80">
              <li>Rename <code>.env.example</code> to <code>.env</code> (if applicable) or create a new <code>.env</code> file.</li>
              <li>Paste your Firebase credentials (API Key, Project ID, etc.) into the <code>.env</code> file.</li>
              <li>Restart the application server to load the new environment variables.</li>
            </ol>
          </div>
        </div>
      )}
      
      <header className="mb-6 flex justify-between items-center shrink-0">
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

      <div className="flex-1 flex flex-col min-h-0">
        {activeProjectId && activeProject ? (
          <ProjectDetail 
            project={activeProject} 
            onUpdateProject={handleUpdateProject}
            onBack={() => setActiveProjectId(null)}
            currencySymbol={activeProject.currencySymbol || "$"}
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
