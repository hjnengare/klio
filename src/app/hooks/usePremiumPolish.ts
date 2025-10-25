"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

// Optical Alignment System
interface OpticalAlignment {
  element: HTMLElement;
  adjustments: {
    x: number;
    y: number;
    reason: string;
  };
}

export function useOpticalCentering() {
  const [alignments, setAlignments] = useState<Map<string, OpticalAlignment>>(new Map());

  const adjustForOpticalCentering = useCallback((
    element: HTMLElement,
    type: 'icon' | 'button' | 'text' | 'image' = 'icon'
  ) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    let adjustX = 0;
    let adjustY = 0;
    let reason = '';

    // Icon-specific adjustments
    if (type === 'icon') {
      const iconType = element.getAttribute('data-icon-type') || 'unknown';

      switch (iconType) {
        case 'play':
        case 'triangle':
          // Play buttons appear centered but visually lean left
          adjustX = 2;
          reason = 'Play icon visual weight adjustment';
          break;
        case 'pause':
          // Pause icons can appear too far right
          adjustX = -1;
          reason = 'Pause icon balance';
          break;
        case 'arrow':
          const direction = element.getAttribute('data-direction');
          if (direction === 'right') {
            adjustX = 1;
            reason = 'Right arrow optical adjustment';
          } else if (direction === 'left') {
            adjustX = -1;
            reason = 'Left arrow optical adjustment';
          }
          break;
        case 'chevron':
          adjustY = -0.5;
          reason = 'Chevron vertical alignment';
          break;
      }
    }

    // Button content alignment
    if (type === 'button') {
      const hasIcon = element.querySelector('[data-icon-type]');
      const hasText = element.textContent?.trim();

      if (hasIcon && hasText) {
        // Icon + text combinations need micro-adjustments
        adjustX = 0.5;
        reason = 'Icon-text button alignment';
      }
    }

    // Text baseline adjustments
    if (type === 'text') {
      const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
      const fontFamily = window.getComputedStyle(element).fontFamily;

      // Different fonts have different optical centers
      if (fontFamily.includes('Inter')) {
        adjustY = fontSize * 0.02; // Inter needs slight downward adjustment
        reason = 'Inter font optical baseline';
      } else if (fontFamily.includes('system-ui')) {
        adjustY = fontSize * 0.01;
        reason = 'System font optical baseline';
      }
    }

    // Apply adjustments
    if (adjustX !== 0 || adjustY !== 0) {
      element.style.transform = `translate(${adjustX}px, ${adjustY}px)`;
      element.style.willChange = 'transform';

      setAlignments(prev => new Map(prev.set(element.id || Date.now().toString(), {
        element,
        adjustments: { x: adjustX, y: adjustY, reason }
      })));
    }
  }, []);

  const scanAndAdjustOpticalCentering = useCallback(() => {
    // Auto-detect and adjust common elements
    const playIcons = document.querySelectorAll('[data-icon-type="play"]');
    const buttons = document.querySelectorAll('button');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    playIcons.forEach(icon => adjustForOpticalCentering(icon as HTMLElement, 'icon'));
    buttons.forEach(button => adjustForOpticalCentering(button as HTMLElement, 'button'));
    headings.forEach(heading => adjustForOpticalCentering(heading as HTMLElement, 'text'));
  }, [adjustForOpticalCentering]);

  return {
    adjustForOpticalCentering,
    scanAndAdjustOpticalCentering,
    alignments: Array.from(alignments.values()),
  };
}

// Spacing Consistency System
const DESIGN_TOKENS = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    'lg': '48px',
    'lg': '64px',
    '4xl': '96px',
  },
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    'lg': '24px',
    full: '9999px',
  },
} as const;

