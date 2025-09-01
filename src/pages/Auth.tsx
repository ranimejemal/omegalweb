import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
=======
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
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
<<<<<<< HEAD
  const [step, setStep] = useState(1); // Step 1: Auth, Step 2: Profile Setup

=======
  const [step, setStep] = useState(1); // 1: auth, 2: profile setup
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    country: "",
    gender: "",
<<<<<<< HEAD
    age: "",
    ageRangeMin: "",
    ageRangeMax: "",
    heightMin: "",
    heightMax: "",
    race: "",
    religion: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          checkUserProfile(session.user.id);
        }
      }
    );
=======
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
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
<<<<<<< HEAD
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profile && profile.country && profile.gender) {
      navigate("/");
    } else {
=======
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profile && profile.country && profile.gender) {
      // Profile is complete, go to main page
      navigate('/');
    } else {
      // Profile needs completion
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
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
<<<<<<< HEAD
      setUser(data.user);
      setStep(2);
      toast({
        title: "Account created!",
        description: "Complete your profile to continue",
=======
      // Move to profile setup step
      setStep(2);
      toast({
        title: "Account created!",
        description: "Please complete your profile to continue",
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
      });
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      setUser(data.user);
      checkUserProfile(data.user.id);
    }
    setLoading(false);
  };

  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from("profiles").insert({
=======
  const handleProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    const { error } = await supabase.from('profiles').insert({
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
      user_id: user.id,
      email: user.email || formData.email,
      is_premium: true,
      country: formData.country,
      gender: formData.gender,
<<<<<<< HEAD
      age: parseInt(formData.age) || null,
      age_range_min: parseInt(formData.ageRangeMin) || null,
      age_range_max: parseInt(formData.ageRangeMax) || null,
      height_min: parseInt(formData.heightMin) || null,
      height_max: parseInt(formData.heightMax) || null,
      race: formData.race || null,
      religion: formData.religion || null, // Make sure this column exists in your DB
=======
      height: parseInt(formData.height) || null,
      race: formData.race,
      age: parseInt(formData.age) || null
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
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
<<<<<<< HEAD
      navigate("/");
=======
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
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
    }
    setLoading(false);
  };

<<<<<<< HEAD
  // STEP 2: PROFILE SETUP
=======
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
  if (step === 2) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Complete Your Profile</h1>
            <p className="text-muted-foreground mt-2">
<<<<<<< HEAD
              Fill in your details for better matching
=======
              Set up your premium profile for better matching
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
            </p>
          </div>

          <form onSubmit={handleProfileSetup} className="space-y-4">
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
=======
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                placeholder="e.g., United States"
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
                required
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender *</Label>
<<<<<<< HEAD
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
=======
              <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
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
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
=======
                onChange={(e) => setFormData({...formData, age: e.target.value})}
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
                placeholder="18+"
                min="18"
                required
              />
            </div>

<<<<<<< HEAD
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="ageRangeMin">Min Age Preference</Label>
                <Input
                  id="ageRangeMin"
                  type="number"
                  value={formData.ageRangeMin}
                  onChange={(e) =>
                    setFormData({ ...formData, ageRangeMin: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="ageRangeMax">Max Age Preference</Label>
                <Input
                  id="ageRangeMax"
                  type="number"
                  value={formData.ageRangeMax}
                  onChange={(e) =>
                    setFormData({ ...formData, ageRangeMax: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="heightMin">Min Height (cm)</Label>
                <Input
                  id="heightMin"
                  type="number"
                  value={formData.heightMin}
                  onChange={(e) =>
                    setFormData({ ...formData, heightMin: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="heightMax">Max Height (cm)</Label>
                <Input
                  id="heightMax"
                  type="number"
                  value={formData.heightMax}
                  onChange={(e) =>
                    setFormData({ ...formData, heightMax: e.target.value })
                  }
                />
              </div>
=======
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
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
            </div>

            <div>
              <Label htmlFor="race">Race/Ethnicity</Label>
              <Input
                id="race"
                value={formData.race}
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, race: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="religion">Religion</Label>
              <Input
                id="religion"
                value={formData.religion}
                onChange={(e) =>
                  setFormData({ ...formData, religion: e.target.value })
                }
=======
                onChange={(e) => setFormData({...formData, race: e.target.value})}
                placeholder="Optional"
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
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

<<<<<<< HEAD
  // STEP 1: SIGN UP / SIGN IN
=======
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Premium Omegle</h1>
          <p className="text-muted-foreground mt-2">
<<<<<<< HEAD
            {isSignUp
              ? "Join premium for advanced matching"
              : "Sign in to your premium account"}
          </p>
        </div>

        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="space-y-4"
        >
=======
            {isSignUp ? "Join premium for advanced matching" : "Sign in to your premium account"}
          </p>
        </div>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
<<<<<<< HEAD
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
=======
              onChange={(e) => setFormData({...formData, email: e.target.value})}
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
<<<<<<< HEAD
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
=======
              onChange={(e) => setFormData({...formData, password: e.target.value})}
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
<<<<<<< HEAD
            {loading
              ? "Loading..."
              : isSignUp
              ? "Sign Up Premium"
              : "Sign In"}
=======
            {loading ? "Loading..." : (isSignUp ? "Sign Up Premium" : "Sign In")}
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
<<<<<<< HEAD
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need premium access? Sign up"}
=======
            {isSignUp ? "Already have an account? Sign in" : "Need premium access? Sign up"}
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
<<<<<<< HEAD
            onClick={() => navigate("/")}
=======
            onClick={() => navigate('/')}
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
            className="text-muted-foreground hover:text-foreground"
          >
            Back to main page
          </button>
        </div>
      </Card>
    </div>
  );
};

<<<<<<< HEAD
export default Auth;
=======
export default Auth;
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
