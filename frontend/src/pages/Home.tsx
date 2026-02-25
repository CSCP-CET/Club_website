export default function Home() {
  return (
    <div className="container">
      <section className="hero card" style={{ padding: 26 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div
            aria-label="Club logo placeholder"
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'rgba(2, 6, 23, 0.55)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            CS
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.1 }}>Cyber Security and Competitive Programming Club</h1>
            <p className="muted" style={{ margin: '8px 0 0', fontSize: 16 }}>
              Cybersecurity & Competitive Programming Club
            </p>
          </div>
        </div>

        <div style={{ marginTop: 18, maxWidth: 720 }}>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55 }}>
            Build securely. Think critically. Compete relentlessly.
          </p>
          <p className="muted" style={{ margin: '10px 0 0', lineHeight: 1.6 }}>
            We run workshops, CTFs, contests, and peer-learning sessions focused on practical security fundamentals and
            competitive programming.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="muted" style={{ fontSize: 13 }}>Focus</div>
          <div style={{ marginTop: 8, fontSize: 16 }}>Offensive & Defensive Security</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="muted" style={{ fontSize: 13 }}>Practice</div>
          <div style={{ marginTop: 8, fontSize: 16 }}>CP + DSA + Contest Readiness</div>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="muted" style={{ fontSize: 13 }}>Community</div>
          <div style={{ marginTop: 8, fontSize: 16 }}>Mentorship + Team Learning</div>
        </div>
      </section>
    </div>
  );
}
