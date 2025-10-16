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
  return (
    <div className="text-center space-y-2 pt-4">
      <div className="flex items-center justify-center gap-3 text-xs">
        <div className={`flex items-center gap-1 min-w-0 ${usernameValid ? 'text-sage' : 'text-gray-400'}`}>
          {usernameValid ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span className="text-truncate">Username</span>
        </div>
        <div className={`flex items-center gap-1 min-w-0 ${emailValid ? 'text-sage' : 'text-gray-400'}`}>
          {emailValid ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span className="text-truncate">Email</span>
        </div>
        <div className={`flex items-center gap-1 min-w-0 ${passwordStrong ? 'text-sage' : 'text-gray-400'}`}>
          {passwordStrong ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span className="text-truncate">Password</span>
        </div>
        <div className={`flex items-center gap-1 min-w-0 ${consentGiven ? 'text-sage' : 'text-gray-400'}`}>
          {consentGiven ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span className="text-truncate">Terms</span>
        </div>
      </div>
      <p className="text-xs text-charcoal/60">
        Next - Pick your interests
      </p>
    </div>
  );
}
