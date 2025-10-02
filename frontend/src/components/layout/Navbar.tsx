import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/metrics', label: 'Live Metrics' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--color-border))] bg-background/80 backdrop-blur">
      <nav className="app-container h-14 flex items-center gap-6">
        <NavLink to="/" className="font-semibold tracking-tight">
          isaac.dev
        </NavLink>

        <div className="ml-auto hidden sm:flex items-center gap-2 text-sm">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end as boolean | undefined}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1 rounded-md transition-colors',
                  'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-accent))]',
                  isActive && 'text-[rgb(var(--color-accent))] font-medium'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
