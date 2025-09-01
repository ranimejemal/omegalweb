import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Crown, Filter } from "lucide-react";

interface AdvancedFiltersProps {
  isPremium: boolean;
  onFiltersChange: (filters: any) => void;
  onUpgradeClick: () => void;
}

const AdvancedFilters = ({ isPremium, onFiltersChange, onUpgradeClick }: AdvancedFiltersProps) => {
  const [filters, setFilters] = useState({
    gender: "",
    country: "",
    ageRange: [18, 65],
    heightRange: [150, 200],
    race: "",
    religion: ""
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

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