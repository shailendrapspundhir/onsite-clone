'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@onsite360/ui-shared';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Star, MessageCircle, Phone, Mail, Bookmark, Share2, AlertCircle } from 'lucide-react';

interface JobDetails {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    type: 'hourly' | 'daily' | 'monthly';
  };
  description: string;
  requirements: string[];
  skills: string[];
  jobType: string;
  category: string;
  postedDate: string;
  urgency: 'low' | 'medium' | 'high';
  applicants: number;
  employer: {
    name: string;
    rating: number;
    jobsPosted: number;
    verified: boolean;
  };
}

interface JobDetailsViewProps {
  job: JobDetails;
  onBack?: () => void;
  onApply?: (jobId: string) => void;
  isApplied?: boolean;
}

export function JobDetailsView({ job, onBack, onApply, isApplied = false }: JobDetailsViewProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = () => {
    onApply?.(job.id);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSalaryDisplay = () => {
    const { min, max, type } = job.salary;
    const typeLabel = type === 'hourly' ? '/hr' : type === 'daily' ? '/day' : '/month';
    return `$${min.toLocaleString()} - $${max.toLocaleString()} ${typeLabel}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          {onBack && (
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          )}

          {/* Job Title Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <p className="text-lg text-gray-600 mb-2">{job.company}</p>
                      <div className="flex items-center text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="mr-4">{job.location}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted {job.postedDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsBookmarked(!isBookmarked)}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {job.category}
                    </Badge>
                    <Badge variant="outline">
                      {job.jobType}
                    </Badge>
                    <Badge className={getUrgencyColor(job.urgency)}>
                      {job.urgency} priority
                    </Badge>
                  </div>

                  <div className="flex items-center text-2xl font-bold text-green-600 mb-4">
                    <DollarSign className="w-6 h-6 mr-1" />
                    {getSalaryDisplay()}
                  </div>
                </div>

                <div className="lg:ml-6 lg:text-right">
                  <Button
                    onClick={handleApply}
                    disabled={isApplied}
                    className="w-full lg:w-auto mb-3"
                    size="lg"
                  >
                    {isApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                  <p className="text-sm text-gray-500 flex items-center justify-center lg:justify-end">
                    <Users className="w-4 h-4 mr-1" />
                    {job.applicants} applicants
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className={showFullDescription ? '' : 'line-clamp-4'}>
                    {job.description}
                  </p>
                  {job.description.length > 200 && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="p-0 h-auto mt-2"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Required Skills */}
            {job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Employer Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the Employer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {job.employer.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{job.employer.name}</h3>
                  <div className="flex items-center justify-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{job.employer.rating}</span>
                    {job.employer.verified && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{job.employer.jobsPosted} jobs posted</p>
                </div>

                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Job
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Job
                </Button>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-900">Senior Developer</h4>
                    <p className="text-sm text-gray-600">Tech Corp • $80-100/hr</p>
                  </div>
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-gray-900">React Developer</h4>
                    <p className="text-sm text-gray-600">Startup Inc • $60-80/hr</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Full Stack Developer</h4>
                    <p className="text-sm text-gray-600">Digital Agency • $70-90/hr</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}