package models

type RangeResponse struct {
	Uptime  []SeriesDTO `json:"uptime"`
	CPU     []SeriesDTO `json:"cpu_pct"`
	Memory  []SeriesDTO `json:"mem_pct"`
	Network []SeriesDTO `json:"net_mbps"`
}

type SeriesDTO struct {
	Label  string       `json:"label"`
	Metric string       `json:"metric"`
	Points []TSPointDTO `json:"points"`
}

type TSPointDTO struct {
	TS    int64   `json:"ts"`
	Value float64 `json:"value"`
}
