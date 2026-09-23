import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { NeuralNetworkCanvas } from '../../visual/NeuralNetworkCanvas';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
      {/* Interactive Neural Network Background Canvas */}
      <NeuralNetworkCanvas className="opacity-75 dark:opacity-60" />

      {/* Futuristic Radial Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-white/90 dark:bg-navy-900/80 border border-blue-200 dark:border-electric-500/40 text-blue-700 dark:text-electric-400 shadow-sm shadow-blue-500/10 dark:shadow-glow-blue backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-spin-slow" />
          <span>Research • Innovation • Collaboration</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-violet-400 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight sm:leading-none"
        >
          Advancing Knowledge through{' '}
          <span className="text-gradient-primary block sm:inline mt-2 sm:mt-0">
            Generative Artificial Intelligence
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
        >
          Kelompok riset multidisiplin di <span className="text-blue-700 dark:text-white font-semibold">Universitas Pendidikan Ganesha</span> yang berfokus pada penelitian fundamental, inovasi terapan, dan pemanfaatan Generative AI untuk transformasi pendidikan, industri, preservasi budaya nusantara, dan masyarakat luas.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/research"
            className="group px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-cyan-200" />
            <span>Explore Our Research</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/publications"
            className="px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-navy-900/80 hover:bg-blue-50/80 dark:hover:bg-navy-800 border border-blue-200 dark:border-navy-700 hover:border-blue-400 dark:hover:border-electric-500/50 transition-all duration-300 backdrop-blur-md shadow-sm flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-electric-400" />
            <span>View Publications</span>
          </Link>
        </motion.div>

        {/* Tech tags preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-14 pt-6 border-t border-blue-100 dark:border-navy-850 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-blue-800 dark:text-slate-400 font-mono"
        >
          <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm">#LargeLanguageModels</span>
          <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm">#RAG</span>
          <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm">#MultimodalVLM</span>
          <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm">#AIAgents</span>
          <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm">#AI4Education</span>
          <span className="px-2.5 py-1 rounded-md bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm">#ResponsibleAI</span>
        </motion.div>

      </div>
    </section>
  );
};
