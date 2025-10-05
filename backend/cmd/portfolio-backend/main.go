package main

import (
	"github.com/isaacwallace123/GoUtils/logger"
	"github.com/isaacwallace123/GoWeb/app"
	"github.com/isaacwallace123/GoWeb/pkg/middlewares"

	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/docker"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/prom"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/proxmox"

	"github.com/isaacwallace123/Portfolio/backend/api/topology"

	"github.com/isaacwallace123/Portfolio/backend/internal/config"
)

func main() {
	cfg := config.Load()

	dck, _ := docker.New(cfg.Docker.Host)
	prox := proxmox.New(cfg.Proxmox.BaseURL, cfg.Proxmox.TokenID, cfg.Proxmox.TokenSecret, cfg.Proxmox.InsecureTLS)
	_ = prom.New(cfg.Prometheus.BaseURL)

	topRepo := topology.NewRepository(cfg, dck, prox)
	topSvc := topology.NewService(topRepo)
	topCtl := topology.NewTopologyController(topSvc)

	router := app.NewRouter()
	router.RegisterControllers(
		topCtl,
	)

	app.UseAfter(middlewares.LoggingPost)

	app.Use(middlewares.CORS)

	middlewares.CORS.Config.AllowedOrigins = []string{"localhost"}
	middlewares.CORS.Config.AllowedMethods = []string{"GET"}
	middlewares.CORS.Config.AllowedHeaders = []string{"Content-Type", "Authorization"}
	middlewares.CORS.Config.AllowCredentials = true

	logger.Info("Server listening on http://localhost:8080")
	if err := router.Listen(":8080"); err != nil {
		logger.Fatal("Server failed to launch:", err)
	}
}
