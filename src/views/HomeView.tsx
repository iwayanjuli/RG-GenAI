import React, { useEffect } from 'react';
import { HeroSection } from '../components/modules/home/HeroSection';
import { ResearchHighlights } from '../components/modules/home/ResearchHighlights';
import { StatsSection } from '../components/modules/home/StatsSection';
import { FeaturedProjects } from '../components/modules/home/FeaturedProjects';
import { LatestPublications } from '../components/modules/home/LatestPublications';
import { CollaborationCTA } from '../components/modules/home/CollaborationCTA';

export const HomeView: React.FC = () => {
  useEffect(() => {
    document.title = 'Generative AI Research Group | Universitas Pendidikan Ganesha';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <ResearchHighlights />
      <StatsSection />
      <FeaturedProjects />
      <LatestPublications />
      <CollaborationCTA />
    </div>
  );
};
