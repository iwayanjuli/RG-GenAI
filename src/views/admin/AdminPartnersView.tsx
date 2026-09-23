import React, { useEffect, useState } from 'react';
import { partnerService } from '../../services/partnerService';
import { Partner, PartnershipType } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Handshake, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ExternalLink 
} from 'lucide-react';

const PARTNER_TYPES: PartnershipType[] = [
  'Government',
  'Industry',
  'Academic',
  'Community'
];

export const AdminPartnersView: React.FC = () => {
  const { canDelete, canEdit } = useAuth();
  const { showToast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    description: '',
    partnership_type: 'Academic' as PartnershipType,
    is_active: true,
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPartners = () => {
    partnerService.getAll().then((data) => {
      setPartners(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = 'Kelola Mitra Kerjasama | CMS Admin';
    fetchPartners();
  }, []);

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      logo_url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&h=100&q=80',
      website_url: '',
      description: '',
      partnership_type: 'Academic',
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prt: Partner) => {
    setEditingPartner(prt);
    setFormData({
      name: prt.name,
      logo_url: prt.logo_url,
      website_url: prt.website_url || '',
      description: prt.description,
      partnership_type: prt.partnership_type,
      is_active: prt.is_active,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Nama mitra wajib diisi', 'error');
      return;
    }

    const payload = {
      name: formData.name,
      logo_url: formData.logo_url || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&h=100&q=80',
      website_url: formData.website_url,
      description: formData.description,
      partnership_type: formData.partnership_type,
      is_active: formData.is_active,
    };

    try {
      if (editingPartner) {
        await partnerService.update(editingPartner.id, payload);
        showToast('Data mitra berhasil diperbarui!', 'success');
      } else {
        await partnerService.create(payload);
        showToast('Mitra baru berhasil ditambahkan!', 'success');
      }
      setIsFormOpen(false);
      fetchPartners();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await partnerService.delete(deletingId);
      showToast('Mitra berhasil dihapus', 'success');
      setDeletingId(null);
      fetchPartners();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleActive = async (prt: Partner) => {
    try {
      await partnerService.update(prt.id, { is_active: !prt.is_active });
      showToast(`Status kemitraan ${prt.name} diperbarui`, 'info');
      fetchPartners();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const filtered = partners.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.partnership_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Handshake className="w-5 h-5 text-emerald-400" />
            <span>Manajemen Mitra Kerjasama</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola institusi pemerintah, konsorsium universitas, dan mitra industri global.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-emerald"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra Baru</span>
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
            placeholder="Cari nama mitra..."
            className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Memuat data mitra...</div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Mitra tidak ditemukan" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-navy-800 bg-navy-900/40">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-navy-800">
              <tr>
                <th className="py-3.5 px-4">Nama Mitra</th>
                <th className="py-3.5 px-4">Tipe Kemitraan</th>
                <th className="py-3.5 px-4">Deskripsi</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filtered.map((prt) => (
                <tr key={prt.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={prt.logo_url}
                        alt={prt.name}
                        className="w-10 h-8 rounded-lg object-cover bg-navy-950 border border-navy-700 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block">{prt.name}</span>
                        {prt.website_url && (
                          <a
                            href={prt.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-electric-400 hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>Website</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-navy-800 text-slate-300 border border-navy-700">
                      {prt.partnership_type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs line-clamp-1">
                    {prt.description}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleActive(prt)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
                        prt.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {prt.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{prt.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleOpenEdit(prt)}
                          className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => setDeletingId(prt.id)}
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
        title={editingPartner ? 'Edit Data Mitra' : 'Tambah Mitra Baru'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Mitra / Lembaga *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: NVIDIA Inception"
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipe Kemitraan</label>
              <select
                value={formData.partnership_type}
                onChange={e => setFormData({ ...formData, partnership_type: e.target.value as PartnershipType })}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {PARTNER_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website Resmi</label>
              <input
                type="url"
                value={formData.website_url}
                onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL Logo Mitra</label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Deskripsi Kerjasama</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Bentuk dukungan komputasi, validasi data, dll..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="prt_active_cb"
              checked={formData.is_active}
              onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded bg-navy-950 border-navy-800 text-emerald-600 focus:ring-0"
            />
            <label htmlFor="prt_active_cb" className="text-xs text-slate-300">Tampilkan logo di website publik</label>
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              {editingPartner ? 'Simpan Perubahan' : 'Tambah Mitra'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Mitra"
        message="Yakin ingin menghapus mitra ini?"
      />
    </div>
  );
};
