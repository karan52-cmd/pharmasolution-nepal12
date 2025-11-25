import React, { useState, useEffect } from 'react';
import { Drug, User, UserRole } from '../types';
import { DataService } from '../services/mockBackend';
import { Search, Pill, Activity, AlertTriangle, FileText, Stethoscope, Plus, X, Upload, ImageIcon, Trash2, CheckCircle } from 'lucide-react';

interface Props {
  user?: User;
}

const DrugIndexView: React.FC<Props> = ({ user }) => {
  const [query, setQuery] = useState('');
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  
  // Admin State
  const [isAdding, setIsAdding] = useState(false);
  const [newDrug, setNewDrug] = useState<Omit<Drug, 'id'>>({
    brandName: '', genericName: '', category: '', description: '', 
    dosage: '', sideEffects: '', manufacturer: '', imageUrl: ''
  });
  const [drugImageFile, setDrugImageFile] = useState<File | null>(null);

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    // Initial load
    handleSearch('');
  }, [isAdding]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    setLoading(true);
    const results = await DataService.searchDrugs(val);
    setDrugs(results);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDrugImageFile(e.target.files[0]);
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

  const handleAddDrug = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    if (drugImageFile) {
      imageUrl = await readFileToBase64(drugImageFile);
    }

    await DataService.createDrug({ ...newDrug, imageUrl });
    alert("Drug Added Successfully");
    setIsAdding(false);
    setNewDrug({ brandName: '', genericName: '', category: '', description: '', dosage: '', sideEffects: '', manufacturer: '', imageUrl: '' });
    setDrugImageFile(null);
  };

  const handleDeleteDrug = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this drug from the index?")) {
      await DataService.deleteDrug(id);
      setDrugs(prev => prev.filter(d => d.id !== id));
      if (selectedDrug?.id === id) setSelectedDrug(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Pill className="text-blue-600 dark:text-blue-400" /> Drug Index
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Search for medicines by Brand or Generic name.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Add New Drug
          </button>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-transparent dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add New Drug to Index</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleAddDrug} className="space-y-4">
               {/* Image Upload */}
               <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
                     {drugImageFile ? (
                       <>
                         <CheckCircle className="text-green-500" size={32} />
                         <span className="font-medium text-slate-800 dark:text-white">{drugImageFile.name}</span>
                       </>
                     ) : (
                       <>
                         <ImageIcon className="text-blue-500" size={32} />
                         <span className="font-medium text-slate-800 dark:text-white">Upload Drug Brand Image (Optional)</span>
                       </>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand Name</label>
                   <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.brandName} onChange={e => setNewDrug({...newDrug, brandName: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Generic Name</label>
                   <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.genericName} onChange={e => setNewDrug({...newDrug, genericName: e.target.value})} />
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                   <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.category} onChange={e => setNewDrug({...newDrug, category: e.target.value})} placeholder="e.g. Antibiotic" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manufacturer</label>
                   <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.manufacturer} onChange={e => setNewDrug({...newDrug, manufacturer: e.target.value})} />
                 </div>
               </div>

               <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                   <textarea required rows={3} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.description} onChange={e => setNewDrug({...newDrug, description: e.target.value})} />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dosage</label>
                   <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.dosage} onChange={e => setNewDrug({...newDrug, dosage: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Side Effects</label>
                   <input required type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white" value={newDrug.sideEffects} onChange={e => setNewDrug({...newDrug, sideEffects: e.target.value})} />
                 </div>
               </div>

               <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">Save Drug</button>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
           <input 
             type="text" 
             className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
             placeholder="Search e.g., 'Cetamol', 'Paracetamol', 'Antibiotic'..."
             value={query}
             onChange={e => handleSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
           {loading ? (
             <div className="text-center py-8 text-slate-400">Loading...</div>
           ) : drugs.length === 0 ? (
             <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
               No drugs found.
             </div>
           ) : (
             drugs.map(d => (
               <div 
                 key={d.id} 
                 onClick={() => setSelectedDrug(d)}
                 className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md relative group flex gap-3 items-start ${
                   selectedDrug?.id === d.id 
                     ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' 
                     : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500'
                 }`}
               >
                 {d.imageUrl && (
                   <img src={d.imageUrl} alt={d.brandName} className="w-16 h-16 object-cover rounded-lg bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shrink-0" />
                 )}
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 dark:text-white truncate">{d.brandName}</h3>
                      <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded shrink-0 ml-2">
                        {d.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic mb-1 truncate">{d.genericName}</p>
                    <p className="text-xs text-slate-400 truncate">{d.manufacturer}</p>
                 </div>
                 
                 {isAdmin && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleDeleteDrug(d.id); }}
                     className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-700 rounded-full shadow-sm text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                     title="Delete Drug"
                   >
                     <Trash2 size={16} />
                   </button>
                 )}
               </div>
             ))
           )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
           {selectedDrug ? (
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 h-full">
                <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-700 pb-6 mb-6">
                   <div className="flex gap-4">
                      {selectedDrug.imageUrl && (
                        <img src={selectedDrug.imageUrl} alt={selectedDrug.brandName} className="w-24 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm" />
                      )}
                      <div>
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{selectedDrug.brandName}</h2>
                        <div className="flex items-center gap-2 text-lg text-slate-600 dark:text-slate-300">
                          <Stethoscope size={20} />
                          <span className="italic">{selectedDrug.genericName}</span>
                        </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-bold inline-block mb-1">
                        {selectedDrug.category}
                      </div>
                      <p className="text-xs text-slate-400">{selectedDrug.manufacturer}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                      <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                        <FileText size={18} className="text-blue-500" /> Description
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedDrug.description}</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                         <h4 className="font-bold text-green-800 dark:text-green-300 flex items-center gap-2 mb-2">
                           <Activity size={18} /> Dosage
                         </h4>
                         <p className="text-green-900 dark:text-green-100 text-sm font-medium">{selectedDrug.dosage}</p>
                      </div>

                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                         <h4 className="font-bold text-red-800 dark:text-red-300 flex items-center gap-2 mb-2">
                           <AlertTriangle size={18} /> Side Effects
                         </h4>
                         <p className="text-red-900 dark:text-red-100 text-sm">{selectedDrug.sideEffects}</p>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="h-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 p-12">
                <Pill size={64} className="mb-4 opacity-50" />
                <p>Select a drug from the list to view details.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default DrugIndexView;