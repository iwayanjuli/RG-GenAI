import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Send, CheckCircle2, MapPin, Phone, ExternalLink } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { useToast } from '../../context/ToastContext';
import { GithubIcon } from '../common/BrandIcons';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Masukkan alamat email yang valid', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Terima kasih! Anda telah terdaftar di newsletter riset kami.', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="relative bg-slate-50 dark:bg-navy-950 border-t border-blue-100 dark:border-navy-850 text-slate-600 dark:text-slate-400 overflow-hidden">
      {/* Subtle top glow line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Branding & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-md p-0.5">
                <div className="w-full h-full bg-white dark:bg-navy-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                </div>
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Generative AI <span className="text-blue-600 dark:text-electric-400 font-normal">RG</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Universitas Pendidikan Ganesha</p>
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 pr-4">
              Pusat riset dan inovasi Generative Artificial Intelligence di Universitas Pendidikan Ganesha. Berdedikasi pada pengembangan model fondasi, pelestarian budaya lokal, transformasi pendidikan cerdas, dan tata kelola AI yang beretika.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.socials.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition-colors shadow-sm"
                aria-label="GitHub Undiksha GenAI"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.socials.scholar}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition-colors shadow-sm"
                aria-label="Google Scholar"
              >
                <span className="text-xs font-bold font-mono">GS</span>
              </a>
              <a
                href={siteConfig.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white hover:border-blue-400 transition-colors shadow-sm"
                aria-label="LinkedIn"
              >
                <span className="text-xs font-bold font-mono">in</span>
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-electric-400 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-electric-400 transition-colors">Tentang Kami</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-electric-400 transition-colors">Fokus Penelitian</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-blue-600 dark:hover:text-electric-400 transition-colors">Proyek Inovasi</Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-blue-600 dark:hover:text-electric-400 transition-colors">Publikasi Ilmiah</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-electric-400 transition-colors">Kontak & Kolaborasi</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Research Areas */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Fokus Riset
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Large Language Models</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Retrieval-Augmented Gen</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Multimodal & Vision-AI</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Responsible & Ethical AI</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-violet-400 transition-colors">AI for Education</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-blue-600 dark:hover:text-violet-400 transition-colors">Autonomous AI Agents</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info & Newsletter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Kontak & Warta
            </h3>
            <div className="space-y-3 text-xs mb-5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-electric-400 shrink-0 mt-0.5" />
                <span>{siteConfig.address.campus}, {siteConfig.address.street}, {siteConfig.address.region}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-violet-400 shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </div>
            </div>

            {/* Newsletter form */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Langganan Warta Riset:</span>
              <div className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email akademik Anda..."
                  className="w-full bg-white dark:bg-navy-900 border border-blue-200 dark:border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 pr-10 shadow-sm"
                />
                <button
                  type="submit"
                  aria-label="Kirim langganan"
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center justify-center transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Anda telah berlangganan.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-blue-200/60 dark:border-navy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>
            © {new Date().getFullYear()} Generative AI Research Group, Universitas Pendidikan Ganesha. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-blue-600 dark:hover:text-slate-300 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-blue-600 dark:hover:text-slate-300 cursor-pointer">Syarat Penggunaan</span>
            <Link to="/admin" className="hover:text-blue-600 dark:hover:text-electric-400 flex items-center gap-1">
              <span>Admin CMS</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
