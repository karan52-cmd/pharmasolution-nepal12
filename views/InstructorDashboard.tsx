
import React, { useState, useEffect } from 'react';
import { User, Program, Quiz, Question, Doubt, PracticeSet } from '../types';
import { DataService } from '../services/mockBackend';
import { Upload, CheckCircle, File, Film, AlertTriangle, Plus, Trash2, Save, HelpCircle, MessageSquare, Layers } from 'lucide-react';

interface Props {
  user: User;
  currentSubView: string;
}

const InstructorDashboard: React.FC<Props> = ({ user, currentSubView }) => {
  if (currentSubView === 'uploads') {
    return <UploadView user={user} />;
  }

  if (currentSubView === 'quizzes') {
    return <QuizManagerView user={user} />;
  }

  if (currentSubView === 'practice') {
    return <PracticeManagerView user={user} />;
  }

  if (currentSubView === 'doubts') {
    return <DoubtReplyView user={user} />;
  }
  
  // Dashboard Overview
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Instructor Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Uploads</div>
          <div className="text-3xl font-bold text-slate-800">24</div>
          <div className="text-green-500 text-xs mt-2 flex items-center gap-1">
            <CheckCircle size={12} /> 18 Approved
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Active Quizzes</div>
          <div className="text-3xl font-bold text-slate-800">5</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Pending Review</div>
          <div className="text-3xl font-bold text-orange-500">3</div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 font-medium text-slate-700">Recent Activity</div>
        <div className="p-6 text-center text-slate-500 py-12">
           No recent activity to display.
        </div>
      </div>
    </div>
  );
};

