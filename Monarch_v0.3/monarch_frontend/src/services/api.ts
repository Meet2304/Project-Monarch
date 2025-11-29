import {Project} from '@/types/project';

const API_URL = 'http://localhost:8000';

export const projectService = {
    // GET all projects
    getAll: async (): Promise<Project[]> => {
        const response = await fetch(`${API_URL}/projects/`);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return response.json();
    },

    // POST a new project
    create: async (data: {name: string; description?: string}) => {
        const response = await fetch(`${API_URL}/projects/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to create project');
        }
        return response.json();
    },

    // PATCH a project
    update: async (id: number, data: Partial<Project>) => {
        const response = await fetch(`${API_URL}/projects/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Failed to update project');
        }
        return response.json();
    },

    // DELETE a project
    delete: async (id: number) => {
        const response = await fetch(`${API_URL}/projects/${id}/`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        return true;
    }
};