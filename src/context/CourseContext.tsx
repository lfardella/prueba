import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course } from '../types';
import { getCourses } from '../api/courseService';

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  error: string | null;
  refreshCourses: () => Promise<void>;
  sortCourses: (criteria: 'rating' | 'difficulty', order: 'asc' | 'desc') => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError('Error al cargar los cursos. Por favor, intenta nuevamente.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const refreshCourses = async () => {
    await fetchCourses();
  };

  const sortCourses = (criteria: 'rating' | 'difficulty', order: 'asc' | 'desc') => {
    const sortedCourses = [...courses].sort((a, b) => {
      let comparison = 0;
      
      if (criteria === 'rating') {
        comparison = a.averageRating - b.averageRating;
      } else if (criteria === 'difficulty') {
        comparison = a.difficulty - b.difficulty;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
    
    setCourses(sortedCourses);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        error,
        refreshCourses,
        sortCourses
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};