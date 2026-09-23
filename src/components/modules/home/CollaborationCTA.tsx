import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Building, GraduationCap, Globe2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const CollaborationCTA: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-electric-950/80 via-navy-900 to-violet-950/80 border border-electric-500/30 p-8 sm:p-14 overflow-hidden shadow-2xl">

          {/* Subtle decorative glow balls */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-electric-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sinergi Riset & Hilirisasi Inovasi</span>
            </motion.div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Tertarik Berkolaborasi dalam Ekosistem Generative AI?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Kami membuka peluang kemitraan komprehensif bagi peneliti sejawat, institusi perguruan tinggi, mahasiswa magister/sarjana, mitra industri teknologi, serta lembaga kebudayaan untuk bersama-sama mendorong kemajuan AI nusantara.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
                <Building className="w-4 h-4 text-electric-400 shrink-0" />
                <span>Industry Joint Lab</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
                <Globe2 className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Konsorsium Hibah</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
                <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Student Internship</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-navy-900/60 border border-navy-800">
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dataset & Compute</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-electric-600 via-violet-600 to-electric-600 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-glow-blue flex items-center gap-2"
              >
                <span>Ajukan Diskusi Kolaborasi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-navy-900/80 hover:bg-navy-800 border border-navy-700 transition-colors"
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
