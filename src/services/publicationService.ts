import { Publication } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialPublications } from '../data/mockData';
import { slugify, generateUUID } from '../lib/utils';

const mapRow = ({ research_area, publication_authors, ...row }: any): Publication => ({ ...row, research_area_title: research_area?.title, authors: (publication_authors || []).sort((a: any,b: any) => a.author_order-b.author_order).map((entry: any) => entry.member?.name || entry.external_author_name).filter(Boolean) });

const selection = '*, research_area:research_areas(title), publication_authors(author_order,external_author_name,member:members(name))';

export const publicationService = {
  async getAll(): Promise<Publication[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('publications')
        .select(selection)
        .order('publication_year', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapRow);
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
      id: generateUUID(),
      slug: pub.slug || slugify(pub.title),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('save_publications', { payload: newPub });
      if (error) throw error;
      const { data, error: readError } = await supabase.from('publications').select(selection).eq('id', newPub.id).single();
      if (readError) throw readError;
      return mapRow(data);
    }

    const current = getStoredData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, initialPublications);
    const updated = [newPub, ...current];
    setStoredData(STORAGE_KEYS.PUBLICATIONS, updated);
    return newPub;
  },

  async update(id: string, updates: Partial<Publication>): Promise<Publication> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('save_publications', { payload: { ...updates, id } });
      if (error) throw error;
      const { data, error: readError } = await supabase.from('publications').select(selection).eq('id', id).single();
      if (readError) throw readError;
      return mapRow(data);
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
