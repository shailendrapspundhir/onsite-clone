import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { 
  Search, Filter, MapPin, Briefcase, DollarSign, Clock,
  SlidersHorizontal, X, CheckCircle2, TrendingUp, Star,
  AlertCircle, Calendar
} from 'lucide-react';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface FilterState {
  location: string;
  radius: number;
  jobTypes: string[];
  salaryRange: [number, number];
  experience: string;
  urgentOnly: boolean;
  verifiedOnly: boolean;
  sortBy: string;
}

const jobCategories = [
  'Security Guard',
  'Cook',
  'Cleaner',
  'Delivery Personnel',
  'Helper',
  'Labourer',
  'Driver',
  'Store Helper',
];

export function SearchFilterDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    radius: 10,
    jobTypes: [],
    salaryRange: [0, 50000],
    experience: 'any',
    urgentOnly: false,
    verifiedOnly: false,
    sortBy: 'relevance',
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleJobTypeToggle = (jobType: string) => {
    setFilters(prev => ({
      ...prev,
      jobTypes: prev.jobTypes.includes(jobType)
        ? prev.jobTypes.filter(t => t !== jobType)
        : [...prev.jobTypes, jobType]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      location: '',
      radius: 10,
      jobTypes: [],
      salaryRange: [0, 50000],
      experience: 'any',
      urgentOnly: false,
      verifiedOnly: false,
      sortBy: 'relevance',
    });
    setActiveFiltersCount(0);
  };

  const applyFilters = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.jobTypes.length > 0) count++;
    if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 50000) count++;
    if (filters.experience !== 'any') count++;
    if (filters.urgentOnly) count++;
    if (filters.verifiedOnly) count++;
    setActiveFiltersCount(count);
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-2">Advanced Search & Filters</h1>
            <p className="text-gray-600">
              Discover jobs with powerful search and filtering capabilities
            </p>
          </CardContent>
        </Card>

        {/* Search Bar with Filters */}
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search for jobs, skills, or companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 rounded-2xl h-14 text-lg"
                />
              </div>
              
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="rounded-2xl h-14 px-6 relative"
                  >
                    <SlidersHorizontal className="w-5 h-5 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 rounded-full w-6 h-6 p-0 flex items-center justify-center">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-2xl">Filter Jobs</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect job
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Location Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        placeholder="Enter city or area"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        className="rounded-xl"
                      />
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">
                          Radius: {filters.radius} km
                        </Label>
                        <Slider
                          value={[filters.radius]}
                          onValueChange={(value) => setFilters({ ...filters, radius: value[0] })}
                          min={1}
                          max={50}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Job Type Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Job Categories
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {jobCategories.map((category) => (
                          <div
                            key={category}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              filters.jobTypes.includes(category)
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => handleJobTypeToggle(category)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{category}</span>
                              {filters.jobTypes.includes(category) && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Salary Range Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Salary Range (per month)
                      </Label>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>₹{filters.salaryRange[0].toLocaleString()}</span>
                        <span>-</span>
                        <span>₹{filters.salaryRange[1].toLocaleString()}</span>
                      </div>
                      <Slider
                        value={filters.salaryRange}
                        onValueChange={(value) => setFilters({ ...filters, salaryRange: value as [number, number] })}
                        min={0}
                        max={50000}
                        step={1000}
                        className="w-full"
                      />
                    </div>

                    {/* Experience Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Experience Level
                      </Label>
                      <RadioGroup
                        value={filters.experience}
                        onValueChange={(value) => setFilters({ ...filters, experience: value })}
                      >
                        <div className="space-y-2">
                          {[
                            { value: 'any', label: 'Any Experience' },
                            { value: 'entry', label: 'Entry Level (0-2 years)' },
                            { value: 'mid', label: 'Mid Level (2-5 years)' },
                            { value: 'senior', label: 'Senior Level (5+ years)' },
                          ].map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2 p-3 rounded-xl border hover:bg-gray-50"
                            >
                              <RadioGroupItem value={option.value} id={option.value} />
                              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Quick Filters */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Quick Filters
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-3 rounded-xl border hover:bg-gray-50">
                          <Checkbox
                            id="urgent"
                            checked={filters.urgentOnly}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, urgentOnly: checked as boolean })
                            }
                          />
                          <Label htmlFor="urgent" className="flex-1 cursor-pointer flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            Urgent Jobs Only
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-xl border hover:bg-gray-50">
                          <Checkbox
                            id="verified"
                            checked={filters.verifiedOnly}
                            onCheckedChange={(checked) =>
                              setFilters({ ...filters, verifiedOnly: checked as boolean })
                            }
                          />
                          <Label htmlFor="verified" className="flex-1 cursor-pointer flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Verified Employers Only
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Sort By
                      </Label>
                      <RadioGroup
                        value={filters.sortBy}
                        onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                      >
                        <div className="space-y-2">
                          {[
                            { value: 'relevance', label: 'Most Relevant' },
                            { value: 'recent', label: 'Most Recent' },
                            { value: 'distance', label: 'Nearest First' },
                            { value: 'salary-high', label: 'Highest Salary' },
                          ].map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center space-x-2 p-3 rounded-xl border hover:bg-gray-50"
                            >
                              <RadioGroupItem value={option.value} id={option.value} />
                              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t space-y-3">
                    <Button onClick={applyFilters} className="w-full rounded-xl h-12">
                      Apply Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="w-full rounded-xl h-12"
                    >
                      Clear All
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Button className="rounded-2xl h-14 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.location && (
                  <Badge variant="secondary" className="rounded-full">
                    <MapPin className="w-3 h-3 mr-1" />
                    {filters.location}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => setFilters({ ...filters, location: '' })}
                    />
                  </Badge>
                )}
                {filters.jobTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="rounded-full">
                    {type}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => handleJobTypeToggle(type)}
                    />
                  </Badge>
                ))}
                {filters.urgentOnly && (
                  <Badge variant="secondary" className="rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Urgent Only
                  </Badge>
                )}
                {filters.verifiedOnly && (
                  <Badge variant="secondary" className="rounded-full">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Only
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs rounded-full"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="rounded-2xl">
            <CardContent className="p-4 text-center">
              <Search className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <p className="font-semibold text-2xl mb-1">127</p>
              <p className="text-sm text-gray-600">Jobs Found</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <p className="font-semibold text-2xl mb-1">2.5 km</p>
              <p className="text-sm text-gray-600">Average Distance</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4 text-center">
              <Clock className="w-12 h-12 mx-auto mb-3 text-purple-600" />
              <p className="font-semibold text-2xl mb-1">15</p>
              <p className="text-sm text-gray-600">Posted Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Demonstration Info */}
        <Card className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Search & Filter Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Location-Based Search</p>
                  <p className="text-sm text-gray-600">
                    Find jobs within a specific radius from your location
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Multi-Category Filtering</p>
                  <p className="text-sm text-gray-600">
                    Filter by job type, salary range, and experience level
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Urgent Job Alerts</p>
                  <p className="text-sm text-gray-600">
                    Quick filter to find jobs that need immediate filling
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Smart Sorting</p>
                  <p className="text-sm text-gray-600">
                    Sort by relevance, distance, salary, or posting date
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
