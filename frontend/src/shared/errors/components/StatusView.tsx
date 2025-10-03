import { useLocation } from 'react-router-dom';

import { Button } from '@/components/ui';

import './StatusView.css';

type LocationState = {
  status?: number;
  message?: string;
};

export default function StatusView() {
  const { state } = useLocation() as { state?: LocationState };

  const status = state?.status ?? 404;
  const message = state?.message ?? 'Page not found';

  return (
    <main className="status-root">
      <div className="status-wrap">
        <div className="status-badge">
          <span className="dot" />
          <span className="label">Error</span>
          <span className="code">{status}</span>
        </div>

        <h1 className="status-number text-gradient-brand">{status}</h1>

        <p className="status-message">{message}</p>

        <div className="status-actions">
          <Button to="/" variant="glass" isDeep textSize=".95rem">
            Go Home
          </Button>
        </div>

        <p className="status-tip">
          If you typed the URL directly, please check the spelling.
        </p>
      </div>
    </main>
  );
}
