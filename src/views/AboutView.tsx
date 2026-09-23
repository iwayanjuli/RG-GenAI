import React, { useEffect, useState } from 'react';
import { SectionTitle } from '../components/common/SectionTitle';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { MemberCard } from '../components/modules/about/MemberCard';
import { MemberModal } from '../components/modules/about/MemberModal';
import { siteConfig } from '../data/siteConfig';
import { memberService } from '../services/memberService';
import { Member, MemberCategory } from '../types';
import { 
  Lightbulb, 
  Users, 
  ShieldCheck, 
  Target, 
  Sparkles, 
  Network, 
  Compass, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES: ('Semua' | MemberCategory)[] = [
  'Semua',
  'Head of Research Group',
  'Researcher',
  'Lecturer',
  'Student Researcher',
  'Research Assistant'
];

export const AboutView: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.title = 'Tentang Kami | Generative AI Research Group Undiksha';
    window.scrollTo(0, 0);

    memberService.getAll().then((data) => {
      setMembers(data);
      setLoading(false);
    });

    const handleUpdate = () => {
      memberService.getAll().then(setMembers);
    };
    window.addEventListener('rg_storage_updated', handleUpdate);
    return () => window.removeEventListener('rg_storage_updated', handleUpdate);
  }, []);

  const filteredMembers = selectedCategory === 'Semua'
    ? members
    : members.filter(m => m.category === selectedCategory);

  const valueIcons: Record<string, React.ElementType> = {
    Lightbulb,
    Users,
    ShieldCheck,
    Target
  };

  return (
    <div className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Tentang Kelompok Riset' }]} />

      {/* Hero Header */}
      <SectionTitle
        badge="Profil & Identitas"
        title="Generative AI Research Group Undiksha"
        subtitle="Mewujudkan ekosistem penelitian kecerdasan artifisial generasi baru yang berkarakter, beretika, dan berorientasi pada kemanfaatan nyata peradaban."
      />

      {/* Profil & Sejarah Singkat */}
      <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-electric-400" />
            <span>Pusat Unggulan Riset AI di Bali Utara</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Generative AI Research Group didirikan di lingkungan Universitas Pendidikan Ganesha (Singaraja, Bali) untuk merespons percepatan perkembangan model kecerdasan buatan fondasi (Foundation Models), Transformator multimodal, dan agen otonom.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Sebagai perguruan tinggi berlandaskan falsafah <em>Tri Hita Karana</em>, kelompok riset kami menggabungkan ketelitian ilmiah komputasi performa tinggi dengan komitmen pelestarian warisan budaya Bali, seperti digitalisasi ribuan manuskrip lontar kuno beraksara Bali dan perancangan asisten kurikulum adaptif perguruan tinggi.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white/90 dark:bg-navy-900/80 border border-blue-100 dark:border-navy-800 shadow-sm shadow-blue-500/5">
              <span className="text-2xl font-extrabold text-blue-600 dark:text-electric-400 font-mono">120M+</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Token Korpus Bahasa Bali Teranotasi</p>
            </div>
            <div className="p-4 rounded-xl bg-white/90 dark:bg-navy-900/80 border border-blue-100 dark:border-navy-800 shadow-sm shadow-blue-500/5">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-violet-400 font-mono">50.000+</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Glif Aksara Lontar AksaraNet</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-blue-100 dark:border-navy-700/80 shadow-xl bg-slate-100 dark:bg-navy-950">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Tim Peneliti Undiksha GenAI"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-6">
              <p className="text-xs text-white font-medium">
                Laboratorium Kecerdasan Artifisial FTK Undiksha, Kampus Tengah Singaraja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-electric-500/30 backdrop-blur-md shadow-sm shadow-blue-500/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-electric-500/10 text-blue-600 dark:text-electric-400 border border-blue-100 dark:border-electric-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visi Kelompok Riset</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-blue-50/40 dark:bg-navy-950/60 p-5 rounded-xl border border-blue-100 dark:border-navy-800">
            "{siteConfig.vision}"
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-violet-500/30 backdrop-blur-md shadow-sm shadow-blue-500/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-violet-500/10 text-indigo-600 dark:text-violet-400 border border-indigo-100 dark:border-violet-500/30">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Misi Strategis</h3>
          </div>
          <ul className="space-y-3">
            {siteConfig.mission.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-violet-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nilai Utama */}
      <section className="mb-20">
        <SectionTitle
          badge="Budaya Kerja"
          title="Nilai Utama Riset (Core Values)"
          subtitle="Empat prinsip fundamental yang memandu setiap eksperimen, publikasi, dan kolaborasi kami."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.coreValues.map((val) => {
            const Icon = valueIcons[val.icon] || Lightbulb;
            return (
              <div
                key={val.title}
                className="p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-electric-500/40 transition-all duration-300 shadow-sm shadow-blue-500/5 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-navy-800 border border-blue-100 dark:border-navy-700 flex items-center justify-center text-blue-600 dark:text-electric-400 mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {val.title}{' '}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({val.titleId})</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                  {val.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Perkembangan */}
      <section className="mb-20">
        <SectionTitle
          badge="Jejak Perjalanan"
          title="Milestone Perkembangan Research Group"
          subtitle="Rekam jejak pertumbuhan inisiatif riset dari laboratorium kampus hingga kemitraan internasional."
        />

        <div className="relative border-l-2 border-blue-200 dark:border-navy-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
          {siteConfig.milestones.map((ms, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-navy-950 border-2 border-blue-500 dark:border-electric-400 group-hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20" />

              <div className="p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 hover:border-blue-300 dark:hover:border-electric-500/30 transition-all shadow-sm shadow-blue-500/5">
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700 dark:bg-electric-500/10 dark:text-electric-400 border border-blue-200 dark:border-electric-500/30 mb-2">
                  {ms.year}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{ms.title}</h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ms.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="mb-20">
        <SectionTitle
          badge="Tata Kelola"
          title="Struktur Organisasi Kelompok Riset"
          subtitle="Kepemimpinan kolegial yang mendorong inovasi lintas divisi penelitian dan pembinaan talenta muda."
        />

        <div className="p-8 rounded-2xl bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 flex flex-col items-center text-center shadow-sm shadow-blue-500/5">
          {/* Head */}
          <div className="p-4 rounded-xl bg-blue-50/90 dark:bg-electric-950/80 border border-blue-200 dark:border-electric-500/40 max-w-sm w-full mb-6 shadow-md shadow-blue-500/10">
            <span className="text-[11px] font-semibold text-blue-700 dark:text-electric-400 uppercase tracking-wider block mb-1">
              Head of Research Group
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Dr. I Gede Surya Raharja, S.Kom., M.Cs.</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Koordinator Utama & Kebijakan Strategis Riset</p>
          </div>

          <div className="w-0.5 h-6 bg-blue-200 dark:bg-navy-700 mb-6" />

          {/* Sub divisions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">
            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-navy-900 border border-blue-100 dark:border-navy-800 shadow-sm">
              <span className="text-xs font-bold text-indigo-600 dark:text-violet-400 block mb-1">Divisi Multimodal & Vision</span>
              <p className="text-xs text-slate-900 dark:text-white font-medium">Dr. Ni Luh Putu Swastini</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Lead Researcher</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-navy-900 border border-blue-100 dark:border-navy-800 shadow-sm">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block mb-1">Divisi AI for Education & RAG</span>
              <p className="text-xs text-slate-900 dark:text-white font-medium">I Made Agus Wirawan, M.Kom.</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Senior Researcher</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-navy-900 border border-blue-100 dark:border-navy-800 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Divisi Autonomous Agents & Align</span>
              <p className="text-xs text-slate-900 dark:text-white font-medium">Kadek Dwi Pradnyana, M.Eng.</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Lead Alignment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Direktori Anggota Tim */}
      <section id="members">
        <SectionTitle
          badge="Talenta Peneliti"
          title="Anggota Tim & Peneliti"
          subtitle="Akademisi, mahasiswa magister, dan asisten riset berdedikasi tinggi di bidang Generative AI."
        />

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:bg-navy-900 dark:text-slate-400 dark:hover:text-white dark:hover:bg-navy-800 border border-blue-200 dark:border-navy-800 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-navy-900/60 border border-navy-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onSelect={(m) => setSelectedMember(m)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Member Modal */}
      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />

    </div>
  );
};
