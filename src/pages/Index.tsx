import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, signOut } from "@/lib/auth";
import { User } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<string[]>([]);
  const [availableInterests, setAvailableInterests] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        setUserProfile(profile);
      }
    };
    
    checkAuth();
    
    // Fetch available interests
    const fetchInterests = async () => {
      const { data } = await supabase.from('interests').select('*');
      if (data) setAvailableInterests(data);
    };
    fetchInterests();
  }, []);

  const startTextChat = () => {
    if (!user || !userProfile) {
      navigate('/auth');
      return;
    }
    navigate('/chat', { state: { chatType: 'text', interests } });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUserProfile(null);
  };

  const toggleInterest = (interestName: string) => {
    setInterests(prev => 
      prev.includes(interestName) 
        ? prev.filter(i => i !== interestName)
        : [...prev, interestName]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-primary">Omegle Premium</h1>
          <p className="text-sm text-muted-foreground">Talk to strangers!</p>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground">
              Welcome, {userProfile?.email || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Warning Notice */}
        <div className="bg-destructive/10 border border-destructive/20 p-4 mb-6 text-center">
          <p className="text-sm text-foreground">
            <strong>Please be safe and responsible.</strong><br />
            Omegle connects you with strangers. Please don't share personal information,
            and remember that conversations are not monitored. You must be 18+ or have
            parental permission.
          </p>
        </div>

        {!user && (
          <div className="text-center mb-6 p-4 bg-primary/10 border border-primary/20 rounded">
            <p className="text-sm text-foreground mb-2">
              <strong>Premium Features Required</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Sign up for premium access to chat with real users and use advanced matching filters.
            </p>
          </div>
        )}

        {/* Interests */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-foreground">
            Select your interests (Optional)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {availableInterests.map((interest) => (
              <Button
                key={interest.id}
                type="button"
                variant={interests.includes(interest.name) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleInterest(interest.name)}
                className="text-xs"
              >
                {interest.name}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selecting interests helps match you with like-minded strangers
          </p>
        </div>

        {/* Chat Buttons */}
        <div className="space-y-2 mb-8">
          <Button 
            onClick={startTextChat}
            disabled={!user || !userProfile}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-3"
          >
            {user ? "Start Text Chat" : "Sign In to Chat"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full py-3"
            disabled
          >
            Video (Coming Soon)
          </Button>
        </div>

        {/* Simple info text */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Omegle (oh·meg·ull) is a great way to meet new friends.</p>
          <p>When you use Omegle, we pick someone else at random and let you talk one-on-one.</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-6">
          <p className="text-xs text-muted-foreground">
            © 2024 Omegle. Talk to strangers responsibly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;