import React, { useEffect, useState } from 'react';
import { DataService } from '../services/mockBackend';
import { Material, DownloadRequest, User, UserRole, QuizResult, Vacancy, Advertisement } from '../types';
import VacancyView from './VacancyView';
import DrugIndexView from './DrugIndexView';
import { Check, X, Shield, FileText, Download, Trash2, Edit, GraduationCap, Trophy, List, Users, Briefcase, Megaphone, Plus, ImageIcon, Calendar, CheckCircle, Globe, Server, AlertTriangle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  currentSubView: string;
  user?: User;
}

const AdminDashboard: React.FC<Props> = ({ currentSubView, user }) => {
  if (currentSubView === 'approvals') return <ApprovalsView />;
  if (currentSubView === 'users') return <UserManagementView currentUser={user} />;
  if (currentSubView === 'exam-results') return <ExamResultsView />;
  if (currentSubView === 'vacancies') return <VacancyView user={user || {uid: 'admin1', name: 'System Admin', email: 'admin@pharma.com', role: UserRole.ADMIN, language: 'en'} as User} />;
  if (currentSubView === 'drug-index') return <DrugIndexView user={user} />;
  if (currentSubView === 'ads') return <AdManagementView />;
  if (currentSubView === 'system') return <SystemSettingsView />;

  return <OverviewView />;
};

// --- SUB-VIEWS ---

const OverviewView: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, materials: 0, pending: 0, quizzes: 0 });
  const [pendingInstructors, setPendingInstructors] = useState<User[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      const users = await DataService.getAllUsers();
      const materials = await DataService.getMaterials(UserRole.ADMIN);
      const pendingMats = materials.filter(m => m.status === 'pending').length;
      const quizzes = await DataService.getQuizzes();
      
      setStats({
        users: users.length,
        materials: materials.length,
        pending: pendingMats,
        quizzes: quizzes.length
      });

      setPendingInstructors(users.filter(u => u.role === UserRole.INSTRUCTOR && u.isVerified === false));
    };
    loadStats();
  }, []);

  const data = [
    { name: 'Users', count: stats.users },
    { name: 'Materials', count: stats.materials },
    { name: 'Pending', count: stats.pending },
    { name: 'Quizzes', count: stats.quizzes },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Overview</h2>
           <p className="text-slate-500 dark:text-slate-400">Real-time platform statistics.</p>
        </div>
      </div>

      {/* Alert Widget for Pending Instructors */}
      {pendingInstructors.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 dark:text-amber-300">Pending Instructor Approvals</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">{pendingInstructors.length} new instructor(s) waiting for verification.</p>
              </div>
           </div>
           {/* Note: In a real app, we'd link this to the tab, but for now just visual feedback */}
           <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide">Action Required</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
               <Users size={20} />
             </div>
             <span className="font-medium text-slate-500 dark:text-slate-400">Total Users</span>
           </div>
           <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats.users}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
               <FileText size={20} />
             </div>
             <span className="font-medium text-slate-500 dark:text-slate-400">Total Uploads</span>
           </div>
           <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats.materials}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
               <Shield size={20} />
             </div>
             <span className="font-medium text-slate-500 dark:text-slate-400">Pending Review</span>
           </div>
           <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
               <Trophy size={20} />
             </div>
             <span className="font-medium text-slate-500 dark:text-slate-400">Active Quizzes</span>
           </div>
           <div className="text-3xl font-bold text-slate-800 dark:text-white">{stats.quizzes}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Activity Analytics</h3>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                     cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

const ApprovalsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'downloads' | 'vacancies' | 'instructors'>('materials');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [downloads, setDownloads] = useState<DownloadRequest[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [pendingInstructors, setPendingInstructors] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const mats = await DataService.getMaterials(UserRole.ADMIN);
    setMaterials(mats.filter(m => m.status === 'pending'));

    const dls = await DataService.getDownloadRequests();
    setDownloads(dls.filter(d => d.status === 'pending'));

    const vacs = await DataService.getVacancies(UserRole.ADMIN);
    setVacancies(vacs.filter(v => v.status === 'pending'));

    const users = await DataService.getAllUsers();
    setPendingInstructors(users.filter(u => u.role === UserRole.INSTRUCTOR && u.isVerified === false));
  };

  const handleApproveMaterial = async (id: string, approve: boolean) => {
    await DataService.updateMaterialStatus(id, approve ? 'approved' : 'rejected');
    loadData();
  };

  const handleApproveDownload = async (id: string, approve: boolean) => {
    await DataService.updateDownloadRequestStatus(id, approve ? 'approved' : 'rejected');
    loadData();
  };

  const handleApproveVacancy = async (id: string, approve: boolean) => {
    await DataService.updateVacancyStatus(id, approve ? 'approved' : 'rejected');
    loadData();
  };

  const handleVerifyInstructor = async (uid: string) => {
    await DataService.verifyUser(uid);
    loadData();
  };

  const handleRejectInstructor = async (uid: string) => {
    if (confirm("Reject and delete this instructor signup?")) {
      await DataService.deleteUser(uid);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pending Approvals</h2>
      
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
         <button 
           onClick={() => setActiveTab('materials')} 
           className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'materials' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
         >
           Materials ({materials.length})
         </button>
         <button 
           onClick={() => setActiveTab('downloads')} 
           className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'downloads' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
         >
           Downloads ({downloads.length})
         </button>
         <button 
           onClick={() => setActiveTab('vacancies')} 
           className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'vacancies' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
         >
           Vacancies ({vacancies.length})
         </button>
         <button 
           onClick={() => setActiveTab('instructors')} 
           className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'instructors' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
         >
           Instructors ({pendingInstructors.length})
         </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'materials' && materials.length === 0 && <p className="text-slate-500">No pending materials.</p>}
        {activeTab === 'materials' && materials.map(m => (
          <div key={m.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white">{m.title}</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">{m.type} • {m.program}</p>
               <p className="text-xs text-slate-400">Uploaded by {m.uploadedBy}</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => handleApproveMaterial(m.id, true)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={20}/></button>
               <button onClick={() => handleApproveMaterial(m.id, false)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X size={20}/></button>
             </div>
          </div>
        ))}

        {activeTab === 'downloads' && downloads.length === 0 && <p className="text-slate-500">No pending download requests.</p>}
        {activeTab === 'downloads' && downloads.map(d => (
          <div key={d.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white">{d.materialTitle}</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">Requested by {d.studentName}</p>
               <p className="text-xs text-slate-400">{d.requestedAt}</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => handleApproveDownload(d.id, true)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={20}/></button>
               <button onClick={() => handleApproveDownload(d.id, false)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X size={20}/></button>
             </div>
          </div>
        ))}

        {activeTab === 'vacancies' && vacancies.length === 0 && <p className="text-slate-500">No pending vacancy posts.</p>}
        {activeTab === 'vacancies' && vacancies.map(v => (
          <div key={v.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
             <div>
               <h4 className="font-bold text-slate-800 dark:text-white">{v.title}</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">{v.company} • {v.location}</p>
               <p className="text-xs text-slate-400">Posted by {v.posterName}</p>
             </div>
             <div className="flex gap-2">
               <button onClick={() => handleApproveVacancy(v.id, true)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Check size={20}/></button>
               <button onClick={() => handleApproveVacancy(v.id, false)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X size={20}/></button>
             </div>
          </div>
        ))}

        {activeTab === 'instructors' && pendingInstructors.length === 0 && <p className="text-slate-500">No pending instructor verifications.</p>}
        {activeTab === 'instructors' && pendingInstructors.map(u => (
          <div key={u.uid} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
             <div className="flex items-center gap-3">
               <img src={u.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200" />
               <div>
                 <h4 className="font-bold text-slate-800 dark:text-white">{u.name}</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                 <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">Needs Verification</p>
               </div>
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={() => handleVerifyInstructor(u.uid)} 
                 className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
               >
                 Verify
               </button>
               <button 
                 onClick={() => handleRejectInstructor(u.uid)} 
                 className="px-3 py-1.5 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
               >
                 Reject
               </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserManagementView: React.FC<{currentUser?: User}> = ({currentUser}) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await DataService.getAllUsers();
    setUsers([...data]); // Force state update with new reference
  };

  const handleDelete = async (e: React.MouseEvent, uid: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await DataService.deleteUser(uid);
        // Optimistically remove from UI to ensure instant feedback
        setUsers(prev => prev.filter(u => u.uid !== uid));
      } catch (error) {
        console.error(error);
        alert("Failed to delete user. Please try again.");
        loadUsers(); // Revert on failure
      }
    }
  };

  const handleVerify = async (uid: string) => {
    await DataService.verifyUser(uid);
    loadUsers();
  };

  const handleChangeRole = async (uid: string, newRole: UserRole) => {
    await DataService.updateUserRole(uid, newRole);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-slate-800 dark:text-white">User Management</h2>
       <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <tr>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">User</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Role</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Status</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Email</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                 {users.map(u => (
                   <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                           <div>
                              <div className="font-medium text-slate-900 dark:text-white">{u.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <select 
                          value={u.role} 
                          onChange={e => handleChangeRole(u.uid, e.target.value as UserRole)}
                          disabled={u.uid === currentUser?.uid}
                          className="bg-transparent border-none font-medium text-slate-600 dark:text-slate-300 focus:ring-0 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value={UserRole.STUDENT}>Student</option>
                          <option value={UserRole.INSTRUCTOR}>Instructor</option>
                          <option value={UserRole.ADMIN}>Admin</option>
                        </select>
                     </td>
                     <td className="px-6 py-4">
                        {u.role === UserRole.INSTRUCTOR && !u.isVerified ? (
                           <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold">Pending</span>
                        ) : (
                           <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">Active</span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {u.role === UserRole.INSTRUCTOR && !u.isVerified && (
                             <button onClick={() => handleVerify(u.uid)} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline">Verify</button>
                           )}
                           {u.uid !== currentUser?.uid && (
                             <button onClick={(e) => handleDelete(e, u.uid)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                               <Trash2 size={16}/>
                             </button>
                           )}
                        </div>
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
         </div>
       </div>
    </div>
  );
};

const ExamResultsView: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [viewMode, setViewMode] = useState<'manage' | 'leaderboard'>('manage');
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');

  useEffect(() => {
    DataService.getAllResults().then(results => {
      setResults(results);
      // Auto-select first available quiz for leaderboard
      if (results.length > 0) {
        setSelectedQuizId(results[0].quizId);
      }
    });
  }, []);

  const handlePublish = async (id: string) => {
    await DataService.publishResult(id);
    setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'published' } : r));
    alert("Result Published! Student can now see their score and download PDF.");
  };

  // Grouping logic for Leaderboard
  const getLeaderboardData = () => {
    // 1. Filter by Selected Quiz
    const quizResults = results.filter(r => r.quizId === selectedQuizId && r.status === 'published');
    
    // 2. Group by Score/Percentage
    const grouped: Record<number, QuizResult[]> = {};
    quizResults.forEach(r => {
      if (!grouped[r.percentage]) grouped[r.percentage] = [];
      grouped[r.percentage].push(r);
    });

    // 3. Sort by Score Descending
    const sortedScores = Object.keys(grouped).map(Number).sort((a, b) => b - a);
    
    return { sortedScores, grouped };
  };

  const pendingResults = results.filter(r => r.status === 'pending');
  const publishedResults = results.filter(r => r.status === 'published');
  
  // Get unique quizzes for dropdown
  const uniqueQuizzes = Array.from(new Set(results.map(r => JSON.stringify({id: r.quizId, title: r.quizTitle}))))
    .map(s => JSON.parse(s as string));

  const { sortedScores, grouped } = getLeaderboardData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Exam Results Management</h2>
        
        <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
           <button 
             onClick={() => setViewMode('manage')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'manage' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
           >
             <List size={16} /> Manage
           </button>
           <button 
             onClick={() => setViewMode('leaderboard')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'leaderboard' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
           >
             <Trophy size={16} /> Leaderboard
           </button>
        </div>
      </div>
      
      {viewMode === 'manage' ? (
        <>
          {/* Pending Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
            <div className="px-6 py-4 bg-amber-50 dark:bg-amber-900/30 border-b border-amber-100 dark:border-amber-900/50">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                <ClockIcon /> Pending Approval ({pendingResults.length})
              </h3>
            </div>
            {pendingResults.length === 0 ? (
              <div className="overflow-x-auto p-8 text-center text-slate-500 dark:text-slate-400">No pending exam results.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Student</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Exam Title</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Score</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Date</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {pendingResults.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{r.studentName}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{r.quizTitle}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{r.percentage}%</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(r.completedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handlePublish(r.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-700"
                            >
                              Approve & Publish
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Published Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Published History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Student</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Exam Title</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Score</th>
                      <th className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {publishedResults.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{r.studentName}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{r.quizTitle}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{r.percentage}%</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold uppercase">Published</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Leaderboard View */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="flex items-center gap-4 mb-6">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Select Exam:</label>
                <select 
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white min-w-[250px]"
                >
                  {uniqueQuizzes.map((q: any) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
             </div>

             {sortedScores.length === 0 ? (
               <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                 No published results found for this exam yet.
               </div>
             ) : (
               <div className="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left whitespace-nowrap">
                     <thead className="bg-slate-900 dark:bg-black text-white">
                       <tr>
                         <th className="px-6 py-4 w-20 text-center">Rank</th>
                         <th className="px-6 py-4 w-32 text-center">Score</th>
                         <th className="px-6 py-4">Students</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                       {sortedScores.map((score, index) => {
                         const students = grouped[score];
                         const isGold = index === 0;
                         
                         return (
                           <tr key={score} className={isGold ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-white dark:bg-slate-800'}>
                             <td className="px-6 py-4 text-center">
                               {isGold ? (
                                 <div className="w-8 h-8 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center mx-auto font-bold shadow-sm">1</div>
                               ) : (
                                 <span className="font-bold text-slate-500 dark:text-slate-400">#{index + 1}</span>
                               )}
                             </td>
                             <td className="px-6 py-4 text-center">
                               <span className="font-bold text-lg text-slate-800 dark:text-white">{score}%</span>
                             </td>
                             <td className="px-6 py-4">
                               <div className="flex flex-wrap gap-2">
                                 {students.map(s => (
                                   <div key={s.id} className="flex items-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-full shadow-sm">
                                     <div className="w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-xs text-slate-600 dark:text-slate-200 font-bold">
                                        {s.studentName.charAt(0)}
                                     </div>
                                     <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{s.studentName}</span>
                                   </div>
                                 ))}
                               </div>
                             </td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const SystemSettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Server className="text-blue-600 dark:text-blue-400" /> System Health & Configuration
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hosting Status */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
             <Globe size={20} /> Hosting Environment
           </h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <span className="text-sm font-medium text-green-800 dark:text-green-300">Deployment</span>
                <span className="text-xs bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full font-bold">Active</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-300">Provider</span>
                <span className="text-sm font-medium text-slate-800 dark:text-white">Firebase Hosting</span>
             </div>
             <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-300">SPA Routing</span>
                <span className="text-sm font-medium text-slate-800 dark:text-white">Enabled (firebase.json)</span>
             </div>
           </div>
        </div>

        {/* Domain Config Guide */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
             <CheckCircle size={20} /> Connect Custom Domain
           </h3>
           <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
             To connect your own domain (e.g., pharmasolutionnepal.com), follow these manual steps in the Firebase Console.
           </p>
           
           <div className="space-y-3">
              <div className="flex gap-3 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                 <p className="text-sm text-slate-700 dark:text-slate-300">Go to <b>Firebase Console</b> &gt; <b>Hosting</b>.</p>
              </div>
              <div className="flex gap-3 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                 <p className="text-sm text-slate-700 dark:text-slate-300">Click <b>Add Custom Domain</b> and enter your domain name.</p>
              </div>
              <div className="flex gap-3 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                 <p className="text-sm text-slate-700 dark:text-slate-300">Copy the <b>TXT Records</b> provided by Firebase.</p>
              </div>
              <div className="flex gap-3 items-start">
                 <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">4</div>
                 <p className="text-sm text-slate-700 dark:text-slate-300">Login to your Domain Provider (GoDaddy/Namecheap) and add these TXT records to your DNS settings.</p>
              </div>
           </div>

           <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 flex gap-2 items-start">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              Verification may take up to 24 hours to propagate through global DNS servers.
           </div>
        </div>
      </div>
    </div>
  );
};

const AdManagementView: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    const data = await DataService.getAllAds();
    setAds([...data]); // Force state update with new reference
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this advertisement?")) {
      await DataService.deleteAd(id);
      loadAds();
    }
  };

  const readFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title || !startDate || !endDate) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    const imageUrl = await readFileToBase64(imageFile);
    await DataService.createAd({
      title,
      startDate,
      endDate,
      imageUrl,
      linkUrl
    });

    setIsCreating(false);
    setTitle('');
    setStartDate('');
    setEndDate('');
    setLinkUrl('');
    setImageFile(null);
    loadAds();
    alert("Advertisement Created Successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Megaphone className="text-blue-600 dark:text-blue-400" /> Ad Manager
        </h2>
        <button 
          onClick={() => setIsCreating(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={18} /> New Advertisement
        </button>
      </div>

      {isCreating && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-top-4">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg dark:text-white">Create New Banner</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={20}/></button>
           </div>
           
           <form onSubmit={handleCreate} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
                 <input 
                   type="file" 
                   accept="image/*"
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                 />
                 <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                    {imageFile ? (
                      <>
                        <CheckCircle className="text-green-500" size={32} />
                        <span className="font-medium text-slate-800 dark:text-white">{imageFile.name}</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="text-blue-500" size={32} />
                        <span className="font-medium text-slate-800 dark:text-white">Upload Banner Image</span>
                        <span className="text-xs">Recommended Size: 1200x400</span>
                      </>
                    )}
                 </div>
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Title</label>
                 <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                    <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                    <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Link URL (Optional)</label>
                 <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Publish Advertisement</button>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {ads.map(ad => (
           <div key={ad.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm relative group">
              <div className="h-40 bg-slate-100 relative">
                 <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white font-bold text-lg">{ad.title}</h3>
                    <p className="text-xs text-slate-200">{ad.startDate} - {ad.endDate}</p>
                 </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                 <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Active Campaign</span>
                 <button onClick={() => handleDelete(ad.id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AdminDashboard;