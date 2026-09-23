import React, { useEffect, useState } from 'react';
import { roadmapService } from '../../services/roadmapService';
import { RoadmapItem, RoadmapStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Milestone, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Target,
  Layers,
  ArrowUpDown,
  Sparkles
} from 'lucide-react';

export const AdminRoadmapView: React.FC = () => {
  const { canDelete, canEdit } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [formData, setFormData] = useState({
    phase: '',
    year_range: '',
    title: '',
    subtitle: '',
    status: 'Planned' as RoadmapStatus,
    points: '',
    technologies: '',
    deliverables: '',
    display_order: 1,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = () => {
    roadmapService.getAll().then((data) => {
      setItems(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kelola Roadmap Riset | CMS Admin Undiksha GenAI';
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      phase: `Fase ${items.length + 1}`,
      year_range: `${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`,
      title: '',
      subtitle: '',
      status: 'Planned',
      points: '',
      technologies: '',
      deliverables: '',
      display_order: items.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: RoadmapItem) => {
    setEditingItem(item);
    setFormData({
      phase: item.phase,
      year_range: item.year_range,
      title: item.title,
      subtitle: item.subtitle || '',
      status: item.status,
      points: item.points.join('\n'),
      technologies: (item.technologies || []).join(', '),
      deliverables: (item.deliverables || []).join(', '),
      display_order: item.display_order,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phase || !formData.year_range || !formData.title) {
      showToast('Nama fase, rentang tahun, dan judul wajib diisi', 'error');
      return;
    }

    const pointsArray = formData.points
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    if (pointsArray.length === 0) {
      showToast('Minimal masukkan 1 butir agenda/milestone fase ini', 'error');
      return;
    }

    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const deliverablesArray = formData.deliverables
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const payload = {
      phase: formData.phase,
      year_range: formData.year_range,
      title: formData.title,
      subtitle: formData.subtitle || undefined,
      status: formData.status,
      points: pointsArray,
      technologies: techArray,
      deliverables: deliverablesArray,
      display_order: Number(formData.display_order) || 1,
    };

    try {
      if (editingItem) {
        await roadmapService.update(editingItem.id, payload);
        showToast('Fase roadmap berhasil diperbarui!', 'success');
      } else {
        await roadmapService.create(payload);
        showToast('Fase roadmap baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchItems();
    } catch {
      showToast('Gagal menyimpan fase roadmap', 'error');
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: RoadmapStatus) => {
    if (!canEdit) {
      showToast('Anda tidak memiliki izin mengedit data ini', 'error');
      return;
    }
    try {
      await roadmapService.update(id, { status: newStatus });
      showToast(`Status fase diubah ke: ${newStatus}`, 'success');
      fetchItems();
    } catch {
      showToast('Gagal memperbarui status fase', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await roadmapService.delete(deletingId);
      showToast('Fase roadmap berhasil dihapus', 'success');
      setDeletingId(null);
      fetchItems();
    } catch {
      showToast('Gagal menghapus fase roadmap', 'error');
    }
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.year_range.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.points.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30 mb-2">
            <Milestone className="w-3.5 h-3.5" />
            <span>Peta Jalan Riset Terpadu</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Kelola Roadmap & Peta Jalan Riset
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Konfigurasi fase strategis, rentang tahun, status capaian faktual (Selesai, Berjalan, Rencana), dan deliverable riset.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-semibold text-white flex items-center gap-2 shadow-glow-violet transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Fase Baru</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Fase
          </span>
          <span className="text-2xl font-black text-white">{items.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-emerald-500/20">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Selesai
          </span>
          <span className="text-2xl font-black text-emerald-400">
            {items.filter(i => i.status === 'Completed').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-blue-500/20">
          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block mb-1">
            Sedang Berjalan
          </span>
          <span className="text-2xl font-black text-blue-400">
            {items.filter(i => i.status === 'In Progress').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900 border border-slate-700/50">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Rencana Mendatang
          </span>
          <span className="text-2xl font-black text-slate-300">
            {items.filter(i => i.status === 'Planned').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari fase, tahun, kata kunci..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'Completed', 'In Progress', 'Planned'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedStatus === status
                  ? 'bg-violet-600 text-white shadow-glow-violet'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
              }`}
            >
              {status === 'all'
                ? 'Semua Status'
                : status === 'Completed'
                ? 'Selesai'
                : status === 'In Progress'
                ? 'Sedang Berjalan'
                : 'Rencana'}
            </button>
          ))}
        </div>
      </div>

      {/* Roadmap Items List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-navy-900/60 border border-navy-800 animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="Tidak ada data roadmap"
          description="Belum ada fase peta jalan yang sesuai dengan kriteria filter Anda."
          actionText="Tambah Fase Pertama"
          onAction={canEdit ? handleOpenCreate : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-navy-900 border border-navy-800 hover:border-violet-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-navy-950 border border-navy-800 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                    {item.display_order}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-violet-900/40 text-violet-300 border border-violet-700/40">
                    {item.phase}
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-navy-950 text-slate-400 border border-navy-800">
                    {item.year_range}
                  </span>

                  {/* Status Dropdown/Selector */}
                  <select
                    value={item.status}
                    onChange={(e) => handleQuickStatusChange(item.id, e.target.value as RoadmapStatus)}
                    disabled={!canEdit}
                    className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${
                      item.status === 'Completed'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                        : item.status === 'In Progress'
                        ? 'bg-blue-950/60 text-cyan-400 border-blue-500/40'
                        : 'bg-navy-950 text-slate-400 border-navy-800'
                    }`}
                  >
                    <option value="Completed">✓ Selesai</option>
                    <option value="In Progress">● Sedang Berjalan</option>
                    <option value="Planned">○ Rencana Mendatang</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-violet-400 font-medium mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Milestone Points */}
                <ul className="space-y-1.5 pt-1">
                  {item.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0 mt-1.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags preview */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {item.technologies?.map(tech => (
                    <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-950 text-slate-400 border border-navy-800">
                      {tech}
                    </span>
                  ))}
                  {item.deliverables?.map(del => (
                    <span key={del} className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      {del}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-navy-800 w-full lg:w-auto justify-end">
                {canEdit && (
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-400 hover:text-white border border-navy-800 transition-colors"
                    title="Edit Fase"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-2 rounded-xl bg-navy-950 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-navy-800 hover:border-rose-800/40 transition-colors"
                    title="Hapus Fase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? 'Edit Fase Roadmap' : 'Tambah Fase Roadmap Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Fase *
              </label>
              <input
                type="text"
                required
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                placeholder="misal: Fase I, Fase II"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rentang Tahun *
              </label>
              <input
                type="text"
                required
                value={formData.year_range}
                onChange={(e) => setFormData({ ...formData, year_range: e.target.value })}
                placeholder="misal: 2024 - 2025"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Status Capaian Faktual *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoadmapStatus })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Completed">Selesai (Completed)</option>
                <option value="In Progress">Sedang Berjalan (In Progress)</option>
                <option value="Planned">Rencana (Planned)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Judul Fase Strategis *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="misal: Domain Adaptation & Multimodal Alignment"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Subjudul / Fokus Singkat (Opsional)
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="misal: Adaptasi Model Berbahasa Lokal & VLM Budaya"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Butir Agenda Riset & Target Milestones (1 per baris) *
            </label>
            <textarea
              required
              rows={4}
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: e.target.value })}
              placeholder="Penyusunan korpus linguistik bahasa daerah Bali&#10;Pembangunan cluster workstation GPU&#10;Eksplorasi teknik LoRA / QLoRA"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stack Teknologi & Instrumen (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="PyTorch, LLaMA-3, Qdrant, CUDA"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Deliverable / Output (pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={formData.deliverables}
                onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                placeholder="Model Balinese-LLaMA, Platform RAG, 3 Paten"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Urutan Tampilan (Display Order)
            </label>
            <input
              type="number"
              min={1}
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
              className="w-32 bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-navy-950 border border-navy-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-glow-violet transition-colors"
            >
              {editingItem ? 'Simpan Perubahan' : 'Tambah ke Roadmap'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Hapus Fase Roadmap"
        message="Apakah Anda yakin ingin menghapus fase roadmap ini? Perubahan akan langsung tercermin pada halaman publik fokus riset."
        confirmLabel="Hapus Fase"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
