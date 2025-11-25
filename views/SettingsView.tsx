import React, { useState } from 'react';
import { User } from '../types';
import { AuthService } from '../services/mockBackend';
import { Settings, Save, Languages, Loader2, Camera, User as UserIcon, Key, Mail, Moon, Sun } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name || '');
  const [lang, setLang] = useState(user.language || 'en');
  const [theme, setTheme] = useState<'light' | 'dark'>(user.theme || 'light');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Avatar State
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatarUrl);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Prepare update object
      const updateData: Partial<User> = { 
        name, 
        language: lang as any,
        theme
      };

      // Handle Avatar
      if (avatarFile) {
         updateData.avatarUrl = await readFileToBase64(avatarFile);
      } else {
         updateData.avatarUrl = user.avatarUrl;
      }

      // Handle Password
      if (password) {
        if (password.length < 6) {
          alert("New password must be at least 6 characters long.");
          setIsSaving(false);
          return;
        }
        updateData.password = password;
      }

      const updated = await AuthService.updateProfile(user.uid, updateData);
      
      onUpdateUser(updated);
      setPassword(''); // Clear password field on success
      alert("Settings Saved Successfully!");
      setAvatarFile(null); 
    } catch(e) {
      console.error(e);
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Settings className="text-slate-400" /> Account Settings
        </h2>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Profile Header / Banner */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 p-8">
           <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="relative group">
               <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg ring-2 ring-blue-100 dark:ring-blue-900 bg-white">
                 <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
               </div>
               <label 
                 htmlFor="avatar-upload" 
                 className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer rounded-full backdrop-blur-[2px]"
               >
                 <Camera className="text-white mb-1" size={24} />
                 <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
               </label>
               <input 
                 id="avatar-upload" 
                 type="file" 
                 accept="image/*" 
                 className="hidden" 
                 onChange={handleAvatarChange} 
               />
             </div>
             
             <div className="text-center md:text-left flex-1">
               <h3 className="font-bold text-2xl text-slate-800 dark:text-white mb-1">{name || 'User'}</h3>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-500 dark:text-slate-400 text-sm">
                 <span className="capitalize bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-0.5 rounded-full text-xs font-bold">{user.role}</span>
                 <span className="flex items-center gap-1"><Mail size={14}/> {user.email}</span>
               </div>
               <p className="text-xs text-slate-400 mt-3 font-mono">UID: {user.uid}</p>
             </div>
           </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Personal Info */}
          <section className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <UserIcon size={16} /> Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input 
                  type="text" 
                  value={user.email} 
                  readOnly 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>
          </section>
          
          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Security */}
          <section className="space-y-4">
             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
               <Key size={16} /> Security
             </h4>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Change Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Enter new password to change" 
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
                <p className="text-xs text-slate-400 mt-1">Leave blank to keep current password.</p>
             </div>
          </section>

          <hr className="border-slate-100 dark:border-slate-700" />

          {/* Preferences */}
          <section className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Languages size={16} /> Preferences
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Language</label>
                <div className="flex flex-col gap-3">
                   <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${lang === 'en' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                     <input type="radio" name="lang" checked={lang === 'en'} onChange={() => setLang('en')} className="text-blue-600 focus:ring-blue-500" />
                     <span className="font-medium text-slate-700 dark:text-slate-200">English</span>
                   </label>
                   <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${lang === 'np' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                     <input type="radio" name="lang" checked={lang === 'np'} onChange={() => setLang('np')} className="text-blue-600 focus:ring-blue-500" />
                     <div>
                        <span className="font-medium text-slate-700 dark:text-slate-200 block">Nepali</span>
                        <span className="text-xs text-slate-500">(नेपाली)</span>
                     </div>
                   </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">App Theme</label>
                <div className="flex flex-col gap-3">
                   <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${theme === 'light' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                     <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} className="text-blue-600 focus:ring-blue-500" />
                     <Sun size={18} className="text-orange-500" />
                     <span className="font-medium text-slate-700 dark:text-slate-200">Light Mode</span>
                   </label>
                   <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${theme === 'dark' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                     <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="text-blue-600 focus:ring-blue-500" />
                     <Moon size={18} className="text-blue-400" />
                     <span className="font-medium text-slate-700 dark:text-slate-200">Dark Mode</span>
                   </label>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;