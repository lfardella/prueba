import React from 'react';
import UserCourseLists from '../components/UserCourseLists';

const MyCoursesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Listas de Cursos</h1>
        <p className="text-gray-600">
          Organiza los cursos que te interesan en listas personalizadas para facilitar tu planificación académica.
        </p>
      </div>
      
      <UserCourseLists />
      
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Consejos para organizar tus cursos</h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Crear listas organizadas puede ayudarte a planificar mejor tu trayectoria académica:
          </p>
          
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-medium">Crea listas por semestre</span> - Organiza los cursos que planeas tomar cada semestre para visualizar tu carga académica.</li>
            <li><span className="font-medium">Separa por categorías</span> - Crea listas para OFGs, cursos de especialidad, electivos, etc.</li>
            <li><span className="font-medium">Lista de pendientes</span> - Guarda cursos que te interesan para considerarlos en futuros semestres.</li>
            <li><span className="font-medium">Prioriza por dificultad</span> - Organiza cursos según su nivel de dificultad para balancear tu carga académica.</li>
          </ul>
          
          <p>
            Puedes agregar cursos a tus listas desde la página de detalles de cada curso haciendo clic en "Añadir a Mi Lista".
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;