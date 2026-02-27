import { useEffect, useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import EventCard from '../components/EventCard/EventCard';
import Timeline from '../components/Timeline/Timeline';
import type { ClubEvent } from '../types/event';
import type { TimelineItem } from '../types/timeline';
import { fetchJson } from '../utils/api';
import './Events.css';

type DataState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; events: ClubEvent[]; timeline: TimelineItem[] }
  | { status: 'error'; message: string };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function Events() {
  const [state, setState] = useState<DataState>({ status: 'idle' });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' });

    Promise.all([
      fetchJson<ClubEvent[]>('/api/events', { signal: ac.signal }),
      fetchJson<TimelineItem[]>('/api/timeline', { signal: ac.signal }),
    ])
      .then(([events, timeline]) => setState({ status: 'loaded', events, timeline }))
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load events';
        setState({ status: 'error', message: msg });
      });

    return () => ac.abort();
  }, []);

  const derived = useMemo(() => {
    if (state.status !== 'loaded') return null;
    const upcoming = state.events.filter((e) => e.kind === 'upcoming');
    const past = state.events.filter((e) => e.kind === 'past');
    return { upcoming, past, timeline: state.timeline };
  }, [state]);

  return (
    <section className="events-section">
      <div className="events-accent-bg" aria-hidden="true" />
      
      <div className="events-container">
        
        {/* Events Header section equivalent to 'What we run' */}
        <div className={`events-header ${loaded ? 'visible' : ''}`}>
          <div className="events-badge">
            <span className="events-badge-dot" />
            upcoming_events
          </div>
          <h2 className="events-title">
            What we <span className="highlight">run</span>
          </h2>
          <p className="events-subtitle">
            From weekly problem-solving to monthly CTF competitions, there is always something happening at CSCP.
          </p>
        </div>

        {(() => {
          switch (state.status) {
            case 'idle':
            case 'loading':
              return <div className="muted" style={{ textAlign: 'center', marginTop: 20 }}>Loading…</div>;
            case 'error':
              return <div className="muted" style={{ textAlign: 'center', marginTop: 20 }}>{state.message}</div>;
            case 'loaded': {
              const upcoming = derived?.upcoming ?? [];
              const past = derived?.past ?? [];
              const timeline = derived?.timeline ?? [];

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* UPCOMING EVENTS GRID */}
                  <div>
                    <h3 style={{ fontFamily: '"Russo One", sans-serif', fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text)' }}>Upcoming Events</h3>
                    {upcoming.length ? (
                      <motion.div 
                        className="events-grid"
                        style={{ opacity: 1, transform: 'none' }} // Override CSS transition using Framer Motion
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                      >
                        {upcoming.map((e) => (
                          <motion.div key={e.id} variants={itemVariants}>
                            <EventCard event={e} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="muted">No upcoming events right now.</div>
                    )}
                  </div>

                  {/* PAST EVENTS GRID */}
                  <div>
                    <h3 style={{ fontFamily: '"Russo One", sans-serif', fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text)' }}>Past Events</h3>
                    {past.length ? (
                      <motion.div 
                        className="events-grid"
                        style={{ opacity: 1, transform: 'none' }} 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                      >
                        {past.map((e) => (
                          <motion.div key={e.id} variants={itemVariants}>
                            <EventCard event={e} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="muted">No past events.</div>
                    )}
                  </div>

                  {/* TIMELINE SECTION */}
                  {timeline.length > 0 && (
                    <div>
                      <h3 style={{ fontFamily: '"Russo One", sans-serif', fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text)' }}>Timeline</h3>
                      <div className="card" style={{ padding: '24px' }}>
                        <Timeline items={timeline} />
                      </div>
                    </div>
                  )}

                </div>
              );
            }
            default: {
              const _exhaustive: never = state;
              return _exhaustive;
            }
          }
        })()}
      </div>
    </section>
  );
}
