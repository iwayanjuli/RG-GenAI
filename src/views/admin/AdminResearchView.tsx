import React, { useEffect, useState } from 'react';
import { researchService } from '../../services/researchService';
import { ResearchArea } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  Check 
} from 'lucide-react';

export const AdminResearchView: React.FC = () => {
  const { canDelete, canEdit } = useAuth();
  const { showToast } = useToast();
  const [areas, setAreas] = useState<ResearchArea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<ResearchArea | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    icon: 'Brain',
    research_questions: '',
    methods: '',
    technologies: '',
    display_order: 1,
    is_featured: false,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAreas = () => {
    researchService.getAll().then((data) => {
      setAreas(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kelola Fokus Riset | CMS Admin';
    fetchAreas();
  }, []);

  const handleOpenCreate = () => {
    setEditingArea(null);
    setFormData({
      title: '',
      summary: '',
      description: '',
      icon: 'Brain',
      research_questions: '',
      methods: '',
      technologies: '',
      display_order: areas.length + 1,
      is_featured: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ra: ResearchArea) => {
    setEditingArea(ra);
    setFormData({
      title: ra.title,
      summary: ra.summary,
      description: ra.description,
      icon: ra.icon,
      research_questions: ra.research_questions.join('\n'),
      methods: ra.methods.join(', '),
      technologies: ra.technologies.join(', '),
      display_order: ra.display_order,
      is_featured: ra.is_featured,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.summary) {
      showToast('Judul dan ringkasan wajib diisi', 'error');
      return;
    }

    const payload = {
      title: formData.title,
      summary: formData.summary,
      description: formData.description,
      icon: formData.icon,
      research_questions: formData.research_questions.split('\n').map(s => s.trim()).filter(Boolean),
      methods: formData.methods.split(',').map(s => s.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean),
      display_order: Number(formData.display_order) || 1,
      is_featured: formData.is_featured,
    };

    try {
      if (editingArea) {
        await researchService.update(editingArea.id, payload);
        showToast('Bidang riset berhasil diperbarui!', 'success');
      } else {
        await researchService.create(payload);
        showToast('Bidang riset baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchAreas();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await researchService.delete(deletingId);
      showToast('Bidang riset berhasil dihapus', 'success');
      setDeletingId(null);
      fetchAreas();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (ra: ResearchArea) => {
    try {
      await researchService.update(ra.id, { is_featured: !ra.is_featured });
      showToast(`Status unggulan ${ra.title} diperbarui`, 'info');
      fetchAreas();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = areas.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <span>Manajemen Bidang Riset (Research Areas)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur 9 pilar fokus riset, pertanyaan penelitian (research questions), dan stack teknologi.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-violet"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Bidang Riset</span>
          </button>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bidang riset..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat bidang riset...</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Bidang riset tidak ditemukan" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-800">
              <tr>
                <th className="py-3.5 px-4">Bidang Riset</th>
                <th className="py-3.5 px-4">Ringkasan</th>
                <th className="py-3.5 px-4">Unggulan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((ra) => (
                <tr key={ra.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white max-w-xs">
                    {ra.title}
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-sm line-clamp-1">
                    {ra.summary}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(ra)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        ra.is_featured
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-navy-800 border-navy-700 text-slate-500'
                      }`}
                      title={ra.is_featured ? 'Unggulan di Home' : 'Bukan Unggulan'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEdit(ra)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(ra.id)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300"
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

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingArea ? 'Edit Bidang Riset' : 'Tambah Bidang Riset Baru'}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Bidang Riset *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: Large Language Models"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ringkasan Singkat (Summary) *</label>
            <input
              type="text"
              required
              value={formData.summary}
              onChange={e => setFormData({ ...formData, summary: e.target.value })}
              placeholder="1-2 kalimat ringkasan fokus..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Uraian komprehensif..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Pertanyaan Riset (Satu pertanyaan per baris)</label>
            <textarea
              rows={3}
              value={formData.research_questions}
              onChange={e => setFormData({ ...formData, research_questions: e.target.value })}
              placeholder="Bagaimana cara mengoptimalkan...&#10;Sejauh mana transfer learning..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Metodologi (Pisahkan koma)</label>
              <input
                type="text"
                value={formData.methods}
                onChange={e => setFormData({ ...formData, methods: e.target.value })}
                placeholder="LoRA, DPO, Contrastive"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teknologi (Pisahkan koma)</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="PyTorch, Transformers, vLLM"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_feat_cb"
              checked={formData.is_featured}
              onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded bg-navy-950 border-navy-800 text-violet-600 focus:ring-0"
            />
            <label htmlFor="is_feat_cb" className="text-xs text-slate-300">Tampilkan sebagai sorotan di Beranda (Featured)</label>
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
              className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              {editingArea ? 'Simpan Perubahan' : 'Tambah Bidang Riset'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Bidang Riset"
        message="Yakin ingin menghapus bidang riset ini?"
      />
    </div>
  );
};
