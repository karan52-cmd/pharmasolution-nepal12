import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import Layout from './components/Layout';
import Auth from './views/Auth';
import StudentDashboard from './views/StudentDashboard';
import InstructorDashboard from './views/InstructorDashboard';
import AdminDashboard from './views/AdminDashboard';
import SettingsView from './views/SettingsView';
import { Loader2 } from 'lucide-react';
import Logo from './components/Logo';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Initial Splash Screen Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s splash screen
    return () => clearTimeout(timer);
  }, []);

  // Theme Effect
  useEffect(() => {
    if (user?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.theme]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    document.documentElement.classList.remove('dark');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="mb-6 shadow-lg shadow-blue-500/50 animate-bounce bg-white rounded-full p-2">
          <Logo className="w-24 h-24" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pharma Solution Nepal</h1>
        <div className="flex items-center gap-2 text-blue-400">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Initializing App...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (currentView === 'settings') {
      return <SettingsView user={user} onUpdateUser={setUser} />;
    }

    switch (user.role) {
      case UserRole.STUDENT:
        return <StudentDashboard user={user} currentSubView={currentView} />;
      case UserRole.INSTRUCTOR:
        return <InstructorDashboard user={user} currentSubView={currentView} />;
      case UserRole.ADMIN:
        return <AdminDashboard user={user} currentSubView={currentView} />;
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;