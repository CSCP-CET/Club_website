import { LuFlag, LuTrophy, LuBookOpen, LuCalendar } from 'react-icons/lu';
import type { ClubEvent } from '../../types/event';
import '../../pages/Events.css'; // Global scope CSS instead of module

type Props = {
  event: ClubEvent;
};

export default function EventCard({ event }: Props) {
  const date = new Date(event.dateISO);
  const formatted = Number.isNaN(date.getTime())
    ? event.dateISO
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  // Fallback heuristic for live vs upcoming vs past in case `event.kind` doesn't fully capture "live"
  let statusText = 'Ended';

  if (event.kind === 'upcoming') {
    statusText = 'Upcoming';
    
    // Simplistic check for "live" today
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      statusText = 'Live';
    }
  }

  // Determine Icon and Tag based on keywords in title/description
  let Icon = LuCalendar;
  let tag = 'Meetup';

  const t = event.title.toLowerCase();
  if (t.includes('ctf') || t.includes('capture')) {
    Icon = LuFlag;
    tag = 'Security';
  } else if (t.includes('contest') || t.includes('compete') || t.includes('code')) {
    Icon = LuTrophy;
    tag = 'Competitive';
  } else if (t.includes('workshop') || t.includes('learn') || t.includes('talk')) {
    Icon = LuBookOpen;
    tag = 'Learning';
  }

  return (
    <div className="glow-card group">
      <div className="glow-card-icon-container">
        <Icon className="glow-card-icon" />
      </div>
      <div className="glow-card-content">
        <div className="glow-card-header">
          <h3 className="glow-card-title">
            {event.title}
          </h3>
          <span className="glow-card-badge">
            {statusText}
          </span>
        </div>
        <div style={{ fontFamily: '"Orbitron", sans-serif', fontSize: '0.75rem', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          {tag} // {formatted}
        </div>
        <p className="glow-card-description">
          {event.description}
        </p>
        
        {event.links && event.links.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {event.links.map((l) => (
              <a 
                key={l.url} 
                href={l.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--accent-2)',
                  color: 'var(--accent-2)',
                  fontSize: '0.75rem',
                  fontFamily: '"Orbitron", sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
