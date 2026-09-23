import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-navy-800 animate-pulse space-y-4">
      <div className="h-48 bg-navy-800/60 rounded-xl w-full" />
      <div className="h-4 bg-navy-800/80 rounded w-1/3" />
      <div className="h-6 bg-navy-800 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3 bg-navy-800/60 rounded w-full" />
        <div className="h-3 bg-navy-800/60 rounded w-5/6" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-6 w-16 bg-navy-800/80 rounded-full" />
        <div className="h-6 w-20 bg-navy-800/80 rounded-full" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 bg-navy-800/80 rounded-xl w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 bg-navy-900/60 rounded-xl w-full border border-navy-800" />
      ))}
    </div>
  );
};
