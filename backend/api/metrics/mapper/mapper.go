package mapper

import "github.com/isaacwallace123/Portfolio/backend/internal/domain"

type TSPointDTO struct {
	TS    int64   `json:"ts"`
	Value float64 `json:"value"`
}
type SeriesDTO struct {
	Label  string       `json:"label"`
	Metric string       `json:"metric"`
	Points []TSPointDTO `json:"points"`
}

type RangeResponse struct {
	Uptime  []SeriesDTO `json:"uptime"`
	CPU     []SeriesDTO `json:"cpu_pct"`
	Memory  []SeriesDTO `json:"mem_pct"`
	Network []SeriesDTO `json:"net_mbps"`
}

func ToRangeResponse(m map[string][]domain.Series) RangeResponse {
	return RangeResponse{
		Uptime:  toDTO(m["uptime"]),
		CPU:     toDTO(m["cpu_pct"]),
		Memory:  toDTO(m["mem_pct"]),
		Network: toDTO(m["net_mbps"]),
	}
}

func toDTO(in []domain.Series) []SeriesDTO {
	out := make([]SeriesDTO, 0, len(in))
	for _, s := range in {
		ps := make([]TSPointDTO, len(s.Points))
		for i, p := range s.Points {
			ps[i] = TSPointDTO{TS: p.TS, Value: p.Value}
		}
		out = append(out, SeriesDTO{Label: s.Label, Metric: s.Metric, Points: ps})
	}
	return out
}
