import type { ClubEvent } from '../../types/event';
import styles from './EventCard.module.css';

type Props = {
  event: ClubEvent;
};

export default function EventCard({ event }: Props) {
  const date = new Date(event.dateISO);
  const formatted = Number.isNaN(date.getTime())
    ? event.dateISO
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>{event.title}</div>
        <div className={styles.date}>{formatted}</div>
      </div>
      <div className={styles.description}>{event.description}</div>
      {event.links && event.links.length ? (
        <div className={styles.links}>
          {event.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
