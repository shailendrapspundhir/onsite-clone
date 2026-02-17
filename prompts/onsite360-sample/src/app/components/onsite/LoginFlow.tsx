import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Phone, Users, Briefcase, Languages, Volume2 } from 'lucide-react';

export function LoginFlow() {
  const [step, setStep] = useState<'select-role' | 'phone' | 'otp'>('select-role');
  const [userType, setUserType] = useState<'worker' | 'employer' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');

  const handleRoleSelect = (role: 'worker' | 'employer') => {
    setUserType(role);
    setStep('phone');
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber.length === 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = () => {
    console.log('Login successful', { userType, phoneNumber, otp });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-600 text-white p-4 rounded-2xl">
              <Users className="w-12 h-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">OnSite 360</CardTitle>
          <CardDescription className="text-base">
            Connecting workers with opportunities
          </CardDescription>
          
          {/* Language and Voice Selector */}
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Languages className="w-4 h-4 mr-2" />
              English
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              <Volume2 className="w-4 h-4 mr-2" />
              Voice Help
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {step === 'select-role' && (
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600 mb-6">
                How would you like to continue?
              </p>
              
              <Button
                onClick={() => handleRoleSelect('worker')}
                className="w-full h-auto py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">I'm looking for work</div>
                    <div className="text-sm text-blue-100">Find jobs near you</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => handleRoleSelect('employer')}
                className="w-full h-auto py-6 rounded-2xl bg-green-600 hover:bg-green-700 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">I want to hire</div>
                    <div className="text-sm text-green-100">Find workers quickly</div>
                  </div>
                </div>
              </Button>
            </div>
          )}

          {step === 'phone' && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setStep('select-role')}
                className="text-sm text-gray-600"
              >
                ← Back
              </Button>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Enter your mobile number
                </h3>
                <p className="text-sm text-gray-600">
                  We'll send you a verification code
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-16">
                    <Input
                      value="+91"
                      disabled
                      className="rounded-xl text-center font-semibold"
                    />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="rounded-xl text-lg"
                    maxLength={10}
                  />
                </div>

                <Button
                  onClick={handlePhoneSubmit}
                  disabled={phoneNumber.length !== 10}
                  className="w-full rounded-xl h-12 text-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Send OTP
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setStep('phone')}
                className="text-sm text-gray-600"
              >
                ← Back
              </Button>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  Verify your mobile number
                </h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-sm font-semibold">+91 {phoneNumber}</p>
              </div>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="rounded-xl" />
                    <InputOTPSlot index={1} className="rounded-xl" />
                    <InputOTPSlot index={2} className="rounded-xl" />
                    <InputOTPSlot index={3} className="rounded-xl" />
                    <InputOTPSlot index={4} className="rounded-xl" />
                    <InputOTPSlot index={5} className="rounded-xl" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6}
                className="w-full rounded-xl h-12 text-lg"
              >
                Verify & Continue
              </Button>

              <div className="text-center">
                <button className="text-sm text-blue-600 hover:underline">
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
