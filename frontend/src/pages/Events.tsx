import { useEffect, useMemo, useState } from 'react';
import EventCard from '../components/EventCard/EventCard';
import Timeline from '../components/Timeline/Timeline';
import type { ClubEvent } from '../types/event';
import type { TimelineItem } from '../types/timeline';
import { fetchJson } from '../utils/api';

type DataState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; events: ClubEvent[]; timeline: TimelineItem[] }
  | { status: 'error'; message: string };

export default function Events() {
  const [state, setState] = useState<DataState>({ status: 'idle' });

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
    <div className="container">
      <h1 className="sectionTitle">Events</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Workshops, contests, CTFs, and club meetups.
      </p>

      <div className="card" style={{ padding: 18 }}>
        {(() => {
          switch (state.status) {
            case 'idle':
            case 'loading':
              return <div className="muted">Loading…</div>;
            case 'error':
              return <div className="muted">{state.message}</div>;
            case 'loaded': {
              const upcoming = derived?.upcoming ?? [];
              const past = derived?.past ?? [];
              const timeline = derived?.timeline ?? [];

              return (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Upcoming Events</div>
                  {upcoming.length ? (
                    <div className="gridEvents">
                      {upcoming.map((e) => (
                        <EventCard key={e.id} event={e} />
                      ))}
                    </div>
                  ) : (
                    <div className="muted">No upcoming events.</div>
                  )}

                  <div style={{ height: 18 }} />

                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Past Events</div>
                  {past.length ? (
                    <div className="gridEvents">
                      {past.map((e) => (
                        <EventCard key={e.id} event={e} />
                      ))}
                    </div>
                  ) : (
                    <div className="muted">No past events.</div>
                  )}

                  <div style={{ height: 18 }} />

                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Timeline</div>
                  {timeline.length ? (
                    <Timeline items={timeline} />
                  ) : (
                    <div className="muted">No timeline entries.</div>
                  )}
                </>
              );
            }
            default: {
              const _exhaustive: never = state;
              return _exhaustive;
            }
          }
        })()}
      </div>
    </div>
  );
}
