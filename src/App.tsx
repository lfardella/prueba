import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { ChatbotProvider } from './context/ChatbotContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <ChatbotProvider>
            <div className="min-h-screen bg-gray-100 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/course/:id" element={<CourseDetailsPage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                </Routes>
              </main>
              <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-semibold">Cursos UC</h3>
                      <p className="text-sm text-gray-300">Plataforma desarrollada por y para estudiantes UC</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                      <p className="text-sm text-gray-300">© {new Date().getFullYear()} Cursos UC</p>
                      <p className="text-xs text-gray-400 mt-1">Todos los derechos reservados</p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </ChatbotProvider>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;