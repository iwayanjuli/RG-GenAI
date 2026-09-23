import { Member } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialMembers } from '../data/mockData';
import { generateUUID } from '../lib/utils';

export const memberService = {
  async getAll(): Promise<Member[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Member[];
    }
    return getStoredData<Member[]>(STORAGE_KEYS.MEMBERS, initialMembers);
  },

  async getById(id: string): Promise<Member | null> {
    const all = await this.getAll();
    return all.find(m => m.id === id) || null;
  },

  async create(member: Omit<Member, 'id'>): Promise<Member> {
    const newMember: Member = {
      ...member,
      id: generateUUID(),
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('members')
        .insert([newMember])
        .select()
        .single();
      if (error) throw error;
      return data as Member;
    }

    const current = getStoredData<Member[]>(STORAGE_KEYS.MEMBERS, initialMembers);
    const updated = [newMember, ...current];
    setStoredData(STORAGE_KEYS.MEMBERS, updated);
    return newMember;
  },

  async update(id: string, updates: Partial<Member>): Promise<Member> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as Member;
    }

    const current = getStoredData<Member[]>(STORAGE_KEYS.MEMBERS, initialMembers);
    const updated = current.map(m => m.id === id ? { ...m, ...updates } : m);
    setStoredData(STORAGE_KEYS.MEMBERS, updated);
    const result = updated.find(m => m.id === id);
    if (!result) throw new Error('Member not found');
    return result;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<Member[]>(STORAGE_KEYS.MEMBERS, initialMembers);
    const updated = current.filter(m => m.id !== id);
    setStoredData(STORAGE_KEYS.MEMBERS, updated);
  }
};
