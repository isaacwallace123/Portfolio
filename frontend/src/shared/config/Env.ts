export const siteConfig = {
  name: 'isaacwallace.dev',
  description:
    'Isaac Wallace is a computer science student and software developer.',
  author: 'Isaac Wallace',
  year: new Date().getFullYear(),

  nav: [
    { to: '/', label: 'Home', end: true },
    { to: '/projects', label: 'Projects' },
    { to: '/metrics', label: 'Live Metrics' },
    { to: '/contact', label: 'Contact' },
  ] as const,

  socials: {
    github: 'https://github.com/isaacwallace123',
    linkedin: 'https://www.linkedin.com/in/isaac-wallace/',
    email: 'mailto:goosewal@gmail.com',
  },

  repo: 'https://github.com/isaacwallace123/Portfolio',
  contactFormUrl: '',

  seo: {
    titleTemplate: '%s — isaacwallace.dev',
    ogImage: '/og.png',
  },
} as const;

export type SiteConfig = typeof siteConfig;
