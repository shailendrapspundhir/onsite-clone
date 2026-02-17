import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, Briefcase, TrendingUp, DollarSign, Search, Filter,
  MoreVertical, Edit, Trash2, CheckCircle2, XCircle, Eye,
  UserCheck, Building, MapPin, Calendar, Phone, Mail,
  AlertCircle, Activity, BarChart3, Download, Settings
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface DashboardStats {
  totalWorkers: number;
  totalEmployers: number;
  activeJobs: number;
  totalApplications: number;
  verifiedWorkers: number;
  pendingVerifications: number;
  revenue: number;
  activeTickets: number;
}

interface RecentActivity {
  id: string;
  type: 'worker' | 'employer' | 'job' | 'application';
  description: string;
  timestamp: string;
  status?: string;
}

const mockStats: DashboardStats = {
  totalWorkers: 12453,
  totalEmployers: 3287,
  activeJobs: 847,
  totalApplications: 5621,
  verifiedWorkers: 8934,
  pendingVerifications: 234,
  revenue: 2845000,
  activeTickets: 67,
};

const mockActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'worker',
    description: 'New worker registration: Rajesh Kumar (Security Guard)',
    timestamp: '5 min ago',
    status: 'pending',
  },
  {
    id: '2',
    type: 'employer',
    description: 'Employer verified: Sunrise Apartments',
    timestamp: '12 min ago',
    status: 'completed',
  },
  {
    id: '3',
    type: 'job',
    description: 'New job posted: Security Guard - Night Shift',
    timestamp: '25 min ago',
    status: 'active',
  },
  {
    id: '4',
    type: 'application',
    description: 'Application submitted for delivery position',
    timestamp: '1 hour ago',
    status: 'pending',
  },
];

const mockUsers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    type: 'Worker',
    role: 'Security Guard',
    location: 'Bangalore',
    joined: '15 Jan 2024',
    status: 'active',
    verified: true,
  },
  {
    id: '2',
    name: 'Sunrise Apartments',
    type: 'Employer',
    role: 'Residential Complex',
    location: 'Bangalore',
    joined: '20 Jan 2024',
    status: 'active',
    verified: true,
  },
  {
    id: '3',
    name: 'Priya Sharma',
    type: 'Worker',
    role: 'Cook',
    location: 'Mumbai',
    joined: '10 Feb 2024',
    status: 'active',
    verified: true,
  },
];

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">OnSite 360 Platform Management</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-xl">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-5 rounded-2xl mb-6">
            <TabsTrigger value="overview" className="rounded-xl">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workers" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Workers
            </TabsTrigger>
            <TabsTrigger value="employers" className="rounded-xl">
              <Building className="w-4 h-4 mr-2" />
              Employers
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-xl">
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-xl">
              <AlertCircle className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {mockStats.totalWorkers.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Workers</p>
                  <p className="text-xs text-green-600 mt-2">
                    {mockStats.verifiedWorkers.toLocaleString()} verified
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Building className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +8%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {mockStats.totalEmployers.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Employers</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +15%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    {mockStats.activeJobs.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                    <Badge variant="secondary" className="rounded-full">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +22%
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    ₹{(mockStats.revenue / 100000).toFixed(1)}L
                  </div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{mockStats.totalApplications.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                  <Activity className="w-8 h-8 text-blue-600" />
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{mockStats.pendingVerifications}</p>
                    <p className="text-sm text-gray-600">Pending Verifications</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-orange-600" />
                </CardContent>
              </Card>
              <Card className="rounded-2xl">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{mockStats.activeTickets}</p>
                    <p className="text-sm text-gray-600">Active Support Tickets</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockActivities.map((activity) => (
                    <Card key={activity.id} className="rounded-xl">
                      <CardContent className="p-4 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'worker' ? 'bg-blue-100' :
                            activity.type === 'employer' ? 'bg-green-100' :
                            activity.type === 'job' ? 'bg-purple-100' :
                            'bg-yellow-100'
                          }`}>
                            {activity.type === 'worker' && <Users className="w-4 h-4 text-blue-600" />}
                            {activity.type === 'employer' && <Building className="w-4 h-4 text-green-600" />}
                            {activity.type === 'job' && <Briefcase className="w-4 h-4 text-purple-600" />}
                            {activity.type === 'application' && <CheckCircle2 className="w-4 h-4 text-yellow-600" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.timestamp}</p>
                          </div>
                        </div>
                        {activity.status && (
                          <Badge variant="outline" className="rounded-full text-xs">
                            {activity.status}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search workers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="rounded-xl">
                  Add Worker
                </Button>
              </div>
            </div>

            <Card className="rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.filter(u => u.type === 'Worker').map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 rounded-xl">
                            <AvatarFallback className="rounded-xl bg-blue-100 text-blue-600">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.verified && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {user.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {user.joined}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className="rounded-full"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Employers Tab */}
          <TabsContent value="employers" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search employers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button className="rounded-xl">
                  Add Employer
                </Button>
              </div>
            </div>

            <Card className="rounded-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.filter(u => u.type === 'Employer').map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 rounded-xl">
                            <AvatarFallback className="rounded-xl bg-green-100 text-green-600">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            {user.verified && (
                              <p className="text-xs text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Verified
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          {user.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {user.joined}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className="rounded-full"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-lg">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Jobs & Support tabs would be similar */}
          <TabsContent value="jobs" className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Jobs Management</h3>
                <p className="text-gray-600">View and manage all job postings on the platform</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">Support Tickets</h3>
                <p className="text-gray-600">Manage support tickets and customer inquiries</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
