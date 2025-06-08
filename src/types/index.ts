// Type definitions for the Cursos UC application

export interface Course {
  id: string;
  code: string; // Course code (sigla)
  name: string;
  description: string;
  requirements: string[];
  semesters: string[]; // "Primer" or "Segundo"
  hasLabs: boolean;
  hasWorkshops: boolean;
  hasTASessions: boolean;
  sections: number;
  professors: string[];
  availableSpots: number;
  category: string;
  difficulty: number; // 1-5 scale
  averageRating: number; // 1-5 scale
  totalRatings: number;
  area: string; // Area of study
}

export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  content?: string; // Optional comment text
  rating: number; // 1-5 scale
  difficulty: number; // 1-5 scale
  createdAt: string;
}

export interface CourseList {
  id: string;
  userId: string;
  name: string;
  courses: string[]; // Array of course IDs
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

export interface ApiCourse {
  course_id: number | string;
  initials: string;
  name: string;
  description: string;
  requirements?: string;
  term?: string;
  program?: string;
}

export interface ApiComment {
  comment_id: number | string;
  user_id: string;
  course_id: string;
  description: string;
  rating: number;
  difficulty: number;
  professor?: string;
  is_active: boolean;
  last_updated: string;
  created_at: string;
}