export function useSpacingConsistency() {
  const [violations, setViolations] = useState<Array<{
    element: HTMLElement;
    property: string;
    currentValue: string;
    suggestedValue: string;
  }>>([]);

  const validateSpacing = useCallback(() => {
    const foundViolations: typeof violations = [];
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
      const computed = window.getComputedStyle(element);
      const spacingProps = [
        'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'gap', 'borderRadius'
      ];

      spacingProps.forEach(prop => {
        const value = computed.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (value && value !== '0px' && !value.includes('auto')) {
          const numValue = parseFloat(value);

          // Check if value is not in our design token system
          const validValues = Object.values(DESIGN_TOKENS.spacing).map(v => parseFloat(v));
          const validRadii = Object.values(DESIGN_TOKENS.borderRadius).map(v =>
            v === '9999px' ? 9999 : parseFloat(v)
          );

          const allValidValues = prop.includes('radius') ? validRadii : validValues;

          if (!allValidValues.includes(numValue) && numValue > 0) {
            // Find closest valid value
            const closest = allValidValues.reduce((prev, curr) =>
              Math.abs(curr - numValue) < Math.abs(prev - numValue) ? curr : prev
            );

            foundViolations.push({
              element: element as HTMLElement,
              property: prop,
              currentValue: value,
              suggestedValue: `${closest}px`,
            });
          }
        }
      });
    });

    setViolations(foundViolations);
    return foundViolations;
  }, []);

  const fixSpacingViolation = useCallback((violation: typeof violations[0]) => {
    const { element, property, suggestedValue } = violation;
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    element.style.setProperty(cssProperty, suggestedValue);
  }, []);

  const autoFixSpacing = useCallback(() => {
    violations.forEach(fixSpacingViolation);
    setViolations([]);
  }, [violations, fixSpacingViolation]);

  return {
    violations,
    validateSpacing,
    fixSpacingViolation,
    autoFixSpacing,
    designTokens: DESIGN_TOKENS,
  };
}

// Border Consistency System
export function useBorderConsistency() {
  const [borderIssues, setBorderIssues] = useState<Array<{
    element: HTMLElement;
    issue: string;
    fix: string;
  }>>([]);

  const validateBorders = useCallback(() => {
    const issues: typeof borderIssues = [];
    const allElements = document.querySelectorAll('*');

    allElements.forEach(element => {
      const computed = window.getComputedStyle(element);
      const borderWidth = computed.borderWidth;
      const borderStyle = computed.borderStyle;
      const borderColor = computed.borderColor;
      const outline = computed.outline;

      // Check for inconsistent border widths
      if (borderWidth && borderWidth !== '0px' && borderStyle !== 'none') {
        const width = parseFloat(borderWidth);
        if (width !== 1 && width !== 2 && width !== 4) {
          issues.push({
            element: element as HTMLElement,
            issue: `Non-standard border width: ${borderWidth}`,
            fix: 'Use 1px, 2px, or 4px border widths',
          });
        }
      }

      // Check for outline that might interfere with focus
      if (outline && outline !== 'none' && !element.matches(':focus')) {
        issues.push({
          element: element as HTMLElement,
          issue: 'Outline without focus state',
          fix: 'Remove outline or apply only on :focus',
        });
      }

      // Check for missing focus indicators on interactive elements
      if (element.matches('button, input, select, textarea, a[href]')) {
        const focusStyles = window.getComputedStyle(element, ':focus');
        const hasOutline = focusStyles.outline !== 'none';
        const hasBoxShadow = focusStyles.boxShadow !== 'none';
        const hasBorderChange = focusStyles.borderColor !== computed.borderColor;

        if (!hasOutline && !hasBoxShadow && !hasBorderChange) {
          issues.push({
            element: element as HTMLElement,
            issue: 'Missing focus indicator',
            fix: 'Add outline, box-shadow, or border change on focus',
          });
        }
      }
    });

    setBorderIssues(issues);
    return issues;
  }, []);

  const fixBorderIssue = useCallback((issue: typeof borderIssues[0]) => {
    const { element } = issue;

    if (issue.issue.includes('border width')) {
      element.style.borderWidth = '1px';
    } else if (issue.issue.includes('outline without focus')) {
      element.style.outline = 'none';
    } else if (issue.issue.includes('Missing focus indicator')) {
      // Add a subtle focus indicator
      element.style.setProperty('--focus-ring', '0 0 0 2px rgba(59, 130, 246, 0.5)');
      const focusStyle = document.createElement('style');
      focusStyle.textContent = `
        ${element.tagName.toLowerCase()}:focus {
          outline: none;
          box-shadow: var(--focus-ring);
        }
      `;
      document.head.appendChild(focusStyle);
    }
  }, []);

  return {
    borderIssues,
    validateBorders,
    fixBorderIssue,
  };
}

