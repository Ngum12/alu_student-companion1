
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C]">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6]">
              <div className="text-2xl font-bold text-white">ALU</div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Join ALU Student Companion
            </h2>
            <p className="text-gray-300 mb-6">
              Create an account to access your personalized learning assistant
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-white mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@alustudent.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#1A1F2C]/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-white mb-2">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-[#1A1F2C]/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-white mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#1A1F2C]/50 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-[#9b87f5] to-[#8B5CF6] hover:from-[#8B5CF6] hover:to-[#9b87f5] text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
            <div className="text-center space-y-4">
              <p className="text-white">
                Already have an account?{" "}
                <Link to="/login" className="text-[#9b87f5] hover:underline">
                  Sign in
                </Link>
              </p>
              <div className="text-sm text-gray-400 space-y-2">
                <p>The ALU Student Companion helps you with:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    📚 Academic support & resources
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    📅 Schedule management
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    📝 Assignment guidance
                  </div>
                  <div className="p-2 rounded bg-white/5 border border-white/10">
                    🤝 Connect with departments
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="py-4 text-center text-gray-400 text-sm">
        <p>African Leadership University Student Companion</p>
      </div>
    </div>
  );
}
