import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, signOut } from "@/lib/auth";
import { getOrCreateAnonymousUser } from "@/lib/anonymous";
import UpgradeModal from "@/components/UpgradeModal";
import { User } from "@supabase/supabase-js";
import { Crown, Search, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<string[]>([]);
  const [availableInterests, setAvailableInterests] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [anonymousUser, setAnonymousUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

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
      } else {
        // Create anonymous user for browsing
        const anonUser = getOrCreateAnonymousUser();
        setAnonymousUser(anonUser);
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
  navigate('/chat', { state: { chatType: 'text', interests } });
};


  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    setUserProfile(null);
    // Create new anonymous user
    const anonUser = getOrCreateAnonymousUser();
    setAnonymousUser(anonUser);
  };

  const toggleInterest = (interestName: string) => {
    setInterests(prev => 
      prev.includes(interestName) 
        ? prev.filter(i => i !== interestName)
        : [...prev, interestName]
    );
  };

  const handleUpgradeComplete = async () => {
    // Refresh user data after upgrade
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();
      setUserProfile(profile);
      setUser(currentUser);
      setAnonymousUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-primary">Omegale</h1>
          <p className="text-sm text-muted-foreground">Talk to strangers!</p>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            {userProfile?.is_premium && (
              <Badge className="bg-primary">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            )}
            <span className="text-sm text-foreground">
              Welcome, {userProfile?.email || user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {anonymousUser && (
              <Badge variant="outline">
                👤 Anonymous
              </Badge>
            )}
            <Button onClick={() => setShowUpgradeModal(true)}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </div>
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

        {/* Browse Partners Section */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/browse')}
            variant="outline"
            className="w-full py-3 mb-4"
          >
            <Search className="w-4 h-4 mr-2" />
            Browse Partners
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {user ? "Find partners with advanced filters" : "Browse anonymously or upgrade for advanced filters"}
          </p>
        </div>

        {!user && anonymousUser && (
          <div className="text-center mb-6 p-4 bg-primary/10 border border-primary/20 rounded">
            <p className="text-sm text-foreground mb-2">
              <strong>Browsing Anonymously</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              You can browse partners anonymously. Sign up for premium to unlock advanced filters and start chatting.
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
  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-medium py-3"
>
  Start Text Chat
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

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeComplete={handleUpgradeComplete}
      />
    </div>
  );
};

export default Index;