// Animation Continuity System
export function useAnimationContinuity() {
  const activeAnimations = useRef<Map<string, Animation>>(new Map());
  const [animationStates, setAnimationStates] = useState<Map<string, {
    state: 'idle' | 'running' | 'paused' | 'finished';
    progress: number;
  }>>(new Map());

  const ensureAnimationContinuity = useCallback((
    element: HTMLElement,
    animationName: string,
    fromProgress: number = 0
  ) => {
    const existingAnimation = activeAnimations.current.get(animationName);

    if (existingAnimation) {
      // Continue from current progress instead of restarting
      existingAnimation.currentTime = (existingAnimation.effect?.getTiming().duration as number) * fromProgress;
    }
  }, []);

  const registerAnimation = useCallback((
    element: HTMLElement,
    animation: Animation,
    name: string
  ) => {
    activeAnimations.current.set(name, animation);

    animation.addEventListener('finish', () => {
      activeAnimations.current.delete(name);
      setAnimationStates(prev => new Map(prev.set(name, {
        state: 'finished',
        progress: 1,
      })));
    });

    // Track progress
    const updateProgress = () => {
      if (animation.effect && animation.currentTime !== null) {
        const duration = animation.effect.getTiming().duration as number;
        const progress = Math.min((animation.currentTime as number) / duration, 1);

        setAnimationStates(prev => new Map(prev.set(name, {
          state: animation.playState as any,
          progress,
        })));
      }

      if (animation.playState === 'running') {
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
  }, []);

  const pauseAllAnimations = useCallback(() => {
    activeAnimations.current.forEach(animation => {
      animation.pause();
    });
  }, []);

  const resumeAllAnimations = useCallback(() => {
    activeAnimations.current.forEach(animation => {
      animation.play();
    });
  }, []);

  return {
    ensureAnimationContinuity,
    registerAnimation,
    pauseAllAnimations,
    resumeAllAnimations,
    animationStates: Array.from(animationStates.entries()),
  };
}

// Master Premium Polish Hook
export function usePremiumPolish(options: {
  enableOpticalCentering?: boolean;
  enableSpacingValidation?: boolean;
  enableBorderConsistency?: boolean;
  enableAnimationContinuity?: boolean;
  autoFix?: boolean;
} = {}) {
  const opts = {
    enableOpticalCentering: true,
    enableSpacingValidation: true,
    enableBorderConsistency: true,
    enableAnimationContinuity: true,
    autoFix: false,
    ...options,
  };

  const optical = useOpticalCentering();
  const spacing = useSpacingConsistency();
  const borders = useBorderConsistency();
  const animations = useAnimationContinuity();

  const [polishReport, setPolishReport] = useState<{
    score: number;
    issues: number;
    recommendations: string[];
  }>({
    score: 100,
    issues: 0,
    recommendations: [],
  });

  const runFullPolishAudit = useCallback(() => {
    let totalIssues = 0;
    const recommendations: string[] = [];

    if (opts.enableOpticalCentering) {
      optical.scanAndAdjustOpticalCentering();
    }

    if (opts.enableSpacingValidation) {
      const spacingViolations = spacing.validateSpacing();
      totalIssues += spacingViolations.length;
      if (spacingViolations.length > 0) {
        recommendations.push(`Fix ${spacingViolations.length} spacing inconsistencies`);
      }
    }

    if (opts.enableBorderConsistency) {
      const borderIssues = borders.validateBorders();
      totalIssues += borderIssues.length;
      if (borderIssues.length > 0) {
        recommendations.push(`Address ${borderIssues.length} border inconsistencies`);
      }
    }

    const score = Math.max(0, 100 - (totalIssues * 5));

    setPolishReport({
      score,
      issues: totalIssues,
      recommendations,
    });

    // Auto-fix if enabled
    if (opts.autoFix) {
      if (opts.enableSpacingValidation) {
        spacing.autoFixSpacing();
      }
    }

    return {
      score,
      issues: totalIssues,
      recommendations,
    };
  }, [opts, optical, spacing, borders]);

  // Run audit on mount and when DOM changes
  useEffect(() => {
    runFullPolishAudit();

    const observer = new MutationObserver(() => {
      runFullPolishAudit();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    return () => observer.disconnect();
  }, [runFullPolishAudit]);

  return {
    optical,
    spacing,
    borders,
    animations,
    polishReport,
    runFullPolishAudit,
  };
}
