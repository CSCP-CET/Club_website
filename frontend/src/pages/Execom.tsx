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

        // Leadership: Chair, VC, Sec, Joint Sec, Mentor
        const leadership = members.filter((m) =>
          /chairperson|vice\s*chairperson|secretary|joint\s*secretary|mentor/i.test(m.role)
        );

        const leadershipOrder = [
          'Chairperson',
          'Vice Chairperson',
          'Secretary',
          'Joint Secretary',
          'Mentor',
        ];

        const sortedLeadership = leadership.sort((a, b) => {
          const aIdx = leadershipOrder.findIndex((t) => a.role.toLowerCase().includes(t.toLowerCase()));
          const bIdx = leadershipOrder.findIndex((t) => b.role.toLowerCase().includes(t.toLowerCase()));
          return aIdx - bIdx;
        });

        // Group helpers
        const groupByLead = (leadRole: string, subRole: string) => {
          const lead = members.find((m) => m.role.toLowerCase() === leadRole.toLowerCase());
          const subs = members.filter((m) => m.role.toLowerCase().includes(subRole.toLowerCase()));
          return { lead, subs };
        };

        const cybersec = groupByLead('Cyber Security Lead', 'Cyber Security Sub Lead');
        const competitive = groupByLead('Competitive Programming Lead', 'Competitive Programming Sub Lead');
        const webLeads = members.filter((m) => m.role.toLowerCase().includes('web lead'));
        const witLead = members.find((m) => m.role.toLowerCase().includes('wit lead'));
        const marketing = members.find((m) => m.role.toLowerCase().includes('marketing'));
        const media = members.find((m) => m.role.toLowerCase().includes('media team'));
        const designLeads = members.filter((m) => m.role.toLowerCase().includes('design sub lead'));
        const contentLeads = members.filter((m) => m.role.toLowerCase().includes('content team lead'));

        const assignedIds = new Set([
          ...sortedLeadership.map((m) => m.id),
          cybersec.lead?.id,
          ...cybersec.subs.map((m) => m.id),
          competitive.lead?.id,
          ...competitive.subs.map((m) => m.id),
          ...webLeads.map((m) => m.id),
          witLead?.id,
          marketing?.id,
          media?.id,
          ...designLeads.map((m) => m.id),
          ...contentLeads.map((m) => m.id),
        ].filter(Boolean));

        const others = members.filter((m) => !assignedIds.has(m.id));

        return (
          <div>
            {/* Leadership Row */}
            <section style={{ marginBottom: 32 }}>
              <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                Leadership
              </h2>
              <div className="gridLeadership">
                {sortedLeadership.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </section>

            {/* Cybersecurity */}
            {cybersec.lead && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Cybersecurity
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    <MemberCard member={cybersec.lead} />
                  </div>
                  {cybersec.subs.length > 0 && (
                    <div className="treeSubs">
                      {cybersec.subs.map((m) => (
                        <MemberCard key={m.id} member={m} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Competitive Programming */}
            {competitive.lead && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Competitive Programming
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    <MemberCard member={competitive.lead} />
                  </div>
                  {competitive.subs.length > 0 && (
                    <div className="treeSubs">
                      {competitive.subs.map((m) => (
                        <MemberCard key={m.id} member={m} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Web */}
            {webLeads.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Web
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    {webLeads.map((m) => (
                      <MemberCard key={m.id} member={m} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* WIT */}
            {witLead && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  WIT
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    <MemberCard member={witLead} />
                  </div>
                </div>
              </section>
            )}

            {/* Marketing & Media */}
            {(marketing || media) && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Marketing & Media
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    {marketing && <MemberCard member={marketing} />}
                    {media && <MemberCard member={media} />}
                  </div>
                </div>
              </section>
            )}

            {/* Design */}
            {designLeads.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Design
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    {designLeads.map((m) => (
                      <MemberCard key={m.id} member={m} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Content */}
            {contentLeads.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Content
                </h2>
                <div className="gridTree">
                  <div className="treeSubs">
                    {contentLeads.map((m) => (
                      <MemberCard key={m.id} member={m} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Others */}
            {others.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <h2 className="sectionSubtitle" style={{ marginTop: 0 }}>
                  Others
                </h2>
                <div className="gridMembers">
                  {others.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}
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
