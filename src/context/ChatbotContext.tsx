import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage, getChatHistory } from '../api/chatbotService';

interface ChatbotContextType {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await getChatHistory();
        setMessages(history);
      } catch (err) {
        setError('Error al cargar el historial del chat');
        console.error('Error loading chat history:', err);
      }
    };

    loadChatHistory();
  }, []);

  const sendMessage = async (content: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add user message to the chat
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Get bot response
      const botResponse = await sendChatMessage(content);
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      setError('Error al enviar el mensaje');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        loading,
        error,
        sendMessage,
        clearChat
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};