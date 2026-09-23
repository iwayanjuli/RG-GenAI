import { Member, ResearchArea, Project, Publication, Partner, ContactMessage } from '../types';

export const initialMembers: Member[] = [
  {
    id: 'm-1',
    name: 'Dr. I Gede Surya Raharja',
    academic_title: 'S.Kom., M.Cs.',
    position: 'Head of Research Group & Associate Professor',
    category: 'Head of Research Group',
    expertise: ['Large Language Models', 'Low-Resource NLP', 'Responsible AI', 'Deep Learning'],
    biography: 'Dr. I Gede Surya Raharja merupakan akademisi dan peneliti di Universitas Pendidikan Ganesha yang berfokus pada adaptasi model fondasi generatif untuk bahasa nusantara dan pemanfaatan AI dalam transformasi pendidikan tinggi. Menyelesaikan program doktoral di bidang Computer Science dengan spesialisasi Natural Language Processing.',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'surya.raharja@undiksha.ac.id',
    google_scholar_url: 'https://scholar.google.com/',
    orcid_url: 'https://orcid.org/0000-0002-1825-0097',
    linkedin_url: 'https://linkedin.com/in/surya-raharja',
    github_url: 'https://github.com/surya-undiksha',
    display_order: 1,
    is_active: true
  },
  {
    id: 'm-2',
    name: 'Dr. Ni Luh Putu Swastini',
    academic_title: 'S.T., M.T.',
    position: 'Lead Researcher in Multimodal AI',
    category: 'Researcher',
    expertise: ['Multimodal Generative AI', 'Computer Vision', 'Cultural Heritage Preservation', 'Diffusion Models'],
    biography: 'Spesialis Computer Vision dan Multimodal AI. Meneliti integrasi penglihatan komputer dan pemrosesan bahasa alami untuk preservasi manuskrip lontar kuno Bali serta visual storytelling menggunakan diffusion models.',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'putu.swastini@undiksha.ac.id',
    google_scholar_url: 'https://scholar.google.com/',
    orcid_url: 'https://orcid.org/0000-0003-4921-2311',
    linkedin_url: 'https://linkedin.com/in/putu-swastini',
    github_url: 'https://github.com/swastini-ai',
    display_order: 2,
    is_active: true
  },
  {
    id: 'm-3',
    name: 'I Made Agus Wirawan',
    academic_title: 'S.Pd., M.Kom.',
    position: 'Senior Researcher & Lecturer',
    category: 'Lecturer',
    expertise: ['AI for Education', 'Retrieval-Augmented Generation (RAG)', 'Intelligent Tutoring Systems'],
    biography: 'Dosen Pendidikan Teknik Informatika Undiksha dengan fokus riset arsitektur RAG, evaluasi pemahaman siswa berbasis agentic workflows, dan etika implementasi Generative AI dalam ruang kelas digital.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'agus.wirawan@undiksha.ac.id',
    google_scholar_url: 'https://scholar.google.com/',
    orcid_url: 'https://orcid.org/0000-0001-8723-9902',
    linkedin_url: 'https://linkedin.com/in/agus-wirawan-undiksha',
    github_url: 'https://github.com/aguswirawan',
    display_order: 3,
    is_active: true
  },
  {
    id: 'm-4',
    name: 'Kadek Dwi Pradnyana',
    academic_title: 'S.Kom., M.Eng.',
    position: 'Researcher in Autonomous Agents & Alignment',
    category: 'Researcher',
    expertise: ['AI Agents', 'LLM Alignment (RLHF/DPO)', 'Prompt Engineering', 'High-Performance Computing'],
    biography: 'Aktif meneliti arsitektur LLM Agentic orchestration, self-reflective prompting, dan alignment model terbuka terhadap norma etika serta budaya lokal Indonesia.',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'kadek.dwi@undiksha.ac.id',
    google_scholar_url: 'https://scholar.google.com/',
    orcid_url: 'https://orcid.org/0000-0002-9912-3456',
    linkedin_url: 'https://linkedin.com/in/kadek-pradnyana',
    github_url: 'https://github.com/kadekpradnyana',
    display_order: 4,
    is_active: true
  },
  {
    id: 'm-5',
    name: 'Komang Ayu Triandini',
    academic_title: 'S.Kom.',
    position: 'Graduate Student Researcher',
    category: 'Student Researcher',
    expertise: ['Vector Databases', 'Hybrid Search', 'Balinese Lexicon Extraction'],
    biography: 'Mahasiswa Magister Ilmu Komputer yang mengkaji teknik hybrid semantic retrieval pada corpus dokumen dwibahasa Bali-Indonesia untuk implementasi RAG presisi tinggi.',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'komang.triandini@student.undiksha.ac.id',
    google_scholar_url: 'https://scholar.google.com/',
    orcid_url: 'https://orcid.org/',
    linkedin_url: 'https://linkedin.com/',
    github_url: 'https://github.com/ayutriandini',
    display_order: 5,
    is_active: true
  },
  {
    id: 'm-6',
    name: 'Wayan Hendra Pratama',
    academic_title: 'S.Pd.',
    position: 'Research Assistant & Full-stack Engineer',
    category: 'Research Assistant',
    expertise: ['Full-stack MLOps', 'API Integration', 'Model Benchmarking', 'Frontend Engineering'],
    biography: 'Asisten peneliti pengelola infrastruktur komputasi laboratorium, deployment model API, dan visualisasi antarmuka sistem prototipe AI untuk riset grup.',
    photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    email: 'hendra.pratama@undiksha.ac.id',
    google_scholar_url: 'https://scholar.google.com/',
    orcid_url: 'https://orcid.org/',
    linkedin_url: 'https://linkedin.com/in/hendrapratama',
    github_url: 'https://github.com/hendrapratama',
    display_order: 6,
    is_active: true
  }
];

