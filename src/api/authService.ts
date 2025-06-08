// src/services/authService.ts
import axios from 'axios';
import { User } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE;

function mapUser(raw: any): User {
  return {
    id: String(raw.id ?? raw.user_id),
    name: raw.name,
    email: raw.email,
    // Asegúrate de usar el campo correcto que devuelve tu backend.
    // Si no existe, puedes inicializarlo en false.
    isVerified: raw.isVerified ?? raw.verified ?? false,
  };
}

// Iniciar sesión y guardar token
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const { data } = await axios.post<{ user: any; token: string }>(
    `${API_BASE}/auth/login`,
    { email, password }
  );
  localStorage.setItem('token', data.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  return mapUser(data.user);
};

// Registrar usuario (no guarda token automáticamente)
export const registerWithEmail = async (
  email: string,
  name: string,
  password: string
): Promise<User> => {
  const { data } = await axios.post<{ user: any }>(
    `${API_BASE}/auth/signup`,
    { email, name, password }
  );
  return mapUser(data.user);
};

// Verificar código de email (algunos backends devuelven token aquí)
export const verifyEmail = async (email: string, code: string): Promise<boolean> => {
  const { data } = await axios.post<{ token?: string }>(
    `${API_BASE}/auth/verify`,
    { email, code }
  );
  // Si el endpoint devuelve token, lo guardamos igual que en login
  if (data.token) {
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  return true;
};

// Obtener el usuario actual (o null si no hay token)
export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const { data } = await axios.get<{ user: any }>(`${API_BASE}/auth/profile`);
  return mapUser(data.user);
};

// Cerrar sesión
export const logout = async (): Promise<void> => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};
