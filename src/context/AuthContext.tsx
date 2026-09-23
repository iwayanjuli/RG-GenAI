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
    // Check saved local session
    const savedUser = localStorage.getItem('rg_genai_admin_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('rg_genai_admin_user');
      }
    }
    setIsLoading(false);
  }, []);

  const loginAsDemo = (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    setUser(demoUser);
    localStorage.setItem('rg_genai_admin_user', JSON.stringify(demoUser));
  };

  const loginWithSupabase = async (email: string, pass: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase credentials are not configured. Use Demo Login options.' };
    }
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
    setIsLoading(false);

    if (error) {
      return { error: error.message };
    }

    if (data.user) {
      const loggedUser: User = {
        id: data.user.id,
        full_name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email || email,
        role: (data.user.user_metadata?.role as UserRole) || 'Admin',
        created_at: data.user.created_at,
      };
      setUser(loggedUser);
      localStorage.setItem('rg_genai_admin_user', JSON.stringify(loggedUser));
    }
    return {};
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
