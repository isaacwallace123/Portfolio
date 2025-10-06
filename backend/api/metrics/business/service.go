package business

import (
	"context"
	"time"

	"github.com/isaacwallace123/Portfolio/backend/api/metrics/dataaccess"
	"github.com/isaacwallace123/Portfolio/backend/internal/domain"
)

type Window string

const (
	Window1D  Window = "1d"
	Window7D  Window = "7d"
	Window30D Window = "30d"
)

type Service interface {
	Live(ctx context.Context) (map[string]map[string]float64, error)
	Range(ctx context.Context, w Window) (map[string][]domain.Series, error)
}

type service struct{ repo dataaccess.Repository }

func NewService(r dataaccess.Repository) Service { return &service{repo: r} }

func (s *service) Live(ctx context.Context) (map[string]map[string]float64, error) {
	return s.repo.Live(ctx)
}

func (s *service) Range(ctx context.Context, w Window) (map[string][]domain.Series, error) {
	now := time.Now()
	days := 1
	switch w {
	case Window7D:
		days = 7
	case Window30D:
		days = 30
	}
	start := now.AddDate(0, 0, -days)
	return s.repo.RangeAll(ctx, start, now, time.Hour)
}
