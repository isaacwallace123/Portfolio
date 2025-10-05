package topology

import (
	"github.com/isaacwallace123/Portfolio/backend/api/topology/business"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/dataaccess"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/presentation"
)

var (
	NewRepository         = dataaccess.NewRepository
	NewService            = business.NewService
	NewTopologyController = presentation.NewTopologyController
)
