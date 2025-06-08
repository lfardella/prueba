// src/components/CourseDetails.tsx

import React, { useState, useEffect } from 'react';
import { Course, Comment } from '../types';
import {
  ExternalLink,
  Users,
  Calendar,
  Book,
  Beaker,
  GraduationCap,
  CheckSquare,
  File,
  Trash2,
  Edit2,
  Check as CheckIcon,
  X as XIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addCourseToList, getUserCourseLists, getCourseListById } from '../api/userService';
import {
  getBuscaCursosUrl,
  addCourseComment,
  deleteComment,
  editComment as apiEditComment
} from '../api/courseService';
import CommentForm from './CommentForm';

interface CourseDetailsProps {
  course: Course;
  comments: Comment[];
  onCommentAdded: () => void;        // Callback para recargar comentarios
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  course,
  comments,
  onCommentAdded
}) => {
  const { user } = useAuth();
  const [showListModal, setShowListModal] = useState(false);
  const [userLists, setUserLists] = useState<{ id: string; name: string }[]>([]);
  const [selectedList, setSelectedList] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para edición de comentarios
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  


  // Añadir comentario
const handleAddComment = async (values: {
  content?: string;
  rating: number;
  difficulty: number;
}) => {
  if (!user) return;
  try {
    await addCourseComment(
      course.id,
      user.id,
      user.name,
      values.content,
      values.rating,
      values.difficulty
    );
    // oculto el formulario
    setShowCommentForm(false);
    onCommentAdded();
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};


  // Eliminar comentario
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este comentario?'))
      return;
    try {
      await deleteComment(commentId);
      onCommentAdded();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Iniciar edición
  const handleStartEdit = (commentId: string) => {
    setEditingCommentId(commentId);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingCommentId(null);
  };

  // Guardar edición
  const handleSaveEdit = async (
    commentId: string,
    values: { content?: string; rating: number; difficulty: number }
  ) => {
    setEditLoading(true);
    try {
      await apiEditComment(
        commentId,
        values.content,
        values.rating,
        values.difficulty
      );
      setEditingCommentId(null);
      onCommentAdded();
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setEditLoading(false);
    }
  };

  // Añadir curso a lista
const handleAddToList = async () => {
  if (!user || !selectedList) return;
  setLoading(true);
  setWarning(null);                    // limpiamos advertencia previa

  try {
    // 1) Traer la lista actual
    const list = await getCourseListById(selectedList);

    // 2) Chequear si el curso YA está
    if (list.courses.includes(course.id)) {
      setWarning('⚠️ Este curso ya está en la lista seleccionada.');
      return;
    }

    // 3) Si no existe, lo añadimos
    await addCourseToList(selectedList, course.id);
    setShowListModal(false);
  } catch (error) {
    console.error('Error adding course to list:', error);
  } finally {
    setLoading(false);
  }
};

  // Abrir modal de listas
  const openListModal = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const lists = await getUserCourseLists(user.id);
      setUserLists(lists.map((l) => ({ id: l.id, name: l.name })));
      setShowListModal(true);
    } catch (error) {
      console.error('Error fetching user lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToBuscaCursos = () => {
    window.open(getBuscaCursosUrl(course.code), '_blank');
  };

  const getDifficultyLabel = (level: number): string => {
    switch (level) {
      case 1:
        return 'Muy Fácil';
      case 2:
        return 'Fácil';
      case 3:
        return 'Moderado';
      case 4:
        return 'Difícil';
      case 5:
        return 'Muy Difícil';
      default:
        return 'Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{course.code} - {course.name}</h1>
          </div>
        </div>

        {/* Descripción y detalles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              <File className="h-5 w-5 mr-2 text-[#851539]" />
              Descripción
            </h2>
            <p className="text-gray-700">{course.description}</p>
            {course.requirements.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2 text-gray-800 flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2 text-[#851539]" />
                  Requisitos Previos
                </h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {course.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Detalles del Curso
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-[#851539]" />
                <span className="text-gray-700">
                  <span className="font-medium">Semestres:</span>{' '}
                  {course.semesters.join(', ')}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-[#851539]" />
                <span className="text-gray-700">
                  <span className="font-medium">Secciones:</span>{' '}
                  {course.sections} | <span className="font-medium">Vacantes:</span>{' '}
                  {course.availableSpots}
                </span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-3 text-[#851539]" />
                <span className="text-gray-700">
                  <span className="font-medium">Profesores:</span>{' '}
                  {course.professors.join(', ')}
                </span>
              </div>
              <div className="flex items-center">
                <Beaker className="h-5 w-5 mr-3 text-[#851539]" />
                <span className="text-gray-700">
                  <span className="font-medium">Incluye:</span>{' '}
                  {[
                    course.hasLabs ? 'Laboratorios' : null,
                    course.hasWorkshops ? 'Talleres' : null,
                    course.hasTASessions ? 'Ayudantías' : null
                  ]
                    .filter(Boolean)
                    .join(', ') || 'No incluye actividades prácticas'}
                </span>
              </div>
              <div className="flex items-center">
                <Book className="h-5 w-5 mr-3 text-[#851539]" />
                <span className="text-gray-700">
                  <span className="font-medium">Dificultad:</span>{' '}
                  {getDifficultyLabel(course.difficulty)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
          <button
            onClick={goToBuscaCursos}
            className="flex items-center justify-center px-4 py-2 bg-[#233A6C] text-white rounded-md hover:bg-[#1A2C53] transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver en Buscacursos UC
          </button>
          {user && (
            <button
              onClick={openListModal}
              className="flex items-center justify-center px-4 py-2 border border-[#851539] text-[#851539] rounded-md hover:bg-[#851539] hover:text-white transition-colors"
            >
              Añadir a Mi Lista
            </button>
          )}
        </div>

        {/* Comentarios */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Comentarios ({comments.length})
          </h3>

 {/* Formulario de nuevo comentario (se oculta tras publicar) */}
 {user && !editingCommentId && showCommentForm && (
   <div className="mb-6 bg-gray-50 rounded-lg p-6">
     <h4 className="text-lg font-medium mb-4">Deja tu opinión</h4>
     <CommentForm onSubmit={handleAddComment} />
   </div>
 )}

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">
                        {comment.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    {String(user?.id) === String(comment.userId) && (
                      <div className="flex space-x-2">
                        {editingCommentId === comment.id ? (
                          <>
                            <button
                              onClick={handleCancelEdit}
                              title="Cancelar"
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <XIcon className="h-4 w-4 text-gray-600" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(comment.id)}
                              title="Editar"
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Edit2 className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              title="Eliminar"
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

{editingCommentId === comment.id ? (
  <div className="mt-4 bg-gray-50 rounded-lg p-4">
    <CommentForm
      initialValues={{
        content: comment.content,
        rating: comment.rating,
        difficulty: comment.difficulty
      }}
      isEditing
      onSubmit={(values) =>
        handleSaveEdit(comment.id, values)
      }
      onCancel={handleCancelEdit}
      loading={editLoading}
    />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="text-sm">
                          <span className="font-medium">Valoración:</span>{' '}
                          {comment.rating}/5
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Dificultad:</span>{' '}
                          {getDifficultyLabel(comment.difficulty)}
                        </div>
                      </div>
                      {comment.content && (
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Aún no hay comentarios para este curso.
            </p>
          )}
        </div>
      </div>

      {/* Modal para listas */}
{showListModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-semibold mb-4">Añadir a Lista</h3>

      {warning && (
        <div className="mb-4 text-red-600 font-medium">
          {warning}
        </div>
      )}

      {userLists.length > 0 ? (
        <>
          <select
            value={selectedList}
            onChange={(e) => setSelectedList(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#851539] focus:border-[#851539] mb-4"
          >
            <option value="">Selecciona una lista</option>
            {userLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowListModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddToList}
                    disabled={!selectedList || loading}
                    className={`px-4 py-2 bg-[#851539] text-white rounded-md ${
                      !selectedList || loading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#6A102E]'
                    }`}
                  >
                    {loading ? 'Añadiendo...' : 'Añadir'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-700 mb-4">
                No tienes listas de cursos. Crea una primero desde "Mis Listas".
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
