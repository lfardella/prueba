import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, getCourseComments } from '../api/courseService';
import CourseDetails from '../components/CourseDetails';
import { Course, Comment } from '../types';
import { ChevronLeft, Loader2 } from 'lucide-react';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const courseData = await getCourseById(id);
        if (!courseData) {
          setError('No se encontró el curso');
          return;
        }
        
        setCourse(courseData);
        
        // Fetch comments
        const commentsData = await getCourseComments(id);
        setComments(commentsData);
      } catch (err) {
        setError('Error al cargar los detalles del curso');
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const handleCommentAdded = async () => {
    if (!id) return;
    
    try {
      const commentsData = await getCourseComments(id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error refreshing comments:', error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={goBack}
        className="flex items-center text-[#851539] hover:text-[#6A102E] mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Volver a la búsqueda
      </button>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-[#851539] animate-spin mb-4" />
          <p className="text-gray-600">Cargando detalles del curso...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-[#851539] text-white rounded-md hover:bg-[#6A102E]"
          >
            Volver a la búsqueda
          </button>
        </div>
      ) : course ? (
        <CourseDetails 
          course={course} 
          comments={comments}
          onCommentAdded={handleCommentAdded}
        />
      ) : null}
    </div>
  );
};

export default CourseDetailsPage;