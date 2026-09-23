import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { initLocalStorage } from './services/storage';

// Public Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackToTop } from './components/common/BackToTop';

// Public Views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ResearchView } from './views/ResearchView';
import { ProjectsView } from './views/ProjectsView';
import { ProjectDetailView } from './views/ProjectDetailView';
import { PublicationsView } from './views/PublicationsView';
import { PublicationDetailView } from './views/PublicationDetailView';
import { ContactView } from './views/ContactView';
import { NotFoundView } from './views/NotFoundView';

// Admin Views & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginView } from './views/admin/AdminLoginView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminMembersView } from './views/admin/AdminMembersView';
import { AdminResearchView } from './views/admin/AdminResearchView';
import { AdminProjectsView } from './views/admin/AdminProjectsView';
import { AdminPublicationsView } from './views/admin/AdminPublicationsView';
import { AdminPartnersView } from './views/admin/AdminPartnersView';
import { AdminMessagesView } from './views/admin/AdminMessagesView';

import { GraphicOrnaments } from './components/visual/GraphicOrnaments';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-950 text-slate-800 dark:text-slate-100 selection:bg-electric-600 selection:text-white relative overflow-x-hidden">
      <GraphicOrnaments />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    initLocalStorage();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomeView />} />
                <Route path="/about" element={<AboutView />} />
                <Route path="/research" element={<ResearchView />} />
                <Route path="/projects" element={<ProjectsView />} />
                <Route path="/projects/:slug" element={<ProjectDetailView />} />
                <Route path="/publications" element={<PublicationsView />} />
                <Route path="/publications/:slug" element={<PublicationDetailView />} />
                <Route path="/contact" element={<ContactView />} />
                <Route path="*" element={<NotFoundView />} />
              </Route>

              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLoginView />} />

              {/* Protected Admin CMS Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardView />} />
                <Route path="members" element={<AdminMembersView />} />
                <Route path="research" element={<AdminResearchView />} />
                <Route path="projects" element={<AdminProjectsView />} />
                <Route path="publications" element={<AdminPublicationsView />} />
                <Route path="partners" element={<AdminPartnersView />} />
                <Route path="messages" element={<AdminMessagesView />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
