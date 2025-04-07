import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader, CheckCircle, BookOpen, Calendar, FileText, Users, GraduationCap, 
         MapPin, Globe, ChevronRight, AlertCircle } from "lucide-react";

// Add validation for ALU student emails
const validateEmail = (email: string) => {
  return email.endsWith('@alustudent.com') || 
         email.endsWith('@alueducation.com');
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!validateEmail(email)) {
      toast.error("Please use your ALU student email");
      setIsLoading(false);
      return;
    }

    try {
      await signup(email, password, name);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero background with ALU campus image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C81]/90 to-[#0F4C81]/70 mix-blend-multiply" />
        <img 
          src="https://www.alueducation.com/wp-content/uploads/2023/01/alu-rwanda-campus.jpg" 
          alt="ALU Campus" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 flex-1 flex items-center justify-center">
        {/* Container for both columns with reduced gap */}
        <div className="container flex flex-col lg:flex-row items-center lg:items-stretch max-w-5xl mx-auto">
          {/* Left side - Value proposition - moved closer */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center pr-0 p-6">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-white p-2 rounded-lg">
                  <img 
                    src="https://www.alueducation.com/wp-content/uploads/2021/11/ALU-logo.png" 
                    alt="ALU Logo" 
                    className="h-7" 
                  />
                </div>
                <h1 className="text-xl font-bold text-white">Student Companion</h1>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  Your AI-powered guide <br />through the ALU journey
                </h2>
                <p className="mt-4 text-white/90 text-base max-w-md">
                  Join thousands of ALU students who use the Student Companion 
                  to navigate campus life, academic requirements, and university resources.
                </p>
                
                <div className="mt-6 grid grid-cols-1 gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 bg-white/10 p-1.5 rounded-full">
                      <CheckCircle className="h-4 w-4 text-[#FFC72C]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">24/7 Instant Answers</h3>
                      <p className="text-white/70 text-xs">Get immediate responses to your questions about ALU policies and procedures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 bg-white/10 p-1.5 rounded-full">
                      <CheckCircle className="h-4 w-4 text-[#FFC72C]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Academic Support</h3>
                      <p className="text-white/70 text-xs">Navigate course requirements, graduation pathways, and learning resources</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 bg-white/10 p-1.5 rounded-full">
                      <CheckCircle className="h-4 w-4 text-[#FFC72C]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Campus Navigation</h3>
                      <p className="text-white/70 text-xs">Find the right contacts, departments and support services across ALU</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex -space-x-3">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/men/86.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://randomuser.me/api/portraits/women/22.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#E94E1B] flex items-center justify-center text-white font-medium text-xs">
                  2K+
                </div>
              </div>
              <p className="text-white/90 text-sm">
                Ease the hard things we do with student companion
              </p>
            </div>
          </div>
          
          {/* Right side - Sign up form */}
          <div className="w-full lg:w-1/2 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 mx-auto">
              <div className="text-center lg:text-left mb-4">
                <h2 className="text-xl font-bold text-[#0F4C81]">
                  Create your account
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                  Join the ALU Student Companion community
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    ALU Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@alustudent.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-300 focus:ring-[#0F4C81] focus:border-[#0F4C81] h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Must be a valid ALU student or staff email
                  </p>
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="As it appears on your student ID"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-gray-300 focus:ring-[#0F4C81] focus:border-[#0F4C81] h-9"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:ring-[#0F4C81] focus:border-[#0F4C81] h-9"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 8 characters with letters and numbers
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="h-4 w-4 text-[#0F4C81] focus:ring-[#0F4C81] border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="/terms" className="text-[#0F4C81] hover:underline font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-[#0F4C81] hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full h-10 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Creating your account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Create Account</span>
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#E94E1B] hover:underline font-medium">
                    Sign in instead
                  </Link>
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-center text-xs uppercase text-black font-semibold tracking-wider mb-3">
                  What You'll Get Access To
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
                    <BookOpen className="h-4 w-4 text-[#0F4C81] mr-2" />
                    <span className="text-xs text-black">Course Resources</span>
                  </div>
                  <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
                    <Calendar className="h-4 w-4 text-[#0F4C81] mr-2" />
                    <span className="text-xs text-black">Important Dates</span>
                  </div>
                  <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
                    <FileText className="h-4 w-4 text-[#0F4C81] mr-2" />
                    <span className="text-xs text-black">ALU Policies</span>
                  </div>
                  <div className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
                    <Users className="h-4 w-4 text-[#0F4C81] mr-2" />
                    <span className="text-xs text-black">Department Contacts</span>
                  </div>
                </div>
                
                <div className="mt-4 px-3 py-2 bg-[#FFC72C]/10 rounded-lg border border-[#FFC72C]/30 flex items-center">
                  <GraduationCap className="h-5 w-5 text-[#E94E1B] mr-2 flex-shrink-0" />
                  <p className="text-xs text-black">
                    <span className="font-medium">Student exclusive:</span> Access is only available to verified ALU students and staff.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="relative z-10 bg-[#0F4C81] text-white py-2 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
          <div className="flex items-center space-x-4 mb-2 md:mb-0">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span>Kigali & Lagos Campuses</span>
            </div>
            <div className="flex items-center">
              <Globe className="h-3 w-3 mr-1" />
              <span>alueducation.com</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/support" className="hover:underline">Support</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}