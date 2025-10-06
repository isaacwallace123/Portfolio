package health

import (
	"github.com/isaacwallace123/GoWeb/app/types"
	"github.com/isaacwallace123/GoWeb/pkg/HttpStatus"
	"github.com/isaacwallace123/GoWeb/pkg/ResponseEntity"
)

type HealthController struct{}

func (c *HealthController) BasePath() string { return "/health" }

func (c *HealthController) Routes() []types.Route {
	return []types.Route{
		{Method: "GET", Path: "/", Handler: "GetHealth"},
	}
}

func (c *HealthController) GetHealth() *types.ResponseEntity {
	return ResponseEntity.Status(HttpStatus.OK).Body("ok")
}
