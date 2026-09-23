import React from 'react';
import { Modal } from '../../common/Modal';
import { Member } from '../../../types';
import { Mail, ExternalLink, Award, Tag } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../common/BrandIcons';

interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <Modal isOpen={Boolean(member)} onClose={onClose} title="Profil Peneliti" maxWidth="lg">
      <div className="space-y-6">
        {/* Header with Photo & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md"
          />
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-electric-400 border border-blue-500/20 mb-2">
              {member.category}
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {member.name}
            </h3>
            {member.academic_title && (
              <p className="text-sm font-mono text-slate-600 dark:text-slate-300">
                {member.academic_title}
              </p>
            )}
            <p className="text-xs text-blue-600 dark:text-electric-400 font-medium mt-1">
              {member.position}
            </p>
          </div>
        </div>

        {/* Biography */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            <span>Biografi & Latar Belakang Akademik</span>
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50/40 dark:bg-navy-950/60 p-4 rounded-xl border border-blue-100 dark:border-navy-800">
            {member.biography}
          </p>
        </div>

        {/* Expertise */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Bidang Keahlian & Spesialisasi</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {member.expertise.map((exp) => (
              <span
                key={exp}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-blue-50/80 dark:bg-navy-800 text-blue-800 dark:text-slate-200 border border-blue-100 dark:border-navy-700"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Academic Profiles & Contact */}
        <div className="pt-4 border-t border-blue-100 dark:border-navy-800 flex flex-wrap gap-3">
          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-transparent transition-colors"
          >
            <Mail className="w-4 h-4 text-blue-600 dark:text-electric-400" />
            <span>{member.email}</span>
          </a>

          {member.orcid_url && (
            <a
              href={member.orcid_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-transparent transition-colors"
            >
              <span>ORCID</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {member.google_scholar_url && (
            <a
              href={member.google_scholar_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-xs font-medium text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-transparent transition-colors"
            >
              <span>Google Scholar</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-xs font-medium text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-transparent transition-colors"
            >
              <LinkedinIcon className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}

          {member.github_url && (
            <a
              href={member.github_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-navy-800 dark:hover:bg-navy-700 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
};
