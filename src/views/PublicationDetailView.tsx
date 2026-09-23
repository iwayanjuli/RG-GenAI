import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicationService } from '../services/publicationService';
import { Publication } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { 
  generateAPACitation, 
  generateIEEECitation, 
  downloadBibTeX 
} from '../lib/utils';
import { useToast } from '../context/ToastContext';
import { 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Download, 
  Check, 
  ArrowLeft, 
  FileText, 
  Share2 
} from 'lucide-react';

export const PublicationDetailView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAPA, setCopiedAPA] = useState(false);
  const [copiedIEEE, setCopiedIEEE] = useState(false);
  const [copiedBibTeX, setCopiedBibTeX] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    publicationService.getBySlug(slug).then((data) => {
      setPublication(data);
      if (data) {
        document.title = `${data.title} | Undiksha GenAI Publications`;
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
        <div className="h-8 bg-navy-800 rounded w-1/4" />
        <div className="h-12 bg-navy-900 rounded w-3/4" />
        <div className="h-4 bg-navy-800 rounded w-1/2" />
        <div className="h-48 bg-navy-900 rounded-xl w-full" />
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Publikasi Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400 mb-6">
          Publikasi ilmiah dengan rujukan ini tidak ditemukan di database.
        </p>
        <Link
          to="/publications"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori Publikasi</span>
        </Link>
      </div>
    );
  }

  const apaCitation = generateAPACitation(publication);
  const ieeeCitation = generateIEEECitation(publication);
  const bibtexContent = publication.bibtex || `@article{pub_${publication.id}, title={${publication.title}}, year={${publication.publication_year}}}`;

  const copyText = (text: string, type: 'apa' | 'ieee' | 'bib') => {
    navigator.clipboard.writeText(text);
    if (type === 'apa') {
      setCopiedAPA(true);
      setTimeout(() => setCopiedAPA(false), 2000);
    } else if (type === 'ieee') {
      setCopiedIEEE(true);
      setTimeout(() => setCopiedIEEE(false), 2000);
    } else {
      setCopiedBibTeX(true);
      setTimeout(() => setCopiedBibTeX(false), 2000);
    }
    showToast('Sitasi berhasil disalin ke clipboard!', 'success');
  };

  return (
    <div className="py-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Publikasi Ilmiah', path: '/publications' },
          { label: publication.title }
        ]}
      />

      {/* Header & Meta */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            {publication.publication_type}
          </span>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Tahun {publication.publication_year}
          </span>
          {publication.research_area_title && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-electric-400 border border-blue-500/20">
              {publication.research_area_title}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {publication.title}
        </h1>

        <div className="text-sm text-slate-600 dark:text-slate-300">
          Penulis: <span className="text-slate-900 dark:text-white font-semibold">{publication.authors.join(', ')}</span>
        </div>

        <div className="p-4 rounded-xl bg-white/90 dark:bg-navy-900/80 border border-blue-100 dark:border-navy-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1 shadow-sm">
          <p className="font-semibold text-blue-600 dark:text-electric-400">
            {publication.journal_or_conference}
          </p>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-4 pt-1">
            {publication.publisher && <span>Penerbit: {publication.publisher}</span>}
            {publication.volume && <span>Vol: {publication.volume}</span>}
            {publication.issue && <span>Issue: {publication.issue}</span>}
            {publication.pages && <span>Hal: {publication.pages}</span>}
          </div>
          {publication.doi && (
            <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 pt-1">
              DOI:{' '}
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                {publication.doi}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* External Document CTAs */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        {publication.pdf_url && (
          <a
            href={publication.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/25"
          >
            <BookOpen className="w-4 h-4" />
            <span>Baca Naskah Lengkap (PDF)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {publication.external_url && (
          <a
            href={publication.external_url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-900 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Tautan Indeks Resmi / Publisher</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Abstract */}
      <div className="mb-10">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Abstract</h3>
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white/90 dark:bg-navy-900/50 p-6 rounded-2xl border border-blue-100 dark:border-navy-800 text-justify shadow-sm">
          <p>{publication.abstract}</p>
        </div>
      </div>

      {/* Keywords */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Kata Kunci (Keywords)
        </h3>
        <div className="flex flex-wrap gap-2">
          {publication.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-blue-50/80 dark:bg-navy-900 text-blue-800 dark:text-electric-400 border border-blue-100 dark:border-navy-800"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Citation Box */}
      <div className="mb-10 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-indigo-600 dark:text-violet-400" />
          <span>Format Sitasi Ilmiah</span>
        </h3>

        {/* APA */}
        <div className="p-4 rounded-xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">Format APA 7th Edition:</span>
            <button
              onClick={() => copyText(apaCitation, 'apa')}
              className="text-xs text-blue-600 dark:text-electric-400 hover:text-blue-700 dark:hover:text-white flex items-center gap-1 font-medium"
            >
              {copiedAPA ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAPA ? 'Disalin' : 'Salin'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{apaCitation}</p>
        </div>

        {/* IEEE */}
        <div className="p-4 rounded-xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">Format IEEE:</span>
            <button
              onClick={() => copyText(ieeeCitation, 'ieee')}
              className="text-xs text-blue-600 dark:text-electric-400 hover:text-blue-700 dark:hover:text-white flex items-center gap-1 font-medium"
            >
              {copiedIEEE ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedIEEE ? 'Disalin' : 'Salin'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ieeeCitation}</p>
        </div>

        {/* BibTeX */}
        <div className="p-4 rounded-xl bg-white/90 dark:bg-navy-950 border border-blue-100 dark:border-navy-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-violet-400 font-mono">BibTeX Entry:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => copyText(bibtexContent, 'bib')}
                className="text-xs text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white flex items-center gap-1"
              >
                {copiedBibTeX ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBibTeX ? 'Disalin' : 'Salin'}</span>
              </button>
              <button
                onClick={() => {
                  downloadBibTeX(publication.slug, bibtexContent);
                  showToast('File .bib berhasil diunduh!', 'success');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-violet-400 dark:hover:text-violet-300 flex items-center gap-1 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .bib</span>
              </button>
            </div>
          </div>
          <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre p-2 bg-slate-50 dark:bg-navy-900/70 rounded-lg border border-slate-200 dark:border-transparent">
            {bibtexContent}
          </pre>
        </div>
      </div>

      <div className="pt-6 border-t border-blue-100 dark:border-navy-850">
        <Link
          to="/publications"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Publikasi</span>
        </Link>
      </div>
    </div>
  );
};
