// Global type declarations

// Type definitions for ion-icon custom element
declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': {
      name?: string;
      style?: React.CSSProperties;
      className?: string;
      size?: string;
      color?: string;
      [key: string]: any;
    };
  }
}
