"use client";

interface SaysoLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

export default function SaysoLoader({
  size = 'md',
  className = '',
  text = 'Loading...'
}: SaysoLoaderProps) {
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

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* sayso animated logo loader */}
      <div className={`relative flex items-center justify-center`} style={{
        width: size === 'sm' ? '60px' : size === 'md' ? '80px' : size === 'lg' ? '120px' : '160px',
        height: size === 'sm' ? '24px' : size === 'md' ? '32px' : size === 'lg' ? '48px' : '64px'
      }}>
        {/* Outer ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} rounded-full border-2 border-sage/20 animate-spin`}
             style={{ animationDuration: '2s' }} />

        {/* Inner ring */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${sizeClasses[size]} rounded-full border-2 border-transparent border-t-sage animate-spin`}
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />

        {/* sayso animated text in center */}
        <div className={`font-sf font-800 text-sage ${
          size === 'sm' ? 'text-xs' :
          size === 'md' ? 'text-sm' :
          size === 'lg' ? 'text-base' : 'text-lg'
        } tracking-wide`}>
          <span className="inline-block animate-bounce" style={{ animationDelay: '0ms' }}>s</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '100ms' }}>a</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '200ms' }}>y</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '300ms' }}>s</span>
          <span className="inline-block animate-bounce" style={{ animationDelay: '400ms' }}>o</span>
        </div>
      </div>

      {/* Loading text */}
      <p className={`font-sf font-500 text-charcoal/70 ${textSizeClasses[size]} animate-pulse`}>
        {text}
      </p>
    </div>
  );
}
