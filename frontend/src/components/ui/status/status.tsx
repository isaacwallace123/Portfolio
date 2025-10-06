import type { MetricsStatus } from '@/features/metrics/types/metrics.types';

type StatusIndicatorProps = {
  status: MetricsStatus;
  className?: string;
};

export default function StatusIndicator({
  status,
  className = '',
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'live':
        return {
          color: 'bg-brand',
          label: 'Live',
          pulse: true,
        };
      case 'connecting':
      case 'reconnecting':
        return {
          color: 'bg-yellow-500',
          label: 'Connecting',
          pulse: true,
        };
      case 'error':
      case 'closed':
        return {
          color: 'bg-red-500',
          label: 'Offline',
          pulse: false,
        };
      case 'idle':
      default:
        return {
          color: 'bg-muted',
          label: 'Idle',
          pulse: false,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-3 w-3">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${config.color} ${
            config.pulse ? 'animate-ping opacity-75' : 'opacity-0'
          }`}
        />
        <span
          className={`relative inline-flex h-3 w-3 rounded-full ${config.color}`}
        />
      </div>
      <span className="text-sm text-muted">{config.label}</span>
    </div>
  );
}
