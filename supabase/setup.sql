BEGIN;
-- ==============================================================================
-- DATABASE SCHEMA: Generative AI Research Group - Universitas Pendidikan Ganesha
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Admin & Editor Profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'Editor' CHECK (role IN ('Super Admin', 'Admin', 'Editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RESEARCH AREAS
CREATE TABLE IF NOT EXISTS research_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT 'Cpu',
    research_questions TEXT[] DEFAULT '{}',
    methods TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MEMBERS (Researchers, Lecturers, Students, Assistants)
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    academic_title VARCHAR(150),
    position VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Head of Research Group', 'Researcher', 'Lecturer', 'Student Researcher', 'Research Assistant')),
    expertise TEXT[] DEFAULT '{}',
    biography TEXT NOT NULL,
    photo_url TEXT,
    email VARCHAR(255) NOT NULL,
    google_scholar_url TEXT,
    orcid_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_image TEXT,
    start_year INT NOT NULL,
    end_year INT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Planned', 'Active', 'Completed')),
    research_area_id UUID REFERENCES research_areas(id) ON DELETE SET NULL,
    project_leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
    funding_source VARCHAR(255),
    partners TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    objectives TEXT[] DEFAULT '{}',
    outcomes TEXT[] DEFAULT '{}',
    demo_url TEXT,
    github_url TEXT,
    document_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECT MEMBERS (ManyToMany)
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Member'
);

-- 6. PROJECT GALLERY
CREATE TABLE IF NOT EXISTS project_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0
);

