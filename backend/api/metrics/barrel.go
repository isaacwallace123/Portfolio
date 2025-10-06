package metrics

import (
	"net/http"

	"github.com/isaacwallace123/Portfolio/backend/api/metrics/business"
	"github.com/isaacwallace123/Portfolio/backend/api/metrics/dataaccess"
	"github.com/isaacwallace123/Portfolio/backend/api/metrics/presentation"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/prom"
	"github.com/isaacwallace123/Portfolio/backend/internal/config"
)

func Register(mux *http.ServeMux, cfg *config.Config, pcli *prom.Client) {
	mp := &prom.MetricsProvider{Client: pcli}
	repo := dataaccess.NewRepository(cfg, mp)
	svc := business.NewService(repo)
	presentation.NewHTTPHandler(svc).Register(mux)
}
