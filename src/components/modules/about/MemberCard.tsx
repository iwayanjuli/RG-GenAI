import React from 'react';
import { Member } from '../../../types';
import { Mail, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon } from '../../common/BrandIcons';

interface MemberCardProps {
  member: Member;
  onSelect: (member: Member) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group rounded-2xl bg-white dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-electric-500/40 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-2xl hover:-translate-y-1"
    >
      <div>
        {/* Avatar & Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-navy-950 border border-blue-100 dark:border-navy-700 shrink-0 shadow-sm">
            <img
              src={member.photo_url}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-electric-400 border border-blue-500/20 mb-1 truncate max-w-full">
              {member.category}
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-electric-300 transition-colors truncate">
              {member.name}
            </h3>
            {member.academic_title && (
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
                {member.academic_title}
              </p>
            )}
          </div>
        </div>

        {/* Position */}
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-3 line-clamp-1">
          {member.position}
        </p>

        {/* Biography */}
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
          {member.biography}
        </p>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {member.expertise.slice(0, 3).map((exp) => (
            <span
              key={exp}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50/80 dark:bg-navy-800 text-blue-800 dark:text-slate-300 border border-blue-100 dark:border-navy-700"
            >
              {exp}
            </span>
          ))}
          {member.expertise.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{member.expertise.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer & Social Academic Links */}
      <div className="pt-4 border-t border-blue-100 dark:border-navy-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {member.google_scholar_url && (
            <a
              href={member.google_scholar_url}
              target="_blank"
              rel="noreferrer"
              title="Google Scholar"
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-transparent transition-colors"
            >
              <span className="text-[10px] font-bold font-mono">GS</span>
            </a>
          )}
          {member.github_url && (
            <a
              href={member.github_url}
              target="_blank"
              rel="noreferrer"
              title="GitHub Profile"
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-transparent transition-colors"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              title="LinkedIn Profile"
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-transparent transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              title={member.email}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-transparent transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <button
          onClick={() => onSelect(member)}
          className="text-xs font-semibold text-blue-600 dark:text-electric-400 hover:text-blue-700 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Profil</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
