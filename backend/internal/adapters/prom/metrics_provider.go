package prom

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/isaacwallace123/Portfolio/backend/internal/domain"
)

type MetricsProvider struct {
	Client *Client
}

func selector(s domain.Server) string {
	parts := make([]string, 0, 2)

	if s.ExporterJob != "" {
		job := s.ExporterJob + "_" + strings.ToLower(strings.TrimSpace(s.Name))
		parts = append(parts, fmt.Sprintf(`job="%s"`, job))
	}

	if s.IP != "" {
		parts = append(parts, fmt.Sprintf(`instance="%s:9100"`, s.IP))
	}

	if len(parts) == 0 {
		return `instance="__none__"`
	}
	return strings.Join(parts, ",")
}

func qUptime(s domain.Server) string {
	return fmt.Sprintf(`avg_over_time(up{%s}[2m])`, selector(s))
}

func qCpuPct(s domain.Server) string {
	return fmt.Sprintf(`100 - (avg by (instance) (rate(node_cpu_seconds_total{%s,mode="idle"}[2m])) * 100)`, selector(s))
}

func qMemPct(s domain.Server) string {
	sel := selector(s)
	return fmt.Sprintf(`(1 - (node_memory_MemAvailable_bytes{%[1]s} / node_memory_MemTotal_bytes{%[1]s})) * 100`, sel)
}

func qNetBytesPerSec(s domain.Server) string {
	sel := selector(s)
	return fmt.Sprintf(`sum(rate(node_network_receive_bytes_total{%[1]s,device!~"lo"}[2m])) + sum(rate(node_network_transmit_bytes_total{%[1]s,device!~"lo"}[2m]))`, sel)
}

func wrapHourly(q string) string {
	return fmt.Sprintf(`avg_over_time((%s)[1h:])`, q)
}

// ---- Helpers ---- \\

func parseInstantValue(v string) float64 {
	f, _ := strconv.ParseFloat(v, 64)

	return f
}

func (p *MetricsProvider) instantFloat(ctx context.Context, query string) (float64, error) {
	resp, err := p.Client.InstantQuery(ctx, query)
	if err != nil {
		return 0, err
	}

	if len(resp.Data.Result) == 0 {
		return 0, nil
	}

	val, _ := resp.Data.Result[0].Value[1].(string)

	return parseInstantValue(val), nil
}

func (p *MetricsProvider) rangePoints(ctx context.Context, query string, start, end time.Time, step time.Duration, scale func(float64) float64) ([]domain.TSPoint, error) {
	resp, err := p.Client.RangeQuery(ctx, query, start, end, step)
	if err != nil {
		return nil, err
	}

	if len(resp.Data.Result) == 0 {
		return []domain.TSPoint{}, nil
	}

	vals := resp.Data.Result[0].Values
	out := make([]domain.TSPoint, 0, len(vals))

	for _, tup := range vals {
		sec, _ := tup[0].(float64)
		str, _ := tup[1].(string)

		f, _ := strconv.ParseFloat(str, 64)

		if scale != nil {
			f = scale(f)
		}

		out = append(out, domain.TSPoint{TS: int64(sec * 1000), Value: f})
	}

	return out, nil
}

// ---- Live Stream ---- \\

func (p *MetricsProvider) LiveUptime(ctx context.Context, s domain.Server) (float64, error) {
	return p.instantFloat(ctx, qUptime(s))
}
func (p *MetricsProvider) LiveCPUPercent(ctx context.Context, s domain.Server) (float64, error) {
	return p.instantFloat(ctx, qCpuPct(s))
}
func (p *MetricsProvider) LiveMemPercent(ctx context.Context, s domain.Server) (float64, error) {
	return p.instantFloat(ctx, qMemPct(s))
}
func (p *MetricsProvider) LiveNetMbps(ctx context.Context, s domain.Server) (float64, error) {
	bps, err := p.instantFloat(ctx, qNetBytesPerSec(s))

	if err != nil {
		return 0, err
	}

	return bps / (1024 * 1024), nil
}

// ---- Statistic Range ---- \\

func (p *MetricsProvider) RangeUptime(ctx context.Context, s domain.Server, start, end time.Time, step time.Duration) ([]domain.TSPoint, error) {
	return p.rangePoints(ctx, wrapHourly(qUptime(s)), start, end, step, nil)
}
func (p *MetricsProvider) RangeCPUPercent(ctx context.Context, s domain.Server, start, end time.Time, step time.Duration) ([]domain.TSPoint, error) {
	return p.rangePoints(ctx, wrapHourly(qCpuPct(s)), start, end, step, nil)
}
func (p *MetricsProvider) RangeMemPercent(ctx context.Context, s domain.Server, start, end time.Time, step time.Duration) ([]domain.TSPoint, error) {
	return p.rangePoints(ctx, wrapHourly(qMemPct(s)), start, end, step, nil)
}
func (p *MetricsProvider) RangeNetMbps(ctx context.Context, s domain.Server, start, end time.Time, step time.Duration) ([]domain.TSPoint, error) {
	return p.rangePoints(ctx, wrapHourly(qNetBytesPerSec(s)), start, end, step, func(x float64) float64 { return x / (1024 * 1024) })
}
