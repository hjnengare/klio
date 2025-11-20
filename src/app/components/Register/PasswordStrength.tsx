"use client";

interface PasswordStrengthProps {
  password: string;
  strength: {
    score: number;
    feedback: string;
    checks: {
      length: boolean;
      uppercase: boolean;
      lowercase: boolean;
      number: boolean;
    };
  };
}

export default function PasswordStrength({ password, strength }: PasswordStrengthProps) {
  if (password.length === 0) return null;

  return (
    <div className="h-5 mt-1 flex items-center gap-2">
      <div className="flex-1 flex gap-1" role="progressbar" aria-valuenow={strength.score} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 transition-all duration-300 ${
              level <= strength.score
                ? level === 1
                  ? 'bg-error-500'
                  : level === 2
                  ? 'bg-orange-400'
                  : level === 3
                  ? 'bg-yellow-400'
                  : strength.score === 4
                  ? 'bg-blue-500'
                  : 'bg-sage'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
