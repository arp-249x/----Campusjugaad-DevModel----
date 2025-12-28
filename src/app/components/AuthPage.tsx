import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Sparkles, Loader2 } from "lucide-react";

interface AuthPageProps {
  onLogin: (user: any) => void;
  onGuest: () => void;
}

export function AuthPage({ onLogin, onGuest }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Login State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // CHANGED: Removed http://localhost:5000
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // CHANGED: Removed http://localhost:5000
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, username: regUsername, password: regPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto login after register
        onLogin(data);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--campus-bg)] p-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2D7FF9]/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#9D4EDD]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <Card className="w-full max-w-md border-[var(--campus-border)] bg-[var(--campus-card-bg)]/80 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-[#2D7FF9] to-[#9D4EDD] rounded-xl flex items-center justify-center shadow-lg mb-2">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold text-[var(--campus-text-primary)]">
            Welcome to CampusJugaad
          </CardTitle>
          <CardDescription className="text-[var(--campus-text-secondary)]">
            Your campus marketplace for help & rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-[var(--campus-surface)]">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN FORM */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="e.g. hero123" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    className="bg-[var(--campus-bg)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-[var(--campus-bg)]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                <Button type="submit" className="w-full bg-[#2D7FF9] hover:bg-[#2D7FF9]/90 text-white" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER FORM */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input 
                    id="reg-name" 
                    placeholder="John Doe" 
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="bg-[var(--campus-bg)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-user">Username</Label>
                  <Input 
                    id="reg-user" 
                    placeholder="Choose a unique username" 
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    className="bg-[var(--campus-bg)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-pass">Password</Label>
                  <Input 
                    id="reg-pass" 
                    type="password" 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="bg-[var(--campus-bg)]"
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                <Button type="submit" className="w-full bg-[#9D4EDD] hover:bg-[#9D4EDD]/90 text-white" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--campus-border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--campus-card-bg)] px-2 text-[var(--campus-text-secondary)]">Or continue as</span>
            </div>
          </div>
          <Button variant="outline" className="w-full border-[var(--campus-border)]" onClick={onGuest}>
            Guest User (Demo Mode)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
