package mapper

import (
	"github.com/isaacwallace123/Portfolio/backend/api/topology/presentation/models"
	"github.com/isaacwallace123/Portfolio/backend/internal/domain"
)

func FromDomain(t domain.Topology) models.TopologyResponse {
	servers := make([]models.ServerDTO, 0, len(t.Servers))

	for _, s := range t.Servers {
		cs := make([]models.ContainerDTO, 0, len(s.Containers))
		for _, c := range s.Containers {
			cs = append(cs, models.ContainerDTO{
				ID:       c.ID,
				Name:     c.Name,
				IP:       c.IP,
				Provider: c.Provider,
				Running:  c.Running,
				Labels:   c.Labels,
			})
		}

		servers = append(servers, models.ServerDTO{
			ID:          s.ID,
			Name:        s.Name,
			IP:          s.IP,
			ExporterJob: s.ExporterJob,
			Alive:       s.Alive,
			Containers:  cs,
		})
	}

	return models.TopologyResponse{
		Ingress: models.IngressDTO{ID: t.Ingress.ID, Name: t.Ingress.Name, IP: t.Ingress.IP},
		Servers: servers,
	}
}
