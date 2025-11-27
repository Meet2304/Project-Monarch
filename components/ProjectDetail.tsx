import React, { useState, useEffect } from 'react';
import { Project, Scenario } from '../types';
import ScenarioEditor from './ScenarioEditor';
import Dashboard from './Dashboard';
import CompareView from './CompareView';
import { ArrowLeft, Split, LayoutTemplate } from 'lucide-react';
import { HELP_TEXT } from '../constants';
import Tooltip from './Tooltip';

interface Props {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onBack: () => void;
  currencySymbol: string;
}

type ViewMode = 'edit' | 'compare';

const ProjectDetail: React.FC<Props> = ({ project, onUpdateProject, onBack, currencySymbol }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>(project.scenarios);
  const [currentScenarioId, setCurrentScenarioId] = useState<string>(
    project.scenarios.length > 0 ? project.scenarios[0].id : ''
  );
  const [viewMode, setViewMode] = useState<ViewMode>('edit');

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

  const handleDuplicateScenario = (idToClone: string) => {
    const source = scenarios.find(s => s.id === idToClone);
    if (!source) return;

    const newId = Math.random().toString(36).substr(2, 9);
    const clonedScenario: Scenario = {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      // Deep copy components to avoid reference issues
      components: source.components.map(c => ({
        ...c,
        id: Math.random().toString(36).substr(2, 9) 
      }))
    };
    setScenarios([...scenarios, clonedScenario]);
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
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors"
            title="Back to Projects"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center">
              {project.name}
              <Tooltip text={HELP_TEXT.PROJECT_HEADER} />
            </h2>
            <p className="text-xs text-gray-500 font-mono">{project.description || 'Workspace'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex border border-black">
             <button 
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 ${viewMode === 'edit' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
             >
               <LayoutTemplate size={14} /> Editor
             </button>
             <button 
                onClick={() => setViewMode('compare')}
                className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border-l border-black ${viewMode === 'compare' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
             >
               <Split size={14} /> Compare
             </button>
          </div>
        </div>
      </div>

      {scenarios.length === 0 ? (
         <div className="flex-1 flex flex-col items-center justify-center border border-black border-dashed">
            <p className="mb-4 font-bold">No Scenarios Found</p>
            <button onClick={handleAddScenario} className="bg-black text-white px-4 py-2 uppercase font-bold text-sm">Create Scenario</button>
         </div>
      ) : (
        <>
          {viewMode === 'compare' ? (
             <div className="flex-1 overflow-hidden">
               <CompareView scenarios={scenarios} currencySymbol={currencySymbol} />
             </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 items-start overflow-hidden">
              {/* Main Content: Editor */}
              <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
                 <ScenarioEditor 
                  scenario={currentScenario}
                  onUpdateScenario={handleUpdateCurrentScenario}
                  allScenarios={scenarios}
                  onChangeScenario={setCurrentScenarioId}
                  onAddScenario={handleAddScenario}
                  onDuplicateScenario={handleDuplicateScenario}
                  onDeleteScenario={handleDeleteScenario}
                  currencySymbol={currencySymbol}
                />
              </div>

              {/* Sidebar: Dashboard */}
              <div className="w-full lg:w-[400px] shrink-0 lg:h-full overflow-hidden flex flex-col">
                <Dashboard scenario={currentScenario} currencySymbol={currencySymbol} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectDetail;