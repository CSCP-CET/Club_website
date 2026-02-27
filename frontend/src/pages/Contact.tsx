import SpotlightCard from '../components/SpotlightCard';
import { LuInstagram, LuGithub, LuMessageCircle, LuMapPin } from 'react-icons/lu';
import BlurText from '../components/BlurText';
import './Contact.css';

export default function Contact() {
  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <h1 className="sectionTitle">Contact Us</h1>
      <BlurText
        text="Connect with the CSCP-CET community."
        className="muted"
        delay={35}
        animateBy="words"
        direction="bottom"
      />

      <div className="contact-grid">
        <SpotlightCard className="card contact-info-card" spotlightColor="rgba(56, 189, 248, 0.15)">
          <div style={{ padding: '32px' }}>
            <h2 className="sectionSubtitle" style={{ marginTop: 0, marginBottom: '24px' }}>Get In Touch</h2>
            <p className="muted" style={{ lineHeight: 1.7, marginBottom: '32px' }}>
              For collaborations, workshops, and community activities, reach out via our official channels. We are always looking for new partnerships and passionate members.
            </p>

            <div className="contact-links">
              <a href="https://www.instagram.com/__cscp__/" target="_blank" rel="noopener noreferrer" className="contact-link">
                <div className="icon-wrapper"><LuInstagram size={20} /></div>
                <span>Instagram: @__cscp__</span>
              </a>
              <a href="https://github.com/CSCP-CET" target="_blank" rel="noopener noreferrer" className="contact-link">
                <div className="icon-wrapper"><LuGithub size={20} /></div>
                <span>GitHub: CSCP-CET</span>
              </a>
              <a href="https://chat.whatsapp.com/GIm1WLGvHzd558c521ylUg?mode=gi_t" target="_blank" rel="noopener noreferrer" className="contact-link">
                <div className="icon-wrapper"><LuMessageCircle size={20} /></div>
                <span>WhatsApp: CSCP'25</span>
              </a>
              <div className="contact-link static">
                <div className="icon-wrapper"><LuMapPin size={20} /></div>
                <span>Location: CET Campus</span>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
