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
