import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';

import { siteConfig } from '@/shared/config/Env';
import { Routes } from '@/shared/config/Routes';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--color-border))] bg-background/80 backdrop-blur">
      <nav className="app-container h-14 flex items-center gap-6">
        <NavLink to="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </NavLink>

        <div className="ml-auto hidden sm:flex items-center gap-2 text-sm">
          {Routes.map(link => (
            <NavLink
              key={link.key}
              to={link.path}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1 rounded-md transition-colors',
                  'text-muted hover:text-brand',
                  isActive && 'text-brand font-medium'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
