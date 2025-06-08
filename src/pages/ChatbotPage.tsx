import React from 'react';
import ChatbotInterface from '../components/ChatbotInterface';

const ChatbotPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Asistente de Cursos UC</h1>
        <p className="text-gray-600">
          Obtén recomendaciones personalizadas y resuelve tus dudas sobre los cursos UC.
        </p>
      </div>
      
      <ChatbotInterface />
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">¿Cómo puedo usar el asistente?</h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            El asistente de Cursos UC puede ayudarte con:
          </p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li>Recomendaciones de cursos basadas en tus intereses y preferencias</li>
            <li>Información sobre la dificultad y carga académica de diferentes cursos</li>
            <li>Sugerencias de OFGs y electivos populares entre los estudiantes</li>
            <li>Consejos para la toma de ramos y el proceso de inscripción</li>
            <li>Respuestas a preguntas frecuentes sobre los cursos UC</li>
          </ul>
          
          <p>
            Simplemente escribe tu consulta en el chat y el asistente te responderá con información relevante y personalizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;