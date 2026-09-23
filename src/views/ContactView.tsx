import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SectionTitle } from '../components/common/SectionTitle';
import { siteConfig } from '../data/siteConfig';
import { contactService } from '../services/contactService';
import { partnerService } from '../services/partnerService';
import { Partner, InquiryType } from '../types';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  Sparkles, 
  Building, 
  GraduationCap, 
  Globe2, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  institution: z.string().min(2, 'Nama institusi minimal 2 karakter'),
  subject: z.string().min(5, 'Subjek pesan minimal 5 karakter'),
  inquiry_type: z.enum([
    'Research Collaboration',
    'Industry Partnership',
    'Student Internship',
    'Research Membership',
    'Media Inquiry',
    'General Question'
  ] as const, {
    errorMap: () => ({ message: 'Pilih jenis kepentingan yang valid' })
  }),
  message: z.string().min(15, 'Pesan harus lebih detail (minimal 15 karakter)'),
  honeypot: z.string().max(0, 'Spam terdeteksi').optional(), // Anti-spam honeypot
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactView: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiry_type: 'Research Collaboration',
    },
  });

  useEffect(() => {
    document.title = 'Kontak & Kolaborasi | Undiksha GenAI';
    window.scrollTo(0, 0);

    partnerService.getAll().then(setPartners);
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    if (data.honeypot && data.honeypot.length > 0) {
      return; // Silently reject bot spam
    }

    setIsSubmitting(true);
    try {
      await contactService.sendMessage({
        name: data.name,
        email: data.email,
        institution: data.institution,
        subject: data.subject,
        inquiry_type: data.inquiry_type as InquiryType,
        message: data.message,
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      showToast('Pesan Anda berhasil dikirim! Tim riset kami akan segera merespons.', 'success');
      
      // Joyful confetti for partnership submission
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      reset();
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err.message || 'Gagal mengirim pesan. Silakan coba lagi.', 'error');
    }
  };

  return (
    <div className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Kontak & Kemitraan' }]} />

      <SectionTitle
        badge="Terhubung dengan Kami"
        title="Hubungi & Bangun Kolaborasi Riset"
        subtitle="Kami menyambut kemitraan akademik, riset industri, magang penelitian mahasiswa, serta pertanyaan umum terkait inisiatif kecerdasan artifisial Undiksha."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-navy-900/60 border border-blue-100 dark:border-electric-500/30 backdrop-blur-md shadow-xl shadow-blue-500/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-electric-400" />
              <span>Formulir Diskusi & Kolaborasi</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Silakan lengkapi informasi berikut. Pesan Anda akan langsung tersimpan ke sistem kami dan diteruskan kepada koordinator riset terkait.
            </p>

            {submittedSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Pesan Berhasil Terkirim!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-md mx-auto">
                  Terima kasih atas minat Anda pada Generative AI Research Group Undiksha. Koordinator kami akan meninjau dan menghubungi Anda melalui email dalam 1-2 hari kerja.
                </p>
                <button
                  onClick={() => setSubmittedSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 dark:bg-navy-900 dark:hover:bg-navy-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 shadow-sm transition-colors"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Honeypot for spam protection */}
                <input
                  type="text"
                  {...register('honeypot')}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="Contoh: Dr. Made Sudarma"
                      className={`w-full bg-slate-50 dark:bg-navy-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm ${
                        errors.name ? 'border-rose-500' : 'border-blue-200 dark:border-navy-800'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="email@institusi.ac.id"
                      className={`w-full bg-slate-50 dark:bg-navy-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm ${
                        errors.email ? 'border-rose-500' : 'border-blue-200 dark:border-navy-800'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Institution */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Institusi / Universitas / Perusahaan *
                    </label>
                    <input
                      type="text"
                      {...register('institution')}
                      placeholder="Nama instansi Anda"
                      className={`w-full bg-slate-50 dark:bg-navy-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm ${
                        errors.institution ? 'border-rose-500' : 'border-blue-200 dark:border-navy-800'
                      }`}
                    />
                    {errors.institution && (
                      <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.institution.message}
                      </p>
                    )}
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Jenis Kepentingan *
                    </label>
                    <select
                      {...register('inquiry_type')}
                      className={`w-full bg-slate-50 dark:bg-navy-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-sm ${
                        errors.inquiry_type ? 'border-rose-500' : 'border-blue-200 dark:border-navy-800'
                      }`}
                    >
                      <option value="Research Collaboration">Research Collaboration (Kolaborasi Riset)</option>
                      <option value="Industry Partnership">Industry Partnership (Kemitraan Industri)</option>
                      <option value="Student Internship">Student Internship (Magang Mahasiswa)</option>
                      <option value="Research Membership">Research Membership (Gabung Peneliti)</option>
                      <option value="Media Inquiry">Media Inquiry (Liputan / Wawancara)</option>
                      <option value="General Question">General Question (Pertanyaan Umum)</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subjek / Judul Pesan *
                  </label>
                  <input
                    type="text"
                    {...register('subject')}
                    placeholder="Subjek inti pesan Anda..."
                    className={`w-full bg-slate-50 dark:bg-navy-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm ${
                      errors.subject ? 'border-rose-500' : 'border-blue-200 dark:border-navy-800'
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pesan Detail *
                  </label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    placeholder="Uraikan maksud kolaborasi, ide topik riset, atau pertanyaan yang ingin Anda diskusikan secara lengkap..."
                    className={`w-full bg-slate-50 dark:bg-navy-950 border rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm ${
                      errors.message ? 'border-rose-500' : 'border-blue-200 dark:border-navy-800'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span>Mengirimkan Pesan...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kirim Pesan Kolaborasi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Contact info & Maps */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Institutional Contact Card */}
          <div className="p-6 rounded-2xl bg-white/90 dark:bg-navy-900/60 border border-blue-100 dark:border-navy-800 shadow-sm space-y-5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sekretariat Kelompok Riset</h4>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-electric-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 dark:text-white block">{siteConfig.institution}</strong>
                  <span>{siteConfig.address.campus}</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{siteConfig.address.street}, {siteConfig.address.region}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-violet-500 dark:text-violet-400 shrink-0" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Email Resmi:</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-blue-600 dark:text-electric-400 hover:underline">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Telepon / Fax:</span>
                  <span>{siteConfig.contact.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Jam Operasional Lab:</span>
                  <span>{siteConfig.contact.hours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Embedded Map Card */}
          <div className="rounded-2xl overflow-hidden border border-blue-100 dark:border-navy-800 bg-slate-100 dark:bg-navy-950 shadow-md h-64 relative">
            <iframe
              title="Lokasi Undiksha Singaraja"
              src={siteConfig.address.embedMapUrl}
              className="w-full h-full border-0 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Collaboration Opportunities note */}
          <div className="p-6 rounded-2xl bg-blue-50/70 dark:bg-electric-950/40 border border-blue-200/60 dark:border-electric-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="font-semibold text-blue-800 dark:text-electric-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-electric-400" />
              <span>Peluang Bergabung Mahasiswa & Peneliti Tamu</span>
            </div>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Mahasiswa sarjana (S1) dan magister (S2) bidang Ilmu Komputer, Sistem Informasi, atau Teknik Informatika yang tertarik mengerjakan tugas akhir/tesis tentang Generative AI dipersilakan menghubungi kami untuk supervisi riset dan akses komputasi lab.
            </p>
          </div>

        </div>

      </div>

      {/* Collaboration Partners Showcase */}
      <section className="pt-12 border-t border-blue-100 dark:border-navy-800">
        <SectionTitle
          badge="Jaringan Kemitraan"
          title="Mitra Kolaborasi & Pendukung Riset"
          subtitle="Bekerja sama dengan institusi pemerintah, industri global, dan lembaga kebudayaan."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="p-4 rounded-xl bg-white/90 dark:bg-navy-900/50 border border-blue-100 dark:border-navy-800 shadow-sm flex flex-col items-center justify-center text-center hover:border-blue-300 dark:hover:border-electric-500/40 hover:shadow-md transition-all"
            >
              <img
                src={partner.logo_url}
                alt={partner.name}
                className="w-16 h-12 object-cover rounded-lg mb-2 opacity-90 hover:opacity-100 transition-opacity"
              />
              <span className="text-[11px] font-medium text-slate-800 dark:text-slate-300 line-clamp-2">
                {partner.name}
              </span>
              <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase mt-1">
                {partner.partnership_type}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
