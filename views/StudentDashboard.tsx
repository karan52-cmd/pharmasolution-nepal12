import React, { useEffect, useState, useRef } from 'react';
import { Material, Program, User, Quiz, Question, QuizResult, Doubt, PracticeSet } from '../types';
import { DataService } from '../services/mockBackend';
import { GeminiService } from '../services/geminiService';
import AdCarousel from './AdCarousel';
import DrugIndexView from './DrugIndexView';
import VacancyView from './VacancyView';
import ClinicalToolsView from './ClinicalToolsView';
import CalendarView from './CalendarView';
import { 
  BookOpen, Clock, AlertCircle, FileText, Video, PlayCircle, 
  DownloadCloud, Search, Send, Bot, User as UserIcon, Loader2,
  CheckCircle, XCircle, Timer, ArrowRight, ArrowLeft, GraduationCap, HelpCircle, Layers, X, TrendingUp, Award
} from 'lucide-react';

interface Props {
  user: User;
  currentSubView: string;
}

const StudentDashboard: React.FC<Props> = ({ user, currentSubView }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isMediaPlayerOpen, setIsMediaPlayerOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<Material | null>(null);
  
  // Stats State
  const [stats, setStats] = useState({
    completed: 0,
    average: 0,
    grade: 'N/A'
  });

  useEffect(() => {
    // Load Materials
    DataService.getMaterials(user.role).then(res => {
      const filtered = res.filter(m => 
        m.program === user.program || 
        m.program === 'All Programs' as any
      );
      setMaterials(filtered);
    });

    // Load Stats
    DataService.getStudentResults(user.uid).then(results => {
      const published = results.filter(r => r.status === 'published');
      const count = published.length;
      
      let avg = 0;
      let grade = 'N/A';

      if (count > 0) {
        const totalScore = published.reduce((acc, curr) => acc + curr.percentage, 0);
        avg = Math.round(totalScore / count);

        if (avg >= 90) grade = 'A+';
        else if (avg >= 80) grade = 'A';
        else if (avg >= 70) grade = 'B';
        else if (avg >= 60) grade = 'C';
        else if (avg >= 50) grade = 'D';
        else grade = 'F';
      }

      setStats({
        completed: count,
        average: avg,
        grade: grade
      });
    });
  }, [user.role, user.program, user.uid]);

  const handleMediaOpen = (m: Material) => {
    setCurrentMedia(m);
    setIsMediaPlayerOpen(true);
  };

  if (currentSubView === 'ai-tutor') {
    return <AITutorView />;
  }

  if (currentSubView === 'learning') {
    return <LearningView materials={materials} user={user} onOpenMedia={handleMediaOpen} />;
  }

  if (currentSubView === 'quizzes') {
    return <QuizHubView user={user} />;
  }

  if (currentSubView === 'practice') {
    return <PracticeView user={user} />;
  }

  if (currentSubView === 'doubts') {
    return <DoubtForumView user={user} />;
  }

  if (currentSubView === 'drug-index') {
    return <DrugIndexView user={user} />;
  }

  if (currentSubView === 'vacancies') {
    return <VacancyView user={user} />;
  }

  if (currentSubView === 'tools') {
    return <ClinicalToolsView />;
  }

  if (currentSubView === 'calendar') {
    return <CalendarView />;
  }

  // Default Dashboard View
  return (
    <div className="space-y-6">
      {/* Advertisement Section */}
      <AdCarousel />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-blue-100">Your {user.program} program progress is looking great.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between">
            <div>
               <div className="text-3xl font-bold">{stats.average}%</div>
               <div className="text-sm text-blue-100">Average Score</div>
            </div>
            <TrendingUp className="self-end opacity-50" size={24} />
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between">
            <div>
               <div className="text-3xl font-bold">{stats.completed}</div>
               <div className="text-sm text-blue-100">Quizzes Completed</div>
            </div>
            <CheckCircle className="self-end opacity-50" size={24} />
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex flex-col justify-between">
            <div>
               <div className="text-3xl font-bold">{stats.grade}</div>
               <div className="text-sm text-blue-100">Current Grade</div>
            </div>
            <Award className="self-end opacity-50" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Materials</h2>
            <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {materials.slice(0, 3).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-600">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.type === 'video' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                  {m.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-slate-800 dark:text-white">{m.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{m.type} • {m.program}</p>
                </div>
                <span className="text-xs text-slate-400">{m.uploadedAt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Upcoming Quizzes</h2>
          </div>
           <div className="space-y-4">
             {/* Mock Upcoming Quiz */}
             <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white">Advanced Pharmacology</h3>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">Due Tomorrow</span>
                  </div>
                  <Clock size={16} className="text-slate-400" />
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2">
                  <div className="bg-blue-500 h-1.5 rounded-full w-0"></div>
                </div>
                <button className="mt-3 w-full py-2 text-sm text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  Start Preparation
                </button>
             </div>
           </div>
        </div>
      </div>

      {/* Media Viewer Modal */}
      {isMediaPlayerOpen && currentMedia && (
        <MediaViewerModal 
          material={currentMedia} 
          onClose={() => setIsMediaPlayerOpen(false)} 
        />
      )}
    </div>
  );
};

const MediaViewerModal: React.FC<{ material: Material, onClose: () => void }> = ({ material, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{material.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{material.type}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
           {material.type === 'video' ? (
             <div className="aspect-video w-full max-w-3xl bg-black rounded-lg flex items-center justify-center text-white">
                {/* Placeholder for actual video player */}
                <div className="text-center">
                  <PlayCircle size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Video Player Placeholder</p>
                  <p className="text-xs text-slate-400 mt-2">Source: {material.url}</p>
                </div>
             </div>
           ) : (
             <div className="w-full h-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg p-8 overflow-y-auto text-center">
                <FileText size={64} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h4 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">PDF Viewer Placeholder</h4>
                <p className="text-slate-500 dark:text-slate-400 mb-6">This is where the PDF content would be rendered.</p>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Download PDF</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- PRACTICE MODE (Flashcard style) ---
const PracticeView: React.FC<{ user: User }> = ({ user }) => {
  const [mode, setMode] = useState<'select' | 'practice'>('select');
  const [sets, setSets] = useState<PracticeSet[]>([]);
  const [filteredSets, setFilteredSets] = useState<PracticeSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<PracticeSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  useEffect(() => {
    // Filter sets by program
    DataService.getPracticeSets().then(res => {
      const userSets = res.filter(s => s.program === user.program || s.program === 'All Programs' as any);
      setSets(userSets);
      setFilteredSets(userSets);
    });
  }, [user.program]);

  // Filter logic
  useEffect(() => {
    if (selectedTopic === 'All') {
      setFilteredSets(sets);
    } else {
      setFilteredSets(sets.filter(s => s.topic === selectedTopic));
    }
  }, [selectedTopic, sets]);

  const uniqueTopics = ['All', ...Array.from(new Set(sets.map(s => s.topic)))];

  const handleStart = (set: PracticeSet) => {
    setSelectedSet(set);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedOption(null);
    setMode('practice');
  };

  const handleNext = () => {
    if (!selectedSet) return;
    setShowAnswer(false);
    setSelectedOption(null);
    setCurrentIndex(prev => (prev + 1) % selectedSet.questions.length);
  };

  const handleBack = () => {
    setMode('select');
    setSelectedSet(null);
  };

  if (mode === 'select') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="text-blue-600 dark:text-blue-400" size={32} />
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Practice Bank</h2>
            <p className="text-slate-500 dark:text-slate-400">Choose a topic to master. No timer, instant feedback.</p>
          </div>
        </div>

        {/* Topic Filter Bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {uniqueTopics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border ${
                selectedTopic === topic
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {filteredSets.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            No practice sets found for this topic.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSets.map(s => (
              <div key={s.id} onClick={() => handleStart(s)} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <Layers size={24} />
                   </div>
                   <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded-full">{s.topic}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.questions.length} Questions • {s.program}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Practice Mode
  if (!selectedSet || selectedSet.questions.length === 0) return <div>Error loading questions</div>;

  const currentQ = selectedSet.questions[currentIndex];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={handleBack} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
        <ArrowLeft size={18} /> Back to Topics
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px] flex flex-col">
        <div className="p-8 flex-1">
          <div className="flex justify-between mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
             <span>Question {currentIndex + 1} of {selectedSet.questions.length}</span>
             <span>{selectedSet.title}</span>
          </div>
          <p className="text-xl font-medium text-slate-800 dark:text-white mb-8">{currentQ.text}</p>
          
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
              if (showAnswer) {
                if (idx === currentQ.correctAnswer) btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                else btnClass += "border-slate-100 dark:border-slate-700 opacity-50 dark:text-slate-400";
              } else {
                 btnClass += selectedOption === idx 
                   ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-white" 
                   : "border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 dark:text-slate-300";
              }

              return (
                <button 
                  key={idx}
                  disabled={showAnswer}
                  onClick={() => { setSelectedOption(idx); setShowAnswer(true); }}
                  className={btnClass}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className={`mt-6 p-4 rounded-xl ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'}`}>
              <p className="font-bold flex items-center gap-2 mb-1">
                {isCorrect ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              <p className="text-sm">{currentQ.explanation || "No explanation provided."}</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end">
           <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
             Next Question <ArrowRight size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

// --- DOUBT FORUM ---
const DoubtForumView: React.FC<{ user: User }> = ({ user }) => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ subject: '', text: '' });

  useEffect(() => {
    DataService.getDoubts().then(setDoubts);
  }, []); // Should poll or refresh in real app

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Doubt Forum</h2>
         <button onClick={() => setIsAsking(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
           Ask New Doubt
         </button>
      </div>

      {isAsking && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in slide-in-from-top-4">
           <h3 className="font-bold text-lg mb-4 dark:text-white">Post a Question</h3>
           <div className="space-y-4">
             <input 
               type="text" 
               className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white"
               placeholder="Subject (e.g. Anatomy)"
               value={newQuestion.subject}
               onChange={e => setNewQuestion({...newQuestion, subject: e.target.value})}
             />
             <textarea 
               className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg h-32 dark:bg-slate-700 dark:text-white"
               placeholder="Describe your doubt..."
               value={newQuestion.text}
               onChange={e => setNewQuestion({...newQuestion, text: e.target.value})}
             />
             <div className="flex gap-2 justify-end">
               <button onClick={() => setIsAsking(false)} className="text-slate-500 dark:text-slate-400 px-4 py-2">Cancel</button>
               <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Post</button>
             </div>
           </div>
        </div>
      )}

      <div className="space-y-4">
        {doubts.map(d => (
          <div key={d.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">{d.subject}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${d.status === 'open' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>{d.status}</span>
             </div>
             <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">{d.question}</p>
             <p className="text-xs text-slate-400 mb-4">Posted by {d.studentName} • {d.createdAt}</p>
             
             {d.replies.length > 0 && (
               <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                 <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Instructor Reply</p>
                 <p className="text-slate-800 dark:text-slate-200">{d.replies[0].text}</p>
                 <p className="text-xs text-slate-400 mt-1">- {d.replies[0].authorName}</p>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- QUIZ HUB COMPONENT (Existing) ---

const QuizHubView: React.FC<{ user: User }> = ({ user }) => {
  const [viewState, setViewState] = useState<'list' | 'attempt' | 'result' | 'history'>('list');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [history, setHistory] = useState<QuizResult[]>([]);
  
  // Attempt State
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  
  // Result State
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    // Filter quizzes by program
    DataService.getQuizzes().then(res => {
        const filtered = res.filter(q => q.program === user.program || q.program === 'All Programs' as any);
        setQuizzes(filtered);
    });
    // Load history
    DataService.getStudentResults(user.uid).then(setHistory);
  }, [user.program, user.uid]); // Added deps

  const processSubmission = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    try {
      const res = await DataService.submitQuiz(activeQuiz.id, answers);
      setResult(res);
      setViewState('result');
      setShowSubmitConfirm(false);
      // Refresh history
      DataService.getStudentResults(user.uid).then(setHistory);
    } catch (e) {
      alert("Error submitting quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (viewState === 'attempt' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            processSubmission(); // Auto submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [viewState, timeLeft, answers, activeQuiz]);

  const handleStartQuiz = async (quiz: Quiz) => {
    try {
      const qs = await DataService.getQuizQuestions(quiz.id);
      if (qs.length === 0) {
        alert("No questions found for this quiz.");
        return;
      }
      setActiveQuiz(quiz);
      setQuestions(qs);
      setCurrentQuestionIdx(0);
      setAnswers({});
      setTimeLeft(quiz.durationMinutes * 60);
      setViewState('attempt');
    } catch (e) {
      console.error(e);
      alert("Failed to start quiz");
    }
  };

  const handleAnswer = (optionIdx: number) => {
    const currentQ = questions[currentQuestionIdx];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIdx
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownloadPDF = (result: QuizResult) => {
    alert("Downloading Result PDF...\n(This feature simulates generating a PDF of the exam result)");
  };

  // 1. LIST VIEW
  if (viewState === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Available Quizzes</h2>
           <button 
             onClick={() => setViewState('history')}
             className="text-blue-600 dark:text-blue-400 text-sm hover:underline font-medium"
           >
             View My History
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(q => (
            <div key={q.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                  <CheckCircle size={24} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${q.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {q.status}
                </span>
              </div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{q.title}</h3>
              <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} /> {q.durationMinutes} mins
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} /> {q.questionCount} Questions
                </div>
              </div>
              <button 
                onClick={() => handleStartQuiz(q)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 1.5 HISTORY VIEW
  if (viewState === 'history') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setViewState('list')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300"/>
          </button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Exam History</h2>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <tr>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Quiz</th>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Date</th>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Status</th>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Score</th>
                  <th className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {history.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{r.quizTitle}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(r.completedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {r.status === 'published' ? (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-bold">Published</span>
                      ) : (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded text-xs font-bold">Pending Review</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {r.status === 'published' ? `${r.percentage}%` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {r.status === 'published' ? (
                        <button 
                          onClick={() => handleDownloadPDF(r)}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <DownloadCloud size={16} /> Result PDF
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">Waiting for Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {history.length === 0 && <div className="p-8 text-center text-slate-500 dark:text-slate-400">No exam history found.</div>}
        </div>
      </div>
    );
  }

  // 2. ATTEMPT VIEW
  if (viewState === 'attempt' && activeQuiz) {
    const currentQ = questions[currentQuestionIdx];
    const isAnswered = answers[currentQ.id] !== undefined;
    const answeredCount = Object.keys(answers).length;
    const totalCount = questions.length;

    return (
      <div className="max-w-3xl mx-auto space-y-6 relative">
        {/* Header with Timer */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-4 z-10">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-white">{activeQuiz.title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentQuestionIdx + 1} of {totalCount}</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg ${timeLeft < 60 ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
            <Timer size={20} />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8">
             <p className="text-lg font-medium text-slate-900 dark:text-white mb-6">{currentQ.text}</p>
             <div className="space-y-3">
               {currentQ.options.map((opt, idx) => {
                 const isSelected = answers[currentQ.id] === idx;
                 return (
                   <button
                     key={idx}
                     onClick={() => handleAnswer(idx)}
                     className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                       isSelected 
                         ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                         : 'border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500 dark:text-slate-300'
                     }`}
                   >
                     <div className="flex items-center gap-3">
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 dark:border-slate-500'}`}>
                         {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                       </div>
                       {opt}
                     </div>
                   </button>
                 );
               })}
             </div>
          </div>
          
          {/* Footer Controls */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <button 
              onClick={handlePrev} 
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} /> Previous
            </button>
            
            {currentQuestionIdx === totalCount - 1 ? (
              <button 
                onClick={() => setShowSubmitConfirm(true)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                 {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                 Submit Quiz
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Next <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="flex flex-wrap gap-2 justify-center">
          {questions.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentQuestionIdx(idx)}
               className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                 currentQuestionIdx === idx ? 'ring-2 ring-offset-2 ring-blue-500 bg-blue-600 text-white' :
                 answers[questions[idx].id] !== undefined ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
               }`}
             >
               {idx + 1}
             </button>
          ))}
        </div>

        {/* Submit Confirmation Dialog */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border border-transparent dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Submit Quiz?</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
                {answeredCount < totalCount ? (
                  <span className="text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                    <AlertCircle size={16} />
                    You have {totalCount - answeredCount} unanswered questions.
                  </span>
                ) : (
                  "Are you sure you want to finish and submit your answers?"
                )}
                <br/><span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">You cannot change your answers after submission.</span>
              </p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => processSubmission()}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. RESULT VIEW (Waiting Approval State)
  if (viewState === 'result' && result) {
    return (
      <div className="max-w-3xl mx-auto pt-8 pb-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-center p-12">
           <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle size={48} />
           </div>
           <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Exam Submitted!</h2>
           <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
             Your answers have been recorded securely. An administrator will review your exam shortly.
             Once approved, you can view your score and download the result PDF from your History.
           </p>
           
           <button 
             onClick={() => {
               setViewState('list');
               setActiveQuiz(null);
               setResult(null);
               setQuestions([]); 
               setAnswers({});
             }}
             className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
           >
             Return to Quizzes
           </button>
        </div>
      </div>
    );
  }

  return <div>Error: Unknown State</div>;
};

const LearningView: React.FC<{ materials: Material[], user: User, onOpenMedia: (m: Material) => void }> = ({ materials, user, onOpenMedia }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDownloadMaterial, setConfirmDownloadMaterial] = useState<Material | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const filtered = materials.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDownloadClick = (m: Material) => {
    setConfirmDownloadMaterial(m);
  };

  const confirmDownload = async () => {
    if (confirmDownloadMaterial) {
      setIsRequesting(true);
      try {
        await DataService.requestDownload(confirmDownloadMaterial, user);
        setConfirmDownloadMaterial(null);
        alert(`Request sent for ${confirmDownloadMaterial.title}`);
      } catch (error) {
        console.error(error);
        alert("Failed to send request.");
      } finally {
        setIsRequesting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Learning Materials</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 dark:bg-slate-800 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((m) => (
          <div key={m.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-100 dark:bg-slate-700 flex items-center justify-center relative">
               {m.type === 'video' ? (
                 <PlayCircle size={48} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
               ) : (
                 <FileText size={48} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
               )}
               <span className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-black/50 rounded text-xs font-bold text-slate-600 dark:text-slate-200 uppercase tracking-wider">{m.type}</span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-1">{m.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{m.program} Program</p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => onOpenMedia(m)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {m.type === 'video' ? 'Watch Now' : 'Read Now'}
                </button>
                <button 
                  onClick={() => handleDownloadClick(m)}
                  className="w-10 flex items-center justify-center border border-slate-200 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  title="Request Download"
                >
                  <DownloadCloud size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmDownloadMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border border-transparent dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Confirm Request</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6">
              Are you sure you want to request a download for <span className="font-semibold text-slate-900 dark:text-white">{confirmDownloadMaterial.title}</span>?
              <br/><span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">This request must be approved by an administrator.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmDownloadMaterial(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                disabled={isRequesting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDownload}
                disabled={isRequesting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isRequesting && <Loader2 className="animate-spin" size={16} />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AITutorView: React.FC = () => {
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Namaste! I am your AI Pharma Tutor. Ask me anything about pharmacology, anatomy, or drug interactions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const response = await GeminiService.askTutor(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Bot className="text-blue-600 dark:text-blue-400" />
           <h2 className="font-semibold text-slate-800 dark:text-white">AI Doubt Solver</h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">Gemini 2.5 Flash</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">Thinking...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-600 transition-all dark:text-white"
            placeholder="Ask a question about your syllabus..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;