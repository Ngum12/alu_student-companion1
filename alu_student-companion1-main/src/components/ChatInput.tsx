
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Paperclip, X, Mic, MicOff } from "lucide-react";
import { useState, KeyboardEvent, useRef, useEffect, ChangeEvent } from "react";
import { toast } from "sonner";

interface ChatInputProps {
  onSend: (message: string, attachments: File[]) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setMessage(transcript);
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Error with speech recognition');
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening...');
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Error accessing microphone');
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSend(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files || []);
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      
      if (totalSize > 25 * 1024 * 1024) {
        toast.error("Total file size exceeds 25MB limit");
        return;
      }

      setAttachments(prev => [...prev, ...files]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#343541] p-4 border-t border-gray-700">
      <div className="max-w-3xl mx-auto">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-800 rounded px-3 py-1"
              >
                <span className="text-sm text-gray-300 truncate max-w-[150px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="icon"
            className="shrink-0"
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleListening}
            variant="ghost"
            size="icon"
            className={`shrink-0 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
            disabled={disabled}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="resize-none bg-[#40414f] border-gray-700 text-white min-h-[44px] max-h-[200px] overflow-y-auto"
            disabled={disabled}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={(!message.trim() && attachments.length === 0) || disabled}
            className="bg-[#19c37d] hover:bg-[#1a8870] shrink-0"
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-2">
        Free Research Preview. ALU Student Companion may produce inaccurate information.
      </div>
    </div>
  );
};
