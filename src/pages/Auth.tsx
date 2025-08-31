import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: auth, 2: profile setup
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    country: "",
    gender: "",
    height: "",
    race: "",
    age: "",
    weight: ""
  });

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Check if user has completed profile
        checkUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profile && profile.country && profile.gender) {
      // Profile is complete, go to main page
      navigate('/');
    } else {
      // Profile needs completion
      setStep(2);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      // Move to profile setup step
      setStep(2);
      toast({
        title: "Account created!",
        description: "Please complete your profile to continue",
      });
    }
    setLoading(false);
  };

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    const { error } = await supabase.from('profiles').insert({
      user_id: user.id,
      email: user.email || formData.email,
      is_premium: true,
      country: formData.country,
      gender: formData.gender,
      height: parseInt(formData.height) || null,
      race: formData.race,
      age: parseInt(formData.age) || null
    });

    if (error) {
      toast({
        title: "Profile setup failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile completed!",
        description: "Welcome to Premium Omegle",
      });
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Complete Your Profile</h1>
            <p className="text-muted-foreground mt-2">
              Set up your premium profile for better matching
            </p>
          </div>

          <form onSubmit={handleProfileSetup} className="space-y-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="e.g., United States"
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="18+"
                min="18"
                required
              />
            </div>

            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: e.target.value})}
                placeholder="e.g., 175"
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                placeholder="e.g., 70"
              />
            </div>

            <div>
              <Label htmlFor="race">Race/Ethnicity</Label>
              <Input
                id="race"
                value={formData.race}
                onChange={(e) => setFormData({...formData, race: e.target.value})}
                placeholder="Optional"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Setting up..." : "Complete Profile"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Premium Omegle</h1>
          <p className="text-muted-foreground mt-2">
            {isSignUp ? "Join premium for advanced matching" : "Sign in to your premium account"}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : (isSignUp ? "Sign Up Premium" : "Sign In")}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need premium access? Sign up"}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to main page
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;