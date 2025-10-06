package topology

import (
	"net/http"

	"github.com/isaacwallace123/Portfolio/backend/api/topology/business"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/dataaccess"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/presentation"
)

var (
	NewRepository  = dataaccess.NewRepository
	NewService     = business.NewService
	NewHTTPHandler = presentation.NewHTTPHandler
)

func RegisterHTTP(mux *http.ServeMux, svc business.Service) {
	NewHTTPHandler(svc).Register(mux)
}
