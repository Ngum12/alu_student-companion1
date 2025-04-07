
import { Message } from "@/types/chat";
import { ChatMessage } from "../ChatMessage";
import { Loader, Bot, Stars } from "lucide-react";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onEditMessage: (messageId: string, newText: string) => void;
  activeModel?: string;
}

export const ChatMessages = ({ messages, isLoading, onEditMessage, activeModel = "gemini" }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-300 px-4 bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C]">
        <div className="flex items-center justify-center w-20 h-20 mb-8 rounded-2xl bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6]">
          <div className="w-10 h-10 rounded-full border-2 border-current border-t-transparent animate-spin" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
          ALU Student Companion
        </h1>
        <div className="max-w-xl text-center space-y-6">
          <p className="text-lg text-gray-300">Welcome! How can I help you today?</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mx-auto">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h3 className="font-medium text-white mb-1">Academic Support</h3>
              <p className="text-sm">Get help with assignments, courses, and learning resources</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h3 className="font-medium text-white mb-1">Campus Services</h3>
              <p className="text-sm">Connect with departments, schedule appointments</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h3 className="font-medium text-white mb-1">Personal Growth</h3>
              <p className="text-sm">Career advice, skill development, and mentorship</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <h3 className="font-medium text-white mb-1">Event Planning</h3>
              <p className="text-sm">Stay updated on campus events and activities</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            I remember our conversations and provide context-aware responses to better assist you through your ALU journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C] min-h-screen">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message.text}
          isAi={message.isAi}
          attachments={message.attachments}
          onEdit={(newText) => onEditMessage(message.id, newText)}
        />
      ))}
      {isLoading && (
        <div className="py-6 px-8 text-gray-400">
          <div className="max-w-3xl mx-auto flex gap-4 items-start">
            <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6] animate-pulse mt-2" />
            <div className="flex-1">
              <div className="flex space-x-2 items-center">
                <div className="w-8 h-8">
                  {activeModel === 'deepseek' ? (
                    <Stars className="w-full h-full animate-pulse text-[#00a3ff]" />
                  ) : (
                    <Loader className="w-full h-full animate-spin text-[#9b87f5]" />
                  )}
                </div>
                <span className="text-sm text-gray-400">
                  {activeModel === 'deepseek' ? 
                    'DeepSeek AI is generating a response...' : 
                    'Gemini AI is thinking...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
