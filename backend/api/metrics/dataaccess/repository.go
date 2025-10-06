package dataaccess

import (
	"context"
	"time"

	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/prom"
	"github.com/isaacwallace123/Portfolio/backend/internal/config"
	"github.com/isaacwallace123/Portfolio/backend/internal/domain"
)

type Repository interface {
	Live(ctx context.Context) (map[string]map[string]float64, error)
	RangeAll(ctx context.Context, start, end time.Time, step time.Duration) (map[string][]domain.Series, error)
}

type repo struct {
	cfg *config.Config
	mp  *prom.MetricsProvider
}

func NewRepository(cfg *config.Config, mp *prom.MetricsProvider) Repository {
	return &repo{cfg: cfg, mp: mp}
}

func (r *repo) servers() []domain.Server {
	out := make([]domain.Server, 0, len(r.cfg.Inventory.Servers))

	for _, s := range r.cfg.Inventory.Servers {
		out = append(out, domain.Server{
			ID:          s.ID,
			Name:        s.Name,
			IP:          s.IP,
			ExporterJob: s.ExporterJob,
		})
	}

	return out
}

func (r *repo) Live(ctx context.Context) (map[string]map[string]float64, error) {
	servers := r.servers()
	out := make(map[string]map[string]float64, len(servers))

	for _, s := range servers {
		m := map[string]float64{}

		if v, e := r.mp.LiveUptime(ctx, s); e == nil {
			m["uptime"] = v
		}

		if v, e := r.mp.LiveCPUPercent(ctx, s); e == nil {
			m["cpu_pct"] = v
		}

		if v, e := r.mp.LiveMemPercent(ctx, s); e == nil {
			m["mem_pct"] = v
		}

		if v, e := r.mp.LiveNetMbps(ctx, s); e == nil {
			m["net_mbps"] = v
		}

		out[s.Name] = m
	}

	return out, nil
}

func (r *repo) RangeAll(ctx context.Context, start, end time.Time, step time.Duration) (map[string][]domain.Series, error) {
	srvs := r.servers()

	build := func(metric string, fn func(context.Context, domain.Server, time.Time, time.Time, time.Duration) ([]domain.TSPoint, error)) []domain.Series {
		series := make([]domain.Series, 0, len(srvs))

		for _, s := range srvs {
			pts, _ := fn(ctx, s, start, end, step)
			series = append(series, domain.Series{Label: s.Name, Metric: metric, Points: pts})
		}

		return series
	}

	return map[string][]domain.Series{
		"uptime":   build("uptime", r.mp.RangeUptime),
		"cpu_pct":  build("cpu_pct", r.mp.RangeCPUPercent),
		"mem_pct":  build("mem_pct", r.mp.RangeMemPercent),
		"net_mbps": build("net_mbps", r.mp.RangeNetMbps),
	}, nil
}
