import { Project } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialProjects } from '../data/mockData';
import { slugify } from '../lib/utils';

export const projectService = {
  async getAll(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('start_year', { ascending: false });
      if (error) throw error;
      return data as Project[];
    }
    return getStoredData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
  },

  async getBySlug(slug: string): Promise<Project | null> {
    const all = await this.getAll();
    return all.find(p => p.slug === slug) || null;
  },

  async getFeatured(): Promise<Project[]> {
    const all = await this.getAll();
    return all.filter(p => p.is_featured);
  },

  async create(project: Omit<Project, 'id' | 'slug'> & { slug?: string }): Promise<Project> {
    const newProject: Project = {
      ...project,
      id: 'p-' + Date.now(),
      slug: project.slug || slugify(project.title),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    }

    const current = getStoredData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = [newProject, ...current];
    setStoredData(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    }

    const current = getStoredData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    setStoredData(STORAGE_KEYS.PROJECTS, updated);
    const result = updated.find(p => p.id === id);
    if (!result) throw new Error('Project not found');
    return result;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = current.filter(p => p.id !== id);
    setStoredData(STORAGE_KEYS.PROJECTS, updated);
  }
};
