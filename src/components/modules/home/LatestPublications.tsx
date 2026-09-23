import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Copy, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../../common/SectionTitle';
import { publicationService } from '../../../services/publicationService';
import { Publication } from '../../../types';
import { generateAPACitation } from '../../../lib/utils';
import { useToast } from '../../../context/ToastContext';

export const LatestPublications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    publicationService.getLatest(4).then((data) => {
      setPublications(data);
      setLoading(false);
    });
  }, []);

  const handleCopyCitation = (pub: Publication) => {
    const citation = generateAPACitation(pub);
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    showToast('Sitasi format APA berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section className="py-20 relative bg-slate-50/60 dark:bg-navy-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Diseminasi Ilmiah"
          title="Publikasi Riset Terkini"
          subtitle="Kontribusi akademik di jurnal internasional bereputasi (Q1/Q2 Scopus) dan konferensi prestisius di bidang kecerdasan artifisial."
        />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-white dark:bg-navy-950/70 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-violet-500/40 backdrop-blur-md transition-all duration-300 shadow-sm shadow-blue-500/5 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/30">
                      {pub.publication_type}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {pub.publication_year}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-xs font-medium text-blue-600 dark:text-electric-400">
                      {pub.journal_or_conference}
                    </span>
                  </div>

                  <Link
                    to={`/publications/${pub.slug}`}
                    className="block text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-electric-300 transition-colors leading-snug"
                  >
                    {pub.title}
                  </Link>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Penulis: <span className="text-slate-800 dark:text-slate-300 font-medium">{pub.authors.join(', ')}</span>
                  </p>

                  {pub.doi && (
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      DOI: <span className="text-slate-600 dark:text-slate-400">{pub.doi}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => handleCopyCitation(pub)}
                    aria-label="Salin sitasi format APA"
                    title="Salin Sitasi APA"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-navy-900 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    {copiedId === pub.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sitasi</span>
                      </>
                    )}
                  </button>

                  {pub.external_url && (
                    <a
                      href={pub.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white dark:bg-violet-600/10 dark:hover:bg-violet-600 border border-blue-200 dark:border-violet-500/30 text-blue-700 dark:text-violet-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Buka Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/publications"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition-all shadow-sm"
          >
            <span>Buka Seluruh Direktori Publikasi & Grafik Statistik</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
