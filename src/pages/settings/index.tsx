
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BackendStatus } from "@/components/chat/BackendStatus";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, School, Building2, FileText, Globe, 
  BookOpen, Bell, MessageSquare, Lock, Database, 
  BrainCircuit, Clock, ArrowLeft, Settings as SettingsIcon,
  Sparkles, Bot, PersonStanding, PaintBucket, Sliders, 
  MousePointer, Zap, Award, Lightbulb, Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// AI Persona types
type AiPersona = {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  traits: {
    helpfulness: number;
    creativity: number;
    precision: number;
    friendliness: number;
  }
};

export default function Settings() {
  // Original settings state
  const [geminiKey, setGeminiKey] = useState("");
  const [useLocalBackend, setUseLocalBackend] = useState(false);
  const [userRole, setUserRole] = useState("student"); // student, faculty, admin
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("english");
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [historyRetention, setHistoryRetention] = useState("30days");
  const [adminFeatures, setAdminFeatures] = useState(false);

  // New AI persona settings
  const [selectedPersona, setSelectedPersona] = useState<string>("academic");
  const [customPrompt, setCustomPrompt] = useState("");
  const [aiPersonalization, setAiPersonalization] = useState(true);
  const [aiTraits, setAiTraits] = useState({
    helpfulness: 75,
    creativity: 50,
    precision: 85,
    friendliness: 70
  });
  const [aiVoice, setAiVoice] = useState("natural");
  const [aiTheme, setAiTheme] = useState("default");
  const [analyticsDashboard, setAnalyticsDashboard] = useState(true);
  const [continuousLearning, setContinuousLearning] = useState(true);
  const [integrationProgress, setIntegrationProgress] = useState<Record<string, boolean>>({
    calendar: true,
    assignments: true,
    library: false,
    courses: true
  });

  // AI personas
  const aiPersonas: AiPersona[] = [
    {
      id: "academic",
      name: "Academic Advisor",
      description: "Focuses on academic information, course guidance, and educational resources",
      icon: <School className="w-8 h-8 text-blue-500" />,
      traits: { helpfulness: 85, creativity: 40, precision: 90, friendliness: 75 }
    },
    {
      id: "creative",
      name: "Creative Coach",
      description: "Encourages creative thinking, exploration, and unique perspectives",
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      traits: { helpfulness: 70, creativity: 95, precision: 60, friendliness: 80 }
    },
    {
      id: "technical",
      name: "Technical Assistant",
      description: "Provides precise, technical information with detailed explanations",
      icon: <BrainCircuit className="w-8 h-8 text-green-500" />,
      traits: { helpfulness: 85, creativity: 35, precision: 95, friendliness: 65 }
    },
    {
      id: "supportive",
      name: "Supportive Guide",
      description: "Emphasizes emotional support, motivation, and encouragement",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      traits: { helpfulness: 90, creativity: 65, precision: 75, friendliness: 95 }
    },
    {
      id: "custom",
      name: "Custom AI",
      description: "Fully customized AI assistant with your preferred traits",
      icon: <Sliders className="w-8 h-8 text-amber-500" />,
      traits: { helpfulness: 75, creativity: 50, precision: 85, friendliness: 70 }
    }
  ];

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem("GEMINI_API_KEY") || "";
    const savedUseLocalBackend = localStorage.getItem("USE_LOCAL_BACKEND") === "true";
    const savedUserRole = localStorage.getItem("USER_ROLE") || "student";
    const savedAutoSave = localStorage.getItem("AUTO_SAVE") !== "false";
    const savedNotifications = localStorage.getItem("NOTIFICATIONS") !== "false";
    const savedTheme = localStorage.getItem("THEME") || "system";
    const savedLanguage = localStorage.getItem("LANGUAGE") || "english";
    const savedAccessibilityMode = localStorage.getItem("ACCESSIBILITY_MODE") === "true";
    const savedHistoryRetention = localStorage.getItem("HISTORY_RETENTION") || "30days";
    const savedAdminFeatures = localStorage.getItem("ADMIN_FEATURES") === "true";
    
    // Load AI-specific settings
    const savedPersona = localStorage.getItem("AI_PERSONA") || "academic";
    const savedCustomPrompt = localStorage.getItem("CUSTOM_PROMPT") || "";
    const savedAiTraits = JSON.parse(localStorage.getItem("AI_TRAITS") || JSON.stringify(aiTraits));
    const savedAiPersonalization = localStorage.getItem("AI_PERSONALIZATION") !== "false";
    const savedAiVoice = localStorage.getItem("AI_VOICE") || "natural";
    const savedAiTheme = localStorage.getItem("AI_THEME") || "default";
    const savedAnalyticsDashboard = localStorage.getItem("ANALYTICS_DASHBOARD") !== "false";
    const savedContinuousLearning = localStorage.getItem("CONTINUOUS_LEARNING") !== "false";
    const savedIntegrations = JSON.parse(localStorage.getItem("INTEGRATION_PROGRESS") || JSON.stringify(integrationProgress));
    
    // Set original settings
    setGeminiKey(savedGeminiKey);
    setUseLocalBackend(savedUseLocalBackend);
    setUserRole(savedUserRole);
    setAutoSave(savedAutoSave);
    setNotifications(savedNotifications);
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setAccessibilityMode(savedAccessibilityMode);
    setHistoryRetention(savedHistoryRetention);
    setAdminFeatures(savedAdminFeatures);
    
    // Set AI-specific settings
    setSelectedPersona(savedPersona);
    setCustomPrompt(savedCustomPrompt);
    setAiTraits(savedAiTraits);
    setAiPersonalization(savedAiPersonalization);
    setAiVoice(savedAiVoice);
    setAiTheme(savedAiTheme);
    setAnalyticsDashboard(savedAnalyticsDashboard);
    setContinuousLearning(savedContinuousLearning);
    setIntegrationProgress(savedIntegrations);
  }, []);

  const saveSettings = () => {
    // Save all original settings
    if (geminiKey) {
      localStorage.setItem("GEMINI_API_KEY", geminiKey);
    }
    
    localStorage.setItem("USE_LOCAL_BACKEND", useLocalBackend.toString());
    localStorage.setItem("USER_ROLE", userRole);
    localStorage.setItem("AUTO_SAVE", autoSave.toString());
    localStorage.setItem("NOTIFICATIONS", notifications.toString());
    localStorage.setItem("THEME", theme);
    localStorage.setItem("LANGUAGE", language);
    localStorage.setItem("ACCESSIBILITY_MODE", accessibilityMode.toString());
    localStorage.setItem("HISTORY_RETENTION", historyRetention);
    localStorage.setItem("ADMIN_FEATURES", adminFeatures.toString());
    
    // Save AI-specific settings
    localStorage.setItem("AI_PERSONA", selectedPersona);
    localStorage.setItem("CUSTOM_PROMPT", customPrompt);
    localStorage.setItem("AI_TRAITS", JSON.stringify(aiTraits));
    localStorage.setItem("AI_PERSONALIZATION", aiPersonalization.toString());
    localStorage.setItem("AI_VOICE", aiVoice);
    localStorage.setItem("AI_THEME", aiTheme);
    localStorage.setItem("ANALYTICS_DASHBOARD", analyticsDashboard.toString());
    localStorage.setItem("CONTINUOUS_LEARNING", continuousLearning.toString());
    localStorage.setItem("INTEGRATION_PROGRESS", JSON.stringify(integrationProgress));
    
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated"
    });
  };

  const toggleUseLocalBackend = (checked: boolean) => {
    setUseLocalBackend(checked);
  };

  const handleTraitChange = (trait: keyof typeof aiTraits, value: number[]) => {
    setAiTraits(prev => ({
      ...prev,
      [trait]: value[0]
    }));
  };

  const toggleIntegration = (key: string) => {
    setIntegrationProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get current persona
  const currentPersona = aiPersonas.find(p => p.id === selectedPersona) || aiPersonas[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-8 px-4">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={20} />
          Back to Chat
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <BackendStatus />
          </div>
          
          <Tabs defaultValue="ai-persona">
            <TabsList className="grid grid-cols-6 mb-8">
              <TabsTrigger value="ai-persona" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">AI Persona</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <School className="h-4 w-4" />
                <span className="hidden sm:inline">Academic</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span className="hidden sm:inline">AI Models</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            </TabsList>

            {/* AI Persona Settings */}
            <TabsContent value="ai-persona" className="space-y-6">
              <Card className="border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>AI Persona Configuration</span>
                    <Sparkles className="h-5 w-5 text-amber-500" />
                  </CardTitle>
                  <CardDescription>
                    Customize the AI assistant's personality, responses, and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Persona Selection */}
                    <div className="space-y-4 md:col-span-2">
                      <h3 className="text-lg font-medium">Choose Your AI Persona</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {aiPersonas.map(persona => (
                          <div 
                            key={persona.id}
                            className={`relative flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-all ${
                              selectedPersona === persona.id 
                                ? "border-primary bg-primary/5" 
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => {
                              setSelectedPersona(persona.id);
                              if (persona.id !== "custom") {
                                setAiTraits(persona.traits);
                              }
                            }}
                          >
                            {persona.icon}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{persona.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{persona.description}</p>
                            </div>
                            {selectedPersona === persona.id && (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Persona Preview & Customization */}
                    <div className="md:col-span-3 space-y-4">
                      <h3 className="text-lg font-medium">Persona Preview</h3>
                      <div className="border rounded-lg p-4 bg-card">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-12 w-12 border-2 border-primary">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {currentPersona.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{currentPersona.name}</h4>
                            <p className="text-xs text-muted-foreground">{currentPersona.description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {Object.entries(currentPersona.traits).map(([trait, value]) => (
                            <div key={trait} className="text-sm">
                              <span className="capitalize">{trait}:</span>
                              <div className="w-full bg-secondary h-2 rounded-full mt-1">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${value}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm p-3 rounded bg-muted mt-3">
                          <p className="italic">
                            "Hello! I'm your {currentPersona.name.toLowerCase()}. I'm here to assist you with 
                            {currentPersona.id === 'academic' && " academic guidance and educational resources"}
                            {currentPersona.id === 'creative' && " creative exploration and unique perspectives"}
                            {currentPersona.id === 'technical' && " technical problems and detailed explanations"}
                            {currentPersona.id === 'supportive' && " motivation, support, and encouragement"}
                            {currentPersona.id === 'custom' && " your custom needs as configured"}."
                          </p>
                        </div>
                      </div>

                      {/* Custom Traits - only shown for Custom persona */}
                      {selectedPersona === "custom" && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <h3 className="text-md font-medium">Customize Traits</h3>
                          <div className="space-y-4">
                            {Object.entries(aiTraits).map(([trait, value]) => (
                              <div key={trait} className="space-y-2">
                                <div className="flex justify-between">
                                  <Label className="capitalize">{trait}</Label>
                                  <span className="text-sm">{value}%</span>
                                </div>
                                <Slider 
                                  value={[value]} 
                                  min={0} 
                                  max={100}
                                  step={5}
                                  onValueChange={(val) => handleTraitChange(trait as keyof typeof aiTraits, val)}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Custom System Prompt */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Advanced Customization</h3>
                      <Switch 
                        checked={aiPersonalization} 
                        onCheckedChange={setAiPersonalization}
                      />
                    </div>
                    
                    {aiPersonalization && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="custom-prompt">Custom System Prompt</Label>
                          <Textarea 
                            id="custom-prompt"
                            placeholder="You are an AI assistant for ALU students and faculty. You help with..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <p className="text-xs text-muted-foreground">
                            Define custom instructions for the AI assistant. This will override the default persona behavior.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>AI Voice Style</Label>
                            <ToggleGroup 
                              type="single" 
                              value={aiVoice} 
                              onValueChange={(value) => value && setAiVoice(value)}
                              className="justify-start"
                            >
                              <ToggleGroupItem value="natural">Natural</ToggleGroupItem>
                              <ToggleGroupItem value="formal">Formal</ToggleGroupItem>
                              <ToggleGroupItem value="casual">Casual</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Chat Theme</Label>
                            <ToggleGroup 
                              type="single" 
                              value={aiTheme} 
                              onValueChange={(value) => value && setAiTheme(value)}
                              className="justify-start"
                            >
                              <ToggleGroupItem value="default">Default</ToggleGroupItem>
                              <ToggleGroupItem value="academic">Academic</ToggleGroupItem>
                              <ToggleGroupItem value="professional">Professional</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {/* Integration Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Educational Integrations</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable the AI to access and help with various educational systems
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.calendar ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <span>Calendar & Deadlines</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.calendar} 
                          onCheckedChange={() => toggleIntegration('calendar')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.assignments ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"}`}>
                            <FileText className="h-4 w-4" />
                          </div>
                          <span>Assignments</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.assignments} 
                          onCheckedChange={() => toggleIntegration('assignments')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.library ? "bg-blue-100 text-blue-600" : "bg-muted text-muted-foreground"}`}>
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <span>Library Resources</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.library} 
                          onCheckedChange={() => toggleIntegration('library')}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between border rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className={`rounded-full p-1 ${integrationProgress.courses ? "bg-purple-100 text-purple-600" : "bg-muted text-muted-foreground"}`}>
                            <School className="h-4 w-4" />
                          </div>
                          <span>Course Materials</span>
                        </div>
                        <Switch 
                          checked={integrationProgress.courses} 
                          onCheckedChange={() => toggleIntegration('courses')}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Advanced AI Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Advanced AI Features</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Learning Analytics Dashboard</Label>
                        <p className="text-sm text-muted-foreground">
                          Get insights on your learning patterns and AI interactions
                        </p>
                      </div>
                      <Switch 
                        checked={analyticsDashboard} 
                        onCheckedChange={setAnalyticsDashboard}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Continuous Learning</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow the AI to remember your preferences and adapt to your needs
                        </p>
                      </div>
                      <Switch 
                        checked={continuousLearning} 
                        onCheckedChange={setContinuousLearning}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings} className="gap-2">
                    <Zap className="h-4 w-4" />
                    Save AI Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Customize your experience with ALU Assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Appearance</h3>
                        <div className="space-y-2">
                          <Label>Theme</Label>
                          <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)} className="justify-start">
                            <ToggleGroupItem value="light">Light</ToggleGroupItem>
                            <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                            <ToggleGroupItem value="system">System</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Language</h3>
                        <div className="space-y-2">
                          <Label>Interface Language</Label>
                          <ToggleGroup type="single" value={language} onValueChange={(value) => value && setLanguage(value)} className="justify-start">
                            <ToggleGroupItem value="english">English</ToggleGroupItem>
                            <ToggleGroupItem value="french">French</ToggleGroupItem>
                            <ToggleGroupItem value="swahili">Swahili</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Behavior</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-save Conversations</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically save your conversations
                          </p>
                        </div>
                        <Switch 
                          checked={autoSave} 
                          onCheckedChange={setAutoSave} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications for new messages
                          </p>
                        </div>
                        <Switch 
                          checked={notifications} 
                          onCheckedChange={setNotifications} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Accessibility Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enhanced readability and screen reader support
                          </p>
                        </div>
                        <Switch 
                          checked={accessibilityMode} 
                          onCheckedChange={setAccessibilityMode} 
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Data</h3>
                      <div className="space-y-2">
                        <Label>Chat History Retention</Label>
                        <ToggleGroup type="single" value={historyRetention} onValueChange={(value) => value && setHistoryRetention(value)} className="justify-start">
                          <ToggleGroupItem value="7days">7 Days</ToggleGroupItem>
                          <ToggleGroupItem value="30days">30 Days</ToggleGroupItem>
                          <ToggleGroupItem value="90days">90 Days</ToggleGroupItem>
                          <ToggleGroupItem value="forever">Forever</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <Button variant="outline" className="mt-2">
                        Clear Chat History
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Role Selection</h3>
                    <div className="space-y-2">
                      <Label>User Role</Label>
                      <ToggleGroup type="single" value={userRole} onValueChange={(value) => value && setUserRole(value)} className="justify-start">
                        <ToggleGroupItem value="student">Student</ToggleGroupItem>
                        <ToggleGroupItem value="faculty">Faculty</ToggleGroupItem>
                        <ToggleGroupItem value="admin">Admin</ToggleGroupItem>
                      </ToggleGroup>
                      <p className="text-sm text-muted-foreground">
                        Your role determines what features you have access to
                      </p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="student@alueducation.com" disabled />
                        <p className="text-xs text-muted-foreground">
                          Your ALU email address (cannot be changed)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="flex gap-2">
                          <Input id="password" type="password" value="••••••••" disabled />
                          <Button variant="outline">Change</Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" placeholder="Your Name" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Academic Settings */}
            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Settings</CardTitle>
                  <CardDescription>
                    Configure academic preferences and course-related settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Program Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="program">Current Program</Label>
                        <Input id="program" placeholder="Global Challenges" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Academic Year</Label>
                        <Input id="year" placeholder="2024-2025" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="campus">Campus</Label>
                        <Input id="campus" placeholder="Rwanda" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input id="major" placeholder="Computer Science" />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Course Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Course Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your enrolled courses
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Assignment Reminders</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about upcoming assignments
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Resource Recommendations</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive personalized resource recommendations
                          </p>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Settings</CardTitle>
                  <CardDescription>
                    Configure AI models and backend connections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Connection Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Use ALU Backend</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to local ALU knowledge base on http://localhost:8000
                        </p>
                      </div>
                      <Switch 
                        checked={useLocalBackend} 
                        onCheckedChange={toggleUseLocalBackend} 
                      />
                    </div>
                    
                    {!useLocalBackend && (
                      <div className="space-y-2">
                        <Label htmlFor="gemini-key">Gemini API Key</Label>
                        <Input
                          id="gemini-key"
                          type="password"
                          placeholder="Enter your Gemini API key"
                          value={geminiKey}
                          onChange={(e) => setGeminiKey(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          You can get your API key from the Google AI Studio
                        </p>
                      </div>
                    )}

                    <Separator />

                    <h3 className="text-lg font-medium">Model Configuration</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Response Style</Label>
                        <ToggleGroup type="single" defaultValue="balanced" className="justify-start">
                          <ToggleGroupItem value="creative">Creative</ToggleGroupItem>
                          <ToggleGroupItem value="balanced">Balanced</ToggleGroupItem>
                          <ToggleGroupItem value="precise">Precise</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Knowledge Cutoff</Label>
                        <ToggleGroup type="single" defaultValue="latest" className="justify-start">
                          <ToggleGroupItem value="2022">2022</ToggleGroupItem>
                          <ToggleGroupItem value="2023">2023</ToggleGroupItem>
                          <ToggleGroupItem value="latest">Latest</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Admin Settings */}
            <TabsContent value="admin" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                  <CardDescription>
                    Advanced settings for administrators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Admin Features</h3>
                        <p className="text-sm text-muted-foreground">
                          Enable administrative features and controls
                        </p>
                      </div>
                      <Switch 
                        checked={adminFeatures} 
                        onCheckedChange={setAdminFeatures} 
                      />
                    </div>

                    {adminFeatures && (
                      <>
                        <Separator />
                        
                        <h3 className="text-lg font-medium">User Management</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Batch User Import</Label>
                              <p className="text-sm text-muted-foreground">
                                Import users from CSV or Excel files
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Import
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>User Permissions</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure access levels and permissions
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Lock className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        <Separator />
                        
                        <h3 className="text-lg font-medium">System Configuration</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Database Settings</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure database connection and backup settings
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Database className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>API Endpoints</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure external API connections
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Globe className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Scheduled Tasks</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure periodic background tasks
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Clock className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                        </div>

                        <Separator />
                        
                        <h3 className="text-lg font-medium">Integration Management</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Learning Management System</Label>
                              <p className="text-sm text-muted-foreground">
                                Connect to Canvas, Moodle, or other LMS
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <BookOpen className="mr-2 h-4 w-4" />
                              Connect
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Notification Services</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure email and push notification services
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Bell className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Chat Interface</Label>
                              <p className="text-sm text-muted-foreground">
                                Configure chatbot behavior and responses
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={saveSettings}>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
