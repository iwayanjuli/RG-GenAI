import React, { useEffect, useState } from 'react';
import { projectService } from '../../services/projectService';
import { researchService } from '../../services/researchService';
import { memberService } from '../../services/memberService';
import { Project, ProjectStatus, ResearchArea, Member } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const AdminProjectsView: React.FC = () => {
  const { canDelete, canEdit } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    cover_image: '',
    start_year: 2024,
    end_year: 2026,
    status: 'Active' as ProjectStatus,
    research_area_id: '',
    project_leader_id: '',
    funding_source: '',
    partners: '',
    technologies: '',
    objectives: '',
    outcomes: '',
    demo_url: '',
    github_url: '',
    document_url: '',
    is_featured: false,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAll = () => {
    Promise.all([
      projectService.getAll(),
      researchService.getAll(),
      memberService.getAll()
    ]).then(([projs, areas, mems]) => {
      setProjects(projs);
      setResearchAreas(areas);
      setMembers(mems);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kelola Proyek Inovasi | CMS Admin';
    fetchAll();
  }, []);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      short_description: '',
      description: '',
      cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      start_year: new Date().getFullYear(),
      end_year: new Date().getFullYear() + 2,
      status: 'Active',
      research_area_id: researchAreas[0]?.id || '',
      project_leader_id: members[0]?.id || '',
      funding_source: 'DIPA Undiksha 2026',
      partners: 'Kemendikbudristek, BRIN',
      technologies: 'PyTorch, FastAPI, React',
      objectives: 'Pengembangan model\nEvaluasi akurasi',
      outcomes: 'Publikasi Jurnal Q1\nPrototipe sistem',
      demo_url: '',
      github_url: '',
      document_url: '',
      is_featured: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      short_description: p.short_description,
      description: p.description,
      cover_image: p.cover_image,
      start_year: p.start_year,
      end_year: p.end_year || p.start_year,
      status: p.status,
      research_area_id: p.research_area_id || '',
      project_leader_id: p.project_leader_id || '',
      funding_source: p.funding_source || '',
      partners: p.partners ? p.partners.join(', ') : '',
      technologies: p.technologies ? p.technologies.join(', ') : '',
      objectives: p.objectives ? p.objectives.join('\n') : '',
      outcomes: p.outcomes ? p.outcomes.join('\n') : '',
      demo_url: p.demo_url || '',
      github_url: p.github_url || '',
      document_url: p.document_url || '',
      is_featured: p.is_featured,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.short_description) {
      showToast('Judul dan deskripsi singkat wajib diisi', 'error');
      return;
    }

    const matchedArea = researchAreas.find(ra => ra.id === formData.research_area_id);
    const matchedLeader = members.find(m => m.id === formData.project_leader_id);

    const payload = {
      title: formData.title,
      short_description: formData.short_description,
      description: formData.description,
      cover_image: formData.cover_image,
      start_year: Number(formData.start_year) || 2025,
      end_year: formData.end_year ? Number(formData.end_year) : undefined,
      status: formData.status,
      research_area_id: formData.research_area_id,
      research_area_title: matchedArea?.title,
      project_leader_id: formData.project_leader_id,
      project_leader_name: matchedLeader ? `${matchedLeader.name}, ${matchedLeader.academic_title || ''}` : undefined,
      funding_source: formData.funding_source,
      partners: formData.partners.split(',').map(s => s.trim()).filter(Boolean),
      technologies: formData.technologies.split(',').map(s => s.trim()).filter(Boolean),
      objectives: formData.objectives.split('\n').map(s => s.trim()).filter(Boolean),
      outcomes: formData.outcomes.split('\n').map(s => s.trim()).filter(Boolean),
      demo_url: formData.demo_url,
      github_url: formData.github_url,
      document_url: formData.document_url,
      is_featured: formData.is_featured,
    };

    try {
      if (editingProject) {
        await projectService.update(editingProject.id, payload);
        showToast('Proyek riset berhasil diperbarui!', 'success');
      } else {
        await projectService.create(payload);
        showToast('Proyek baru berhasil dipublikasikan!', 'success');
      }
      setIsFormOpen(false);
      fetchAll();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await projectService.delete(deletingId);
      showToast('Proyek berhasil dihapus', 'success');
      setDeletingId(null);
      fetchAll();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (p: Project) => {
    try {
      await projectService.update(p.id, { is_featured: !p.is_featured });
      showToast(`Status sorotan proyek ${p.title} diubah`, 'info');
      fetchAll();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-electric-400" />
            <span>Manajemen Proyek Inovasi Riset</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Publikasikan inisiatif proyek, atur status pelaksanaan, teknologi, dan tautan demo interaktif.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-blue"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Baru</span>
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
            placeholder="Cari proyek riset..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat katalog proyek...</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Proyek tidak ditemukan" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-800">
              <tr>
                <th className="py-3.5 px-4">Proyek</th>
                <th className="py-3.5 px-4">Tahun</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Unggulan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="w-12 h-9 rounded-lg object-cover bg-navy-950 border border-navy-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-white block truncate">{p.title}</span>
                        <span className="text-[10px] text-electric-400">{p.research_area_title || 'Generative AI'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {p.start_year}{p.end_year ? ` - ${p.end_year}` : ''}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : p.status === 'Completed'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        p.is_featured
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-navy-800 border-navy-700 text-slate-500'
                      }`}
                      title={p.is_featured ? 'Unggulan di Beranda' : 'Bukan Unggulan'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(p.id)}
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

      {/* Modal Form */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingProject ? 'Edit Proyek Penelitian' : 'Tambah Proyek Baru'}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Proyek *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Contoh: AksaraGen-VLM: Model Digitalisasi Lontar..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Singkat (Short Description) *</label>
            <textarea
              rows={2}
              required
              value={formData.short_description}
              onChange={e => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="1-2 kalimat ringkasan yang menarik..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Lengkap</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Latar belakang, problem komputasi, pendekatan riset..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status Proyek</label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              >
                <option value="Active">Active (Aktif)</option>
                <option value="Completed">Completed (Selesai)</option>
                <option value="Planned">Planned (Rencana)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun Mulai</label>
              <input
                type="number"
                value={formData.start_year}
                onChange={e => setFormData({ ...formData, start_year: Number(e.target.value) })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun Selesai</label>
              <input
                type="number"
                value={formData.end_year}
                onChange={e => setFormData({ ...formData, end_year: Number(e.target.value) })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Bidang Riset Terkait</label>
              <select
                value={formData.research_area_id}
                onChange={e => setFormData({ ...formData, research_area_id: e.target.value })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              >
                <option value="">Pilih Bidang Riset</option>
                {researchAreas.map(ra => (
                  <option key={ra.id} value={ra.id}>{ra.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ketua Proyek</label>
              <select
                value={formData.project_leader_id}
                onChange={e => setFormData({ ...formData, project_leader_id: e.target.value })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              >
                <option value="">Pilih Peneliti</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Sumber Pendanaan (Funding)</label>
              <input
                type="text"
                value={formData.funding_source}
                onChange={e => setFormData({ ...formData, funding_source: e.target.value })}
                placeholder="Hibah DIKTI / DIPA Undiksha"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Gambar Sampul</label>
              <input
                type="url"
                value={formData.cover_image}
                onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mitra Kolaborasi (Pisahkan koma)</label>
              <input
                type="text"
                value={formData.partners}
                onChange={e => setFormData({ ...formData, partners: e.target.value })}
                placeholder="BRIN, NVIDIA, Balai Bahasa"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Teknologi (Pisahkan koma)</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="PyTorch, LangChain, Qdrant"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Demo URL</label>
              <input
                type="url"
                value={formData.demo_url}
                onChange={e => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://demo..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Repositori</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dokumen / PDF URL</label>
              <input
                type="url"
                value={formData.document_url}
                onChange={e => setFormData({ ...formData, document_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-electric-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="proj_feat_cb"
              checked={formData.is_featured}
              onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded bg-navy-950 border-navy-800 text-electric-600 focus:ring-0"
            />
            <label htmlFor="proj_feat_cb" className="text-xs text-slate-300">Tampilkan sebagai proyek unggulan di Halaman Beranda</label>
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
              className="px-5 py-2 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold"
            >
              {editingProject ? 'Simpan Perubahan' : 'Publikasikan Proyek'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Proyek Riset"
        message="Apakah Anda yakin ingin menghapus proyek penelitian ini?"
      />
    </div>
  );
};
