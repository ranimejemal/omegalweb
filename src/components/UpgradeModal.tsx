import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { clearAnonymousUser } from "@/lib/anonymous";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeComplete: () => void;
}

const UpgradeModal = ({ isOpen, onClose, onUpgradeComplete }: UpgradeModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'signup' | 'profile' | 'payment'>('signup');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [signupData, setSignupData] = useState({
    email: "",
    password: ""
  });
  
  const [profileData, setProfileData] = useState({
    gender: "",
    country: "",
    height: "",
    race: "",
    religion: "",
    age: ""
  });

  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'premium-plus'>('premium');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setStep('profile');
        toast({
          title: "Account created!",
          description: "Please complete your profile to continue",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase.from('profiles').insert({
        user_id: user.id,
        email: user.email || signupData.email,
        gender: profileData.gender,
        country: profileData.country,
        height: parseInt(profileData.height) || null,
        race: profileData.race,
        religion: profileData.religion,
        age: parseInt(profileData.age) || null,
        is_premium: false
      });

      if (error) throw error;

      setStep('payment');
      toast({
        title: "Profile saved!",
        description: "Choose your plan to unlock premium features",
      });
    } catch (error: any) {
      toast({
        title: "Profile setup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!user) return;
    
    setLoading(true);

    try {
      // For demo purposes, we'll simulate payment success
      // In production, integrate with Stripe here
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear anonymous user data
      clearAnonymousUser();
      
      toast({
        title: "Payment successful!",
        description: "Welcome to Premium! You now have access to advanced filters.",
      });
      
      onUpgradeComplete();
      onClose();
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      description: 'Advanced matching filters',
      features: [
        'Gender filtering',
        'Country selection',
        'Age range filtering',
        'Height preferences',
        'Race preferences',
        'Priority matching'
      ],
      popular: false
    },
    {
      id: 'premium-plus',
      name: 'Premium+',
      price: '$19.99',
      period: '/month',
      description: 'Everything in Premium plus exclusive features',
      features: [
        'All Premium features',
        'Religion filtering',
        'Education level filtering',
        'Profession filtering',
        'Interest-based matching',
        'Video chat priority',
        'No ads'
      ],
      popular: true
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-blue-50 to-blue-100 p-6 rounded-xl shadow-2xl">
  {step === 'signup' && (
    <>
      <DialogHeader>
  <DialogTitle className="text-center flex items-center justify-center gap-2 text-yellow-400 font-bold text-xl">
    Upgrade Premium
    <Crown className="w-5 h-5 text-yellow-400" />
  </DialogTitle>
</DialogHeader>

      
      <div className="space-y-6">
        <p className="text-center text-blue-600">
          Create an account to unlock <span className="font-semibold text-blue-600">advanced partner matching filters</span>
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={signupData.email}
              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
              required
              className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={signupData.password}
              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
              required
              minLength={6}
              className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </>
  )}

  {step === 'profile' && (
    <form onSubmit={handleProfileSubmit} className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-center text-blue-800 font-extrabold">Complete Your Profile</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
            <SelectTrigger className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200">
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
            value={profileData.age}
            onChange={(e) => setProfileData({...profileData, age: e.target.value})}
            placeholder="18+"
            min="18"
            required
            className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Country *</Label>
        <Input
          id="country"
          value={profileData.country}
          onChange={(e) => setProfileData({...profileData, country: e.target.value})}
          placeholder="e.g., United States"
          required
          className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            value={profileData.height}
            onChange={(e) => setProfileData({...profileData, height: e.target.value})}
            placeholder="e.g., 175"
            className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
          />
        </div>

        <div>
          <Label htmlFor="race">Race/Ethnicity</Label>
          <Input
            id="race"
            value={profileData.race}
            onChange={(e) => setProfileData({...profileData, race: e.target.value})}
            placeholder="Optional"
            className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="religion">Religion</Label>
        <Input
          id="religion"
          value={profileData.religion}
          onChange={(e) => setProfileData({...profileData, religion: e.target.value})}
          placeholder="Optional"
          className="border-blue-400 focus:border-yellow-400 focus:ring-yellow-200"
        />
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-black font-bold">
        {loading ? "Saving Profile..." : "Continue to Payment"}
      </Button>
    </form>
  )}

  {step === 'payment' && (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-center text-blue-800 font-extrabold">Choose Your Plan</DialogTitle>
      </DialogHeader>

      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`cursor-pointer transition-all border-2 rounded-xl ${
            selectedPlan === plan.id 
              ? 'border-yellow-400 ring-2 ring-yellow-300 shadow-lg'
              : 'border-blue-300 hover:border-yellow-200'
          } relative`}
          onClick={() => setSelectedPlan(plan.id as 'premium' | 'premium-plus')}
        >
          {plan.popular && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 font-bold px-2 py-1 rounded-full shadow-md">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          )}

          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-800 font-bold">
                <Crown className="w-5 h-5 text-black" />
                {plan.name}
              </CardTitle>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-blue-900">{plan.price}</div>
                <div className="text-sm text-blue-600">{plan.period}</div>
              </div>
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-blue-700">
                  <Check className="w-4 h-4 text-black" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      <Button 
        onClick={handlePayment} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-black font-bold py-3 mt-4"
        size="lg"
        disabled={loading}
      >
        {loading ? "Processing..." : `Upgrade to ${plans.find(p => p.id === selectedPlan)?.name}`}
      </Button>
    </div>
  )}
</DialogContent>

    </Dialog>
  );
};

export default UpgradeModal;