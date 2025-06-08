import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Mail, AlertCircle, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, register, verify, error } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setFormError(null);
  };

  const validateEmail = (email: string) => {
    {/* if (!email.toLowerCase().endsWith('@uc.cl')) {
      return 'Debes usar tu correo UC (@uc.cl) para ingresar';
    } */}
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    const emailError = validateEmail(email);
    if (emailError) {
      setFormError(emailError);
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        await register(email, name, password);
        setNeedsVerification(true);
      }
    } catch (err: any) {
      console.error('Error en autenticación:', {
        status: err.response?.status,
        data: err.response?.data,
      });
     // Si estamos en login y el backend responde 404 → usuario no existe
     if (isLogin && err.response?.status === 401) {
       setFormError('No existe una cuenta asociada a ese correo. Por favor regístrate.');
     } 
          else if (!isLogin && err.response?.status === 500) {
      setFormError(
        'Ya existe una cuenta asociada a ese correo. Intenta iniciar sesión.'
      );
      }
else {
       setFormError(error || 'Ocurrió un error. Por favor, intenta nuevamente.');
     }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!verificationCode) {
      setFormError('Por favor, ingresa el código de verificación');
      return;
    }
    
    setLoading(true);
    try {
      await verify(email, verificationCode);
      navigate('/');
    } catch (err: any) {
      console.error('Error en verificación:', {
        status: err.response?.status,
        data: err.response?.data,
      });
      setFormError(error || 'Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  if (needsVerification) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#851539] text-white mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Verificación</h2>
            <p className="text-gray-600 mt-2">Hemos enviado un código a tu correo UC</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}
            
            <form onSubmit={handleVerify}>
              <div className="mb-6">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificación
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#851539] focus:border-[#851539]"
                  placeholder="Ingresa el código de 6 dígitos"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Ingresa el código de verificación que enviamos a {email}
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-[#851539] text-white rounded-md ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6A102E]'
                }`}
              >
                {loading ? 'Verificando...' : 'Verificar Cuenta'}
              </button>
            </form>
            
            <p className="text-center mt-4 text-sm text-gray-600">
              ¿No recibiste el código? Para esta demostración, usa <span className="font-medium">123456</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#851539] text-white mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin 
              ? 'Ingresa con tu cuenta de Cursos UC' 
              : 'Regístrate para acceder a todas las funcionalidades'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          {formError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo UC
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#851539] focus:border-[#851539]"
                    placeholder="nombreapellido@uc.cl"
                    required
                  />
                </div>
              </div>
              
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#851539] focus:border-[#851539]"
                      placeholder="Nombre Apellido"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#851539] focus:border-[#851539]"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 bg-[#851539] text-white rounded-md ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#6A102E]'
                }`}
              >
                {loading 
                  ? (isLogin ? 'Iniciando sesión...' : 'Registrando...') 
                  : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin 
                ? '¿No tienes una cuenta?' 
                : '¿Ya tienes una cuenta?'} {' '}
              <button
                type="button"
                onClick={handleToggleForm}
                className="text-[#851539] hover:text-[#6A102E] font-medium"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
