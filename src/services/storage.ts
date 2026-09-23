import { 
  Member, 
  ResearchArea, 
  Project, 
  Publication, 
  Partner, 
  ContactMessage 
} from '../types';
import { 
  initialMembers, 
  initialResearchAreas, 
  initialProjects, 
  initialPublications, 
  initialPartners, 
  initialMessages,
  initialRoadmap
} from '../data/mockData';

const STORAGE_KEYS = {
  MEMBERS: 'rg_genai_members',
  RESEARCH: 'rg_genai_research',
  PROJECTS: 'rg_genai_projects',
  PUBLICATIONS: 'rg_genai_publications',
  PARTNERS: 'rg_genai_partners',
  MESSAGES: 'rg_genai_messages',
  ROADMAP: 'rg_genai_roadmap',
};

// Initialize default storage with initial realistic data if not present
export function initLocalStorage(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(initialMembers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESEARCH)) {
    localStorage.setItem(STORAGE_KEYS.RESEARCH, JSON.stringify(initialResearchAreas));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PUBLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(initialPublications));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PARTNERS)) {
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(initialPartners));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ROADMAP)) {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(initialRoadmap));
  }
}

export function getStoredData<T>(key: string, defaultData: T): T {
  if (typeof window === 'undefined') return defaultData;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch {
    return defaultData;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event('rg_storage_updated'));
}

export { STORAGE_KEYS };
