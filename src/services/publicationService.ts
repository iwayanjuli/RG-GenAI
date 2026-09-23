import { Publication } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialPublications } from '../data/mockData';
import { slugify } from '../lib/utils';

export const publicationService = {
  async getAll(): Promise<Publication[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('publication_year', { ascending: false });
      if (error) throw error;
      return data as Publication[];
    }
    return getStoredData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, initialPublications);
  },

  async getBySlug(slug: string): Promise<Publication | null> {
    const all = await this.getAll();
    return all.find(p => p.slug === slug) || null;
  },

  async getLatest(limit: number = 4): Promise<Publication[]> {
    const all = await this.getAll();
    return all.slice(0, limit);
  },

  async create(pub: Omit<Publication, 'id' | 'slug'> & { slug?: string }): Promise<Publication> {
    const newPub: Publication = {
      ...pub,
      id: 'pub-' + Date.now(),
      slug: pub.slug || slugify(pub.title),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('publications')
        .insert([newPub])
        .select()
        .single();
      if (error) throw error;
      return data as Publication;
    }

    const current = getStoredData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, initialPublications);
    const updated = [newPub, ...current];
    setStoredData(STORAGE_KEYS.PUBLICATIONS, updated);
    return newPub;
  },

  async update(id: string, updates: Partial<Publication>): Promise<Publication> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('publications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Publication;
    }

    const current = getStoredData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, initialPublications);
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    setStoredData(STORAGE_KEYS.PUBLICATIONS, updated);
    const result = updated.find(p => p.id === id);
    if (!result) throw new Error('Publication not found');
    return result;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, initialPublications);
    const updated = current.filter(p => p.id !== id);
    setStoredData(STORAGE_KEYS.PUBLICATIONS, updated);
  }
};
