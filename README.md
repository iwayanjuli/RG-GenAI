# Generative AI Research Group - Universitas Pendidikan Ganesha (Undiksha)

Website resmi dan portal informasi akademik modern untuk **Generative AI Research Group, Universitas Pendidikan Ganesha (Undiksha)**, Singaraja, Bali.

Situs web ini dirancang dengan estetika futuristik bertema *artificial intelligence*, jaringan syaraf tiruan (*neural networks*), dan *large language models*, memadukan standar kredibilitas akademik internasional dengan komitmen pelestarian kebudayaan lokal (*Balinese cultural AI preservation*).

---

## 🚀 Fitur Utama

### 🌐 Halaman Publik
1. **Beranda (Home)**:
   - Animated Hero section dengan interactive HTML5 Neural Network Canvas (reaktif terhadap kursor mouse).
   - Animated Badge: *"Research • Innovation • Collaboration"*.
   - 6 Sorotan Bidang Riset unggulan (LLM, RAG, Multimodal AI, Responsible AI, AI for Education, NLP).
   - Animated number counters statistik (Peneliti, Proyek Aktif, Publikasi Ilmiah, Mitra Kerjasama).
   - Proyek unggulan dengan badge status interaktif.
   - Daftar publikasi ilmiah terbaru dengan fitur salin sitasi format APA instan.
   - Collaboration Call-to-Action (CTA) multidisiplin.
2. **Tentang Kami (About)**:
   - Profil, sejarah, visi, misi, dan tujuan kelompok riset di Undiksha.
   - 4 Nilai Utama (*Innovation, Collaboration, Responsibility, Impact*).
   - Roadmap dan milestone perkembangan kelompok riset (2022 - 2026+).
   - Struktur organisasi kelompok riset.
   - Direktori anggota tim lengkap dengan tab filter kategori (*Head of Research Group, Researcher, Lecturer, Student Researcher, Research Assistant*).
   - Modal detail profil peneliti dengan tautan Google Scholar, ORCID, LinkedIn, dan GitHub.
3. **Fokus Riset (Research)**:
   - 9 Bidang penelitian terinci (*Large Language Models, RAG, GenAI Agents, Multimodal AI, NLP Low-Resource, Computer Vision, Responsible AI, AI for Education, AI for Social Impact*).
   - Pertanyaan riset (*Research Questions*), metodologi, dan stack teknologi untuk setiap bidang.
   - Peta jalan riset strategis (Fase I hingga Fase IV).
   - Pencarian real-time dan tautan proyek terkait.
4. **Proyek Inovasi (Project)**:
   - Katalog proyek penelitian dalam grid responsif dengan cover image.
   - Filter multi-dimensi: Pencarian kata kunci, filter tahun, filter kategori riset, dan filter status (*Planned, Active, Completed*).
   - Pagination halaman.
   - Halaman detail proyek dinamis (`/projects/:slug`) dengan target, luaran riset (*outcomes*), tautan demo, repositori GitHub, dokumen laporan, dan galeri foto dokumentasi.
5. **Publikasi Ilmiah (Publication)**:
   - Katalog karya ilmiah (Journal Article, Conference Paper, Book Chapter, Dataset, dll.).
   - Visualisasi statistik riset menggunakan grafik interaktif **Recharts** (Tren publikasi per tahun & komposisi jenis publikasi).
   - Filter jenis publikasi, tahun, dan pencarian judul/penulis.
   - Fitur **"Salin Sitasi"** (format APA 7th Edition dan IEEE).
   - Fitur **"Export BibTeX"** (salin langsung atau unduh berkas `.bib`).
   - Halaman detail publikasi (`/publications/:slug`).
6. **Kontak & Kolaborasi (Contact)**:
   - Informasi institusi, alamat kampus Undiksha Singaraja, email, telepon, dan jam operasional.
   - Peta lokasi interaktif (Google Maps embed).
   - Formulir kontak tervalidasi menggunakan **React Hook Form + Zod** dengan pilihan jenis kepentingan:
     - *Research Collaboration*
     - *Industry Partnership*
     - *Student Internship*
     - *Research Membership*
     - *Media Inquiry*
     - *General Question*
   - Proteksi anti-spam *honeypot*, status loading, notifikasi toast feedback, serta efek visual konfeti saat pengiriman berhasil.
   - Showcase logo mitra kerjasama.

### 🛡️ Dashboard Administrator CMS (`/admin`)
- **Autentikasi Aman & RBAC (Role-Based Access Control)**:
  - Mendukung login langsung via **Supabase Authentication**.
  - Menyediakan opsi **Demo Login Instan** dengan pilihan peran (*Super Admin*, *Admin*, *Editor*) untuk pengujian antarmuka tanpa konfigurasi awal.
- **Modul CRUD Lengkap**:
  - **Anggota Tim**: Tambah, edit, hapus, dan toggle status aktif peneliti.
  - **Bidang Riset**: Kelola deskripsi, pertanyaan riset, metodologi, dan penanda unggulan.
  - **Proyek Inovasi**: Tambah proyek, ubah status (*Active, Completed, Planned*), kelola anggota tim & tautan demo.
  - **Publikasi Ilmiah**: Tambah karya ilmiah, input volume/issue/DOI, dan entri BibTeX.
  - **Mitra Kerjasama**: Kelola institusi mitra, logo, dan kategori kerjasama.
  - **Kotak Pesan**: Baca pesan masuk, ubah status (*Unread, Read, Replied*), balas via mailto, dan hapus pesan.
