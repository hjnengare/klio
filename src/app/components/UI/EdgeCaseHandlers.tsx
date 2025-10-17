"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAsyncState } from '../../hooks/useAsyncState';

// Enhanced Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string;
  retryCount: number;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void; retry: () => void }>;
  onError?: (error: Error, errorInfo: any) => void;
  maxRetries?: number;
  resetOnPropsChange?: boolean;
}

export class EnhancedErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Math.random().toString(36).substr(2, 9),
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // Send error to monitoring service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange = true } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.children !== this.props.children && resetOnPropsChange) {
      this.setState({
        hasError: false,
        error: null,
        errorId: '',
        retryCount: 0,
      });
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
      retryCount: 0,
    });
  };

  handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      this.setState(prev => ({
        hasError: false,
        error: null,
        retryCount: prev.retryCount + 1,
      }));

      // Auto-retry after a delay if it fails again
      this.retryTimeoutId = setTimeout(() => {
        if (this.state.hasError) {
          this.handleRetry();
        }
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff
    }
  };

  render() {
    const { children, fallback: Fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError && error) {
      if (Fallback) {
        return <Fallback error={error} reset={this.handleReset} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={error} reset={this.handleReset} retry={this.handleRetry} />;
    }

    return children;
  }
}

// Default Error Fallback Component
interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
  retry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset, retry }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        border: '1px solid #fee2e2',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        margin: '1rem',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>

      <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Something went wrong</h2>

      <p style={{ color: '#7f1d1d', marginBottom: '1.5rem' }}>
        We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
        <button
          onClick={retry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>

        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        style={{
          fontSize: '0.875rem',
          color: '#7f1d1d',
          background: 'none',
          border: 'none',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        {showDetails ? 'Hide' : 'Show'} Error Details
      </button>

      {showDetails && (
        <details style={{ marginTop: '1rem', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>Error Information</summary>
          <pre
            style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '0.875rem',
              color: '#374151',
            }}
          >
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

// Enhanced Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  description,
  action,
  secondaryAction,
  className = '',
  size = 'md',
}) => {
  const sizeStyles = {
    sm: { padding: '2rem 1rem', fontSize: '14px' },
    md: { padding: '3rem 2rem', fontSize: '16px' },
    lg: { padding: '4rem 3rem', fontSize: '18px' },
  };

  const iconSizes = {
    sm: '48px',
    md: '64px',
    lg: '80px',
  };

  return (
    <div
      className={`empty-state ${className}`}
      style={{
        textAlign: 'center',
        color: '#6b7280',
        ...sizeStyles[size],
      }}
    >
      <div
        style={{
          fontSize: iconSizes[size],
          marginBottom: '1rem',
          opacity: 0.8,
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontSize: size === 'lg' ? '1.5rem' : size === 'md' ? '1.25rem' : '1.125rem',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            marginBottom: action || secondaryAction ? '2rem' : '0',
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {action && (
            <button
              onClick={action.onClick}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Loading State Component with Skeleton
interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  skeletonCount?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  text,
  skeletonCount = 3,
  className = '',
}) => {
  const sizeMap = {
    sm: { width: '20px', height: '20px', fontSize: '14px' },
    md: { width: '32px', height: '32px', fontSize: '16px' },
    lg: { width: '48px', height: '48px', fontSize: '18px' },
  };

  const renderSpinner = () => (
    <div
      style={{
        width: sizeMap[size].width,
        height: sizeMap[size].height,
        border: '2px solid #e5e7eb',
        borderTop: '2px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    />
  );

  const renderDots = () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#3b82f6',
            borderRadius: '50%',
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      style={{
        width: '100%',
        height: '20px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}
    />
  );

  const renderSkeleton = () => (
    <div style={{ width: '100%' }}>
      {Array.from({ length: skeletonCount }, (_, i) => (
        <div
          key={i}
          style={{
            height: '20px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            marginBottom: '8px',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            width: i === skeletonCount - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderSpinner();
    }
  };

  return (
    <div
      className={`loading-state ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
      }}
      role="status"
      aria-label={text || 'Loading'}
    >
      {renderLoader()}

      {text && (
        <span
          style={{
            fontSize: sizeMap[size].fontSize,
            color: '#6b7280',
          }}
        >
          {text}
        </span>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

// Image Error Fallback Component
interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackComponent?: React.ReactNode;
  onError?: (error: Event) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  fallbackComponent,
  onError,
  retryAttempts = 2,
  retryDelay = 1000,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Image failed to load: ${currentSrc}`);

    if (retryCount.current < retryAttempts) {
      retryCount.current++;

      setTimeout(() => {
        setCurrentSrc(`${src}?retry=${retryCount.current}`);
      }, retryDelay * retryCount.current);

      return;
    }

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      retryCount.current = 0;
      return;
    }

    setHasError(true);
    setIsLoading(false);
    onError?.(event.nativeEvent);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    retryCount.current = 0;
  };

  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
      setHasError(false);
      setIsLoading(true);
      retryCount.current = 0;
    }
  }, [src, currentSrc]);

  if (hasError) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          fontSize: '14px',
          ...props.style,
        }}
      >
        {fallbackComponent || (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🖼️</div>
            <div>Image not available</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
          }}
        >
          <LoadingState type="spinner" size="sm" />
        </div>
      )}

      <img
        {...props}
        src={currentSrc}
        alt={props.alt || ""}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          ...props.style,
          display: isLoading ? 'none' : 'block',
        }}
      />
    </>
  );
};

// Network Status Handler
export const NetworkStatusHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {showOfflineMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fbbf24',
            color: '#92400e',
            padding: '12px',
            textAlign: 'center',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          📡 You're offline. Some features may be limited.
        </div>
      )}

      <div style={{ marginTop: showOfflineMessage ? '48px' : '0' }}>
        {children}
      </div>
    </>
  );
};