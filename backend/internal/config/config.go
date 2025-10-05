package config

import (
	"os"

	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type Config struct {
	Prometheus struct {
		BaseURL string `yaml:"base_url"`
	} `yaml:"prometheus"`

	Docker struct {
		Host string `yaml:"host"`
	} `yaml:"docker"`

	Proxmox struct {
		BaseURL     string `yaml:"base_url"`
		TokenID     string `yaml:"token_id"`
		TokenSecret string `yaml:"token_secret"`
		InsecureTLS bool   `yaml:"insecure_tls"`
		NodeName    string `yaml:"node_name"`
	} `yaml:"proxmox"`

	Inventory Inventory `yaml:"inventory"`

	APIKey string `yaml:"api_key"`
}

type Inventory struct {
	Ingress IngressConfig  `yaml:"ingress"`
	Servers []ServerConfig `yaml:"servers"`
}

type IngressConfig struct {
	ID   string `yaml:"id"`
	Name string `yaml:"name"`
	IP   string `yaml:"ip"`
}

type ServerConfig struct {
	ID          string            `yaml:"id"`
	Name        string            `yaml:"name"`
	IP          string            `yaml:"ip"`
	ExporterJob string            `yaml:"exporter_job"`
	Containers  []ContainerConfig `yaml:"containers"`
}

type ContainerConfig struct {
	Ref    string            `yaml:"ref"`
	Labels map[string]string `yaml:"labels,omitempty"`
}

func Load() *Config {
	_ = godotenv.Load()

	data, err := os.ReadFile("config.yaml")
	if err != nil {
		panic(err)
	}

	content := os.ExpandEnv(string(data))

	var cfg Config
	if err := yaml.Unmarshal([]byte(content), &cfg); err != nil {
		panic(err)
	}
	return &cfg
}
