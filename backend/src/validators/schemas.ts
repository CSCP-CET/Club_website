import { z } from 'zod';

export const socialLinksSchema = z
  .object({
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    github: z.string().url().optional(),
  })
  .strict();

export const memberSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    imageUrl: z.string().min(1), // Relaxed validation to allow identifiers like "img1"
    socials: socialLinksSchema,
  })
  .strict();

export const eventLinkSchema = z
  .object({
    label: z.string().min(1),
    url: z.string().url(),
  })
  .strict();

export const eventSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    dateISO: z.string().min(4),
    kind: z.enum(['upcoming', 'past']),
    links: z.array(eventLinkSchema).optional(),
  })
  .strict();

export const timelineItemSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    dateISO: z.string().min(4),
  })
  .strict();

export const membersSchema = z.array(memberSchema);
export const eventsSchema = z.array(eventSchema);
export const timelineSchema = z.array(timelineItemSchema);
