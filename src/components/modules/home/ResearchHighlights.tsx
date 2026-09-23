import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Database, Sparkles, ShieldCheck, GraduationCap, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../../common/SectionTitle';

const HIGHLIGHTS = [
  {
    title: 'Large Language Models',
    slug: 'large-language-models',
    description: 'Adaptasi efisien model transformator sumber terbuka (LoRA, QLoRA) untuk kosakata berkarakter spesifik dan domain pendidikan.',
    icon: Brain,
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    borderColor: 'group-hover:border-blue-500/50',
    iconColor: 'text-blue-400'
  },
  {
    title: 'Retrieval-Augmented Generation',
    slug: 'retrieval-augmented-generation',
    description: 'Arsitektur RAG mutakhir dengan hybrid semantic retrieval untuk mitigasi halusinasi dan sitasi kurikulum kredibel.',
    icon: Database,
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    borderColor: 'group-hover:border-cyan-500/50',
    iconColor: 'text-cyan-400'
  },
  {
    title: 'Multimodal Generative AI',
    slug: 'multimodal-generative-ai',
    description: 'Penyelarasan Vision-Language Models (VLM) untuk pelestarian manuskrip lontar kuno Bali dan digitalisasi warisan budaya.',
    icon: Sparkles,
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    borderColor: 'group-hover:border-violet-500/50',
    iconColor: 'text-violet-400'
  },
  {
    title: 'Responsible and Ethical AI',
    slug: 'responsible-ai',
    description: 'Tolok ukur transparansi, mitigasi bias kultural, kerangka keamanan AI, dan tata kelola etika algoritma lokal.',
    icon: ShieldCheck,
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    borderColor: 'group-hover:border-emerald-500/50',
    iconColor: 'text-emerald-400'
  },
  {
    title: 'AI for Education (AI4Edu)',
    slug: 'ai-for-education',
    description: 'Personalisasi scaffolding pembelajaran, evaluasi esai otomatis Taksonomi Bloom, dan sistem tutoring cerdas.',
    icon: GraduationCap,
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    borderColor: 'group-hover:border-amber-500/50',
    iconColor: 'text-amber-400'
  },
  {
    title: 'Natural Language Processing',
    slug: 'natural-language-processing',
    description: 'Riset komputasi bahasa nusantara berdaya sumber rendah (Low-Resource), analisis morfologi, dan pemodelan dialek Bali.',
    icon: MessageSquare,
    gradient: 'from-rose-500/20 via-pink-500/10 to-transparent',
    borderColor: 'group-hover:border-rose-500/50',
    iconColor: 'text-rose-400'
  }
];

export const ResearchHighlights: React.FC = () => {
  return (
    <section className="py-20 relative bg-slate-50/50 dark:bg-navy-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          badge="Fokus Unggulan"
          title="Pilar Utama Penelitian Generative AI"
          subtitle="Mengintegrasikan kedalaman sains komputasi dengan nilai kearifan lokal untuk menciptakan dampak transformatif bagi masa depan."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIGHLIGHTS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/research#${item.slug}`}
                  className={`group block h-full p-7 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 shadow-sm shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-2xl relative overflow-hidden ${item.borderColor}`}
                >
                  {/* Subtle gradient glow */}
                  <div
                    className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${item.gradient} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-xl bg-blue-50/80 dark:bg-navy-800/90 border border-blue-100 dark:border-navy-700/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-6 h-6 ${item.iconColor}`} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-blue-600 dark:group-hover:text-electric-400 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1 mb-6">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-white transition-colors">
                      <span>Pelajari Riset</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition-all shadow-sm"
          >
            <span>Lihat Seluruh 9 Bidang & Roadmap Riset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
