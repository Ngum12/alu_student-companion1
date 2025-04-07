
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/settings";
import Documents from "./pages/documents";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MiniChatbot } from "./components/mini-chatbot/MiniChatbot";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <NextThemeProvider attribute="class" defaultTheme="dark">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/documents" element={<Documents />} />
          </Routes>
          <MiniChatbot />
          <Toaster position="top-center" richColors />
        </Router>
      </NextThemeProvider>
    </AuthProvider>
  );
}

export default App;
