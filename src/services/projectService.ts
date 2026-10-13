import { Project } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialProjects } from '../data/mockData';
import { slugify, generateUUID } from '../lib/utils';

const mapRow = ({ research_area, leader, project_gallery, project_members, ...row }: any): Project => ({ ...row, research_area_title: research_area?.title, project_leader_name: leader ? [leader.name, leader.academic_title].filter(Boolean).join(', ') : undefined, gallery: (project_gallery || []).sort((a: any,b: any) => a.display_order-b.display_order), team_members: (project_members || []).filter((entry: any) => entry.member).map((entry: any) => ({ ...entry.member, role: entry.role })) });

const selection = '*, research_area:research_areas(title), leader:members!projects_project_leader_id_fkey(name,academic_title), project_gallery(*), project_members(role, member:members(id,name,photo_url))';

export const projectService = {
  async getAll(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select(selection)
        .order('start_year', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
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
      id: generateUUID(),
      slug: project.slug || slugify(project.title),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('save_projects', { payload: newProject });
      if (error) throw error;
      const { data, error: readError } = await supabase.from('projects').select(selection).eq('id', newProject.id).single();
      if (readError) throw readError;
      return mapRow(data);
    }

    const current = getStoredData<Project[]>(STORAGE_KEYS.PROJECTS, initialProjects);
    const updated = [newProject, ...current];
    setStoredData(STORAGE_KEYS.PROJECTS, updated);
    return newProject;
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('save_projects', { payload: { ...updates, id } });
      if (error) throw error;
      const { data, error: readError } = await supabase.from('projects').select(selection).eq('id', id).single();
      if (readError) throw readError;
      return mapRow(data);
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
