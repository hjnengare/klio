"use client";

// Very subtle background orbs for home page sections
const homeOrbsStyles = `
  @keyframes homeFloat1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(20px, -20px) scale(1.05); }
    66% { transform: translate(-15px, 15px) scale(0.95); }
  }

  @keyframes homeFloat2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-25px, 25px) scale(1.08); }
  }

  @keyframes homeFloat3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(30px, 30px) scale(0.92); }
  }

  .home-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.12;
  }

  .home-orb-1 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(157, 171, 155, 0.3) 0%, rgba(157, 171, 155, 0.1) 50%, transparent 100%);
    top: -10%;
    left: -5%;
    animation: homeFloat1 25s ease-in-out infinite;
  }

  .home-orb-2 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(125, 15, 42, 0.25) 0%, rgba(125, 15, 42, 0.08) 50%, transparent 100%);
    top: 50%;
    right: -8%;
    animation: homeFloat2 30s ease-in-out infinite;
  }

  .home-orb-3 {
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(157, 171, 155, 0.28) 0%, rgba(157, 171, 155, 0.1) 50%, transparent 100%);
    bottom: -15%;
    left: 10%;
    animation: homeFloat3 28s ease-in-out infinite;
  }

  @media (max-width: 768px) {
    .home-orb {
      filter: blur(60px);
      opacity: 0.08;
    }
    .home-orb-1 { width: 250px; height: 250px; }
    .home-orb-2 { width: 220px; height: 220px; }
    .home-orb-3 { width: 200px; height: 200px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-orb { animation: none !important; opacity: 0.05 !important; }
  }
`;

export default function HomeBackgroundOrbs() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: homeOrbsStyles }} />
      <div className="home-orb home-orb-1" aria-hidden="true" />
      <div className="home-orb home-orb-2" aria-hidden="true" />
      <div className="home-orb home-orb-3" aria-hidden="true" />
    </>
  );
}

