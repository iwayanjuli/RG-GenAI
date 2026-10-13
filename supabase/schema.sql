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
