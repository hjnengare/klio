interface EventBadgeProps {
  startDate: string;
  endDate?: string;
}

export default function EventBadge({ startDate, endDate }: EventBadgeProps) {
  return (
    <div className="absolute left-0 top-0 z-20 overflow-hidden" style={{ width: '120px', height: '120px' }}>
      <div 
        className="absolute bg-coral text-white px-3 py-1.5 shadow-lg"
        style={{
          transform: 'rotate(-45deg)',
          transformOrigin: 'center',
          left: '-30px',
          top: '20px',
          width: '180px',
          textAlign: 'center',
          fontFamily: "'Urbanist', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.025em',
        }}
      >
        {endDate ? `${startDate} - ${endDate}` : startDate}
      </div>
    </div>
  );
}
