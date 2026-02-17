import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@onsite360/ui-shared';
import { Button } from '@onsite360/ui-shared';
import { Input } from '@onsite360/ui-shared';
import { Progress } from '@onsite360/ui-shared';
import {
  Mic, Video, Volume2, Languages, User, Briefcase, MapPin,
  Phone, Camera, Play, Pause,
  SkipForward, Check, Sparkles
} from 'lucide-react';

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

export function AIOnboarding({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});

  const step = workerSteps[currentStep];
  const progress = ((currentStep + 1) / workerSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < workerSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setIsRecording(false);
    } else {
      onComplete?.();
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
        const mockResponses = {
          0: 'Rajesh Kumar Singh',
          2: 'House number 45, near bus stop, Indiranagar main road, Bangalore 560038',
          3: 'I have worked as a security guard for 5 years. I know CCTV monitoring, visitor management, and have basic first aid training. I have worked at residential apartments and office buildings.',
        };
        const response = mockResponses[currentStep as keyof typeof mockResponses] || 'Sample response';
        setResponses(prev => ({ ...prev, [currentStep]: response }));
      }, 3000);
    }
  };

  const handleTextInput = (value: string) => {
    setResponses(prev => ({ ...prev, [currentStep]: value }));
  };

  const StepIcon = step?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white p-4 rounded-3xl">
              <Sparkles className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Onboarding</h1>
          <p className="text-gray-600">Let's get to know you better with our smart assistant</p>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step {currentStep + 1} of {workerSteps.length}</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <StepIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <p className="text-gray-600">{step.question}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language and Voice Settings */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm" className="rounded-full">
                <Languages className="w-4 h-4 mr-2" />
                English
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Volume2 className="w-4 h-4 mr-2" />
                Female Voice
              </Button>
            </div>

            {/* Input Area */}
            {step.type === 'voice' && (
              <div className="text-center space-y-4">
                <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-colors ${
                  isRecording ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
                }`}>
                  <Mic className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} />
                </div>
                <p className="text-sm text-gray-600">
                  {isRecording ? 'Listening... Speak clearly' : 'Click to start recording'}
                </p>
                <Button
                  onClick={toggleRecording}
                  variant={isRecording ? "danger" : "primary"}
                  size="lg"
                  className="rounded-full px-8"
                >
                  {isRecording ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
              </div>
            )}

            {step.type === 'text' && (
              <div className="space-y-4">
                <Input
                  placeholder="Enter your response..."
                  value={responses[currentStep] || ''}
                  onChange={(e) => handleTextInput(e.target.value)}
                  className="text-lg"
                />
              </div>
            )}

            {step.type === 'video' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-xl flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-500" />
                </div>
                <p className="text-sm text-gray-600">Video recording will start automatically</p>
                <Button size="lg" className="rounded-full px-8">
                  <Video className="w-5 h-5 mr-2" />
                  Start Video
                </Button>
              </div>
            )}

            {/* Response Display */}
            {responses[currentStep] && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Your Response:</p>
                      <p className="text-blue-800">{responses[currentStep]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 rounded-xl"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip for Now
          </Button>
          <Button
            onClick={handleNext}
            disabled={!responses[currentStep] && step.type !== 'video'}
            className="flex-1 rounded-xl"
          >
            {currentStep === workerSteps.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Setup
              </>
            ) : (
              'Next Step'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}