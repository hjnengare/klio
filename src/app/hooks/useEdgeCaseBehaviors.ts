"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface TabSyncOptions {
  enableTabSync?: boolean;
  syncPrefix?: string;
  syncEvents?: string[];
  maxTabs?: number;
}

interface SecurityOptions {
  enableDevToolsDetection?: boolean;
  enableCopyProtection?: boolean;
  enableScreenshotPrevention?: boolean;
  enableClientSideValidation?: boolean;
  maxSessionTime?: number;
}

interface PerformanceOptions {
  enableResourceMonitoring?: boolean;
  enableTabLimitWarning?: boolean;
  enableMemoryLeakDetection?: boolean;
  maxMemoryUsage?: number;
}

const defaultTabSyncOptions: TabSyncOptions = {
  enableTabSync: true,
  syncPrefix: 'app-sync',
  syncEvents: ['auth', 'settings', 'notifications'],
  maxTabs: 10,
};

const defaultSecurityOptions: SecurityOptions = {
  enableDevToolsDetection: true,
  enableCopyProtection: false,
  enableScreenshotPrevention: false,
  enableClientSideValidation: true,
  maxSessionTime: 24 * 60 * 60 * 1000, // 24 hours
};

const defaultPerformanceOptions: PerformanceOptions = {
  enableResourceMonitoring: true,
  enableTabLimitWarning: true,
  enableMemoryLeakDetection: true,
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
};

