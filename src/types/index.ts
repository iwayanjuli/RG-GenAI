export type UserRole = 'Super Admin' | 'Admin' | 'Editor';

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export type MemberCategory = 
  | 'Head of Research Group'
  | 'Researcher'
  | 'Lecturer'
  | 'Student Researcher'
  | 'Research Assistant';

export interface Member {
  id: string;
  name: string;
  academic_title: string;
  position: string;
  category: MemberCategory;
  expertise: string[];
  biography: string;
  photo_url: string;
  email: string;
  google_scholar_url?: string;
  orcid_url?: string;
  linkedin_url?: string;
  github_url?: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ResearchArea {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  icon: string;
  research_questions: string[];
  methods: string[];
  technologies: string[];
  display_order: number;
  is_featured: boolean;
  created_at?: string;
}

export type ProjectStatus = 'Planned' | 'Active' | 'Completed';

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  cover_image: string;
  start_year: number;
  end_year?: number;
  status: ProjectStatus;
  research_area_id?: string;
  research_area_title?: string;
  project_leader_id?: string;
  project_leader_name?: string;
  funding_source: string;
  partners: string[];
  technologies: string[];
  objectives: string[];
  outcomes: string[];
  demo_url?: string;
  github_url?: string;
  document_url?: string;
  is_featured: boolean;
  gallery?: {
    id: string;
    image_url: string;
    caption: string;
  }[];
  team_members?: {
    id: string;
    name: string;
    role: string;
    photo_url?: string;
  }[];
  created_at?: string;
}

export type PublicationType =
  | 'Journal Article'
  | 'Conference Paper'
  | 'Book Chapter'
  | 'Research Report'
  | 'Dataset'
  | 'Thesis'
  | 'Intellectual Property';

export interface Publication {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  publication_type: PublicationType;
  journal_or_conference: string;
  publisher?: string;
  publication_year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  keywords: string[];
  pdf_url?: string;
  external_url?: string;
  bibtex?: string;
  research_area_id?: string;
  research_area_title?: string;
  authors: string[];
  is_featured: boolean;
  created_at?: string;
}

export type PartnershipType = 'Academic' | 'Industry' | 'Government' | 'Community';

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  description: string;
  partnership_type: PartnershipType;
  is_active: boolean;
  created_at?: string;
}

export type InquiryType =
  | 'Research Collaboration'
  | 'Industry Partnership'
  | 'Student Internship'
  | 'Research Membership'
  | 'Media Inquiry'
  | 'General Question';

export type MessageStatus = 'Unread' | 'Read' | 'Replied';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  institution: string;
  subject: string;
  inquiry_type: InquiryType;
  message: string;
  status: MessageStatus;
  created_at: string;
}

export interface StatsSummary {
  researchersCount: number;
  activeProjectsCount: number;
  publicationsCount: number;
  partnersCount: number;
}
