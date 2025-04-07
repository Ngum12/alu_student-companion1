
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Conversation, Message } from "@/types/chat";

const STORAGE_KEY = 'alu_chat_conversations';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');

  const initializeDefaultConversation = () => {
    const now = new Date();
    const defaultConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: Date.now(),
      createdAt: now,
      updatedAt: now,
      messages: [{
        id: "welcome",
        text: `# Welcome to ALU Student Companion\n\nI'm here to help! I'll remember our conversation and provide relevant context-aware responses. Feel free to ask any questions!`,
        isAi: true,
        timestamp: Date.now()
      }]
    };
    setConversations([defaultConversation]);
    setCurrentConversationId(defaultConversation.id);
    return defaultConversation;
  };

  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        if (parsed.length > 0) {
          setConversations(parsed);
          setCurrentConversationId(parsed[0].id);
        } else {
          initializeDefaultConversation();
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error("Failed to load previous conversations");
        initializeDefaultConversation();
      }
    } else {
      initializeDefaultConversation();
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const getCurrentConversation = (): Conversation => {
    const current = conversations.find(conv => conv.id === currentConversationId);
    if (!current && conversations.length > 0) {
      return conversations[0];
    }
    if (!current) {
      return initializeDefaultConversation();
    }
    return current;
  };

  const createNewConversation = () => {
    const now = new Date();
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      timestamp: Date.now(),
      createdAt: now,
      updatedAt: now
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleDeleteConversation = (convId: string) => {
    const remainingConversations = conversations.filter(conv => conv.id !== convId);
    setConversations(remainingConversations);
    
    if (convId === currentConversationId) {
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        createNewConversation();
      }
    }
    
    toast.success("Conversation deleted");
  };

  const updateConversation = (updatedConversation: Conversation) => {
    setConversations(prev => 
      prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
    );
  };

  const addMessageToConversation = (convId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          messages: [...conv.messages, message],
          timestamp: Date.now(),
          updatedAt: new Date()
        };
      }
      return conv;
    }));
  };

  const updateMessageInConversation = (convId: string, messageId: string, newText: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === messageId
              ? { ...msg, text: newText, timestamp: Date.now() }
              : msg
          ),
          updatedAt: new Date()
        };
      }
      return conv;
    }));
    toast.success("Message updated successfully");
  };

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    getCurrentConversation,
    createNewConversation,
    handleDeleteConversation,
    updateConversation,
    addMessageToConversation,
    updateMessageInConversation
  };
};