// Tab Synchronization Hook
export function useTabSync(options: TabSyncOptions = {}) {
  const opts = { ...defaultTabSyncOptions, ...options };
  const [tabId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [isMainTab, setIsMainTab] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const heartbeatInterval = useRef<NodeJS.Timeout>();

  const broadcastToTabs = useCallback((event: string, data: any) => {
    if (!opts.enableTabSync) return;

    localStorage.setItem(`${opts.syncPrefix}-broadcast`, JSON.stringify({
      event,
      data,
      timestamp: Date.now(),
      sender: tabId,
    }));

    // Clean up immediately to avoid storage bloat
    setTimeout(() => {
      localStorage.removeItem(`${opts.syncPrefix}-broadcast`);
    }, 100);
  }, [opts.enableTabSync, opts.syncPrefix, tabId]);

  const syncDataBetweenTabs = useCallback((key: string, data: any) => {
    if (!opts.enableTabSync) return;

    localStorage.setItem(`${opts.syncPrefix}-${key}`, JSON.stringify(data));
    broadcastToTabs('data-sync', { key, data });
  }, [opts.enableTabSync, opts.syncPrefix, broadcastToTabs]);

  const handleTabClose = useCallback(() => {
    const tabs = JSON.parse(localStorage.getItem(`${opts.syncPrefix}-tabs`) || '[]');
    const updatedTabs = tabs.filter((id: string) => id !== tabId);
    localStorage.setItem(`${opts.syncPrefix}-tabs`, JSON.stringify(updatedTabs));

    // If this was the main tab, elect a new one
    if (isMainTab && updatedTabs.length > 0) {
      localStorage.setItem(`${opts.syncPrefix}-main-tab`, updatedTabs[0]);
    }
  }, [opts.syncPrefix, tabId, isMainTab]);

  useEffect(() => {
    if (!opts.enableTabSync) return;

    // Register this tab
    const existingTabs = JSON.parse(localStorage.getItem(`${opts.syncPrefix}-tabs`) || '[]');
    const updatedTabs = [...existingTabs, tabId];

    // Check tab limit
    if (updatedTabs.length > opts.maxTabs!) {
      console.warn(`Maximum number of tabs (${opts.maxTabs}) exceeded`);
      window.dispatchEvent(new CustomEvent('tabLimitExceeded', { detail: { limit: opts.maxTabs } }));
    }

    localStorage.setItem(`${opts.syncPrefix}-tabs`, JSON.stringify(updatedTabs));
    setOpenTabs(updatedTabs);

    // Determine main tab
    const mainTab = localStorage.getItem(`${opts.syncPrefix}-main-tab`);
    if (!mainTab || !existingTabs.includes(mainTab)) {
      localStorage.setItem(`${opts.syncPrefix}-main-tab`, tabId);
      setIsMainTab(true);
    } else {
      setIsMainTab(mainTab === tabId);
    }

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${opts.syncPrefix}-broadcast`) {
        try {
          const broadcast = JSON.parse(e.newValue || '{}');
          if (broadcast.sender !== tabId) {
            window.dispatchEvent(new CustomEvent('tabSync', {
              detail: broadcast
            }));
          }
        } catch (error) {
          console.warn('Failed to parse tab sync broadcast:', error);
        }
      }

      if (e.key === `${opts.syncPrefix}-tabs`) {
        const tabs = JSON.parse(e.newValue || '[]');
        setOpenTabs(tabs);
      }

      if (e.key === `${opts.syncPrefix}-main-tab`) {
        setIsMainTab(e.newValue === tabId);
      }
    };

    // Heartbeat to detect dead tabs
    heartbeatInterval.current = setInterval(() => {
      localStorage.setItem(`${opts.syncPrefix}-heartbeat-${tabId}`, Date.now().toString());
    }, 5000);

    // Clean up dead tabs
    const cleanupInterval = setInterval(() => {
      const tabs = JSON.parse(localStorage.getItem(`${opts.syncPrefix}-tabs`) || '[]');
      const aliveTabs = tabs.filter((id: string) => {
        const heartbeat = localStorage.getItem(`${opts.syncPrefix}-heartbeat-${id}`);
        return heartbeat && Date.now() - parseInt(heartbeat) < 10000; // 10 second timeout
      });

      if (aliveTabs.length !== tabs.length) {
        localStorage.setItem(`${opts.syncPrefix}-tabs`, JSON.stringify(aliveTabs));
        setOpenTabs(aliveTabs);

        // Clean up heartbeats for dead tabs
        tabs.forEach((id: string) => {
          if (!aliveTabs.includes(id)) {
            localStorage.removeItem(`${opts.syncPrefix}-heartbeat-${id}`);
          }
        });
      }
    }, 15000);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('beforeunload', handleTabClose);

      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
      clearInterval(cleanupInterval);

      handleTabClose();
    };
  }, [opts.enableTabSync, opts.syncPrefix, opts.maxTabs, tabId, isMainTab, handleTabClose]);

  return {
    tabId,
    isMainTab,
    openTabs,
    broadcastToTabs,
    syncDataBetweenTabs,
    tabCount: openTabs.length,
  };
}

// Security and Dev Tools Detection
export function useSecurityMonitoring(options: SecurityOptions = {}) {
  const opts = { ...defaultSecurityOptions, ...options };
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [securityViolations, setSecurityViolations] = useState<string[]>([]);
  const sessionStartTime = useRef(Date.now());

  const detectDevTools = useCallback(() => {
    if (!opts.enableDevToolsDetection) return;

    const startTime = performance.now();

    // Method 1: Console detection
    const devtools = {
      open: false,
      orientation: null as string | null
    };

    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        devtools.open = true;
        devtools.orientation = window.outerHeight - window.innerHeight > threshold ? 'vertical' : 'horizontal';
      } else {
        devtools.open = false;
        devtools.orientation = null;
      }

      if (devtools.open !== devToolsOpen) {
        setDevToolsOpen(devtools.open);
        if (devtools.open) {
          setSecurityViolations(prev => [...prev, 'Developer tools detected']);
          window.dispatchEvent(new CustomEvent('securityViolation', {
            detail: { type: 'devtools', detected: true }
          }));
        }
      }
    }, 1000);

    // Method 2: Performance-based detection
    const img = new Image();
    Object.defineProperty(img, 'id', {
      get: function() {
        setDevToolsOpen(true);
        setSecurityViolations(prev => [...prev, 'Console access detected']);
      }
    });

    console.log(img);
  }, [opts.enableDevToolsDetection, devToolsOpen]);

  const preventCopyPaste = useCallback(() => {
    if (!opts.enableCopyProtection) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setSecurityViolations(prev => [...prev, 'Copy attempt blocked']);
      window.dispatchEvent(new CustomEvent('securityViolation', {
        detail: { type: 'copy', blocked: true }
      }));
    };

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;

      // Allow paste in specific elements
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      e.preventDefault();
      setSecurityViolations(prev => [...prev, 'Paste attempt blocked']);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common shortcuts
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 's', 'a', 'p'].includes(e.key.toLowerCase())) {
        const target = e.target as HTMLElement;

        // Allow in form fields
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }

        e.preventDefault();
        setSecurityViolations(prev => [...prev, `Keyboard shortcut blocked: Ctrl+${e.key.toUpperCase()}`]);
      }

      // Block F12, Ctrl+Shift+I, etc.
      if (e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        setSecurityViolations(prev => [...prev, 'Developer tools shortcut blocked']);
      }
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [opts.enableCopyProtection]);

  const preventScreenshots = useCallback(() => {
    if (!opts.enableScreenshotPrevention) return;

    // Add CSS to hide content during screenshots
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        * {
          visibility: hidden !important;
        }

        .no-print::before {
          content: "Screenshot/Print not allowed";
          visibility: visible !important;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 24px;
          color: red;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.classList.add('no-print');

    // Detect print events
    window.addEventListener('beforeprint', () => {
      setSecurityViolations(prev => [...prev, 'Print attempt detected']);
    });

    return () => {
      document.head.removeChild(style);
      document.body.classList.remove('no-print');
    };
  }, [opts.enableScreenshotPrevention]);

  const validateSession = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTime.current;

    if (sessionDuration > opts.maxSessionTime!) {
      setSecurityViolations(prev => [...prev, 'Session timeout exceeded']);
      window.dispatchEvent(new CustomEvent('sessionExpired', {
        detail: { duration: sessionDuration }
      }));
      return false;
    }

    return true;
  }, [opts.maxSessionTime]);

  useEffect(() => {
    detectDevTools();
    const cleanupCopy = preventCopyPaste();
    const cleanupScreenshot = preventScreenshots();

    // Session validation interval
    const sessionInterval = setInterval(validateSession, 60000); // Check every minute

    return () => {
      cleanupCopy?.();
      cleanupScreenshot?.();
      clearInterval(sessionInterval);
    };
  }, [detectDevTools, preventCopyPaste, preventScreenshots, validateSession]);

  return {
    devToolsOpen,
    securityViolations,
    validateSession,
    isSessionValid: validateSession(),
  };
}

// Performance and Resource Monitoring
export function usePerformanceMonitoring(options: PerformanceOptions = {}) {
  const opts = { ...defaultPerformanceOptions, ...options };
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [resourceCount, setResourceCount] = useState(0);
  const [performanceIssues, setPerformanceIssues] = useState<string[]>([]);

  const monitorResources = useCallback(() => {
    if (!opts.enableResourceMonitoring) return;

    const resources = performance.getEntriesByType('resource');
    setResourceCount(resources.length);

    // Check for excessive resources
    if (resources.length > 200) {
      setPerformanceIssues(prev => [...prev, `High resource count: ${resources.length}`]);
    }

    // Check for large resources
    const largeResources = resources.filter((resource: any) => resource.transferSize > 1024 * 1024); // 1MB
    if (largeResources.length > 5) {
      setPerformanceIssues(prev => [...prev, `${largeResources.length} large resources detected`]);
    }

    // Check for slow resources
    const slowResources = resources.filter((resource: any) => resource.duration > 3000); // 3 seconds
    if (slowResources.length > 0) {
      setPerformanceIssues(prev => [...prev, `${slowResources.length} slow resources detected`]);
    }
  }, [opts.enableResourceMonitoring]);

  const monitorMemory = useCallback(() => {
    if (!opts.enableMemoryLeakDetection || !(performance as any).memory) return;

    const memory = (performance as any).memory;
    const currentUsage = memory.usedJSHeapSize;
    setMemoryUsage(currentUsage);

    if (currentUsage > opts.maxMemoryUsage!) {
      setPerformanceIssues(prev => [...prev, `High memory usage: ${Math.round(currentUsage / 1024 / 1024)}MB`]);

      // Trigger garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        try {
          (window as any).gc();
        } catch (e) {
          console.warn('Manual garbage collection failed:', e);
        }
      }
    }
  }, [opts.enableMemoryLeakDetection, opts.maxMemoryUsage]);

  const checkTabLimits = useCallback(() => {
    if (!opts.enableTabLimitWarning) return;

    // Check if too many tabs are open (browser-wide)
    if ('navigator' in window && 'hardwareConcurrency' in navigator) {
      const maxRecommendedTabs = Math.max(8, navigator.hardwareConcurrency * 2);

      // This is an approximation since we can't directly count browser tabs
      const performanceScore = performance.now();
      if (performanceScore > 5000) { // If page load took > 5 seconds
        setPerformanceIssues(prev => [...prev, 'Slow page load detected - consider closing other tabs']);
      }
    }
  }, [opts.enableTabLimitWarning]);

  useEffect(() => {
    monitorResources();
    monitorMemory();
    checkTabLimits();

    // Set up periodic monitoring
    const resourceInterval = setInterval(monitorResources, 30000); // Every 30 seconds
    const memoryInterval = setInterval(monitorMemory, 10000); // Every 10 seconds

    return () => {
      clearInterval(resourceInterval);
      clearInterval(memoryInterval);
    };
  }, [monitorResources, monitorMemory, checkTabLimits]);

  return {
    memoryUsage,
    resourceCount,
    performanceIssues,
    memoryUsageMB: Math.round(memoryUsage / 1024 / 1024),
    isPerformanceHealthy: performanceIssues.length === 0,
  };
}

// Multi-tab Communication
export function useMultiTabCommunication() {
  const broadcastChannel = useRef<BroadcastChannel | null>(null);
  const [connectedTabs, setConnectedTabs] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (broadcastChannel.current) {
      broadcastChannel.current.postMessage({ type, data, timestamp: Date.now() });
    }
  }, []);

  const closeOtherTabs = useCallback(() => {
    sendMessage('close-tabs', { sender: 'main' });
  }, [sendMessage]);

  useEffect(() => {
    if ('BroadcastChannel' in window) {
      broadcastChannel.current = new BroadcastChannel('app-communication');

      broadcastChannel.current.onmessage = (event) => {
        setMessages(prev => [...prev.slice(-9), event.data]); // Keep last 10 messages

        if (event.data.type === 'close-tabs') {
          window.close();
        }
      };

      // Announce this tab
      sendMessage('tab-opened', { id: Math.random().toString(36) });
    }

    return () => {
      if (broadcastChannel.current) {
        broadcastChannel.current.close();
      }
    };
  }, [sendMessage]);

  return {
    sendMessage,
    closeOtherTabs,
    messages,
    connectedTabs,
    isSupported: 'BroadcastChannel' in window,
  };
}