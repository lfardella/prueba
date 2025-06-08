import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface CommentFormProps {
  initialValues?: {
    content?: string;
    rating?: number;
    difficulty?: number;
  };
  onSubmit: (values: { content?: string; rating: number; difficulty: number }) => void;
  isEditing?: boolean;

  // new:
  onCancel?: () => void;
  loading?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false,
  onCancel,
  loading = false,
}) => {
  const [content, setContent] = useState(initialValues?.content || '');
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [difficulty, setDifficulty] = useState(initialValues?.difficulty || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || difficulty === 0) {
      setError('Debes dejar una valoración y dificultad para publicar un comentario.');
      return;
    }
    setError(null);
    onSubmit({ content: content.trim() || undefined, rating, difficulty });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Valoración */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Valoración
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-gray-400 p-1 focus:outline-none"
              disabled={loading}
            >
              <Star
                className={`h-8 w-8 ${
                  (hoverRating ? value <= hoverRating : value <= rating)
                    ? 'fill-[#F0B323] text-[#F0B323]'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Dificultad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dificultad
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(Number(e.target.value))}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#851539] focus:border-[#851539]"
          disabled={loading}
        >
          <option value={0}>Selecciona la dificultad</option>
          <option value={1}>Muy Fácil</option>
          <option value={2}>Fácil</option>
          <option value={3}>Moderado</option>
          <option value={4}>Difícil</option>
          <option value={5}>Muy Difícil</option>
        </select>
      </div>

      {/* Comentario */}
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentario (opcional)
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#851539] focus:border-[#851539]"
          placeholder="Comparte tu experiencia con este curso..."
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#851539] text-white rounded-md hover:bg-[#6A102E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#851539]"
        >
          {loading
            ? isEditing
              ? 'Guardando...'
              : 'Publicando...'
            : isEditing
            ? 'Guardar Cambios'
            : 'Publicar Comentario'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
