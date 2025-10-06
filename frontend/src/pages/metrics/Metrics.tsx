import { FadeIn, SlideRight, SlideUp, Stagger } from '@/components/animations';
import { OfflineBanner, ServerCard } from '@/components/ui';
import { LiveTimeSeriesChart, PlaceholderChart } from '@/components/ui/charts';

import { MetricsProvider, useMetrics } from '@/features/metrics';
import { useState } from 'react';

import './Metrics.css';

const PRESETS = [
  { label: '30s', ms: 30_000 },
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 5 * 60_000 },
  { label: '1h', ms: 60 * 60_000 },
];

export default function MetricsPage() {
  // Keep provider at page level; inner component consumes context.
  return (
    <MetricsProvider>
      <MetricsContent />
    </MetricsProvider>
  );
}

function MetricsContent() {
  const [windowMs, setWindowMs] = useState<number>(30_000);
  const { status } = useMetrics();

  const backendDown =
    status === 'idle' ||
    status === 'closed' ||
    status === 'error' ||
    status === 'reconnecting' ||
    status === 'connecting';

  return (
    <div className="metrics-page">
      {/* Header */}
      <div className="metrics-header">
        <SlideUp duration={650}>
          <h1 className="metrics-title">Metrics</h1>
        </SlideUp>
        <FadeIn duration={600} delay={60}>
          <p className="metrics-subtitle">Real-time server monitoring</p>
        </FadeIn>

        {backendDown && (
          <div className="mt-3">
            <OfflineBanner />
          </div>
        )}
      </div>

      {/* Server cards */}
      <SlideUp duration={650} delay={80}>
        <ServerCard />
      </SlideUp>

      {/* Time range selector */}
      <SlideRight duration={650} delay={120}>
        <div className="metrics-range">
          <span className="metrics-range-label">Range:</span>
          <div className="metrics-range-buttons">
            {PRESETS.map((p, i) => (
              <FadeIn key={p.ms} duration={350} delay={i * 40}>
                <button
                  className={`range-btn ${windowMs === p.ms ? 'active' : ''}`}
                  onClick={() => setWindowMs(p.ms)}
                  type="button"
                >
                  {p.label}
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </SlideRight>

      {/* Charts */}
      <Stagger baseDelay={180} step={120}>
        <div className="metrics-charts">
          <SlideUp duration={650}>
            {backendDown ? (
              <PlaceholderChart label="Backend offline" />
            ) : (
              <LiveTimeSeriesChart
                title="CPU Usage"
                subtitle="Percentage over time"
                series={[
                  {
                    key: 'Proxmox:cpu_pct',
                    label: 'Proxmox',
                    color: '#10b981',
                  },
                  { key: 'Unraid:cpu_pct', label: 'Unraid', color: '#a78bfa' },
                ]}
                timeWindowMs={windowMs}
                unit="%"
              />
            )}
          </SlideUp>

          <SlideUp duration={650}>
            {backendDown ? (
              <PlaceholderChart label="Backend offline" />
            ) : (
              <LiveTimeSeriesChart
                title="Memory Usage"
                subtitle="Percentage over time"
                series={[
                  {
                    key: 'Proxmox:mem_pct',
                    label: 'Proxmox',
                    color: '#10b981',
                  },
                  { key: 'Unraid:mem_pct', label: 'Unraid', color: '#a78bfa' },
                ]}
                height={200}
                timeWindowMs={windowMs}
                unit="%"
              />
            )}
          </SlideUp>

          <SlideUp duration={650}>
            {backendDown ? (
              <PlaceholderChart label="Backend offline" />
            ) : (
              <LiveTimeSeriesChart
                title="Network Traffic"
                subtitle="Mbps over time"
                series={[
                  {
                    key: 'Proxmox:net_mbps',
                    label: 'Proxmox',
                    color: '#10b981',
                  },
                  { key: 'Unraid:net_mbps', label: 'Unraid', color: '#a78bfa' },
                ]}
                height={200}
                timeWindowMs={windowMs}
                unit=" Mbps"
              />
            )}
          </SlideUp>
        </div>
      </Stagger>
    </div>
  );
}
