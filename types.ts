
export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

export enum Program {
  DIPLOMA = 'Diploma',
  BACHELOR = 'Bachelor',
  DHA = 'DHA',
  ALL = 'All Programs'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  program?: Program;
  avatarUrl?: string;
  language?: 'en' | 'np';
  theme?: 'light' | 'dark';
  isVerified?: boolean;
  password?: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'ppt';
  program: Program;
  status: 'pending' | 'approved' | 'rejected';
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface Quiz {
  id: string;
  title: string;
  durationMinutes: number;
  program: Program;
  status: 'draft' | 'published';
  questionCount: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of the correct option
  explanation?: string; // For practice mode
}

export interface PracticeSet {
  id: string;
  title: string;
  topic: string;
  program: Program;
  createdBy: string;
  questions: Question[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  status: 'pending' | 'published';
  studentName: string;
}

export interface DownloadRequest {
  id: string;
  materialId: string;
  materialTitle: string;
  studentName: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface Doubt {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  question: string;
  status: 'open' | 'resolved';
  createdAt: string;
  replies: {
    id: string;
    authorName: string;
    role: UserRole;
    text: string;
    createdAt: string;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  description: string;
  requirements: string;
  contactEmail: string;
  imageUrl?: string;
  postedBy: string;
  posterName: string;
  posterRole: UserRole;
  status: 'pending' | 'approved' | 'rejected';
  postedAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  linkUrl?: string;
}

export interface Drug {
  id: string;
  brandName: string;
  genericName: string;
  category: string;
  description: string;
  dosage: string;
  sideEffects: string;
  manufacturer: string;
  imageUrl?: string;
}
