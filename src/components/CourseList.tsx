import React from 'react';
import { Course } from '../types';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  onSort: (criteria: 'rating' | 'difficulty', order: 'asc' | 'desc') => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, loading, onSort }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Resultados ({courses.length})</h2>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Ordenar por:
          </label>
          <select
            id="sort"
            className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-[#851539] focus:border-[#851539]"
            onChange={(e) => {
              const [criteria, order] = e.target.value.split('-') as ['rating' | 'difficulty', 'asc' | 'desc'];
              onSort(criteria, order);
            }}
            defaultValue="rating-desc"
          >
            <option value="rating-desc">Mayor valoración</option>
            <option value="rating-asc">Menor valoración</option>
            <option value="difficulty-desc">Más difícil</option>
            <option value="difficulty-asc">Menos difícil</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md h-64 animate-pulse">
              <div className="p-5 h-full">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron cursos con los criterios seleccionados.</p>
          <p className="text-gray-400 mt-2">Intenta con diferentes términos de búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;