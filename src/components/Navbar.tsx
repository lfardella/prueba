import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Safeguard: only treat as logged-in if user.name exists
  const isLoggedIn = Boolean(user?.name);
  const firstName = user?.name?.split(' ')[0] ?? '';
  console.log(user?.id)

  return (
    <nav className="bg-gradient-to-r from-[#851539] to-[#233A6C] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Cursos UC</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Explorar
            </Link>
            <Link
              to="/chatbot"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/chatbot'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              Asistente
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center ml-4">
                <Link
                  to="/profile"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/profile'
                      ? 'bg-white/20 text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <UserIcon className="h-4 w-4 mr-1" />
                  {firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white ml-2"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white"
              >
                <UserIcon className="h-4 w-4 mr-1" />
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#851539]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar
            </Link>
            <Link
              to="/chatbot"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/chatbot'
                  ? 'bg-white/20 text-white'
                  : 'text-gray-200 hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Asistente
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/profile'
                      ? 'bg-white/20 text-white'
                      : 'text-gray-200 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 inline mr-2" />
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-white/10 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
