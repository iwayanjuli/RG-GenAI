import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';
import { UserRole } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  KeyRound, 
  Info 
} from 'lucide-react';

export const AdminLoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { loginAsDemo, loginWithSupabase } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Harap masukkan email dan password', 'error');
      return;
    }
    setIsLoggingIn(true);
    const res = await loginWithSupabase(email, password);
    setIsLoggingIn(false);

    if (res.error) {
      showToast(res.error, 'error');
    } else {
      showToast('Berhasil masuk ke Dashboard!', 'success');
      navigate(from, { replace: true });
    }
  };

  const handleDemoSelect = (role: UserRole) => {
    loginAsDemo(role);
    showToast(`Masuk sebagai ${role} (Mode Simulasi Demo)`, 'success');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-navy-950 text-slate-100 relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-navy-900/80 border border-electric-500/30 backdrop-blur-xl shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-electric-600 to-violet-600 flex items-center justify-center mx-auto mb-4 text-white shadow-glow-blue">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Portal Administrator CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generative AI Research Group - Universitas Pendidikan Ganesha
          </p>
        </div>

        {/* Demo Fast Logins */}
        <div className="mb-6 p-4 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-electric-400">
            <UserCheck className="w-4 h-4" />
            <span>Login Instan untuk Pengujian Demo (RBAC):</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pilih salah satu peran di bawah ini untuk langsung mengakses dashboard tanpa kredensial remote:
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => handleDemoSelect('Super Admin')}
              className="py-2 px-2 rounded-xl bg-violet-900/40 hover:bg-violet-900/80 border border-violet-500/40 text-[11px] font-bold text-violet-200 transition-colors text-center"
            >
              Super Admin
            </button>
            <button
              onClick={() => handleDemoSelect('Admin')}
              className="py-2 px-2 rounded-xl bg-electric-900/40 hover:bg-electric-900/80 border border-electric-500/40 text-[11px] font-bold text-electric-200 transition-colors text-center"
            >
              Admin
            </button>
            <button
              onClick={() => handleDemoSelect('Editor')}
              className="py-2 px-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 transition-colors text-center"
            >
              Editor
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-navy-800 w-full" />
          <span className="bg-navy-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Atau Login Akun Supabase
          </span>
          <div className="border-t border-navy-800 w-full" />
        </div>

        {/* Supabase login form */}
        <form onSubmit={handleSupabaseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@undiksha.ac.id"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-electric-600 hover:bg-electric-500 transition-colors flex items-center justify-center gap-2 shadow-glow-blue disabled:opacity-50"
          >
            {isLoggingIn ? (
              <span>Mengautentikasi...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Masuk dengan Supabase Auth</span>
              </>
            )}
          </button>
        </form>

        {/* Info on Supabase connection */}
        <div className="mt-6 pt-4 border-t border-navy-800 flex items-start gap-2 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            Status Supabase:{' '}
            <strong className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}>
              {isSupabaseConfigured ? 'Terhubung (Live Backend)' : 'Mode Mock Storage Aktif (Lokal)'}
            </strong>
          </span>
        </div>

      </div>
    </div>
  );
};
