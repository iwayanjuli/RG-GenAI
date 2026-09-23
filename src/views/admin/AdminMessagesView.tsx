import React, { useEffect, useState } from 'react';
import { contactService } from '../../services/contactService';
import { ContactMessage, MessageStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateIndo } from '../../lib/utils';
import { 
  Mail, 
  Search, 
  Trash2, 
  Eye, 
  Reply, 
  CheckCircle2, 
  Building, 
  Calendar 
} from 'lucide-react';

export const AdminMessagesView: React.FC = () => {
  const { canDelete } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  // Detail modal state
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = () => {
    contactService.getAll().then((data) => {
      setMessages(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kotak Pesan Masuk | CMS Admin';
    fetchMessages();
  }, []);

  const handleOpenDetail = async (msg: ContactMessage) => {
    setViewingMessage(msg);
    if (msg.status === 'Unread') {
      try {
        await contactService.updateStatus(msg.id, 'Read');
        fetchMessages();
      } catch {
        // silent
      }
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: MessageStatus) => {
    try {
      await contactService.updateStatus(id, newStatus);
      showToast(`Status pesan diubah ke ${newStatus}`, 'info');
      if (viewingMessage && viewingMessage.id === id) {
        setViewingMessage({ ...viewingMessage, status: newStatus });
      }
      fetchMessages();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await contactService.delete(deletingId);
      showToast('Pesan berhasil dihapus', 'success');
      setDeletingId(null);
      if (viewingMessage && viewingMessage.id === deletingId) {
        setViewingMessage(null);
      }
      fetchMessages();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.institution.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'Semua' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-rose-400" />
            <span>Kotak Pesan & Permohonan Kolaborasi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar pesan masuk dari formulir kontak website, riset bersama, dan tawaran kemitraan.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengirim, institusi..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          {(['Semua', 'Unread', 'Read', 'Replied'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-rose-600 text-white'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
              }`}
            >
              {st === 'Semua' ? 'Semua Pesan' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat pesan...</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Tidak ada pesan masuk" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-800">
              <tr>
                <th className="py-3.5 px-4">Pengirim</th>
                <th className="py-3.5 px-4">Subjek Pesan</th>
                <th className="py-3.5 px-4">Kepentingan</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((msg) => (
                <tr key={msg.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <strong className="text-white block">{msg.name}</strong>
                    <span className="text-[11px] text-slate-400">{msg.institution}</span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs font-medium text-slate-200 truncate">
                    {msg.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-navy-800 text-electric-400 border border-navy-700">
                      {msg.inquiry_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {formatDateIndo(msg.created_at)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.status === 'Unread'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse'
                        : msg.status === 'Replied'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDetail(msg)}
                        className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white"
                        title="Buka Pesan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(msg.id)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300"
                          title="Hapus Pesan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Detail Modal */}
      <Modal
        isOpen={Boolean(viewingMessage)}
        onClose={() => setViewingMessage(null)}
        title="Detail Pesan Masuk"
        maxWidth="lg"
      >
        {viewingMessage && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/30">
                  {viewingMessage.inquiry_type}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {formatDateIndo(viewingMessage.created_at)}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {viewingMessage.subject}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-navy-950/60 border border-navy-850">
                <span className="text-[10px] text-slate-500 uppercase block">Nama Pengirim</span>
                <strong className="text-slate-200 text-sm">{viewingMessage.name}</strong>
              </div>
              <div className="p-3 rounded-xl bg-navy-950/60 border border-navy-850">
                <span className="text-[10px] text-slate-500 uppercase block">Institusi</span>
                <strong className="text-slate-200 text-sm">{viewingMessage.institution}</strong>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Isi Pesan:
              </span>
              <div className="p-5 rounded-xl bg-navy-950/80 border border-navy-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {viewingMessage.message}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Ubah Status:</span>
                <button
                  onClick={() => handleUpdateStatus(viewingMessage.id, 'Replied')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Tandai Dibalas
                </button>
                <button
                  onClick={() => handleUpdateStatus(viewingMessage.id, 'Read')}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-navy-800 text-slate-300 hover:text-white transition-colors"
                >
                  Telah Dibaca
                </button>
              </div>

              <a
                href={`mailto:${viewingMessage.email}?subject=Re: ${encodeURIComponent(viewingMessage.subject)}`}
                className="px-4 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-blue"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Balas Email ({viewingMessage.email})</span>
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Pesan Masuk"
        message="Yakin ingin menghapus pesan kontak ini?"
      />
    </div>
  );
};
