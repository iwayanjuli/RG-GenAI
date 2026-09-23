import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Building, GraduationCap, Globe2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const CollaborationCTA: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-50/60 dark:bg-navy-950">
      {/* Radiant ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-400/10 dark:bg-electric-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-sky-50/80 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950 border border-blue-200/80 dark:border-electric-500/30 p-8 sm:p-14 overflow-hidden shadow-xl shadow-blue-500/5 dark:shadow-2xl">

          {/* Decorative ambient orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 dark:bg-electric-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20 pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/30 mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Sinergi Riset & Hilirisasi Inovasi</span>
            </motion.div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Tertarik Berkolaborasi dalam Ekosistem Generative AI?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Kami membuka peluang kemitraan komprehensif bagi peneliti sejawat, institusi perguruan tinggi, mahasiswa magister/sarjana, mitra industri teknologi, serta lembaga kebudayaan untuk bersama-sama mendorong kemajuan AI nusantara.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-700 dark:text-slate-200">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-navy-950/70 border border-blue-100 dark:border-navy-800 shadow-sm hover:border-blue-300 dark:hover:border-navy-700 transition-colors">
                <Building className="w-4 h-4 text-blue-600 dark:text-electric-400 shrink-0" />
                <span>Industry Joint Lab</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-navy-950/70 border border-blue-100 dark:border-navy-800 shadow-sm hover:border-blue-300 dark:hover:border-navy-700 transition-colors">
                <Globe2 className="w-4 h-4 text-indigo-600 dark:text-violet-400 shrink-0" />
                <span>Konsorsium Hibah</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-navy-950/70 border border-blue-100 dark:border-navy-800 shadow-sm hover:border-blue-300 dark:hover:border-navy-700 transition-colors">
                <GraduationCap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>Student Internship</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white dark:bg-navy-950/70 border border-blue-100 dark:border-navy-800 shadow-sm hover:border-blue-300 dark:hover:border-navy-700 transition-colors">
                <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Dataset & Compute</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 dark:from-electric-600 dark:via-violet-600 dark:to-electric-600 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center gap-2 hover:-translate-y-0.5"
              >
                <span>Ajukan Diskusi Kolaborasi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-navy-900/80 hover:bg-blue-50/80 dark:hover:bg-navy-800 border border-blue-200 dark:border-navy-700 hover:border-blue-400 dark:hover:border-electric-500/50 transition-all duration-300 backdrop-blur-md shadow-sm flex items-center gap-2 hover:-translate-y-0.5"
              >
                Profil & Anggota Peneliti
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
