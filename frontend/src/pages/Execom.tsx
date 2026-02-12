import { useEffect, useMemo, useState } from 'react';
import MemberCard from '../components/MemberCard/MemberCard';
import type { Member } from '../types/member';
import { fetchJson } from '../utils/api';

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; members: Member[] }
  | { status: 'error'; message: string };

export default function Execom() {
  const [state, setState] = useState<LoadState>({ status: 'idle' });

  useEffect(() => {
    const ac = new AbortController();
    setState({ status: 'loading' });

    fetchJson<Member[]>('/api/members', { signal: ac.signal })
      .then((members) => setState({ status: 'loaded', members }))
      .catch((err: unknown) => {
        if (ac.signal.aborted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load members';
        setState({ status: 'error', message: msg });
      });

    return () => ac.abort();
  }, []);

  const content = useMemo(() => {
    switch (state.status) {
      case 'idle':
      case 'loading':
        return <div className="muted">Loading members…</div>;
      case 'error':
        return <div className="muted">{state.message}</div>;
      case 'loaded': {
        const members = state.members;
        if (members.length === 0) {
          return <div className="muted">No members found.</div>;
        }

        return (
          <div className="gridMembers">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        );
      }
      default: {
        const _exhaustive: never = state;
        return _exhaustive;
      }
    }
  }, [state]);

  return (
    <div className="container">
      <h1 className="sectionTitle">Execom</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Meet the executive committee behind CSCP-CET.
      </p>

      <div className="card" style={{ padding: 18 }}>
        {content}
      </div>
    </div>
  );
}
