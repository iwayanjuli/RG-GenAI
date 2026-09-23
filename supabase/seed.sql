-- ==============================================================================
-- DATABASE SEED DATA: Generative AI Research Group - Universitas Pendidikan Ganesha
-- ==============================================================================

-- 1. Insert Initial Users
INSERT INTO users (id, full_name, email, role) VALUES
('a0000000-0000-0000-0000-000000000001', 'Dr. I Gede Surya Raharja', 'surya.raharja@undiksha.ac.id', 'Super Admin'),
('a0000000-0000-0000-0000-000000000002', 'Dr. Ni Luh Putu Swastini', 'putu.swastini@undiksha.ac.id', 'Admin'),
('a0000000-0000-0000-0000-000000000003', 'Wayan Hendra Pratama', 'hendra.pratama@undiksha.ac.id', 'Editor')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Research Areas
INSERT INTO research_areas (id, title, slug, summary, description, icon, research_questions, methods, technologies, display_order, is_featured) VALUES
('b0000000-0000-0000-0000-000000000001', 'Large Language Models (LLMs)', 'large-language-models', 'Riset fundamental arsitektur transformator, adaptasi domain, dan efisiensi parameter untuk bahasa berkarakter spesifik.', 'Fokus pada adaptasi model bahasa fondasi sumber terbuka (seperti LLaMA, Mistral, dan Gemma) melalui teknik PEFT, LoRA, QLoRA guna mengakomodasi kosakata morfologis bahasa daerah.', 'Brain', ARRAY['Bagaimana mengoptimalkan efisiensi komputasi adaptasi LLM untuk bahasa daerah berkosakata rendah?'], ARRAY['LoRA & QLoRA Fine-tuning', 'Continual Pretraining', 'DPO'], ARRAY['PyTorch', 'Transformers', 'vLLM', 'DeepSpeed'], 1, true),
('b0000000-0000-0000-0000-000000000002', 'Retrieval-Augmented Generation (RAG)', 'retrieval-augmented-generation', 'Arsitektur RAG canggih untuk meminimalisasi halusinasi data dan menyajikan rujukan ilmiah kredibel.', 'Pengembangan pipeline RAG modular dengan hybrid dense-sparse retrieval, reranking multi-tahap, dan integrasi knowledge graph.', 'Database', ARRAY['Bagaimana merancang arsitektur RAG yang adaptif terhadap dokumen akademik multi-struktur?'], ARRAY['Hybrid Dense & BM25 Search', 'Cross-Encoder Re-ranking'], ARRAY['LangChain', 'LlamaIndex', 'Qdrant'], 2, true),
('b0000000-0000-0000-0000-000000000003', 'Generative AI Agents', 'generative-ai-agents', 'Sistem agen otonom berbasis LLM dengan kemampuan perencana interaktif, penalaran reflektif, dan eksekusi alat.', 'Mengeksplorasi ekosistem multi-agent workflows di mana agen-agen spesialis berkolaborasi untuk memecahkan problem kurikulum dan simulasi pengajaran.', 'Bot', ARRAY['Bagaimana koordinasi multi-agen mencegah deadlocks dalam tugas komputasional kompleks?'], ARRAY['ReAct Prompting', 'Reflexion Architecture'], ARRAY['CrewAI', 'LangGraph', 'FastAPI'], 3, true),
('b0000000-0000-0000-0000-000000000004', 'Multimodal Generative AI', 'multimodal-generative-ai', 'Integrasi representasi visual, audio, dan teks untuk pemahaman konten holistik dan digitalisasi budaya.', 'Meneliti model Vision-Language (VLM) dan generative diffusion untuk preservasi manuskrip lontar dan transliterasi otomatis aksara Bali.', 'Sparkles', ARRAY['Bagaimana meningkatkan akurasi transliterasi OCR manuskrip lontar lapuk menggunakan multimodal attention?'], ARRAY['Vision-Language Alignment', 'Cross-Attention Fusion'], ARRAY['Stable Diffusion', 'CLIP', 'PyTorch'], 4, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Members
INSERT INTO members (id, name, academic_title, position, category, expertise, biography, photo_url, email, display_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'Dr. I Gede Surya Raharja', 'S.Kom., M.Cs.', 'Head of Research Group & Associate Professor', 'Head of Research Group', ARRAY['Large Language Models', 'Low-Resource NLP', 'Responsible AI'], 'Akademisi dan peneliti di Universitas Pendidikan Ganesha berfokus pada adaptasi model fondasi generatif untuk bahasa nusantara.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', 'surya.raharja@undiksha.ac.id', 1, true),
('c0000000-0000-0000-0000-000000000002', 'Dr. Ni Luh Putu Swastini', 'S.T., M.T.', 'Lead Researcher in Multimodal AI', 'Researcher', ARRAY['Multimodal Generative AI', 'Computer Vision', 'Cultural Heritage Preservation'], 'Spesialis Computer Vision dan Multimodal AI. Meneliti integrasi penglihatan komputer dan pemrosesan bahasa alami untuk manuskrip lontar Bali.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80', 'putu.swastini@undiksha.ac.id', 2, true),
('c0000000-0000-0000-0000-000000000003', 'I Made Agus Wirawan', 'S.Pd., M.Kom.', 'Senior Researcher & Lecturer', 'Lecturer', ARRAY['AI for Education', 'Retrieval-Augmented Generation', 'Intelligent Tutoring'], 'Dosen Pendidikan Teknik Informatika Undiksha dengan fokus riset arsitektur RAG dan evaluasi pemahaman siswa.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 'agus.wirawan@undiksha.ac.id', 3, true)
ON CONFLICT (id) DO NOTHING;
