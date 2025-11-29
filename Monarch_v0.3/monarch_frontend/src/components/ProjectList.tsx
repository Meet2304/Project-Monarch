"use client";

import { Project } from '@/types/project';
import { Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { TABLE_CELL_STYLE, TABLE_HEADER_STYLE } from '@/constants';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

export default function ProjectList({ projects, loading, onEdit, onDelete }: ProjectListProps) {
  
  // 1. Loading State
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin w-8 h-8 text-gray-300" />
      </div>
    );
  }

  // 2. Empty State
  if (projects.length === 0) {
    return (
      <div className="border border-black border-dashed p-12 text-center">
        <FolderOpen className="mx-auto w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-400 uppercase">No Projects Found</h3>
        <p className="text-gray-400 text-sm mt-2">Create your first project to get started.</p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
  }

  // 3. Table State
  return (
    <div className="border border-black bg-white overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className={TABLE_HEADER_STYLE}>Project Name</th>
            <th className={TABLE_HEADER_STYLE}>Description</th>
            <th className={TABLE_HEADER_STYLE}>Last Updated</th>
            <th className={`${TABLE_HEADER_STYLE} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50 group transition-colors">
              <td className={`${TABLE_CELL_STYLE} font-bold`}>{project.name}</td>
              <td className={`${TABLE_CELL_STYLE} text-sm text-gray-600`}>{project.description || '-'}</td>
              <td className={`${TABLE_CELL_STYLE} text-sm text-gray-600`}>{formatDate(project.updated_at)}</td>
              <td className={`${TABLE_CELL_STYLE} text-right`}>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onEdit(project)}
                    className="text-black hover:text-gray-600 transition-colors flex items-center gap-1 text-xs font-bold uppercase border border-transparent hover:border-black px-2 py-1"
                  >
                    Open
                  </button>
                  <button 
                    onClick={() => onDelete(project.id)}
                    className="text-gray-300 hover:text-red-600 transition-colors px-2 py-1"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}