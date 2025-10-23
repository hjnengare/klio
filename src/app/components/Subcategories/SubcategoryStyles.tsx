"use client";

const entranceStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .enter-fade {
    opacity: 0;
    animation: fadeSlideIn 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  }
  .enter-stagger {
    opacity: 0;
    animation: fadeSlideIn 0.6s ease-out forwards;
  }
  @keyframes microBounce {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.05); }
  }
  .animate-micro-bounce { animation: microBounce 0.28s ease-out; }

  .pills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .pills-container > button {
    flex: 0 0 auto;
    width: auto;
    min-width: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    * { animation: none !important; transition: none !important; }
  }
`;

export default function SubcategoryStyles() {
  return <style dangerouslySetInnerHTML={{ __html: entranceStyles }} />;
}
