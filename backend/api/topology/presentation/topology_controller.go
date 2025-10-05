package presentation

import (
	"context"

	"github.com/isaacwallace123/GoWeb/app/types"
	"github.com/isaacwallace123/GoWeb/pkg/HttpStatus"
	"github.com/isaacwallace123/GoWeb/pkg/ResponseEntity"
	"github.com/isaacwallace123/GoWeb/pkg/exception"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/business"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/mapper"
)

type TopologyController struct {
	svc business.Service
}

func NewTopologyController(svc business.Service) *TopologyController {
	return &TopologyController{svc: svc}
}

func (c *TopologyController) BasePath() string { return "/api/v1/topology" }

func (c *TopologyController) Routes() []types.Route {
	return []types.Route{
		{Method: "GET", Path: "/", Handler: "GetAll"},
	}
}

func (c *TopologyController) GetAll() *types.ResponseEntity {
	top, err := c.svc.Get(context.Background())

	if err != nil {
		return exception.InternalServerException(err.Error())
	}

	return ResponseEntity.Status(HttpStatus.OK).Body(mapper.FromDomain(top))
}
