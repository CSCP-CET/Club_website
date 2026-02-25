export default function Contact() {
  return (
    <div className="container">
      <h1 className="sectionTitle">Contact Us</h1>
      <div className="card" style={{ padding: 18 }}>
        <p style={{ marginTop: 0 }}>
          For collaborations, workshops, and community activities, reach out via our official channels.
        </p>
        <div className="muted" style={{ lineHeight: 1.6 }}>
          <a href="https://www.instagram.com/__cscp__/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            Instagram: @__cscp__
          </a>
          <br />
          <a href="https://github.com/CSCP-CET" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            GitHub: CSCP-CET
          </a>
          <br />
          <a href="https://chat.whatsapp.com/GIm1WLGvHzd558c521ylUg?mode=gi_t" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            WhatsApp: CSCP'25
          </a>
          <br />
          Location: CET Campus
        </div>
      </div>
    </div>
  );
}
