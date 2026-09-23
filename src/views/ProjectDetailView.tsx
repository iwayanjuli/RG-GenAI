import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { 
  Calendar, 
  ExternalLink, 
  FileText, 
  Users, 
  Target, 
  Award, 
  Building, 
  Cpu, 
  CheckCircle2, 
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { GithubIcon } from '../components/common/BrandIcons';

export const ProjectDetailView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;
    projectService.getBySlug(slug).then((data) => {
      setProject(data);
      if (data) {
        document.title = `${data.title} | Undiksha GenAI Research`;
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
        <div className="h-8 bg-navy-800 rounded w-1/4" />
        <div className="h-64 bg-navy-900 rounded-2xl w-full" />
        <div className="h-10 bg-navy-800 rounded w-3/4" />
        <div className="h-32 bg-navy-900 rounded-xl w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Proyek Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400 mb-6">
          Proyek riset dengan URL ini tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Proyek</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'Proyek Inovasi', path: '/projects' },
          { label: project.title }
        ]}
      />

      {/* Hero Header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-electric-400 border border-blue-500/20">
            {project.research_area_title || 'Generative AI'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Status: {project.status}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 ml-auto">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-electric-400" />
            <span>{project.start_year}{project.end_year ? ` - ${project.end_year}` : ''}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {project.title}
        </h1>

        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {project.short_description}
        </p>
      </div>

      {/* Main Cover Image */}
      <div className="relative rounded-3xl overflow-hidden border border-blue-100 dark:border-navy-800 shadow-xl mb-12 h-72 sm:h-96 bg-slate-100 dark:bg-navy-950">
        <img
          src={project.cover_image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
      </div>

      {/* Key Action Links */}
      {(project.demo_url || project.github_url || project.document_url) && (
        <div className="mb-12 p-5 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-electric-500/30 flex flex-wrap items-center gap-4 shadow-sm">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-500/25"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Demo Interaktif</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-navy-700 transition-colors shadow-sm"
            >
              <GithubIcon className="w-4 h-4 text-indigo-600 dark:text-violet-400" />
              <span>Repositori Kode (GitHub)</span>
            </a>
          )}
          {project.document_url && (
            <a
              href={project.document_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-200 dark:border-navy-700 transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Dokumen / Laporan Riset</span>
            </a>
          )}
        </div>
      )}

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Full Description, Objectives, Outcomes */}
        <div className="lg:col-span-8 space-y-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Tentang Proyek Riset</h3>
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 bg-white/90 dark:bg-navy-900/40 p-6 rounded-2xl border border-blue-100 dark:border-navy-800 shadow-sm">
              <p>{project.description}</p>
            </div>
          </div>

          {project.objectives && project.objectives.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-electric-400" />
                <span>Target & Sasaran Penelitian</span>
              </h3>
              <ul className="space-y-2.5 bg-white/90 dark:bg-navy-900/40 p-6 rounded-2xl border border-blue-100 dark:border-navy-800 shadow-sm">
                {project.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-electric-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.outcomes && project.outcomes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600 dark:text-violet-400" />
                <span>Hasil & Luaran Riset (Outcomes)</span>
              </h3>
              <ul className="space-y-2.5 bg-white/90 dark:bg-navy-900/40 p-6 rounded-2xl border border-blue-100 dark:border-navy-800 shadow-sm">
                {project.outcomes.map((out, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-violet-400 shrink-0 mt-2" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                <span>Galeri Dokumentasi Riset</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((img) => (
                  <div key={img.id} className="rounded-2xl overflow-hidden border border-blue-100 dark:border-navy-800 bg-slate-100 dark:bg-navy-950 shadow-sm">
                    <img
                      src={img.image_url}
                      alt={img.caption || 'Dokumentasi riset'}
                      className="w-full h-48 object-cover"
                    />
                    {img.caption && (
                      <p className="p-3 text-[11px] text-slate-600 dark:text-slate-400 bg-white/90 dark:bg-navy-900/80 leading-snug">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Metadata, Team, Funding, Technologies */}
        <div className="lg:col-span-4 space-y-6">
          {/* Project Leader & Team */}
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 space-y-4 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600 dark:text-electric-400" />
              <span>Tim Peneliti</span>
            </h4>

            {project.project_leader_name && (
              <div>
                <span className="text-[10px] text-blue-600 dark:text-electric-400 font-semibold uppercase">Ketua Proyek:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{project.project_leader_name}</p>
              </div>
            )}

            {project.team_members && project.team_members.length > 0 && (
              <div className="pt-2 border-t border-blue-100 dark:border-navy-800 space-y-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Anggota Peneliti:</span>
                {project.team_members.map((tm) => (
                  <div key={tm.id} className="text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="font-medium text-slate-900 dark:text-white">{tm.name}</span>
                    <span className="text-[10px] text-slate-500">{tm.role}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Funding & Partners */}
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 space-y-4 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-indigo-600 dark:text-violet-400" />
              <span>Pendanaan & Mitra</span>
            </h4>

            {project.funding_source && (
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Sumber Dana:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed font-medium">
                  {project.funding_source}
                </p>
              </div>
            )}

            {project.partners && project.partners.length > 0 && (
              <div className="pt-2 border-t border-blue-100 dark:border-navy-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">Mitra Kolaborasi:</span>
                <ul className="space-y-1">
                  {project.partners.map((partner, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>{partner}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 space-y-3 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Teknologi yang Digunakan</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-navy-950 text-blue-700 dark:text-electric-400 border border-blue-200 dark:border-navy-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Proyek</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
