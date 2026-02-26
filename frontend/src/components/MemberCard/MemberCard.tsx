import type { ReactNode } from 'react';
import { LuGithub, LuInstagram, LuLinkedin } from 'react-icons/lu';
import type { Member } from '../../types/member';
import styles from './MemberCard.module.css';

type Props = {
  member: Member;
};

const execomImageModules = import.meta.glob('../../assets/Execom/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const execomImageMap = new Map<string, string>();
for (const [filePath, url] of Object.entries(execomImageModules)) {
  const fileName = filePath.split('/').pop();
  if (!fileName) continue;
  execomImageMap.set(fileName, url);
  execomImageMap.set(fileName.toLowerCase(), url);
}

function resolveMemberImageUrl(imageUrl: string) {
  if (imageUrl.startsWith('/assets/')) {
    const fileName = decodeURIComponent(imageUrl.split('/').pop() ?? '');
    const bundled = execomImageMap.get(fileName) ?? execomImageMap.get(fileName.toLowerCase());
    if (bundled) {
      return bundled;
    }

    const base =
      (import.meta.env.VITE_API_URL as string | undefined) ??
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const url = new URL(`/api${imageUrl}`, base);
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

/** Map of member names (lowercase) whose photos need a CSS rotation fix. */
const IMAGE_ROTATION_FIXES: Record<string, string> = {
  'ivin mathew kurian': 'rotate(-90deg)',
};

export default function MemberCard({ member }: Props) {
  const imageSrc = resolveMemberImageUrl(member.imageUrl);
  const rotationFix = IMAGE_ROTATION_FIXES[member.name.toLowerCase()];

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <img
          className={styles.image}
          src={imageSrc}
          alt={member.name}
          loading="lazy"
          style={rotationFix ? { transform: rotationFix } : undefined}
        />
        <div className={styles.overlay} aria-hidden="true" />
        <div className={styles.icons}>
          {member.socials?.instagram ? (
            <ExternalIconLink href={member.socials.instagram} label={`${member.name} on Instagram`}>
              <LuInstagram size={18} />
            </ExternalIconLink>
          ) : null}
          {member.socials?.linkedin ? (
            <ExternalIconLink href={member.socials.linkedin} label={`${member.name} on LinkedIn`}>
              <LuLinkedin size={18} />
            </ExternalIconLink>
          ) : null}
          {member.socials?.github ? (
            <ExternalIconLink href={member.socials.github} label={`${member.name} on GitHub`}>
              <LuGithub size={18} />
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
}