export const initialResearchAreas: ResearchArea[] = [
  {
    id: 'ra-1',
    title: 'Large Language Models (LLMs)',
    slug: 'large-language-models',
    summary: 'Riset fundamental arsitektur transformator, adaptasi domain, dan efisiensi parameter untuk bahasa berkarakter spesifik.',
    description: 'Fokus pada adaptasi model bahasa fondasi sumber terbuka (seperti LLaMA, Mistral, dan Gemma) melalui teknik Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA) guna mengakomodasi kosakata morfologis bahasa daerah serta domain sains pendidikan.',
    icon: 'Brain',
    research_questions: [
      'Bagaimana mengoptimalkan efisiensi komputasi adaptasi LLM untuk bahasa daerah berkosakata rendah?',
      'Sejauh mana transfer learning lintas bahasa mempertahankan kemampuan penalaran logis matematika?'
    ],
    methods: ['LoRA & QLoRA Fine-tuning', 'Continual Pretraining', 'Direct Preference Optimization (DPO)', 'Quantization (4-bit/8-bit)'],
    technologies: ['PyTorch', 'Hugging Face Transformers', 'vLLM', 'DeepSpeed', 'TRL'],
    display_order: 1,
    is_featured: true
  },
  {
    id: 'ra-2',
    title: 'Retrieval-Augmented Generation (RAG)',
    slug: 'retrieval-augmented-generation',
    summary: 'Arsitektur RAG canggih untuk meminimalisasi halusinasi data dan menyajikan rujukan ilmiah kredibel.',
    description: 'Pengembangan pipeline RAG modular dengan hybrid dense-sparse retrieval, reranking multi-tahap, self-corrective query decomposition, dan integrasi knowledge graph untuk institusi pendidikan dan literatur ilmiah.',
    icon: 'Database',
    research_questions: [
      'Bagaimana merancang arsitektur RAG yang adaptif terhadap dokumen akademik multi-struktur?',
      'Metode apa yang paling efektif dalam memverifikasi sitasi yang dihasilkan oleh generator teks secara otomatis?'
    ],
    methods: ['Hybrid Dense & BM25 Search', 'Cross-Encoder Re-ranking', 'Context Compression', 'Graph-augmented Retrieval'],
    technologies: ['LangChain', 'LlamaIndex', 'Qdrant', 'Milvus', 'ChromaDB'],
    display_order: 2,
    is_featured: true
  },
  {
    id: 'ra-3',
    title: 'Generative AI Agents',
    slug: 'generative-ai-agents',
    summary: 'Sistem agen otonom berbasis LLM dengan kemampuan perencana interaktif, penalaran reflektif, dan eksekusi alat.',
    description: 'Mengeksplorasi ekosistem multi-agent workflows di mana agen-agen spesialis berkolaborasi untuk memecahkan problem kurikulum, evaluasi program otomatis, dan simulasi pengajaran kolaboratif.',
    icon: 'Bot',
    research_questions: [
      'Bagaimana koordinasi multi-agen mencegah deadlocks dalam pemecahan tugas komputasional kompleks?',
      'Bagaimana mengukur keandalan memori jangka panjang agen AI dalam konteks tutoring?'
    ],
    methods: ['ReAct Prompting', 'Reflexion Architecture', 'Plan-and-Solve', 'Hierarchical Multi-Agent Coordination'],
    technologies: ['CrewAI', 'LangGraph', 'AutoGPT', 'Python', 'FastAPI'],
    display_order: 3,
    is_featured: true
  },
  {
    id: 'ra-4',
    title: 'Multimodal Generative AI',
    slug: 'multimodal-generative-ai',
    summary: 'Integrasi representasi visual, audio, dan teks untuk pemahaman konten holistik dan digitalisasi budaya.',
    description: 'Meneliti model Vision-Language (VLM) dan generative diffusion untuk preservasi manuskrip lontar, transliterasi otomatis gambar aksara tradisional Bali ke teks Latin, serta pembangkitan materi pembelajaran visual interaktif.',
    icon: 'Sparkles',
    research_questions: [
      'Bagaimana meningkatkan akurasi transliterasi OCR manuskrip lontar lapuk menggunakan multimodal attention?',
      'Apakah representasi multimodal mampu membangkitkan rekonstruksi citra artefak sejarah secara presisi?'
    ],
    methods: ['Vision-Language Alignment (CLIP/SigLIP)', 'Cross-Attention Fusion', 'Latent Diffusion', 'Segment Anything (SAM)'],
    technologies: ['Stable Diffusion', 'BLIP-2', 'CLIP', 'OpenCV', 'PyTorch'],
    display_order: 4,
    is_featured: true
  },
  {
    id: 'ra-5',
    title: 'Natural Language Processing (NLP)',
    slug: 'natural-language-processing',
    summary: 'Pemrosesan komputasional bahasa alami berfokus pada bahasa daerah berdaya sumber rendah (Low-Resource Languages).',
    description: 'Penyusunan korpus standar, tokenization khusus bahasa nusantara (termasuk Bahasa Bali dialek dataran dan pegunungan), part-of-speech tagging, dan analisis sentimen kultural.',
    icon: 'MessageSquare',
    research_questions: [
      'Bagaimana morfologi aglutinatif bahasa daerah memengaruhi efisiensi subword tokenizers?',
      'Strategi data augmentation apa yang optimal untuk korpus bahasa berkosakata terbatas?'
    ],
    methods: ['Byte-Pair Encoding kustom', 'Supervised Morphological Parsing', 'Few-shot Synthetic Augmentation'],
    technologies: ['spaCy', 'Stanza', 'NLTK', 'Transformers'],
    display_order: 5,
    is_featured: true
  },
  {
    id: 'ra-6',
    title: 'Computer Vision',
    slug: 'computer-vision',
    summary: 'Ekstraksi fitur visual, deteksi anomali, dan pemrosesan citra dokumen historis beresolusi tinggi.',
    description: 'Riset computer vision untuk rekonstruksi citra dokumen lontar, deteksi struktur tata letak naskah, dan pengenalan ekspresi/interaksi gestur mahasiswa dalam pembelajaran daring.',
    icon: 'Eye',
    research_questions: [
      'Bagaimana memisahkan noise goresan fisik pada daun lontar dari goresan aksara berkarakter halus?'
    ],
    methods: ['Contrastive Learning', 'Image Inpainting', 'U-Net Binarization'],
    technologies: ['YOLOv8', 'Detectron2', 'OpenCV', 'PyTorch Vision'],
    display_order: 6,
    is_featured: false
  },
  {
    id: 'ra-7',
    title: 'Responsible & Ethical AI',
    slug: 'responsible-ai',
    summary: 'Pengembangan tata kelola etis, mitigasi bias kultural, deteksi halusinasi, dan transparansi algoritma AI.',
    description: 'Menyusun kerangka kerja evaluasi keamanan model fondasi dari perspektif etika lokal Indonesia, kepatuhan privasi data pendidikan, serta deteksi plagiarisme dan konten AI generated (watermarking).',
    icon: 'ShieldCheck',
    research_questions: [
      'Bagaimana mendeteksi bias representasi sosio-kultural dalam LLM yang dilatih secara global?',
      'Metode watermarking apa yang tahan terhadap parafrase dan serangan kompresi teks?'
    ],
    methods: ['Toxicity Benchmarking', 'Constitutional AI', 'Differential Privacy', 'Explainable AI (SHAP/LIME)'],
    technologies: ['Garak', 'Promptfoo', 'Trulens', 'Captum'],
    display_order: 7,
    is_featured: true
  },
  {
    id: 'ra-8',
    title: 'AI for Education (AI4Edu)',
    slug: 'ai-for-education',
    summary: 'Transformasi pedagogi modern melalui personalisasi pembelajaran, asesmen otomatis, dan scaffold tutor adaptif.',
    description: 'Perancangan lingkungan pembelajaran cerdas (Intelligent Tutoring Systems) yang memanfaatkan Generative AI untuk menyusun soal evaluasi berbasis Taksonomi Bloom dan memberikan umpan balik formatif real-time kepada siswa.',
    icon: 'GraduationCap',
    research_questions: [
      'Seberapa efektif umpan balik generatif instan dalam meningkatkan penguasaan konsep algoritma mahasiswa?',
      'Bagaimana merancang interaksi AI yang mendorong metakognisi tanpa menimbulkan ketergantungan berlebih?'
    ],
    methods: ['Adaptive Feedback Generation', 'Cognitive Load Assessment', 'Automated Rubric Scoring'],
    technologies: ['LTI 1.3 Tools', 'Moodle AI Plugins', 'WebAssembly', 'Next.js'],
    display_order: 8,
    is_featured: true
  },
  {
    id: 'ra-9',
    title: 'AI for Social Impact',
    slug: 'ai-for-social-impact',
    summary: 'Penerapan teknologi generatif untuk pemecahan persoalan nyata masyarakat, pariwisata berkelanjutan, dan budaya.',
    description: 'Kolaborasi dengan desa adat, komunitas pendidikan pedesaan di Bali, serta dinas kebudayaan guna menghadirkan akses literasi digital, asisten pariwisata cerdas berbasis kearifan lokal, dan inklusi penyandang disabilitas.',
    icon: 'HeartHandshake',
    research_questions: [
      'Bagaimana AI percakapan berbasis kearifan lokal dapat mengedukasi wisatawan mengenai etika pura dan adat Bali?'
    ],
    methods: ['Participatory Design', 'Cultural Alignment Testing', 'Edge-AI Offline Deployment'],
    technologies: ['ONNX Runtime', 'Whisper ASR', 'FastAPI'],
    display_order: 9,
    is_featured: false
  }
];

