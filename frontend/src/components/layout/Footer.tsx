export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--color-border))]">
      <div className="app-container py-6 text-sm text-[rgb(var(--color-muted))] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Isaac Wallace — Portfolio</p>
        <nav className="flex gap-6">
          <a
            className="hover:text-foreground"
            href="https://github.com/yourname"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="hover:text-foreground"
            href="https://www.linkedin.com/in/yourname"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a className="hover:text-foreground" href="/contact">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
