import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Search, Filter, Users, Briefcase, CreditCard, Plus,
  MapPin, Star, Clock, Eye, MessageSquare, Bell, Settings,
  User, Menu, TrendingUp, CheckCircle2, XCircle, Package
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Worker {
  id: string;
  name: string;
  role: string;
  experience: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  skills: string[];
  verified: boolean;
  unlocked?: boolean;
  lastActive: string;
}

interface JobPost {
  id: string;
  title: string;
  vacancies: number;
  applicants: number;
  posted: string;
  status: 'active' | 'closed' | 'draft';
  views: number;
}

const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'R***h K***r',
    role: 'Security Guard',
    experience: '5 years',
    location: 'Indiranagar, Bangalore',
    distance: '2.5 km',
    rating: 4.8,
    reviews: 23,
    skills: ['Night Shift', 'CCTV Monitoring', 'First Aid'],
    verified: true,
    unlocked: false,
    lastActive: '2 hours ago',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Cook',
    experience: '3 years',
    location: 'Koramangala, Bangalore',
    distance: '3.2 km',
    rating: 4.9,
    reviews: 45,
    skills: ['North Indian', 'South Indian', 'Continental'],
    verified: true,
    unlocked: true,
    lastActive: 'Active now',
  },
];

const mockJobPosts: JobPost[] = [
  {
    id: '1',
    title: 'Security Guard - Night Shift',
    vacancies: 2,
    applicants: 15,
    posted: '2 hours ago',
    status: 'active',
    views: 127,
  },
  {
    id: '2',
    title: 'Delivery Personnel',
    vacancies: 5,
    applicants: 8,
    posted: '1 day ago',
    status: 'active',
    views: 89,
  },
];

export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('discover');
  const [credits, setCredits] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

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
                <p className="text-xs text-gray-600">Employer Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Credits Display */}
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-bold">{credits}</span>
                <span className="text-xs">Credits</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 rounded-2xl mb-6">
            <TabsTrigger value="discover" className="rounded-xl">
              <Search className="w-4 h-4 mr-2" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-xl">
              <Briefcase className="w-4 h-4 mr-2" />
              My Jobs
            </TabsTrigger>
            <TabsTrigger value="credits" className="rounded-xl">
              <CreditCard className="w-4 h-4 mr-2" />
              Credits
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Discover Workers Tab */}
          <TabsContent value="discover" className="space-y-4">
            {/* Search and Filter */}
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search for workers by role, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="rounded-full">Security Guard</Badge>
                  <Badge variant="secondary" className="rounded-full">Cook</Badge>
                  <Badge variant="secondary" className="rounded-full">Cleaner</Badge>
                  <Badge variant="secondary" className="rounded-full">Delivery</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold">342</div>
                  <div className="text-xs text-gray-600">Workers Nearby</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-xs text-gray-600">Unlocked Profiles</div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold">15</div>
                  <div className="text-xs text-gray-600">Applications</div>
                </CardContent>
              </Card>
            </div>

            {/* Worker Listings */}
            <div className="space-y-3">
              {mockWorkers.map((worker) => (
                <Card key={worker.id} className="rounded-2xl hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="w-16 h-16 rounded-2xl">
                        <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {worker.unlocked ? worker.name.split(' ').map(n => n[0]).join('') : '?'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {worker.unlocked ? worker.name : worker.name}
                              </h3>
                              {worker.verified && (
                                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{worker.role}</p>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">{worker.rating}</span>
                            <span className="text-xs text-gray-600">({worker.reviews})</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Briefcase className="w-4 h-4" />
                            {worker.experience} experience
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            {worker.location} <span className="text-blue-600">({worker.distance})</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            Last active: {worker.lastActive}
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap mb-3">
                          {worker.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="rounded-full text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        {worker.unlocked ? (
                          <div className="flex gap-2">
                            <Button className="flex-1 rounded-xl" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                            <Button variant="outline" className="flex-1 rounded-xl" size="sm">
                              View Full Profile
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
                            size="sm"
                            disabled={credits < 1}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Unlock Profile (1 Credit)
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Job Posts</h2>
              <Button className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>

            <div className="space-y-3">
              {mockJobPosts.map((job) => (
                <Card key={job.id} className="rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-600">Posted {job.posted}</p>
                      </div>
                      <Badge 
                        variant={job.status === 'active' ? 'default' : 'secondary'}
                        className="rounded-full"
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{job.vacancies}</div>
                        <div className="text-xs text-gray-600">Vacancies</div>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">{job.applicants}</div>
                        <div className="text-xs text-gray-600">Applicants</div>
                      </div>
                      <div className="text-center p-2 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{job.views}</div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl" size="sm">
                        View Applicants
                      </Button>
                      <Button variant="outline" className="rounded-xl" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" className="rounded-xl text-red-600" size="sm">
                        Close
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-4">
            <Card className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6 text-center">
                <CreditCard className="w-16 h-16 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">{credits} Credits</div>
                <p className="text-sm opacity-90">Available Balance</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Purchase Credit Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { credits: 10, price: 999, popular: false },
                  { credits: 25, price: 2199, popular: true },
                  { credits: 50, price: 3999, popular: false },
                ].map((pkg, idx) => (
                  <Card key={idx} className={`rounded-xl ${pkg.popular ? 'border-2 border-blue-600' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-lg">{pkg.credits} Credits</h4>
                            {pkg.popular && (
                              <Badge className="rounded-full">Most Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            ₹{(pkg.price / pkg.credits).toFixed(0)} per credit
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">₹{pkg.price}</div>
                          <Button className="rounded-xl mt-2" size="sm">
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">How Credits Work</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Use 1 credit to unlock a worker's contact details</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Credits never expire</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>Get 5 free credits every month</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Sunrise Apartments</h3>
                  <p className="text-sm text-gray-600">Residential Complex</p>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <User className="w-4 h-4 mr-2" />
                    Edit Company Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Bell className="w-4 h-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
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
