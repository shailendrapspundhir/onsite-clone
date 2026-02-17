import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Users, Briefcase, Building, LayoutDashboard, 
  MessageSquare, FileText, Settings, LogIn, Sparkles, Filter
} from 'lucide-react';

interface NavigationProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

export function Navigation({ onViewChange, currentView }: NavigationProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OnSite 360
            </h1>
            <p className="text-sm text-gray-600">Platform Demo & Wireframes</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentView === 'login' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('login')}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login Flow
          </Button>
          <Button
            variant={currentView === 'ai-onboarding' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('ai-onboarding')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Onboarding
          </Button>
          <Button
            variant={currentView === 'search-filter' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('search-filter')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Search & Filter
          </Button>
          <Button
            variant={currentView === 'worker-dashboard' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('worker-dashboard')}
          >
            <Users className="w-4 h-4 mr-2" />
            Worker Dashboard
          </Button>
          <Button
            variant={currentView === 'worker-profile' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('worker-profile')}
          >
            <Users className="w-4 h-4 mr-2" />
            Worker Profile
          </Button>
          <Button
            variant={currentView === 'employer-dashboard' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('employer-dashboard')}
          >
            <Building className="w-4 h-4 mr-2" />
            Employer Dashboard
          </Button>
          <Button
            variant={currentView === 'job-posting' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('job-posting')}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Post Job
          </Button>
          <Button
            variant={currentView === 'job-details' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('job-details')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Job Details
          </Button>
          <Button
            variant={currentView === 'help-support' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('help-support')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Help & Support
          </Button>
          <Button
            variant={currentView === 'admin' ? 'default' : 'outline'}
            size="sm"
            className="rounded-xl"
            onClick={() => onViewChange('admin')}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Admin Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full rounded-3xl shadow-2xl">
        <CardContent className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OnSite 360
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Connecting Blue-Collar Workers with Opportunities
            </p>
            <p className="text-gray-500">
              Comprehensive UI/UX Wireframes & Component Library
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Workers</h3>
                <p className="text-sm text-gray-600">
                  Find jobs, apply, track applications with AI assistance
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Employers</h3>
                <p className="text-sm text-gray-600">
                  Post jobs, discover workers, manage hiring efficiently
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <LayoutDashboard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Admin Platform</h3>
                <p className="text-sm text-gray-600">
                  Manage users, jobs, support tickets, analytics
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold mb-3">Key Features Demonstrated:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Mobile + OTP Authentication</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>AI-Assisted Onboarding</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Location-Based Job Matching</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Voice & Multi-Language Support</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Credit System for Employers</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Urgent Hiring Workflows</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Application Tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Ticket-Based Support System</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onStart}
            className="w-full h-14 rounded-2xl text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Explore Wireframes & Components
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            High-contrast themes • Accessibility-first design • Voice-assisted interactions
          </p>
        </CardContent>
      </Card>
    </div>
  );
}