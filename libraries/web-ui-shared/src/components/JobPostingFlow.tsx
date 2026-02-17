'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Badge, Select } from '@onsite360/ui-shared';
import { ArrowLeft, MapPin, Briefcase, Check } from 'lucide-react';

interface JobPostingData {
  title: string;
  description: string;
  location: string;
  jobType: string;
  salary: {
    min: string;
    max: string;
    type: 'hourly' | 'daily' | 'monthly';
  };
  requirements: string[];
  skills: string[];
  category: string;
  urgency: 'low' | 'medium' | 'high';
}

const jobCategories = [
  'Construction',
  'Healthcare',
  'Technology',
  'Manufacturing',
  'Hospitality',
  'Transportation',
  'Retail',
  'Education',
  'Other'
];

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Temporary',
  'Freelance'
];

export function JobPostingFlow({ onComplete, onBack }: { onComplete?: () => void; onBack?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState<JobPostingData>({
    title: '',
    description: '',
    location: '',
    jobType: '',
    salary: {
      min: '',
      max: '',
      type: 'hourly'
    },
    requirements: [],
    skills: [],
    category: '',
    urgency: 'medium'
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const totalSteps = 4;

  const updateJobData = (field: keyof JobPostingData, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const updateSalary = (field: keyof JobPostingData['salary'], value: string) => {
    setJobData(prev => ({
      ...prev,
      salary: { ...prev.salary, [field]: value }
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setJobData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setJobData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the job data to your backend
    console.log('Job posting data:', jobData);
    onComplete?.();
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i + 1 <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {i + 1 <= currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-2 ${
                i + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Title *
        </label>
        <Input
          value={jobData.title}
          onChange={(e) => updateJobData('title', e.target.value)}
          placeholder="e.g., Senior React Developer"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Description *
        </label>
        <Textarea
          value={jobData.description}
          onChange={(e) => updateJobData('description', e.target.value)}
          placeholder="Describe the job responsibilities, requirements, and what the ideal candidate should bring..."
          rows={6}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <Select
            value={jobData.category}
            onChange={(e) => updateJobData('category', e.target.value)}
            options={jobCategories.map(cat => ({ value: cat, label: cat }))}
            placeholder="Select category"
            fullWidth
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type *
          </label>
          <Select
            value={jobData.jobType}
            onChange={(e) => updateJobData('jobType', e.target.value)}
            options={jobTypes.map(type => ({ value: type, label: type }))}
            placeholder="Select job type"
            fullWidth
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={jobData.location}
            onChange={(e) => updateJobData('location', e.target.value)}
            placeholder="e.g., New York, NY or Remote"
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Salary Range
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="number"
              value={jobData.salary.min}
              onChange={(e) => updateSalary('min', e.target.value)}
              placeholder="Min"
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="number"
              value={jobData.salary.max}
              onChange={(e) => updateSalary('max', e.target.value)}
              placeholder="Max"
              className="w-full"
            />
          </div>
          <Select
            value={jobData.salary.type}
            onChange={(e) => updateSalary('type', e.target.value as 'hourly' | 'daily' | 'monthly')}
            options={[
              { value: 'hourly', label: 'Per Hour' },
              { value: 'daily', label: 'Per Day' },
              { value: 'monthly', label: 'Per Month' }
            ]}
            placeholder="Select type"
            fullWidth
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgency Level
        </label>
        <Select
          value={jobData.urgency}
          onChange={(e) => updateJobData('urgency', e.target.value as 'low' | 'medium' | 'high')}
          options={[
            { value: 'low', label: 'Low - Can wait' },
            { value: 'medium', label: 'Medium - Within a week' },
            { value: 'high', label: 'High - ASAP' }
          ]}
          placeholder="Select urgency"
          fullWidth
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Skills
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g., React, Node.js"
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1"
          />
          <Button onClick={addSkill} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {jobData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(index)}>
              {skill} ×
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Requirements
        </label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="e.g., 3+ years experience"
            onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
            className="flex-1"
          />
          <Button onClick={addRequirement} size="sm">
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {jobData.requirements.map((req, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{req}</span>
              <Button variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Review Your Job Posting</h3>
        <p className="text-gray-600">Please review all details before publishing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            {jobData.title || 'Job Title'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-sm">{jobData.description || 'No description provided'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="text-sm font-medium">{jobData.category || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Job Type</p>
              <p className="text-sm font-medium">{jobData.jobType || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="text-sm font-medium">{jobData.location || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Urgency</p>
              <Badge variant={jobData.urgency === 'high' ? 'destructive' : jobData.urgency === 'medium' ? 'default' : 'secondary'}>
                {jobData.urgency}
              </Badge>
            </div>
          </div>

          {(jobData.salary.min || jobData.salary.max) && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Salary Range</p>
              <p className="text-sm font-medium">
                ${jobData.salary.min} - ${jobData.salary.max} {jobData.salary.type}
              </p>
            </div>
          )}

          {jobData.skills.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Required Skills</p>
              <div className="flex flex-wrap gap-1">
                {jobData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {jobData.requirements.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Requirements</p>
              <ul className="text-sm space-y-1">
                {jobData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          </div>
          {renderStepIndicator()}
        </div>

        {/* Form Steps */}
        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Publish Job
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}