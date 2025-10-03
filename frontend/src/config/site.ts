/// <reference types="vite/client" />

const env = import.meta.env;

const DOMAIN = env.VITE_DOMAIN ?? 'isaacwallace.dev';

export const origin = DOMAIN.startsWith('http') ? DOMAIN : `https://${DOMAIN}`;

export const site = {
  name: env.VITE_NAME ?? 'Isaac Wallace',
  domain: DOMAIN,
  description:
    'Isaac Wallace is a computer science student and software developer.',
  author: 'Isaac Wallace',
  year: new Date().getFullYear(),
  email: env.VITE_EMAIL ?? 'goosewal@gmail.com',
  location: env.VITE_LOCATION ?? 'Montréal, QC',

  handles: {
    github: env.VITE_GITHUB ?? 'isaacwallace123',
    linkedin: env.VITE_LINKEDIN ?? 'isaac-wallace',
    instagram: env.VITE_INSTAGRAM ?? 'isaacwallace123',
  },

  nav: [
    { to: '/', label: 'Home', end: true },
    { to: '/projects', label: 'Projects' },
    { to: '/metrics', label: 'Metrics' },
    { to: '/contact', label: 'Contact' },
  ] as const,

  repo: 'https://github.com/isaacwallace123/Portfolio',
  contactFormUrl: env.VITE_CONTACT_FORM_URL ?? '',

  seo: {
    titleTemplate: env.VITE_TITLE_TEMPLATE ?? '%s — isaacwallace.dev',
    ogImage: env.VITE_OG_IMAGE ?? '/og.png',
  },
} as const;

export type Site = typeof site;

export const socialLinks = {
  github: `https://github.com/${site.handles.github}`,
  linkedin: `https://www.linkedin.com/in/${site.handles.linkedin}`,
  instagram: `https://instagram.com/${site.handles.instagram}`,
  email: `mailto:${site.email}`,
} as const;

export const avatar = {
  github: (size = 200) =>
    `https://github.com/${site.handles.github}.png?size=${size}`,
} as const;

type SocialKey = 'github' | 'linkedin' | 'instagram' | 'email';
type IconKey = 'github' | 'linkedin' | 'instagram' | 'mail';

export const socialsForUI: ReadonlyArray<{
  key: SocialKey;
  label: string;
  href: string;
  icon: IconKey;
}> = [
  { key: 'github', label: 'GitHub', href: socialLinks.github, icon: 'github' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: socialLinks.linkedin,
    icon: 'linkedin',
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: socialLinks.instagram,
    icon: 'instagram',
  },
  { key: 'email', label: 'Email', href: socialLinks.email, icon: 'mail' },
];
