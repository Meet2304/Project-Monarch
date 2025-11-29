"use client";

import { useState, useEffect } from 'react';
import { BUTTON_PRIMARY, BUTTON_SECONDARY, INPUT_STYLE } from '@/constants';

interface ProjectFormProps {
  onSubmit: (data: { name: string; description: string }) => void;
  onCancel: () => void;
  initialData?: { name: string; description?: string };
}

export default function ProjectForm({ onSubmit, onCancel, initialData }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Update state when initialData changes (e.g., when clicking "Edit" on a different project)
  useEffect(() => {
    setName(initialData?.name || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
  };

  return (
    <div className="mb-12 border border-black p-6 bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
      <h3 className="font-bold uppercase mb-6 text-lg tracking-tight">
        {initialData ? 'Edit Project' : 'Create New Project'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
             <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Project Name</label>
             <input 
               className={`${INPUT_STYLE} w-full`}
               placeholder="e.g. AI Hiring Agent"
               value={name}
               onChange={e => setName(e.target.value)}
               autoFocus
               required
             />
          </div>

          <div>
             <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Description</label>
             <input 
               className={`${INPUT_STYLE} w-full`}
               placeholder="Brief description of the project..."
               value={description}
               onChange={e => setDescription(e.target.value)}
             />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} className={BUTTON_SECONDARY}>Cancel</button>
          <button type="submit" className={BUTTON_PRIMARY}>
            {initialData ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}