export const initialProjects: Project[] = [
  {
    id: 'p-1',
    title: 'AksaraGen-VLM: Vision-Language Model untuk Digitalisasi Manuskrip Lontar Kuno Bali',
    slug: 'aksaragen-vlm-lontar-bali',
    short_description: 'Model multimodal terpadu untuk pengenalan, transliterasi otomatis, dan ekstraksi makna naskah lontar Bali abad ke-16.',
    description: 'Proyek unggulan yang menggabungkan penglihatan komputer tingkat lanjut dengan model bahasa generatif untuk mendokumentasikan serta menerjemahkan ribuan daun lontar kuno di Bali. Sistem mampu merekonstruksi bagian aksara yang pudar akibat usia serta menyajikan tafsir kontekstual dalam Bahasa Indonesia dan Bahasa Inggris secara akurat.',
    cover_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    start_year: 2024,
    end_year: 2026,
    status: 'Active',
    research_area_id: 'ra-4',
    research_area_title: 'Multimodal Generative AI',
    project_leader_id: 'm-2',
    project_leader_name: 'Dr. Ni Luh Putu Swastini, S.T., M.T.',
    funding_source: 'Hibah Penelitian Terapan Kemendikbudristek & DIPA Undiksha',
    partners: ['Pusat Dokumentasi Kebudayaan Bali', 'Balai Bahasa Provinsi Bali', 'NVIDIA Academic Program'],
    technologies: ['PyTorch', 'Vision-Language Transformers', 'Diffusion Inpainting', 'FastAPI', 'Docker'],
    objectives: [
      'Membangun dataset benchmark lontar aksara Bali beranotasi 50.000 citra lempir.',
      'Melatih model Vision-Language khusus dengan kemampuan Character Error Rate (CER) di bawah 3.5%.',
      'Mengembangkan platform katalog interaktif berbasis web untuk arsip budaya nasional.'
    ],
    outcomes: [
      'Model open-weights AksaraGen-VLM v1.0 di Hugging Face.',
      '1 Publikasi Jurnal Internasional Bereputasi Q1 di Elsevier Pattern Recognition.',
      'Hak Cipta Perangkat Lunak Digitalisasi Lontar Undiksha.'
    ],
    demo_url: 'https://aksaragen.undiksha.ac.id',
    github_url: 'https://github.com/undiksha-genai/aksaragen-vlm',
    document_url: 'https://undiksha.ac.id/research/reports/aksaragen-2024.pdf',
    is_featured: true,
    gallery: [
      {
        id: 'g-1',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        caption: 'Proses pemindaian spektral lempir lontar kuno di laboratorium AI Undiksha.'
      },
      {
        id: 'g-2',
        image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        caption: 'Visualisasi attention map model VLM terhadap glif aksara Bali.'
      }
    ],
    team_members: [
      { id: 'm-2', name: 'Dr. Ni Luh Putu Swastini', role: 'Project Leader' },
      { id: 'm-1', name: 'Dr. I Gede Surya Raharja', role: 'NLP & Language Specialist' },
      { id: 'm-6', name: 'Wayan Hendra Pratama', role: 'MLOps & Deployment Engineer' }
    ]
  },
  {
    id: 'p-2',
    title: 'EduGen RAG Undiksha: Asisten Cerdas Kurikulum & Pembelajaran Adaptif Kampus',
    slug: 'edugen-rag-undiksha',
    short_description: 'Sistem penalaran dokumen akademik berbasis RAG untuk membantu mahasiswa dan dosen dalam silabus serta materi studi.',
    description: 'EduGen RAG dirancang untuk mengindeks ribuan Rencana Pembelajaran Semester (RPS), modul praktikum, panduan akademik, dan jurnal internal Universitas Pendidikan Ganesha. Memanfaatkan arsitektur hybrid retrieval dengan reranking lintas konteks untuk memberikan jawaban instan, verifikasi sitasi akurat tanpa halusinasi.',
    cover_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    start_year: 2024,
    end_year: 2025,
    status: 'Active',
    research_area_id: 'ra-2',
    research_area_title: 'Retrieval-Augmented Generation (RAG)',
    project_leader_id: 'm-3',
    project_leader_name: 'I Made Agus Wirawan, S.Pd., M.Kom.',
    funding_source: 'Program Pendanaan Inovasi Perguruan Tinggi (DIKTI) 2024',
    partners: ['LPPMP Undiksha', 'PT Talenta AI Nusantara'],
    technologies: ['LangChain', 'LlamaIndex', 'Qdrant Vector DB', 'Next.js', 'PostgreSQL'],
    objectives: [
      'Mengurangi beban administratif dosen dalam pemetaan capaian pembelajaran lulusan (CPL).',
      'Menyediakan bot konsultasi kurikulum mandiri 24/7 bagi 18.000 mahasiswa aktif Undiksha.',
      'Mengimplementasikan zero-hallucination guardrails berbasis factual checking.'
    ],
    outcomes: [
      'Telah diuji coba pada Fakultas Teknik dan Kejuruan dengan kepuasan pengguna 92.4%.',
      '2 Prosiding IEEE International Conference on Learning Technologies.'
    ],
    demo_url: 'https://edugen.undiksha.ac.id',
    github_url: 'https://github.com/undiksha-genai/edugen-rag',
    document_url: 'https://undiksha.ac.id/research/reports/edugen-2024.pdf',
    is_featured: true,
    team_members: [
      { id: 'm-3', name: 'I Made Agus Wirawan', role: 'Project Leader' },
      { id: 'm-5', name: 'Komang Ayu Triandini', role: 'Data & Retrieval Specialist' }
    ]
  },
  {
    id: 'p-3',
    title: 'Balinese-LLaMA: Fine-Tuned LLM untuk Preservasi & Terjemahan Dialek Bali',
    slug: 'balinese-llama-dialect-model',
    short_description: 'Adaptasi model fondasi LLaMA 3 dengan korpus linguistik Bahasa Bali Alus, Madia, dan Ketah.',
    description: 'Inisiatif penelitian untuk menjembatani kesenjangan representasi kecerdasan buatan pada bahasa daerah nusantara. Model dilatih dengan korpus multi-tingkatan tutur bahasa Bali (Anggah-Ungguhing Basa Bali) menggunakan pendekatan continual pretraining dan DPO (Direct Preference Optimization).',
    cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    start_year: 2023,
    end_year: 2025,
    status: 'Active',
    research_area_id: 'ra-1',
    research_area_title: 'Large Language Models (LLMs)',
    project_leader_id: 'm-1',
    project_leader_name: 'Dr. I Gede Surya Raharja, S.Kom., M.Cs.',
    funding_source: 'Hibah Riset Kolaboratif Nasional BRIN 2023-2025',
    partners: ['BRIN Organisasi Riset Informatika', 'Universitas Udayana', 'Google Cloud Academic Research'],
    technologies: ['PyTorch', 'Hugging Face', 'Deepspeed ZeRO-3', 'NVIDIA A100 Clustered'],
    objectives: [
      'Menyusun korpus paralel terkurasi 120 juta token untuk ragam tingkatan tutur bahasa Bali.',
      'Melatih tokenizer kustom dengan kompresi subword 3.2x lebih efisien dibanding standar LLaMA tokenizer.',
      'Mengevaluasi kepekaan pragmatis dan kesopanan linguistik budaya Bali.'
    ],
    outcomes: [
      'Bobot model terbuka di Hugging Face: undiksha/balinese-llama-8b-instruct.',
      'Publikasi di ACM Transactions on Asian and Low-Resource Language Information Processing.'
    ],
    demo_url: 'https://huggingface.co/undiksha-genai/balinese-llama-8b-instruct',
    github_url: 'https://github.com/undiksha-genai/balinese-llama',
    document_url: 'https://undiksha.ac.id/research/reports/balinese-llama.pdf',
    is_featured: true,
    team_members: [
      { id: 'm-1', name: 'Dr. I Gede Surya Raharja', role: 'Principal Investigator' },
      { id: 'm-4', name: 'Kadek Dwi Pradnyana', role: 'Alignment & Optimization' }
    ]
  },
  {
    id: 'p-4',
    title: 'AutoCode Tutor: Multi-Agent AI System untuk Praktikum Pemrograman Mahasiswa',
    slug: 'autocode-tutor-multi-agent',
    short_description: 'Agen AI scaffolding cerdas yang membimbing mahasiswa memecahkan eror algoritma tanpa membocorkan solusi langsung.',
    description: 'Sistem multi-agen berbasis pedagogi Socratic Method. Terdiri dari Code Analyser Agent, Socratic Questioner Agent, dan Feedback Evaluator Agent yang memandu mahasiswa menemukan kekeliruan sintaks dan logika pemrograman secara mandiri.',
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    start_year: 2023,
    end_year: 2024,
    status: 'Completed',
    research_area_id: 'ra-3',
    research_area_title: 'Generative AI Agents',
    project_leader_id: 'm-4',
    project_leader_name: 'Kadek Dwi Pradnyana, S.Kom., M.Eng.',
    funding_source: 'DIPA BLU Undiksha 2023',
    partners: ['Jurusan Teknik Informatika FTK Undiksha'],
    technologies: ['CrewAI', 'LangGraph', 'FastAPI', 'React', 'Monaco Code Editor'],
    objectives: [
      'Menurunkan tingkat frustrasi mahasiswa tahun pertama saat debugging kode C++ dan Python.',
      'Membatasi kecenderungan copy-paste jawaban instan dari chat model komersial.'
    ],
    outcomes: [
      'Peningkatan nilai ujian praktikum mahasiswa sebesar 21.8% pada kelompok uji coba.',
      'Publikasi di IEEE Transactions on Learning Technologies.'
    ],
    demo_url: 'https://autocode.undiksha.ac.id',
    github_url: 'https://github.com/undiksha-genai/autocode-tutor',
    document_url: 'https://undiksha.ac.id/research/reports/autocode-2024.pdf',
    is_featured: false,
    team_members: [
      { id: 'm-4', name: 'Kadek Dwi Pradnyana', role: 'Project Leader' },
      { id: 'm-3', name: 'I Made Agus Wirawan', role: 'Pedagogy Evaluation' }
    ]
  },
  {
    id: 'p-5',
    title: 'EthicSEAsia: Tolok Ukur Etika dan Mitigasi Halusinasi Model Generatif Asia Tenggara',
    slug: 'ethic-seasia-benchmark',
    short_description: 'Framework komprehensif untuk pengujian bias nilai norma, halusinasi fakta, dan keamanan output LLM di kawasan ASEAN.',
    description: 'Proyek kerja sama internasional untuk mengevaluasi perilaku model bahasa komersial maupun open-source ketika dihadapkan pada pertanyaan sensitif berkaitan dengan norma hukum, sejarah, dan nilai-nilai multikultural Asia Tenggara.',
    cover_image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
    start_year: 2025,
    end_year: 2027,
    status: 'Planned',
    research_area_id: 'ra-7',
    research_area_title: 'Responsible & Ethical AI',
    project_leader_id: 'm-1',
    project_leader_name: 'Dr. I Gede Surya Raharja, S.Kom., M.Cs.',
    funding_source: 'Southeast Asia Collaborative Research Grant',
    partners: ['National University of Singapore (Collaborator)', 'Universitas Gadjah Mada', 'UNESCO Asia-Pacific'],
    technologies: ['Garak Red Teaming', 'PyTorch', 'Promptfoo', 'Streamlit Dashboard'],
    objectives: [
      'Merilis dataset pengujian 10.000 prompt red-teaming konteks regional ASEAN.',
      'Mempublikasikan indeks transparansi Generative AI tahunan untuk institusi publik.'
    ],
    outcomes: [
      'Laporan Kebijakan Etika AI untuk Kemendikbudristek.',
      'Suite evaluasi otomatis open-source di GitHub.'
    ],
    demo_url: '',
    github_url: 'https://github.com/undiksha-genai/ethic-seasia',
    document_url: '',
    is_featured: false,
    team_members: [
      { id: 'm-1', name: 'Dr. I Gede Surya Raharja', role: 'Lead Coordinator' },
      { id: 'm-4', name: 'Kadek Dwi Pradnyana', role: 'Red Teaming Engineer' }
    ]
  }
];

