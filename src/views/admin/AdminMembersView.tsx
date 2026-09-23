import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/memberService';
import { Member, MemberCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

const CATEGORIES: MemberCategory[] = [
  'Head of Research Group',
  'Researcher',
  'Lecturer',
  'Student Researcher',
  'Research Assistant'
];

export const AdminMembersView: React.FC = () => {
  const { canDelete, canEdit } = useAuth();
  const { showToast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    academic_title: '',
    position: '',
    category: 'Researcher' as MemberCategory,
    expertise: '',
    biography: '',
    photo_url: '',
    email: '',
    google_scholar_url: '',
    orcid_url: '',
    linkedin_url: '',
    github_url: '',
    display_order: 1,
    is_active: true,
  });

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMembers = () => {
    memberService.getAll().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kelola Anggota Tim | CMS Admin';
    fetchMembers();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      academic_title: '',
      position: '',
      category: 'Researcher',
      expertise: '',
      biography: '',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: '',
      google_scholar_url: '',
      orcid_url: '',
      linkedin_url: '',
      github_url: '',
      display_order: members.length + 1,
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      academic_title: m.academic_title || '',
      position: m.position,
      category: m.category,
      expertise: m.expertise.join(', '),
      biography: m.biography,
      photo_url: m.photo_url,
      email: m.email,
      google_scholar_url: m.google_scholar_url || '',
      orcid_url: m.orcid_url || '',
      linkedin_url: m.linkedin_url || '',
      github_url: m.github_url || '',
      display_order: m.display_order,
      is_active: m.is_active,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Nama dan email wajib diisi', 'error');
      return;
    }

    const payload = {
      name: formData.name,
      academic_title: formData.academic_title,
      position: formData.position,
      category: formData.category,
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(Boolean),
      biography: formData.biography,
      photo_url: formData.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: formData.email,
      google_scholar_url: formData.google_scholar_url,
      orcid_url: formData.orcid_url,
      linkedin_url: formData.linkedin_url,
      github_url: formData.github_url,
      display_order: Number(formData.display_order) || 1,
      is_active: formData.is_active,
    };

    try {
      if (editingMember) {
        await memberService.update(editingMember.id, payload);
        showToast('Data anggota berhasil diperbarui!', 'success');
      } else {
        await memberService.create(payload);
        showToast('Anggota baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await memberService.delete(deletingId);
      showToast('Anggota berhasil dihapus', 'success');
      setDeletingId(null);
      fetchMembers();
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus anggota', 'error');
    }
  };

  const handleToggleActive = async (m: Member) => {
    try {
      await memberService.update(m.id, { is_active: !m.is_active });
      showToast(`Status ${m.name} diubah menjadi ${!m.is_active ? 'Aktif' : 'Nonaktif'}`, 'info');
      fetchMembers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'Semua' || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-electric-400" />
            <span>Manajemen Anggota Tim & Peneliti</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola profil akademisi, kategori posisi, dan tautan publikasi peneliti.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-blue"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Anggota Baru</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, posisi..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
          >
            <option value="Semua">Semua Kategori</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat data anggota...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Tidak ada anggota yang cocok"
          description="Ubah kata kunci pencarian atau kategori filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-800">
              <tr>
                <th className="py-3.5 px-4">Peneliti</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Posisi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={m.photo_url}
                        alt={m.name}
                        className="w-9 h-9 rounded-xl object-cover bg-navy-950 border border-navy-700"
                      />
                      <div>
                        <span className="font-bold text-white block">{m.name}</span>
                        <span className="text-[11px] text-slate-400">{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-electric-500/10 text-electric-400 border border-electric-500/30">
                      {m.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {m.position}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(m)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        m.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {m.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{m.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-colors"
                          title="Edit Anggota"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(m.id)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                          title="Hapus Anggota"
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

      {/* Form Modal (Create / Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingMember ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Nama Lengkap"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Gelar Akademik</label>
              <input
                type="text"
                value={formData.academic_title}
                onChange={e => setFormData({ ...formData, academic_title: e.target.value })}
                placeholder="S.Kom., M.Cs."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori Peran *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as MemberCategory })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Posisi / Jabatan *</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                placeholder="Associate Professor / Researcher"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Institusi *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@undiksha.ac.id"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Foto Profil</label>
              <input
                type="url"
                value={formData.photo_url}
                onChange={e => setFormData({ ...formData, photo_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Keahlian (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={formData.expertise}
              onChange={e => setFormData({ ...formData, expertise: e.target.value })}
              placeholder="LLM, Computer Vision, RAG, PyTorch"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Biografi Singkat</label>
            <textarea
              rows={3}
              value={formData.biography}
              onChange={e => setFormData({ ...formData, biography: e.target.value })}
              placeholder="Riwayat akademis, fokus riset, dan peran di Undiksha..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Scholar URL</label>
              <input
                type="url"
                value={formData.google_scholar_url}
                onChange={e => setFormData({ ...formData, google_scholar_url: e.target.value })}
                placeholder="https://scholar.google.com/..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">ORCID URL</label>
              <input
                type="url"
                value={formData.orcid_url}
                onChange={e => setFormData({ ...formData, orcid_url: e.target.value })}
                placeholder="https://orcid.org/..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_cb"
              checked={formData.is_active}
              onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded bg-navy-950 border-navy-800 text-electric-600 focus:ring-0"
            />
            <label htmlFor="is_active_cb" className="text-xs text-slate-300">Tampilkan profil di website publik (Status Aktif)</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-navy-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-navy-800 text-xs font-semibold text-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold shadow-glow-blue"
            >
              {editingMember ? 'Simpan Perubahan' : 'Tambah Anggota'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Anggota Tim"
        message="Apakah Anda yakin ingin menghapus data anggota peneliti ini? Tindakan ini tidak dapat dibatalkan."
      />
    </div>
  );
};
