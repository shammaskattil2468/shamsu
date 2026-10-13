import React, { useState, useEffect } from 'react';
import { initialPortfolioData } from './data/portfolioData';
import { apiService } from './services/api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DataJourney from './components/DataJourney';
import About from './components/About';
import Skills from './components/Skills';
import CurrentlyLearning from './components/CurrentlyLearning';
import Projects from './components/Projects';
import AnalyticsShowcase from './components/AnalyticsShowcase';
import Education from './components/Education';
import Certifications from './components/Certifications';
import CareerObjective from './components/CareerObjective';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EditModal from './components/EditModal';

const STORAGE_KEY = 'mubashira_portfolio_data_v1';
const THEME_KEY = 'mubashira_portfolio_theme';

export default function App() {
  // Theme state: Default is "light" for neat white theme as requested by user
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  // Database Connection Status
  const [dbStatus, setDbStatus] = useState({ 
    status: 'checking', 
    uri: 'mongodb://localhost:27017/mubashira_portfolio' 
  });

  // Portfolio Data state with localStorage persistence and MongoDB hydration
  const [portfolioData, setPortfolioData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading portfolio data from localStorage', e);
    }
    return initialPortfolioData;
  });

  // Initial load: check MongoDB status & load remote portfolio data if available
  useEffect(() => {
    let isMounted = true;
    const syncDb = async () => {
      try {
        const status = await apiService.getStatus();
        if (isMounted) setDbStatus(status);

        if (status.status === 'connected') {
          const remoteData = await apiService.getPortfolio();
          if (remoteData && isMounted) {
            setPortfolioData(remoteData);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
            } catch (err) {
              console.error(err);
            }
          }
        }
      } catch (err) {
        console.warn('Initial sync warning:', err);
      }
    };
    syncDb();
    return () => { isMounted = false; };
  }, []);

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return sessionStorage.getItem('mubashira_admin_session') === 'true';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Save changes handler (both localStorage and MongoDB)
  const handleSaveData = async (newData) => {
    setPortfolioData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Error saving portfolio data to localStorage', e);
    }
    // Persist to MongoDB
    await apiService.savePortfolio(newData);
  };

  // Reset to original defaults
  const handleResetDefaults = async () => {
    setPortfolioData(initialPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
    await apiService.resetPortfolio();
  };

  // Update profile photo directly
  const handleUpdateProfileImage = (newImageUrl) => {
    const updated = {
      ...portfolioData,
      profile: {
        ...portfolioData.profile,
        profileImage: newImageUrl
      }
    };
    handleSaveData(updated);
  };

  // Remove profile photo (fallback to MP monogram)
  const handleRemoveProfileImage = () => {
    const updated = {
      ...portfolioData,
      profile: {
        ...portfolioData.profile,
        profileImage: null
      }
    };
    handleSaveData(updated);
  };

  const handleUnlockAdmin = () => {
    setIsAdminUnlocked(true);
    sessionStorage.setItem('mubashira_admin_session', 'true');
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('mubashira_admin_session');
  };

  return (
    <div className="portfolio-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <Navbar
        profile={portfolioData.profile}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminUnlocked={isAdminUnlocked}
        dbStatus={dbStatus}
      />

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <Hero
          profile={portfolioData.profile}
          onUpdateProfileImage={handleUpdateProfileImage}
          onRemoveProfileImage={handleRemoveProfileImage}
        />

        {/* Feature: My Data Journey */}
        <DataJourney journeyData={portfolioData.dataJourney} />

        {/* About Me Section */}
        <About aboutData={portfolioData.about} />

        {/* Skills & Technologies Section */}
        <Skills skillsData={portfolioData.skills} />

        {/* Currently Learning Section */}
        <CurrentlyLearning learningData={portfolioData.currentlyLearning} />

        {/* Projects & Practical Experience */}
        <Projects projectsData={portfolioData.projects} />

        {/* Data Analytics Showcase Dashboard */}
        <AnalyticsShowcase showcaseData={portfolioData.sampleDataShowcase} />

        {/* Education Section */}
        <Education educationData={portfolioData.education} />

        {/* Certifications Section */}
        <Certifications certificationsData={portfolioData.certifications} />

        {/* Career Objective Section */}
        <CareerObjective careerGoal={portfolioData.profile.careerGoal} />

        {/* Contact Section & Form */}
        <Contact
          contactData={portfolioData.contact}
          profileName={portfolioData.profile.name}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={portfolioData.profile}
        contact={portfolioData.contact}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Content Manager Modal */}
      <EditModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        portfolioData={portfolioData}
        onSave={handleSaveData}
        onResetDefaults={handleResetDefaults}
        isAdminUnlocked={isAdminUnlocked}
        onUnlockAdmin={handleUnlockAdmin}
        onLockAdmin={handleLockAdmin}
        dbStatus={dbStatus}
      />
    </div>
  );
}
