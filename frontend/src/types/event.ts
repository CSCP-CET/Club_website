export type EventLink = {
  label: string;
  url: string;
};

export type ClubEvent = {
  id: string;
  title: string;
  description: string;
  dateISO: string;
  kind: 'upcoming' | 'past';
  links?: EventLink[];
};
