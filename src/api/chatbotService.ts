// API services for chatbot interaction
import { ChatMessage } from '../types';

// Send message to chatbot
export const sendChatMessage = async (message: string): Promise<ChatMessage> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock chatbot response based on keywords in the message
  let botResponse = "No entiendo tu consulta. ¿Podrías reformularla?";
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ofg') || lowerMessage.includes('optativo')) {
    botResponse = "¡Buena elección buscar OFGs! Te recomiendo LET1000 (Literatura Contemporánea) que tiene excelentes evaluaciones de los estudiantes y una carga académica moderada.";
  } else if (lowerMessage.includes('ingeniería') || lowerMessage.includes('computación')) {
    botResponse = "Para cursos de ingeniería en computación, IIC2233 (Programación Avanzada) es muy valorado y proporciona habilidades fundamentales. Ten en cuenta que tiene una dificultad alta pero muy buenas evaluaciones.";
  } else if (lowerMessage.includes('fácil') || lowerMessage.includes('facil') || lowerMessage.includes('baja carga')) {
    botResponse = "Si buscas cursos con baja carga académica, te recomiendo explorar los OFGs del área de humanidades, como LET1000. Tienen buenas evaluaciones y generalmente menor carga de trabajo.";
  } else if (lowerMessage.includes('difícil') || lowerMessage.includes('dificil') || lowerMessage.includes('desafiante')) {
    botResponse = "Para un desafío académico, los cursos de Matemáticas como MAT1610 (Cálculo I) o cursos avanzados de ingeniería como IIC2233 suelen tener alta dificultad pero son muy valorados por su calidad educativa.";
  } else if (lowerMessage.includes('ayuda') || lowerMessage.includes('recomienda')) {
    botResponse = "Puedo ayudarte con recomendaciones de cursos. ¿Qué área de estudio te interesa? ¿Buscas cursos con baja carga académica o algo más desafiante?";
  }
  
  // Mock chatbot message
  return {
    id: Date.now().toString(),
    sender: 'bot',
    content: botResponse,
    timestamp: new Date().toISOString()
  };
};

// Get chat history
export const getChatHistory = async (): Promise<ChatMessage[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock chat history
  return [
    {
      id: '1',
      sender: 'user',
      content: '¿Qué OFGs me recomiendas?',
      timestamp: '2023-08-10T15:30:00Z'
    },
    {
      id: '2',
      sender: 'bot',
      content: '¡Buena elección buscar OFGs! Te recomiendo LET1000 (Literatura Contemporánea) que tiene excelentes evaluaciones de los estudiantes y una carga académica moderada.',
      timestamp: '2023-08-10T15:30:05Z'
    }
  ];
};