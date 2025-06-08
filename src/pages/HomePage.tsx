import React, { useState } from 'react';
import { useCourses } from '../context/CourseContext';
import SearchBar from '../components/SearchBar';
import CourseList from '../components/CourseList';
import { Course } from '../types';
import { searchCourses } from '../api/courseService';

type Filters = {
  difficulty?: number;
  rating?: number;
};

const HomePage: React.FC = () => {
  const { courses, loading, sortCourses } = useCourses();
  const [searchResults, setSearchResults] = useState<Course[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (query: string, filters: Filters) => {
    setSearchLoading(true);
    try {
      const results = await searchCourses(query, filters);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching courses:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSort = (criteria: 'rating' | 'difficulty', order: 'asc' | 'desc') => {
    if (searchResults) {
      // Sort search results
      const sortedResults = [...searchResults].sort((a, b) => {
        let comparison = 0;
        
        if (criteria === 'rating') {
          comparison = a.averageRating - b.averageRating;
        } else if (criteria === 'difficulty') {
          comparison = a.difficulty - b.difficulty;
        }
        
        return order === 'asc' ? comparison : -comparison;
      });
      
      setSearchResults(sortedResults);
    } else {
      // Sort all courses
      sortCourses(criteria, order);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explora Cursos UC</h1>
        <p className="text-gray-600">
          Encuentra información detallada, opiniones de estudiantes y recomendaciones para tus próximos cursos.
        </p>
      </div>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <CourseList 
        courses={searchResults !== null ? searchResults : courses} 
        loading={searchResults !== null ? searchLoading : loading}
        onSort={handleSort}
      />
    </div>
  );
};

// CI/CD test

export default HomePage;