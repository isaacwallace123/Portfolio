import { siteConfig } from '@/shared/config/Env';

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))]">
      <div className="app-container py-6 flex items-center justify-between text-xs text-muted">
        <span>
          © {siteConfig.year} {siteConfig.author} — Portfolio
        </span>

        <div className="flex items-center gap-4">
          <a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            LinkedIn
          </a>
          <a href={siteConfig.socials.email} className="hover:text-accent">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
