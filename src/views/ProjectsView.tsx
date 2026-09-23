import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionTitle } from '../components/common/SectionTitle';
import { EmptyState } from '../components/common/EmptyState';
import { projectService } from '../services/projectService';
import { researchService } from '../services/researchService';
import { Project, ProjectStatus, ResearchArea } from '../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  FolderKanban, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

export const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [yearFilter, setYearFilter] = useState<string>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Proyek Inovasi Riset | Undiksha GenAI';
    window.scrollTo(0, 0);

    Promise.all([
      projectService.getAll(),
      researchService.getAll()
    ]).then(([projData, areaData]) => {
      setProjects(projData);
      setResearchAreas(areaData);
      setLoading(false);
    });

    const handleUpdate = () => {
      projectService.getAll().then(setProjects);
    };
    window.addEventListener('rg_storage_updated', handleUpdate);
    return () => window.removeEventListener('rg_storage_updated', handleUpdate);
  }, []);

  // Compute unique years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(projects.map(p => p.start_year))).sort((a, b) => b - a);
    return ['Semua', ...years.map(String)];
  }, [projects]);

  // Filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = statusFilter === 'Semua' || p.status === statusFilter;
      const matchYear = yearFilter === 'Semua' || String(p.start_year) === yearFilter;
      const matchCategory = categoryFilter === 'Semua' || p.research_area_id === categoryFilter || p.research_area_title === categoryFilter;

      return matchSearch && matchStatus && matchYear && matchCategory;
    });
  }, [projects, searchQuery, statusFilter, yearFilter, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1;
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Aktif
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Rencana
          </span>
        );
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('Semua');
    setYearFilter('Semua');
    setCategoryFilter('Semua');
    setCurrentPage(1);
  };

  return (
    <div className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Proyek Inovasi' }]} />

      <SectionTitle
        badge="Portofolio Inovasi"
        title="Inisiatif & Proyek Penelitian"
        subtitle="Eksplorasi prototipe cerdas, model fondasi terbuka, dan implementasi nyata solusi AI untuk tantangan pendidikan dan kebudayaan."
      />

      {/* Filter Toolbar */}
      <div className="mb-10 p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 space-y-4 backdrop-blur-md shadow-sm shadow-blue-500/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari judul, teknologi..."
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="Semua">Semua Status</option>
              <option value="Active">Aktif (Active)</option>
              <option value="Completed">Selesai (Completed)</option>
              <option value="Planned">Rencana (Planned)</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="Semua">Semua Tahun</option>
              {availableYears.filter(y => y !== 'Semua').map(yr => (
                <option key={yr} value={yr}>Tahun {yr}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-50 dark:bg-navy-950 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 truncate shadow-sm"
            >
              <option value="Semua">Semua Kategori Riset</option>
              {researchAreas.map(ra => (
                <option key={ra.id} value={ra.title}>{ra.title}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Filter status summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-blue-100 dark:border-navy-800">
          <span>Menemukan <strong className="text-slate-900 dark:text-white">{filteredProjects.length}</strong> proyek</span>
          {(searchQuery || statusFilter !== 'Semua' || yearFilter !== 'Semua' || categoryFilter !== 'Semua') && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 dark:text-electric-400 hover:text-blue-700 dark:hover:text-white font-medium transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 rounded-2xl bg-slate-100 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="Tidak ada proyek yang sesuai"
          description="Coba ubah kriteria pencarian atau pilih kategori dan status lain."
          actionText="Reset Filter"
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group flex flex-col rounded-2xl bg-white dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-electric-500/40 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-2xl transition-all duration-300 overflow-hidden shadow-sm shadow-blue-500/5"
            >
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
                <img
                  src={project.cover_image}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  {getStatusBadge(project.status)}
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-navy-950/80 backdrop-blur-md text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-blue-200 dark:border-navy-700 flex items-center gap-1 shadow-sm">
                  <Calendar className="w-3 h-3 text-blue-600 dark:text-electric-400" />
                  <span>{project.start_year}{project.end_year ? ` - ${project.end_year}` : ''}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-electric-400">
                    {project.research_area_title || 'Generative AI'}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 mb-2.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-electric-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {project.short_description}
                  </p>

                  {/* Leader */}
                  {project.project_leader_name && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      Ketua: <span className="text-slate-800 dark:text-slate-300 font-medium">{project.project_leader_name}</span>
                    </p>
                  )}

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50/80 dark:bg-navy-800 text-blue-800 dark:text-slate-300 border border-blue-100 dark:border-navy-700"
                      >
                        <Tag className="w-2.5 h-2.5 text-blue-500 dark:text-violet-400" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-blue-100 dark:border-navy-800 flex items-center justify-between">
                  <Link
                    to={`/projects/${project.slug}`}
                    className="text-xs font-semibold text-blue-600 dark:text-electric-400 group-hover:text-blue-700 dark:group-hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Detail Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      title="Buka Demo"
                      className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-400 flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white shadow-sm'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
