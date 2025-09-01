import { useState, useEffect } from "react";
<<<<<<< HEAD
=======
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateAnonymousUser } from "@/lib/anonymous";
import AdvancedFilters from "@/components/AdvancedFilters";
import UpgradeModal from "@/components/UpgradeModal";
<<<<<<< HEAD
import { Crown } from "lucide-react";
=======
import { Crown, MessageCircle, Users } from "lucide-react";
import { toast } from "sonner";
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe

interface Profile {
  id: string;
  user_id: string;
<<<<<<< HEAD
  is_premium: boolean;
}

interface Filters {
  gender?: string;
  country?: string;
  ageRange?: [number, number];
  heightRange?: [number, number];
  race?: string;
  religion?: string;
}

const Browse = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [anonymousUser, setAnonymousUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({});
=======
  gender: string;
  country: string;
  age: number;
  height: number;
  race: string;
  religion: string;
  is_premium: boolean;
}

const Browse = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [anonymousUser, setAnonymousUser] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [filters, setFilters] = useState<any>({});
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe

  useEffect(() => {
    const initializeUser = async () => {
      const currentUser = await getCurrentUser();
<<<<<<< HEAD
      if (currentUser) {
        setUser(currentUser);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();
        if (profile) setUserProfile(profile);
      } else {
        const anonUser = getOrCreateAnonymousUser();
        setAnonymousUser(anonUser);
      }
=======
      
      if (currentUser) {
        setUser(currentUser);
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        setUserProfile(profile);
      } else {
        // Create or get anonymous user
        const anonUser = getOrCreateAnonymousUser();
        setAnonymousUser(anonUser);
      }
      
      loadProfiles();
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
    };

    initializeUser();
  }, []);

<<<<<<< HEAD
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Profiles are not being loaded anymore
  };

  const handleUpgradeComplete = async () => {
    const currentUser = await getCurrentUser();
    if (currentUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();
      if (profile) {
        setUserProfile(profile);
        setUser(currentUser);
        setAnonymousUser(null);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900">
      {/* Header */}
<div className="border-b border-white px-6 py-4 flex justify-between items-center">
  <div>
    <h1 className="text-xl font-bold">Browse Partners</h1>
    <p className="text-sm">
      {anonymousUser
        ? "Browsing anonymously"
        : user
        ? `Welcome, ${userProfile?.user_id || user.email}`
        : "Find your perfect chat partner"}
    </p>
  </div>

  <div className="flex items-center gap-4">
    {userProfile?.is_premium && (
      <Badge className="bg-yellow-400 text-purple-800 flex items-center">
        <Crown className="w-3 h-3 mr-1" />
        Premium
      </Badge>
    )}

    {/* Go Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="ml-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
    >
      Go Back
    </button>
  </div>
</div>


      {/* Premium Filters */}
<div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded">
  <AdvancedFilters
    isPremium={userProfile?.is_premium || false}
    onFiltersChange={handleFiltersChange}
    onUpgradeClick={() => setShowUpgradeModal(true)}
  />
</div>


      {/* Upgrade Modal */}
=======
  const loadProfiles = async (searchFilters = {}) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .limit(20);

      // Apply filters if user is premium
      if (userProfile?.is_premium && Object.keys(searchFilters).length > 0) {
        if (searchFilters.gender) {
          query = query.eq('gender', searchFilters.gender);
        }
        if (searchFilters.country) {
          query = query.ilike('country', `%${searchFilters.country}%`);
        }
        if (searchFilters.ageRange) {
          query = query.gte('age', searchFilters.ageRange[0]).lte('age', searchFilters.ageRange[1]);
        }
        if (searchFilters.heightRange) {
          query = query.gte('height', searchFilters.heightRange[0]).lte('height', searchFilters.heightRange[1]);
        }
        if (searchFilters.race) {
          query = query.ilike('race', `%${searchFilters.race}%`);
        }
        if (searchFilters.religion) {
          query = query.ilike('religion', `%${searchFilters.religion}%`);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    loadProfiles(newFilters);
  };

  const handleUpgradeComplete = async () => {
    // Refresh user data
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

  const startChatWithUser = (targetUserId: string) => {
    if (!user && !anonymousUser) {
      setShowUpgradeModal(true);
      return;
    }
    
    if (anonymousUser) {
      toast.info("Sign up to start chatting with other users!");
      setShowUpgradeModal(true);
      return;
    }

    navigate('/chat', { 
      state: { 
        chatType: 'text', 
        interests: [],
        targetUserId 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex justify-between items-center bg-background">
        <div>
          <h1 className="text-lg font-bold text-primary">Browse Partners</h1>
          <p className="text-xs text-muted-foreground">
            {anonymousUser ? "Browsing anonymously" : 
             user ? `Welcome, ${userProfile?.email || user.email}` : 
             "Find your perfect chat partner"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {userProfile?.is_premium && (
            <Badge className="bg-primary">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
          
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            Back to Chat
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AdvancedFilters
              isPremium={userProfile?.is_premium || false}
              onFiltersChange={handleFiltersChange}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          </div>

          {/* Profiles Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Available Partners</h2>
                <Badge variant="outline">{profiles.length} online</Badge>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded"></div>
                        <div className="h-3 bg-muted rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-base">
                          {profile.gender === 'male' ? '👨' : profile.gender === 'female' ? '👩' : '🧑'} 
                          {profile.age ? ` ${profile.age}` : ' Unknown age'}
                        </span>
                        {profile.is_premium && (
                          <Badge variant="outline" className="text-xs">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1 text-sm">
                        {profile.country && (
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">📍</span>
                            {profile.country}
                          </p>
                        )}
                        {profile.height && (
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">📏</span>
                            {profile.height} cm
                          </p>
                        )}
                        {profile.race && (
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">🌍</span>
                            {profile.race}
                          </p>
                        )}
                        {profile.religion && (
                          <p className="flex items-center gap-2">
                            <span className="text-muted-foreground">🙏</span>
                            {profile.religion}
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        onClick={() => startChatWithUser(profile.user_id)}
                        className="w-full"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && profiles.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No partners found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or check back later
                  </p>
                  <Button variant="outline" onClick={() => loadProfiles()}>
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeComplete={handleUpgradeComplete}
      />
    </div>
  );
};

<<<<<<< HEAD
export default Browse;
=======
export default Browse;
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
