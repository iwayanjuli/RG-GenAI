import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Tag, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../../common/SectionTitle';
import { projectService } from '../../../services/projectService';
import { Project } from '../../../types';

export const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService.getFeatured().then((data) => {
      setProjects(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Aktif
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            Rencana
          </span>
        );
    }
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Inovasi Riset Unggulan"
          title="Proyek Penelitian Terkini"
          subtitle="Inisiatif riset multidisiplin yang memecahkan tantangan riil dalam literasi budaya, efisiensi kurikulum, dan adaptasi AI nusantara."
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-2xl bg-slate-100 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group flex flex-col rounded-2xl bg-white dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 overflow-hidden hover:border-blue-300 dark:hover:border-electric-500/40 shadow-sm shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-2xl transition-all duration-300"
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
                  
                  {/* Status & Year Overlays */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 dark:bg-navy-950/80 backdrop-blur-md text-[11px] font-mono text-slate-700 dark:text-slate-300 border border-blue-200 dark:border-navy-700 flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3 h-3 text-blue-600 dark:text-electric-400" />
                    <span>{project.start_year}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-electric-400 tracking-wide uppercase">
                      {project.research_area_title || 'Generative AI'}
                    </span>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 mb-2.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-electric-300 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                      {project.short_description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-50/80 dark:bg-navy-800/80 text-blue-800 dark:text-slate-300 border border-blue-100 dark:border-navy-700/80"
                        >
                          <Tag className="w-2.5 h-2.5 text-blue-500 dark:text-violet-400" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center justify-between pt-4 border-t border-blue-100 dark:border-navy-800/80 text-xs font-semibold text-blue-600 dark:text-electric-400 group-hover:text-blue-700 dark:group-hover:text-white transition-colors"
                  >
                    <span>Pelajari Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-50 dark:bg-electric-600/10 border border-blue-200 dark:border-electric-500/30 text-blue-700 dark:text-electric-400 hover:bg-blue-600 hover:text-white dark:hover:bg-electric-600 transition-all duration-300 shadow-sm"
          >
            <span>Jelajahi Seluruh Portofolio Proyek</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
