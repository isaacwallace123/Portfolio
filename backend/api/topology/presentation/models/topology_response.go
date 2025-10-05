package models

type TopologyResponse struct {
	Ingress IngressDTO  `json:"ingress"`
	Servers []ServerDTO `json:"servers"`
}

type IngressDTO struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	IP   string `json:"ip"`
}

type ServerDTO struct {
	ID          string         `json:"id"`
	Name        string         `json:"name"`
	IP          string         `json:"ip,omitempty"`
	ExporterJob string         `json:"exporterJob,omitempty"`
	Alive       bool           `json:"alive"`
	Containers  []ContainerDTO `json:"containers,omitempty"`
}

type ContainerDTO struct {
	ID       string            `json:"id"`
	Name     string            `json:"name,omitempty"`
	IP       string            `json:"ip,omitempty"`
	Provider string            `json:"provider,omitempty"`
	Running  bool              `json:"running"`
	Labels   map[string]string `json:"labels,omitempty"`
}