- Dialog konfirmasi sebelum penghapusan data untuk mencegah kehilangan data secara tidak sengaja.
- Toast feedback notifikasi responsif di seluruh aksi sistem.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Core**: React.js 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS (Dark Navy, Electric Blue, Violet, Cyan)
- **Animasi & Interaktivitas**: Framer Motion & HTML5 Canvas Particles
- **Navigasi**: React Router 7
- **Formulir & Validasi**: React Hook Form + Zod
- **Visualisasi Data**: Recharts
- **Ikonografi**: Lucide React
- **Efek Khusus**: Canvas-Confetti
- **Database & Storage**: Supabase (PostgreSQL, Row Level Security, Storage API)
- **Abstraction Layer**: Dual-mode Hybrid Architecture (beralih otomatis antara Supabase remote dan LocalStorage reaktif jika env belum diatur).

---

## 📂 Struktur Direktori Proyek

```
RG-GenAI/
├── public/
│   ├── favicon.svg             # Logo visual neural AI
│   ├── robots.txt              # Konfigurasi SEO bot
│   └── sitemap.xml             # Sitemap halaman publik
├── src/
│   ├── components/
│   │   ├── admin/              # Komponen Layout & Sidebar CMS Admin
│   │   ├── common/             # Modal, ConfirmDialog, Skeletons, Breadcrumbs, dll.
│   │   ├── layout/             # Navbar, Footer, MobileNav, ThemeToggle
│   │   ├── modules/
│   │   │   ├── home/           # Hero, Highlights, Stats, Featured, CTA
│   │   │   └── about/          # MemberCard, MemberModal
│   │   └── visual/             # NeuralNetworkCanvas interaktif
│   ├── context/
│   │   ├── AuthContext.tsx     # Autentikasi Supabase & Demo RBAC
│   │   ├── ThemeContext.tsx    # Manajemen Dark Mode & Light Mode
│   │   └── ToastContext.tsx    # Notifikasi toast sistem
│   ├── data/
│   │   ├── mockData.ts         # Data awal autentik Undiksha (seed)
│   │   └── siteConfig.ts       # Profil institusi, visi, misi, roadmap
│   ├── lib/
│   │   ├── supabase.ts         # Inisialisasi Supabase client & detector
│   │   └── utils.ts            # Helper sitasi APA/IEEE, BibTeX, formatting
│   ├── services/               # Abstraction layer repository
│   │   ├── memberService.ts
│   │   ├── researchService.ts
│   │   ├── projectService.ts
│   │   ├── publicationService.ts
│   │   ├── partnerService.ts
│   │   ├── contactService.ts
│   │   ├── statsService.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts            # Definisi TypeScript interface
│   ├── views/                  # Halaman aplikasi publik & admin
│   ├── App.tsx                 # Routing utama
│   ├── index.css               # Styling design system & glassmorphism
│   └── main.tsx
├── supabase/
│   ├── schema.sql              # Skema PostgreSQL lengkap dengan RLS
│   └── seed.sql                # Data awal autentik Undiksha
├── requirements.txt            # Daftar paket web & dependensi Python AI/ML
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## ⚡ Petunjuk Instalasi & Menjalankan Website

### 1. Prasyarat
- Node.js versi 18 atau lebih tinggi
- npm atau yarn

### 2. Instal Dependensi
Jalankan perintah berikut di root folder proyek:
```bash
npm install
```
*(Atau lihat [requirements.txt](file:///c:/Users/WAYAN%20JULI/Documents/MAGANG/RG-GenAI/requirements.txt) untuk referensi paket).*

### 3. Jalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka peramban di `http://localhost:5173/`.

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 🗄️ Konfigurasi Database Supabase (Opsional)

Aplikasi ini memiliki kemampuan **Hybrid Offline-Ready**:
- **Tanpa Supabase**: Aplikasi langsung berfungsi 100% menggunakan *Reactive Local Storage*. Seluruh operasi tambah, ubah, dan hapus data di admin dashboard langsung tersimpan di browser Anda.
- **Dengan Supabase**: Buat proyek di [supabase.com](https://supabase.com), buat file `.env` di root folder dengan menyalin `.env.example`:

```env
VITE_SUPABASE_URL=https://proyek-anda.supabase.co
VITE_SUPABASE_ANON_KEY=anon-key-supabase-anda
```

Jalankan perintah SQL dari [supabase/schema.sql](file:///c:/Users/WAYAN%20JULI/Documents/MAGANG/RG-GenAI/supabase/schema.sql) pada **SQL Editor** di dashboard Supabase Anda, kemudian jalankan [supabase/seed.sql](file:///c:/Users/WAYAN%20JULI/Documents/MAGANG/RG-GenAI/supabase/seed.sql) untuk menginisialisasi data awal.

---

## 🔑 Akses Administrator CMS

Akses dashboard administrator melalui menu di header/footer atau navigasi langsung ke:
```
http://localhost:5173/admin/login
```

Pada halaman login, Anda dapat mengklik tombol **Login Demo Instan**:
1. **Super Admin**: Hak akses penuh seluruh data dan konfigurasi pengguna.
2. **Admin**: Hak akses penuh CRUD seluruh konten riset dan publikasi.
3. **Editor**: Hak akses input dan penyuntingan konten.

---

## 📍 Kontak Resmi Kelompok Riset

- **Institusi**: Universitas Pendidikan Ganesha
- **Alamat**: Gedung Lab FTK, Kampus Tengah Undiksha, Jl. Udayana No. 11, Singaraja, Bali 81116
- **Email**: `genai@undiksha.ac.id`
- **Telepon**: `+62 (0362) 22570`


## Integrasi Supabase lengkap

Lihat [supabase/README.md](supabase/README.md) untuk pemasangan seluruh data panel admin, akun Supabase Auth, dan aturan akses. SQL gabungan tersedia pada [supabase/setup.sql](supabase/setup.sql). Login demo hanya tersedia saat Supabase tidak terkonfigurasi.
