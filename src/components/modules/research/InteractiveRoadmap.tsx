import React, { useState } from 'react';
import { RoadmapItem, RoadmapStatus } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Cpu, 
  Layers, 
  ArrowRight, 
  ArrowLeft,
  Flame,
  Milestone,
  Check,
  ChevronRight,
  Target
} from 'lucide-react';

interface InteractiveRoadmapProps {
  items: RoadmapItem[];
}

export const InteractiveRoadmap: React.FC<InteractiveRoadmapProps> = ({ items }) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(() => {
    // Default to the first "In Progress" phase, or the first phase
    const inProgress = items.find(i => i.status === 'In Progress');
    return inProgress ? inProgress.id : items[0]?.id || '';
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedItem = items.find(i => i.id === selectedPhaseId) || items[0];
  const selectedIndex = items.findIndex(i => i.id === selectedPhaseId);

  const filteredItems = items.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Calculate metrics
  const completedCount = items.filter(i => i.status === 'Completed').length;
  const inProgressCount = items.filter(i => i.status === 'In Progress').length;
  const plannedCount = items.filter(i => i.status === 'Planned').length;
  const progressPercent = Math.round(
    ((completedCount + (inProgressCount * 0.5)) / Math.max(items.length, 1)) * 100
  );

  const getStatusBadge = (status: RoadmapStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-cyan-400 border border-blue-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-cyan-400" />
            <span>Sedang Berjalan</span>
          </span>
        );
      case 'Planned':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/80 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-navy-700">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Rencana Agenda</span>
          </span>
        );
    }
  };

  const getStationColor = (status: RoadmapStatus, isSelected: boolean) => {
    if (isSelected) {
      return 'ring-4 ring-blue-500/40 border-blue-600 bg-blue-600 text-white dark:bg-electric-600 shadow-glow-blue scale-110';
    }
    switch (status) {
      case 'Completed':
        return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:scale-105';
      case 'In Progress':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 hover:scale-105';
      case 'Planned':
      default:
        return 'border-slate-300 dark:border-navy-700 bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400 hover:scale-105';
    }
  };

  const handleNextPhase = () => {
    if (selectedIndex < items.length - 1) {
      setSelectedPhaseId(items[selectedIndex + 1].id);
    }
  };

  const handlePrevPhase = () => {
    if (selectedIndex > 0) {
      setSelectedPhaseId(items[selectedIndex - 1].id);
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-12">
      {/* 1. Header & Pathway Overview Statistics */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 shadow-xl shadow-blue-500/5 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-blue-100 dark:border-navy-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-electric-500/10 text-blue-700 dark:text-electric-400 border border-blue-200 dark:border-electric-500/30 mb-3">
              <Milestone className="w-3.5 h-3.5" />
              <span>Peta Jalan Riset Terpadu</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Evolusi & Target Strategis Riset 2023 - 2028
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Jalur terstruktur pengembangan inovasi kecerdasan artifisial Undiksha: dari infrastruktur dasar komputasi, model lokal nusantara, hingga pusat unggulan berdaya saing global.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-50/80 dark:bg-navy-950/60 p-4 rounded-2xl border border-blue-100 dark:border-navy-800 shrink-0">
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Selesai</span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-navy-800" />
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black text-blue-600 dark:text-cyan-400">{inProgressCount}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Berjalan</span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-navy-800" />
            <div className="text-center">
              <span className="block text-xl sm:text-2xl font-black text-slate-700 dark:text-slate-300">{plannedCount}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Rencana</span>
            </div>
          </div>
        </div>

        {/* Overall Progress Tracker */}
        <div className="pt-6">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              Progres Capaian Peta Jalan
            </span>
            <span className="text-blue-600 dark:text-electric-400 font-mono font-bold">
              {progressPercent}% Tercapai
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-navy-950 rounded-full overflow-hidden p-0.5 border border-blue-100 dark:border-navy-800">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Visual Interactive Pathway Rail (Peta Jalan Interaktif) */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-sky-50/60 dark:from-navy-900/90 dark:via-navy-900 dark:to-navy-950 border border-blue-200 dark:border-navy-800 shadow-xl shadow-blue-500/5">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Pilih Stasiun Fase untuk Melihat Rincian:
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={handlePrevPhase}
              disabled={selectedIndex === 0}
              className="p-1.5 rounded-lg bg-white dark:bg-navy-800 border border-blue-100 dark:border-navy-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-50 transition-colors"
              title="Fase Sebelumnya"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
            <button
              onClick={handleNextPhase}
              disabled={selectedIndex === items.length - 1}
              className="p-1.5 rounded-lg bg-white dark:bg-navy-800 border border-blue-100 dark:border-navy-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-50 transition-colors"
              title="Fase Selanjutnya"
            >
              <ArrowRight className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        </div>

        {/* The Pathway Track */}
        <div className="relative pb-6">
          {/* Connecting Track Line */}
          <div className="hidden sm:block absolute top-7 left-12 right-12 h-1.5 bg-slate-200 dark:bg-navy-800 rounded-full z-0 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, (selectedIndex / Math.max(1, items.length - 1)) * 100))}%`
              }}
            />
          </div>

          {/* Interactive Stations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {items.map((item, idx) => {
              const isSelected = item.id === selectedPhaseId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedPhaseId(item.id)}
                  className={`group text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white dark:bg-navy-950 border-2 border-blue-600 dark:border-electric-500 shadow-xl shadow-blue-500/10 -translate-y-1'
                      : 'bg-white/80 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-navy-700 hover:bg-white dark:hover:bg-navy-900/90 shadow-sm'
                  }`}
                >
                  {/* Station Marker */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${getStationColor(
                        item.status,
                        isSelected
                      )}`}
                    >
                      {item.status === 'Completed' ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {item.year_range}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-electric-400 block mb-1">
                      {item.phase}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-electric-300 transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
                    {getStatusBadge(item.status)}
                    <span className="text-xs font-semibold text-blue-600 dark:text-electric-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Detail <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Detailed Spotlight on Selected Station */}
        {selectedItem && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-navy-950 border border-blue-200/90 dark:border-electric-500/30 shadow-lg relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Phase Title & Overview */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-blue-100 dark:bg-electric-500/20 text-blue-700 dark:text-electric-400">
                      {selectedItem.phase}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800">
                      Tahun {selectedItem.year_range}
                    </span>
                    {getStatusBadge(selectedItem.status)}
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                      {selectedItem.title}
                    </h3>
                    {selectedItem.subtitle && (
                      <p className="text-sm font-medium text-blue-700 dark:text-electric-300 mt-1">
                        {selectedItem.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Technologies Involved */}
                  {selectedItem.technologies && selectedItem.technologies.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                        Stack Teknologi & Instrumen:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.technologies.map(tech => (
                          <span
                            key={tech}
                            className="text-xs font-mono px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-navy-900 text-blue-700 dark:text-slate-300 border border-blue-100 dark:border-navy-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deliverables / Output */}
                  {selectedItem.deliverables && selectedItem.deliverables.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                        Target Capaian & Output Utama:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.deliverables.map(del => (
                          <span
                            key={del}
                            className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            {del}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Key Milestones & Research Actions */}
                <div className="lg:col-span-2 bg-slate-50/70 dark:bg-navy-900/60 p-6 rounded-2xl border border-blue-100 dark:border-navy-850 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600 dark:text-electric-400" />
                      Agenda Riset & Rencana Pelaksanaan:
                    </h4>

                    <div className="space-y-3.5">
                      {selectedItem.points.map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-navy-950/80 border border-blue-100 dark:border-navy-800 shadow-sm"
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            selectedItem.status === 'Completed'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                              : selectedItem.status === 'In Progress'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-400'
                              : 'bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400'
                          }`}>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>
                      Stasiun {selectedIndex + 1} dari {items.length} stasiun riset
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPhase}
                        disabled={selectedIndex === 0}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50"
                      >
                        ← Sebelumnya
                      </button>
                      <button
                        onClick={handleNextPhase}
                        disabled={selectedIndex === items.length - 1}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 shadow-sm"
                      >
                        Selanjutnya →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 4. Full Detailed List Filterable View */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Daftar Rinci Seluruh Fase Peta Jalan
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dokumentasi komprehensif indikator target tiap fase perkembangan.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-navy-900 p-1.5 rounded-xl border border-slate-200 dark:border-navy-800 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-navy-800 text-blue-700 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Semua ({items.length})
            </button>
            <button
              onClick={() => setFilterStatus('Completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'Completed'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Selesai ({completedCount})
            </button>
            <button
              onClick={() => setFilterStatus('In Progress')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'In Progress'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Berjalan ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterStatus('Planned')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'Planned'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Rencana ({plannedCount})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-6 rounded-2xl bg-white dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-100 dark:bg-electric-500/20 text-blue-700 dark:text-electric-400">
                      {item.phase}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
                      {item.year_range}
                    </span>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-blue-600 dark:text-electric-300 font-medium mb-4">
                    {item.subtitle}
                  </p>
                )}

                <ul className="space-y-2 mt-4">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-electric-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {item.technologies && item.technologies.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-800 flex flex-wrap gap-1.5">
                  {item.technologies.map(t => (
                    <span
                      key={t}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-navy-800"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
