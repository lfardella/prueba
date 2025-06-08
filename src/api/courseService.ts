import { Course, Comment, ApiCourse, ApiComment } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

function mapApiCourse(c: ApiCourse): Course {
  return {
    id: String(c.course_id),
    code: c.initials,
    name: c.name,
    description: c.description,
    requirements: c.requirements ? c.requirements.split(',').map((r: string) => r.trim()) : [],
    semesters: c.term ? c.term.split(',').map((s: string) => s.trim()) : [],
    hasLabs: false,          
    hasWorkshops: false,    
    hasTASessions: false,   
    sections: 4,            
    professors: [`Juan Pérez`, `Catalina López`],          
    availableSpots: 100,      
    category: c.program ?? '',    
    difficulty: 4,          
    averageRating: 4.4,       
    totalRatings: 0,        
    area: ''                
  };
}

export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_BASE}/courses/all`)
  if (!res.ok) throw new Error(`Error ${res.status} al obtener cursos`)
  const { data } = await res.json()
  // Print the courses
  console.log('Courses:', data);
  return data.map(mapApiCourse)
}

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await fetch(`${API_BASE}/courses/${id}`)
  if (!res.ok) throw new Error(`Error ${res.status} al obtener curso ${id}`)
  const { data } = await res.json()
  return mapApiCourse(data[0] ?? data)
}

export const getCourseComments = async (courseId: string): Promise<Comment[]> => {
  const res = await fetch(`${API_BASE}/comments/course/${courseId}`);
  if (!res.ok)
    throw new Error(`Error ${res.status} al obtener comentarios del curso ${courseId}`);
  const { data } = await res.json();
  return data.map((c: ApiComment) => ({
    id: String(c.comment_id),
    userId: String(c.user_id),
    courseId: String(c.course_id),
    content: c.description,
    rating: c.rating,
    difficulty: c.difficulty,
    professor: c.professor,
    isActive: c.is_active,
    lastUpdated: c.last_updated,
    createdAt: c.created_at,
    userName: c.user_name // assuming API returns this field
  }));
};

export const addCourseComment = async (
  courseId: string,
  userId: string,
  userName: string,
  content: string | undefined,
  rating: number,
  difficulty: number
): Promise<Comment> => {
  const payload = {
    course_id: courseId,
    user_id: userId,
    description: content,
    rating,
    difficulty
  };

  const res = await fetch(`${API_BASE}/comments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      `Error ${res.status} al crear comentario: ${
        errData.message || res.statusText
      }`
    );
  }

  const { data } = await res.json();
  return {
    id: String(data.comment_id),
    userId: String(data.user_id),
    courseId: String(data.course_id),
    content: data.description,
    rating: data.rating,
    difficulty: data.difficulty,
    // isActive: data.is_active,
    createdAt: data.created_at,
    // lastUpdated: data.last_updated,
    userName: userName
  };
};

// Edit comment
export const editComment = async (
  commentId: string,
  content: string | undefined,
  rating: number,
  difficulty: number
): Promise<Comment> => {
  const payload = {
    description: content,
    rating,
    difficulty
  };

  const res = await fetch(`${API_BASE}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      `Error ${res.status} al editar comentario: ${
        errData.message || res.statusText
      }`
    );
  }

  const { data } = await res.json();
  return {
    id: String(data.comment_id),
    userId: String(data.user_id),
    courseId: String(data.course_id),
    content: data.description,
    rating: data.rating,
    difficulty: data.difficulty,
    //isActive: data.is_active,
    createdAt: data.created_at,
    //lastUpdated: data.last_updated,
    userName: data.user_name
  };
};

// Delete comment (soft delete)
export const deleteComment = async (commentId: string): Promise<boolean> => {
  // 1) Recupera el token
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token disponible para autenticar la petición');
  }

  // 2) Incluye el header Authorization
  const res = await fetch(
    `${API_BASE}/comments/delete/${commentId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(
      `Error ${res.status} al eliminar comentario: ${errData.message || res.statusText}`
    );
  }

  return true;
};

export const getCommentsByUser = async (userId: string): Promise<Comment[]> => {
  const res = await fetch(`${API_BASE}/comments/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      // no requiere Authorization según la spec
    }
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} al obtener comentarios del usuario ${userId}`);
  }

  const json = await res.json();
  return (json.data ?? json).map((c: any) => ({
    id: String(c.comment_id ?? c.id),
    userId: String(c.user_id),
    userName: c.user_name ?? 'Anónimo',
    courseId: String(c.course_id),
    content: c.description  ?? '',   // ahora sí vendrá aquí
    rating: c.rating,
    difficulty: c.difficulty,
    createdAt: c.created_at ?? c.createdAt
  }));
};

// Get BuscaCursos URL for a course
export const getBuscaCursosUrl = (courseCode: string): string => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const semester = currentMonth < 6 ? '1' : '2';
  return `https://buscacursos.uc.cl/?cxml_semestre=${currentYear}-${semester}&cxml_sigla=${courseCode}#resultados`;
};

// Search courses based on query and filters
export const searchCourses = async (
  query: string,
  filters: { area?: string; difficulty?: number; rating?: number }
): Promise<Course[]> => {
  const allCourses = await getCourses();
  const lowerQuery = query.toLowerCase();

  return allCourses.filter(course => {
    const matchesQuery =
      course.code.toLowerCase().includes(lowerQuery) ||
      course.name.toLowerCase().includes(lowerQuery);
    const matchesArea = !filters.area || course.area === filters.area;
    const matchesDifficulty =
      !filters.difficulty || course.difficulty === filters.difficulty;
    const matchesRating =
      !filters.rating || course.averageRating >= filters.rating;

    return matchesQuery && matchesArea && matchesDifficulty && matchesRating;
  });
};
