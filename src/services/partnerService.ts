import { Partner } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialPartners } from '../data/mockData';
import { generateUUID } from '../lib/utils';

export const partnerService = {
  async getAll(): Promise<Partner[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data as Partner[];
    }
    return getStoredData<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners);
  },

  async create(partner: Omit<Partner, 'id'>): Promise<Partner> {
    const newPartner: Partner = {
      ...partner,
      id: generateUUID(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('partners')
        .insert([newPartner])
        .select()
        .single();
      if (error) throw error;
      return data as Partner;
    }

    const current = getStoredData<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners);
    const updated = [newPartner, ...current];
    setStoredData(STORAGE_KEYS.PARTNERS, updated);
    return newPartner;
  },

  async update(id: string, updates: Partial<Partner>): Promise<Partner> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Partner;
    }

    const current = getStoredData<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners);
    const updated = current.map(p => p.id === id ? { ...p, ...updates } : p);
    setStoredData(STORAGE_KEYS.PARTNERS, updated);
    const result = updated.find(p => p.id === id);
    if (!result) throw new Error('Partner not found');
    return result;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<Partner[]>(STORAGE_KEYS.PARTNERS, initialPartners);
    const updated = current.filter(p => p.id !== id);
    setStoredData(STORAGE_KEYS.PARTNERS, updated);
  }
};
