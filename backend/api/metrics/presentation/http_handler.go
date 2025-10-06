package presentation

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/isaacwallace123/Portfolio/backend/api/metrics/business"
	"github.com/isaacwallace123/Portfolio/backend/api/metrics/mapper"
)

type HTTPHandler struct {
	svc business.Service
}

func NewHTTPHandler(s business.Service) *HTTPHandler { return &HTTPHandler{svc: s} }

func (h *HTTPHandler) Register(mux *http.ServeMux) {
	mux.HandleFunc("/api/v1/metrics/current", h.getCurrent)
	mux.HandleFunc("/api/v1/metrics/history", h.getHistory)
	mux.HandleFunc("/api/v1/metrics/live", h.streamLive)
}

func (h *HTTPHandler) getCurrent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	data, err := h.svc.Live(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(data)
}

func (h *HTTPHandler) getHistory(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	q := strings.ToLower(r.URL.Query().Get("window"))
	win := business.Window1D

	if q == "7d" {
		win = business.Window7D
	} else if q == "30d" {
		win = business.Window30D
	}

	raw, err := h.svc.Range(r.Context(), win)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(mapper.ToRangeResponse(raw))
}

func (h *HTTPHandler) streamLive(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	fl, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "streaming unsupported", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()

	data, _ := h.svc.Live(ctx)
	b, _ := json.Marshal(data)
	w.Write([]byte("data: "))
	w.Write(b)
	w.Write([]byte("\n\n"))
	fl.Flush()

	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			data, err := h.svc.Live(ctx)
			if err != nil {
				continue
			}

			b, _ := json.Marshal(data)
			w.Write([]byte("data: "))
			w.Write(b)
			w.Write([]byte("\n\n"))
			fl.Flush()
		}
	}
}
