package main

import (
	"log"
	"net/http"

	"github.com/isaacwallace123/Portfolio/backend/api/metrics"
	"github.com/isaacwallace123/Portfolio/backend/api/topology"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/docker"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/prom"
	"github.com/isaacwallace123/Portfolio/backend/internal/adapters/proxmox"
	"github.com/isaacwallace123/Portfolio/backend/internal/config"
	"github.com/isaacwallace123/Portfolio/backend/internal/httputil"
)

func main() {
	cfg := config.Load()

	dck, _ := docker.New(cfg.Docker.Host)
	prox := proxmox.New(cfg.Proxmox.BaseURL, cfg.Proxmox.TokenID, cfg.Proxmox.TokenSecret, cfg.Proxmox.InsecureTLS)
	promClient := prom.New(cfg.Prometheus.BaseURL)

	topRepo := topology.NewRepository(cfg, dck, prox)
	topSvc := topology.NewService(topRepo)

	mux := http.NewServeMux()

	topology.NewHTTPHandler(topSvc).Register(mux)

	metrics.Register(mux, cfg, promClient)

	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) })

	handler := httputil.LoggingMiddleware(
		httputil.CORSMiddleware(httputil.CORSConfig{
			AllowedOrigins:   []string{"http://localhost:5173"},
			AllowedMethods:   []string{"GET", "OPTIONS"},
			AllowedHeaders:   []string{"Content-Type"},
			AllowCredentials: false,
		})(mux),
	)

	log.Println("Server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
