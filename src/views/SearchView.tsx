import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, LoaderCircle } from 'lucide-react';
import { projectService } from '../services/projectService';
import { publicationService } from '../services/publicationService';
import { researchService } from '../services/researchService';
import { memberService } from '../services/memberService';

type Category = 'Proyek' | 'Publikasi' | 'Bidang Riset' | 'Anggota';
interface Result { id: string; title: string; description: string; category: Category; href: string; terms: string; }
const categories: Category[] = ['Proyek', 'Publikasi', 'Bidang Riset', 'Anggota'];
const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id').replace(/\s+/g, ' ').trim();

export const SearchView: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || 'Semua';
  const [items, setItems] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(20);

  useEffect(() => { document.title = 'Pencarian | Undiksha GenAI'; window.scrollTo(0, 0); }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    const sources = [
      projectService.getAll().then(rows => rows.map(p => ({ id: p.id, title: p.title, description: p.short_description, category: 'Proyek' as Category, href: `/projects/${p.slug}`, terms: [p.title, p.description, p.short_description, p.research_area_title, p.project_leader_name, p.status, p.start_year, ...p.technologies, ...p.partners].join(' ') }))),
      publicationService.getAll().then(rows => rows.map(p => ({ id: p.id, title: p.title, description: `${p.authors.join(', ')} · ${p.publication_year} · ${p.journal_or_conference}`, category: 'Publikasi' as Category, href: `/publications/${p.slug}`, terms: [p.title, p.abstract, ...p.authors, ...p.keywords, p.publication_year, p.doi, p.publication_type, p.journal_or_conference].join(' ') }))),
      researchService.getAll().then(rows => rows.map(p => ({ id: p.id, title: p.title, description: p.summary, category: 'Bidang Riset' as Category, href: `/research?q=${encodeURIComponent(p.title)}`, terms: [p.title, p.summary, p.description, ...p.technologies, ...p.methods, ...p.research_questions].join(' ') }))),
      memberService.getAll().then(rows => rows.filter(p => p.is_active).map(p => ({ id: p.id, title: p.name, description: `${p.position} · ${p.expertise.join(', ')}`, category: 'Anggota' as Category, href: `/about?member=${encodeURIComponent(p.id)}#members`, terms: [p.name, p.academic_title, p.position, p.biography, p.category, ...p.expertise].join(' ') }))),
    ];
    Promise.allSettled(sources).then(results => {
      if (!active) return;
      setItems(results.flatMap(result => result.status === 'fulfilled' ? result.value : []));
      setFailed(results.flatMap((result, index) => result.status === 'rejected' ? [categories[index]] : []));
      setLoading(false);
    });
    return () => { active = false; };
  }, [attempt]);

  const tokens = normalize(query).split(' ').filter(Boolean);
  const results = items.filter(item => (category === 'Semua' || item.category === category) && tokens.every(token => normalize(item.terms).includes(token)))
    .sort((a, b) => Number(normalize(b.title).includes(normalize(query))) - Number(normalize(a.title).includes(normalize(query))));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24">
      <p className="text-sm font-semibold text-blue-600 dark:text-electric-400 mb-3">Jelajahi penelitian kami</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Cari informasi yang Anda perlukan</h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400">Temukan proyek, publikasi, bidang riset, dan anggota tim melalui judul, nama, teknologi, atau kata kunci.</p>
      <form role="search" className="mt-8 flex gap-2" onSubmit={event => {
        event.preventDefault();
        const value = new FormData(event.currentTarget).get('q') as string;
        setParams({ q: value.trim(), category }); setVisible(20);
      }}>
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input key={query} name="q" type="search" defaultValue={query} aria-label="Kata kunci pencarian" placeholder="Misalnya: RAG, bahasa Bali, atau nama peneliti" className="w-full rounded-xl border border-blue-100 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 font-semibold">Cari</button>
      </form>
      <div className="flex flex-wrap gap-2 my-6" aria-label="Filter jenis hasil">
        {['Semua', ...categories].map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => { setParams({ q: query, category: value }); setVisible(20); }} className={`px-4 py-2 rounded-full text-sm border transition-colors ${category === value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-navy-900 border-blue-100 dark:border-navy-700 text-slate-600 dark:text-slate-300 hover:border-blue-500'}`}>{value}</button>)}
      </div>
      {failed.length > 0 && <div role="alert" className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 text-amber-800 dark:text-amber-200">Data {failed.join(', ')} belum dapat dimuat. <button type="button" className="underline font-semibold" onClick={() => setAttempt(value => value + 1)}>Coba lagi</button></div>}
      <div aria-live="polite" aria-busy={loading}>
        {loading ? <p className="flex items-center gap-2 py-10 text-slate-500"><LoaderCircle className="w-5 h-5 animate-spin" />Memuat data pencarian...</p> : !tokens.length ? <div className="rounded-2xl border border-dashed border-blue-200 dark:border-navy-700 p-8 text-center text-slate-500 dark:text-slate-400">Masukkan kata kunci untuk mulai mencari.</div> : <>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{results.length} hasil untuk <strong className="text-slate-800 dark:text-slate-200">“{query}”</strong></p>
          {results.length === 0 && <div className="rounded-2xl bg-blue-50 dark:bg-navy-900 p-8 text-center"><h2 className="font-semibold text-slate-900 dark:text-white">Belum ada hasil yang cocok</h2><p className="mt-2 text-slate-500 dark:text-slate-400">Coba kata kunci yang lebih singkat atau pilih kategori Semua.</p></div>}
          <div className="space-y-3">{results.slice(0, visible).map(item => <Link key={`${item.category}-${item.id}`} to={item.href} className="group flex items-center justify-between gap-4 p-5 rounded-2xl border border-blue-100 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-blue-400 dark:hover:border-electric-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
            <div className="min-w-0"><span className="text-xs font-semibold text-blue-600 dark:text-electric-400">{item.category}</span><h2 className="mt-1 font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-electric-400">{item.title}</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p></div><ArrowRight aria-hidden="true" className="w-5 h-5 shrink-0 text-blue-500" />
          </Link>)}</div>
          {visible < results.length && <button type="button" onClick={() => setVisible(value => value + 20)} className="mt-6 rounded-xl border border-blue-200 dark:border-navy-700 px-5 py-3 text-blue-600 dark:text-electric-400">Tampilkan lebih banyak</button>}
        </>}
      </div>
    </div>
  );
};
