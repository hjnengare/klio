"use client";

import { Circle, CheckCircle } from "lucide-react";

interface RegistrationProgressProps {
  usernameValid: boolean;
  emailValid: boolean;
  passwordStrong: boolean;
  consentGiven: boolean;
}

export function RegistrationProgress({
  usernameValid,
  emailValid,
  passwordStrong,
  consentGiven
}: RegistrationProgressProps) {
  const completedSteps = [usernameValid, emailValid, passwordStrong, consentGiven].filter(Boolean).length;
  const progress = (completedSteps / 4) * 100;

  return (
    <div className="space-y-4 pt-6" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* Progress bar */}
      <div className="relative h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-white via-white to-white/90 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress indicators */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${usernameValid ? 'scale-100' : 'scale-95 opacity-60'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            usernameValid
              ? 'bg-gradient-to-br from-white via-white to-white/95 backdrop-blur-xl border border-white/60 ring-1 ring-white/30 shadow-sm'
              : 'bg-white/10 backdrop-blur-sm border border-white/20'
          }`}>
            {usernameValid ? <CheckCircle className="w-4 h-4 text-sage" /> : <Circle className="w-4 h-4 text-white/40" />}
          </div>
          <span className={`text-xs font-medium transition-colors duration-300 ${usernameValid ? 'text-white' : 'text-white/50'}`}>
            Username
          </span>
        </div>

        <div className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${emailValid ? 'scale-100' : 'scale-95 opacity-60'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            emailValid
              ? 'bg-gradient-to-br from-white via-white to-white/95 backdrop-blur-xl border border-white/60 ring-1 ring-white/30 shadow-sm'
              : 'bg-white/10 backdrop-blur-sm border border-white/20'
          }`}>
            {emailValid ? <CheckCircle className="w-4 h-4 text-sage" /> : <Circle className="w-4 h-4 text-white/40" />}
          </div>
          <span className={`text-xs font-medium transition-colors duration-300 ${emailValid ? 'text-white' : 'text-white/50'}`}>
            Email
          </span>
        </div>

        <div className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${passwordStrong ? 'scale-100' : 'scale-95 opacity-60'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            passwordStrong
              ? 'bg-gradient-to-br from-white via-white to-white/95 backdrop-blur-xl border border-white/60 ring-1 ring-white/30 shadow-sm'
              : 'bg-white/10 backdrop-blur-sm border border-white/20'
          }`}>
            {passwordStrong ? <CheckCircle className="w-4 h-4 text-sage" /> : <Circle className="w-4 h-4 text-white/40" />}
          </div>
          <span className={`text-xs font-medium transition-colors duration-300 ${passwordStrong ? 'text-white' : 'text-white/50'}`}>
            Password
          </span>
        </div>

        <div className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 ${consentGiven ? 'scale-100' : 'scale-95 opacity-60'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            consentGiven
              ? 'bg-gradient-to-br from-white via-white to-white/95 backdrop-blur-xl border border-white/60 ring-1 ring-white/30 shadow-sm'
              : 'bg-white/10 backdrop-blur-sm border border-white/20'
          }`}>
            {consentGiven ? <CheckCircle className="w-4 h-4 text-sage" /> : <Circle className="w-4 h-4 text-white/40" />}
          </div>
          <span className={`text-xs font-medium transition-colors duration-300 ${consentGiven ? 'text-white' : 'text-white/50'}`}>
            Terms
          </span>
        </div>
      </div>

      {/* Next step indicator */}
      {completedSteps === 4 && (
        <div className="text-center animate-fade-in">
          <p className="text-sm text-white/90 font-medium">
            ✨ Ready! Next - Pick your interests
          </p>
        </div>
      )}
    </div>
  );
}
