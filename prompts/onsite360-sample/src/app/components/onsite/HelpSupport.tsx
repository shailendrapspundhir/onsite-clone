import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  MessageSquare, Send, Search, Filter, Clock, CheckCircle2,
  AlertCircle, Phone, Mail, MessageCircleMore, X, User, Bot,
  Volume2, Languages, FileText, Image as ImageIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created: string;
  lastUpdate: string;
  messages: number;
}

interface Message {
  id: string;
  sender: 'user' | 'support' | 'ai';
  content: string;
  timestamp: string;
  attachments?: string[];
}

const mockTickets: Ticket[] = [
  {
    id: 'T001',
    subject: 'Unable to apply for security guard position',
    category: 'Application Issue',
    status: 'in-progress',
    priority: 'high',
    created: '2 hours ago',
    lastUpdate: '30 min ago',
    messages: 3,
  },
  {
    id: 'T002',
    subject: 'Profile verification pending',
    category: 'Verification',
    status: 'open',
    priority: 'medium',
    created: '1 day ago',
    lastUpdate: '5 hours ago',
    messages: 1,
  },
  {
    id: 'T003',
    subject: 'Payment issue for credit purchase',
    category: 'Billing',
    status: 'resolved',
    priority: 'urgent',
    created: '3 days ago',
    lastUpdate: '2 days ago',
    messages: 8,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'user',
    content: "I'm trying to apply for a security guard position but getting an error.",
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    sender: 'ai',
    content: "I understand you're having trouble applying for a position. Let me check what might be causing this issue. Can you tell me which specific job you're trying to apply for?",
    timestamp: '2 hours ago',
  },
  {
    id: '3',
    sender: 'user',
    content: 'The security guard position at Sunrise Apartments',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    sender: 'support',
    content: "Hello! I'm Priya from OnSite 360 support. I've reviewed your issue and it seems your profile completion is at 65%. You need to complete your profile to at least 70% to apply for jobs. Please add your work experience and upload your documents.",
    timestamp: '30 min ago',
  },
];

export function HelpSupport() {
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tickets');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl">Help & Support</h1>
              <p className="text-sm text-gray-600">We're here to help you</p>
            </div>
            <Button className="rounded-xl">
              <MessageSquare className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Tickets List */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Actions */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-xl">
                  <FileText className="w-4 h-4 mr-2" />
                  FAQs
                </Button>
              </CardContent>
            </Card>

            {/* Voice & Language Support */}
            <Card className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Volume2 className="w-6 h-6 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Voice Support</h3>
                    <p className="text-sm opacity-90">
                      Speak in your language. AI will help you.
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" className="w-full rounded-xl">
                  <Languages className="w-4 h-4 mr-2" />
                  Start Voice Call
                </Button>
              </CardContent>
            </Card>

            {/* Tickets Filter & Search */}
            <Card className="rounded-2xl">
              <CardContent className="p-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full flex-1">
                    All
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full flex-1">
                    Open
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full flex-1">
                    Resolved
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {mockTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                      activeTicket === ticket.id ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => setActiveTicket(ticket.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="text-xs rounded-full">{ticket.id}</Badge>
                            <Badge className={`text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                            {ticket.subject}
                          </h4>
                          <p className="text-xs text-gray-600">{ticket.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ticket.created}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {ticket.messages}
                        </span>
                      </div>

                      <Badge className={`text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Ticket Details & Chat */}
          <div className="lg:col-span-2">
            {activeTicket ? (
              <Card className="rounded-2xl h-full flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="font-bold text-xl">Ticket #{activeTicket}</h2>
                        <Badge className={`rounded-full ${getStatusColor(mockTickets[0].status)}`}>
                          {mockTickets[0].status}
                        </Badge>
                        <Badge className={`rounded-full ${getPriorityColor(mockTickets[0].priority)}`}>
                          {mockTickets[0].priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{mockTickets[0].subject}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {mockTickets[0].created} • Last update {mockTickets[0].lastUpdate}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl"
                      onClick={() => setActiveTicket(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.sender === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <Avatar className="w-10 h-10 rounded-xl flex-shrink-0">
                          <AvatarFallback className={`rounded-xl ${
                            message.sender === 'user' 
                              ? 'bg-blue-100 text-blue-600'
                              : message.sender === 'ai'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-5 h-5" />
                            ) : message.sender === 'ai' ? (
                              <Bot className="w-5 h-5" />
                            ) : (
                              'PS'
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.sender !== 'user' && (
                              <span className="text-sm font-semibold">
                                {message.sender === 'ai' ? 'AI Assistant' : 'Support Team'}
                              </span>
                            )}
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <div
                            className={`inline-block p-4 rounded-2xl ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-xl flex-shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl flex-shrink-0">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="rounded-xl"
                    />
                    <Button className="rounded-xl flex-shrink-0">
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="rounded-2xl h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <MessageCircleMore className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No Ticket Selected</h3>
                  <p className="text-gray-600 mb-6">
                    Select a ticket from the list to view details and messages
                  </p>
                  <Button className="rounded-xl">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Create New Ticket
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="rounded-2xl mt-6">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  question: 'How do I complete my profile?',
                  category: 'Profile',
                },
                {
                  question: 'How to apply for jobs?',
                  category: 'Jobs',
                },
                {
                  question: 'How do credits work?',
                  category: 'Credits',
                },
                {
                  question: 'How to verify my documents?',
                  category: 'Verification',
                },
              ].map((faq, idx) => (
                <Card key={idx} className="rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="rounded-full mb-2">
                      {faq.category}
                    </Badge>
                    <p className="font-medium text-sm">{faq.question}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
