import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Building, GraduationCap, Globe2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const CollaborationCTA: React.FC = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-navy-950">
      {/* Soft blue radiant ambient glow behind the card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-blue-500/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 border border-blue-300/40 p-8 sm:p-14 overflow-hidden shadow-2xl shadow-blue-500/30 text-white">

          {/* Luminous light decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/35 backdrop-blur-md mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Sinergi Riset & Hilirisasi Inovasi</span>
            </motion.div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              Tertarik Berkolaborasi dalam Ekosistem Generative AI?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-blue-50 leading-relaxed font-normal">
              Kami membuka peluang kemitraan komprehensif bagi peneliti sejawat, institusi perguruan tinggi, mahasiswa magister/sarjana, mitra industri teknologi, serta lembaga kebudayaan untuk bersama-sama mendorong kemajuan AI nusantara.
            </p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-white">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-colors shadow-sm">
                <Building className="w-4 h-4 text-cyan-100 shrink-0" />
                <span>Industry Joint Lab</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-colors shadow-sm">
                <Globe2 className="w-4 h-4 text-cyan-100 shrink-0" />
                <span>Konsorsium Hibah</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-colors shadow-sm">
                <GraduationCap className="w-4 h-4 text-cyan-100 shrink-0" />
                <span>Student Internship</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/15 hover:bg-white/20 border border-white/25 backdrop-blur-sm transition-colors shadow-sm">
                <Cpu className="w-4 h-4 text-cyan-100 shrink-0" />
                <span>Dataset & Compute</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 hover:shadow-glow-blue transition-all duration-300 shadow-xl shadow-blue-900/30 flex items-center gap-2 hover:-translate-y-0.5"
              >
                <span>Ajukan Diskusi Kolaborasi</span>
                <ArrowRight className="w-4 h-4 text-blue-700" />
              </Link>

              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-blue-700/40 hover:bg-blue-700/60 border border-white/30 backdrop-blur-sm transition-all hover:-translate-y-0.5"
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
