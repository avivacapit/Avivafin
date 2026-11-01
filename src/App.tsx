import React, { useState, useEffect } from 'react';
import {
  ClientApplication,
  AppView,
  DashboardTab,
} from './types';
import {
  loadApplications,
  saveApplications,
  DEFAULT_APPLICATIONS,
} from './mockData';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RegistrationFlow } from './components/RegistrationFlow';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminPanel } from './components/AdminPanel';
import { ClientLoginModal } from './components/ClientLoginModal';
import { DocumentsModal } from './components/DocumentsModal';

export default function App() {
  const [applications, setApplications] = useState<ClientApplication[]>(() =>
    loadApplications()
  );
  const [currentView, setCurrentView] = useState<AppView>('register');
  const [activeClient, setActiveClient] = useState<ClientApplication | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('profile');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [docsModalApp, setDocsModalApp] = useState<ClientApplication | null>(null);

  // Sync hash routing (#admin, #client, #register)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#client') {
        if (activeClient) {
          setCurrentView('client-dashboard');
        } else {
          setCurrentView('register');
        }
      } else if (hash === '#register' || !hash || hash === '#') {
        setCurrentView((prev) => (prev === 'admin' ? (activeClient ? 'client-dashboard' : 'register') : prev));
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeClient]);

  // Save applications to localStorage whenever changed
  const updateApplicationsStore = (newApps: ClientApplication[]) => {
    setApplications(newApps);
    saveApplications(newApps);

    // If active client is currently logged in, sync their latest state
    if (activeClient) {
      const updatedCurrent = newApps.find((a) => a.id === activeClient.id);
      if (updatedCurrent) {
        setActiveClient(updatedCurrent);
      }
    }
  };

  const handleNewRegistration = (newApp: ClientApplication) => {
    const updated = [newApp, ...applications];
    updateApplicationsStore(updated);
    setActiveClient(newApp);
  };

  const handleUpdateApplication = (index: number, updated: ClientApplication) => {
    const next = [...applications];
    // Find index by id in case search altered order
    const realIdx = next.findIndex((a) => a.id === updated.id);
    if (realIdx !== -1) {
      next[realIdx] = updated;
    } else {
      next[index] = updated;
    }
    updateApplicationsStore(next);
  };

  const handleUpdateActiveClient = (updated: ClientApplication) => {
    setActiveClient(updated);
    const next = applications.map((a) => (a.id === updated.id ? updated : a));
    updateApplicationsStore(next);
  };

  const handleLoginSuccess = (client: ClientApplication) => {
    setActiveClient(client);
    setCurrentView('client-dashboard');
    setActiveTab('emi');
    window.location.hash = '#client';
  };

  const handleLogout = () => {
    setActiveClient(null);
    setCurrentView('register');
    setActiveTab('emi');
    window.location.hash = '';
  };

  const handleGoHome = () => {
    setCurrentView('register');
    window.location.hash = '';
  };

  const handleViewPortalFromAdmin = (client: ClientApplication) => {
    setActiveClient(client);
    setCurrentView('client-dashboard');
    setActiveTab('emi');
    window.location.hash = '#client';
  };

  const handleResetData = () => {
    if (window.confirm('Reset all applications data to default sample applicant?')) {
      updateApplicationsStore(DEFAULT_APPLICATIONS);
      if (activeClient) {
        setActiveClient(DEFAULT_APPLICATIONS[0]);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7ff] text-[#0f172a] font-['Hanken_Grotesk',sans-serif]">
      {/* Top Banner */}
      <TopBar />

      {/* Main Header */}
      <Header
        currentView={currentView}
        activeClient={activeClient}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'register' && (
          <RegistrationFlow
            onComplete={handleNewRegistration}
            onOpenDashboard={(app) => {
              setActiveClient(app);
              setCurrentView('client-dashboard');
              setActiveTab('emi');
              window.location.hash = '#client';
            }}
          />
        )}

        {currentView === 'client-dashboard' && activeClient && (
          <ClientDashboard
            client={activeClient}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onUpdateClient={handleUpdateActiveClient}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
            onViewDocuments={(app) => setDocsModalApp(app)}
            onViewPortal={handleViewPortalFromAdmin}
            onResetData={handleResetData}
            onExitAdmin={() => {
              window.location.hash = activeClient ? '#client' : '';
              setCurrentView(activeClient ? 'client-dashboard' : 'register');
            }}
          />
        )}
      </main>

      {/* Client Login Modal */}
      <ClientLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        applications={applications}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Documents View Modal */}
      <DocumentsModal
        isOpen={docsModalApp !== null}
        onClose={() => setDocsModalApp(null)}
        application={docsModalApp}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
