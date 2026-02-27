import { useEffect, useMemo, useState } from 'react';
import BlurText from '../components/BlurText';
import MemberCard from '../components/MemberCard/MemberCard';
import type { Member } from '../types/member';
import { fetchJson } from '../utils/api';
import './Execom.css';

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
          <div className="team-content" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* Leadership Row */}
            <section>
              <h2 className="team-subheading" style={{ marginTop: 0 }}>
                Leadership
              </h2>
              <div className="team-grid">
                {sortedLeadership.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            </section>

            {/* Cybersecurity */}
            {cybersec.lead && (
              <section>
                <h2 className="team-subheading">
                  Cybersecurity
                </h2>
                <div className="team-grid">
                  <MemberCard member={cybersec.lead} />
                  {cybersec.subs.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* Competitive Programming */}
            {competitive.lead && (
              <section>
                <h2 className="team-subheading">
                  Competitive Programming
                </h2>
                <div className="team-grid">
                  <MemberCard member={competitive.lead} />
                  {competitive.subs.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* Web */}
            {webLeads.length > 0 && (
              <section>
                <h2 className="team-subheading">
                  Web
                </h2>
                <div className="team-grid">
                  {webLeads.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* WIT */}
            {witLead && (
              <section>
                <h2 className="team-subheading">
                  WIT
                </h2>
                <div className="team-grid">
                  <MemberCard member={witLead} />
                </div>
              </section>
            )}

            {/* Marketing & Media */}
            {(marketing || media) && (
              <section>
                <h2 className="team-subheading">
                  Marketing & Media
                </h2>
                <div className="team-grid">
                  {marketing && (
                    <MemberCard member={marketing} />
                  )}
                  {media && (
                    <MemberCard member={media} />
                  )}
                </div>
              </section>
            )}

            {/* Design */}
            {designLeads.length > 0 && (
              <section>
                <h2 className="team-subheading">
                  Design
                </h2>
                <div className="team-grid">
                  {designLeads.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* Content */}
            {contentLeads.length > 0 && (
              <section>
                <h2 className="team-subheading">
                  Content
                </h2>
                <div className="team-grid">
                  {contentLeads.map((m) => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                </div>
              </section>
            )}

            {/* Others */}
            {others.length > 0 && (
              <section>
                <h2 className="team-subheading">
                  Others
                </h2>
                <div className="team-grid">
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

      <div className="team-container">
        {content}
      </div>
    </div>
  );
}
