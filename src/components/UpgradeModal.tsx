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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'signup' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Upgrade to Premium</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Create an account to unlock advanced partner matching filters
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
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
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </div>
          </>
        )}

        {step === 'profile' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Complete Your Profile</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
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
                    value={profileData.age}
                    onChange={(e) => setProfileData({...profileData, age: e.target.value})}
                    placeholder="18+"
                    min="18"
                    required
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
                  />
                </div>

                <div>
                  <Label htmlFor="race">Race/Ethnicity</Label>
                  <Input
                    id="race"
                    value={profileData.race}
                    onChange={(e) => setProfileData({...profileData, race: e.target.value})}
                    placeholder="Optional"
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
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving Profile..." : "Continue to Payment"}
              </Button>
            </form>
          </>
        )}

        {step === 'payment' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Choose Your Plan</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  } ${plan.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPlan(plan.id as 'premium' | 'premium-plus')}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-primary" />
                        {plan.name}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{plan.price}</div>
                        <div className="text-sm text-muted-foreground">{plan.period}</div>
                      </div>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}

              <div className="pt-4">
                <Button 
                  onClick={handlePayment} 
                  className="w-full" 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? "Processing..." : `Upgrade to ${plans.find(p => p.id === selectedPlan)?.name} ${plans.find(p => p.id === selectedPlan)?.price}/month`}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  * This is a demo. No actual payment will be processed.
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;