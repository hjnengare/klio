"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Phone, Globe, MapPin, Mail, CheckCircle, DollarSign } from "react-feather";

export interface BusinessInfo {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  price_range?: '$' | '$$' | '$$$' | '$$$$';
  verified?: boolean;
}

interface BusinessInfoModalProps {
  businessInfo: BusinessInfo;
  buttonRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessInfoModal({ 
  businessInfo, 
  buttonRef, 
  isOpen, 
  onClose 
}: BusinessInfoModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const gap = 8;
      const rightPadding = 16;
      const modalWidth = 400;
      const maxWidth = window.innerWidth - rightPadding;
      
      // Calculate left position - align to right edge of button or adjust if it would overflow
      let left = rect.left;
      if (left + modalWidth > maxWidth) {
        left = maxWidth - modalWidth;
      }
      // Ensure it doesn't go off the left edge
      left = Math.max(rightPadding, left);
      
      setModalPosition({
        top: rect.bottom + gap,
        left: left,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Invisible overlay to close on outside click */}
      <div
        className="fixed inset-0 z-[9999] pointer-events-auto"
        onClick={handleClose}
      />
      {/* Modal positioned below header */}
      <div
        className={`fixed z-[10000] bg-off-white rounded-2xl border border-white/60 shadow-xl max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto transition-all duration-300 ease-out ${
          isClosing ? 'opacity-0 scale-95 translate-y-[-8px]' : 'opacity-100 scale-100 translate-y-0'
        }`}
        style={{
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          width: '400px',
          maxWidth: 'calc(100vw - 32px)',
          fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
          animation: isClosing ? 'none' : 'fadeInScale 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-off-white border-b border-charcoal/10 px-5 sm:px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-charcoal" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
            Business Information
          </h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full border border-charcoal/10 bg-off-white/70 hover:bg-sage/10 hover:text-sage text-charcoal/80 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-sage/30 min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-4 pb-6 space-y-4" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
          {businessInfo.name && (
            <div>
              <h3 className="text-sm font-semibold text-charcoal mb-2" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                {businessInfo.name}
              </h3>
            </div>
          )}

          {businessInfo.category && (
            <div className="flex items-center gap-2 text-sm text-charcoal/70" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              <span className="font-medium text-charcoal/60">Category:</span>
              <span>{businessInfo.category}</span>
            </div>
          )}

          {businessInfo.description && (
            <div className="text-sm text-charcoal/70" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              <p className="font-medium text-charcoal/60 mb-1">Description</p>
              <p className="leading-relaxed">{businessInfo.description}</p>
            </div>
          )}

          {businessInfo.price_range && (
            <div className="flex items-center gap-2 text-sm text-charcoal/70" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              <DollarSign className="w-4 h-4 text-sage flex-shrink-0" />
              <span className="font-medium text-charcoal/60">Price Range:</span>
              <span>{businessInfo.price_range}</span>
            </div>
          )}

          {businessInfo.verified !== undefined && (
            <div className="flex items-center gap-2 text-sm" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
              <CheckCircle className={`w-4 h-4 flex-shrink-0 ${businessInfo.verified ? 'text-sage' : 'text-charcoal/40'}`} />
              <span className={`font-medium ${businessInfo.verified ? 'text-sage' : 'text-charcoal/60'}`}>
                {businessInfo.verified ? 'Verified Business' : 'Not Verified'}
              </span>
            </div>
          )}

          {businessInfo.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal mb-0.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Location</p>
                <p className="text-sm text-charcoal/70" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{businessInfo.location}</p>
              </div>
            </div>
          )}

          {businessInfo.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal mb-0.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Address</p>
                <p className="text-sm text-charcoal/70" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>{businessInfo.address}</p>
              </div>
            </div>
          )}

          {businessInfo.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal mb-0.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Phone</p>
                <a href={`tel:${businessInfo.phone}`} className="text-sm text-sage hover:text-coral transition-colors" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                  {businessInfo.phone}
                </a>
              </div>
            </div>
          )}

          {businessInfo.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal mb-0.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Email</p>
                <a href={`mailto:${businessInfo.email}`} className="text-sm text-sage hover:text-coral transition-colors break-all" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
                  {businessInfo.email}
                </a>
              </div>
            </div>
          )}

          {businessInfo.website && (
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-sage mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal mb-0.5" style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>Website</p>
                <a 
                  href={businessInfo.website.startsWith('http') ? businessInfo.website : `https://${businessInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-sage hover:text-coral transition-colors break-all"
                  style={{ fontFamily: '"SF Pro New", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
                >
                  {businessInfo.website}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}

