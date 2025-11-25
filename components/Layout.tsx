import React, { useState, useEffect } from 'react';
import { User, UserRole, Notification } from '../types';
import { DataService } from '../services/mockBackend';
import { t } from '../utils/i18n';
import Logo from './Logo';
import { 
  Menu, X, LayoutDashboard, BookOpen, FileUp, 
  CheckCircle, Users, Settings, LogOut, BrainCircuit, PenTool,
  HelpCircle, GraduationCap, Layers, Briefcase, Calculator, Calendar, Megaphone, Pill, Bell, Trophy, Server
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, currentView, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      const data = await DataService.getNotifications(user.uid);
      setNotifications(data);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [user.uid]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    await DataService.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const getNavItems = () => {
    switch (user.role) {
      case UserRole.STUDENT:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'learning', label: 'Learning Materials', icon: BookOpen },
          { id: 'quizzes', label: 'Quizzes', icon: PenTool },
          { id: 'practice', label: 'Practice Mode', icon: GraduationCap },
          { id: 'doubts', label: 'Doubt Forum', icon: HelpCircle },
          { id: 'ai-tutor', label: 'AI Tutor', icon: BrainCircuit },
          { id: 'drug-index', label: 'Drug Index', icon: Pill },
          { id: 'vacancies', label: 'Career Hub', icon: Briefcase },
          { id: 'tools', label: 'Clinical Tools', icon: Calculator },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
        ];
      case UserRole.INSTRUCTOR:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'uploads', label: 'Upload Content', icon: FileUp },
          { id: 'quizzes', label: 'Quiz Manager', icon: CheckCircle },
          { id: 'practice', label: 'Practice Builder', icon: Layers },
          { id: 'doubts', label: 'Student Doubts', icon: HelpCircle },
          { id: 'drug-index', label: 'Drug Index', icon: Pill },
          { id: 'vacancies', label: 'Career Hub', icon: Briefcase },
          { id: 'tools', label: 'Clinical Tools', icon: Calculator },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
        ];
      case UserRole.ADMIN:
        return [
          { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
          { id: 'approvals', label: 'Approvals', icon: CheckCircle },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'exam-results', label: 'Exam Results', icon: Trophy },
          { id: 'vacancies', label: 'Career Hub', icon: Briefcase },
          { id: 'drug-index', label: 'Drug Index', icon: Pill },
          { id: 'ads', label: 'Ad Manager', icon: Megaphone },
          { id: 'system', label: 'System Health', icon: Server },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 dark:bg-slate-950 text-white transform transition-transform duration-200 ease-in-out shadow-xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-lg tracking-tight">
            <Logo className="w-8 h-8" />
            <span>PharmaSol</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="px-4 py-2 h-[calc(100vh-80px)] flex flex-col">
          <div className="flex items-center gap-3 p-3 bg-slate-800 dark:bg-slate-900 rounded-xl mb-6 border border-slate-700/50">
            <img src={user.avatarUrl || "https://i.pravatar.cc/150"} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${currentView === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white'
                  }`}
              >
                <item.icon size={18} />
                {t(item.label, user)}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-slate-800 mt-auto">
            <button 
              onClick={() => onNavigate('settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 dark:hover:bg-slate-900 hover:text-white transition-colors mb-2"
            >
              <Settings size={18} />
              {t('Settings', user)}
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
            >
              <LogOut size={18} />
              {t('Sign Out', user)}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-8 z-20 relative transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-500 dark:text-slate-400">
              <Menu size={24} />
            </button>
            <h1 className="hidden md:block text-lg font-semibold text-slate-700 dark:text-slate-200">
              {t(navItems.find(n => n.id === currentView)?.label || 'Dashboard', user)}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Notifications */}
             <div className="relative">
               <button 
                 onClick={() => setShowNotifs(!showNotifs)}
                 className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
               >
                 <Bell size={20} />
                 {unreadCount > 0 && (
                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                 )}
               </button>

               {showNotifs && (
                 <>
                   <div className="fixed inset-0 z-10" onClick={() => setShowNotifs(false)} />
                   <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
                        <span className="font-semibold text-sm text-slate-800 dark:text-white">Notifications</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} New</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No notifications yet.</div>
                        ) : (
                          notifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => markAsRead(n.id)}
                              className={`p-4 border-b border-slate-50 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                               <div className="flex justify-between items-start mb-1">
                                 <h4 className={`text-sm font-medium ${!n.isRead ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{n.title}</h4>
                                 <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                               </div>
                               <p className="text-xs text-slate-500 dark:text-slate-400">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                   </div>
                 </>
               )}
             </div>

             <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                {user.role === 'student' && user.program ? user.program : user.role.toUpperCase()}
             </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;