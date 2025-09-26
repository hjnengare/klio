"use client";

interface BlubberLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export default function BlubberLoader({
  size = 'md',
  className = '',
  text = 'Loading...'
}: BlubberLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Color scheme: b=coral, l=sage, u=charcoal, b=coral, b=coral, R=sage (capital R for branding)
  const letterColors = [
    '#FF7A5C', // b - coral
    '#749176', // l - sage
    '#404040', // u - charcoal
    '#FF7A5C', // b - coral
    '#FF7A5C', // b - coral
    '#749176'  // R - sage (capital R for branding)
  ];

  const letters = ['b', 'l', 'u', 'b', 'b', 'R'];

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* KLIO animated logo loader */}
      <div className={`relative flex items-center justify-center`} style={{
        width: size === 'sm' ? '60px' : size === 'md' ? '80px' : size === 'lg' ? '120px' : '160px',
        height: size === 'sm' ? '24px' : size === 'md' ? '32px' : size === 'lg' ? '48px' : '64px'
      }}>
        {/* Outer ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} rounded-full border-2 border-sage/20 animate-spin`}
             style={{ animationDuration: '2s' }} />

        {/* Inner ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-coral animate-spin`}
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />

        {/* KLIO animated text in center */}
        <div className={`font-outfit font-800 ${
          size === 'sm' ? 'text-xs' :
          size === 'md' ? 'text-sm' :
          size === 'lg' ? 'text-base' : 'text-lg'
        } tracking-wide`}>
          {letters.map((letter, index) => (
            <span
              key={index}
              className="inline-block animate-bounce"
              style={{
                animationDelay: `${index * 100}ms`,
                color: letterColors[index]
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Loading text */}
      <p className={`font-urbanist font-500 text-charcoal/70 ${textSizeClasses[size]} animate-pulse`}>
        {text}
      </p>
    </div>
  );
}