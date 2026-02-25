import { useEffect, useMemo, useState } from 'react';
import BlurText from '../components/BlurText';
import MemberCard from '../components/MemberCard/MemberCard';
import SpotlightCard from '../components/SpotlightCard';
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

        const leadershipPriority: Array<{ match: RegExp; priority: number }> = [
          { match: /chairperson/i, priority: 1 },
          { match: /vice\s*chairperson/i, priority: 2 },
          { match: /^secretary$/i, priority: 3 },
          { match: /joint\s*secretary/i, priority: 4 },
        ];

        const getLeadershipRank = (role: string) => {
          const found = leadershipPriority.find((r) => r.match.test(role));
          return found ? found.priority : null;
        };

        const featured = members
          .map((m) => ({ m, rank: getLeadershipRank(m.role) }))
          .filter((x) => x.rank !== null)
          .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
          .map((x) => x.m);

        const featuredIds = new Set(featured.map((m) => m.id));
        const rest = members.filter((m) => !featuredIds.has(m.id));

        return (
          <div>
            {featured.length > 0 ? (
              <section style={{ marginBottom: 18 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Leadership
                </h2>
                <div className="gridMembers gridMembersFeatured">
                  {featured.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            ) : null}

            <section>
              <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                Team
              </h2>
              <div className="gridMembers">
                {rest.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </section>
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
      <BlurText
        text="Meet the executive committee behind CSCP-CET."
        className="muted"
        delay={35}
        animateBy="words"
        direction="bottom"
      />

      <SpotlightCard className="spotlightPanel" spotlightColor="rgba(56, 189, 248, 0.18)">
        {content}
      </SpotlightCard>
    </div>
  );
}
