import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  MapPin, Briefcase, Star, Clock, DollarSign, CheckCircle2,
  Phone, Mail, MessageSquare, Share2, Bookmark, AlertCircle,
  Users, Calendar, ArrowLeft, Building, Award
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface JobDetailData {
  id: string;
  title: string;
  company: string;
  companyType: string;
  location: string;
  distance: string;
  salary: string;
  type: string;
  posted: string;
  urgent: boolean;
  vacancies: number;
  applicants: number;
  views: number;
  description: string;
  requirements: string[];
  benefits: string[];
  workingHours: string;
  companyRating: number;
  companyReviews: number;
  contactVisible: boolean;
}

const mockJobDetail: JobDetailData = {
  id: 'J001',
  title: 'Security Guard - Night Shift',
  company: 'Sunrise Apartments',
  companyType: 'Residential Complex',
  location: 'Indiranagar, Bangalore - 560038',
  distance: '2.5 km from you',
  salary: '₹15,000 - ₹18,000',
  type: 'Full-time',
  posted: '2 hours ago',
  urgent: true,
  vacancies: 2,
  applicants: 15,
  views: 127,
  description: 'We are looking for a reliable and experienced Security Guard for night shift duty at our residential apartment complex. The ideal candidate should be alert, responsible, and have good communication skills. You will be responsible for monitoring CCTV cameras, managing visitor entry, patrolling the premises, and ensuring the safety of all residents.',
  requirements: [
    'Minimum 2 years of security guard experience',
    'Knowledge of CCTV monitoring and basic security protocols',
    'Basic first aid knowledge is preferred',
    'Good physical fitness',
    'Ability to work night shifts (8 PM - 8 AM)',
    'Basic English and local language communication skills',
  ],
  benefits: [
    'Food provided during duty hours',
    'Weekly offs',
    'PF and ESI benefits',
    'Uniform provided',
    'Annual bonus',
    'Medical insurance',
  ],
  workingHours: '8 PM - 8 AM (12-hour shift)',
  companyRating: 4.5,
  companyReviews: 23,
  contactVisible: false,
};

export function JobDetailsView() {
  const [jobData] = useState(mockJobDetail);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleApply = () => {
    setHasApplied(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header with Back Button */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-xl">Job Details</h1>
              <p className="text-xs text-gray-600">Posted {jobData.posted}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsSaved(!isSaved)}>
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Urgent Alert */}
        {jobData.urgent && (
          <Card className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Urgent Hiring!</p>
                <p className="text-sm opacity-90">This position needs to be filled immediately</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Job Info Card */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4">
                <Avatar className="w-16 h-16 rounded-2xl">
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl">
                    {jobData.company.split(' ').map(w => w[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{jobData.title}</h2>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-600">{jobData.company}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{jobData.companyRating}</span>
                      <span className="text-gray-500">({jobData.companyReviews})</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    <Building className="w-3 h-3 mr-1" />
                    {jobData.companyType}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{jobData.location}</p>
                  <p className="text-xs text-blue-600">{jobData.distance}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{jobData.type}</p>
                  <p className="text-xs text-gray-600">{jobData.workingHours}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-green-600">{jobData.salary}</p>
                  <p className="text-xs text-gray-600">per month</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{jobData.vacancies} positions</p>
                  <p className="text-xs text-gray-600">{jobData.applicants} applicants</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Posted {jobData.posted}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {jobData.views} views
              </span>
              {hasApplied && (
                <Badge variant="default" className="rounded-full">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Applied
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Details */}
        <Tabs defaultValue="description" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3 rounded-2xl">
            <TabsTrigger value="description" className="rounded-xl">Description</TabsTrigger>
            <TabsTrigger value="requirements" className="rounded-xl">Requirements</TabsTrigger>
            <TabsTrigger value="company" className="rounded-xl">Company</TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{jobData.description}</p>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Benefits & Perks
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {jobData.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Requirements & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobData.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700 pt-0.5">{req}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>About {jobData.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 rounded-2xl">
                    <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                      {jobData.company.split(' ').map(w => w[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{jobData.company}</h3>
                    <p className="text-sm text-gray-600">{jobData.companyType}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-semibold">{jobData.companyRating}</span>
                      <span className="text-xs text-gray-500">({jobData.companyReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{jobData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Established employer on OnSite 360</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Verified Employer</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Full contact details and exact address will be visible 
                    after you apply for this position.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Section (Visible after apply) */}
        {hasApplied && jobData.contactVisible && (
          <Card className="rounded-2xl bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start rounded-xl">
                <Phone className="w-4 h-4 mr-2" />
                +91 98765 43210
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl">
                <Mail className="w-4 h-4 mr-2" />
                hr@sunriseapartments.com
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Application Status or Apply Button */}
        {hasApplied ? (
          <Card className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
              <p className="mb-4 opacity-90">
                Your application has been sent to {jobData.company}. They will review your 
                profile and contact you if you're shortlisted.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="secondary" className="rounded-xl">
                  View Application Status
                </Button>
                <Button variant="outline" className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Withdraw Application
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl sticky bottom-0">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleApply}
                  className="flex-1 rounded-xl h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Apply Now
                </Button>
                <Button variant="outline" className="rounded-xl h-12">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                Applying will share your profile with the employer
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
