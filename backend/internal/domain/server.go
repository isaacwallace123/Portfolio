package domain

type Server struct {
	ID          string
	Name        string
	IP          string
	ExporterJob string
	Alive       bool
	Containers  []Container
}

type Container struct {
	ID       string
	Name     string
	IP       string
	Provider string
	Running  bool
	Labels   map[string]string
}
