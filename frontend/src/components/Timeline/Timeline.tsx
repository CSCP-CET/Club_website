import type { TimelineItem } from '../../types/timeline';
import styles from './Timeline.module.css';

type Props = {
  items: TimelineItem[];
};

export default function Timeline({ items }: Props) {
  return (
    <div className={styles.timeline}>
      {items.map((item) => {
        const date = new Date(item.dateISO);
        const formatted = Number.isNaN(date.getTime())
          ? item.dateISO
          : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });

        return (
          <div key={item.id} className={styles.item}>
            <div className={styles.dot} aria-hidden="true" />
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.date}>{formatted}</div>
              </div>
              {item.description ? <div className={styles.desc}>{item.description}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
