import React, { useState, useEffect } from 'react';
import { Project, Scenario } from '../types';
import ScenarioEditor from './ScenarioEditor';
import Dashboard from './Dashboard';
import { ArrowLeft } from 'lucide-react';

interface Props {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<Props> = ({ project, onUpdateProject, onBack }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>(project.scenarios);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(
    project.scenarios.length > 0 ? project.scenarios[0].id : ''
  );

  useEffect(() => {
    // Ensure we always have a valid selection if one exists
    if (!currentScenarioId && scenarios.length > 0) {
      setCurrentScenarioId(scenarios[0].id);
    }
  }, [scenarios, currentScenarioId]);

  // Sync to parent
  useEffect(() => {
    onUpdateProject({
      ...project,
      scenarios,
      lastUpdated: Date.now(),
    });
  }, [scenarios]);

  const currentScenario = scenarios.find(s => s.id === currentScenarioId) || scenarios[0];

  const handleUpdateCurrentScenario = (updatedScenario: Scenario) => {
    setScenarios(scenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s));
  };

  const handleAddScenario = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newScenario: Scenario = {
      id: newId,
      name: `Scenario ${scenarios.length + 1}`,
      description: '',
      components: []
    };
    setScenarios([...scenarios, newScenario]);
    setCurrentScenarioId(newId);
  };

  const handleDeleteScenario = (id: string) => {
    if (confirm("Delete this scenario?")) {
      const newScenarios = scenarios.filter(s => s.id !== id);
      setScenarios(newScenarios);
      if (newScenarios.length > 0) {
        setCurrentScenarioId(newScenarios[0].id);
      }
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-100px)]">
      {/* Workspace Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">{project.name}</h2>
            <p className="text-xs text-gray-500 font-mono">Workspace</p>
          </div>
        </div>
        <div className="text-xs font-mono text-gray-400 uppercase">
           Auto-saving...
        </div>
      </div>

      {scenarios.length === 0 ? (
         <div className="flex-1 flex flex-col items-center justify-center border border-black border-dashed">
            <p className="mb-4 font-bold">No Scenarios Found</p>
            <button onClick={handleAddScenario} className="bg-black text-white px-4 py-2 uppercase font-bold text-sm">Create Scenario</button>
         </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 items-start">
          
          {/* Main Content: Editor (Swapped to Left/Center) */}
          <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
             <ScenarioEditor 
              scenario={currentScenario}
              onUpdateScenario={handleUpdateCurrentScenario}
              allScenarios={scenarios}
              onChangeScenario={setCurrentScenarioId}
              onAddScenario={handleAddScenario}
              onDeleteScenario={handleDeleteScenario}
            />
          </div>

          {/* Sidebar: Dashboard (Swapped to Right) */}
          <div className="w-full lg:w-[400px] shrink-0 lg:h-full overflow-hidden flex flex-col">
            <Dashboard scenario={currentScenario} />
          </div>

        </div>
      )}
    </div>
  );
};

export default ProjectDetail;