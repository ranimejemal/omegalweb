import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateAnonymousUser } from "@/lib/anonymous";
import AdvancedFilters from "@/components/AdvancedFilters";
import UpgradeModal from "@/components/UpgradeModal";
import { Crown } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
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

  useEffect(() => {
    const initializeUser = async () => {
      const currentUser = await getCurrentUser();
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
    };

    initializeUser();
  }, []);

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
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgradeComplete={handleUpgradeComplete}
      />
    </div>
  );
};

export default Browse;
