'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '@onsite360/ui-shared';
import { MessageCircle, Phone, Mail, HelpCircle, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export function HelpSupport() {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'tickets'>('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Mock data
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I create a job posting?',
      answer: 'To create a job posting, go to your employer dashboard and click "Post New Job". Fill in the job details, requirements, and salary information. Your job will be published immediately and visible to workers in your area.',
      category: 'Employer'
    },
    {
      id: '2',
      question: 'How do I apply for a job?',
      answer: 'Browse available jobs in your dashboard, click on a job that interests you, and click "Apply Now". You may need to provide additional information or complete a quick assessment.',
      category: 'Worker'
    },
    {
      id: '3',
      question: 'How does payment work?',
      answer: 'Employers set payment terms when posting jobs. Payments are processed securely through our platform. Workers receive payment after job completion and employer approval.',
      category: 'Payment'
    },
    {
      id: '4',
      question: 'What if I need to cancel a job?',
      answer: 'Contact the other party directly through our messaging system. If you need assistance, reach out to our support team. Cancellation policies vary by job type.',
      category: 'General'
    },
    {
      id: '5',
      question: 'How do I update my profile?',
      answer: 'Go to your profile settings and click "Edit Profile". You can update your skills, experience, contact information, and preferences.',
      category: 'Account'
    }
  ];

  const supportTickets: SupportTicket[] = [
    {
      id: '1',
      subject: 'Issue with job application',
      message: 'I applied for a job but haven\'t heard back...',
      status: 'in-progress',
      createdAt: '2024-01-15',
      priority: 'medium'
    },
    {
      id: '2',
      subject: 'Payment not received',
      message: 'I completed a job but payment hasn\'t been processed...',
      status: 'resolved',
      createdAt: '2024-01-10',
      priority: 'high'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-gray-600">Find answers to common questions or get in touch with our support team</p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Chat with our support team</p>
              <Button size="sm" className="w-full">Start Chat</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-3">Call us at 1-800-HELP</p>
              <Button variant="outline" size="sm" className="w-full">Call Now</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-1">Email Support</h3>
              <p className="text-sm text-gray-600 mb-3">support@onsite360.com</p>
              <Button variant="outline" size="sm" className="w-full">Send Email</Button>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'faq'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'contact'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tickets'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Tickets
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'faq' && (
          <div>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="cursor-pointer" onClick={() => toggleFAQ(faq.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
                          <h3 className="font-medium text-gray-900">{faq.question}</h3>
                        </div>
                        <p className="text-sm text-blue-600 mb-2">{faq.category}</p>
                        {expandedFAQ === faq.id && (
                          <p className="text-gray-700 mt-3">{faq.answer}</p>
                        )}
                      </div>
                      <div className="ml-4">
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <p className="text-sm text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    placeholder="Describe your issue or question in detail..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">My Support Tickets</h2>
              <Button>
                New Ticket
              </Button>
            </div>

            {supportTickets.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets yet</h3>
                  <p className="text-gray-600">When you need help, you can create a support ticket here.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600 mb-2">{ticket.message.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {ticket.createdAt}</span>
                            <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                              Priority: {ticket.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Additional Resources */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <ExternalLink className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">User Guide</h4>
                  <p className="text-sm text-gray-600">Complete guide to using OnSite 360</p>
                </div>
              </a>

              <a href="#" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <ExternalLink className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Video Tutorials</h4>
                  <p className="text-sm text-gray-600">Step-by-step video guides</p>
                </div>
              </a>

              <a href="#" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <ExternalLink className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Community Forum</h4>
                  <p className="text-sm text-gray-600">Connect with other users</p>
                </div>
              </a>

              <a href="#" className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                <ExternalLink className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">System Status</h4>
                  <p className="text-sm text-gray-600">Check platform availability</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}