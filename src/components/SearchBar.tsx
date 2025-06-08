import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

type Filters = {
  difficulty?: number;
  rating?: number;
};

interface SearchBarProps {
  onSearch: (query: string, filters: Filters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: '',
    rating: '',
  });

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFilters(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedFilters = {
      difficulty: filters.difficulty ? parseInt(filters.difficulty) : undefined,
      rating: filters.rating ? parseInt(filters.rating) : undefined
    };
    
    onSearch(query, processedFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      difficulty: '',
      rating: '',
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#851539] focus:border-[#851539] sm:text-sm"
            placeholder="Buscar por código (sigla) o nombre del curso..."
            value={query}
            onChange={handleQueryChange}
          />
          <button
            type="button"
            onClick={toggleFilters}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                Dificultad
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#851539] focus:border-[#851539] sm:text-sm rounded-md"
              >
                <option value="">Cualquier dificultad</option>
                <option value="1">Muy Fácil</option>
                <option value="2">Fácil</option>
                <option value="3">Moderado</option>
                <option value="4">Difícil</option>
                <option value="5">Muy Difícil</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Valoración
              </label>
              <select
                id="rating"
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#851539] focus:border-[#851539] sm:text-sm rounded-md"
              >
                <option value="">Cualquier valoración</option>
                <option value="4">4+ estrellas</option>
                <option value="3">3+ estrellas</option>
                <option value="2">2+ estrellas</option>
                <option value="1">1+ estrellas</option>
              </select>
            </div>
            
            <div className="lg:col-span-3 flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#851539]"
              >
                Limpiar Filtros
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#851539] hover:bg-[#6A102E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#851539]"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;