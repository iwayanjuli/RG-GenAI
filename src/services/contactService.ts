import { ContactMessage } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredData, setStoredData, STORAGE_KEYS } from './storage';
import { initialMessages } from '../data/mockData';

export const contactService = {
  async getAll(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    }
    return getStoredData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialMessages);
  },

  async sendMessage(message: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      ...message,
      id: 'msg-' + Date.now(),
      status: 'Unread',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([newMessage])
        .select()
        .single();
      if (error) throw error;
      return data as ContactMessage;
    }

    const current = getStoredData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialMessages);
    const updated = [newMessage, ...current];
    setStoredData(STORAGE_KEYS.MESSAGES, updated);
    return newMessage;
  },

  async updateStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as ContactMessage;
    }

    const current = getStoredData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialMessages);
    const updated = current.map(m => m.id === id ? { ...m, status } : m);
    setStoredData(STORAGE_KEYS.MESSAGES, updated);
    const result = updated.find(m => m.id === id);
    if (!result) throw new Error('Message not found');
    return result;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return;
    }

    const current = getStoredData<ContactMessage[]>(STORAGE_KEYS.MESSAGES, initialMessages);
    const updated = current.filter(m => m.id !== id);
    setStoredData(STORAGE_KEYS.MESSAGES, updated);
  }
};
