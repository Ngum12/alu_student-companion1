
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Brain, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const BackendStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const useLocalBackend = localStorage.getItem('USE_LOCAL_BACKEND') === 'true';
  const connectionChecked = useRef(false);
  
  // Get backend URL with efficient caching
  const getBackendUrl = () => {
    // Check if a BACKEND_URL is set in localStorage (for testing)
    const storedBackendUrl = localStorage.getItem('BACKEND_URL');
    if (storedBackendUrl) return storedBackendUrl;
    
    // Local development mode
    if (useLocalBackend) return "http://localhost:8000";
    
    // Production deployment URL
    return "https://alu-chatbot-backend.onrender.com";
  };

  useEffect(() => {
    // Prevent multiple connection checks on component remount
    if (connectionChecked.current) return;
    
    const checkConnection = async () => {
      try {
        setIsLoading(true);
        const backendUrl = getBackendUrl();
        
        // Use a simple GET request instead of POST for faster checking
        const response = await fetch(`${backendUrl}/`, {
          method: "GET",
          // Reduced timeout for faster response
          signal: AbortSignal.timeout(5000)
        });
        
        setIsConnected(response.ok);
        if (!response.ok) {
          console.warn("ALU backend is not responding correctly");
        } else {
          // Use a less intrusive toast
          toast.success("Connected to ALU knowledge base", { duration: 2000 });
        }
        connectionChecked.current = true;
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setIsConnected(false);
        
        // Only show error toast on first attempt
        if (!isRetrying) {
          toast.error("Could not connect to ALU backend", { duration: 3000 });
        }
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    };

    // Only check connection if backend is being used
    if (window.location.hostname !== 'localhost' || useLocalBackend) {
      checkConnection();
    } else {
      setIsLoading(false);
    }
    
    // Set up periodic refresh in the background (every 60 seconds)
    const intervalId = setInterval(() => {
      if (window.location.hostname !== 'localhost' || useLocalBackend) {
        setIsRetrying(true);
        checkConnection();
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [useLocalBackend, isRetrying]);

  // Don't show anything if not using backend - improves performance
  if (!useLocalBackend && window.location.hostname === 'localhost') return null;

  return (
    <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2F3C] text-xs">
      {isLoading ? (
        <Server className="h-3 w-3 animate-pulse text-yellow-500" />
      ) : isConnected ? (
        <Brain className="h-3 w-3 text-green-500" />
      ) : (
        <Server className="h-3 w-3 text-red-500" />
      )}
      <span>
        {isLoading ? "Connecting..." : 
         isConnected ? "ALU Brain: Connected" : "ALU Backend: Disconnected"}
      </span>
    </Badge>
  );
};
