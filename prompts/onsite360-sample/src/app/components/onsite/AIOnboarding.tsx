import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Mic, Video, Volume2, Languages, User, Briefcase, MapPin,
  Calendar, Phone, Mail, FileText, Camera, Play, Pause,
  SkipForward, Check, Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface OnboardingStep {
  id: number;
  title: string;
  question: string;
  type: 'text' | 'voice' | 'video' | 'select';
  icon: any;
}

const workerSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Personal Details',
    question: 'Please tell us your full name',
    type: 'voice',
    icon: User,
  },
  {
    id: 2,
    title: 'Contact Information',
    question: 'What is your mobile number?',
    type: 'text',
    icon: Phone,
  },
  {
    id: 3,
    title: 'Location',
    question: 'Where do you live? Tell us your current address',
    type: 'voice',
    icon: MapPin,
  },
  {
    id: 4,
    title: 'Skills & Experience',
    question: 'Tell us about your skills and work experience',
    type: 'video',
    icon: Briefcase,
  },
  {
    id: 5,
    title: 'Profile Picture',
    question: 'Take a photo for your profile',
    type: 'video',
    icon: Camera,
  },
];

export function AIOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [transcript, setTranscript] = useState('');
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');

  const step = workerSteps[currentStep];
  const progress = ((currentStep + 1) / workerSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < workerSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTranscript('');
      setIsRecording(false);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate AI transcription after a delay
      setTimeout(() => {
        if (currentStep === 0) {
          setTranscript('Rajesh Kumar Singh');
        } else if (currentStep === 2) {
          setTranscript('House number 45, near bus stop, Indiranagar main road, Bangalore 560038');
        } else if (currentStep === 3) {
          setTranscript('I have worked as a security guard for 5 years. I know CCTV monitoring, visitor management, and have basic first aid training. I have worked at residential apartments and office buildings.');
        }
      }, 3000);
    }
  };

  const StepIcon = step?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-6">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Header with Progress */}
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  AI-Assisted Onboarding
                </h1>
                <p className="text-sm text-gray-600">Step {currentStep + 1} of {workerSteps.length}</p>
              </div>
              <Badge variant="secondary" className="rounded-full text-lg px-4 py-2">
                {Math.round(progress)}%
              </Badge>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Language & Voice Selection */}
        <Card className="rounded-3xl shadow-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2 block text-sm opacity-90">Select Language</Label>
                <div className="flex gap-2 flex-wrap">
                  {['English', 'हिंदी', 'ಕನ್ನಡ', 'தமிழ்', 'తెలుగు'].map((lang) => (
                    <Button
                      key={lang}
                      variant={selectedLanguage === lang ? 'secondary' : 'outline'}
                      size="sm"
                      className={`rounded-full ${
                        selectedLanguage !== lang ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : ''
                      }`}
                      onClick={() => setSelectedLanguage(lang)}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-white mb-2 block text-sm opacity-90">AI Voice</Label>
                <div className="flex gap-2">
                  <Button
                    variant={voiceGender === 'female' ? 'secondary' : 'outline'}
                    size="sm"
                    className={`rounded-full flex-1 ${
                      voiceGender !== 'female' ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : ''
                    }`}
                    onClick={() => setVoiceGender('female')}
                  >
                    Female Voice
                  </Button>
                  <Button
                    variant={voiceGender === 'male' ? 'secondary' : 'outline'}
                    size="sm"
                    className={`rounded-full flex-1 ${
                      voiceGender !== 'male' ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' : ''
                    }`}
                    onClick={() => setVoiceGender('male')}
                  >
                    Male Voice
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Onboarding Card */}
        <Card className="rounded-3xl shadow-2xl">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <StepIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{step?.title}</CardTitle>
                <p className="text-gray-600 mt-1">{step?.question}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Voice Input */}
            {step?.type === 'voice' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Button
                    size="lg"
                    className={`w-32 h-32 rounded-full transition-all ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                        : 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                    onClick={toggleRecording}
                  >
                    <Mic className="w-12 h-12" />
                  </Button>
                  <p className="mt-4 text-lg font-medium">
                    {isRecording ? 'Listening...' : 'Tap to speak'}
                  </p>
                  {isRecording && (
                    <p className="text-sm text-gray-600 mt-2">
                      Speak clearly in {selectedLanguage}
                    </p>
                  )}
                </div>

                {transcript && (
                  <Card className="rounded-2xl bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">AI Transcription:</p>
                          <p className="text-lg font-medium text-gray-900">{transcript}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button variant="outline" className="w-full rounded-2xl" onClick={handleSkip}>
                  <FileText className="w-4 h-4 mr-2" />
                  Type Instead
                </Button>
              </div>
            )}

            {/* Video Input */}
            {step?.type === 'video' && (
              <div className="space-y-6">
                <div className="aspect-video bg-gray-900 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {isRecording ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                      <div className="text-center text-white z-10">
                        <Video className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                        <p className="text-xl font-semibold">Recording...</p>
                        <p className="text-sm opacity-75 mt-2">00:23</p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-xl font-semibold mb-2">
                        {currentStep === 4 ? 'Take your photo' : 'Record your introduction'}
                      </p>
                      <p className="text-sm opacity-75">
                        AI will help you create a great profile
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={toggleRecording}
                    className={`flex-1 rounded-2xl h-14 text-lg ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start {currentStep === 4 ? 'Camera' : 'Recording'}
                      </>
                    )}
                  </Button>
                </div>

                {transcript && (
                  <Card className="rounded-2xl bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Check className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            {currentStep === 4 ? 'Photo captured!' : 'Video recorded successfully!'}
                          </p>
                          <p className="text-sm text-green-700">
                            AI has processed your input
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Text Input */}
            {step?.type === 'text' && (
              <div className="space-y-4">
                <Input
                  placeholder="Enter your phone number"
                  className="rounded-2xl h-14 text-lg"
                />
                <Button variant="outline" className="w-full rounded-2xl">
                  <Mic className="w-4 h-4 mr-2" />
                  Use Voice Instead
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card className="rounded-3xl shadow-xl">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 rounded-2xl h-12"
                >
                  Previous
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSkip}
                className="rounded-2xl h-12"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
              <Button
                onClick={handleNext}
                disabled={!transcript && step?.type !== 'text'}
                className="flex-1 rounded-2xl h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStep === workerSteps.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="rounded-3xl shadow-xl border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Our AI assistant understands multiple languages and accents. 
                  Speak naturally and we'll help you complete your profile.
                </p>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
