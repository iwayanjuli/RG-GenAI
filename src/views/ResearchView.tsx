import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionTitle } from '../components/common/SectionTitle';
import { EmptyState } from '../components/common/EmptyState';
import { researchService } from '../services/researchService';
import { projectService } from '../services/projectService';
import { roadmapService } from '../services/roadmapService';
import { ResearchArea, Project, RoadmapItem } from '../types';
import { InteractiveRoadmap } from '../components/modules/research/InteractiveRoadmap';
import { 
  Brain, 
  Database, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  Eye, 
  ShieldCheck, 
  GraduationCap, 
  HeartHandshake, 
  Search, 
  HelpCircle, 
  Wrench, 
  Cpu, 
  FolderKanban, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const ICON_MAP: Record<string, React.ElementType> = {
  Brain,
  Database,
  Bot,
  Sparkles,
  MessageSquare,
  Eye,
  ShieldCheck,
  GraduationCap,
  HeartHandshake,
};

export const ResearchView: React.FC = () => {
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  useEffect(() => { setSearchQuery(searchParams.get('q') || ''); }, [searchParams]);
  const [selectedTag, setSelectedTag] = useState<string>('Semua');
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = () => {
    roadmapService.getAll().then(setRoadmapItems);
  };

  useEffect(() => {
    document.title = 'Fokus & Roadmap Penelitian | Undiksha GenAI';
    window.scrollTo(0, 0);

    Promise.all([
      researchService.getAll(),
      projectService.getAll(),
      roadmapService.getAll()
    ]).then(([areas, projs, rdm]) => {
      setResearchAreas(areas);
      setProjects(projs);
      setRoadmapItems(rdm);
      setLoading(false);
    });

    const handleStorageUpdate = () => {
      fetchRoadmap();
      researchService.getAll().then(setResearchAreas);
    };
    window.addEventListener('rg_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('rg_storage_updated', handleStorageUpdate);
  }, []);

  const filteredAreas = researchAreas.filter((area) => {
    const matchesSearch =
      area.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Fokus & Roadmap Riset' }]} />

      <SectionTitle
        badge="Roadmap & Agenda Riset"
        title="Fokus Penelitian Generative AI"
        subtitle="Mengeksplorasi garis depan perkembangan kecerdasan artifisial melalui 9 bidang kajian strategis yang terintegrasi."
      />

      {/* Interactive Roadmap Pathway Section */}
      <section className="mb-20">
        <InteractiveRoadmap items={roadmapItems} />
      </section>

      {/* Search & Filter bar */}
      <div className="mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bidang riset, pertanyaan riset, teknologi..."
            className="w-full bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
          />
        </div>

        <span className="text-xs text-slate-500 dark:text-slate-400 self-end sm:self-center font-mono">
          Menampilkan {filteredAreas.length} bidang riset
        </span>
      </div>

      {/* Research Areas List */}
      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-navy-900/50 border border-navy-800 animate-pulse" />
          ))}
        </div>
      ) : filteredAreas.length === 0 ? (
        <EmptyState
          title="Bidang riset tidak ditemukan"
          description={`Tidak ada bidang riset yang cocok dengan kata kunci "${searchQuery}".`}
          actionText="Reset Pencarian"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="space-y-10">
          {filteredAreas.map((area, index) => {
            const Icon = ICON_MAP[area.icon] || Brain;
            const relatedProjects = projects.filter(p => p.research_area_id === area.id || p.research_area_title === area.title);

            return (
              <article
                key={area.id}
                id={area.slug}
                className="scroll-mt-24 p-8 rounded-3xl bg-white/95 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-electric-500/40 shadow-sm shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-2xl transition-all duration-300 backdrop-blur-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-blue-100 dark:border-navy-800">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-gradient-to-br dark:from-electric-600/20 dark:to-violet-600/20 border border-blue-200 dark:border-electric-500/40 flex items-center justify-center text-blue-600 dark:text-electric-400 shrink-0">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-blue-600 dark:text-electric-400 font-semibold">
                          Fokus #{index + 1}
                        </span>
                        {area.is_featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-violet-400 border border-blue-500/20">
                            Unggulan
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        {area.title}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">
                        {area.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
                  {/* Col Left: Description & Questions */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Deskripsi Riset
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {area.description}
                      </p>
                    </div>

                    {area.research_questions && area.research_questions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-violet-400" />
                          <span>Pertanyaan Riset Utama (Research Questions)</span>
                        </h4>
                        <ul className="space-y-2 bg-blue-50/50 dark:bg-navy-950/60 p-4 rounded-xl border border-blue-100 dark:border-navy-850">
                          {area.research_questions.map((rq, idx) => (
                            <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                              <span className="text-blue-600 dark:text-electric-400 font-mono font-bold">Q{idx + 1}.</span>
                              <span>{rq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Col Right: Methods, Tech Stack & Related Projects */}
                  <div className="lg:col-span-5 space-y-5">
                    {area.methods && area.methods.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          <span>Metodologi Penelitian</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {area.methods.map((m) => (
                            <span
                              key={m}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50/80 dark:bg-navy-800 text-blue-800 dark:text-slate-300 border border-blue-100 dark:border-navy-700"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {area.technologies && area.technologies.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Teknologi & Framework</span>
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {area.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-navy-950 text-blue-700 dark:text-electric-400 border border-blue-200 dark:border-navy-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related Projects */}
                    {relatedProjects.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                          <FolderKanban className="w-3.5 h-3.5 text-blue-600 dark:text-electric-400" />
                          <span>Proyek Terkait</span>
                        </h4>
                        <div className="space-y-2">
                          {relatedProjects.map((proj) => (
                            <Link
                              key={proj.id}
                              to={`/projects/${proj.slug}`}
                              className="block p-3 rounded-xl bg-slate-50 dark:bg-navy-950/80 hover:bg-blue-50 dark:hover:bg-navy-800 border border-blue-100 dark:border-navy-800 text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-electric-300 transition-colors shadow-sm"
                            >
                              <div className="font-semibold line-clamp-1">{proj.title}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-1">
                                <span>Tahun: {proj.start_year}</span>
                                <span className="text-blue-600 dark:text-electric-400 flex items-center gap-1">
                                  Buka Proyek <ArrowRight className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
