import { memberService } from './memberService';
import { projectService } from './projectService';
import { publicationService } from './publicationService';
import { partnerService } from './partnerService';
import { StatsSummary } from '../types';

export const statsService = {
  async getSummary(): Promise<StatsSummary> {
    const [members, projects, publications, partners] = await Promise.all([
      memberService.getAll(),
      projectService.getAll(),
      publicationService.getAll(),
      partnerService.getAll(),
    ]);

    return {
      researchersCount: members.filter(m => m.is_active).length,
      activeProjectsCount: projects.filter(p => p.status === 'Active').length,
      publicationsCount: publications.length,
      partnersCount: partners.length,
    };
  },

  async getPublicationStats(): Promise<{
    byYear: { year: number; count: number }[];
    byType: { type: string; count: number }[];
  }> {
    const publications = await publicationService.getAll();

    // Group by year
    const yearMap: Record<number, number> = {};
    publications.forEach(p => {
      yearMap[p.publication_year] = (yearMap[p.publication_year] || 0) + 1;
    });

    const byYear = Object.keys(yearMap)
      .map(k => ({ year: Number(k), count: yearMap[Number(k)] }))
      .sort((a, b) => a.year - b.year);

    // Group by type
    const typeMap: Record<string, number> = {};
    publications.forEach(p => {
      typeMap[p.publication_type] = (typeMap[p.publication_type] || 0) + 1;
    });

    const byType = Object.keys(typeMap).map(k => ({
      type: k,
      count: typeMap[k]
    }));

    return { byYear, byType };
  }
};
