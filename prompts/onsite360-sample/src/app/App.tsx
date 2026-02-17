import { useState } from 'react';
import { Navigation, IntroScreen } from './components/onsite/Navigation';
import { LoginFlow } from './components/onsite/LoginFlow';
import { AIOnboarding } from './components/onsite/AIOnboarding';
import { SearchFilterDemo } from './components/onsite/SearchFilterDemo';
import { WorkerDashboard } from './components/onsite/WorkerDashboard';
import { WorkerProfile } from './components/onsite/WorkerProfile';
import { EmployerDashboard } from './components/onsite/EmployerDashboard';
import { JobPostingFlow } from './components/onsite/JobPostingFlow';
import { JobDetailsView } from './components/onsite/JobDetailsView';
import { HelpSupport } from './components/onsite/HelpSupport';
import { AdminDashboard } from './components/onsite/AdminDashboard';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState('login');

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="transition-all duration-300">
        {currentView === 'login' && <LoginFlow />}
        {currentView === 'ai-onboarding' && <AIOnboarding />}
        {currentView === 'search-filter' && <SearchFilterDemo />}
        {currentView === 'worker-dashboard' && <WorkerDashboard />}
        {currentView === 'worker-profile' && <WorkerProfile />}
        {currentView === 'employer-dashboard' && <EmployerDashboard />}
        {currentView === 'job-posting' && <JobPostingFlow />}
        {currentView === 'job-details' && <JobDetailsView />}
        {currentView === 'help-support' && <HelpSupport />}
        {currentView === 'admin' && <AdminDashboard />}
      </div>
    </div>
  );
}