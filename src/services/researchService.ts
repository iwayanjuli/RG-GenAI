import { ResearchArea } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialResearchAreas } from '../data/mockData';
import { slugify, generateUUID } from '../lib/utils';

export const researchService = {
  async getAll(): Promise<ResearchArea[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('research_areas')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as ResearchArea[];
    }
    return getStoredData<ResearchArea[]>(STORAGE_KEYS.RESEARCH, initialResearchAreas);
  },

  async getBySlug(slug: string): Promise<ResearchArea | null> {
    const all = await this.getAll();
    return all.find(r => r.slug === slug) || null;
  },

  async create(area: Omit<ResearchArea, 'id' | 'slug'> & { slug?: string }): Promise<ResearchArea> {
    const newArea: ResearchArea = {
      ...area,
      id: generateUUID(),
      slug: area.slug || slugify(area.title),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('research_areas')
        .insert([newArea])
        .select()
        .single();
      if (error) throw error;
      return data as ResearchArea;
    }

    const current = getStoredData<ResearchArea[]>(STORAGE_KEYS.RESEARCH, initialResearchAreas);
    const updated = [...current, newArea];
    setStoredData(STORAGE_KEYS.RESEARCH, updated);
    return newArea;
  },

  async update(id: string, updates: Partial<ResearchArea>): Promise<ResearchArea> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('research_areas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ResearchArea;
    }

    const current = getStoredData<ResearchArea[]>(STORAGE_KEYS.RESEARCH, initialResearchAreas);
    const updated = current.map(r => r.id === id ? { ...r, ...updates } : r);
    setStoredData(STORAGE_KEYS.RESEARCH, updated);
    const result = updated.find(r => r.id === id);
    if (!result) throw new Error('Research Area not found');
    return result;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('research_areas')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<ResearchArea[]>(STORAGE_KEYS.RESEARCH, initialResearchAreas);
    const updated = current.filter(r => r.id !== id);
    setStoredData(STORAGE_KEYS.RESEARCH, updated);
  }
};
