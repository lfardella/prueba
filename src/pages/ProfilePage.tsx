import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Comment } from '../types'
import {
  getCourseById,
  editComment,
  deleteComment,
  getCommentsByUser
} from '../api/courseService'
import UserCourseLists from '../components/UserCourseLists'
import CommentForm from '../components/CommentForm'
import {
  Star,
  MessageSquare,
  ListChecks,
  Edit2,
  Trash2,
  X as XIcon
} from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'lists' | 'comments'>('lists')
  const [userComments, setUserComments] = useState<(Comment & { courseName: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    ;(async () => {
      setLoading(true)
      try {
        const comments = await getCommentsByUser(user.id)
        const withNames = await Promise.all(
          comments.map(async c => {
            const course = await getCourseById(c.courseId)
            return {
              ...c,
              courseName: course
                ? `${course.code} - ${course.name}`
                : 'Curso no encontrado'
            }
          })
        )
        setUserComments(withNames)
      } catch (err) {
        console.error('Error loading user comments:', err)
      } finally {
        setLoading(false)
      }
    })()
  }, [user, navigate])

  const handleEdit = async (
    commentId: string,
    values: { content?: string; rating: number; difficulty: number }
  ) => {
    setEditLoading(true)
    try {
      const updated = await editComment(
        commentId,
        values.content,
        values.rating,
        values.difficulty
      )
      setUserComments(prev =>
        prev.map(c => (c.id === commentId ? { ...c, ...updated } : c))
      )
      setEditingCommentId(null)
    } catch (err) {
      console.error('Error editing comment:', err)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      return
    }
    try {
      await deleteComment(commentId)
      setUserComments(prev => prev.filter(c => c.id !== commentId))
    } catch (err) {
      console.error('Error deleting comment:', err)
    }
  }

  if (!user) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
      <p className="text-gray-600 mb-8">{user.email}</p>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('lists')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'lists'
                  ? 'border-[#851539] text-[#851539]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ListChecks className="inline-block mr-2 h-5 w-5" />
              Mis Listas
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-[#851539] text-[#851539]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="inline-block mr-2 h-5 w-5" />
              Mis Comentarios
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'lists' ? (
            <UserCourseLists />
          ) : loading ? (
            <p className="text-center text-gray-500">Cargando comentarios...</p>
          ) : userComments.length === 0 ? (
            <p className="text-center text-gray-500">
              Aún no has dejado ningún comentario
            </p>
          ) : (
            <div className="space-y-6">
              {userComments.map(comment => (
                <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                  {editingCommentId === comment.id ? (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-800">{comment.courseName}</h3>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <CommentForm
                        initialValues={{
                          content: comment.content,
                          rating: comment.rating,
                          difficulty: comment.difficulty
                        }}
                        isEditing
                        loading={editLoading}
                        onCancel={() => setEditingCommentId(null)}
                        onSubmit={values => handleEdit(comment.id, values)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-800">{comment.courseName}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCommentId(comment.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 mr-1" />
                          <span className="font-medium">{comment.rating}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Dificultad: {comment.difficulty}/5
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {comment.content || '— sin comentario —'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('es-CL')}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
