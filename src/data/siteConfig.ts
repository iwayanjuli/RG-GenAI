export const siteConfig = {
  name: 'Generative AI Research Group',
  institution: 'Universitas Pendidikan Ganesha',
  shortName: 'Undiksha GenAI',
  tagline: 'Advancing Knowledge through Generative Artificial Intelligence',
  description: 'Kelompok riset multidisiplin di Universitas Pendidikan Ganesha yang berfokus pada penelitian, inovasi, dan penerapan Generative AI untuk pendidikan, industri, preservasi budaya nusantara, dan masyarakat luas.',
  address: {
    campus: 'Gedung Laboratorium Riset FTK, Kampus Tengah Undiksha',
    street: 'Jl. Udayana No. 11, Singaraja, Kabupaten Buleleng',
    region: 'Bali 81116, Indonesia',
    mapQuery: 'Universitas+Pendidikan+Ganesha+Singaraja+Bali',
    embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.887640417737!2d115.0874558748366!3d-8.113919691915443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd19a557877224f%3A0xb3515438848a6be9!2sUniversitas%20Pendidikan%20Ganesha!5e0!3m2!1sid!2sid!4v1710000000000!5m2!1sid!2sid',
  },
  contact: {
    email: 'genai@undiksha.ac.id',
    phone: '+62 (0362) 22570 / Ext. 3120',
    hours: 'Senin - Jumat: 08.00 - 16.30 WITA',
  },
  socials: {
    github: 'https://github.com/undiksha-genai',
    scholar: 'https://scholar.google.com/citations?user=undikshagenai',
    linkedin: 'https://linkedin.com/company/undiksha-genai',
    youtube: 'https://youtube.com/@undiksha-official',
    twitter: 'https://twitter.com/undikshagenai',
  },
  navItems: [
    { label: 'Home', path: '/' },
    { label: 'Tentang', path: '/about' },
    { label: 'Research', path: '/research' },
    { label: 'Project', path: '/projects' },
    { label: 'Publication', path: '/publications' },
    { label: 'Contact', path: '/contact' },
  ],
  vision: 'Menjadi pusat unggulan riset dan inovasi Generative Artificial Intelligence bertaraf internasional yang berkarakter, beretika, dan berkontribusi nyata bagi pendidikan, kebudayaan nusantara, serta kemajuan peradaban.',
  mission: [
    'Melakukan penelitian fundamental dan terapan mutakhir dalam bidang model fondasi generatif, arsitektur transformator, dan multimodal AI.',
    'Mengembangkan solusi Generative AI yang inklusif untuk transformasi pedagogi cerdas di lingkungan pendidikan tinggi dan sekolah.',
    'Melestarikan dan mendigitalisasi kekayaan bahasa daerah, naskah kuno nusantara, dan warisan budaya Bali melalui pendekatan vision-language AI.',
    'Membangun ekosistem riset kolaboratif yang etis, bertanggung jawab, dan berdampak luas bersama akademisi, industri, pemerintah, serta komunitas global.'
  ],
  objectives: [
    'Menghasilkan publikasi ilmiah bereputasi internasional di jurnal terindeks Scopus (Q1/Q2) dan konferensi bergengsi (ACL, IEEE, ACM, CVPR).',
    'Menghasilkan kekayaan intelektual (paten/hak cipta perangkat lunak) dan produk inovasi berbasis AI yang dapat dihilirisasi.',
    'Meningkatkan kapasitas mahasiswa sarjana dan pascasarjana dalam rekayasa komputasi cerdas serta etika kecerdasan artifisial.',
    'Menjalin kemitraan strategis dengan konsorsium riset nasional dan laboratorium kecerdasan buatan dunia.'
  ],
  coreValues: [
    {
      title: 'Innovation',
      titleId: 'Inovasi',
      description: 'Menjelajahi batas terdepan teknologi generatif untuk memecahkan tantangan komputasi kompleks dengan pendekatan orisinal.',
      icon: 'Lightbulb'
    },
    {
      title: 'Collaboration',
      titleId: 'Kolaborasi',
      description: 'Menjunjung tinggi sinergi pentahelix lintas disiplin ilmu antara perguruan tinggi, industri teknologi, pemerintah, dan masyarakat.',
      icon: 'Users'
    },
    {
      title: 'Responsibility',
      titleId: 'Tanggung Jawab Etis',
      description: 'Mengedepankan etika AI, privasi data, mitigasi bias kultural, dan transparansi algoritma demi kebaikan peradaban manusia.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Impact',
      titleId: 'Dampak Nyata',
      description: 'Memastikan setiap baris kode, model, dan publikasi memberikan nilai kemanfaatan langsung bagi pendidikan dan pelestarian budaya.',
      icon: 'Target'
    }
  ],
  milestones: [
    {
      year: '2022',
      title: 'Inisiasi Kelompok Riset',
      description: 'Pembentukan forum riset kecerdasan buatan di lingkungan Fakultas Teknik dan Kejuruan Undiksha untuk merespons gelombang Large Language Models.'
    },
    {
      year: '2023',
      title: 'Pendirian Laboratorium & Hibah BRIN',
      description: 'Peresmian Generative AI Research Group Undiksha dan penerimaan hibah riset kolaboratif nasional pertama untuk pemodelan bahasa daerah nusantara.'
    },
    {
      year: '2024',
      title: 'Rilis AksaraGen-VLM & EduGen',
      description: 'Peluncuran dataset lontar AksaraNet 50k, model AksaraGen-VLM, dan implementasi pilot sistem asisten kurikulum cerdas EduGen-RAG.'
    },
    {
      year: '2025',
      title: 'Ekspansi Mitra Global & Konsorsium ASEAN',
      description: 'Bergabung dalam aliansi etika AI Asia Tenggara (EthicSEAsia) dan kemitraan komputasi awan bersama Google Cloud & NVIDIA Inception.'
    },
    {
      year: '2026+',
      title: 'Center of Excellence Generative AI',
      description: 'Menuju Pusat Unggulan Iptek (PUI) Generative AI bidang Pendidikan dan Digital Humanities di kawasan Indonesia Timur.'
    }
  ],
  roadmap: [
    {
      phase: 'Fase I (2023 - 2024)',
      title: 'Foundation & Infrastructure',
      points: [
        'Penyusunan korpus linguistik bahasa daerah Bali & instrumen data lontar',
        'Pembangunan cluster workstation GPU dan pipeline MLOps',
        'Eksplorasi teknik parameter-efficient fine-tuning (LoRA, QLoRA)'
      ]
    },
    {
      phase: 'Fase II (2024 - 2025)',
      title: 'Domain Adaptation & Multimodal Alignment',
      points: [
        'Rilis open-weights Balinese-LLaMA dan transliterator VLM',
        'Implementasi production RAG untuk kurikulum pendidikan tinggi',
        'Penyusunan benchmark evaluasi etika model bahasa lokal'
      ]
    },
    {
      phase: 'Fase III (2025 - 2026)',
      title: 'Autonomous Agents & Intelligent Tutoring',
      points: [
        'Pengembangan sistem multi-agen otonom untuk asesmen adaptif',
        'Integrasi multimodal real-time speech and gesture feedback',
        'Pilot komersialisasi dan hilirisasi produk AI ke industri edutech'
      ]
    },
    {
      phase: 'Fase IV (2026 - 2028)',
      title: 'Global Impact & Cultural AI Preservation',
      points: [
        'Pusat rujukan digitalisasi warisan naskah kuno se-Asia Tenggara',
        'Federated learning lintas perguruan tinggi untuk privasi data pendidikan',
        'Kolaborasi penelitian model fondasi generasi berikutnya bersama lab dunia'
      ]
    }
  ]
};
