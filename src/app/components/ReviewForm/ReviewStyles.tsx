"use client";

// Mobile-first CSS with proper typography scale and safe areas
const styles = `
  .text-body { font-size: 1rem; line-height: 1.5; }
  .text-body-lg { font-size: 1.125rem; line-height: 1.5; }
  .text-heading-sm { font-size: 1.25rem; line-height: 1.4; }
  .text-heading-md { font-size: 1.5rem; line-height: 1.3; }
  .text-heading-lg { font-size: 1.875rem; line-height: 1.2; }

  .btn-press:active { transform: scale(0.98); transition: transform 0.1s ease; }
  .btn-target { min-height: 44px; min-width: 44px; touch-action: manipulation; }
  .input-mobile { font-size: 1rem !important; min-height: 48px; touch-action: manipulation; }

  .card-mobile { border: 1px solid rgba(0, 0, 0, 0.08); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
  @media (min-width: 768px) {
    .card-mobile { border: 1px solid rgba(116, 145, 118, 0.1); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); }
  }
`;

export default function ReviewStyles() {
  return <style dangerouslySetInnerHTML={{ __html: styles }} />;
}
