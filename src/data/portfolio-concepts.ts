// Homepage-only project directions. These are naming ideas, not published case studies.
// Replace a concept with a real published Work when its project and cover are ready.
export interface PortfolioConcept {
  slug: string;
  title: string;
  discipline: string;
  description: string;
  background: string;
  foreground: string;
  accent: string;
}

export const portfolioConcepts: PortfolioConcept[] = [
  { slug: 'afterimage', title: 'AFTERIMAGE', discipline: 'POSTER / MOTION', description: 'A visual series exploring rhythm, repetition, and the trace an image leaves behind.', background: '#c8cbc6', foreground: '#222820', accent: '#ed5848' },
  { slug: 'common-ground', title: 'COMMON GROUND', discipline: 'CULTURE / IDENTITY', description: 'A flexible identity direction for a gathering of people, places, and ideas.', background: '#d9d7ca', foreground: '#26251f', accent: '#b2cf5e' },
  { slug: 'soft-signal', title: 'SOFT SIGNAL', discipline: 'DIGITAL / VISUAL SYSTEM', description: 'A quiet, expressive visual language for a contemporary digital product.', background: '#b6c1c4', foreground: '#15242c', accent: '#ef5a50' },
  { slug: 'field-notes', title: 'FIELD NOTES', discipline: 'EDITORIAL / ART DIRECTION', description: 'An editorial system built around observation, typography, and collected details.', background: '#cbc6ba', foreground: '#29261f', accent: '#a8ce5d' },
  { slug: 'form-and-feeling', title: 'FORM & FEELING', discipline: 'BRAND / PACKAGING', description: 'A tactile identity study where simple forms carry an emotional point of view.', background: '#c9b9b1', foreground: '#302420', accent: '#ed5848' },
  { slug: 'moving-still', title: 'MOVING STILL', discipline: 'CAMPAIGN / IMAGE MAKING', description: 'A campaign direction that connects graphic composition with motion.', background: '#c2c5c0', foreground: '#212a25', accent: '#b2cf5e' },
];
