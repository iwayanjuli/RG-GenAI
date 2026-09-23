import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsService } from '../../services/statsService';
import { contactService } from '../../services/contactService';
import { isSupabaseConfigured } from '../../lib/supabase';
import { StatsSummary, ContactMessage } from '../../types';
import { 
  Users, 
  FolderKanban, 
  BookOpen, 
  Handshake, 
  Mail, 
  Plus, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Database,
  Sparkles,
  Milestone
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<StatsSummary>({
    researchersCount: 0,
    activeProjectsCount: 0,
    publicationsCount: 0,
    partnersCount: 0,
  });
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    document.title = 'Dashboard Overview | Admin CMS Undiksha GenAI';
    statsService.getSummary().then(setStats);
    contactService.getAll().then((msgs) => {
      setUnreadMessages(msgs.filter(m => m.status === 'Unread'));
    });
  }, []);

  const statCards = [
    {
      title: 'Anggota Peneliti',
      value: stats.researchersCount,
      path: '/admin/members',
      icon: Users,
      color: 'text-electric-400',
      bg: 'bg-electric-500/10 border-electric-500/30',
    },
    {
      title: 'Proyek Riset Aktif',
      value: stats.activeProjectsCount,
      path: '/admin/projects',
      icon: FolderKanban,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/30',
    },
    {
      title: 'Publikasi Ilmiah',
      value: stats.publicationsCount,
      path: '/admin/publications',
      icon: BookOpen,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30',
    },
    {
      title: 'Mitra Kerjasama',
      value: stats.partnersCount,
      path: '/admin/partners',
      icon: Handshake,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: 'Pesan Belum Dibaca',
      value: unreadMessages.length,
      path: '/admin/messages',
      icon: Mail,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-electric-950/60 border border-electric-500/30 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selamat Datang di Portal CMS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Halo, {user?.full_name || 'Administrator'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Anda login dengan peran <strong className="text-violet-400">{role}</strong>. Dari dashboard ini Anda dapat mengelola profil tim, roadmap fokus riset, katalog proyek inovasi, sitasi publikasi ilmiah, serta pesan kolaborasi masuk.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-800">
              <Database className="w-3.5 h-3.5 text-electric-400" />
              <span>Backend:{' '}
                <strong className={isSupabaseConfigured ? 'text-emerald-400' : 'text-cyan-400'}>
                  {isSupabaseConfigured ? 'Supabase Live' : 'Reactive Local Storage'}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sistem Operasional Optimal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-electric-500/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <span className="text-3xl font-black text-white font-mono">
                  {card.value}
                </span>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-electric-400 mt-2 group-hover:text-white transition-colors">
                  <span>Kelola</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/projects"
          className="p-5 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-violet-500/40 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
              Tambah Proyek
            </h4>
            <p className="text-[11px] text-slate-400">Inovasi model AI</p>
          </div>
        </Link>

        <Link
          to="/admin/roadmap"
          className="p-5 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-blue-500/40 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              Peta Jalan Riset
            </h4>
            <p className="text-[11px] text-slate-400">Atur fase & capaian</p>
          </div>
        </Link>

        <Link
          to="/admin/publications"
          className="p-5 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-electric-500/40 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-electric-600/10 text-electric-400 border border-electric-500/30 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-electric-300 transition-colors">
              Tambah Publikasi
            </h4>
            <p className="text-[11px] text-slate-400">Input paper atau BibTeX</p>
          </div>
        </Link>

        <Link
          to="/admin/members"
          className="p-5 rounded-2xl bg-navy-900/50 border border-navy-800 hover:border-cyan-500/40 transition-all flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              Kelola Peneliti
            </h4>
            <p className="text-[11px] text-slate-400">Dosen & asisten riset</p>
          </div>
        </Link>
      </div>

      {/* Activity Log & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-navy-900/50 border border-navy-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-electric-400" />
              <span>Pesan Masuk Terbaru ({unreadMessages.length} Belum Dibaca)</span>
            </h3>
            <Link to="/admin/messages" className="text-xs text-electric-400 hover:underline">
              Lihat Semua
            </Link>
          </div>

          {unreadMessages.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-4 text-center">
              Tidak ada pesan baru yang belum dibaca.
            </p>
          ) : (
            <div className="space-y-3">
              {unreadMessages.slice(0, 3).map((msg) => (
                <div key={msg.id} className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{msg.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-electric-500/10 text-electric-400">
                        {msg.inquiry_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium mt-1">{msg.subject}</p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{msg.message}</p>
                  </div>
                  <Link
                    to="/admin/messages"
                    className="p-1.5 rounded-lg bg-navy-800 text-slate-400 hover:text-white text-xs shrink-0"
                  >
                    Buka
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-navy-900/50 border border-navy-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-violet-400" />
            <span>Aktivitas Sistem Terakhir</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/60 border border-navy-850">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-slate-200 font-medium">Katalog data otomatis tersinkronisasi</p>
                <span className="text-[10px] text-slate-500 font-mono">21 Sep 2026, 13:30 WITA</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/60 border border-navy-850">
              <span className="w-2 h-2 rounded-full bg-electric-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-slate-200 font-medium">Inisialisasi dataset riset Undiksha GenAI</p>
                <span className="text-[10px] text-slate-500 font-mono">21 Sep 2026, 13:20 WITA</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/60 border border-navy-850">
              <span className="w-2 h-2 rounded-full bg-violet-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-slate-200 font-medium">Otentikasi administrator berhasil</p>
                <span className="text-[10px] text-slate-500 font-mono">Sesi saat ini aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