export const initialPublications: Publication[] = [
  {
    id: 'pub-1',
    title: 'AksaraGen: Cross-Modal Vision-Language Transformer for Ancient Palm-Leaf Manuscript Transliteration and Contextual Restoration',
    slug: 'aksaragen-cross-modal-vision-language-transformer',
    abstract: 'Ancient palm-leaf manuscripts (lontar) represent irreplaceable cultural heritage in Southeast Asia, yet physical decay and non-standardized cursive scripts hinder conventional OCR tools. In this study, we propose AksaraGen, an end-to-end vision-language framework combining a lightweight convolutional visual encoder with a specialized generative decoder pre-trained on low-resource Austronesian scripts. AksaraGen achieves a 3.2% Character Error Rate (CER), significantly outperforming baseline models, while providing contextual restoration for fractured characters.',
    publication_type: 'Journal Article',
    journal_or_conference: 'IEEE Access (IEEE, Q1, IF: 3.9)',
    publisher: 'IEEE',
    publication_year: 2025,
    volume: '13',
    issue: '2',
    pages: '11204-11219',
    doi: '10.1109/ACCESS.2025.3458190',
    keywords: ['Vision-Language Models', 'Optical Character Recognition', 'Cultural Heritage Preservation', 'Balinese Lontar', 'Deep Learning'],
    pdf_url: 'https://ieeexplore.ieee.org/document/3458190',
    external_url: 'https://doi.org/10.1109/ACCESS.2025.3458190',
    bibtex: `@article{raharja2025aksaragen,
  title={AksaraGen: Cross-Modal Vision-Language Transformer for Ancient Palm-Leaf Manuscript Transliteration and Contextual Restoration},
  author={Swastini, Ni Luh Putu and Raharja, I Gede Surya and Pratama, Wayan Hendra},
  journal={IEEE Access},
  volume={13},
  pages={11204--11219},
  year={2025},
  publisher={IEEE},
  doi={10.1109/ACCESS.2025.3458190}
}`,
    research_area_id: 'ra-4',
    research_area_title: 'Multimodal Generative AI',
    authors: ['Ni Luh Putu Swastini', 'I Gede Surya Raharja', 'Wayan Hendra Pratama'],
    is_featured: true
  },
  {
    id: 'pub-2',
    title: 'Empowering Higher Education with Retrieval-Augmented Generation: Mitigating Factual Hallucinations in Indonesian Curricular Advising',
    slug: 'empowering-higher-education-rag-mitigating-hallucinations',
    abstract: 'The integration of Large Language Models into university advising frequently faces reliability challenges due to hallucinations regarding dynamic course prerequisites and graduation requirements. We present EduGen-RAG, an architecture coupling dense passage retrieval with semantic rerankers and strict provenance attribution over Indonesian educational standard documents. Comprehensive trials across 1,200 student queries demonstrate 96.8% factual accuracy with zero ungrounded policy citations.',
    publication_type: 'Journal Article',
    journal_or_conference: 'Computers and Education: Artificial Intelligence (Elsevier, Q1)',
    publisher: 'Elsevier',
    publication_year: 2024,
    volume: '7',
    pages: '100284',
    doi: '10.1016/j.caeai.2024.100284',
    keywords: ['Retrieval-Augmented Generation', 'Higher Education', 'Hallucination Mitigation', 'Academic Advising', 'Semantic Search'],
    pdf_url: 'https://sciencedirect.com/science/article/pii/S2666920X2400284X',
    external_url: 'https://doi.org/10.1016/j.caeai.2024.100284',
    bibtex: `@article{wirawan2024empowering,
  title={Empowering Higher Education with Retrieval-Augmented Generation: Mitigating Factual Hallucinations in Indonesian Curricular Advising},
  author={Wirawan, I Made Agus and Triandini, Komang Ayu and Raharja, I Gede Surya},
  journal={Computers and Education: Artificial Intelligence},
  volume={7},
  pages={100284},
  year={2024},
  publisher={Elsevier},
  doi={10.1016/j.caeai.2024.100284}
}`,
    research_area_id: 'ra-2',
    research_area_title: 'Retrieval-Augmented Generation (RAG)',
    authors: ['I Made Agus Wirawan', 'Komang Ayu Triandini', 'I Gede Surya Raharja'],
    is_featured: true
  },
  {
    id: 'pub-3',
    title: 'Balinese-LLaMA: Fine-Tuning Open Foundation Models for Hierarchical Honorific Registers in Low-Resource Austronesian Dialects',
    slug: 'balinese-llama-hierarchical-honorific-registers',
    abstract: 'Balinese features complex socio-linguistic honorific strata (Alus, Madia, and Ketah) requiring models to not only comprehend semantic semantics but also match contextual social relationships. This paper introduces Balinese-LLaMA, an aligned open model tuned on a novel parallel corpus of 120M tokens. We demonstrate how Direct Preference Optimization (DPO) calibrated with native linguistic experts reduces register mismatch by 44.7% over generic multilingually trained LLMs.',
    publication_type: 'Conference Paper',
    journal_or_conference: 'Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (ACL 2024)',
    publisher: 'Association for Computational Linguistics',
    publication_year: 2024,
    pages: '4510-4523',
    doi: '10.18653/v1/2024.acl-long.245',
    keywords: ['Low-Resource NLP', 'Honorific Registers', 'Direct Preference Optimization', 'Balinese Language', 'Language Modeling'],
    pdf_url: 'https://aclanthology.org/2024.acl-long.245.pdf',
    external_url: 'https://doi.org/10.18653/v1/2024.acl-long.245',
    bibtex: `@inproceedings{raharja2024balinese,
  title={Balinese-LLaMA: Fine-Tuning Open Foundation Models for Hierarchical Honorific Registers in Low-Resource Austronesian Dialects},
  author={Raharja, I Gede Surya and Pradnyana, Kadek Dwi and Swastini, Ni Luh Putu},
  booktitle={Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (ACL 2024)},
  pages={4510--4523},
  year={2024},
  publisher={Association for Computational Linguistics},
  doi={10.18653/v1/2024.acl-long.245}
}`,
    research_area_id: 'ra-1',
    research_area_title: 'Large Language Models (LLMs)',
    authors: ['I Gede Surya Raharja', 'Kadek Dwi Pradnyana', 'Ni Luh Putu Swastini'],
    is_featured: true
  },
  {
    id: 'pub-4',
    title: 'Scaffolding Metacognition in Novice Programmers via Socratic Multi-Agent LLM Orchestration',
    slug: 'scaffolding-metacognition-novice-programmers-socratic-agents',
    abstract: 'Immediate code completion tools often degrade novice problem-solving skills by encouraging unreflective reliance. We designed a multi-agent environment where AI agents act as Socratic interlocutors, diagnosing logical bugs without generating terminal solutions. An empirical study with 148 undergraduate computer science students revealed significantly elevated metacognitive self-regulation scores and sustained mastery in subsequent unassisted examinations.',
    publication_type: 'Conference Paper',
    journal_or_conference: '2024 IEEE International Conference on Advanced Learning Technologies (ICALT 2024)',
    publisher: 'IEEE Computer Society',
    publication_year: 2024,
    pages: '118-122',
    doi: '10.1109/ICALT61200.2024.00035',
    keywords: ['Multi-Agent Systems', 'Socratic Tutoring', 'Computer Science Education', 'Metacognition', 'LLM Scaffolding'],
    pdf_url: 'https://ieeexplore.ieee.org/document/10632890',
    external_url: 'https://doi.org/10.1109/ICALT61200.2024.00035',
    bibtex: `@inproceedings{pradnyana2024scaffolding,
  title={Scaffolding Metacognition in Novice Programmers via Socratic Multi-Agent LLM Orchestration},
  author={Pradnyana, Kadek Dwi and Wirawan, I Made Agus},
  booktitle={2024 IEEE International Conference on Advanced Learning Technologies (ICALT)},
  pages={118--122},
  year={2024},
  publisher={IEEE},
  doi={10.1109/ICALT61200.2024.00035}
}`,
    research_area_id: 'ra-3',
    research_area_title: 'Generative AI Agents',
    authors: ['Kadek Dwi Pradnyana', 'I Made Agus Wirawan'],
    is_featured: false
  },
  {
    id: 'pub-5',
    title: 'Toward Culturally-Grounded AI Ethics in Southeast Asia: Benchmarking Norm Alignment and Bias in Multilingual Foundation Models',
    slug: 'culturally-grounded-ai-ethics-southeast-asia-benchmark',
    abstract: 'Most mainstream safety benchmarks reflect Western legalistic paradigms, occasionally misconstruing communal Asian social philosophies and local sensitivities. We introduce the SEA-Ethic benchmark containing 6,000 multi-turn cultural prompts in Bahasa Indonesia, Balinese, and Javanese. Our findings indicate that globally deployed closed models exhibit blind spots in detecting indirect micro-offenses while simultaneously over-refusing benign traditional folklore queries.',
    publication_type: 'Journal Article',
    journal_or_conference: 'AI and Ethics (Springer Nature)',
    publisher: 'Springer',
    publication_year: 2023,
    volume: '4',
    issue: '1',
    pages: '75-92',
    doi: '10.1007/s43681-023-00341-9',
    keywords: ['AI Ethics', 'Cultural Alignment', 'Responsible AI', 'Southeast Asian Context', 'Fairness Benchmarking'],
    pdf_url: 'https://link.springer.com/article/10.1007/s43681-023-00341-9',
    external_url: 'https://doi.org/10.1007/s43681-023-00341-9',
    bibtex: `@article{raharja2023culturally,
  title={Toward Culturally-Grounded AI Ethics in Southeast Asia: Benchmarking Norm Alignment and Bias in Multilingual Foundation Models},
  author={Raharja, I Gede Surya and Pradnyana, Kadek Dwi},
  journal={AI and Ethics},
  volume={4},
  number={1},
  pages={75--92},
  year={2023},
  publisher={Springer},
  doi={10.1007/s43681-023-00341-9}
}`,
    research_area_id: 'ra-7',
    research_area_title: 'Responsible & Ethical AI',
    authors: ['I Gede Surya Raharja', 'Kadek Dwi Pradnyana'],
    is_featured: true
  },
  {
    id: 'pub-6',
    title: 'AksaraNet: A Curated Benchmark Dataset of 50,000 Balinese Lontar Glyphs for Vision-Based Transcription',
    slug: 'aksaranet-curated-benchmark-dataset-balinese-lontar',
    abstract: 'We introduce and release AksaraNet, a publicly accessible open dataset containing over 50,000 digitized and expertly transcribed character-level patches from 18th to 20th century palm-leaf manuscripts preserved across North Bali. Accompanied by standardized baseline segmentation models and evaluation protocols.',
    publication_type: 'Dataset',
    journal_or_conference: 'Scientific Data (Nature Portfolio)',
    publisher: 'Nature Publishing Group',
    publication_year: 2024,
    volume: '11',
    pages: '482',
    doi: '10.1038/s41597-024-03312-x',
    keywords: ['Open Science', 'Dataset', 'Balinese Manuscript', 'Digital Humanities'],
    pdf_url: 'https://nature.com/articles/s41597-024-03312-x',
    external_url: 'https://doi.org/10.1038/s41597-024-03312-x',
    bibtex: `@article{swastini2024aksaranet,
  title={AksaraNet: A Curated Benchmark Dataset of 50,000 Balinese Lontar Glyphs for Vision-Based Transcription},
  author={Swastini, Ni Luh Putu and Pratama, Wayan Hendra and Raharja, I Gede Surya},
  journal={Scientific Data},
  volume={11},
  pages={482},
  year={2024},
  publisher={Nature Publishing Group},
  doi={10.1038/s41597-024-03312-x}
}`,
    research_area_id: 'ra-4',
    research_area_title: 'Multimodal Generative AI',
    authors: ['Ni Luh Putu Swastini', 'Wayan Hendra Pratama', 'I Gede Surya Raharja'],
    is_featured: false
  }
];

