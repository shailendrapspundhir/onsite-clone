import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  MapPin, Briefcase, DollarSign, Clock, Users, Calendar,
  AlertCircle, Edit, Save, X, Volume2, Mic, Camera, FileText
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';

interface JobFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  vacancies: number;
  workingHours: string;
  salaryMin: string;
  salaryMax: string;
  contactEmail: string;
  contactPhone: string;
  requirements: string;
  benefits: string;
  urgent: boolean;
  duration: string;
}

export function JobPostingFlow() {
  const [step, setStep] = useState(1);
  const [useVoiceInput, setUseVoiceInput] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    vacancies: 1,
    workingHours: '',
    salaryMin: '',
    salaryMax: '',
    contactEmail: '',
    contactPhone: '',
    requirements: '',
    benefits: '',
    urgent: false,
    duration: 'full-time',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log('Job Posted:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <Card className="rounded-2xl mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Post a New Job</h2>
              <Badge variant="secondary" className="rounded-full">
                Step {step} of 4
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-between mt-3 text-sm">
              <span className={step >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Basic Info
              </span>
              <span className={step >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Job Details
              </span>
              <span className={step >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Requirements
              </span>
              <span className={step >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                Review
              </span>
            </div>
          </CardContent>
        </Card>

        {/* AI Voice Assistant Card */}
        <Card className="rounded-2xl mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Having trouble filling the form?</p>
                <p className="text-sm opacity-90">Use our AI voice assistant to help you</p>
              </div>
            </div>
            <Switch
              checked={useVoiceInput}
              onCheckedChange={setUseVoiceInput}
              className="data-[state=checked]:bg-white"
            />
          </CardContent>
        </Card>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Basic Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <div className="flex gap-2">
                  <Input
                    id="title"
                    placeholder="e.g., Security Guard - Night Shift"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl"
                  />
                  {useVoiceInput && (
                    <Button variant="outline" size="icon" className="rounded-xl flex-shrink-0">
                      <Mic className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Job Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="security">Security Guard</SelectItem>
                    <SelectItem value="cook">Cook</SelectItem>
                    <SelectItem value="cleaner">Cleaner</SelectItem>
                    <SelectItem value="delivery">Delivery Personnel</SelectItem>
                    <SelectItem value="helper">Helper</SelectItem>
                    <SelectItem value="labourer">Labourer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Work Location *</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Enter full address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  {useVoiceInput && (
                    <Button variant="outline" size="icon" className="rounded-xl flex-shrink-0">
                      <Mic className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vacancies">Number of Positions *</Label>
                  <Input
                    id="vacancies"
                    type="number"
                    min="1"
                    value={formData.vacancies}
                    onChange={(e) => setFormData({ ...formData, vacancies: parseInt(e.target.value) })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Employment Type *</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => setFormData({ ...formData, duration: value })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Mark as Urgent Hiring</p>
                    <p className="text-sm text-red-700">
                      Get more visibility and faster applications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.urgent}
                  onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Job Details */}
        {step === 2 && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Job Details & Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <div className="space-y-2">
                  <Textarea
                    id="description"
                    placeholder="Describe the job role, responsibilities, and what the ideal candidate should do..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-xl min-h-32"
                  />
                  {useVoiceInput && (
                    <Button variant="outline" className="w-full rounded-xl">
                      <Mic className="w-4 h-4 mr-2" />
                      Speak to Describe Job
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input
                  id="workingHours"
                  placeholder="e.g., 9 AM - 6 PM, 8 hours/day, Night Shift"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Salary Range (per month) *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Minimum"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Maximum"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Perks</Label>
                <Textarea
                  id="benefits"
                  placeholder="e.g., Food provided, Accommodation, PF/ESI, Weekly offs..."
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Requirements */}
        {step === 3 && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Requirements & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requirements">Job Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="List the skills, qualifications, or experience required..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="rounded-xl min-h-32"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <Card className="rounded-xl bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Privacy Note:</strong> Your exact address and full contact details 
                    will only be visible to workers after they apply for the job.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Review & Publish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold">{formData.title || 'Job Title'}</h3>
                      {formData.urgent && (
                        <Badge variant="destructive" className="rounded-full">
                          URGENT
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {formData.category || 'Category'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {formData.location || 'Location'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formData.vacancies} positions
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setStep(1)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold mb-1">Description</h4>
                    <p className="text-gray-600 text-sm">
                      {formData.description || 'No description provided'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">Salary</h4>
                    <p className="text-green-600 font-semibold">
                      ₹{formData.salaryMin || '0'} - ₹{formData.salaryMax || '0'} per month
                    </p>
                  </div>

                  {formData.workingHours && (
                    <div>
                      <h4 className="font-semibold mb-1">Working Hours</h4>
                      <p className="text-gray-600 text-sm">{formData.workingHours}</p>
                    </div>
                  )}

                  {formData.requirements && (
                    <div>
                      <h4 className="font-semibold mb-1">Requirements</h4>
                      <p className="text-gray-600 text-sm">{formData.requirements}</p>
                    </div>
                  )}

                  {formData.benefits && (
                    <div>
                      <h4 className="font-semibold mb-1">Benefits</h4>
                      <p className="text-gray-600 text-sm">{formData.benefits}</p>
                    </div>
                  )}
                </div>
              </div>

              <Card className="rounded-xl bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Ready to Publish?</h4>
                  <p className="text-sm text-green-800">
                    Your job posting will be visible to thousands of workers in your area.
                    You'll receive applications directly on your dashboard.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <Card className="rounded-2xl mt-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 rounded-xl"
                >
                  <X className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1 rounded-xl"
                >
                  Continue
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Publish Job
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
