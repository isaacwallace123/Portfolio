package business

import (
	"context"

	"github.com/isaacwallace123/Portfolio/backend/api/topology/dataaccess"
	"github.com/isaacwallace123/Portfolio/backend/internal/domain"
)

type Service interface {
	Get(ctx context.Context) (domain.Topology, error)
}

type service struct {
	repo dataaccess.Repository
}

func NewService(r dataaccess.Repository) Service { return &service{repo: r} }

func (s *service) Get(ctx context.Context) (domain.Topology, error) {
	return s.repo.Fetch(ctx)
}
