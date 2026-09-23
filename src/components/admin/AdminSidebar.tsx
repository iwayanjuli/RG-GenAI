import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  FolderKanban, 
  BookOpen, 
  Handshake, 
  Mail, 
  LogOut, 
  ExternalLink,
  Shield,
  Sparkles,
  Milestone
} from 'lucide-react';

const ADMIN_LINKS = [
  { label: 'Ringkasan Statistik', path: '/admin', icon: LayoutDashboard },
  { label: 'Kelola Anggota Tim', path: '/admin/members', icon: Users },
  { label: 'Fokus Riset', path: '/admin/research', icon: Layers },
  { label: 'Roadmap Riset', path: '/admin/roadmap', icon: Milestone },
  { label: 'Proyek Inovasi', path: '/admin/projects', icon: FolderKanban },
  { label: 'Publikasi Ilmiah', path: '/admin/publications', icon: BookOpen },
  { label: 'Mitra Kolaborasi', path: '/admin/partners', icon: Handshake },
  { label: 'Pesan Masuk', path: '/admin/messages', icon: Mail },
];

export const AdminSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-navy-900 border-r border-navy-800 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-6 border-b border-navy-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-600 to-violet-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">CMS Admin</span>
                <span className="text-[10px] text-slate-400">Undiksha GenAI</span>
              </div>
            </Link>
          </div>

          {/* User Profile Card */}
          {user && (
            <div className="p-4 mx-3 my-4 rounded-xl bg-navy-950/80 border border-navy-800 flex items-center gap-3">
              <img
                src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user.full_name}
                className="w-10 h-10 rounded-lg object-cover border border-navy-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.full_name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3 text-violet-400 shrink-0" />
                  <span className="text-[10px] font-semibold text-violet-300 truncate">
                    {role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="px-3 space-y-1">
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-electric-600 text-white shadow-glow-blue'
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-navy-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <span>Lihat Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
