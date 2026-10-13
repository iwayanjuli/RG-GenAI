import { RoadmapItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialRoadmap } from '../data/mockData';
import { generateUUID } from '../lib/utils';

export const roadmapService = {
  async getAll(): Promise<RoadmapItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('roadmap_phases').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return data as RoadmapItem[];
    }
    const stored = getStoredData<RoadmapItem[]>(STORAGE_KEYS.ROADMAP, initialRoadmap);
    return [...stored].sort((a, b) => a.display_order - b.display_order);
  },

  async getById(id: string): Promise<RoadmapItem | null> {
    const all = await this.getAll();
    return all.find(item => item.id === id) || null;
  },

  async create(item: Omit<RoadmapItem, 'id'>): Promise<RoadmapItem> {
    const newItem: RoadmapItem = {
      ...item,
      id: generateUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
          .from('roadmap_phases')
          .insert([newItem])
          .select()
          .single();
      if (error) throw error;
      return data as RoadmapItem;
    }

    const current = getStoredData<RoadmapItem[]>(STORAGE_KEYS.ROADMAP, initialRoadmap);
    const updated = [...current, newItem].sort((a, b) => a.display_order - b.display_order);
    setStoredData(STORAGE_KEYS.ROADMAP, updated);
    return newItem;
  },

  async update(id: string, updates: Partial<RoadmapItem>): Promise<RoadmapItem> {
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
          .from('roadmap_phases')
          .update({ ...updates, updated_at: timestamp })
          .eq('id', id)
          .select()
          .single();
      if (error) throw error;
      return data as RoadmapItem;
    }

    const current = getStoredData<RoadmapItem[]>(STORAGE_KEYS.ROADMAP, initialRoadmap);
    const updated = current.map(item => 
      item.id === id ? { ...item, ...updates, updated_at: timestamp } : item
    ).sort((a, b) => a.display_order - b.display_order);
    setStoredData(STORAGE_KEYS.ROADMAP, updated);

    const updatedItem = updated.find(item => item.id === id);
    if (!updatedItem) throw new Error('Roadmap item not found');
    return updatedItem;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('roadmap_phases').delete().eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<RoadmapItem[]>(STORAGE_KEYS.ROADMAP, initialRoadmap);
    const updated = current.filter(item => item.id !== id);
    setStoredData(STORAGE_KEYS.ROADMAP, updated);
  }
};
