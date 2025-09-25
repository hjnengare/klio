"use client";

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';

// Accessible Modal Component
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  className = '',
}) => {
  const { containerRef, manageFocus, restoreFocus, announce } = useAccessibility({
    trapFocus: true,
    restoreFocus: true,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  const descId = description ? `modal-desc-${Math.random().toString(36).substr(2, 9)}` : undefined;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      announce(`Modal opened: ${title}`, 'assertive');

      // Focus the modal
      setTimeout(() => {
        if (modalRef.current) {
          manageFocus(modalRef.current);
        }
      }, 100);
    } else {
      document.body.style.overflow = '';
      restoreFocus();
      announce('Modal closed', 'polite');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title, manageFocus, restoreFocus, announce]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        ref={(node) => {
          modalRef.current = node;
          if (containerRef) {
            (containerRef as any).current = node;
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`modal-content ${className}`}
        tabIndex={-1}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          outline: 'none',
        }}
      >
        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <h2 id={titleId} style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
            {title}
          </h2>
          {description && (
            <p id={descId} style={{ margin: '8px 0 0 0', color: '#666' }}>
              {description}
            </p>
          )}
          <button
            onClick={onClose}
            aria-label="Close modal"
            data-close
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Accessible Tooltip Component
interface AccessibleTooltipProps {
  content: string;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const AccessibleTooltip: React.FC<AccessibleTooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setShouldShow(true);
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShouldShow(false);
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      hideTooltip();
    }
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={handleKeyDown}
    >
      {React.cloneElement(children, {
        'aria-describedby': shouldShow ? tooltipId : undefined,
      })}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`tooltip tooltip-${placement}`}
          style={{
            position: 'absolute',
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            ...(placement === 'top' && {
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
            }),
            ...(placement === 'bottom' && {
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
            }),
            ...(placement === 'left' && {
              right: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              marginRight: '8px',
            }),
            ...(placement === 'right' && {
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              marginLeft: '8px',
            }),
          }}
        >
          {content}
        </div>
      )}
    </span>
  );
};

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}, ref) => {
  const { announce } = useAccessibility();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      e.preventDefault();
      return;
    }

    // Announce button press for screen readers
    const buttonText = typeof children === 'string' ? children : 'Button';
    announce(`${buttonText} activated`, 'polite');

    if (props.onClick) {
      props.onClick(e);
    }
  };

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '14px', minHeight: '36px' },
    md: { padding: '12px 20px', fontSize: '16px', minHeight: '44px' },
    lg: { padding: '16px 24px', fontSize: '18px', minHeight: '52px' },
  };

  const variantStyles = {
    primary: { backgroundColor: '#007bff', color: 'white', border: 'none' },
    secondary: { backgroundColor: '#6c757d', color: 'white', border: 'none' },
    danger: { backgroundColor: '#dc3545', color: 'white', border: 'none' },
  };

  return (
    <button
      ref={ref}
      {...props}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-describedby={loading ? `${props.id}-loading` : undefined}
      className={`accessible-button ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '6px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        fontWeight: '500',
        textDecoration: 'none',
        opacity: disabled || loading ? 0.6 : 1,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...props.style,
      }}
    >
      {loading ? (
        <>
          <span className="loading-spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          {loadingText}
          <span id={`${props.id}-loading`} className="sr-only">
            Loading, please wait
          </span>
        </>
      ) : (
        <>
          {leftIcon && <span className="button-icon">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="button-icon">{rightIcon}</span>}
        </>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .accessible-button:focus {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        .accessible-button:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .accessible-button:active:not(:disabled) {
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .accessible-button {
            transition: none;
          }
          .loading-spinner {
            animation: none;
          }
        }

        @media (prefers-contrast: high) {
          .accessible-button {
            border: 2px solid currentColor;
          }
        }
      `}</style>
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

// Accessible Dropdown Component
interface AccessibleDropdownProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  onOpenChange?: (open: boolean) => void;
}

export const AccessibleDropdown: React.FC<AccessibleDropdownProps> = ({
  trigger,
  children,
  placement = 'bottom-start',
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { containerRef, manageFocus, announce } = useAccessibility({
    trapFocus: true,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const menuId = `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);

    if (newState) {
      announce('Menu opened', 'polite');
      // Focus first menu item
      setTimeout(() => {
        const firstItem = dropdownRef.current?.querySelector('[role="menuitem"]') as HTMLElement;
        if (firstItem) {
          manageFocus(firstItem);
        }
      }, 100);
    } else {
      announce('Menu closed', 'polite');
      // Return focus to trigger
      if (triggerRef.current) {
        manageFocus(triggerRef.current);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      onOpenChange?.(false);
      if (triggerRef.current) {
        manageFocus(triggerRef.current);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
      onKeyDown={handleKeyDown}
    >
      {React.cloneElement(trigger, {
        ref: triggerRef,
        onClick: handleToggle,
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu',
        'aria-controls': isOpen ? menuId : undefined,
      })}

      {isOpen && (
        <div
          ref={dropdownRef}
          id={menuId}
          role="menu"
          className={`dropdown-menu ${placement}`}
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '8px 0',
            zIndex: 1000,
            minWidth: '200px',
            ...(placement.includes('bottom') && { top: '100%', marginTop: '4px' }),
            ...(placement.includes('top') && { bottom: '100%', marginBottom: '4px' }),
            ...(placement.includes('start') && { left: 0 }),
            ...(placement.includes('end') && { right: 0 }),
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Accessible Menu Item
interface AccessibleMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const AccessibleMenuItem: React.FC<AccessibleMenuItemProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      className={`menu-item ${disabled ? 'disabled' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-disabled={disabled}
      style={{
        padding: '12px 16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'background-color 0.2s ease',
        userSelect: 'none',
      }}
    >
      {children}

      <style jsx>{`
        .menu-item:hover:not(.disabled) {
          background-color: #f8f9fa;
        }

        .menu-item:focus {
          background-color: #e9ecef;
          outline: 2px solid #007bff;
          outline-offset: -2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .menu-item {
            transition: none;
          }
        }

        @media (prefers-contrast: high) {
          .menu-item:focus {
            border: 2px solid;
          }
        }
      `}</style>
    </div>
  );
};