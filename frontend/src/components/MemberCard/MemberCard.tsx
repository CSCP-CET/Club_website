import type { ReactNode } from 'react';
import { Github, Instagram, Linkedin } from 'lucide-react';
import type { Member } from '../../types/member';
import styles from './MemberCard.module.css';

type Props = {
  member: Member;
};

function resolveMemberImageUrl(imageUrl: string) {
  if (imageUrl.startsWith('/assets/')) {
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';
    const url = new URL(imageUrl, base);
    return url.toString();
  }

  return imageUrl;
}

function ExternalIconLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      className={styles.iconLink}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function MemberCard({ member }: Props) {
  const imageSrc = resolveMemberImageUrl(member.imageUrl);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img className={styles.image} src={imageSrc} alt={member.name} loading="lazy" />
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.icons}>
          {member.socials?.instagram ? (
            <ExternalIconLink href={member.socials.instagram} label={`${member.name} on Instagram`}>
              <Instagram size={18} />
            </ExternalIconLink>
          ) : null}
          {member.socials?.linkedin ? (
            <ExternalIconLink href={member.socials.linkedin} label={`${member.name} on LinkedIn`}>
              <Linkedin size={18} />
            </ExternalIconLink>
          ) : null}
          {member.socials?.github ? (
            <ExternalIconLink href={member.socials.github} label={`${member.name} on GitHub`}>
              <Github size={18} />
            </ExternalIconLink>
          ) : null}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.name}>{member.name}</div>
        <div className={styles.role}>{member.role}</div>
      </div>
    </article>
  );
} // Updated to force refresh
