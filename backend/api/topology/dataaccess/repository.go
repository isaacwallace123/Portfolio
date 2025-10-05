package dataaccess

import (
	"context"
	"strconv"
	"strings"
	"time"

	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/docker"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/icmp"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/proxmox"

	"github.com/isaacwallace123/Portfolio/backend/internal/config"
	"github.com/isaacwallace123/Portfolio/backend/internal/domain"
)

type Repository interface {
	Fetch(ctx context.Context) (domain.Topology, error)
}

type repo struct {
	cfg  *config.Config
	doc  *docker.Client
	prox *proxmox.Client
}

func NewRepository(cfg *config.Config, doc *docker.Client, prox *proxmox.Client) Repository {
	return &repo{cfg: cfg, doc: doc, prox: prox}
}

func (r *repo) Fetch(ctx context.Context) (domain.Topology, error) {
	topo := domain.Topology{
		Ingress: domain.Ingress{
			ID:   r.cfg.Inventory.Ingress.ID,
			Name: r.cfg.Inventory.Ingress.Name,
			IP:   r.cfg.Inventory.Ingress.IP,
		},
		Servers: make([]domain.Server, 0, len(r.cfg.Inventory.Servers)),
	}

	dockerByName := map[string]struct {
		IP      string
		Running bool
	}{}

	if r.doc != nil {
		if list, err := r.doc.List(ctx); err == nil {
			for _, c := range list {
				dockerByName[c.Name] = struct {
					IP      string
					Running bool
				}{IP: c.IP, Running: c.Running}
			}
		}
	}

	lxcByID := map[string]struct {
		Name    string
		Running bool
	}{}

	if r.prox != nil {
		if lxcs, err := r.prox.ListLXC(); err == nil {
			for _, vm := range lxcs {
				running := vm.Status == "running"
				lxcByID[strconv.Itoa(vm.VMID)] = struct {
					Name    string
					Running bool
				}{
					Name: vm.Name, Running: running,
				}
			}
		}
	}

	for _, s := range r.cfg.Inventory.Servers {
		ds := domain.Server{
			ID:          s.ID,
			Name:        s.Name,
			IP:          s.IP,
			ExporterJob: s.ExporterJob,
			Containers:  make([]domain.Container, 0, len(s.Containers)),
		}

		alive := false
		if s.IP != "" {
			if _, ok, _ := icmp.Ping(s.IP, 1*time.Second); ok {
				alive = true
			}
		}
		ds.Alive = alive

		for _, ic := range s.Containers {
			provider := ""
			ip := ""
			running := false

			if strings.HasPrefix(ic.Ref, "docker://") {
				name := strings.TrimPrefix(ic.Ref, "docker://")
				if d, ok := dockerByName[name]; ok {
					ip = d.IP
					running = d.Running
				}
				provider = "docker"
			} else if strings.HasPrefix(ic.Ref, "lxc://") {
				id := strings.TrimPrefix(ic.Ref, "lxc://")
				if l, ok := lxcByID[id]; ok {
					running = l.Running
				}
				provider = "lxc"
			}

			ds.Containers = append(ds.Containers, domain.Container{
				ID:       ic.Ref,
				Name:     ic.Ref,
				IP:       ip,
				Provider: provider,
				Running:  running,
				Labels:   ic.Labels,
			})
		}

		topo.Servers = append(topo.Servers, ds)
	}

	return topo, nil
}
