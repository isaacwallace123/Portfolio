package docker

import (
	"context"
	"strings"

	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/isaacwallace123/GoUtils/logger"
)

type Client struct{ cli *client.Client }

func New(host string) (*Client, error) {
	opts := []client.Opt{
		client.WithAPIVersionNegotiation(),
	}

	if strings.TrimSpace(host) != "" {
		logger.Info("Connecting to host: %s", host)

		opts = append(opts, client.WithHost(host))
	} else {
		logger.Warn("using default docker host from env")
	}

	cli, err := client.NewClientWithOpts(opts...)

	if err != nil {
		return nil, err
	}

	return &Client{cli: cli}, nil
}

type ContainerInfo struct {
	ID      string
	Name    string
	IP      string
	Running bool
	Labels  map[string]string
}

func (c *Client) List(ctx context.Context) ([]ContainerInfo, error) {
	cs, err := c.cli.ContainerList(ctx, container.ListOptions{All: true})

	if err != nil {
		return nil, logger.Error("ContainerList error: %v", err)
	}

	logger.Info("ContainerList returned %d items", len(cs))

	out := make([]ContainerInfo, 0, len(cs))

	for _, co := range cs {
		name := ""
		if len(co.Names) > 0 {
			name = strings.TrimPrefix(co.Names[0], "/")
		}

		ip := ""
		if co.NetworkSettings != nil {
			for _, n := range co.NetworkSettings.Networks {
				if n != nil && n.IPAddress != "" {
					ip = n.IPAddress
					break
				}
			}
		}

		running := strings.EqualFold(co.State, "running")
		out = append(out, ContainerInfo{
			ID:      co.ID,
			Name:    name,
			IP:      ip,
			Running: running,
			Labels:  co.Labels,
		})
	}

	return out, nil
}
