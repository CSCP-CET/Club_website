import { useState, useEffect } from 'react';

type LeaderboardEntry = {
  Rank: number;
  Name: string;
  Department: string;
  Points: number;
};

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: LeaderboardEntry[] }
  | { status: 'error'; message: string };

type Track = 'novice' | 'veteran';

const SHEET_URLS = {
  novice: import.meta.env.VITE_NOVICE_SHEET_URL,
  veteran: import.meta.env.VITE_VETERAN_SHEET_URL,
};

async function fetchSheet(url: string): Promise<LeaderboardEntry[]> {
  if (!url) throw new Error('Sheet URL not configured');
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch sheet: ${resp.statusText}`);
  const csv = await resp.text();
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const rows = lines.slice(1).map((line) => {
    const [Name, Department, Points] = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    return { Name, Department, Points: Number(Points) || 0 };
  });
  // Sort by Points descending and assign Rank
  rows.sort((a, b) => b.Points - a.Points);
  return rows.map((row, i) => ({ ...row, Rank: i + 1 }));
}

export default function Leaderboards() {
  const [track, setTrack] = useState<Track>('novice');
  const [state, setState] = useState<LoadState>({ status: 'idle' });

  useEffect(() => {
    const url = SHEET_URLS[track];
    if (!url) {
      setState({ status: 'error', message: `${track} sheet URL not configured` });
      return;
    }
    const ac = new AbortController();
    setState({ status: 'loading' });
    fetchSheet(url)
      .then((data) => setState({ status: 'loaded', data }))
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load leaderboard';
        setState({ status: 'error', message: msg });
      });
    return () => ac.abort();
  }, [track]);

  const handleTrackChange = (newTrack: Track) => {
    if (newTrack !== track) setTrack(newTrack);
  };

  return (
    <div className="container">
      <h1 className="sectionTitle">Leaderboards</h1>

      {/* Toggle Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', justifyContent: 'center' }}>
        <button
          className={`toggleBtn ${track === 'novice' ? 'active' : ''}`}
          onClick={() => handleTrackChange('novice')}
          disabled={track === 'novice'}
        >
          Novice
        </button>
        <button
          className={`toggleBtn ${track === 'veteran' ? 'active' : ''}`}
          onClick={() => handleTrackChange('veteran')}
          disabled={track === 'veteran'}
        >
          Veteran
        </button>
      </div>

      {/* Content */}
      {(() => {
        switch (state.status) {
          case 'idle':
          case 'loading':
            return (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div className="spinner" />
                <p className="muted" style={{ marginTop: '16px' }}>Loading leaderboard…</p>
              </div>
            );
          case 'error':
            return (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <p className="muted">{state.message}</p>
              </div>
            );
          case 'loaded': {
            if (state.data.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p className="muted">No entries found.</p>
                </div>
              );
            }
            return (
              <div className="tableWrapper">
                <table className="leaderboardTable">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.data.map((entry) => (
                      <tr key={`${entry.Rank}-${entry.Name}`}>
                        <td>{entry.Rank}</td>
                        <td>{entry.Name}</td>
                        <td>{entry.Department}</td>
                        <td>{entry.Points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          default:
            return null;
        }
      })()}
    </div>
  );
}