-- 7. PUBLICATIONS
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    abstract TEXT NOT NULL,
    publication_type VARCHAR(100) NOT NULL CHECK (publication_type IN (
        'Journal Article', 'Conference Paper', 'Book Chapter', 'Research Report', 'Dataset', 'Thesis', 'Intellectual Property'
    )),
    journal_or_conference VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_year INT NOT NULL,
    volume VARCHAR(50),
    issue VARCHAR(50),
    pages VARCHAR(50),
    doi VARCHAR(255),
    keywords TEXT[] DEFAULT '{}',
    pdf_url TEXT,
    external_url TEXT,
    bibtex TEXT,
    research_area_id UUID REFERENCES research_areas(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PUBLICATION AUTHORS
CREATE TABLE IF NOT EXISTS publication_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publication_id UUID REFERENCES publications(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    external_author_name VARCHAR(255),
    author_order INT DEFAULT 1
);

-- 9. PARTNERS (Collaboration network)
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    description TEXT,
    partnership_type VARCHAR(100) NOT NULL CHECK (partnership_type IN ('Academic', 'Industry', 'Government', 'Community')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    inquiry_type VARCHAR(100) NOT NULL CHECK (inquiry_type IN (
        'Research Collaboration', 'Industry Partnership', 'Student Internship', 'Research Membership', 'Media Inquiry', 'General Question'
    )),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Unread' CHECK (status IN ('Unread', 'Read', 'Replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_members_category ON members(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_year ON projects(start_year);
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(publication_year);
CREATE INDEX IF NOT EXISTS idx_publications_type ON publications(publication_type);
CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);


-- 11. ROADMAP PHASES
CREATE TABLE IF NOT EXISTS roadmap_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phase VARCHAR(100) NOT NULL,
    year_range VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    status VARCHAR(50) DEFAULT 'Planned' CHECK (status IN ('Completed', 'In Progress', 'Planned')),
    points TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    deliverables TEXT[] DEFAULT '{}',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmap_status ON roadmap_phases(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_display_order ON roadmap_phases(display_order);




-- Roles are maintained by trusted database operators, never user metadata.
CREATE OR REPLACE FUNCTION public.current_admin_role() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role::text FROM public.users WHERE id = auth.uid() $$;
REVOKE ALL ON FUNCTION public.current_admin_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO anon, authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='users' LOOP
    EXECUTE format('DROP POLICY %I ON public.users', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.users FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
CREATE POLICY profile_read ON public.users FOR SELECT TO authenticated USING (id=auth.uid() OR public.current_admin_role()='Super Admin');
CREATE POLICY profile_insert ON public.users FOR INSERT TO authenticated WITH CHECK (public.current_admin_role()='Super Admin');
CREATE POLICY profile_update ON public.users FOR UPDATE TO authenticated USING (public.current_admin_role()='Super Admin') WITH CHECK (public.current_admin_role()='Super Admin');
CREATE POLICY profile_delete ON public.users FOR DELETE TO authenticated USING (public.current_admin_role()='Super Admin');

ALTER TABLE public.research_areas ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='research_areas' LOOP
    EXECUTE format('DROP POLICY %I ON public.research_areas', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.research_areas FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.research_areas TO authenticated;
GRANT SELECT ON public.research_areas TO anon;
CREATE POLICY catalog_read ON public.research_areas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.research_areas FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.research_areas FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.research_areas FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='members' LOOP
    EXECUTE format('DROP POLICY %I ON public.members', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.members FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT SELECT ON public.members TO anon;
CREATE POLICY catalog_read ON public.members FOR SELECT TO anon, authenticated USING (is_active OR public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_insert ON public.members FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.members FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.members FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='projects' LOOP
    EXECUTE format('DROP POLICY %I ON public.projects', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.projects FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;
CREATE POLICY catalog_read ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.projects FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.projects FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.projects FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='project_members' LOOP
    EXECUTE format('DROP POLICY %I ON public.project_members', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.project_members FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_members TO authenticated;
GRANT SELECT ON public.project_members TO anon;
CREATE POLICY catalog_read ON public.project_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.project_members FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.project_members FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.project_members FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor'));

ALTER TABLE public.project_gallery ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='project_gallery' LOOP
    EXECUTE format('DROP POLICY %I ON public.project_gallery', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.project_gallery FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_gallery TO authenticated;
GRANT SELECT ON public.project_gallery TO anon;
CREATE POLICY catalog_read ON public.project_gallery FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.project_gallery FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.project_gallery FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.project_gallery FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor'));

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='publications' LOOP
    EXECUTE format('DROP POLICY %I ON public.publications', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.publications FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT SELECT ON public.publications TO anon;
CREATE POLICY catalog_read ON public.publications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.publications FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.publications FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.publications FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

ALTER TABLE public.publication_authors ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='publication_authors' LOOP
    EXECUTE format('DROP POLICY %I ON public.publication_authors', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.publication_authors FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publication_authors TO authenticated;
GRANT SELECT ON public.publication_authors TO anon;
CREATE POLICY catalog_read ON public.publication_authors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.publication_authors FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.publication_authors FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.publication_authors FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor'));

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='partners' LOOP
    EXECUTE format('DROP POLICY %I ON public.partners', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.partners FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT SELECT ON public.partners TO anon;
CREATE POLICY catalog_read ON public.partners FOR SELECT TO anon, authenticated USING (is_active OR public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_insert ON public.partners FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.partners FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.partners FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='contact_messages' LOOP
    EXECUTE format('DROP POLICY %I ON public.contact_messages', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT INSERT ON public.contact_messages TO anon;
CREATE POLICY messages_read ON public.contact_messages FOR SELECT TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY messages_submit ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (status='Unread');
CREATE POLICY content_update ON public.contact_messages FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.contact_messages FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='roadmap_phases' LOOP
    EXECUTE format('DROP POLICY %I ON public.roadmap_phases', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.roadmap_phases FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_phases TO authenticated;
GRANT SELECT ON public.roadmap_phases TO anon;
CREATE POLICY catalog_read ON public.roadmap_phases FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_insert ON public.roadmap_phases FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_update ON public.roadmap_phases FOR UPDATE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin','Editor')) WITH CHECK (public.current_admin_role() IN ('Super Admin','Admin','Editor'));
CREATE POLICY content_delete ON public.roadmap_phases FOR DELETE TO authenticated USING (public.current_admin_role() IN ('Super Admin','Admin'));

-- Invoker security keeps table RLS active; parent and children save atomically.
CREATE OR REPLACE FUNCTION public.save_projects(payload jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE entity_id uuid; current_row jsonb; merged jsonb;
BEGIN
  IF public.current_admin_role() IS NULL THEN RAISE EXCEPTION 'Administrator profile required'; END IF;
  entity_id := COALESCE(NULLIF(payload->>'id','')::uuid, gen_random_uuid());
  SELECT to_jsonb(t) INTO current_row FROM public.projects t WHERE id=entity_id FOR UPDATE;
  merged := COALESCE(current_row, '{}'::jsonb) || payload || jsonb_build_object('id',entity_id);
  merged := merged || jsonb_build_object('research_area_id',NULLIF(merged->>'research_area_id',''));
  merged := merged || jsonb_build_object('project_leader_id',NULLIF(merged->>'project_leader_id',''));
  INSERT INTO public.projects (id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured)
  SELECT id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured FROM jsonb_populate_record(NULL::public.projects, merged)
  ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,slug=EXCLUDED.slug,short_description=EXCLUDED.short_description,description=EXCLUDED.description,cover_image=EXCLUDED.cover_image,start_year=EXCLUDED.start_year,end_year=EXCLUDED.end_year,status=EXCLUDED.status,research_area_id=EXCLUDED.research_area_id,project_leader_id=EXCLUDED.project_leader_id,funding_source=EXCLUDED.funding_source,partners=EXCLUDED.partners,technologies=EXCLUDED.technologies,objectives=EXCLUDED.objectives,outcomes=EXCLUDED.outcomes,demo_url=EXCLUDED.demo_url,github_url=EXCLUDED.github_url,document_url=EXCLUDED.document_url,is_featured=EXCLUDED.is_featured, updated_at=NOW();

  IF payload ? 'gallery' THEN
    DELETE FROM public.project_gallery WHERE project_id=entity_id;
    INSERT INTO public.project_gallery(project_id,image_url,caption,display_order)
    SELECT entity_id, value->>'image_url', value->>'caption', ordinality::int FROM jsonb_array_elements(payload->'gallery') WITH ORDINALITY;
  END IF;
  IF payload ? 'team_members' THEN
    DELETE FROM public.project_members WHERE project_id=entity_id;
    INSERT INTO public.project_members(project_id,member_id,role)
    SELECT entity_id, (value->>'id')::uuid, value->>'role' FROM jsonb_array_elements(payload->'team_members');
  END IF;
  RETURN entity_id;
END $$;
REVOKE ALL ON FUNCTION public.save_projects(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_projects(jsonb) TO authenticated;

-- Invoker security keeps table RLS active; parent and children save atomically.
CREATE OR REPLACE FUNCTION public.save_publications(payload jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE entity_id uuid; current_row jsonb; merged jsonb;
BEGIN
  IF public.current_admin_role() IS NULL THEN RAISE EXCEPTION 'Administrator profile required'; END IF;
  entity_id := COALESCE(NULLIF(payload->>'id','')::uuid, gen_random_uuid());
  SELECT to_jsonb(t) INTO current_row FROM public.publications t WHERE id=entity_id FOR UPDATE;
  merged := COALESCE(current_row, '{}'::jsonb) || payload || jsonb_build_object('id',entity_id);
  merged := merged || jsonb_build_object('research_area_id',NULLIF(merged->>'research_area_id',''));

  INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,volume,issue,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured)
  SELECT id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,volume,issue,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured FROM jsonb_populate_record(NULL::public.publications, merged)
  ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,slug=EXCLUDED.slug,abstract=EXCLUDED.abstract,publication_type=EXCLUDED.publication_type,journal_or_conference=EXCLUDED.journal_or_conference,publisher=EXCLUDED.publisher,publication_year=EXCLUDED.publication_year,volume=EXCLUDED.volume,issue=EXCLUDED.issue,pages=EXCLUDED.pages,doi=EXCLUDED.doi,keywords=EXCLUDED.keywords,pdf_url=EXCLUDED.pdf_url,external_url=EXCLUDED.external_url,bibtex=EXCLUDED.bibtex,research_area_id=EXCLUDED.research_area_id,is_featured=EXCLUDED.is_featured, updated_at=NOW();

  IF payload ? 'authors' THEN
    DELETE FROM public.publication_authors WHERE publication_id=entity_id;
    INSERT INTO public.publication_authors(publication_id,external_author_name,author_order)
    SELECT entity_id, value, ordinality::int FROM jsonb_array_elements_text(payload->'authors') WITH ORDINALITY;
  END IF;
  RETURN entity_id;
END $$;
REVOKE ALL ON FUNCTION public.save_publications(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_publications(jsonb) TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;

-- Generated from src/data/mockData.ts. Existing rows are preserved.
BEGIN;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000001','Large Language Models (LLMs)','large-language-models','Riset fundamental arsitektur transformator, adaptasi domain, dan efisiensi parameter untuk bahasa berkarakter spesifik.','Fokus pada adaptasi model bahasa fondasi sumber terbuka (seperti LLaMA, Mistral, dan Gemma) melalui teknik Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA) guna mengakomodasi kosakata morfologis bahasa daerah serta domain sains pendidikan.','Brain',ARRAY['Bagaimana mengoptimalkan efisiensi komputasi adaptasi LLM untuk bahasa daerah berkosakata rendah?','Sejauh mana transfer learning lintas bahasa mempertahankan kemampuan penalaran logis matematika?']::text[],ARRAY['LoRA & QLoRA Fine-tuning','Continual Pretraining','Direct Preference Optimization (DPO)','Quantization (4-bit/8-bit)']::text[],ARRAY['PyTorch','Hugging Face Transformers','vLLM','DeepSpeed','TRL']::text[],1,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000002','Retrieval-Augmented Generation (RAG)','retrieval-augmented-generation','Arsitektur RAG canggih untuk meminimalisasi halusinasi data dan menyajikan rujukan ilmiah kredibel.','Pengembangan pipeline RAG modular dengan hybrid dense-sparse retrieval, reranking multi-tahap, self-corrective query decomposition, dan integrasi knowledge graph untuk institusi pendidikan dan literatur ilmiah.','Database',ARRAY['Bagaimana merancang arsitektur RAG yang adaptif terhadap dokumen akademik multi-struktur?','Metode apa yang paling efektif dalam memverifikasi sitasi yang dihasilkan oleh generator teks secara otomatis?']::text[],ARRAY['Hybrid Dense & BM25 Search','Cross-Encoder Re-ranking','Context Compression','Graph-augmented Retrieval']::text[],ARRAY['LangChain','LlamaIndex','Qdrant','Milvus','ChromaDB']::text[],2,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000003','Generative AI Agents','generative-ai-agents','Sistem agen otonom berbasis LLM dengan kemampuan perencana interaktif, penalaran reflektif, dan eksekusi alat.','Mengeksplorasi ekosistem multi-agent workflows di mana agen-agen spesialis berkolaborasi untuk memecahkan problem kurikulum, evaluasi program otomatis, dan simulasi pengajaran kolaboratif.','Bot',ARRAY['Bagaimana koordinasi multi-agen mencegah deadlocks dalam pemecahan tugas komputasional kompleks?','Bagaimana mengukur keandalan memori jangka panjang agen AI dalam konteks tutoring?']::text[],ARRAY['ReAct Prompting','Reflexion Architecture','Plan-and-Solve','Hierarchical Multi-Agent Coordination']::text[],ARRAY['CrewAI','LangGraph','AutoGPT','Python','FastAPI']::text[],3,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000004','Multimodal Generative AI','multimodal-generative-ai','Integrasi representasi visual, audio, dan teks untuk pemahaman konten holistik dan digitalisasi budaya.','Meneliti model Vision-Language (VLM) dan generative diffusion untuk preservasi manuskrip lontar, transliterasi otomatis gambar aksara tradisional Bali ke teks Latin, serta pembangkitan materi pembelajaran visual interaktif.','Sparkles',ARRAY['Bagaimana meningkatkan akurasi transliterasi OCR manuskrip lontar lapuk menggunakan multimodal attention?','Apakah representasi multimodal mampu membangkitkan rekonstruksi citra artefak sejarah secara presisi?']::text[],ARRAY['Vision-Language Alignment (CLIP/SigLIP)','Cross-Attention Fusion','Latent Diffusion','Segment Anything (SAM)']::text[],ARRAY['Stable Diffusion','BLIP-2','CLIP','OpenCV','PyTorch']::text[],4,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000005','Natural Language Processing (NLP)','natural-language-processing','Pemrosesan komputasional bahasa alami berfokus pada bahasa daerah berdaya sumber rendah (Low-Resource Languages).','Penyusunan korpus standar, tokenization khusus bahasa nusantara (termasuk Bahasa Bali dialek dataran dan pegunungan), part-of-speech tagging, dan analisis sentimen kultural.','MessageSquare',ARRAY['Bagaimana morfologi aglutinatif bahasa daerah memengaruhi efisiensi subword tokenizers?','Strategi data augmentation apa yang optimal untuk korpus bahasa berkosakata terbatas?']::text[],ARRAY['Byte-Pair Encoding kustom','Supervised Morphological Parsing','Few-shot Synthetic Augmentation']::text[],ARRAY['spaCy','Stanza','NLTK','Transformers']::text[],5,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000006','Computer Vision','computer-vision','Ekstraksi fitur visual, deteksi anomali, dan pemrosesan citra dokumen historis beresolusi tinggi.','Riset computer vision untuk rekonstruksi citra dokumen lontar, deteksi struktur tata letak naskah, dan pengenalan ekspresi/interaksi gestur mahasiswa dalam pembelajaran daring.','Eye',ARRAY['Bagaimana memisahkan noise goresan fisik pada daun lontar dari goresan aksara berkarakter halus?']::text[],ARRAY['Contrastive Learning','Image Inpainting','U-Net Binarization']::text[],ARRAY['YOLOv8','Detectron2','OpenCV','PyTorch Vision']::text[],6,false) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000007','Responsible & Ethical AI','responsible-ai','Pengembangan tata kelola etis, mitigasi bias kultural, deteksi halusinasi, dan transparansi algoritma AI.','Menyusun kerangka kerja evaluasi keamanan model fondasi dari perspektif etika lokal Indonesia, kepatuhan privasi data pendidikan, serta deteksi plagiarisme dan konten AI generated (watermarking).','ShieldCheck',ARRAY['Bagaimana mendeteksi bias representasi sosio-kultural dalam LLM yang dilatih secara global?','Metode watermarking apa yang tahan terhadap parafrase dan serangan kompresi teks?']::text[],ARRAY['Toxicity Benchmarking','Constitutional AI','Differential Privacy','Explainable AI (SHAP/LIME)']::text[],ARRAY['Garak','Promptfoo','Trulens','Captum']::text[],7,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000008','AI for Education (AI4Edu)','ai-for-education','Transformasi pedagogi modern melalui personalisasi pembelajaran, asesmen otomatis, dan scaffold tutor adaptif.','Perancangan lingkungan pembelajaran cerdas (Intelligent Tutoring Systems) yang memanfaatkan Generative AI untuk menyusun soal evaluasi berbasis Taksonomi Bloom dan memberikan umpan balik formatif real-time kepada siswa.','GraduationCap',ARRAY['Seberapa efektif umpan balik generatif instan dalam meningkatkan penguasaan konsep algoritma mahasiswa?','Bagaimana merancang interaksi AI yang mendorong metakognisi tanpa menimbulkan ketergantungan berlebih?']::text[],ARRAY['Adaptive Feedback Generation','Cognitive Load Assessment','Automated Rubric Scoring']::text[],ARRAY['LTI 1.3 Tools','Moodle AI Plugins','WebAssembly','Next.js']::text[],8,true) ON CONFLICT DO NOTHING;
INSERT INTO public.research_areas (id,title,slug,summary,description,icon,research_questions,methods,technologies,display_order,is_featured) VALUES ('b0000000-0000-0000-0000-000000000009','AI for Social Impact','ai-for-social-impact','Penerapan teknologi generatif untuk pemecahan persoalan nyata masyarakat, pariwisata berkelanjutan, dan budaya.','Kolaborasi dengan desa adat, komunitas pendidikan pedesaan di Bali, serta dinas kebudayaan guna menghadirkan akses literasi digital, asisten pariwisata cerdas berbasis kearifan lokal, dan inklusi penyandang disabilitas.','HeartHandshake',ARRAY['Bagaimana AI percakapan berbasis kearifan lokal dapat mengedukasi wisatawan mengenai etika pura dan adat Bali?']::text[],ARRAY['Participatory Design','Cultural Alignment Testing','Edge-AI Offline Deployment']::text[],ARRAY['ONNX Runtime','Whisper ASR','FastAPI']::text[],9,false) ON CONFLICT DO NOTHING;
INSERT INTO public.members (id,name,academic_title,position,category,expertise,biography,photo_url,email,google_scholar_url,orcid_url,linkedin_url,github_url,display_order,is_active) VALUES ('c0000000-0000-0000-0000-000000000001','Dr. I Gede Surya Raharja','S.Kom., M.Cs.','Head of Research Group & Associate Professor','Head of Research Group',ARRAY['Large Language Models','Low-Resource NLP','Responsible AI','Deep Learning']::text[],'Dr. I Gede Surya Raharja merupakan akademisi dan peneliti di Universitas Pendidikan Ganesha yang berfokus pada adaptasi model fondasi generatif untuk bahasa nusantara dan pemanfaatan AI dalam transformasi pendidikan tinggi. Menyelesaikan program doktoral di bidang Computer Science dengan spesialisasi Natural Language Processing.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80','surya.raharja@undiksha.ac.id','https://scholar.google.com/','https://orcid.org/0000-0002-1825-0097','https://linkedin.com/in/surya-raharja','https://github.com/surya-undiksha',1,true) ON CONFLICT DO NOTHING;
INSERT INTO public.members (id,name,academic_title,position,category,expertise,biography,photo_url,email,google_scholar_url,orcid_url,linkedin_url,github_url,display_order,is_active) VALUES ('c0000000-0000-0000-0000-000000000002','Dr. Ni Luh Putu Swastini','S.T., M.T.','Lead Researcher in Multimodal AI','Researcher',ARRAY['Multimodal Generative AI','Computer Vision','Cultural Heritage Preservation','Diffusion Models']::text[],'Spesialis Computer Vision dan Multimodal AI. Meneliti integrasi penglihatan komputer dan pemrosesan bahasa alami untuk preservasi manuskrip lontar kuno Bali serta visual storytelling menggunakan diffusion models.','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80','putu.swastini@undiksha.ac.id','https://scholar.google.com/','https://orcid.org/0000-0003-4921-2311','https://linkedin.com/in/putu-swastini','https://github.com/swastini-ai',2,true) ON CONFLICT DO NOTHING;
INSERT INTO public.members (id,name,academic_title,position,category,expertise,biography,photo_url,email,google_scholar_url,orcid_url,linkedin_url,github_url,display_order,is_active) VALUES ('c0000000-0000-0000-0000-000000000003','I Made Agus Wirawan','S.Pd., M.Kom.','Senior Researcher & Lecturer','Lecturer',ARRAY['AI for Education','Retrieval-Augmented Generation (RAG)','Intelligent Tutoring Systems']::text[],'Dosen Pendidikan Teknik Informatika Undiksha dengan fokus riset arsitektur RAG, evaluasi pemahaman siswa berbasis agentic workflows, dan etika implementasi Generative AI dalam ruang kelas digital.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80','agus.wirawan@undiksha.ac.id','https://scholar.google.com/','https://orcid.org/0000-0001-8723-9902','https://linkedin.com/in/agus-wirawan-undiksha','https://github.com/aguswirawan',3,true) ON CONFLICT DO NOTHING;
INSERT INTO public.members (id,name,academic_title,position,category,expertise,biography,photo_url,email,google_scholar_url,orcid_url,linkedin_url,github_url,display_order,is_active) VALUES ('c0000000-0000-0000-0000-000000000004','Kadek Dwi Pradnyana','S.Kom., M.Eng.','Researcher in Autonomous Agents & Alignment','Researcher',ARRAY['AI Agents','LLM Alignment (RLHF/DPO)','Prompt Engineering','High-Performance Computing']::text[],'Aktif meneliti arsitektur LLM Agentic orchestration, self-reflective prompting, dan alignment model terbuka terhadap norma etika serta budaya lokal Indonesia.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80','kadek.dwi@undiksha.ac.id','https://scholar.google.com/','https://orcid.org/0000-0002-9912-3456','https://linkedin.com/in/kadek-pradnyana','https://github.com/kadekpradnyana',4,true) ON CONFLICT DO NOTHING;
INSERT INTO public.members (id,name,academic_title,position,category,expertise,biography,photo_url,email,google_scholar_url,orcid_url,linkedin_url,github_url,display_order,is_active) VALUES ('c0000000-0000-0000-0000-000000000005','Komang Ayu Triandini','S.Kom.','Graduate Student Researcher','Student Researcher',ARRAY['Vector Databases','Hybrid Search','Balinese Lexicon Extraction']::text[],'Mahasiswa Magister Ilmu Komputer yang mengkaji teknik hybrid semantic retrieval pada corpus dokumen dwibahasa Bali-Indonesia untuk implementasi RAG presisi tinggi.','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80','komang.triandini@student.undiksha.ac.id','https://scholar.google.com/','https://orcid.org/','https://linkedin.com/','https://github.com/ayutriandini',5,true) ON CONFLICT DO NOTHING;
INSERT INTO public.members (id,name,academic_title,position,category,expertise,biography,photo_url,email,google_scholar_url,orcid_url,linkedin_url,github_url,display_order,is_active) VALUES ('c0000000-0000-0000-0000-000000000006','Wayan Hendra Pratama','S.Pd.','Research Assistant & Full-stack Engineer','Research Assistant',ARRAY['Full-stack MLOps','API Integration','Model Benchmarking','Frontend Engineering']::text[],'Asisten peneliti pengelola infrastruktur komputasi laboratorium, deployment model API, dan visualisasi antarmuka sistem prototipe AI untuk riset grup.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80','hendra.pratama@undiksha.ac.id','https://scholar.google.com/','https://orcid.org/','https://linkedin.com/in/hendrapratama','https://github.com/hendrapratama',6,true) ON CONFLICT DO NOTHING;
INSERT INTO public.projects (id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured) VALUES ('d0000000-0000-0000-0000-000000000001','AksaraGen-VLM: Vision-Language Model untuk Digitalisasi Manuskrip Lontar Kuno Bali','aksaragen-vlm-lontar-bali','Model multimodal terpadu untuk pengenalan, transliterasi otomatis, dan ekstraksi makna naskah lontar Bali abad ke-16.','Proyek unggulan yang menggabungkan penglihatan komputer tingkat lanjut dengan model bahasa generatif untuk mendokumentasikan serta menerjemahkan ribuan daun lontar kuno di Bali. Sistem mampu merekonstruksi bagian aksara yang pudar akibat usia serta menyajikan tafsir kontekstual dalam Bahasa Indonesia dan Bahasa Inggris secara akurat.','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',2024,2026,'Active','b0000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000002','Hibah Penelitian Terapan Kemendikbudristek & DIPA Undiksha',ARRAY['Pusat Dokumentasi Kebudayaan Bali','Balai Bahasa Provinsi Bali','NVIDIA Academic Program']::text[],ARRAY['PyTorch','Vision-Language Transformers','Diffusion Inpainting','FastAPI','Docker']::text[],ARRAY['Membangun dataset benchmark lontar aksara Bali beranotasi 50.000 citra lempir.','Melatih model Vision-Language khusus dengan kemampuan Character Error Rate (CER) di bawah 3.5%.','Mengembangkan platform katalog interaktif berbasis web untuk arsip budaya nasional.']::text[],ARRAY['Model open-weights AksaraGen-VLM v1.0 di Hugging Face.','1 Publikasi Jurnal Internasional Bereputasi Q1 di Elsevier Pattern Recognition.','Hak Cipta Perangkat Lunak Digitalisasi Lontar Undiksha.']::text[],'https://aksaragen.undiksha.ac.id','https://github.com/undiksha-genai/aksaragen-vlm','https://undiksha.ac.id/research/reports/aksaragen-2024.pdf',true) ON CONFLICT DO NOTHING;
INSERT INTO public.projects (id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured) VALUES ('d0000000-0000-0000-0000-000000000002','EduGen RAG Undiksha: Asisten Cerdas Kurikulum & Pembelajaran Adaptif Kampus','edugen-rag-undiksha','Sistem penalaran dokumen akademik berbasis RAG untuk membantu mahasiswa dan dosen dalam silabus serta materi studi.','EduGen RAG dirancang untuk mengindeks ribuan Rencana Pembelajaran Semester (RPS), modul praktikum, panduan akademik, dan jurnal internal Universitas Pendidikan Ganesha. Memanfaatkan arsitektur hybrid retrieval dengan reranking lintas konteks untuk memberikan jawaban instan, verifikasi sitasi akurat tanpa halusinasi.','https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',2024,2025,'Active','b0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000003','Program Pendanaan Inovasi Perguruan Tinggi (DIKTI) 2024',ARRAY['LPPMP Undiksha','PT Talenta AI Nusantara']::text[],ARRAY['LangChain','LlamaIndex','Qdrant Vector DB','Next.js','PostgreSQL']::text[],ARRAY['Mengurangi beban administratif dosen dalam pemetaan capaian pembelajaran lulusan (CPL).','Menyediakan bot konsultasi kurikulum mandiri 24/7 bagi 18.000 mahasiswa aktif Undiksha.','Mengimplementasikan zero-hallucination guardrails berbasis factual checking.']::text[],ARRAY['Telah diuji coba pada Fakultas Teknik dan Kejuruan dengan kepuasan pengguna 92.4%.','2 Prosiding IEEE International Conference on Learning Technologies.']::text[],'https://edugen.undiksha.ac.id','https://github.com/undiksha-genai/edugen-rag','https://undiksha.ac.id/research/reports/edugen-2024.pdf',true) ON CONFLICT DO NOTHING;
INSERT INTO public.projects (id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured) VALUES ('d0000000-0000-0000-0000-000000000003','Balinese-LLaMA: Fine-Tuned LLM untuk Preservasi & Terjemahan Dialek Bali','balinese-llama-dialect-model','Adaptasi model fondasi LLaMA 3 dengan korpus linguistik Bahasa Bali Alus, Madia, dan Ketah.','Inisiatif penelitian untuk menjembatani kesenjangan representasi kecerdasan buatan pada bahasa daerah nusantara. Model dilatih dengan korpus multi-tingkatan tutur bahasa Bali (Anggah-Ungguhing Basa Bali) menggunakan pendekatan continual pretraining dan DPO (Direct Preference Optimization).','https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',2023,2025,'Active','b0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','Hibah Riset Kolaboratif Nasional BRIN 2023-2025',ARRAY['BRIN Organisasi Riset Informatika','Universitas Udayana','Google Cloud Academic Research']::text[],ARRAY['PyTorch','Hugging Face','Deepspeed ZeRO-3','NVIDIA A100 Clustered']::text[],ARRAY['Menyusun korpus paralel terkurasi 120 juta token untuk ragam tingkatan tutur bahasa Bali.','Melatih tokenizer kustom dengan kompresi subword 3.2x lebih efisien dibanding standar LLaMA tokenizer.','Mengevaluasi kepekaan pragmatis dan kesopanan linguistik budaya Bali.']::text[],ARRAY['Bobot model terbuka di Hugging Face: undiksha/balinese-llama-8b-instruct.','Publikasi di ACM Transactions on Asian and Low-Resource Language Information Processing.']::text[],'https://huggingface.co/undiksha-genai/balinese-llama-8b-instruct','https://github.com/undiksha-genai/balinese-llama','https://undiksha.ac.id/research/reports/balinese-llama.pdf',true) ON CONFLICT DO NOTHING;
INSERT INTO public.projects (id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured) VALUES ('d0000000-0000-0000-0000-000000000004','AutoCode Tutor: Multi-Agent AI System untuk Praktikum Pemrograman Mahasiswa','autocode-tutor-multi-agent','Agen AI scaffolding cerdas yang membimbing mahasiswa memecahkan eror algoritma tanpa membocorkan solusi langsung.','Sistem multi-agen berbasis pedagogi Socratic Method. Terdiri dari Code Analyser Agent, Socratic Questioner Agent, dan Feedback Evaluator Agent yang memandu mahasiswa menemukan kekeliruan sintaks dan logika pemrograman secara mandiri.','https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',2023,2024,'Completed','b0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000004','DIPA BLU Undiksha 2023',ARRAY['Jurusan Teknik Informatika FTK Undiksha']::text[],ARRAY['CrewAI','LangGraph','FastAPI','React','Monaco Code Editor']::text[],ARRAY['Menurunkan tingkat frustrasi mahasiswa tahun pertama saat debugging kode C++ dan Python.','Membatasi kecenderungan copy-paste jawaban instan dari chat model komersial.']::text[],ARRAY['Peningkatan nilai ujian praktikum mahasiswa sebesar 21.8% pada kelompok uji coba.','Publikasi di IEEE Transactions on Learning Technologies.']::text[],'https://autocode.undiksha.ac.id','https://github.com/undiksha-genai/autocode-tutor','https://undiksha.ac.id/research/reports/autocode-2024.pdf',false) ON CONFLICT DO NOTHING;
INSERT INTO public.projects (id,title,slug,short_description,description,cover_image,start_year,end_year,status,research_area_id,project_leader_id,funding_source,partners,technologies,objectives,outcomes,demo_url,github_url,document_url,is_featured) VALUES ('d0000000-0000-0000-0000-000000000005','EthicSEAsia: Tolok Ukur Etika dan Mitigasi Halusinasi Model Generatif Asia Tenggara','ethic-seasia-benchmark','Framework komprehensif untuk pengujian bias nilai norma, halusinasi fakta, dan keamanan output LLM di kawasan ASEAN.','Proyek kerja sama internasional untuk mengevaluasi perilaku model bahasa komersial maupun open-source ketika dihadapkan pada pertanyaan sensitif berkaitan dengan norma hukum, sejarah, dan nilai-nilai multikultural Asia Tenggara.','https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',2025,2027,'Planned','b0000000-0000-0000-0000-000000000007','c0000000-0000-0000-0000-000000000001','Southeast Asia Collaborative Research Grant',ARRAY['National University of Singapore (Collaborator)','Universitas Gadjah Mada','UNESCO Asia-Pacific']::text[],ARRAY['Garak Red Teaming','PyTorch','Promptfoo','Streamlit Dashboard']::text[],ARRAY['Merilis dataset pengujian 10.000 prompt red-teaming konteks regional ASEAN.','Mempublikasikan indeks transparansi Generative AI tahunan untuk institusi publik.']::text[],ARRAY['Laporan Kebijakan Etika AI untuk Kemendikbudristek.','Suite evaluasi otomatis open-source di GitHub.']::text[],'','https://github.com/undiksha-genai/ethic-seasia','',false) ON CONFLICT DO NOTHING;
INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,volume,issue,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured) VALUES ('e0000000-0000-0000-0000-000000000001','AksaraGen: Cross-Modal Vision-Language Transformer for Ancient Palm-Leaf Manuscript Transliteration and Contextual Restoration','aksaragen-cross-modal-vision-language-transformer','Ancient palm-leaf manuscripts (lontar) represent irreplaceable cultural heritage in Southeast Asia, yet physical decay and non-standardized cursive scripts hinder conventional OCR tools. In this study, we propose AksaraGen, an end-to-end vision-language framework combining a lightweight convolutional visual encoder with a specialized generative decoder pre-trained on low-resource Austronesian scripts. AksaraGen achieves a 3.2% Character Error Rate (CER), significantly outperforming baseline models, while providing contextual restoration for fractured characters.','Journal Article','IEEE Access (IEEE, Q1, IF: 3.9)','IEEE',2025,'13','2','11204-11219','10.1109/ACCESS.2025.3458190',ARRAY['Vision-Language Models','Optical Character Recognition','Cultural Heritage Preservation','Balinese Lontar','Deep Learning']::text[],'https://ieeexplore.ieee.org/document/3458190','https://doi.org/10.1109/ACCESS.2025.3458190','@article{raharja2025aksaragen,
  title={AksaraGen: Cross-Modal Vision-Language Transformer for Ancient Palm-Leaf Manuscript Transliteration and Contextual Restoration},
  author={Swastini, Ni Luh Putu and Raharja, I Gede Surya and Pratama, Wayan Hendra},
  journal={IEEE Access},
  volume={13},
  pages={11204--11219},
  year={2025},
  publisher={IEEE},
  doi={10.1109/ACCESS.2025.3458190}
}','b0000000-0000-0000-0000-000000000004',true) ON CONFLICT DO NOTHING;
INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,volume,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured) VALUES ('e0000000-0000-0000-0000-000000000002','Empowering Higher Education with Retrieval-Augmented Generation: Mitigating Factual Hallucinations in Indonesian Curricular Advising','empowering-higher-education-rag-mitigating-hallucinations','The integration of Large Language Models into university advising frequently faces reliability challenges due to hallucinations regarding dynamic course prerequisites and graduation requirements. We present EduGen-RAG, an architecture coupling dense passage retrieval with semantic rerankers and strict provenance attribution over Indonesian educational standard documents. Comprehensive trials across 1,200 student queries demonstrate 96.8% factual accuracy with zero ungrounded policy citations.','Journal Article','Computers and Education: Artificial Intelligence (Elsevier, Q1)','Elsevier',2024,'7','100284','10.1016/j.caeai.2024.100284',ARRAY['Retrieval-Augmented Generation','Higher Education','Hallucination Mitigation','Academic Advising','Semantic Search']::text[],'https://sciencedirect.com/science/article/pii/S2666920X2400284X','https://doi.org/10.1016/j.caeai.2024.100284','@article{wirawan2024empowering,
  title={Empowering Higher Education with Retrieval-Augmented Generation: Mitigating Factual Hallucinations in Indonesian Curricular Advising},
  author={Wirawan, I Made Agus and Triandini, Komang Ayu and Raharja, I Gede Surya},
  journal={Computers and Education: Artificial Intelligence},
  volume={7},
  pages={100284},
  year={2024},
  publisher={Elsevier},
  doi={10.1016/j.caeai.2024.100284}
}','b0000000-0000-0000-0000-000000000002',true) ON CONFLICT DO NOTHING;
INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured) VALUES ('e0000000-0000-0000-0000-000000000003','Balinese-LLaMA: Fine-Tuning Open Foundation Models for Hierarchical Honorific Registers in Low-Resource Austronesian Dialects','balinese-llama-hierarchical-honorific-registers','Balinese features complex socio-linguistic honorific strata (Alus, Madia, and Ketah) requiring models to not only comprehend semantic semantics but also match contextual social relationships. This paper introduces Balinese-LLaMA, an aligned open model tuned on a novel parallel corpus of 120M tokens. We demonstrate how Direct Preference Optimization (DPO) calibrated with native linguistic experts reduces register mismatch by 44.7% over generic multilingually trained LLMs.','Conference Paper','Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (ACL 2024)','Association for Computational Linguistics',2024,'4510-4523','10.18653/v1/2024.acl-long.245',ARRAY['Low-Resource NLP','Honorific Registers','Direct Preference Optimization','Balinese Language','Language Modeling']::text[],'https://aclanthology.org/2024.acl-long.245.pdf','https://doi.org/10.18653/v1/2024.acl-long.245','@inproceedings{raharja2024balinese,
  title={Balinese-LLaMA: Fine-Tuning Open Foundation Models for Hierarchical Honorific Registers in Low-Resource Austronesian Dialects},
  author={Raharja, I Gede Surya and Pradnyana, Kadek Dwi and Swastini, Ni Luh Putu},
  booktitle={Proceedings of the 62nd Annual Meeting of the Association for Computational Linguistics (ACL 2024)},
  pages={4510--4523},
  year={2024},
  publisher={Association for Computational Linguistics},
  doi={10.18653/v1/2024.acl-long.245}
}','b0000000-0000-0000-0000-000000000001',true) ON CONFLICT DO NOTHING;
INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured) VALUES ('e0000000-0000-0000-0000-000000000004','Scaffolding Metacognition in Novice Programmers via Socratic Multi-Agent LLM Orchestration','scaffolding-metacognition-novice-programmers-socratic-agents','Immediate code completion tools often degrade novice problem-solving skills by encouraging unreflective reliance. We designed a multi-agent environment where AI agents act as Socratic interlocutors, diagnosing logical bugs without generating terminal solutions. An empirical study with 148 undergraduate computer science students revealed significantly elevated metacognitive self-regulation scores and sustained mastery in subsequent unassisted examinations.','Conference Paper','2024 IEEE International Conference on Advanced Learning Technologies (ICALT 2024)','IEEE Computer Society',2024,'118-122','10.1109/ICALT61200.2024.00035',ARRAY['Multi-Agent Systems','Socratic Tutoring','Computer Science Education','Metacognition','LLM Scaffolding']::text[],'https://ieeexplore.ieee.org/document/10632890','https://doi.org/10.1109/ICALT61200.2024.00035','@inproceedings{pradnyana2024scaffolding,
  title={Scaffolding Metacognition in Novice Programmers via Socratic Multi-Agent LLM Orchestration},
  author={Pradnyana, Kadek Dwi and Wirawan, I Made Agus},
  booktitle={2024 IEEE International Conference on Advanced Learning Technologies (ICALT)},
  pages={118--122},
  year={2024},
  publisher={IEEE},
  doi={10.1109/ICALT61200.2024.00035}
}','b0000000-0000-0000-0000-000000000003',false) ON CONFLICT DO NOTHING;
INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,volume,issue,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured) VALUES ('e0000000-0000-0000-0000-000000000005','Toward Culturally-Grounded AI Ethics in Southeast Asia: Benchmarking Norm Alignment and Bias in Multilingual Foundation Models','culturally-grounded-ai-ethics-southeast-asia-benchmark','Most mainstream safety benchmarks reflect Western legalistic paradigms, occasionally misconstruing communal Asian social philosophies and local sensitivities. We introduce the SEA-Ethic benchmark containing 6,000 multi-turn cultural prompts in Bahasa Indonesia, Balinese, and Javanese. Our findings indicate that globally deployed closed models exhibit blind spots in detecting indirect micro-offenses while simultaneously over-refusing benign traditional folklore queries.','Journal Article','AI and Ethics (Springer Nature)','Springer',2023,'4','1','75-92','10.1007/s43681-023-00341-9',ARRAY['AI Ethics','Cultural Alignment','Responsible AI','Southeast Asian Context','Fairness Benchmarking']::text[],'https://link.springer.com/article/10.1007/s43681-023-00341-9','https://doi.org/10.1007/s43681-023-00341-9','@article{raharja2023culturally,
  title={Toward Culturally-Grounded AI Ethics in Southeast Asia: Benchmarking Norm Alignment and Bias in Multilingual Foundation Models},
  author={Raharja, I Gede Surya and Pradnyana, Kadek Dwi},
  journal={AI and Ethics},
  volume={4},
  number={1},
  pages={75--92},
  year={2023},
  publisher={Springer},
  doi={10.1007/s43681-023-00341-9}
}','b0000000-0000-0000-0000-000000000007',true) ON CONFLICT DO NOTHING;
INSERT INTO public.publications (id,title,slug,abstract,publication_type,journal_or_conference,publisher,publication_year,volume,pages,doi,keywords,pdf_url,external_url,bibtex,research_area_id,is_featured) VALUES ('e0000000-0000-0000-0000-000000000006','AksaraNet: A Curated Benchmark Dataset of 50,000 Balinese Lontar Glyphs for Vision-Based Transcription','aksaranet-curated-benchmark-dataset-balinese-lontar','We introduce and release AksaraNet, a publicly accessible open dataset containing over 50,000 digitized and expertly transcribed character-level patches from 18th to 20th century palm-leaf manuscripts preserved across North Bali. Accompanied by standardized baseline segmentation models and evaluation protocols.','Dataset','Scientific Data (Nature Portfolio)','Nature Publishing Group',2024,'11','482','10.1038/s41597-024-03312-x',ARRAY['Open Science','Dataset','Balinese Manuscript','Digital Humanities']::text[],'https://nature.com/articles/s41597-024-03312-x','https://doi.org/10.1038/s41597-024-03312-x','@article{swastini2024aksaranet,
  title={AksaraNet: A Curated Benchmark Dataset of 50,000 Balinese Lontar Glyphs for Vision-Based Transcription},
  author={Swastini, Ni Luh Putu and Pratama, Wayan Hendra and Raharja, I Gede Surya},
  journal={Scientific Data},
  volume={11},
  pages={482},
  year={2024},
  publisher={Nature Publishing Group},
  doi={10.1038/s41597-024-03312-x}
}','b0000000-0000-0000-0000-000000000004',false) ON CONFLICT DO NOTHING;
INSERT INTO public.partners (id,name,logo_url,website_url,description,partnership_type,is_active) VALUES ('f0000000-0000-0000-0000-000000000001','Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi RI','https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=200&h=100&q=80','https://kemdikbud.go.id','Mitra pendanaan skema Penelitian Terapan dan Inovasi Pembelajaran Digital.','Government',true) ON CONFLICT DO NOTHING;
INSERT INTO public.partners (id,name,logo_url,website_url,description,partnership_type,is_active) VALUES ('f0000000-0000-0000-0000-000000000002','Badan Riset dan Inovasi Nasional (BRIN)','https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&h=100&q=80','https://brin.go.id','Kolaborasi riset kecerdasan artifisial untuk bahasa nusantara dan komputasi performa tinggi.','Government',true) ON CONFLICT DO NOTHING;
INSERT INTO public.partners (id,name,logo_url,website_url,description,partnership_type,is_active) VALUES ('f0000000-0000-0000-0000-000000000003','NVIDIA Inception Academic Program','https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=200&h=100&q=80','https://nvidia.com','Dukungan hardware GPU komputasi dan akses software toolkit cuDNN serta TensorRT.','Industry',true) ON CONFLICT DO NOTHING;
INSERT INTO public.partners (id,name,logo_url,website_url,description,partnership_type,is_active) VALUES ('f0000000-0000-0000-0000-000000000004','Balai Bahasa Provinsi Bali','https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=200&h=100&q=80','https://balaibahasabali.kemdikbud.go.id','Validasi linguistik, penyediaan korpus naskah sastra kuno, dan standarisasi transliterasi.','Academic',true) ON CONFLICT DO NOTHING;
INSERT INTO public.partners (id,name,logo_url,website_url,description,partnership_type,is_active) VALUES ('f0000000-0000-0000-0000-000000000005','Google Cloud Academic Research','https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&h=100&q=80','https://cloud.google.com/edu','Hibah kredit komputasi awan TPU dan virtual instances untuk pelatihan model bahasa skala besar.','Industry',true) ON CONFLICT DO NOTHING;
INSERT INTO public.partners (id,name,logo_url,website_url,description,partnership_type,is_active) VALUES ('f0000000-0000-0000-0000-000000000006','Pusat Dokumentasi Kebudayaan Bali','https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=200&h=100&q=80','https://disbud.baliprov.go.id','Akses konservasi manuskrip fisik lontar kuno dan kajian filologi naskah klasik Bali.','Community',true) ON CONFLICT DO NOTHING;
INSERT INTO public.contact_messages (id,name,email,institution,subject,inquiry_type,message,status,created_at) VALUES ('10000000-0000-0000-0000-000000000001','Prof. Dr. Antonius Hartono','a.hartono@ugm.ac.id','Universitas Gadjah Mada','Undangan Kolaborasi Riset Hibah Konsorsium AI Nusantara 2026','Research Collaboration','Yth. Dr. Surya Raharja dan tim Undiksha GenAI. Kami sangat tertarik dengan publikasi Balinese-LLaMA Anda di ACL. Lab kami di UGM sedang mengajukan proposal konsorsium model bahasa daerah nusantara terpadu dan ingin mengajak kelompok riset Anda sebagai Co-Principal Investigator untuk korpus wilayah Bali-Nusa Tenggara.','Read','2026-09-18T09:30:00Z') ON CONFLICT DO NOTHING;
INSERT INTO public.contact_messages (id,name,email,institution,subject,inquiry_type,message,status,created_at) VALUES ('10000000-0000-0000-0000-000000000002','Sarah Dewanti','sarah.dewanti@edutech-asia.com','PT EduTech Asia Solutions','Peluang Kemitraan Komersialisasi & Pilot Project EduGen-RAG','Industry Partnership','Halo tim Generative AI Undiksha, kami telah membaca makalah Anda mengenai EduGen-RAG. Perusahaan kami mengelola platform LMS untuk 40+ kampus swasta dan berkeinginan mendiskusikan lisensi teknologi atau pilot project bersama.','Unread','2026-09-20T14:15:00Z') ON CONFLICT DO NOTHING;
INSERT INTO public.roadmap_phases (id,phase,year_range,title,subtitle,status,points,technologies,deliverables,display_order) VALUES ('20000000-0000-0000-0000-000000000001','Fase I','2023 - 2024','Foundation & Infrastructure','Peletakan Pondasi Komputasi & Korpus Linguistik','Completed',ARRAY['Penyusunan korpus linguistik bahasa daerah Bali & instrumen data lontar','Pembangunan cluster workstation GPU dan pipeline MLOps terintegrasi','Eksplorasi teknik parameter-efficient fine-tuning (LoRA, QLoRA)']::text[],ARRAY['PyTorch','Hugging Face','NVIDIA CUDA','LoRA / QLoRA']::text[],ARRAY['Dataset Lontar Digital v1.0','Cluster Komputasi Lab FTK','Publikasi Benchmark LoRA']::text[],1) ON CONFLICT DO NOTHING;
INSERT INTO public.roadmap_phases (id,phase,year_range,title,subtitle,status,points,technologies,deliverables,display_order) VALUES ('20000000-0000-0000-0000-000000000002','Fase II','2024 - 2025','Domain Adaptation & Multimodal Alignment','Adaptasi Model Berbahasa Lokal & VLM Budaya','In Progress',ARRAY['Rilis open-weights Balinese-LLaMA dan transliterator VLM manuskrip lontar','Implementasi production RAG untuk kurikulum pendidikan tinggi Undiksha','Penyusunan benchmark evaluasi etika dan mitigasi bias model bahasa nusantara']::text[],ARRAY['LLaMA-3','Mistral','LangChain','Qdrant Vector DB','CLIP']::text[],ARRAY['Model Balinese-LLaMA 8B','Platform EduGen-RAG Kampus','Dokumen Standar Etika AI']::text[],2) ON CONFLICT DO NOTHING;
INSERT INTO public.roadmap_phases (id,phase,year_range,title,subtitle,status,points,technologies,deliverables,display_order) VALUES ('20000000-0000-0000-0000-000000000003','Fase III','2025 - 2026','Autonomous Agents & Intelligent Tutoring','Ekosistem Multi-Agen Pedagogis & Asesmen Adaptif','Planned',ARRAY['Pengembangan sistem multi-agen otonom untuk asesmen adaptif perkuliahan','Integrasi multimodal real-time speech and gesture feedback interaktif','Pilot komersialisasi dan hilirisasi produk AI ke industri edutech nasional']::text[],ARRAY['CrewAI','LangGraph','vLLM','FastAPI','Whisper']::text[],ARRAY['Sistem Asesmen Multi-Agen','Modul Voice-AI Asisten Tutor','3 Paten Terdaftar']::text[],3) ON CONFLICT DO NOTHING;
INSERT INTO public.roadmap_phases (id,phase,year_range,title,subtitle,status,points,technologies,deliverables,display_order) VALUES ('20000000-0000-0000-0000-000000000004','Fase IV','2026 - 2028','Global Impact & Cultural AI Preservation','Pusat Unggulan AI & Rujukan Digitalisasi Asia Tenggara','Planned',ARRAY['Pusat rujukan digitalisasi warisan naskah kuno nusantara se-Asia Tenggara','Federated learning lintas perguruan tinggi untuk privasi data pendidikan','Kolaborasi penelitian model fondasi generasi berikutnya bersama lab dunia']::text[],ARRAY['Federated Learning','Large Multimodal Models','Decentralized AI']::text[],ARRAY['PUI Generative AI Nasional','Aliansi Riset Internasional','Konsorsium ASEAN Lontar-AI']::text[],4) ON CONFLICT DO NOTHING;
INSERT INTO public.project_gallery (id,image_url,caption,project_id,display_order) VALUES ('30000000-0000-0000-0000-000000000001','https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80','Proses pemindaian spektral lempir lontar kuno di laboratorium AI Undiksha.','d0000000-0000-0000-0000-000000000001',1) ON CONFLICT DO NOTHING;
INSERT INTO public.project_gallery (id,image_url,caption,project_id,display_order) VALUES ('30000000-0000-0000-0000-000000000002','https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80','Visualisasi attention map model VLM terhadap glif aksara Bali.','d0000000-0000-0000-0000-000000000001',2) ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000002','Project Leader') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000002','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','NLP & Language Specialist') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000003','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000006','MLOps & Deployment Engineer') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000004','d0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000003','Project Leader') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000005','d0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000005','Data & Retrieval Specialist') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000006','d0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000001','Principal Investigator') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000007','d0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000004','Alignment & Optimization') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000008','d0000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000004','Project Leader') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000009','d0000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000003','Pedagogy Evaluation') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000010','d0000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000001','Lead Coordinator') ON CONFLICT DO NOTHING;
INSERT INTO public.project_members (id,project_id,member_id,role) VALUES ('40000000-0000-0000-0000-000000000011','d0000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000004','Red Teaming Engineer') ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000001','e0000000-0000-0000-0000-000000000001','Ni Luh Putu Swastini',1) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000002','e0000000-0000-0000-0000-000000000001','I Gede Surya Raharja',2) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000003','e0000000-0000-0000-0000-000000000001','Wayan Hendra Pratama',3) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000004','e0000000-0000-0000-0000-000000000002','I Made Agus Wirawan',1) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000005','e0000000-0000-0000-0000-000000000002','Komang Ayu Triandini',2) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000006','e0000000-0000-0000-0000-000000000002','I Gede Surya Raharja',3) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000007','e0000000-0000-0000-0000-000000000003','I Gede Surya Raharja',1) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000008','e0000000-0000-0000-0000-000000000003','Kadek Dwi Pradnyana',2) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000009','e0000000-0000-0000-0000-000000000003','Ni Luh Putu Swastini',3) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000010','e0000000-0000-0000-0000-000000000004','Kadek Dwi Pradnyana',1) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000011','e0000000-0000-0000-0000-000000000004','I Made Agus Wirawan',2) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000012','e0000000-0000-0000-0000-000000000005','I Gede Surya Raharja',1) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000013','e0000000-0000-0000-0000-000000000005','Kadek Dwi Pradnyana',2) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000014','e0000000-0000-0000-0000-000000000006','Ni Luh Putu Swastini',1) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000015','e0000000-0000-0000-0000-000000000006','Wayan Hendra Pratama',2) ON CONFLICT DO NOTHING;
INSERT INTO public.publication_authors (id,publication_id,external_author_name,author_order) VALUES ('50000000-0000-0000-0000-000000000016','e0000000-0000-0000-0000-000000000006','I Gede Surya Raharja',3) ON CONFLICT DO NOTHING;
COMMIT;
