import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MapPin, Briefcase, Search, Filter, Clock, TrendingUp, 
  CheckCircle2, XCircle, Eye, Phone, Calendar, AlertCircle,
  Bell, Settings, User, LogOut, Volume2, Menu
} from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  distance: string;
  type: string;
  salary: string;
  posted: string;
  urgent?: boolean;
  vacancies: number;
  applied?: boolean;
  status?: 'applied' | 'viewed' | 'contacted' | 'interview' | 'hired' | 'rejected';
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Security Guard',
    company: 'Sunrise Apartments',
    location: 'Indiranagar, Bangalore',
    distance: '2.5 km',
    type: 'Full-time',
    salary: '₹15,000 - ₹18,000/month',
    posted: '2 hours ago',
    urgent: true,
    vacancies: 2,
  },
  {
    id: '2',
    title: 'Delivery Personnel',
    company: 'QuickShip Logistics',
    location: 'Koramangala, Bangalore',
    distance: '3.8 km',
    type: 'Full-time',
    salary: '₹12,000 - ₹15,000/month',
    posted: '5 hours ago',
    vacancies: 5,
  },
  {
    id: '3',
    title: 'Cook',
    company: 'The Grand Restaurant',
    location: 'MG Road, Bangalore',
    distance: '4.2 km',
    type: 'Full-time',
    salary: '₹18,000 - ₹22,000/month',
    posted: '1 day ago',
    vacancies: 1,
    applied: true,
    status: 'viewed',
  },
];

export function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl">OnSite 360</h1>
                <p className="text-xs text-gray-600">Find your next opportunity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="mt-4 p-3 bg-blue-50 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">
                {isAvailable ? 'Available for Work' : 'Not Available'}
              </span>
            </div>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 rounded-2xl mb-6">
            <TabsTrigger value="jobs" className="rounded-xl">
              <Search className="w-4 h-4 mr-2" />
              Find Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-xl">
              <Briefcase className="w-4 h-4 mr-2" />
              My Applications
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Find Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {/* Search and Filter */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search for jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>

                {showFilters && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="rounded-xl justify-start">
                        <MapPin className="w-4 h-4 mr-2" />
                        Location
                      </Button>
                      <Button variant="outline" className="rounded-xl justify-start">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Job Type
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">127</div>
                  <div className="text-xs text-gray-600">Jobs Nearby</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-gray-600">Urgent Jobs</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-xs text-gray-600">Applied</div>
                </CardContent>
              </Card>
            </div>

            {/* Job Listings */}
            <div className="space-y-3">
              {mockJobs.map((job) => (
                <Card key={job.id} className="rounded-2xl hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          {job.urgent && (
                            <Badge variant="destructive" className="rounded-full text-xs">
                              URGENT
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{job.company}</p>
                      </div>
                      {job.applied && (
                        <Badge variant="outline" className="rounded-full">
                          Applied
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {job.location} <span className="text-blue-600">({job.distance})</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {job.type} • {job.vacancies} {job.vacancies > 1 ? 'positions' : 'position'}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Posted {job.posted}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 rounded-xl" disabled={job.applied}>
                        {job.applied ? 'Applied' : 'Apply Now'}
                      </Button>
                      <Button variant="outline" className="rounded-xl">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockJobs.filter(j => j.applied).map((job) => (
                  <Card key={job.id} className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company}</p>
                        </div>
                        <Badge 
                          variant={job.status === 'viewed' ? 'secondary' : 'default'}
                          className="rounded-full"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl flex-1">
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-xl text-red-600">
                          Withdraw
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Rajesh Kumar</h3>
                  <p className="text-sm text-gray-600">Security Guard • 5 years exp</p>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Settings className="w-4 h-4 mr-2" />
                    App Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
