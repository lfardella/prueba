import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { Star, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Function to get the difficulty level description
  const getDifficultyLabel = (level: number): string => {
    switch (level) {
      case 1: return 'Muy Fácil';
      case 2: return 'Fácil';
      case 3: return 'Moderado';
      case 4: return 'Difícil';
      case 5: return 'Muy Difícil';
      default: return 'Desconocido';
    }
  };

  return (
    <Link 
      to={`/course/${course.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 
                hover:shadow-lg hover:translate-y-[-4px] flex flex-col h-full"
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-800 mb-1">{course.code}</h3>
            <h4 className="text-lg font-medium text-gray-700 mb-2">{course.name}</h4>
          </div>
          <div className="flex items-center bg-[#851539] text-white px-2 py-1 rounded-md">
            <Star className="h-4 w-4 mr-1 fill-[#F0B323] text-[#F0B323]" />
            <span className="font-medium">{course.averageRating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="my-3 text-sm text-gray-600 line-clamp-2 flex-grow">
          {course.description}
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span>Secciones: {course.sections}</span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
          <div className="flex items-center">
            <div 
              className={`h-2 w-2 rounded-full mr-2 ${
                course.difficulty <= 2 ? 'bg-green-500' : 
                course.difficulty === 3 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            ></div>
            <span className="text-xs text-gray-600">
              Dificultad: {getDifficultyLabel(course.difficulty)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;