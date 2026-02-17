'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input } from '@onsite360/ui-shared';
import { Search, Plus, Users, Briefcase, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  skills: string[];
  location: string;
  rating: number;
  availability: string;
  hourlyRate?: number;
}

interface Job {
  id: string;
  title: string;
  status: 'active' | 'filled' | 'expired';
  applicants: number;
  postedDate: string;
  location: string;
}

export function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'workers' | 'jobs'>('workers');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const workers: Worker[] = [
    {
      id: '1',
      name: 'John Smith',
      skills: ['Construction', 'Electrical', 'Plumbing'],
      location: 'New York, NY',
      rating: 4.8,
      availability: 'Available',
      hourlyRate: 45
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      skills: ['Nursing', 'Healthcare', 'Patient Care'],
      location: 'Los Angeles, CA',
      rating: 4.9,
      availability: 'Available',
      hourlyRate: 38
    },
    {
      id: '3',
      name: 'Mike Davis',
      skills: ['Software Development', 'React', 'Node.js'],
      location: 'San Francisco, CA',
      rating: 4.7,
      availability: 'Busy',
      hourlyRate: 65
    }
  ];

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      status: 'active',
      applicants: 12,
      postedDate: '2024-01-15',
      location: 'Remote'
    },
    {
      id: '2',
      title: 'Construction Worker',
      status: 'filled',
      applicants: 8,
      postedDate: '2024-01-10',
      location: 'New York, NY'
    },
    {
      id: '3',
      title: 'Registered Nurse',
      status: 'expired',
      applicants: 15,
      postedDate: '2024-01-05',
      location: 'Los Angeles, CA'
    }
  ];

  const filteredWorkers = workers.filter(worker =>
    worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your workforce and job postings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Workers</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">$12,450</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">16</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('workers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'workers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Find Workers
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Jobs
              </button>
            </nav>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={activeTab === 'workers' ? "Search workers by name or skills..." : "Search jobs..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'workers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{worker.name}</CardTitle>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {worker.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-1">Rating:</span>
                        <span className="font-medium">{worker.rating}★</span>
                      </div>
                      {worker.hourlyRate && (
                        <div className="flex items-center text-green-600 font-medium">
                          <DollarSign className="w-4 h-4" />
                          {worker.hourlyRate}/hr
                        </div>
                      )}
                    </div>

                    <Badge
                      variant={worker.availability === 'Available' ? 'default' : 'secondary'}
                      className={worker.availability === 'Available' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {worker.availability}
                    </Badge>

                    <Button className="w-full" size="sm">
                      Contact Worker
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Job Postings</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                          <span className="mx-2">•</span>
                          <Calendar className="w-4 h-4 mr-1" />
                          Posted {job.postedDate}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{job.applicants}</p>
                          <p className="text-sm text-gray-600">Applicants</p>
                        </div>

                        <Badge
                          variant={
                            job.status === 'active' ? 'default' :
                            job.status === 'filled' ? 'secondary' : 'outline'
                          }
                          className={
                            job.status === 'active' ? 'bg-green-100 text-green-800' :
                            job.status === 'filled' ? 'bg-blue-100 text-blue-800' : ''
                          }
                        >
                          {job.status}
                        </Badge>

                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}