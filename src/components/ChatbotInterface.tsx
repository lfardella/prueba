import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, User } from 'lucide-react';
import { useChatbot } from '../context/ChatbotContext';
import { ChatMessage } from '../types';

const ChatbotInterface: React.FC = () => {
  const { messages, loading, sendMessage } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userInput = input;
    setInput('');
    await sendMessage(userInput);
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-[#851539] to-[#233A6C] text-white py-3 px-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Bot className="h-5 w-5 mr-2" />
          Asistente de Cursos UC
        </h2>
        <p className="text-sm text-gray-200">
          Pregúntame sobre cursos, recomendaciones o consejos de inscripción
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-16 w-16 text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">
              ¡Hola! Soy el asistente de Cursos UC
            </h3>
            <p className="text-gray-500 max-w-sm mt-2">
              Puedo ayudarte a encontrar cursos, darte recomendaciones basadas en tus intereses y responder preguntas sobre la inscripción de cursos.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-md">
              <button
                onClick={() => sendMessage("¿Qué OFGs me recomiendas?")}
                className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                ¿Qué OFGs me recomiendas?
              </button>
              <button
                onClick={() => sendMessage("Busco cursos de ingeniería con baja carga")}
                className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                Cursos de ingeniería fáciles
              </button>
              <button
                onClick={() => sendMessage("Cursos con buenas evaluaciones")}
                className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                Cursos bien evaluados
              </button>
              <button
                onClick={() => sendMessage("¿Qué cursos son los más populares?")}
                className="text-sm px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                Cursos más populares
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message: ChatMessage) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                    message.sender === 'user' 
                      ? 'bg-[#851539] text-white rounded-br-none' 
                      : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 mr-1" />
                    ) : (
                      <Bot className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'Tú' : 'Asistente UC'}
                    </span>
                    <span className="text-xs ml-auto opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#851539] focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#851539] text-white px-4 py-2 rounded-r-md ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#6A102E]'
            }`}
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotInterface;