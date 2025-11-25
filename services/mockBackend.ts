
import { User, UserRole, Program, Material, Quiz, DownloadRequest, Question, QuizResult, Doubt, PracticeSet, Notification, Vacancy, Advertisement, Drug } from '../types';

// Mock Database
const db = {
  users: [
    { uid: '1', name: 'Aarav Student', email: 'student@pharma.com', password: 'password', role: UserRole.STUDENT, program: Program.BACHELOR, avatarUrl: 'https://i.pravatar.cc/150?u=1', theme: 'light', isVerified: true },
    { uid: '2', name: 'Dr. Sharma', email: 'instructor@pharma.com', password: 'password', role: UserRole.INSTRUCTOR, avatarUrl: 'https://i.pravatar.cc/150?u=2', theme: 'light', isVerified: true },
    { uid: '3', name: 'System Admin', email: 'admin@pharma.com', password: 'password', role: UserRole.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=3', theme: 'dark', isVerified: true },
  ] as User[],
  materials: [
    { id: 'm1', title: 'Pharmacology 101', type: 'pdf', program: Program.BACHELOR, status: 'approved', uploadedBy: '2', uploadedAt: '2023-10-01', url: '#' },
    { id: 'm2', title: 'Drug Interactions Video', type: 'video', program: Program.BACHELOR, status: 'pending', uploadedBy: '2', uploadedAt: '2023-10-05', url: '#' },
    { id: 'm3', title: 'General Safety Protocols', type: 'pdf', program: Program.ALL, status: 'approved', uploadedBy: '2', uploadedAt: '2023-10-06', url: '#' },
  ] as Material[],
  quizzes: [
    { id: 'q1', title: 'Mid-Term Pharmacology', durationMinutes: 45, program: Program.BACHELOR, status: 'published', questionCount: 2 },
    { id: 'q2', title: 'Safety Basics', durationMinutes: 15, program: Program.ALL, status: 'published', questionCount: 5 },
  ] as Quiz[],
  questions: {
    'q1': [
      { id: '1', text: 'Which of the following is a beta-blocker?', options: ['Atenolol', 'Lisinopril', 'Amlodipine', 'Furosemide'], correctAnswer: 0, explanation: 'Atenolol is a selective beta-1 blocker used to treat hypertension.' },
      { id: '2', text: 'What is the standard dosage unit for Insulin?', options: ['mg', 'ml', 'Units', 'grams'], correctAnswer: 2, explanation: 'Insulin is dosed in International Units.' },
    ]
  } as Record<string, Question[]>,
  results: [] as QuizResult[],
  practiceSets: [
    {
      id: 'ps1',
      title: 'Cardiovascular Drugs',
      topic: 'Pharmacology',
      program: Program.BACHELOR,
      createdBy: '2',
      questions: [
        { id: 'p1', text: 'Digoxin is primarily used for?', options: ['Hypertension', 'Heart Failure', 'Diabetes', 'Asthma'], correctAnswer: 1, explanation: 'Digoxin increases myocardial contractility.' },
        { id: 'p2', text: 'Which drug causes a dry cough as a side effect?', options: ['Lisinopril', 'Losartan', 'Metoprolol', 'Verapamil'], correctAnswer: 0, explanation: 'ACE inhibitors like Lisinopril often cause dry cough.' }
      ]
    },
    {
      id: 'ps2',
      title: 'General Anatomy',
      topic: 'Anatomy',
      program: Program.ALL,
      createdBy: '2',
      questions: [
        { id: 'p3', text: 'The skull is part of which skeleton?', options: ['Axial', 'Appendicular', 'Both', 'None'], correctAnswer: 0, explanation: 'The axial skeleton consists of the skull, vertebral column, and rib cage.' }
      ]
    }
  ] as PracticeSet[],
  doubts: [
    {
      id: 'd1', studentId: '1', studentName: 'Aarav Student', subject: 'Pharmacology', question: 'What is the difference between pharmacokinetics and pharmacodynamics?', status: 'resolved', createdAt: '2023-10-20',
      replies: [{ id: 'r1', authorName: 'Dr. Sharma', role: UserRole.INSTRUCTOR, text: 'Kinetics is what the body does to the drug. Dynamics is what the drug does to the body.', createdAt: '2023-10-21' }]
    }
  ] as Doubt[],
  downloads: [] as DownloadRequest[],
  notifications: [
    { id: 'n1', userId: '1', title: 'Welcome', message: 'Welcome to PharmaSol!', isRead: false, createdAt: '2023-10-01' }
  ] as Notification[],
  vacancies: [] as Vacancy[],
  ads: [
    { id: 'ad1', title: 'Big Discount on Books', imageUrl: 'https://via.placeholder.com/400x200', startDate: '2023-01-01', endDate: '2025-12-31', linkUrl: '#' }
  ] as Advertisement[],
  drugs: [
    { id: 'dg1', brandName: 'Cetamol', genericName: 'Paracetamol', category: 'Analgesic', description: 'Used for fever and mild pain.', dosage: '500mg', sideEffects: 'Liver toxicity in high doses', manufacturer: 'Nepal Pharma', imageUrl: 'https://via.placeholder.com/100' }
  ] as Drug[]
};

export const DataService = {
  getMaterials: async (role: UserRole, program?: Program): Promise<Material[]> => {
    await new Promise(r => setTimeout(r, 300));
    let data = db.materials;
    if (role === UserRole.STUDENT) {
       data = data.filter(m => m.status === 'approved');
       if (program) {
         data = data.filter(m => m.program === program || m.program === Program.ALL);
       }
    }
    return data;
  },

  updateMaterialStatus: async (id: string, status: string): Promise<void> => {
     await new Promise(r => setTimeout(r, 300));
     const m = db.materials.find(m => m.id === id);
     if (m) m.status = status as any;
  },

  uploadMaterial: async (material: Omit<Material, 'id' | 'uploadedAt' | 'status'>): Promise<Material> => {
     await new Promise(r => setTimeout(r, 600));
     const newMat: Material = {
       ...material,
       id: Math.random().toString(36).substr(2, 9),
       uploadedAt: new Date().toISOString().split('T')[0],
       status: 'pending'
     };
     db.materials.push(newMat);
     return newMat;
  },

  getQuizzes: async (program?: Program): Promise<Quiz[]> => {
    await new Promise(r => setTimeout(r, 300));
    if (program) {
        return db.quizzes.filter(q => q.program === program || q.program === Program.ALL);
    }
    return db.quizzes;
  },

  createQuiz: async (quiz: Omit<Quiz, 'id' | 'status' | 'questionCount'>, questions: Omit<Question, 'id'>[]): Promise<void> => {
    await new Promise(r => setTimeout(r, 800));
    const newId = Math.random().toString(36).substr(2, 9);
    const newQuiz: Quiz = {
      id: newId,
      ...quiz,
      status: 'published',
      questionCount: questions.length
    };
    db.quizzes.push(newQuiz);
    db.questions[newId] = questions.map((q: any, i: number) => ({ ...q, id: `${newId}_q${i}` }));
  },

  getQuizQuestions: async (quizId: string): Promise<Question[]> => {
    await new Promise(r => setTimeout(r, 300));
    return db.questions[quizId] || [];
  },

  submitQuiz: async (quizId: string, answers: Record<string, number>): Promise<QuizResult> => {
    await new Promise(r => setTimeout(r, 1000));
    const questions = db.questions[quizId] || [];
    let correct = 0;
    questions.forEach((q: Question) => {
        if (answers[q.id] === q.correctAnswer) correct++;
    });
    
    const result: QuizResult = {
        id: Math.random().toString(),
        quizId,
        quizTitle: db.quizzes.find((q: Quiz) => q.id === quizId)?.title || 'Quiz',
        score: correct,
        totalQuestions: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
        completedAt: new Date().toISOString(),
        status: 'pending',
        studentName: 'Aarav Student' // Mocked current user name
    };
    db.results.push(result);
    return result;
  },

  getStudentResults: async (uid: string): Promise<QuizResult[]> => {
    await new Promise(r => setTimeout(r, 300));
    // In a real app we would filter by uid, but mock results are simplistic
    return db.results; 
  },

  getAllResults: async (): Promise<QuizResult[]> => {
    await new Promise(r => setTimeout(r, 300));
    return db.results;
  },

  publishResult: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    const r = db.results.find(r => r.id === id);
    if (r) r.status = 'published';
  },

  requestDownload: async (material: Material, user: User) => {
     await new Promise(r => setTimeout(r, 500));
     db.downloads.push({
       id: Math.random().toString(),
       materialId: material.id,
       materialTitle: material.title,
       studentName: user.name,
       status: 'pending',
       requestedAt: new Date().toISOString().split('T')[0]
     });
  },

  getDownloadRequests: async (): Promise<DownloadRequest[]> => {
    return db.downloads;
  },

  updateDownloadRequestStatus: async (id: string, status: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    const d = db.downloads.find(d => d.id === id);
    if (d) d.status = status as any;
  },

  // Doubts
  getDoubts: async (): Promise<Doubt[]> => {
    await new Promise(r => setTimeout(r, 400));
    return db.doubts;
  },

  replyDoubt: async (doubtId: string, authorName: string, role: UserRole, text: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    const doubt = db.doubts.find((d: Doubt) => d.id === doubtId);
    if (doubt) {
      doubt.replies.push({
        id: Math.random().toString(),
        authorName,
        role,
        text,
        createdAt: new Date().toISOString().split('T')[0]
      });
      doubt.status = 'resolved';
    }
  },

  // Practice Sets
  getPracticeSets: async (program?: Program): Promise<PracticeSet[]> => {
    await new Promise(r => setTimeout(r, 400));
    if (program) {
      return db.practiceSets.filter(s => s.program === program || s.program === Program.ALL);
    }
    return db.practiceSets;
  },

  createPracticeSet: async (set: Omit<PracticeSet, 'id'>): Promise<void> => {
    await new Promise(r => setTimeout(r, 800));
    const newSet = { ...set, id: Math.random().toString(36).substr(2, 9) };
    db.practiceSets.push(newSet);
  },

  // Notifications
  getNotifications: async (uid: string): Promise<Notification[]> => {
    await new Promise(r => setTimeout(r, 300));
    return db.notifications.filter(n => n.userId === uid);
  },

  markNotificationRead: async (id: string): Promise<void> => {
    const n = db.notifications.find(n => n.id === id);
    if (n) n.isRead = true;
  },

  // Vacancies
  getVacancies: async (role: UserRole): Promise<Vacancy[]> => {
    await new Promise(r => setTimeout(r, 300));
    if (role === UserRole.ADMIN) return db.vacancies;
    return db.vacancies.filter(v => v.status === 'approved');
  },

  getUserVacancies: async (uid: string): Promise<Vacancy[]> => {
    await new Promise(r => setTimeout(r, 300));
    return db.vacancies.filter(v => v.postedBy === uid);
  },

  createVacancy: async (vacancy: any): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    db.vacancies.push({
      id: Math.random().toString(),
      ...vacancy,
      status: 'pending',
      postedAt: new Date().toISOString().split('T')[0]
    });
  },

  updateVacancyStatus: async (id: string, status: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    const v = db.vacancies.find(v => v.id === id);
    if (v) v.status = status as any;
  },

  // Advertisements
  getActiveAds: async (): Promise<Advertisement[]> => {
    await new Promise(r => setTimeout(r, 300));
    // Filter by date logic normally, returning all for mock
    return db.ads;
  },

  getAllAds: async (): Promise<Advertisement[]> => {
    return db.ads;
  },

  createAd: async (ad: any): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    db.ads.push({ id: Math.random().toString(), ...ad });
  },

  deleteAd: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    db.ads = db.ads.filter(a => a.id !== id);
  },

  // Drugs
  searchDrugs: async (query: string): Promise<Drug[]> => {
    await new Promise(r => setTimeout(r, 300));
    if (!query) return db.drugs;
    const q = query.toLowerCase();
    return db.drugs.filter(d => 
      d.brandName.toLowerCase().includes(q) || 
      d.genericName.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
  },

  createDrug: async (drug: any): Promise<void> => {
    await new Promise(r => setTimeout(r, 500));
    db.drugs.push({ id: Math.random().toString(), ...drug });
  },

  deleteDrug: async (id: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
    db.drugs = db.drugs.filter(d => d.id !== id);
  },

  // Admin User Management
  getAllUsers: async (): Promise<User[]> => {
    return db.users;
  },

  updateUserRole: async (uid: string, newRole: UserRole): Promise<void> => {
    const u = db.users.find(u => u.uid === uid);
    if(u) u.role = newRole;
  },

  deleteUser: async (uid: string): Promise<void> => {
    db.users = db.users.filter(u => u.uid !== uid);
  },

  verifyUser: async (uid: string): Promise<void> => {
    const u = db.users.find(u => u.uid === uid);
    if(u) u.isVerified = true;
  }
};

export const AuthService = {
  login: async (email: string, password?: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 500));
    const user = db.users.find((u: User) => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    // Check password in real app
    return user;
  },
  signup: async (name: string, email: string, password: string, role: UserRole, program?: Program): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const newUser: User = {
      uid: Math.random().toString(),
      name, email, password, role, program,
      isVerified: role !== UserRole.INSTRUCTOR,
      theme: 'light'
    };
    db.users.push(newUser);
    return newUser;
  },
  updateProfile: async (uid: string, data: Partial<User>): Promise<User> => {
    const idx = db.users.findIndex(u => u.uid === uid);
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...data };
      return db.users[idx];
    }
    throw new Error("User not found");
  },
  resetPassword: async (email: string, newPass: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 600));
    const u = db.users.find(u => u.email === email);
    if (u) u.password = newPass;
    else throw new Error("User not found");
  }
};
