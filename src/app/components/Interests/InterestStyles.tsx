"use client";

const entranceStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .enter-fade {
    opacity: 0;
    animation: fadeSlideIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .enter-stagger { opacity: 0; animation: fadeSlideIn 0.25s ease-out forwards; }

  @keyframes bubbly {
    0% { transform: translateZ(0) scale(1); }
    40% { transform: translateZ(0) scale(1.05); }
    100% { transform: translateZ(0) scale(1); }
  }
  .animate-bubbly { animation: bubbly 0.35s ease-out; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(2px); }
  }
  .animate-shake { animation: shake 0.35s ease-in-out; }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

export default function InterestStyles() {
  return <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />;
}
