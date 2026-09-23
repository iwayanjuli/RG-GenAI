import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, ArrowRight, Shield } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'glass-panel shadow-sm border-b border-blue-100 dark:border-navy-800/80 py-3'
            : 'bg-white/70 dark:bg-transparent backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-electric-600 via-blue-600 to-cyan-500 shadow-md shadow-blue-500/20 p-0.5 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white dark:bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-electric-400 transition-colors">
                Generative AI <span className="text-blue-600 dark:text-electric-400 font-bold">RG</span>
              </span>
              <span className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 -mt-1">
                Universitas Pendidikan Ganesha
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/80 dark:bg-navy-900/60 p-1.5 rounded-full border border-blue-100 dark:border-navy-800/60 shadow-sm backdrop-blur-md">
            {siteConfig.navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-electric-600 rounded-full shadow-md shadow-blue-500/30 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-blue-50 dark:bg-violet-950/60 border border-blue-200 dark:border-violet-500/30 text-blue-700 dark:text-violet-300 hover:bg-blue-100 dark:hover:bg-violet-900/50 transition-colors"
                title="Dashboard Admin"
              >
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-violet-400" />
                <span>Admin</span>
              </Link>
            ) : null}

            <Link
              to="/contact"
              className="relative group inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 via-electric-600 to-blue-700 bg-[length:200%_auto] hover:bg-[position:right_center] transition-all duration-500 shadow-md shadow-blue-500/20 hover:shadow-blue-500/35"
            >
              <span>Join Collaboration</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
              className="p-2 rounded-xl bg-white dark:bg-navy-900/80 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed top-[68px] left-0 right-0 z-30 bg-white/95 dark:bg-navy-950/95 border-b border-blue-100 dark:border-navy-800 backdrop-blur-xl px-6 py-6 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {siteConfig.navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2.5 rounded-xl text-base font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-electric-600/20 text-blue-600 dark:text-electric-400 border border-blue-200 dark:border-electric-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-electric-400 shadow-sm" />}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-100 dark:border-navy-800 flex flex-col gap-2">
                <Link
                  to="/contact"
                  className="w-full py-3 text-center text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-electric-600 shadow-md shadow-blue-500/20"
                >
                  Join Collaboration
                </Link>

                <Link
                  to="/admin"
                  className="w-full py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Portal Administrator CMS</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
