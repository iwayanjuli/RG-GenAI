import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFoundView: React.FC = () => {
  useEffect(() => {
    document.title = '404 - Halaman Tidak Ditemukan | Undiksha GenAI';
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 rounded-3xl bg-navy-900 border border-electric-500/40 shadow-glow-blue flex items-center justify-center mx-auto mb-6 text-electric-400"
        >
          <Bot className="w-12 h-12 animate-bounce" />
        </motion.div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
          Error 404: Loss Function Undefined
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-8">
          Model inferensi kami tidak dapat menemukan koordinat halaman yang Anda cari. Halaman mungkin telah diarsipkan, dipindahkan, atau tautan yang dimasukkan salah.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow-blue"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Halaman Sebelumnya</span>
          </button>
        </div>
      </div>
    </div>
  );
};
