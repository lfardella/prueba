import { CourseList } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

// Obtener todas las listas de un usuario
export const getUserCourseLists = async (userId: string): Promise<CourseList[]> => {
  const res = await fetch(`${API_BASE}/lists/user/${userId}`, {
  //const res = await fetch(`${API_BASE}/lists/5`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error(`Error ${res.status} al obtener listas del usuario ${userId}`);

  const json = await res.json();
  const maybeData = json.data ?? json;
  const rawLists: any[] = Array.isArray(maybeData) ? maybeData : [maybeData];

  return rawLists.map((l: any) => ({
    id: String(l.list_id ?? l.id),
    userId: String(l.user_id ?? l.userId),
    name: l.name,
    courses: Array.isArray(l.courses) ? l.courses.map(String) : [],
    createdAt: l.created_at ?? l.createdAt
  }));
};

// Obtener lista por ID
export const getCourseListById = async (listId: string): Promise<CourseList> => {
  const res = await fetch(`${API_BASE}/lists/${listId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error(`Error ${res.status} al obtener lista ${listId}`);

  const json = await res.json();
  const data = json.data ?? json;
  return {
    id: String(data.list_id ?? data.id),
    userId: String(data.user_id ?? data.userId),
    name: data.name,
    courses: Array.isArray(data.courses) ? data.courses.map(String) : [],
    createdAt: data.created_at ?? data.createdAt
  };
};

// Crear una nueva lista de cursos
export const createCourseList = async (
  userId: string,
  name: string
): Promise<CourseList> => {
  const payload = { user_id: userId, name };
  const res = await fetch(`${API_BASE}/lists/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`Error ${res.status} al crear lista: ${errData.message || res.statusText}`);
  }

  const json = await res.json();
  const data = json.data ?? json;
  return {
    id: String(data.list_id),
    userId: String(data.user_id),
    name: data.name,
    courses: Array.isArray(data.courses) ? data.courses.map(String) : [],
    createdAt: data.created_at
  };
};

// Añadir un curso a la lista usando PUT /lists/:id
export const addCourseToList = async (
  listId: string,
  courseId: string
): Promise<CourseList> => {
  // 1) Traer la lista actual
  const current = await getCourseListById(listId);

  // 2) Construir el nuevo arreglo de cursos (evitando duplicados)
  const updatedCourses = current.courses.includes(courseId)
    ? current.courses
    : [...current.courses, courseId];

  // 3) Preparar payload con todos los campos requeridos
  const payload = {
    user_id: current.userId,
    name: current.name,
    courses: updatedCourses
  };

  // 4) Enviar PUT con el objeto completo
  const res = await fetch(`${API_BASE}/lists/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      `Error ${res.status} al actualizar lista: ${errData.message || res.statusText}`
    );
  }

  // 5) Refetch para devolver la versión definitiva
  return getCourseListById(listId);
};


// Eliminar curso de la lista usando PUT /lists/:id con flag remove
export const removeCourseFromList = async (
  listId: string,
  courseId: string
): Promise<CourseList> => {
  // 1) Traer la lista actual
  const current = await getCourseListById(listId);

  // 2) Filtrar el curso que queremos eliminar
  const remainingCourses = current.courses.filter(id => id !== courseId);

  // 3) Construir payload con todos los campos de la lista
  const payload = {
    user_id: current.userId,
    name: current.name,
    courses: remainingCourses
  };

  // 4) Enviar PUT con el objeto completo
  const res = await fetch(`${API_BASE}/lists/${listId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(
      `Error ${res.status} al actualizar lista: ${errData.message || res.statusText}`
    );
  }

  // 5) Refetch para devolver la versión definitiva
  return getCourseListById(listId);
};

// Eliminar lista de cursos (DELETE /lists/delete/:id)
export const deleteCourseList = async (listId: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/lists/delete/${listId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!res.ok) throw new Error(`Error ${res.status} al eliminar lista ${listId}`);
  return true;
};
