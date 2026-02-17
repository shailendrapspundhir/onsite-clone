import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  User, MapPin, Phone, Mail, Calendar, Briefcase, Star,
  Edit, Camera, Languages, Volume2, CheckCircle2, Award,
  Clock, FileText, Download, Share2, Settings
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';

interface WorkerProfileData {
  name: string;
  phone: string;
  email: string;
  dob: string;
  age: number;
  currentAddress: string;
  permanentAddress: string;
  role: string;
  experience: string;
  rating: number;
  reviews: number;
  profileComplete: number;
  verified: boolean;
  skills: string[];
  languages: string[];
  workHistory: Array<{
    company: string;
    role: string;
    duration: string;
    location: string;
  }>;
}

const mockWorkerProfile: WorkerProfileData = {
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@example.com',
  dob: '15 June 1988',
  age: 37,
  currentAddress: 'House No. 45, Indiranagar, Bangalore - 560038',
  permanentAddress: 'Village Ramnagar, District Patna, Bihar - 800001',
  role: 'Security Guard',
  experience: '5 years',
  rating: 4.8,
  reviews: 23,
  profileComplete: 85,
  verified: true,
  skills: ['Night Shift', 'CCTV Monitoring', 'First Aid', 'Visitor Management', 'Fire Safety'],
  languages: ['Hindi', 'English', 'Tamil', 'Kannada'],
  workHistory: [
    {
      company: 'Prestige Apartments',
      role: 'Security Guard',
      duration: '2021 - Present',
      location: 'Bangalore',
    },
    {
      company: 'Tech Park Security Services',
      role: 'Security Guard',
      duration: '2019 - 2021',
      location: 'Bangalore',
    },
    {
      company: 'ABC Security Agency',
      role: 'Security Guard',
      duration: '2018 - 2019',
      location: 'Patna',
    },
  ],
};

export function WorkerProfile() {
  const [profile, setProfile] = useState(mockWorkerProfile);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header Card with Avatar */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="w-32 h-32 rounded-2xl">
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full w-10 h-10"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{profile.name}</h1>
                      {profile.verified && (
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <p className="text-gray-600">{profile.role}</p>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    className="rounded-xl"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{profile.rating}</span>
                    <span className="text-sm text-gray-600">({profile.reviews} reviews)</span>
                  </div>
                  <Badge variant="secondary" className="rounded-full">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {profile.experience} experience
                  </Badge>
                </div>

                {/* Profile Completion */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-semibold text-blue-600">{profile.profileComplete}%</span>
                  </div>
                  <Progress value={profile.profileComplete} className="h-2" />
                  {profile.profileComplete < 100 && (
                    <p className="text-xs text-gray-500">
                      Complete your profile to get more job recommendations
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Assistant Card */}
        <Card className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Need help updating your profile?</p>
                <p className="text-sm opacity-90">Use our AI voice assistant</p>
              </div>
            </div>
            <Button variant="secondary" className="rounded-xl">
              Start
            </Button>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="w-full grid grid-cols-4 rounded-2xl">
            <TabsTrigger value="personal" className="rounded-xl">Personal</TabsTrigger>
            <TabsTrigger value="professional" className="rounded-xl">Professional</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl">Documents</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-xl">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Date of Birth</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {profile.dob} ({profile.age} years)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {profile.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email Address</label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {profile.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Current Address</label>
                    <p className="font-medium flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      {profile.currentAddress}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Permanent Address</label>
                    <p className="font-medium flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      {profile.permanentAddress}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    <Languages className="w-4 h-4 inline mr-1" />
                    Languages Known
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {profile.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-full">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Info Tab */}
          <TabsContent value="professional" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Current Role</label>
                    <p className="font-semibold text-lg">{profile.role}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Total Experience</label>
                    <p className="font-semibold text-lg">{profile.experience}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Skills & Expertise</label>
                  <div className="flex gap-2 flex-wrap">
                    {profile.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="rounded-full">
                        <Award className="w-3 h-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work History */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Work History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.workHistory.map((work, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-0">
                    <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-blue-600"></div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold">{work.role}</h4>
                      <p className="text-sm text-gray-600 mb-1">{work.company}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {work.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {work.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents & Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Aadhaar Card', status: 'verified', uploaded: '15 Jan 2024' },
                  { name: 'PAN Card', status: 'verified', uploaded: '15 Jan 2024' },
                  { name: 'Police Verification', status: 'pending', uploaded: '20 Jan 2024' },
                  { name: 'Experience Certificate', status: 'verified', uploaded: '10 Feb 2024' },
                ].map((doc, idx) => (
                  <Card key={idx} className="rounded-xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          doc.status === 'verified' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          <FileText className={`w-5 h-5 ${
                            doc.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-600">Uploaded: {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={doc.status === 'verified' ? 'default' : 'secondary'}
                          className="rounded-full"
                        >
                          {doc.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="rounded-lg">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button variant="outline" className="w-full rounded-xl">
                  <FileText className="w-4 h-4 mr-2" />
                  Upload New Document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Preferences & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Job Preferences</h4>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">Receive job recommendations</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">Urgent job alerts</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">Application status updates</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Privacy Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">Show profile to employers</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm">Allow direct messages</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </label>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button variant="outline" className="w-full rounded-xl justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button variant="outline" className="w-full rounded-xl justify-start text-red-600">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
