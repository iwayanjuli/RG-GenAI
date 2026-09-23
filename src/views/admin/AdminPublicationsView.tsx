import React, { useEffect, useState } from 'react';
import { publicationService } from '../../services/publicationService';
import { researchService } from '../../services/researchService';
import { Publication, PublicationType, ResearchArea } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  ExternalLink,
  Share2
} from 'lucide-react';

const PUB_TYPES: PublicationType[] = [
  'Journal Article',
  'Conference Paper',
  'Book Chapter',
  'Research Report',
  'Dataset',
  'Thesis',
  'Intellectual Property'
];

export const AdminPublicationsView: React.FC = () => {
  const { canDelete, canEdit } = useAuth();
  const { showToast } = useToast();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Semua');
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    publication_type: 'Journal Article' as PublicationType,
    journal_or_conference: '',
    publisher: '',
    publication_year: new Date().getFullYear(),
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    keywords: '',
    pdf_url: '',
    external_url: '',
    bibtex: '',
    research_area_id: '',
    authors: '',
    is_featured: false,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAll = () => {
    Promise.all([
      publicationService.getAll(),
      researchService.getAll()
    ]).then(([pubs, areas]) => {
      setPublications(pubs);
      setResearchAreas(areas);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kelola Publikasi Ilmiah | CMS Admin';
    fetchAll();
  }, []);

  const handleOpenCreate = () => {
    setEditingPub(null);
    setFormData({
      title: '',
      abstract: '',
      publication_type: 'Journal Article',
      journal_or_conference: 'IEEE Access (Q1)',
      publisher: 'IEEE',
      publication_year: new Date().getFullYear(),
      volume: '13',
      issue: '1',
      pages: '100-115',
      doi: '10.1109/ACCESS.2026.0000',
      keywords: 'Generative AI, Large Language Models',
      pdf_url: '',
      external_url: '',
      bibtex: '',
      research_area_id: researchAreas[0]?.id || '',
      authors: 'Dr. I Gede Surya Raharja, Dr. Ni Luh Putu Swastini',
      is_featured: false,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (pub: Publication) => {
    setEditingPub(pub);
    setFormData({
      title: pub.title,
      abstract: pub.abstract,
      publication_type: pub.publication_type,
      journal_or_conference: pub.journal_or_conference,
      publisher: pub.publisher || '',
      publication_year: pub.publication_year,
      volume: pub.volume || '',
      issue: pub.issue || '',
      pages: pub.pages || '',
      doi: pub.doi || '',
      keywords: pub.keywords.join(', '),
      pdf_url: pub.pdf_url || '',
      external_url: pub.external_url || '',
      bibtex: pub.bibtex || '',
      research_area_id: pub.research_area_id || '',
      authors: pub.authors.join(', '),
      is_featured: pub.is_featured,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.authors) {
      showToast('Judul dan nama penulis wajib diisi', 'error');
      return;
    }

    const matchedArea = researchAreas.find(ra => ra.id === formData.research_area_id);

    const payload = {
      title: formData.title,
      abstract: formData.abstract,
      publication_type: formData.publication_type,
      journal_or_conference: formData.journal_or_conference,
      publisher: formData.publisher,
      publication_year: Number(formData.publication_year) || 2026,
      volume: formData.volume,
      issue: formData.issue,
      pages: formData.pages,
      doi: formData.doi,
      keywords: formData.keywords.split(',').map(s => s.trim()).filter(Boolean),
      pdf_url: formData.pdf_url,
      external_url: formData.external_url,
      bibtex: formData.bibtex,
      research_area_id: formData.research_area_id,
      research_area_title: matchedArea?.title,
      authors: formData.authors.split(',').map(s => s.trim()).filter(Boolean),
      is_featured: formData.is_featured,
    };

    try {
      if (editingPub) {
        await publicationService.update(editingPub.id, payload);
        showToast('Publikasi berhasil diperbarui!', 'success');
      } else {
        await publicationService.create(payload);
        showToast('Publikasi ilmiah baru berhasil didaftarkan!', 'success');
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
      await publicationService.delete(deletingId);
      showToast('Publikasi berhasil dihapus', 'success');
      setDeletingId(null);
      fetchAll();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (pub: Publication) => {
    try {
      await publicationService.update(pub.id, { is_featured: !pub.is_featured });
      showToast(`Status unggulan publikasi diperbarui`, 'info');
      fetchAll();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = publications.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.journal_or_conference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'Semua' || p.publication_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Manajemen Publikasi Ilmiah & Sitasi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftarkan jurnal, prosiding konferensi, dataset terbuka, serta kode entri BibTeX.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Publikasi Baru</span>
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
            placeholder="Cari publikasi atau penulis..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Semua">Semua Jenis Publikasi</option>
            {PUB_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat publikasi...</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Publikasi tidak ditemukan" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-800">
              <tr>
                <th className="py-3.5 px-4">Judul Publikasi</th>
                <th className="py-3.5 px-4">Penulis & Jurnal</th>
                <th className="py-3.5 px-4">Tahun</th>
                <th className="py-3.5 px-4">Unggulan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((pub) => (
                <tr key={pub.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4 max-w-sm">
                    <span className="font-bold text-white block line-clamp-2">{pub.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 inline-block mt-1">
                      {pub.publication_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs">
                    <span className="text-slate-200 block truncate">{pub.authors.join(', ')}</span>
                    <span className="text-[11px] text-cyan-400 block truncate">{pub.journal_or_conference}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {pub.publication_year}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleFeatured(pub)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        pub.is_featured
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-navy-800 border-navy-700 text-slate-500'
                      }`}
                      title={pub.is_featured ? 'Unggulan' : 'Bukan Unggulan'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEdit(pub)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(pub.id)}
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
        title={editingPub ? 'Edit Publikasi Ilmiah' : 'Tambah Publikasi Ilmiah Baru'}
        maxWidth="2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Judul Lengkap Naskah *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="AksaraGen: Vision-Language Transformer..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Daftar Penulis (Pisahkan koma) *</label>
            <input
              type="text"
              required
              value={formData.authors}
              onChange={e => setFormData({ ...formData, authors: e.target.value })}
              placeholder="Dr. Ni Luh Putu Swastini, Dr. I Gede Surya Raharja"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Publikasi</label>
              <select
                value={formData.publication_type}
                onChange={e => setFormData({ ...formData, publication_type: e.target.value as PublicationType })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {PUB_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun Publikasi</label>
              <input
                type="number"
                value={formData.publication_year}
                onChange={e => setFormData({ ...formData, publication_year: Number(e.target.value) })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">DOI</label>
              <input
                type="text"
                value={formData.doi}
                onChange={e => setFormData({ ...formData, doi: e.target.value })}
                placeholder="10.1109/..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Jurnal / Konferensi *</label>
              <input
                type="text"
                required
                value={formData.journal_or_conference}
                onChange={e => setFormData({ ...formData, journal_or_conference: e.target.value })}
                placeholder="IEEE Access / ACL 2024"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Penerbit (Publisher)</label>
              <input
                type="text"
                value={formData.publisher}
                onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="IEEE / Elsevier / Springer"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Volume</label>
              <input
                type="text"
                value={formData.volume}
                onChange={e => setFormData({ ...formData, volume: e.target.value })}
                placeholder="13"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Issue / Nomor</label>
              <input
                type="text"
                value={formData.issue}
                onChange={e => setFormData({ ...formData, issue: e.target.value })}
                placeholder="2"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Halaman</label>
              <input
                type="text"
                value={formData.pages}
                onChange={e => setFormData({ ...formData, pages: e.target.value })}
                placeholder="11204-11219"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Abstract</label>
            <textarea
              rows={3}
              value={formData.abstract}
              onChange={e => setFormData({ ...formData, abstract: e.target.value })}
              placeholder="Abstrak naskah..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Kunci (Pisahkan koma)</label>
            <input
              type="text"
              value={formData.keywords}
              onChange={e => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="Vision-Language Models, OCR, Lontar Bali"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">BibTeX Entry (Opsional)</label>
            <textarea
              rows={3}
              value={formData.bibtex}
              onChange={e => setFormData({ ...formData, bibtex: e.target.value })}
              placeholder="@article{...}"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL PDF Naskah</label>
              <input
                type="url"
                value={formData.pdf_url}
                onChange={e => setFormData({ ...formData, pdf_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">URL Indeks Eksternal</label>
              <input
                type="url"
                value={formData.external_url}
                onChange={e => setFormData({ ...formData, external_url: e.target.value })}
                placeholder="https://doi.org/..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="pub_feat_cb"
              checked={formData.is_featured}
              onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded bg-navy-950 border-navy-800 text-cyan-600 focus:ring-0"
            />
            <label htmlFor="pub_feat_cb" className="text-xs text-slate-300">Sorot publikasi ini di Halaman Beranda</label>
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
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              {editingPub ? 'Simpan Perubahan' : 'Daftarkan Publikasi'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Publikasi Ilmiah"
        message="Yakin ingin menghapus publikasi ilmiah ini dari basis data?"
      />
    </div>
  );
};
