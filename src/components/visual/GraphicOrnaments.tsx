import React from 'react';

export const GraphicOrnaments: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* 1. Luminous Radial Glow Orbs (White & Blue harmony) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-blue-400/25 via-sky-200/20 to-transparent dark:from-electric-600/15 dark:via-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute top-[700px] -left-36 w-[450px] h-[450px] bg-blue-400/15 dark:bg-electric-500/10 rounded-full blur-3xl" />
      <div className="absolute top-[1400px] -right-36 w-[500px] h-[500px] bg-sky-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute top-[2200px] left-1/12 w-[550px] h-[550px] bg-indigo-300/15 dark:bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute top-[3100px] right-1/12 w-[500px] h-[500px] bg-blue-500/15 dark:bg-electric-600/10 rounded-full blur-3xl" />

      {/* 2. Precision AI Engineering Grid */}
      <div
        className="absolute inset-0 opacity-[0.55] dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(37, 99, 235, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(37, 99, 235, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 3. Subtle Dot Matrix Accent */}
      <div
        className="absolute inset-0 opacity-[0.3] dark:opacity-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(37, 99, 235, 0.22) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* 4. Architectural Circuit & Neural Vector Ornaments - Top Left */}
      <svg
        className="absolute top-8 left-4 w-80 h-80 text-blue-600/20 dark:text-electric-400/10"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="52" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="22" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.8" />
        <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="100" cy="48" r="3.5" fill="currentColor" />
        <circle cx="100" cy="152" r="3.5" fill="currentColor" />
        <circle cx="48" cy="100" r="3.5" fill="currentColor" />
        <circle cx="152" cy="100" r="3.5" fill="currentColor" />
        <path d="M 30 30 L 50 30 L 70 50" stroke="currentColor" strokeWidth="1" />
        <circle cx="30" cy="30" r="2.5" fill="currentColor" />
      </svg>

      {/* Circuit lines - Top Right */}
      <svg
        className="absolute top-24 right-4 w-96 h-96 text-cyan-600/25 dark:text-cyan-400/10"
        viewBox="0 0 300 300"
        fill="none"
      >
        <path
          d="M 10 50 L 80 50 L 120 120 L 220 120 L 260 180 L 290 180"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="10" cy="50" r="4" fill="currentColor" />
        <circle cx="120" cy="120" r="4" fill="currentColor" />
        <circle cx="220" cy="120" r="4" fill="currentColor" />
        <circle cx="290" cy="180" r="4" fill="currentColor" />

        <path
          d="M 60 260 L 130 260 L 170 190 L 250 190"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle cx="60" cy="260" r="3" fill="currentColor" />
        <circle cx="250" cy="190" r="3" fill="currentColor" />
      </svg>

      {/* Mid-page Circuit Graphic - Left */}
      <svg
        className="absolute top-[1100px] left-0 w-96 h-96 text-blue-500/20 dark:text-blue-400/10"
        viewBox="0 0 320 320"
        fill="none"
      >
        <path
          d="M 0 100 L 90 100 L 140 160 L 140 240 L 210 280"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="90" cy="100" r="3.5" fill="currentColor" />
        <circle cx="140" cy="160" r="3.5" fill="currentColor" />
        <circle cx="140" cy="240" r="3.5" fill="currentColor" />
        <circle cx="210" cy="280" r="4" fill="currentColor" />
        <rect x="180" y="80" width="30" height="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      {/* Lower-page Circuit Graphic - Right */}
      <svg
        className="absolute top-[2100px] right-0 w-80 h-80 text-indigo-500/20 dark:text-violet-400/10"
        viewBox="0 0 300 300"
        fill="none"
      >
        <circle cx="150" cy="150" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" />
        <circle cx="150" cy="150" r="55" stroke="currentColor" strokeWidth="1.2" />
        <line x1="60" y1="150" x2="240" y2="150" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="150" cy="60" r="3" fill="currentColor" />
        <circle cx="150" cy="240" r="3" fill="currentColor" />
        <path d="M 240 150 L 270 180 L 290 180" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="290" cy="180" r="3.5" fill="currentColor" />
      </svg>

      {/* 5. Geometric Tech Coordinate Crosshairs */}
      <div className="absolute top-16 left-10 text-blue-600/50 dark:text-blue-500/30 text-[11px] font-mono select-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
        + UNDIKSHA_AI_NODE_01 [LAT:-8.1139, LNG:115.0875]
      </div>
      <div className="absolute top-24 right-10 text-cyan-700/50 dark:text-cyan-400/30 text-[11px] font-mono select-none">
        + MATRIX_TENSOR: [VLM • LLM • RAG] // GEN_AI_CORE
      </div>
      <div className="absolute top-[1300px] right-12 text-blue-600/40 dark:text-blue-400/20 text-[10px] font-mono select-none">
        // NEURAL_WEIGHTS_SYNCED: BALI_LANG_CORPUS
      </div>
      <div className="absolute top-[2300px] left-12 text-indigo-600/40 dark:text-indigo-400/20 text-[10px] font-mono select-none">
        + EVAL_METRICS: [ROUGE-L, BLEU-4, PERPLEXITY]
      </div>
    </div>
  );
};

