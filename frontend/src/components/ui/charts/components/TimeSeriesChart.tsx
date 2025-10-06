import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import type { SeriesDef, TimePoint } from '@/components/ui/charts/types';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import './TimeSeriesChart.css';

type Props = {
  title?: string;
  subtitle?: string;
  data: TimePoint[];
  series: SeriesDef[];
  height?: number;
  yMin?: number;
  yMax?: number;
  className?: string;
  unit?: string;
  /** show or hide legend (default true) */
  showLegend?: boolean;
};

export default function TimeSeriesChart({
  title = 'Time Series',
  subtitle,
  data,
  series,
  height = 240,
  yMin,
  yMax,
  className = '',
  unit = '',
  showLegend = true,
}: Props) {
  const chartData = useMemo(
    () =>
      data.map(d => ({
        x: d.t,
        ...series.reduce<Record<string, number>>((acc, s) => {
          acc[s.key] = d[s.key] ?? NaN;
          return acc;
        }, {}),
      })),
    [data, series]
  );

  const fmtTime = (ms: number) =>
    new Date(ms).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const fmtNum = (v: unknown) => {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : '-';
  };

  return (
    <Card className={`shad-ts ${className}`}>
      <CardHeader className="flex flex-row items-end justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0" style={{ height }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, bottom: 20, left: 12 }}
          >
            <CartesianGrid stroke="var(--ts-grid)" />
            <XAxis
              dataKey="x"
              type="number"
              domain={['auto', 'auto']}
              tickFormatter={fmtTime}
              tick={{ fill: 'var(--ts-subtle)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[yMin ?? 'auto', yMax ?? 'auto']}
              tick={{ fill: 'var(--ts-subtle)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `${fmtNum(v)}${unit}`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--ts-tooltip)',
                border: '1px solid var(--ts-border)',
                borderRadius: 8,
              }}
              labelFormatter={v => fmtTime(Number(v))}
              formatter={(v: unknown, name: string) => [
                `${fmtNum(v)}${unit}`,
                name,
              ]}
            />
            {showLegend && (
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{
                  color: 'var(--ts-subtle)',
                  fontSize: '.85rem',
                  paddingBottom: 4,
                }}
                iconType="plainline"
              />
            )}
            {series.map((s, idx) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={s.color ?? `var(--ts-color-${idx + 1})`}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