const PracticeManagerView: React.FC<{ user: User }> = ({ user }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [sets, setSets] = useState<PracticeSet[]>([]);

  // Form
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [program, setProgram] = useState<Program>(Program.BACHELOR);
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);

  useEffect(() => {
    DataService.getPracticeSets().then(setSets);
  }, [isCreating]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
  };

  const updateQuestion = (idx: number, field: keyof Question | 'option', value: any, optIdx?: number) => {
    const newQs = [...questions];
    if (field === 'option' && typeof optIdx === 'number') {
      const opts = [...(newQs[idx].options || [])];
      opts[optIdx] = value;
      newQs[idx].options = opts;
    } else {
      (newQs[idx] as any)[field] = value;
    }
    setQuestions(newQs);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!title || !topic || questions.length === 0) {
      alert("Please fill in all fields and add at least one question.");
      return;
    }
    // Validation
    for (const q of questions) {
      if (!q.text || q.options?.some(o => !o) || !q.explanation) {
        alert("Please complete all questions including explanations.");
        return;
      }
    }

    try {
      await DataService.createPracticeSet({
        title,
        topic,
        program,
        createdBy: user.uid,
        questions: questions as any
      });
      alert("Practice Set Created!");
      setIsCreating(false);
      setTitle('');
      setTopic('');
      setQuestions([]);
    } catch(e) {
      alert("Error creating set");
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">New Practice Set</h2>
          <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-slate-800">Cancel</button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Set Title</label>
               <input type="text" className="w-full px-4 py-2 border rounded-lg" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Heart Anatomy Review" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Topic/Subject</label>
               <input type="text" className="w-full px-4 py-2 border rounded-lg" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Anatomy" />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
               <select className="w-full px-4 py-2 border rounded-lg bg-white" value={program} onChange={e => setProgram(e.target.value as Program)}>
                 {Object.values(Program).map(p => <option key={p} value={p}>{p}</option>)}
                 <option value="All Programs">All Programs</option>
               </select>
             </div>
           </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <button onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={20} /></button>
              <h3 className="font-medium text-slate-800 mb-4">Question {qIdx + 1}</h3>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg mb-2" 
                  placeholder="Question text..." 
                  value={q.text} 
                  onChange={e => updateQuestion(qIdx, 'text', e.target.value)} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options?.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name={`correct-p-${qIdx}`} 
                        checked={q.correctAnswer === oIdx} 
                        onChange={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={e => updateQuestion(qIdx, 'option', e.target.value, oIdx)}
                      />
                    </div>
                  ))}
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Explanation (Required for Practice)</label>
                   <textarea 
                     className="w-full px-4 py-2 border border-green-100 bg-green-50 rounded-lg text-sm" 
                     placeholder="Explain why the answer is correct..."
                     value={q.explanation || ''}
                     onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
                     rows={2}
                   />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
           <Plus size={20} /> Add Question
        </button>

        <div className="flex justify-end pt-6">
          <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2">
            <Save size={20} /> Save Practice Set
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-slate-800">Practice Builder</h2>
           <p className="text-slate-500">Create topic-wise practice sets for students.</p>
         </div>
         <button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
           <Plus size={18} /> New Set
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sets.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold uppercase">{s.topic}</span>
               <span className="text-xs text-slate-400">{s.program}</span>
             </div>
             <h3 className="font-bold text-lg text-slate-800 mb-2">{s.title}</h3>
             <p className="text-sm text-slate-500 mb-4">{s.questions.length} Questions</p>
             <div className="text-xs text-slate-400">Created by you</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuizManagerView: React.FC<{ user: User }> = ({ user }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [program, setProgram] = useState<Program>(Program.BACHELOR);
  const [questions, setQuestions] = useState<Partial<Question>[]>([]);

  useEffect(() => {
    DataService.getQuizzes().then(setQuizzes);
  }, [isCreating]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]);
  };

  const updateQuestion = (idx: number, field: keyof Question | 'option', value: any, optIdx?: number) => {
    const newQs = [...questions];
    if (field === 'option' && typeof optIdx === 'number') {
      const opts = [...(newQs[idx].options || [])];
      opts[optIdx] = value;
      newQs[idx].options = opts;
    } else {
      (newQs[idx] as any)[field] = value;
    }
    setQuestions(newQs);
  };

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!title || questions.length === 0) {
      alert("Please add a title and at least one question.");
      return;
    }
    // Basic validation
    for (const q of questions) {
      if (!q.text || q.options?.some(o => !o)) {
        alert("Please fill in all question text and options.");
        return;
      }
    }

    try {
      await DataService.createQuiz({
        title,
        durationMinutes: duration,
        program,
      }, questions as any); // Cast for mock
      alert("Quiz Published Successfully!");
      setIsCreating(false);
      setTitle('');
      setQuestions([]);
    } catch (e) {
      alert("Error saving quiz.");
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Create New Quiz</h2>
          <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-slate-800">Cancel</button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Title</label>
              <input type="text" className="w-full px-4 py-2 border rounded-lg" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Pharmacology Final" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Minutes)</label>
              <input type="number" className="w-full px-4 py-2 border rounded-lg" value={duration} onChange={e => setDuration(parseInt(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
              <select className="w-full px-4 py-2 border rounded-lg bg-white" value={program} onChange={e => setProgram(e.target.value as Program)}>
                {Object.values(Program).map(p => <option key={p} value={p}>{p}</option>)}
                <option value="All Programs">All Programs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
              <button onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500"><Trash2 size={20} /></button>
              <h3 className="font-medium text-slate-800 mb-4">Question {qIdx + 1}</h3>
              
              <div className="space-y-4">
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg mb-2" 
                  placeholder="Question text..." 
                  value={q.text} 
                  onChange={e => updateQuestion(qIdx, 'text', e.target.value)} 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options?.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name={`correct-${qIdx}`} 
                        checked={q.correctAnswer === oIdx} 
                        onChange={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <input 
                        type="text" 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={e => updateQuestion(qIdx, 'option', e.target.value, oIdx)}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                   <input 
                     type="text" 
                     className="w-full px-4 py-2 border border-blue-100 bg-blue-50 rounded-lg text-sm" 
                     placeholder="Explanation (Optional for Practice Mode)"
                     value={q.explanation || ''}
                     onChange={e => updateQuestion(qIdx, 'explanation', e.target.value)}
                   />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button onClick={addQuestion} className="flex-1 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            <Plus size={20} /> Add Question
          </button>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-200">
          <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 flex items-center gap-2">
            <Save size={20} /> Publish Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Quiz Management</h2>
        <button onClick={() => setIsCreating(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Create New Quiz
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quizzes.map(q => (
          <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">{q.title}</h3>
              <p className="text-sm text-slate-500">{q.program} • {q.questionCount} Questions • {q.durationMinutes} mins</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium capitalize">{q.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const UploadView: React.FC<{ user: User }> = ({ user }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'pdf' | 'video' | 'ppt'>('pdf');
  const [program, setProgram] = useState<Program>(Program.BACHELOR);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile.size > 15 * 1024 * 1024) { // 15 MB in bytes
         alert("File size exceeds the 15MB limit. Please upload a smaller file.");
         e.target.value = '';
         setFile(null);
         return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      await DataService.uploadMaterial({
        title,
        type,
        program,
        uploadedBy: user.uid,
        url: 'mock_url',
      });
      alert('Upload Successful! Sent for admin approval.');
      setTitle('');
      setFile(null);
    } catch (err) {
      alert('Error uploading');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Upload Learning Material</h2>
        <p className="text-slate-500">Share knowledge with your students.</p>
      </div>

      <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Material Title</label>
          <input 
            required
            type="text" 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Intro to Organic Chemistry"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content Type</label>
            <select 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="pdf">PDF Document</option>
              <option value="video">Video Lecture</option>
              <option value="ppt">PowerPoint</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
            <select 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={program}
              onChange={(e) => setProgram(e.target.value as Program)}
            >
              <option value={Program.BACHELOR}>{Program.BACHELOR}</option>
              <option value={Program.DIPLOMA}>{Program.DIPLOMA}</option>
              <option value={Program.DHA}>{Program.DHA}</option>
              <option value="All Programs">All Programs</option>
            </select>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-2 text-slate-500">
             {file ? (
               <>
                 <CheckCircle className="text-green-500" size={32} />
                 <span className="font-medium text-slate-800">{file.name}</span>
                 <span className="text-xs">Ready to upload</span>
               </>
             ) : (
               <>
                 <Upload className="text-blue-500" size={32} />
                 <span className="font-medium text-slate-800">Click to upload or drag and drop</span>
                 <span className="text-xs">PDF, MP4, or PPT (Max 15MB)</span>
               </>
             )}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-3 items-start">
           <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={16} />
           <p className="text-xs text-yellow-700">All uploads must be approved by an Admin before they appear on student dashboards.</p>
        </div>

        <button 
          disabled={!file || isUploading}
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Submit Material'}
        </button>
      </form>
    </div>
  );
};

const DoubtReplyView: React.FC<{ user: User }> = ({ user }) => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [replyText, setReplyText] = useState('');
  const [activeDoubtId, setActiveDoubtId] = useState<string | null>(null);

  useEffect(() => {
    DataService.getDoubts().then(setDoubts);
  }, [replyText]); // Refresh after reply

  const handleReply = async (doubtId: string) => {
    if (!replyText) return;
    await DataService.replyDoubt(doubtId, user.name, user.role, replyText);
    setReplyText('');
    setActiveDoubtId(null);
    alert("Reply Posted");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Student Doubts</h2>
      <div className="space-y-4">
        {doubts.map(d => (
          <div key={d.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-slate-800">{d.subject}</h3>
              <span className={`px-2 py-1 rounded text-xs ${d.status === 'open' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {d.status}
              </span>
            </div>
            <p className="text-slate-600 mb-4">{d.question}</p>
            <p className="text-xs text-slate-400 mb-4">Asked by {d.studentName} on {d.createdAt}</p>

            {/* Replies */}
            <div className="space-y-3 pl-4 border-l-2 border-slate-100 mb-4">
              {d.replies.map(r => (
                <div key={r.id} className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs font-bold text-slate-700">{r.authorName} ({r.role})</p>
                  <p className="text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>

            {activeDoubtId === d.id ? (
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border rounded-lg px-3 py-2 text-sm" 
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
                <button onClick={() => handleReply(d.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Send</button>
              </div>
            ) : (
               <button onClick={() => setActiveDoubtId(d.id)} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                 <MessageSquare size={14} /> Reply
               </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorDashboard;
