import React, { useEffect, useState } from 'react';
import { Users, FolderKanban, BookOpen, Handshake } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { statsService } from '../../../services/statsService';
import { StatsSummary } from '../../../types';

function CounterNumber({ value }: { value: number }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', (latest) => {
      setCurrentVal(latest);
    });
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{currentVal}</span>;
}

export const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<StatsSummary>({
    researchersCount: 0,
    activeProjectsCount: 0,
    publicationsCount: 0,
    partnersCount: 0,
  });

  useEffect(() => {
    statsService.getSummary().then(setStats);
    const handleStorageUpdate = () => {
      statsService.getSummary().then(setStats);
    };
    window.addEventListener('rg_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('rg_storage_updated', handleStorageUpdate);
  }, []);

  const statItems = [
    {
      label: 'Peneliti & Dosen',
      value: stats.researchersCount,
      suffix: '+',
      description: 'Akademisi, mahasiswa magister, dan asisten riset aktif',
      icon: Users,
      color: 'text-electric-400',
      border: 'border-electric-500/30'
    },
    {
      label: 'Proyek Aktif',
      value: stats.activeProjectsCount,
      suffix: '',
      description: 'Inisiatif riset terdanai nasional & institusional',
      icon: FolderKanban,
      color: 'text-violet-400',
      border: 'border-violet-500/30'
    },
    {
      label: 'Publikasi Ilmiah',
      value: stats.publicationsCount,
      suffix: '+',
      description: 'Jurnal bereputasi internasional, prosiding, & dataset',
      icon: BookOpen,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30'
    },
    {
      label: 'Mitra Kolaborasi',
      value: stats.partnersCount,
      suffix: '+',
      description: 'Lembaga kementerian, industri global, & komunitas adat',
      icon: Handshake,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30'
    },
  ];

  return (
    <section className="py-16 bg-blue-50/60 dark:bg-navy-900/50 border-y border-blue-100 dark:border-navy-850 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-2xl bg-white dark:bg-navy-950/80 border ${item.border} backdrop-blur-md flex flex-col justify-between shadow-sm shadow-blue-500/5`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className={`p-2 rounded-xl bg-blue-50 dark:bg-navy-900 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                    <CounterNumber value={item.value} />
                    <span className={item.color}>{item.suffix}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
