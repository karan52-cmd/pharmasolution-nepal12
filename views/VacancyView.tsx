import React, { useState, useEffect } from 'react';
import { User, Vacancy } from '../types';
import { DataService } from '../services/mockBackend';
import { Briefcase, MapPin, Building, Calendar, DollarSign, Plus, CheckCircle, Clock, Upload, ImageIcon, X, Maximize2 } from 'lucide-react';

interface Props {
  user: User;
}

const VacancyView: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'post' | 'my-posts'>('browse');
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [myVacancies, setMyVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time' as const,
    salary: '',
    deadline: '',
    description: '',
    requirements: '',
    contactEmail: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    const all = await DataService.getVacancies(user.role);
    setVacancies(all);
    const mine = await DataService.getUserVacancies(user.uid);
    setMyVacancies(mine);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) return;
    
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await readFileToBase64(imageFile);
    }

    await DataService.createVacancy({
      ...formData,
      postedBy: user.uid,
      posterName: user.name,
      posterRole: user.role,
      imageUrl: imageUrl
    });
    
    alert('Vacancy Posted! Waiting for Admin Approval.');
    setFormData({
      title: '', company: '', location: '', type: 'Full-time', 
      salary: '', deadline: '', description: '', requirements: '', contactEmail: ''
    });
    setImageFile(null);
    setActiveTab('my-posts');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <Briefcase className="text-blue-600 dark:text-blue-400" /> Career Hub
           </h2>
           <p className="text-slate-500 dark:text-slate-400">Find jobs or recruit talent.</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => setActiveTab('browse')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'browse' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
           >
             Browse Jobs
           </button>
           <button 
             onClick={() => setActiveTab('post')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'post' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
           >
             <Plus size={16} /> Post Job
           </button>
           <button 
             onClick={() => setActiveTab('my-posts')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'my-posts' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
           >
             My Posts
           </button>
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
               No job vacancies available at the moment.
            </div>
          ) : (
            vacancies.map(v => (
              <div 
                key={v.id} 
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col cursor-pointer"
                onClick={() => setSelectedVacancy(v)}
              >
                 {v.imageUrl && (
                    <div className="h-48 w-full bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                       <img src={v.imageUrl} alt="Job Flyer" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                          <span className="text-white text-sm font-medium flex items-center gap-1"><Maximize2 size={14}/> View Flyer</span>
                       </div>
                    </div>
                 )}
                 
                 <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{v.title}</h3>
                      <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-bold shrink-0">{v.type}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4 text-sm">
                      <Building size={16} /> {v.company}
                      <span className="mx-1">•</span>
                      <MapPin size={16} /> {v.location}
                   </div>
                   
                   <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">{v.description}</p>
                   
                   <div className="flex flex-wrap gap-2 text-xs mb-4">
                       {v.salary && <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded flex items-center gap-1"><DollarSign size={12}/> {v.salary}</span>}
                       <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded flex items-center gap-1"><Calendar size={12}/> Apply by {v.deadline}</span>
                   </div>

                   <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center mt-auto">
                      <div className="text-xs text-slate-400">Posted by {v.posterName}</div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">View Details</span>
                   </div>
                 </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'post' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Post a New Vacancy</h3>
          <form onSubmit={handlePost} className="space-y-4">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
               <input 
                 type="file" 
                 accept="image/*"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 onChange={handleFileChange}
               />
               <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                  {imageFile ? (
                    <>
                      <CheckCircle className="text-green-500" size={32} />
                      <span className="font-medium text-slate-800 dark:text-white">{imageFile.name}</span>
                      <span className="text-xs">Image attached</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="text-blue-500" size={32} />
                      <span className="font-medium text-slate-800 dark:text-white">Upload Job Flyer / Poster (Optional)</span>
                      <span className="text-xs">Drag & drop or click to upload image</span>
                    </>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                 <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                 <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                 <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
                 <select className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                 </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Salary Range (Optional)</label>
                 <input type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} placeholder="e.g. 20k - 30k" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Deadline</label>
                 <input required type="date" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Description</label>
               <textarea required rows={4} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Requirements</label>
               <textarea required rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} />
            </div>

            <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email for Applications</label>
               <input required type="email" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700">Submit Vacancy</button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'my-posts' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                 <tr>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Title</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Company</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Posted At</th>
                   <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                 {myVacancies.map(v => (
                   <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                     <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{v.title}</td>
                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{v.company}</td>
                     <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{v.postedAt}</td>
                     <td className="px-6 py-4">
                        {v.status === 'approved' && <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><CheckCircle size={12}/> Approved</span>}
                        {v.status === 'pending' && <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold flex w-fit items-center gap-1"><Clock size={12}/> Pending</span>}
                        {v.status === 'rejected' && <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs font-bold">Rejected</span>}
                     </td>
                   </tr>
                 ))}
              </tbody>
            </table>
          </div>
          {myVacancies.length === 0 && <div className="p-8 text-center text-slate-500 dark:text-slate-400">You haven't posted any vacancies yet.</div>}
        </div>
      )}

      {/* Vacancy Detail Modal */}
      {selectedVacancy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-transparent dark:border-slate-700">
             <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedVacancy.title}</h2>
                     <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">{selectedVacancy.company}</p>
                   </div>
                   <button onClick={() => setSelectedVacancy(null)} className="md:hidden p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-300"><X size={20}/></button>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                   <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">{selectedVacancy.type}</span>
                   <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"><MapPin size={14}/> {selectedVacancy.location}</span>
                   {selectedVacancy.salary && <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm flex items-center gap-1"><DollarSign size={14}/> {selectedVacancy.salary}</span>}
                </div>

                <div className="space-y-6">
                   <div>
                     <h3 className="font-bold text-slate-800 dark:text-white mb-2">Description</h3>
                     <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedVacancy.description}</p>
                   </div>
                   
                   <div>
                     <h3 className="font-bold text-slate-800 dark:text-white mb-2">Requirements</h3>
                     <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedVacancy.requirements}</p>
                   </div>

                   <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Application Deadline</p>
                      <p className="font-medium text-slate-800 dark:text-white flex items-center gap-2"><Calendar size={18}/> {selectedVacancy.deadline}</p>
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                        <a href={`mailto:${selectedVacancy.contactEmail}`} className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                          Apply via Email
                        </a>
                        <p className="text-xs text-center text-slate-400 mt-2">Send CV to {selectedVacancy.contactEmail}</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Side: Image/Flyer */}
             {selectedVacancy.imageUrl && (
               <div className="w-full md:w-[400px] bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700">
                  <img src={selectedVacancy.imageUrl} alt="Job Flyer" className="max-w-full max-h-[80vh] rounded-lg shadow-sm" />
               </div>
             )}
             
             {/* Close Button for Desktop */}
             <button 
               onClick={() => setSelectedVacancy(null)}
               className="hidden md:block absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full shadow-sm backdrop-blur-sm transition-all text-slate-600 dark:text-white"
             >
               <X size={20} />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyView;