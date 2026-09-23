import React from 'react';
import { SearchX, Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'search' | 'database';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada data ditemukan',
  description = 'Coba ubah kata kunci pencarian atau sesuaikan filter yang Anda gunakan.',
  actionText,
  onAction,
  icon = 'search',
}) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-navy-900 border border-navy-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
        {icon === 'search' ? <SearchX className="w-8 h-8 text-electric-400" /> : <Database className="w-8 h-8 text-violet-400" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-electric-600 hover:bg-electric-500 text-white transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
