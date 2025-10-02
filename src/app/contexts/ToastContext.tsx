"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'sage';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Generate unique ID to prevent collisions
  const generateUniqueId = () => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const showToast = (message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = generateUniqueId();
    const newToast: Toast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-white text-sage';
      case 'sage':
        return 'bg-white text-sage';
      case 'error':
        return 'bg-white text-red-500';
      case 'warning':
        return 'bg-white text-amber-500';
      default:
        return 'bg-white text-charcoal';
    }
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'sage':
        return 'information-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const value: ToastContextType = {
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container - Simple version without animations for performance */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
                pointer-events-auto max-w-sm w-full backdrop-blur-xl rounded-xl p-4 shadow-2xl
                transition-all duration-300 ease-out
                ${getToastStyles(toast.type)}
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ion-icon
                    name={getToastIcon(toast.type)}
                    style={{ fontSize: '24px' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-urbanist text-sm font-600 leading-tight">
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity duration-200"
                >
                  <ion-icon name="close" style={{ fontSize: '20px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}