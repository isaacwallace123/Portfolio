import Status from '@/components/ui/status/status';

import { useMetrics } from '@/features/metrics';
import './ServerCard.css';

export default function ServerCard() {
  const { status, current, lastByKey } = useMetrics();

  const get = (
    server: string,
    key: 'cpu_pct' | 'mem_pct' | 'net_mbps' | 'uptime'
  ) => lastByKey.get(`${server}:${key}` as const)?.value;

  const servers = current ? Object.keys(current) : [];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {servers.map(server => {
        const cpu = get(server, 'cpu_pct') ?? current?.[server]?.cpu_pct;
        const mem = get(server, 'mem_pct') ?? current?.[server]?.mem_pct;
        const net = get(server, 'net_mbps') ?? current?.[server]?.net_mbps;
        const up = get(server, 'uptime') ?? current?.[server]?.uptime;

        return (
          <div key={server} className="server-card">
            <div className="server-card-header">
              <h3 className="server-card-title">{server}</h3>
              <Status status={status} />
            </div>

            <div className="server-card-content">
              <div className="server-card-row">
                <span className="server-card-label">CPU:</span>
                <span className="server-card-value">
                  {cpu?.toFixed?.(2) ?? '—'}%
                </span>
              </div>
              <div className="server-card-row">
                <span className="server-card-label">Memory:</span>
                <span className="server-card-value">
                  {mem?.toFixed?.(2) ?? '—'}%
                </span>
              </div>
              <div className="server-card-row">
                <span className="server-card-label">Network:</span>
                <span className="server-card-value">
                  {net?.toFixed?.(3) ?? '—'} Mbps
                </span>
              </div>
              <div className="server-card-row server-card-divider">
                <span className="server-card-label">Uptime:</span>
                <span className="server-card-value">
                  {up === 1 ? 'Reachable' : up === 0 ? 'Unreachable' : '-'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
