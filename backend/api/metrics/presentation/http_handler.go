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
	mux.HandleFunc("/api/v1/metrics/live", h.getLive)
	mux.HandleFunc("/api/v1/metrics/range", h.getRange)
	mux.HandleFunc("/api/v1/metrics/live/stream", h.streamLive)
}

func (h *HTTPHandler) getLive(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)

		return
	}

	data, err := h.svc.Live(r.Context())

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(data)
}

func (h *HTTPHandler) getRange(w http.ResponseWriter, r *http.Request) {
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
	fl, ok := w.(http.Flusher)

	if !ok {
		http.Error(w, "stream unsupported", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")

	t := time.NewTicker(2 * time.Second)

	defer t.Stop()

	ctx := r.Context()

	for {
		select {
		case <-ctx.Done():
			return
		case <-t.C:
			data, err := h.svc.Live(ctx)

			if err != nil {
				continue
			}

			b, _ := json.Marshal(data)

			_, _ = w.Write([]byte("data: "))
			_, _ = w.Write(b)
			_, _ = w.Write([]byte("\n\n"))

			fl.Flush()
		}
	}
}
