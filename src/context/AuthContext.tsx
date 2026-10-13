import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginAsDemo: (role: UserRole) => void;
  loginWithSupabase: (email: string, pass: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  'Super Admin': {
    id: 'u-super-admin',
    full_name: 'Dr. I Gede Surya Raharja (Super Admin)',
    email: 'surya.raharja@undiksha.ac.id',
    role: 'Super Admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  },
  'Admin': {
    id: 'u-admin',
    full_name: 'Dr. Ni Luh Putu Swastini (Admin)',
    email: 'putu.swastini@undiksha.ac.id',
    role: 'Admin',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  },
  'Editor': {
    id: 'u-editor',
    full_name: 'Wayan Hendra Pratama (Editor)',
    email: 'hendra.pratama@undiksha.ac.id',
    role: 'Editor',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    created_at: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    let revision = 0;
    if (!supabase) {
      try { const saved = localStorage.getItem('rg_genai_admin_user'); if (saved) setUser(JSON.parse(saved)); }
      catch { localStorage.removeItem('rg_genai_admin_user'); }
      setIsLoading(false);
      return;
    }
    localStorage.removeItem('rg_genai_admin_user');
    const client = supabase;
    const restore = async (authUser: { id: string } | null) => {
      const current = ++revision;
      let profile: User | null = null;
      if (authUser) {
        const { data, error } = await client.from('users').select('*').eq('id', authUser.id).maybeSingle();
        if (!error && data && ['Super Admin', 'Admin', 'Editor'].includes(data.role)) profile = data as User;
      }
      if (active && current === revision) { setUser(profile); setIsLoading(false); }
    };
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      // Defer database calls until the Auth callback releases its lock.
      setTimeout(() => { if (active) void restore(session?.user || null); }, 0);
    });
    client.auth.getSession().then(({ data, error }) => {
      if (active && revision === 0) void restore(error ? null : data.session?.user || null);
    }).catch(() => { if (active) setIsLoading(false); });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const loginAsDemo = (role: UserRole) => {
    if (isSupabaseConfigured) return;
    const demoUser = DEMO_USERS[role];
    setUser(demoUser);
    localStorage.setItem('rg_genai_admin_user', JSON.stringify(demoUser));
  };

  const loginWithSupabase = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!supabase) return { error: 'Konfigurasi Supabase belum tersedia.' };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { error: error.message };
      const { data: profile, error: profileError } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle();
      if (profileError || !profile || !['Super Admin', 'Admin', 'Editor'].includes(profile.role)) {
        await supabase.auth.signOut();
        return { error: 'Akun belum memiliki profil administrator. Hubungi Super Admin.' };
      }
      setUser(profile as User);
      return {};
    } catch { return { error: 'Tidak dapat menghubungi Supabase. Coba kembali.' }; }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('rg_genai_admin_user');
  };

  const role = user ? user.role : null;
  const isAuthenticated = Boolean(user);
  const canDelete = role === 'Super Admin' || role === 'Admin';
  const canEdit = Boolean(role);
  const canManageUsers = role === 'Super Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        loginAsDemo,
        loginWithSupabase,
        logout,
        canEdit,
        canDelete,
        canManageUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
