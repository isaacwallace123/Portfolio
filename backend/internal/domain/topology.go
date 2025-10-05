package domain

type Topology struct {
	Ingress Ingress
	Servers []Server
}

type Ingress struct {
	ID   string
	Name string
	IP   string
}

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
