import type { ReactNode } from 'react';
import { Github, Instagram, Linkedin } from 'lucide-react';
import type { Member } from '../../types/member';
import styles from './MemberCard.module.css';

type Props = {
  member: Member;
};

// Helper to resolve potential relative paths from public or src
function resolveMemberImageUrl(imageUrl: string) {
  if (!imageUrl) return '';
  // If it's a remote URL, return as is
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // If we are using locally imported assets in the parent, the URL will be passed down
  // so we can just return it. 
  // However, for the static data we might pass paths like "/src/assets/..." 
  // Vite handles imports best if we import them in the parent, but if we pass string paths:
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
  // If the image is imported in the parent, it's a string (URL). 
  // If it's from the API, it's a string path.
  const imageSrc = resolveMemberImageUrl(member.imageUrl);

  return (
    <article className={styles.card}>
      <div className={styles.contentWrapper}>
        <figure className={styles.imageWrapper}>
           <div className={styles.imageContainer}>
              <img className={styles.image} src={imageSrc} alt={member.name} loading="lazy" />
           </div>
           
           {/* Blue Blur Effect */}
           <div className={styles.blueBlur} aria-hidden="true">
              <img 
                src="https://framerusercontent.com/images/Q38ypNMBsBVK6qjiF6kKfrobM24.png" 
                alt="" 
                className={styles.blurImage}
              />
           </div>
        </figure>

        <div className={styles.socials}>
          {member.socials.instagram && (
            <ExternalIconLink href={member.socials.instagram} label={`${member.name} on Instagram`}>
              <Instagram size={18} />
            </ExternalIconLink>
          )}
          {member.socials.linkedin && (
             <ExternalIconLink href={member.socials.linkedin} label={`${member.name} on LinkedIn`}>
              <Linkedin size={18} />
            </ExternalIconLink>
          )}
           {member.socials.github && (
            <ExternalIconLink href={member.socials.github} label={`${member.name} on GitHub`}>
              <Github size={18} />
            </ExternalIconLink>
          )}
        </div>
      </div>

      <div className={styles.info}>
        {member.name && <h3 className={styles.name}>{member.name}</h3>}
        {member.role && <p className={styles.role}>{member.role}</p>}
      </div>
    </article>
  );
}
