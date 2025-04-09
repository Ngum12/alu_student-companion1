import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { ChevronLeft, Settings, Trash2, User, X, Database } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}
export const ConversationSidebar = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation
}: ConversationSidebarProps) => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  const handleClearChat = () => {
    const conversation = conversations.find(conv => conv.id === currentConversationId);
    if (conversation) {
      conversation.messages = [{
        id: "welcome",
        text: `# Welcome to ALU Student Companion\n\nI'm here to help! I'll remember our conversation and provide relevant context-aware responses. Feel free to ask any questions!`,
        isAi: true,
        timestamp: Date.now()
      }];
      toast.success("Chat cleared successfully");
    }
  };
  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.messages.length <= 1) return "New Chat";
    const firstUserMessage = conversation.messages.find(msg => !msg.isAi);
    if (!firstUserMessage) return "New Chat";
    return firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
  };
  const handleDeleteConversation = (convId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteConversation(convId);
  };
  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  return <div className={`fixed left-0 top-0 h-full ${sidebarWidth} bg-[#202123] p-2 border-r border-gray-700 flex flex-col z-50 transition-all duration-300`}>
      
      
      <div className="absolute -right-4 top-2">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-full bg-[#202123] hover:bg-[#40414f] w-8 h-8">
          <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-2">
        {!isCollapsed}
        
        <button onClick={onNewChat} className={`w-full p-3 mb-2 bg-[#40414f] hover:bg-[#4f505f] rounded-lg text-left flex items-center gap-2 ${isCollapsed ? 'justify-center' : ''}`}>
          {isCollapsed ? '+' : <span>+ New Chat</span>}
        </button>

        <div className="space-y-2">
          {conversations.map(conv => <div key={conv.id} className="group relative">
              <button onClick={() => onSelectConversation(conv.id)} className={`w-full p-3 rounded-lg text-left truncate hover:bg-[#40414f] ${conv.id === currentConversationId ? 'bg-[#40414f]' : ''} ${isCollapsed ? 'justify-center' : ''}`}>
                {isCollapsed ? '💬' : getConversationTitle(conv)}
              </button>
              {!isCollapsed && <Button variant="ghost" size="icon" onClick={e => handleDeleteConversation(conv.id, e)} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:bg-[#40414f]">
                  <X className="h-4 w-4" />
                </Button>}
            </div>)}
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-700 pt-2 sticky bottom-0 bg-[#202123]">
        
        <button onClick={() => navigate('/profile')} className={`w-full p-3 text-left hover:bg-[#40414f] rounded-lg flex items-center gap-2 text-gray-300 ${isCollapsed ? 'justify-center' : ''}`}>
          <User className="h-4 w-4" />
          {!isCollapsed && <span>{user?.name || 'Profile'}</span>}
        </button>
        <button onClick={() => navigate('/settings')} className={`w-full p-3 text-left hover:bg-[#40414f] rounded-lg flex items-center gap-2 text-gray-300 ${isCollapsed ? 'justify-center' : ''}`}>
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>;
};