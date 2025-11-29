"use client";

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { projectService } from '@/services/api';
import ProjectForm from '@/components/ProjectForm';
import ProjectList from '@/components/ProjectList'; // Import the new component
import { Plus } from 'lucide-react';
import { BUTTON_PRIMARY } from '@/constants';

export default function Home() {
  // --- STATE ---
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // --- DATA FETCHING ---
  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // --- HANDLERS ---
  const handleCreate = async (data: { name: string; description: string }) => {
    try {
      await projectService.create(data);
      setShowForm(false);
      loadProjects();
    } catch (error) {
      alert('Failed to create project');
    }
  };

  const handleUpdate = async (data: { name: string; description: string }) => {
    if (!editingProject) return;
    try {
      await projectService.update(editingProject.id, data);
      setEditingProject(null);
      loadProjects();
    } catch (error) {
      alert('Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.delete(id);
      loadProjects();
    } catch (error) {
      alert('Failed to delete project');
    }
  };

  // --- RENDER ---
  return (
    <main className="min-h-screen p-8 bg-white text-black font-sans">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
           <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Projects</h1>
              <p className="text-gray-500 font-mono text-sm">Select a project to manage cost analysis.</p>
           </div>
           {!showForm && !editingProject && (
             <button 
               onClick={() => setShowForm(true)}
               className={`${BUTTON_PRIMARY} h-10 flex items-center gap-2`}
             >
               <Plus size={16} /> New Project
             </button>
           )}
        </div>

        {/* Form Component */}
        {(showForm || editingProject) && (
          <ProjectForm 
            onSubmit={editingProject ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
            initialData={editingProject || undefined}
          />
        )}

        {/* List Component */}
        {!showForm && !editingProject && (
          <ProjectList 
            projects={projects}
            loading={loading}
            onEdit={setEditingProject}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}