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

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE publication_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access policies for public catalog
CREATE POLICY "Allow public read access on research_areas" ON research_areas FOR SELECT USING (true);
CREATE POLICY "Allow public read access on members" ON members FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on project_members" ON project_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access on project_gallery" ON project_gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access on publications" ON publications FOR SELECT USING (true);
CREATE POLICY "Allow public read access on publication_authors" ON publication_authors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on partners" ON partners FOR SELECT USING (is_active = true);

-- Public insert policy on contact_messages
CREATE POLICY "Allow public to submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated full access for admin users
CREATE POLICY "Allow authenticated read/write on users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on research_areas" ON research_areas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on members" ON members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on project_members" ON project_members FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on project_gallery" ON project_gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on publications" ON publications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on publication_authors" ON publication_authors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on partners" ON partners FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full on contact_messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
