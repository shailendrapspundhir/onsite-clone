import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@onsite360/ui-shared';
import { Badge } from '@onsite360/ui-shared';
import { Button } from '@onsite360/ui-shared';
import { Input } from '@onsite360/ui-shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@onsite360/ui-shared';
import {
  MapPin, Search, Filter, Clock,
  CheckCircle2, XCircle, Eye, Phone, Calendar, AlertCircle,
  Bell, Settings, User, Menu
} from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="rounded-xl">
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-xl">OnSite 360</h1>
                <p className="text-xs text-gray-600">Find your next opportunity</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="rounded-xl relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="sm" className="rounded-xl">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="jobs" className="rounded-lg">Jobs</TabsTrigger>
            <TabsTrigger value="applications" className="rounded-lg">Applications</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs by title, company, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-xl"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium">Job Type</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>All Types</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Distance</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>Any Distance</option>
                        <option>Within 5km</option>
                        <option>Within 10km</option>
                        <option>Within 20km</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Salary Range</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>Any Salary</option>
                        <option>₹10,000+</option>
                        <option>₹15,000+</option>
                        <option>₹20,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Urgent Jobs</label>
                      <select className="w-full mt-1 p-2 border rounded-md">
                        <option>All Jobs</option>
                        <option>Urgent Only</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Job Listings */}
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          {job.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location} ({job.distance})
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.posted}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-medium text-green-600">{job.salary}</span>
                          <span>{job.type}</span>
                          <span>{job.vacancies} vacancy</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {job.applied ? (
                          <Badge
                            variant={
                              job.status === 'hired' ? 'default' :
                              job.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                            className="text-xs"
                          >
                            {job.status === 'applied' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {job.status === 'viewed' && <Eye className="w-3 h-3 mr-1" />}
                            {job.status === 'contacted' && <Phone className="w-3 h-3 mr-1" />}
                            {job.status === 'interview' && <Calendar className="w-3 h-3 mr-1" />}
                            {job.status === 'hired' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {job.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                            {job.status && (job.status.charAt(0).toUpperCase() + job.status.slice(1))}
                          </Badge>
                        ) : (
                          <Button className="rounded-xl">
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.filter(job => job.applied).map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-xs text-gray-500">Applied 2 days ago</p>
                      </div>
                      <Badge
                        variant={
                          job.status === 'hired' ? 'default' :
                          job.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {job.status && (job.status.charAt(0).toUpperCase() + job.status.slice(1))}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Rajesh Kumar</h3>
                      <p className="text-sm text-gray-600">Security Guard</p>
                      <p className="text-xs text-gray-500">Available for work</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="rounded-xl">
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}