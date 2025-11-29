import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Trash2, ArrowRight, FolderOpen } from 'lucide-react';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, INPUT_STYLE, NEW_PROJECT_TEMPLATE } from '../constants';

interface Props {
  projects: Project[];
  onCreateProject: (project: Omit<Project, 'id' | 'lastUpdated'>) => void;
  onOpenProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectList: React.FC<Props> = ({ projects, onCreateProject, onOpenProject, onDeleteProject }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ 
    name: '', 
    description: '',
    scenarioName: 'Base Case' 
  });

  const handleCreate = () => {
    if (!newProjectData.name) return;
    
    onCreateProject({
      ...NEW_PROJECT_TEMPLATE,
      name: newProjectData.name,
      description: newProjectData.description,
      scenarios: [
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newProjectData.scenarioName || 'Base Case',
          description: 'Initial scenario',
          components: []
        }
      ]
    });
    
    setNewProjectData({ name: '', description: '', scenarioName: 'Base Case' });
    setIsCreating(false);
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-end mb-12">
         <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Projects</h1>
            <p className="text-gray-500 font-mono text-sm">Select a project to manage cost analysis.</p>
         </div>
         <button 
           onClick={() => setIsCreating(true)}
           className={`${BUTTON_PRIMARY} h-10 flex items-center gap-2`}
         >
           <Plus size={16} /> New Project
         </button>
      </div>

      {isCreating && (
        <div className="mb-12 border border-black p-6 bg-gray-50">
          <h3 className="font-bold uppercase mb-4">Create New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-1">
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Project Name</label>
               <input 
                 className={INPUT_STYLE + " w-full"}
                 placeholder="e.g. AI Hiring Agent"
                 value={newProjectData.name}
                 onChange={e => setNewProjectData({...newProjectData, name: e.target.value})}
                 autoFocus
               />
            </div>
             <div className="md:col-span-1">
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">First Scenario Name</label>
               <input 
                 className={INPUT_STYLE + " w-full"}
                 placeholder="e.g. MVP Launch"
                 value={newProjectData.scenarioName}
                 onChange={e => setNewProjectData({...newProjectData, scenarioName: e.target.value})}
               />
            </div>
            <div className="md:col-span-2">
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Description</label>
               <input 
                 className={INPUT_STYLE + " w-full"}
                 placeholder="Description (Optional)"
                 value={newProjectData.description}
                 onChange={e => setNewProjectData({...newProjectData, description: e.target.value})}
               />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setIsCreating(false)} className={BUTTON_SECONDARY}>Cancel</button>
            <button onClick={handleCreate} className={BUTTON_PRIMARY}>Create Project</button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="border border-black border-dashed p-12 text-center">
          <FolderOpen className="mx-auto w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-400 uppercase">No Projects Found</h3>
          <p className="text-gray-400 text-sm mt-2">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="border border-black bg-white overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black text-white text-xs uppercase tracking-wider">
                <th className="p-4 font-medium border-b border-black">Project Name</th>
                <th className="p-4 font-medium border-b border-black">Description</th>
                <th className="p-4 font-medium border-b border-black">Scenarios</th>
                <th className="p-4 font-medium border-b border-black">Last Updated</th>
                <th className="p-4 font-medium border-b border-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.sort((a,b) => b.lastUpdated - a.lastUpdated).map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 group border-b border-gray-100 last:border-0">
                  <td className="p-4 border-r border-gray-100 font-bold">
                    {project.name}
                  </td>
                  <td className="p-4 border-r border-gray-100 text-sm text-gray-600">
                    {project.description || '-'}
                  </td>
                   <td className="p-4 border-r border-gray-100 text-sm text-gray-600">
                    {project.scenarios?.length || 0}
                  </td>
                  <td className="p-4 border-r border-gray-100 font-mono text-xs text-gray-500">
                    {new Date(project.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => onOpenProject(project.id)}
                      className="text-black hover:text-gray-600 transition-colors flex items-center gap-1 text-xs font-bold uppercase border border-transparent hover:border-black px-2 py-1"
                    >
                      Open <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => onDeleteProject(project.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors px-2 py-1"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;