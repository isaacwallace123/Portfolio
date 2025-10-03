import { site, socialLinks } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))]">
      <div className="app-container py-6 flex items-center justify-between text-xs text-muted">
        <span>
          © {site.year} {site.author} — Portfolio
        </span>

        <div className="flex items-center gap-4">
          <a
            href={socialLinks.github}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent"
          >
            LinkedIn
          </a>
          <a href={socialLinks.email} className="hover:text-accent">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
