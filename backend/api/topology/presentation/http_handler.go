package presentation

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/isaacwallace123/Portfolio/backend/api/topology/business"
	"github.com/isaacwallace123/Portfolio/backend/api/topology/mapper"
)

type HTTPHandler struct {
	svc business.Service
}

func NewHTTPHandler(svc business.Service) *HTTPHandler { return &HTTPHandler{svc: svc} }

func (h *HTTPHandler) Register(mux *http.ServeMux) {
	mux.HandleFunc("/api/v1/topology/", h.getAll)
}

func (h *HTTPHandler) getAll(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	top, err := h.svc.Get(context.Background())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(mapper.FromDomain(top))
}
