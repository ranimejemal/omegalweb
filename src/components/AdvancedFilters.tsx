import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Crown, Filter } from "lucide-react";
<<<<<<< HEAD
import { motion } from "framer-motion";

interface AdvancedFiltersPageProps {
=======

interface AdvancedFiltersProps {
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
  isPremium: boolean;
  onFiltersChange: (filters: any) => void;
  onUpgradeClick: () => void;
}

<<<<<<< HEAD
export default function AdvancedFiltersPage({
  isPremium,
  onFiltersChange,
  onUpgradeClick,
}: AdvancedFiltersPageProps) {
=======
const AdvancedFilters = ({ isPremium, onFiltersChange, onUpgradeClick }: AdvancedFiltersProps) => {
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
  const [filters, setFilters] = useState({
    gender: "",
    country: "",
    ageRange: [18, 65],
    heightRange: [150, 200],
    race: "",
<<<<<<< HEAD
    religion: "",
=======
    religion: ""
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

<<<<<<< HEAD
  return (
    <div className="relative min-h-screen w-full bg-white flex items-start justify-center p-4">
  {/* Center Card slightly from top */}
  <motion.div
    initial={{ y: -20, scale: 0.95, opacity: 0 }}
    animate={{ y: 0, scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="z-10 max-w-lg w-full mt-12"
  >
    <Card className="border-none shadow-2xl backdrop-blur-md bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
              <Filter className="w-6 h-6 text-yellow-500" />
              {isPremium ? "Advanced Filters" : "Premium Filters"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isPremium ? (
              <div className="text-center space-y-4">
                <p className="text-white">
                  Unlock advanced partner matching with gender, country, age, and more filters
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className=" text-white">Gender</Badge>
                  <Badge variant="outline" className=" text-white">Country</Badge>
                  <Badge variant="outline" className=" text-white">Age</Badge>
                  <Badge variant="outline" className=" text-white">Height</Badge>
                  <Badge variant="outline" className=" text-white">Race</Badge>
                  <Badge variant="outline" className=" text-white">Religion</Badge>
                </div>
                <Button 
                  onClick={onUpgradeClick} 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold mt-2 flex items-center justify-center"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade for Advanced Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Gender */}
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={filters.gender} onValueChange={(value) => handleFilterChange("gender", value)}>
                    <SelectTrigger className="border-blue-300 focus:border-yellow-400 focus:ring-yellow-200">
                      <SelectValue placeholder="Any gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={filters.country}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                    placeholder="Any country"
                    className="border-blue-300 focus:border-yellow-400 focus:ring-yellow-200"
                  />
                </div>

                {/* Age */}
                <div>
                  <Label>
                    Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years
                  </Label>
                  <Slider
                    value={filters.ageRange}
                    onValueChange={(value) => handleFilterChange("ageRange", value)}
                    max={65}
                    min={18}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Height */}
                <div>
                  <Label>
                    Height Range: {filters.heightRange[0]} - {filters.heightRange[1]} cm
                  </Label>
                  <Slider
                    value={filters.heightRange}
                    onValueChange={(value) => handleFilterChange("heightRange", value)}
                    max={220}
                    min={140}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Race & Religion */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="race">Race/Ethnicity</Label>
                    <Input
                      id="race"
                      value={filters.race}
                      onChange={(e) => handleFilterChange("race", e.target.value)}
                      placeholder="Any race"
                      className="border-blue-300 focus:border-yellow-400 focus:ring-yellow-200"
                    />
                  </div>

                  <div>
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={filters.religion}
                      onChange={(e) => handleFilterChange("religion", e.target.value)}
                      placeholder="Any religion"
                      className="border-blue-300 focus:border-yellow-400 focus:ring-yellow-200"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
=======
  const clearFilters = () => {
    const clearedFilters = {
      gender: "",
      country: "",
      ageRange: [18, 65],
      heightRange: [150, 200],
      race: "",
      religion: ""
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!isPremium) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Crown className="w-5 h-5" />
            Premium Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Unlock advanced partner matching with gender, country, age, and more filters
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Gender</Badge>
              <Badge variant="outline">Country</Badge>
              <Badge variant="outline">Age Range</Badge>
              <Badge variant="outline">Height</Badge>
              <Badge variant="outline">Race</Badge>
              <Badge variant="outline">Religion</Badge>
            </div>
            <Button onClick={onUpgradeClick} className="w-full">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade for Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Advanced Filters
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filter-gender">Gender</Label>
            <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any gender</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="filter-country">Country</Label>
            <Input
              id="filter-country"
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              placeholder="Any country"
            />
          </div>
        </div>

        <div>
          <Label>Age Range: {filters.ageRange[0]} - {filters.ageRange[1]} years</Label>
          <Slider
            value={filters.ageRange}
            onValueChange={(value) => handleFilterChange('ageRange', value)}
            max={65}
            min={18}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Height Range: {filters.heightRange[0]} - {filters.heightRange[1]} cm</Label>
          <Slider
            value={filters.heightRange}
            onValueChange={(value) => handleFilterChange('heightRange', value)}
            max={220}
            min={140}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="filter-race">Race/Ethnicity</Label>
            <Input
              id="filter-race"
              value={filters.race}
              onChange={(e) => handleFilterChange('race', e.target.value)}
              placeholder="Any race"
            />
          </div>

          <div>
            <Label htmlFor="filter-religion">Religion</Label>
            <Input
              id="filter-religion"
              value={filters.religion}
              onChange={(e) => handleFilterChange('religion', e.target.value)}
              placeholder="Any religion"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
>>>>>>> 00f723431a14e79ef9c5cd80b170d2571fe2cafe
