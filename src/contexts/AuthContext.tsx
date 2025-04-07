
import { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types/auth";
import { useNavigate } from "react-router-dom";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!email.endsWith("@alustudent.com")) {
      throw new Error("Only @alustudent.com emails are allowed");
    }
    
    // Simulate API call
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      createdAt: new Date(),
      picture: null,
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true });
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!email.endsWith("@alustudent.com")) {
      throw new Error("Only @alustudent.com emails are allowed");
    }
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date(),
      picture: null,
    };
    
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthState({ user: null, isAuthenticated: false });
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!authState.user) return;
    
    const updatedUser = { ...authState.user, ...data };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setAuthState({ user: updatedUser, isAuthenticated: true });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