export const initialPartners: Partner[] = [
  {
    id: 'prt-1',
    name: 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI',
    logo_url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&h=100&q=80',
    website_url: 'https://kemdikbud.go.id',
    description: 'Mitra pendanaan skema Penelitian Terapan dan Inovasi Pembelajaran Digital.',
    partnership_type: 'Government',
    is_active: true
  },
  {
    id: 'prt-2',
    name: 'Badan Riset dan Inovasi Nasional (BRIN)',
    logo_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&h=100&q=80',
    website_url: 'https://brin.go.id',
    description: 'Kolaborasi riset kecerdasan artifisial untuk bahasa nusantara dan komputasi performa tinggi.',
    partnership_type: 'Government',
    is_active: true
  },
  {
    id: 'prt-3',
    name: 'NVIDIA Inception Academic Program',
    logo_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&h=100&q=80',
    website_url: 'https://nvidia.com',
    description: 'Dukungan hardware GPU komputasi dan akses software toolkit cuDNN serta TensorRT.',
    partnership_type: 'Industry',
    is_active: true
  },
  {
    id: 'prt-4',
    name: 'Balai Bahasa Provinsi Bali',
    logo_url: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=200&h=100&q=80',
    website_url: 'https://balaibahasabali.kemdikbud.go.id',
    description: 'Validasi linguistik, penyediaan korpus naskah sastra kuno, dan standarisasi transliterasi.',
    partnership_type: 'Academic',
    is_active: true
  },
  {
    id: 'prt-5',
    name: 'Google Cloud Academic Research',
    logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&h=100&q=80',
    website_url: 'https://cloud.google.com/edu',
    description: 'Hibah kredit komputasi awan TPU dan virtual instances untuk pelatihan model bahasa skala besar.',
    partnership_type: 'Industry',
    is_active: true
  },
  {
    id: 'prt-6',
    name: 'Pusat Dokumentasi Kebudayaan Bali',
    logo_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=200&h=100&q=80',
    website_url: 'https://disbud.baliprov.go.id',
    description: 'Akses konservasi manuskrip fisik lontar kuno dan kajian filologi naskah klasik Bali.',
    partnership_type: 'Community',
    is_active: true
  }
];

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Prof. Dr. Antonius Hartono',
    email: 'a.hartono@ugm.ac.id',
    institution: 'Universitas Gadjah Mada',
    subject: 'Undangan Kolaborasi Riset Hibah Konsorsium AI Nusantara 2026',
    inquiry_type: 'Research Collaboration',
    message: 'Yth. Dr. Surya Raharja dan tim Undiksha GenAI. Kami sangat tertarik dengan publikasi Balinese-LLaMA Anda di ACL. Lab kami di UGM sedang mengajukan proposal konsorsium model bahasa daerah nusantara terpadu dan ingin mengajak kelompok riset Anda sebagai Co-Principal Investigator untuk korpus wilayah Bali-Nusa Tenggara.',
    status: 'Read',
    created_at: '2026-09-18T09:30:00Z'
  },
  {
    id: 'msg-2',
    name: 'Sarah Dewanti',
    email: 'sarah.dewanti@edutech-asia.com',
    institution: 'PT EduTech Asia Solutions',
    subject: 'Peluang Kemitraan Komersialisasi & Pilot Project EduGen-RAG',
    inquiry_type: 'Industry Partnership',
    message: 'Halo tim Generative AI Undiksha, kami telah membaca makalah Anda mengenai EduGen-RAG. Perusahaan kami mengelola platform LMS untuk 40+ kampus swasta dan berkeinginan mendiskusikan lisensi teknologi atau pilot project bersama.',
    status: 'Unread',
    created_at: '2026-09-20T14:15:00Z'
  }
];
