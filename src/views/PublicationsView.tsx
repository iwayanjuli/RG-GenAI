import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionTitle } from '../components/common/SectionTitle';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { publicationService } from '../services/publicationService';
import { statsService } from '../services/statsService';
import { Publication, PublicationType } from '../types';
import { 
  generateAPACitation, 
  generateIEEECitation, 
  downloadBibTeX 
} from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { 
  Search, 
  BookOpen, 
  Copy, 
  Download, 
  ExternalLink, 
  Check, 
  FileCode, 
  BarChart2, 
  ArrowUpDown,
  Tag,
  Share2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { motion } from 'framer-motion';

const PUB_TYPES: ('Semua' | PublicationType)[] = [
  'Semua',
  'Journal Article',
  'Conference Paper',
  'Book Chapter',
  'Research Report',
  'Dataset',
  'Thesis',
  'Intellectual Property'
];

export const PublicationsView: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('Semua');
  const [yearFilter, setYearFilter] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest');
  const [loading, setLoading] = useState(true);

  // Citation Modal State
  const [selectedPubForCitation, setSelectedPubForCitation] = useState<Publication | null>(null);
  const [citationFormat, setCitationFormat] = useState<'APA' | 'IEEE' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  // Recharts Data
  const [statsData, setStatsData] = useState<{
    byYear: { year: number; count: number }[];
    byType: { type: string; count: number }[];
  }>({ byYear: [], byType: [] });

  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Publikasi Ilmiah & Sitasi | Undiksha GenAI';
    window.scrollTo(0, 0);

    Promise.all([
      publicationService.getAll(),
      statsService.getPublicationStats()
    ]).then(([pubs, stats]) => {
      setPublications(pubs);
      setStatsData(stats);
      setLoading(false);
    });

    const handleUpdate = () => {
      publicationService.getAll().then(setPublications);
      statsService.getPublicationStats().then(setStatsData);
    };
    window.addEventListener('rg_storage_updated', handleUpdate);
    return () => window.removeEventListener('rg_storage_updated', handleUpdate);
  }, []);

  // Compute available years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(publications.map(p => p.publication_year))).sort((a, b) => b - a);
    return ['Semua', ...years.map(String)];
  }, [publications]);

  // Filtering & Sorting
  const filteredPublications = useMemo(() => {
    const list = publications.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.authors.some(a => a.toLowerCase().includes(q)) ||
        p.journal_or_conference.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q));

      const matchType = typeFilter === 'Semua' || p.publication_type === typeFilter;
      const matchYear = yearFilter === 'Semua' || String(p.publication_year) === yearFilter;

      return matchSearch && matchType && matchYear;
    });

    return list.sort((a, b) => {
      if (sortBy === 'latest') return b.publication_year - a.publication_year;
      return a.publication_year - b.publication_year;
    });
  }, [publications, searchQuery, typeFilter, yearFilter, sortBy]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportBibTeX = (pub: Publication) => {
    const content = pub.bibtex || `@article{pub_${pub.id}, title={${pub.title}}, year={${pub.publication_year}}}`;
    downloadBibTeX(pub.slug, content);
    showToast(`File BibTeX ${pub.slug}.bib berhasil diunduh!`, 'success');
  };

  const currentCitationText = useMemo(() => {
    if (!selectedPubForCitation) return '';
    if (citationFormat === 'APA') return generateAPACitation(selectedPubForCitation);
    if (citationFormat === 'IEEE') return generateIEEECitation(selectedPubForCitation);
    return selectedPubForCitation.bibtex || `@article{...}`;
  }, [selectedPubForCitation, citationFormat]);

  return (
    <div className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Publikasi Ilmiah' }]} />

      <SectionTitle
        badge="Diseminasi Pengetahuan"
        title="Publikasi Ilmiah & Sitasi Akademik"
        subtitle="Daftar kontribusi ilmiah bereputasi internasional dalam pengembangan model transformator, evaluasi etika, dan digitalisasi budaya nusantara."
      />

      {/* Publication Statistics Charts (Recharts) */}
      <section className="mb-14 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-navy-900/60 border border-blue-100 dark:border-electric-500/30 backdrop-blur-md shadow-xl shadow-blue-500/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-electric-500/10 text-blue-600 dark:text-electric-400 border border-blue-100 dark:border-electric-500/30">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Metrik & Statistik Publikasi Riset</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analisis produktivitas karya ilmiah per tahun dan komposisi jenis publikasi.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: By Year */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-navy-950/80 border border-blue-100 dark:border-navy-800 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Tren Publikasi per Tahun
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.byYear}>
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#93c5fd',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statsData.byYear.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: By Type */}
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-navy-950/80 border border-blue-100 dark:border-navy-800 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">
              Distribusi Kategori Publikasi
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData.byType} layout="vertical">
                  <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} tickLine={false} />
                  <YAxis dataKey="type" type="category" stroke="#64748b" fontSize={10} width={110} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#93c5fd',
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                  />
                  <Bar dataKey="count" fill="#0284c7" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Toolbar */}
      <div className="mb-10 p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 space-y-4 backdrop-blur-md shadow-sm shadow-blue-500/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, penulis, kata kunci..."
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
            >
              {PUB_TYPES.map(type => (
                <option key={type} value={type}>{type === 'Semua' ? 'Semua Jenis Publikasi' : type}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="Semua">Semua Tahun</option>
              {availableYears.filter(y => y !== 'Semua').map(yr => (
                <option key={yr} value={yr}>Tahun {yr}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'oldest')}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="latest">Terbaru ke Terlama</option>
              <option value="oldest">Terlama ke Terbaru</option>
            </select>
          </div>

        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-blue-100 dark:border-navy-800">
          <span>Menemukan <strong className="text-slate-900 dark:text-white">{filteredPublications.length}</strong> publikasi</span>
          {(searchQuery || typeFilter !== 'Semua' || yearFilter !== 'Semua') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('Semua');
                setYearFilter('Semua');
              }}
              className="text-xs text-blue-600 dark:text-electric-400 hover:text-blue-700 dark:hover:text-white font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Publications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 rounded-2xl bg-navy-900/60 border border-navy-800 animate-pulse" />
          ))}
        </div>
      ) : filteredPublications.length === 0 ? (
        <EmptyState
          title="Publikasi tidak ditemukan"
          description="Coba ubah kriteria pencarian atau pilih tahun/jenis publikasi lain."
          actionText="Tampilkan Semua Publikasi"
          onAction={() => {
            setSearchQuery('');
            setTypeFilter('Semua');
            setYearFilter('Semua');
          }}
        />
      ) : (
        <div className="space-y-5">
          {filteredPublications.map((pub, idx) => (
            <motion.article
              key={pub.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="group p-6 sm:p-7 rounded-2xl bg-white dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-violet-500/40 backdrop-blur-md transition-all duration-300 shadow-sm shadow-blue-500/5 hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                {/* Meta details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30">
                      {pub.publication_type}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      Tahun {pub.publication_year}
                    </span>
                    {pub.is_featured && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-electric-400 border border-blue-500/20">
                        Unggulan
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/publications/${pub.slug}`}
                    className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-electric-300 transition-colors leading-snug"
                  >
                    {pub.title}
                  </Link>

                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {pub.authors.join(', ')}
                  </p>

                  <p className="text-xs text-blue-600 dark:text-electric-400 font-medium">
                    {pub.journal_or_conference}
                    {pub.volume ? `, Vol. ${pub.volume}` : ''}
                    {pub.issue ? `, No. ${pub.issue}` : ''}
                    {pub.pages ? `, Hal. ${pub.pages}` : ''}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {pub.abstract}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pub.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50/80 dark:bg-navy-950 text-blue-700 dark:text-slate-400 border border-blue-100 dark:border-navy-800"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  {pub.doi && (
                    <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                      DOI:{' '}
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        {pub.doi}
                      </a>
                    </div>
                  )}
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 self-start">
                  <button
                    onClick={() => {
                      setSelectedPubForCitation(pub);
                      setCitationFormat('APA');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 border border-slate-200 dark:border-navy-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-electric-400" />
                    <span>Sitasi Dokumen</span>
                  </button>

                  <button
                    onClick={() => handleExportBibTeX(pub)}
                    className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 border border-slate-200 dark:border-navy-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-violet-400" />
                    <span>Export BibTeX</span>
                  </button>

                  {pub.pdf_url && (
                    <a
                      href={pub.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-violet-600/10 dark:hover:bg-violet-600 border border-blue-200 dark:border-violet-500/30 text-xs font-semibold text-blue-700 dark:text-violet-300 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Buka Naskah</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <Link
                    to={`/publications/${pub.slug}`}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-navy-950 dark:hover:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white text-center transition-colors shadow-sm"
                  >
                    Detail Lengkap
                  </Link>
                </div>

              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Citation Modal */}
      <Modal
        isOpen={Boolean(selectedPubForCitation)}
        onClose={() => setSelectedPubForCitation(null)}
        title="Salin Sitasi Publikasi"
        maxWidth="xl"
      >
        {selectedPubForCitation && (
          <div className="space-y-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
              {selectedPubForCitation.title}
            </h4>

            {/* Format tabs */}
            <div className="flex gap-2 border-b border-blue-100 dark:border-navy-800 pb-3">
              {(['APA', 'IEEE', 'BibTeX'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    citationFormat === fmt
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Format {fmt}
                </button>
              ))}
            </div>

            {/* Citation Box */}
            <div className="relative p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-blue-100 dark:border-navy-800">
              <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-all leading-relaxed">
                {currentCitationText}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleCopy(currentCitationText)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/25"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Berhasil Disalin!' : 'Salin ke Clipboard'}</span>
              </button>

              {citationFormat === 'BibTeX' && (
                <button
                  onClick={() => handleExportBibTeX(selectedPubForCitation)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-navy-700 transition-colors"
                >
                  <Download className="w-4 h-4 text-indigo-600 dark:text-violet-400" />
                  <span>Download File .bib</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
