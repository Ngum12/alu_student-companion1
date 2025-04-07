import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BackendStatus } from "@/components/chat/BackendStatus";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Server,
  Database,
  BrainCircuit,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Terminal,
  RefreshCw,
  LineChart,
  Calendar,
  FileText,
  Save,
  AlertCircle,
  PlayCircle,
  CheckCircle,
  BarChart4,
  Zap,
  Gauge,
  Code,
  Lock,
  Table,
  Network,
  Webhook,
  Book,
  LibrarySquare,
  Layers,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";

// Feature access levels
type AccessLevel = "public" | "beta" | "admin" | "developer";

// Feature definition
type Feature = {
  id: string;
  name: string;
  description: string;
  access: AccessLevel;
  enabled: boolean;
  beta?: boolean;
  comingSoon?: boolean;
};

// Settings section props
type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

// Settings section component
const SettingsSection = ({ title, description, children, icon }: SettingsSectionProps) => (
  <Card className="mb-6 border-[#0F4C81]/20 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-[#0F4C81]/10">
      <div>
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#0F4C81]">
          {icon} {title}
        </CardTitle>
        <CardDescription className="mt-1">
          {description}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent className="pt-4">{children}</CardContent>
  </Card>
);

// Feature toggle component
const FeatureToggle = ({ 
  feature, 
  onToggle, 
  userRole, 
  onVisibilityChange 
}: { 
  feature: Feature; 
  onToggle: (id: string, enabled: boolean) => void;
  userRole: string;
  onVisibilityChange?: (id: string, access: AccessLevel) => void;
}) => {
  // Only show developer options to admin role
  const canManageVisibility = userRole === 'admin';
  const isAccessible = 
    feature.access === 'public' || 
    (feature.access === 'beta' && userRole !== 'student') ||
    (feature.access === 'admin' && userRole === 'admin') ||
    (feature.access === 'developer' && userRole === 'admin');

  if (!isAccessible && !canManageVisibility) return null;

  return (
    <div className={`flex items-center justify-between p-3 ${!isAccessible && canManageVisibility ? "opacity-60" : ""}`}>
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium">{feature.name}</span>
          {feature.beta && <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">BETA</Badge>}
          {feature.comingSoon && <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">COMING SOON</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </div>
      <div className="flex items-center gap-2">
        {canManageVisibility && onVisibilityChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {feature.access === 'public' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-2">
                <h4 className="font-medium">Visibility Setting</h4>
                <Select 
                  value={feature.access} 
                  onValueChange={(value) => onVisibilityChange(feature.id, value as AccessLevel)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Everyone)</SelectItem>
                    <SelectItem value="beta">Beta (Faculty+)</SelectItem>
                    <SelectItem value="admin">Admin Only</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Control who can see and use this feature
                </p>
              </div>
            </PopoverContent>
          </Popover>
        )}
        <Switch 
          checked={feature.enabled} 
          disabled={feature.comingSoon || (!isAccessible && !canManageVisibility)} 
          onCheckedChange={(checked) => onToggle(feature.id, checked)} 
          className="data-[state=checked]:bg-[#E94E1B]"
        />
      </div>
    </div>
  );
};

// Admin accounts configuration
const ADMIN_ACCOUNTS = [
  { email: "d.ngum@alustudent.com", password: "Ngum1123@" }
];

// ALU brand colors
const ALU_COLORS = {
  primary: "#0F4C81", // Deep blue
  secondary: "#E94E1B", // Orange
  accent: "#FFC72C", // Gold/Yellow
  success: "#2E7D32", // Green
  warning: "#FF9800", // Amber
  error: "#D32F2F", // Red
  neutral: "#334155", // Slate
};

export default function Settings() {
  // System settings
  const [geminiKey, setGeminiKey] = useState("");
  const [useLocalBackend, setUseLocalBackend] = useState(false);
  const [backendUrl, setBackendUrl] = useState("http://localhost:8000");
  const [userRole, setUserRole] = useState("student"); // student, faculty, admin
  const [theme, setTheme] = useState("system");
  const [performanceMetrics, setPerformanceMetrics] = useState<Record<string, number>>({
    responseTime: 0,
    tokenUsage: 0,
    successRate: 0,
    cachingEfficiency: 0
  });
  const [isTestingBackend, setIsTestingBackend] = useState(false);
  const [backendTestResult, setBackendTestResult] = useState<null | boolean>(null);
  const [systemStatus, setSystemStatus] = useState({
    backend: "operational",
    database: "operational",
    vector_store: "degraded",
    api: "operational"
  });
  const [modelParameters, setModelParameters] = useState({
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 1024,
    presencePenalty: 0.2,
    frequencyPenalty: 0.2,
  });
  
  // Knowledge base settings
  const [knowledgeSources, setKnowledgeSources] = useState<Record<string, boolean>>({
    financialInfo: true,
    academicPrograms: true,
    campusServices: true,
    admissions: true,
    graduation: true,
    housingInfo: false,
    facultyProfiles: false,
    courseDescriptions: false
  });
  
  // Features list with visibility controls
  const [features, setFeatures] = useState<Feature[]>([
    // Public features
    {
      id: "contextual_search",
      name: "Contextual Search",
      description: "Enhanced search with academic context awareness",
      access: "public",
      enabled: true
    },
    {
      id: "chat_history",
      name: "Conversation History",
      description: "Save and reference previous conversations",
      access: "public",
      enabled: true
    },
    {
      id: "responsive_ui",
      name: "Responsive Interface",
      description: "Adaptive design for all devices",
      access: "public",
      enabled: true
    },
    
    // Beta features
    {
      id: "semantic_search",
      name: "Semantic Search",
      description: "Advanced meaning-based search capabilities",
      access: "beta",
      enabled: true,
      beta: true
    },
    {
      id: "custom_instructions",
      name: "Custom AI Instructions",
      description: "Set persistent instructions for the AI assistant",
      access: "beta",
      enabled: false,
      beta: true
    },
    
    // Admin-only features
    {
      id: "analytics_dashboard",
      name: "Analytics Dashboard",
      description: "View detailed usage statistics and patterns",
      access: "admin",
      enabled: true
    },
    {
      id: "bulk_data_import",
      name: "Bulk Knowledge Import",
      description: "Import multiple documents to the knowledge base at once",
      access: "admin",
      enabled: true
    },
    {
      id: "system_monitoring",
      name: "System Monitoring",
      description: "Real-time performance monitoring and alerts",
      access: "admin",
      enabled: false
    },
    
    // Developer features (hidden from most users)
    {
      id: "api_access",
      name: "API Access",
      description: "Direct integration with external systems via API",
      access: "developer",
      enabled: false
    },
    {
      id: "embedding_customization",
      name: "Embedding Customization",
      description: "Configure vector embedding parameters",
      access: "developer",
      enabled: false
    },
    {
      id: "prompt_engineering",
      name: "Prompt Engineering Tools",
      description: "Advanced tools to design and test system prompts",
      access: "developer",
      enabled: false
    },
    
    // Coming soon features
    {
      id: "calendar_integration",
      name: "Calendar Integration",
      description: "Connect with academic calendars and schedules",
      access: "beta",
      enabled: false,
      comingSoon: true
    },
    {
      id: "document_analysis",
      name: "Document Analysis",
      description: "Upload and analyze academic documents",
      access: "beta",
      enabled: false,
      comingSoon: true
    },
    {
      id: "multi_modal",
      name: "Multi-modal Responses",
      description: "Get responses with images, tables, and interactive elements",
      access: "public",
      enabled: false,
      comingSoon: true,
      beta: true
    }
  ]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem("GEMINI_API_KEY") || "";
    const savedUseLocalBackend = localStorage.getItem("USE_LOCAL_BACKEND") === "true";
    const savedBackendUrl = localStorage.getItem("BACKEND_URL") || "http://localhost:8000";
    const savedUserRole = localStorage.getItem("USER_ROLE") || "student";
    const savedTheme = localStorage.getItem("THEME") || "system";
    const savedFeatures = JSON.parse(localStorage.getItem("FEATURES") || "null");
    const savedModelParams = JSON.parse(localStorage.getItem("MODEL_PARAMETERS") || "null");
    const savedKnowledgeSources = JSON.parse(localStorage.getItem("KNOWLEDGE_SOURCES") || "null");
    
    // Check for admin email in localStorage
    const savedEmail = localStorage.getItem("ADMIN_EMAIL");
    if (savedEmail === "d.ngum@alustudent.com") {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
      setUserRole("admin");
    }
    
    // Set loaded settings
    setGeminiKey(savedGeminiKey);
    setUseLocalBackend(savedUseLocalBackend);
    setBackendUrl(savedBackendUrl);
    setTheme(savedTheme);
    
    // If user is not yet admin but should be, set to admin
    if (userEmail === "d.ngum@alustudent.com") {
      setUserRole("admin");
    }
    
    // Set optional settings if they exist
    if (savedFeatures) setFeatures(savedFeatures);
    if (savedModelParams) setModelParameters(savedModelParams);
    if (savedKnowledgeSources) setKnowledgeSources(savedKnowledgeSources);
    
    // Simulate loading performance metrics
    const simulatedMetrics = {
      responseTime: Math.random() * 1000 + 200, // 200-1200ms
      tokenUsage: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 tokens
      successRate: 92 + Math.random() * 8, // 92-100%
      cachingEfficiency: 60 + Math.random() * 30 // 60-90%
    };
    setPerformanceMetrics(simulatedMetrics);
  }, [userEmail]);

  // Save settings to localStorage
  const saveSettings = () => {
    // Save core settings
    if (geminiKey) {
      localStorage.setItem("GEMINI_API_KEY", geminiKey);
    }
    
    localStorage.setItem("USE_LOCAL_BACKEND", useLocalBackend.toString());
    localStorage.setItem("BACKEND_URL", backendUrl);
    localStorage.setItem("USER_ROLE", userRole);
    localStorage.setItem("THEME", theme);
    
    // Save feature configurations
    localStorage.setItem("FEATURES", JSON.stringify(features));
    localStorage.setItem("MODEL_PARAMETERS", JSON.stringify(modelParameters));
    localStorage.setItem("KNOWLEDGE_SOURCES", JSON.stringify(knowledgeSources));
    
    toast.success("Settings saved successfully", {
      description: "Your configuration has been updated"
    });
  };

  // Toggle backend connection
  const toggleUseLocalBackend = (checked: boolean) => {
    setUseLocalBackend(checked);
  };

  // Toggle feature enablement
  const toggleFeature = (id: string, enabled: boolean) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === id ? {...feature, enabled} : feature
      )
    );
  };

  // Change feature visibility
  const changeFeatureVisibility = (id: string, access: AccessLevel) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === id ? {...feature, access} : feature
      )
    );
  };

  // Toggle knowledge source
  const toggleKnowledgeSource = (key: string) => {
    setKnowledgeSources(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Test backend connection
  const testBackendConnection = async () => {
    setIsTestingBackend(true);
    setBackendTestResult(null);
    
    try {
      const response = await fetch(`${backendUrl}/health`);
      const success = response.status === 200;
      setBackendTestResult(success);
      
      if (success) {
        toast.success("Backend connection successful", {
          description: "The system is connected to the ALU knowledge base"
        });
      } else {
        toast.error("Backend connection failed", {
          description: "Could not connect to the specified backend URL"
        });
      }
    } catch (error) {
      setBackendTestResult(false);
      toast.error("Backend connection failed", {
        description: "Could not connect to the specified backend URL"
      });
    } finally {
      setIsTestingBackend(false);
    }
  };

  // Handle model parameter changes
  const handleParameterChange = (param: string, value: number | number[]) => {
    const actualValue = Array.isArray(value) ? value[0] : value;
    setModelParameters(prev => ({
      ...prev,
      [param]: actualValue
    }));
  };

  // Get current model parameters as percent for display
  const getParameterPercent = (value: number, max: number) => {
    return (value / max) * 100;
  };

  // Add login function
  const handleLogin = () => {
    const adminAccount = ADMIN_ACCOUNTS.find(account => account.email === userEmail);
    
    if (adminAccount && adminAccount.password === userPassword) {
      setIsLoggedIn(true);
      setUserRole("admin");
      localStorage.setItem("ADMIN_EMAIL", userEmail);
      localStorage.setItem("USER_ROLE", "admin");
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
            <span>Back to Chat</span>
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                Admin: {userEmail.split('@')[0]}
              </Badge>
            ) : null}
            <BackendStatus />
          </div>
        </div>

        {!isLoggedIn ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2 text-[#0F4C81]">
                <Shield className="h-5 w-5" /> Admin Login Required
              </CardTitle>
              <CardDescription>
                Please login with your administrator credentials to access settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@alueducation.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="border-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    className="border-[#0F4C81]/20 focus:border-[#0F4C81]"
                  />
                </div>
                {loginError && (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleLogin} 
                className="w-full bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
              >
                Login
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-[#0F4C81]">System Configuration</h1>
              <div>
                <Button 
                  onClick={saveSettings} 
                  className="gap-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white"
                >
                  <Save size={16} />
                  Save All Settings
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="core" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8 bg-[#0F4C81]/10">
                <TabsTrigger 
                  value="core" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white"
                >
                  <Server className="h-4 w-4" />
                  <span>Core Configuration</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="knowledge" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white"
                >
                  <Database className="h-4 w-4" />
                  <span>Knowledge Base</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ai" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white"
                >
                  <BrainCircuit className="h-4 w-4" />
                  <span>AI Configuration</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white"
                >
                  <Shield className="h-4 w-4" />
                  <span>Advanced</span>
                </TabsTrigger>
              </TabsList>

              {/* Core Configuration Tab */}
              <TabsContent value="core">
                <SettingsSection
                  title="API Keys & System Connection"
                  description="Configure connections to AI providers and backend systems"
                  icon={<Globe className="h-5 w-5" />}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Use ALU Knowledge Base</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to local ALU knowledge base (recommended for most users)
                        </p>
                      </div>
                      <Switch 
                        checked={useLocalBackend} 
                        onCheckedChange={toggleUseLocalBackend} 
                      />
                    </div>
                    
                    {useLocalBackend && (
                      <div className="space-y-3">
                        <Label htmlFor="backend-url">Backend URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="backend-url"
                            placeholder="http://localhost:8000"
                            value={backendUrl}
                            onChange={(e) => setBackendUrl(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            onClick={testBackendConnection}
                            disabled={isTestingBackend}
                          >
                            {isTestingBackend ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <span>Test Connection</span>
                            )}
                          </Button>
                        </div>
                        
                        {backendTestResult !== null && (
                          <Alert variant={backendTestResult ? "default" : "destructive"} className="mt-2">
                            <AlertDescription>
                              {backendTestResult 
                                ? "Connection successful. ALU Knowledge Base is accessible."
                                : "Connection failed. Please check the URL and ensure the backend server is running."
                              }
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {!useLocalBackend && (
                      <div className="space-y-3">
                        <Label htmlFor="gemini-key">Gemini API Key</Label>
                        <div className="relative">
                          <Input
                            id="gemini-key"
                            type="password"
                            placeholder="Enter your Gemini API key"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You can get your API key from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-medium mb-3">System Role</h3>
                      <Select value={userRole} onValueChange={setUserRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your role determines which features and information you can access
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium mb-3">Interface Theme</h3>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SettingsSection>
                
                {userRole === 'admin' && (
                  <SettingsSection
                    title="System Status"
                    description="Monitor system health and performance metrics"
                    icon={<Gauge className="h-5 w-5" />}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-base font-medium mb-4">Component Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Backend API</span>
                            <Badge variant={systemStatus.backend === "operational" ? "outline" : "destructive"} className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30">
                              Operational
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Database</span>
                            <Badge variant={systemStatus.database === "operational" ? "outline" : "destructive"} className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30">
                              Operational
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Vector Store</span>
                            <Badge variant={systemStatus.vector_store === "operational" ? "outline" : "destructive"} className="bg-[#FF9800]/10 text-[#FF9800] border-[#FF9800]/30">
                              Degraded
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>External API</span>
                            <Badge variant={systemStatus.api === "operational" ? "outline" : "destructive"} className="bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/30">
                              Operational
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-medium mb-4">Performance Metrics</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Average Response Time</span>
                              <span className="text-sm font-medium">{performanceMetrics.responseTime.toFixed(0)}ms</span>
                            </div>
                            <Progress 
                              value={Math.min(100, (performanceMetrics.responseTime / 1500) * 100)} 
                              className="bg-[#0F4C81]/10 [&>div]:bg-[#0F4C81]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Token Usage (last 24h)</span>
                              <span className="text-sm font-medium">{performanceMetrics.tokenUsage.toLocaleString()}</span>
                            </div>
                            <Progress 
                              value={Math.min(100, (performanceMetrics.tokenUsage / 10000) * 100)} 
                              className="bg-[#0F4C81]/10 [&>div]:bg-[#E94E1B]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Success Rate</span>
                              <span className="text-sm font-medium">{performanceMetrics.successRate.toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={performanceMetrics.successRate} 
                              className="bg-[#0F4C81]/10 [&>div]:bg-[#2E7D32]"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Cache Efficiency</span>
                              <span className="text-sm font-medium">{performanceMetrics.cachingEfficiency.toFixed(1)}%</span>
                            </div>
                            <Progress 
                              value={performanceMetrics.cachingEfficiency} 
                              className="bg-[#0F4C81]/10 [&>div]:bg-[#FFC72C]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SettingsSection>
                )}
              </TabsContent>

              {/* Knowledge Base Tab */}
              <TabsContent value="knowledge">
                <SettingsSection
                  title="Knowledge Sources"
                  description="Configure which information sources are enabled for the AI assistant"
                  icon={<Book className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Financial Information</h3>
                        <p className="text-sm text-muted-foreground">Tuition, scholarships, payment options</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.financialInfo} 
                        onCheckedChange={() => toggleKnowledgeSource('financialInfo')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Academic Programs</h3>
                        <p className="text-sm text-muted-foreground">Degrees, majors, requirements</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.academicPrograms} 
                        onCheckedChange={() => toggleKnowledgeSource('academicPrograms')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Campus Services</h3>
                        <p className="text-sm text-muted-foreground">Student services, facilities, support</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.campusServices} 
                        onCheckedChange={() => toggleKnowledgeSource('campusServices')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Admissions</h3>
                        <p className="text-sm text-muted-foreground">Application process, requirements</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.admissions} 
                        onCheckedChange={() => toggleKnowledgeSource('admissions')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Graduation</h3>
                        <p className="text-sm text-muted-foreground">Requirements, ceremonies, alumni</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.graduation} 
                        onCheckedChange={() => toggleKnowledgeSource('graduation')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Housing Information</h3>
                        <p className="text-sm text-muted-foreground">Residence halls, options, policies</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.housingInfo} 
                        onCheckedChange={() => toggleKnowledgeSource('housingInfo')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Faculty Profiles</h3>
                        <p className="text-sm text-muted-foreground">Professor information, specialties</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.facultyProfiles} 
                        onCheckedChange={() => toggleKnowledgeSource('facultyProfiles')} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <h3 className="text-base font-medium">Course Descriptions</h3>
                        <p className="text-sm text-muted-foreground">Detailed course information</p>
                      </div>
                      <Switch 
                        checked={knowledgeSources.courseDescriptions} 
                        onCheckedChange={() => toggleKnowledgeSource('courseDescriptions')} 
                      />
                    </div>
                  </div>
                </SettingsSection>

                {userRole === 'admin' && (
                  <SettingsSection
                    title="Knowledge Base Management"
                    description="Advanced controls for managing and updating the knowledge base"
                    icon={<Database className="h-5 w-5" />}
                  >
                    <div className="space-y-6">
                      <div className="flex flex-col space-y-2">
                        <h3 className="text-base font-medium">Data Import</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Import new knowledge or update existing information
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Import Documents
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <Table className="h-4 w-4" />
                            Import Structured Data
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <LibrarySquare className="h-4 w-4" />
                            Manage Sources
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex flex-col space-y-2">
                        <h3 className="text-base font-medium">Maintenance</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Maintenance operations for optimal knowledge base performance
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          <Button variant="outline" className="gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Rebuild Vector Index
                          </Button>
                          <Button variant="outline" className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Validate Knowledge Base
                          </Button>
                          <Button variant="outline" className="gap-2" disabled>
                            <Layers className="h-4 w-4" />
                            Optimize Storage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SettingsSection>
                )}
              </TabsContent>

              {/* AI Configuration Tab */}
              <TabsContent value="ai">
                <SettingsSection
                  title="Model Parameters"
                  description="Configure AI model behavior and response characteristics"
                  icon={<BrainCircuit className="h-5 w-5" />}
                >
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Temperature (Creativity)</Label>
                          <span className="text-sm">{modelParameters.temperature.toFixed(2)}</span>
                        </div>
                        <Slider 
                          value={[modelParameters.temperature]} 
                          min={0} 
                          max={1}
                          step={0.01}
                          onValueChange={(val) => handleParameterChange('temperature', val)}
                          className="[&>span]:bg-[#E94E1B] [&>span]:border-[#E94E1B]"
                        />
                        <p className="text-xs text-muted-foreground">
                          Lower values produce more consistent, deterministic responses. Higher values produce more creative, varied responses.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Top P (Diversity)</Label>
                          <span className="text-sm">{modelParameters.topP.toFixed(2)}</span>
                        </div>
                        <Slider 
                          value={[modelParameters.topP]} 
                          min={0} 
                          max={1}
                          step={0.01}
                          onValueChange={(val) => handleParameterChange('topP', val)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Controls diversity of responses. Lower values focus on more likely completions.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Maximum Tokens</Label>
                          <span className="text-sm">{modelParameters.maxTokens}</span>
                        </div>
                        <Slider 
                          value={[modelParameters.maxTokens]} 
                          min={256} 
                          max={4096}
                          step={128}
                          onValueChange={(val) => handleParameterChange('maxTokens', val)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Maximum length of generated responses. Higher values allow for longer, more detailed answers.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Presence Penalty</Label>
                          <span className="text-sm">{modelParameters.presencePenalty.toFixed(2)}</span>
                        </div>
                        <Slider 
                          value={[modelParameters.presencePenalty]} 
                          min={0} 
                          max={2}
                          step={0.1}
                          onValueChange={(val) => handleParameterChange('presencePenalty', val)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Reduces repetition of topics. Higher values discourage the model from repeating the same information.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Frequency Penalty</Label>
                          <span className="text-sm">{modelParameters.frequencyPenalty.toFixed(2)}</span>
                        </div>
                        <Slider 
                          value={[modelParameters.frequencyPenalty]} 
                          min={0} 
                          max={2}
                          step={0.1}
                          onValueChange={(val) => handleParameterChange('frequencyPenalty', val)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Reduces repetition of specific phrases. Higher values discourage the model from repeating the same words.
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h3 className="text-base font-medium">Response Style & Format</h3>
                      
                      <div className="space-y-2">
                        <Label>Response Style</Label>
                        <Select defaultValue="balanced">
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="precise">Precise & Factual</SelectItem>
                            <SelectItem value="balanced">Balanced</SelectItem>
                            <SelectItem value="creative">Creative & Conversational</SelectItem>
                            <SelectItem value="concise">Brief & Concise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label>System Instructions</Label>
                        <Textarea 
                          placeholder="Enter custom instructions for the AI assistant..."
                          className="min-h-[120px]"
                        />
                        <p className="text-sm text-muted-foreground">
                          Define how the AI should behave, what tone to use, and any specific instructions for responses.
                        </p>
                      </div>
                    </div>
                  </div>
                </SettingsSection>
                
                <SettingsSection
                  title="Feature Management"
                  description="Control which AI capabilities are enabled"
                  icon={<Zap className="h-5 w-5" />}
                >
                  <div className="space-y-2 divide-y">
                    {features
                      .filter(f => !f.access.includes('developer'))
                      .map(feature => (
                        <FeatureToggle 
                          key={feature.id} 
                          feature={feature} 
                          onToggle={toggleFeature} 
                          userRole={userRole}
                          onVisibilityChange={changeFeatureVisibility}
                        />
                      ))
                    }
                  </div>
                </SettingsSection>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced">
                {userRole === 'admin' ? (
                  <>
                    <SettingsSection
                      title="Developer Features"
                      description="Advanced configuration options for developers"
                      icon={<Code className="h-5 w-5" />}
                    >
                      <div className="space-y-2 divide-y">
                        {features
                          .filter(f => f.access.includes('developer'))
                          .map(feature => (
                            <FeatureToggle 
                              key={feature.id} 
                              feature={feature} 
                              onToggle={toggleFeature} 
                              userRole={userRole}
                              onVisibilityChange={changeFeatureVisibility}
                            />
                          ))
                        }
                      </div>
                      
                      <div className="space-y-4 mt-6">
                        <h3 className="text-base font-medium">Development Tools</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">API Console</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Test API endpoints and experiment with different parameters
                            </p>
                            <Button variant="outline" className="gap-2 w-full">
                              <Terminal className="h-4 w-4" />
                              Open API Console
                            </Button>
                          </div>
                          
                          <div className="border rounded-md p-4">
                            <h4 className="font-medium mb-2">Prompt Laboratory</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Design, test and optimize system prompts
                            </p>
                            <Button variant="outline" className="gap-2 w-full">
                              <PlayCircle className="h-4 w-4" />
                              Open Prompt Lab
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-base font-medium">Advanced Configuration</h3>
                        
                        <div className="space-y-3">
                          <Label>Vector Embedding Model</Label>
                          <Select defaultValue="text-embedding-3-large">
                            <SelectTrigger>
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text-embedding-3-large">Text Embedding 3 Large</SelectItem>
                              <SelectItem value="text-embedding-3-small">Text Embedding 3 Small</SelectItem>
                              <SelectItem value="text-embedding-ada-002">Ada 002 (Legacy)</SelectItem>
                              <SelectItem value="custom">Custom Model</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Embedding Dimensions</Label>
                          <Select defaultValue="1536">
                            <SelectTrigger>
                              <SelectValue placeholder="Select dimensions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="256">256 (Compact)</SelectItem>
                              <SelectItem value="768">768 (Balanced)</SelectItem>
                              <SelectItem value="1536">1536 (Standard)</SelectItem>
                              <SelectItem value="3072">3072 (High Precision)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>Chunking Strategy</Label>
                          <Select defaultValue="paragraph">
                            <SelectTrigger>
                              <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sentence">Sentence-based</SelectItem>
                              <SelectItem value="paragraph">Paragraph-based</SelectItem>
                              <SelectItem value="fixed">Fixed Size (512 tokens)</SelectItem>
                              <SelectItem value="semantic">Semantic Chunking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Debug Mode</Label>
                              <p className="text-sm text-muted-foreground">
                                Show additional debugging information in responses
                              </p>
                            </div>
                            <Switch defaultChecked={false} />
                          </div>
                        </div>
                      </div>
                    </SettingsSection>
                    
                    <SettingsSection
                      title="Analytics & Monitoring"
                      description="View system analytics and configure monitoring"
                      icon={<LineChart className="h-5 w-5" />}
                    >
                      <div className="space-y-6">
                        <div className="border rounded-md p-5 bg-[#0F4C81]/5 border-[#0F4C81]/20">
                          <h3 className="text-base font-medium mb-4 text-[#0F4C81]">Usage Overview</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-background p-4 rounded-md border border-[#0F4C81]/20">
                              <div className="text-sm text-muted-foreground">Queries (Last 7 Days)</div>
                              <div className="text-2xl font-bold text-[#0F4C81]">3,724</div>
                              <div className="text-xs text-[#2E7D32] flex items-center gap-1 mt-1">
                                <span>↑ 12.4%</span>
                                <span>vs previous</span>
                              </div>
                            </div>
                            
                            <div className="bg-background p-4 rounded-md border border-[#0F4C81]/20">
                              <div className="text-sm text-muted-foreground">Active Users</div>
                              <div className="text-2xl font-bold text-[#0F4C81]">246</div>
                              <div className="text-xs text-[#2E7D32] flex items-center gap-1 mt-1">
                                <span>↑ 8.7%</span>
                                <span>vs previous</span>
                              </div>
                            </div>
                            
                            <div className="bg-background p-4 rounded-md border border-[#0F4C81]/20">
                              <div className="text-sm text-muted-foreground">Avg. Session Time</div>
                              <div className="text-2xl font-bold text-[#0F4C81]">14.3 min</div>
                              <div className="text-xs text-[#2E7D32] flex items-center gap-1 mt-1">
                                <span>↑ 5.2%</span>
                                <span>vs previous</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-center">
                            <Button variant="outline" className="gap-2">
                              <BarChart4 className="h-4 w-4" />
                              View Detailed Analytics
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-base font-medium">External Integrations</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-3">
                                <Network className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <h4 className="font-medium">Google Analytics</h4>
                                  <p className="text-sm text-muted-foreground">Track usage statistics</p>
                                </div>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                            
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-3">
                                <Webhook className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <h4 className="font-medium">Slack Notifications</h4>
                                  <p className="text-sm text-muted-foreground">System alerts and reports</p>
                                </div>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                            
                            <div className="flex items-center justify-between border p-3 rounded-md">
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <h4 className="font-medium">Scheduled Reports</h4>
                                  <p className="text-sm text-muted-foreground">Weekly system performance emails</p>
                                </div>
                              </div>
                              <Switch defaultChecked={false} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SettingsSection>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-medium mb-2">Administrator Access Required</h2>
                    <p className="text-muted-foreground max-w-md">
                      Advanced settings require administrator privileges. Please contact your system administrator for access.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <div className="mt-8 bg-[#0F4C81]/5 border border-[#0F4C81]/20 rounded-lg p-4 flex items-center gap-3">
          <Info size={20} className="text-[#0F4C81]" />
          <div className="text-sm text-muted-foreground">
            Settings are automatically saved to your browser's local storage. 
            For persistent configurations across devices, sign in with an ALU account.
          </div>
        </div>
      </div>
    </div>
  );
}