import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CourseList as CourseListType } from '../types';
import { getUserCourseLists, createCourseList, deleteCourseList, removeCourseFromList } from '../api/userService';
import { getCourseById } from '../api/courseService';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCourseLists: React.FC = () => {
  const { user } = useAuth();
  const [courseLists, setCourseLists] = useState<CourseListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState('');
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [courseDetails, setCourseDetails] = useState<Record<string, Course>>({});
  const [deletingList, setDeletingList] = useState<string | null>(null);
  const [removingCourse, setRemovingCourse] = useState<{ [key: string]: boolean }>({});

  

  useEffect(() => {
    const fetchLists = async () => {
      if (!user) return;
      console.log('📡 Fetching course lists for user:', user.id);
      
      setLoading(true);
      try {
        const lists = await getUserCourseLists(user.id);
        console.log('✅ Received course lists:', lists);
        setCourseLists(lists);
        
        // Fetch course details for each course in the lists
        const courseIds = new Set<string>();
        lists.forEach(list => {
          list.courses.forEach(courseId => {
            courseIds.add(courseId);
          });
        });
        
        const courseDetailsObj: Record<string, Course> = {};
        for (const courseId of courseIds) {
          const course = await getCourseById(courseId);
          if (course) {
            courseDetailsObj[courseId] = course;
          }
        }
        
        setCourseDetails(courseDetailsObj);
      } catch (error) {
        console.error('Error fetching course lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newListName.trim()) return;
    
    try {
      const newList = await createCourseList(user.id, newListName);
      setCourseLists([...courseLists, newList]);
      setNewListName('');
      setShowNewListForm(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    setDeletingList(listId);
    try {
      await deleteCourseList(listId);
      setCourseLists(courseLists.filter(list => list.id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
    } finally {
      setDeletingList(null);
    }
  };

  const handleRemoveCourse = async (listId: string, courseId: string) => {
  const key = `${listId}_${courseId}`;
  setRemovingCourse(prev => ({ ...prev, [key]: true }));
  try {
    // Llamamos al endpoint PUT /lists/:id?remove=true
    const updatedList = await removeCourseFromList(listId, courseId);
    // Actualizamos el estado local de courseLists:
    setCourseLists(prev =>
      prev.map(list =>
        list.id === listId ? updatedList : list
      )
    );
  } catch (error) {
    console.error('Error al eliminar curso de la lista:', error);
  } finally {
    setRemovingCourse(prev => ({ ...prev, [key]: false }));
  }
};


  if (!user) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus listas de cursos.</p>
        <Link
          to="/login"
          className="inline-block px-4 py-2 bg-[#851539] text-white rounded-md hover:bg-[#6A102E] transition-colors"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mis Listas de Cursos</h2>
          
          <button
            onClick={() => setShowNewListForm(!showNewListForm)}
            className="flex items-center px-3 py-2 bg-[#851539] text-white rounded-md hover:bg-[#6A102E] transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Nueva Lista
          </button>
        </div>
        
        {showNewListForm && (
          <form onSubmit={handleCreateList} className="mb-6 p-4 bg-gray-50 rounded-md">
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Lista
            </label>
            <div className="flex">
              <input
                type="text"
                id="listName"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-[#851539] focus:border-[#851539]"
                placeholder="Ej: Favoritos para el próximo semestre"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#851539] text-white rounded-r-md hover:bg-[#6A102E]"
              >
                Crear
              </button>
            </div>
          </form>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-[#851539] animate-spin" />
            <span className="ml-2 text-gray-600">Cargando tus listas...</span>
          </div>
        ) : courseLists.length > 0 ? (
          <div className="space-y-6">
            {courseLists.map((list) => (
              <div key={list.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">{list.name}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-3">
                      {list.courses.length} {list.courses.length === 1 ? 'curso' : 'cursos'}
                    </span>
                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={deletingList === list.id}
                    >
                      {deletingList === list.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {list.courses.length > 0 ? (
                    <div className="space-y-3">
                  {list.courses.map((courseId) => {
                    const course = courseDetails[courseId];
                    const key = `${list.id}_${courseId}`;
                    return course ? (
                      <div key={courseId} className="flex justify-between items-center bg-white p-3 rounded-md border border-gray-200 hover:border-[#851539] transition-colors">
                        <Link to={`/course/${courseId}`} className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{course.code} - {course.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Dificultad: {course.difficulty}/5
                              </p>
                            </div>
                            <div className="flex items-center bg-[#851539] text-white px-2 py-1 rounded">
                              <span className="text-sm font-medium">{course.averageRating.toFixed(1)}</span>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => handleRemoveCourse(list.id, courseId)}
                          disabled={removingCourse[key]}
                          className="ml-4 text-red-500 hover:text-red-700 p-1"
                          title="Eliminar curso de la lista"
                        >
                          { removingCourse[key] 
                              ? <Loader2 className="h-4 w-4 animate-spin" /> 
                              : <Trash2 className="h-4 w-4" /> 
                          }
                        </button>
                      </div>
                    ) : (
                          <div key={courseId} className="p-3 rounded-md border border-gray-200">
                            <p className="text-gray-500">Cargando información del curso...</p>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-4">
                      Esta lista está vacía. Agrega cursos desde la página de detalles de curso.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">Aún no has creado ninguna lista de cursos.</p>
            <p className="text-gray-500">
              Crea tu primera lista para guardar cursos interesantes y organizarlos para la toma de ramos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCourseLists;